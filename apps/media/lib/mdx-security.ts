/**
 * Guards for editor-authored MDX.
 *
 * `next-mdx-remote/rsc` compiles MDX to JavaScript and executes it on the
 * server, so a post body is code. Content is reviewed in pull requests, but
 * preview deployments render it before review and an editor account can be
 * compromised. These helpers keep the authoring surface to markup:
 *
 * - `remarkRejectMdxCode` fails compilation when a document contains ESM
 *   (`import`/`export`) or a JavaScript expression that is not a plain
 *   literal. `autoPlay={false}`, `width={600}` and `{" "}` keep working;
 *   `{process.env.X}` and `export const x = …` do not.
 * - `parseLiteral` turns the base64 JavaScript literal that legacy
 *   `<Gallery images={…}>` content carries into data without evaluating it.
 * - `safeHref` and `isAllowedEmbedSrc` validate editor-supplied URLs before
 *   they reach `href` and `iframe src`.
 */

type EstreeNode = { type: string; [key: string]: unknown };

/** Expression node types that MDX produces for `{…}` and `import`/`export`. */
const ESM_NODE = "mdxjsEsm";
const EXPRESSION_NODES = new Set(["mdxFlowExpression", "mdxTextExpression"]);
const JSX_NODES = new Set(["mdxJsxFlowElement", "mdxJsxTextElement"]);

export class UnsafeMdxError extends Error {
  constructor(
    message: string,
    public readonly position?: { line: number; column: number },
  ) {
    super(
      position
        ? `${message} (line ${position.line}, column ${position.column})`
        : message,
    );
    this.name = "UnsafeMdxError";
  }
}

function isLiteralEstree(node: EstreeNode | null | undefined): boolean {
  if (!node) return false;
  switch (node.type) {
    case "Literal":
      return true;
    case "TemplateLiteral":
      return (node.expressions as EstreeNode[]).length === 0;
    case "UnaryExpression":
      return (
        (node.operator === "-" || node.operator === "+") &&
        isLiteralEstree(node.argument as EstreeNode)
      );
    case "ArrayExpression":
      return (node.elements as (EstreeNode | null)[]).every(
        (el) => el !== null && isLiteralEstree(el),
      );
    case "ObjectExpression":
      return (node.properties as EstreeNode[]).every(
        (p) =>
          p.type === "Property" &&
          p.computed === false &&
          p.kind === "init" &&
          isLiteralEstree(p.value as EstreeNode),
      );
    default:
      return false;
  }
}

/** The estree program MDX attaches to an expression node, if any. */
function programOf(node: Record<string, unknown>): EstreeNode | undefined {
  const data = node.data as { estree?: EstreeNode } | undefined;
  return data?.estree;
}

function isLiteralProgram(program: EstreeNode | undefined): boolean {
  if (!program) return false;
  const body = program.body as EstreeNode[];
  if (body.length === 0) return true; // `{}` or `{/* comment */}`
  const first = body[0];
  if (body.length !== 1 || !first || first.type !== "ExpressionStatement") {
    return false;
  }
  return isLiteralEstree(first.expression as EstreeNode);
}

function positionOf(node: Record<string, unknown>) {
  const start = (node.position as { start?: { line: number; column: number } })
    ?.start;
  return start ? { line: start.line, column: start.column } : undefined;
}

/**
 * remark plugin: reject ESM and non-literal expressions in editor MDX.
 * Throws `UnsafeMdxError`, which `next-mdx-remote` surfaces as a compile
 * failure for that document only.
 */
export function remarkRejectMdxCode() {
  return (tree: unknown) => {
    const visit = (node: Record<string, unknown>) => {
      if (node.type === ESM_NODE) {
        throw new UnsafeMdxError(
          "import and export statements are not allowed in content",
          positionOf(node),
        );
      }
      if (EXPRESSION_NODES.has(node.type as string)) {
        if (!isLiteralProgram(programOf(node))) {
          throw new UnsafeMdxError(
            "JavaScript expressions are not allowed in content",
            positionOf(node),
          );
        }
      }
      if (JSX_NODES.has(node.type as string)) {
        for (const attr of (node.attributes ?? []) as Record<
          string,
          unknown
        >[]) {
          if (attr.type === "mdxJsxExpressionAttribute") {
            throw new UnsafeMdxError(
              "Spread attributes are not allowed in content",
              positionOf(node),
            );
          }
          const value = attr.value as Record<string, unknown> | string | null;
          if (
            value &&
            typeof value === "object" &&
            value.type === "mdxJsxAttributeValueExpression" &&
            !isLiteralProgram(programOf(value))
          ) {
            throw new UnsafeMdxError(
              `Attribute "${String(attr.name)}" must be a literal value`,
              positionOf(node),
            );
          }
        }
      }
      for (const child of (node.children ?? []) as Record<string, unknown>[]) {
        visit(child);
      }
    };
    visit(tree as Record<string, unknown>);
  };
}

/**
 * Parse a JavaScript literal (object/array/string/number/boolean/null, with
 * optionally unquoted identifier keys, single or double quotes and trailing
 * commas) into data without evaluating it. Returns `undefined` on anything
 * else, including identifiers, calls and template literals.
 */
export function parseLiteral(source: string): unknown {
  let i = 0;
  const s = source;
  const ws = () => {
    for (;;) {
      while (i < s.length && /\s/.test(s[i] ?? "")) i++;
      if (s.startsWith("//", i)) {
        while (i < s.length && s[i] !== "\n") i++;
      } else if (s.startsWith("/*", i)) {
        const end = s.indexOf("*/", i + 2);
        if (end === -1) throw new SyntaxError("unterminated comment");
        i = end + 2;
      } else {
        return;
      }
    }
  };
  const fail = (): never => {
    throw new SyntaxError(`unexpected token at ${i}`);
  };
  const str = (quote: string): string => {
    i++; // opening quote
    let out = "";
    while (i < s.length && s[i] !== quote) {
      if (s[i] === "\\") {
        const next = s[i + 1];
        const map: Record<string, string> = {
          n: "\n",
          t: "\t",
          r: "\r",
          b: "\b",
          f: "\f",
          v: "\v",
          "0": "\0",
        };
        if (next === "u") {
          out += String.fromCharCode(parseInt(s.slice(i + 2, i + 6), 16));
          i += 6;
        } else if (next === "x") {
          out += String.fromCharCode(parseInt(s.slice(i + 2, i + 4), 16));
          i += 4;
        } else {
          out += (next !== undefined ? map[next] : undefined) ?? next ?? "";
          i += 2;
        }
      } else {
        out += s[i++];
      }
    }
    if (s[i] !== quote) fail();
    i++;
    return out;
  };
  const value = (): unknown => {
    ws();
    const c = s[i];
    if (c === "{") {
      i++;
      const obj: Record<string, unknown> = {};
      for (;;) {
        ws();
        if (s[i] === "}") {
          i++;
          return obj;
        }
        let key: string;
        const q = s[i];
        if (q === '"' || q === "'") key = str(q);
        else {
          const m = /^[A-Za-z_$][\w$]*/.exec(s.slice(i));
          if (!m) fail();
          key = m![0];
          i += key.length;
        }
        if (key === "__proto__") fail();
        ws();
        if (s[i] !== ":") fail();
        i++;
        obj[key] = value();
        ws();
        if (s[i] === ",") i++;
        else if (s[i] !== "}") fail();
      }
    }
    if (c === "[") {
      i++;
      const arr: unknown[] = [];
      for (;;) {
        ws();
        if (s[i] === "]") {
          i++;
          return arr;
        }
        arr.push(value());
        ws();
        if (s[i] === ",") i++;
        else if (s[i] !== "]") fail();
      }
    }
    if (c === '"' || c === "'") return str(c);
    const num = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/.exec(s.slice(i));
    if (num) {
      i += num[0].length;
      return Number(num[0]);
    }
    for (const [word, val] of [
      ["true", true],
      ["false", false],
      ["null", null],
    ] as const) {
      if (s.startsWith(word, i) && !/[\w$]/.test(s[i + word.length] ?? "")) {
        i += word.length;
        return val;
      }
    }
    return fail();
  };
  try {
    const result = value();
    ws();
    if (i !== s.length) return undefined;
    return result;
  } catch {
    return undefined;
  }
}

/**
 * Only http(s) absolute URLs, root-relative paths, fragments and mailto are
 * allowed in editor-supplied links. Anything else renders without an href.
 */
export function safeHref(href: string | undefined | null): string | undefined {
  if (typeof href !== "string") return undefined;
  const trimmed = href.trim();
  if (!trimmed) return undefined;
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) return undefined;
  if (trimmed.startsWith("#")) return trimmed;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (/^mailto:[^\s]+$/i.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

/** Hosts editors may embed in an iframe block. */
export const EMBED_HOST_ALLOWLIST = [
  "www.youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "www.loom.com",
  "dune.com",
  "player.simplecast.com",
  "giphy.com",
  "www.figma.com",
  "codesandbox.io",
  "stackblitz.com",
  "open.spotify.com",
  "embed.podcasts.apple.com",
  "platform.twitter.com",
  "solana.com",
] as const;

export function isAllowedEmbedSrc(src: string | undefined | null): boolean {
  if (typeof src !== "string") return false;
  try {
    const url = new URL(src.trim());
    if (url.protocol !== "https:") return false;
    return (EMBED_HOST_ALLOWLIST as readonly string[]).includes(url.hostname);
  } catch {
    return false;
  }
}

/** Fixed permission policy for embeds; editors can no longer widen it. */
export const EMBED_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";

export const EMBED_SANDBOX =
  "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation allow-forms";
