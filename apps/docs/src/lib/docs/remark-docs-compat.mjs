/**
 * remark-docs-compat: lets the docs content (apps/docs/content, in its own
 * MDX conventions: absolute /snippets imports, docs heading slugs) compile
 * with Fumadocs MDX unchanged.
 *
 * - Snippets: `import X from "/snippets/a/b.mdx"` plus `<X />` in the page.
 *   Each `<X />` is replaced by the snippet's own MDX tree (parsed with this
 *   processor, so its JSX, fences and headings are handled like the page's)
 *   and the import is dropped. The page compiles as one document: headings
 *   from snippets reach the TOC, and the processed Markdown (`.md` twins,
 *   llms-full.txt) contains the snippet text, as it did before.
 *   Snippets may import other snippets; those are inlined the same way.
 * - Component imports: `import { X } from "/snippets/x.jsx"` names a
 *   component that this app provides in the docs MDX components
 *   (components/docs/docs-components.tsx). The import is dropped, so `<X>`
 *   resolves to the real component here.
 * - Heading ids follow the slugs the docs have always published (kept by
 *   `docsSlug`, used through remarkHeading's `slug` option in
 *   source.config.ts), so existing #anchors keep working.
 * - `<LegacyWeb3jsNotice />` becomes the notice on `@solana/web3.js` 1.x
 *   code (see expandLegacyWeb3jsNotices below).
 * - `<Steps codePanel>` and `panel` fence marks are checked and left out of
 *   the Markdown output (see codePanelMarks below).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { VFile } from "vfile";
import {
  embedSource,
  replaceSource,
} from "fumadocs-core/mdx-plugins/stringifier";
import { findDocsRoot } from "./docs-root.mjs";
import { smartQuotes } from "./smart-quotes.mjs";

const SNIPPET_PREFIX = "/snippets/";

function snippetsDir() {
  return path.join(findDocsRoot(), "snippets");
}

/** Default imports from /snippets/*.mdx in one mdxjsEsm node. */
function snippetImports(node) {
  const found = [];
  const body = node.data?.estree?.body ?? [];
  for (const statement of body) {
    if (statement.type !== "ImportDeclaration") continue;
    const source = String(statement.source?.value ?? "");
    if (!source.startsWith(SNIPPET_PREFIX) || !source.endsWith(".mdx"))
      continue;
    for (const spec of statement.specifiers ?? []) {
      if (spec.type === "ImportDefaultSpecifier")
        found.push({ name: spec.local.name, source, statement });
    }
  }
  return found;
}

function removeStatements(node, statements) {
  const body = node.data.estree.body.filter((s) => !statements.includes(s));
  node.data.estree.body = body;
  // Keep the source text in step with the estree for the Markdown output.
  node.value = node.value
    .split("\n")
    .filter(
      (line) =>
        !/^\s*import\s+\w+\s+from\s+["']\/snippets\/[^"']+\.mdx["'];?\s*$/.test(
          line,
        ),
    )
    .join("\n");
  return body.length === 0;
}

/**
 * MDX's own "unravel" step (paragraphs that hold only JSX and whitespace
 * become the JSX itself) runs before this plugin, so inlined snippet trees
 * get it here (same rule as @mdx-js/mdx and Fumadocs' include).
 */
function unravel(node) {
  if (!node.children) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === "paragraph") {
      let jsx = false;
      let only = true;
      for (const c of child.children) {
        if (c.type === "mdxJsxTextElement" || c.type === "mdxTextExpression")
          jsx = true;
        else if (!(c.type === "text" && !c.value.trim())) {
          only = false;
          break;
        }
      }
      if (only && jsx) {
        const kids = child.children
          .filter((c) => !(c.type === "text" && /^[\t\r\n ]+$/.test(c.value)))
          .map((c) => {
            if (c.type === "mdxJsxTextElement") c.type = "mdxJsxFlowElement";
            if (c.type === "mdxTextExpression") c.type = "mdxFlowExpression";
            return c;
          });
        node.children.splice(i, 1, ...kids);
        i -= 1; // visit the unwrapped elements next
        continue;
      }
    }
    unravel(child);
  }
}

/** A JSX comment expression: renders nothing, and is left out of the Markdown. */
function isComment(node) {
  return (
    node.type === "mdxFlowExpression" &&
    /^\s*\/\*[\s\S]*\*\/\s*$/.test(node.value ?? "")
  );
}

function isSnippetElement(node, names) {
  return (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    names.has(node.name)
  );
}

/**
 * Replace every <Name /> whose Name is a snippet import with the snippet
 * tree. `seen` guards against import cycles.
 */
function inlineSnippets(processor, tree, file, seen = new Set(), root = file) {
  const imports = new Map();
  const emptyEsm = new Set();
  for (const node of tree.children) {
    if (node.type !== "mdxjsEsm") continue;
    const found = snippetImports(node);
    if (!found.length) continue;
    for (const item of found) imports.set(item.name, item.source);
    // The Markdown output (remarkLLMs) is built from the authored source:
    // drop the snippet imports there too.
    if (found.length === (node.data?.estree?.body ?? []).length)
      replaceSource(root, node, "");
    if (
      removeStatements(
        node,
        found.map((f) => f.statement),
      )
    )
      emptyEsm.add(node);
  }
  if (emptyEsm.size)
    tree.children = tree.children.filter((n) => !emptyEsm.has(n));
  if (!imports.size) return;

  const names = new Set(imports.keys());
  const cache = new Map();
  const load = (name) => {
    const source = imports.get(name);
    if (cache.has(source)) {
      const hit = cache.get(source);
      return { parsed: structuredClone(hit.parsed), value: hit.value };
    }
    const abs = path.join(snippetsDir(), source.slice(SNIPPET_PREFIX.length));
    if (seen.has(abs)) throw new Error(`snippet import cycle at ${abs}`);
    const value = readFileSync(abs, "utf8");
    file.data?._compiler?.addDependency?.(abs);
    const child = new VFile({ path: abs, value, data: file.data });
    const parsed = processor.parse(child);
    rejectCodePanelMarks(parsed, child);
    unravel(parsed);
    inlineSnippets(processor, parsed, child, new Set([...seen, abs]), root);
    cache.set(source, { parsed, value });
    return { parsed: structuredClone(parsed), value };
  };

  const visit = (parent) => {
    if (!parent.children) return;
    for (let i = 0; i < parent.children.length; i++) {
      const node = parent.children[i];
      if (isSnippetElement(node, names)) {
        const { parsed: snippet, value } = load(node.name);
        // ESM (imports/exports a snippet declares) moves to the page root.
        const esm = snippet.children.filter((n) => n.type === "mdxjsEsm");
        const content = snippet.children.filter(
          (n) => n.type !== "mdxjsEsm" && !isComment(n),
        );
        if (esm.length) tree.children.unshift(...esm);
        let replacement = content;
        if (node.type === "mdxJsxTextElement") {
          // Inline use: unwrap a single paragraph so the text stays inline.
          replacement =
            content.length === 1 && content[0].type === "paragraph"
              ? content[0].children
              : content;
        }
        // The Markdown output shows the snippet's own text in its place.
        embedSource(root, node, value, replacement);
        parent.children.splice(i, 1, ...replacement);
        i += replacement.length - 1;
        continue;
      }
      visit(node);
    }
  };
  visit(tree);
}

/** Drop `/snippets/*.jsx` imports (component imports, see above). */
function dropStandInImports(tree) {
  const isStandIn = (statement) =>
    statement.type === "ImportDeclaration" &&
    String(statement.source?.value ?? "").startsWith(SNIPPET_PREFIX) &&
    String(statement.source?.value ?? "").endsWith(".jsx");
  tree.children = tree.children.filter((node) => {
    if (node.type !== "mdxjsEsm" || !node.data?.estree) return true;
    const body = node.data.estree.body;
    if (!body.some(isStandIn)) return true;
    node.data.estree.body = body.filter((s) => !isStandIn(s));
    node.value = node.value
      .split("\n")
      .filter(
        (line) =>
          !/^\s*import\s.*from\s+["']\/snippets\/[^"']+\.jsx["'];?\s*$/.test(
            line,
          ),
      )
      .join("\n");
    return node.data.estree.body.length > 0;
  });
}

/**
 * `<LegacyWeb3jsNotice />` marks code written for `@solana/web3.js` 1.x (the
 * "Web3.js (legacy)" tabs, fences and sections). It becomes this `<Warning>`
 * at compile time, so the HTML, search and the Markdown twin (`.md`,
 * llms-full.txt) all carry the same text. Pages put the tag where the legacy
 * code starts; generated example snippets put it in their legacy tabs, and it
 * is expanded after those snippets are inlined. The wording follows the
 * solana-web3.js README ("no longer actively maintained and receives critical
 * fixes only"); 1.x is not deprecated on npm.
 */
const LEGACY_WEB3JS_NOTICE = "LegacyWeb3jsNotice";
export const LEGACY_WEB3JS_NOTICE_SOURCE = `<Warning>
  **\`@solana/web3.js\` 1.x is no longer actively maintained**

  It receives critical fixes only. Use [Kit](/developers/docs/clients/official/javascript#solana-kit) for new code. To migrate existing code, follow the [Kit upgrade guide](https://www.solanakit.com/docs/upgrade-guide), or the [web3.js v3 migration guide](https://github.com/solana-foundation/solana-web3.js/blob/main/docs/web3js-v1-to-v3-migration.md) to keep the class-based API.
</Warning>`;

function isLegacyNotice(node) {
  return (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name === LEGACY_WEB3JS_NOTICE
  );
}

/** Replace every <LegacyWeb3jsNotice /> (snippets already inlined). */
function expandLegacyWeb3jsNotices(processor, tree, file) {
  let parsed;
  const notice = () => {
    if (!parsed) {
      parsed = processor.parse(
        new VFile({ path: file.path, value: LEGACY_WEB3JS_NOTICE_SOURCE }),
      );
      unravel(parsed);
    }
    return structuredClone(parsed.children);
  };
  const visit = (parent) => {
    if (!parent.children) return;
    for (let i = 0; i < parent.children.length; i++) {
      const node = parent.children[i];
      if (isLegacyNotice(node)) {
        if (node.type === "mdxJsxTextElement")
          throw new Error(
            `${file.path}: put <${LEGACY_WEB3JS_NOTICE} /> on a line of its own`,
          );
        const content = notice();
        embedSource(file, node, LEGACY_WEB3JS_NOTICE_SOURCE, content);
        parent.children.splice(i, 1, ...content);
        i += content.length - 1;
        continue;
      }
      visit(node);
    }
  };
  visit(tree);
}

/**
 * `<Steps codePanel>` and the fences marked `panel` in it (Steps in
 * components/docs/docs-components.tsx, AUTHORING.md). Both are layout hints:
 * they stay in the tree for the components and are cut from the Markdown
 * output (.md twins, llms-full.txt), so the twin reads as the page did.
 */
const isPanelMark = (n) =>
  n.type === "code" && /(^|\s)panel(\s|$)/.test(n.meta ?? "");
const codePanelAttr = (n) =>
  n.type === "mdxJsxFlowElement" && n.name === "Steps"
    ? n.attributes.find(
        (a) => a.type === "mdxJsxAttribute" && a.name === "codePanel",
      )
    : undefined;
const at = (file, node) => `${file.path}:${node.position?.start.line ?? "?"}`;

function codePanelMarks(tree, file) {
  const src = String(file);
  const cut = (start, end) =>
    replaceSource(
      file,
      { position: { start: { offset: start }, end: { offset: end } } },
      "",
    );
  const isStep = (n) => n.type === "mdxJsxFlowElement" && n.name === "Step";
  const visit = (node) => {
    for (const child of node.children ?? []) {
      if (isPanelMark(child))
        throw new Error(
          `${at(file, child)}: a fence marked "panel" must be directly in a <Step> of <Steps codePanel>`,
        );
      const attr = codePanelAttr(child);
      if (!attr) {
        visit(child);
        continue;
      }
      if (node !== tree)
        throw new Error(
          `${at(file, child)}: <Steps codePanel> must be at the top level of the page`,
        );
      let start = attr.position.start.offset;
      while (start > 0 && /[ \t]/.test(src[start - 1])) start--;
      cut(start, attr.position.end.offset);
      for (const step of child.children ?? []) {
        const kids = isStep(step) ? (step.children ?? []) : [];
        const marks = kids.flatMap((k, i) => (isPanelMark(k) ? [i] : []));
        if (marks.length && marks.at(-1) - marks[0] !== marks.length - 1)
          throw new Error(
            `${at(file, kids[marks[0]])}: the fences marked "panel" in a step must be next to each other`,
          );
        for (const i of marks) {
          const k = kids[i];
          const s = k.position.start.offset;
          const m = /(^|\s)panel$/.test(k.meta)
            ? src
                .slice(s, src.indexOf("\n", s))
                .match(/[ \t]+panel[ \t]*(?=\r?$)/)
            : null;
          if (!m)
            throw new Error(
              `${at(file, k)}: put "panel" last in the fence meta`,
            );
          cut(s + m.index, s + m.index + m[0].length);
        }
        // The rest is checked as any other content: the step's other
        // children, and whatever sits in the list outside a <Step>.
        visit({
          children: isStep(step) ? kids.filter((k) => !isPanelMark(k)) : [step],
        });
      }
    }
  };
  visit(tree);
}

/** Snippets carry no code panel markers: they are neither checked nor cut. */
function rejectCodePanelMarks(node, file) {
  for (const child of node.children ?? []) {
    if (isPanelMark(child) || codePanelAttr(child))
      throw new Error(
        `${at(file, child)}: <Steps codePanel> and "panel" marks are not allowed in snippets`,
      );
    rejectCodePanelMarks(child, file);
  }
}

function hasApiExamples(node) {
  if (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    (node.name === "RequestExample" || node.name === "ResponseExample")
  )
    return true;
  return (node.children ?? []).some(hasApiExamples);
}

export function remarkDocsCompat() {
  const processor = this;
  return (tree, file) => {
    // First, so it sees only the page's own nodes (positions in its source).
    codePanelMarks(tree, file);
    for (const node of tree.children)
      if (isComment(node)) replaceSource(file, node, "");
    inlineSnippets(processor, tree, file);
    // After inlining, so notices in generated snippets are expanded too.
    expandLegacyWeb3jsNotices(processor, tree, file);
    // After inlining, so stand-ins imported by snippets go too.
    dropStandInImports(tree);
    // RPC method pages: the page shows its examples in a column of their own.
    if (hasApiExamples(tree)) {
      file.data["mdx-export"] ??= [];
      file.data["mdx-export"].push({ name: "apiExamples", value: true });
    }
  };
}

/**
 * Heading slugs as the docs have published them: lower case; spaces and
 * dots become hyphens; letters, digits, `-`, `_` and a few symbols are
 * kept (/ & + # @ ’ “ ” → and full-width ？ ：), all other punctuation and
 * emoji are dropped; runs of hyphens collapse. Inside inline code an
 * opening parenthesis separates words (`useTheme(theme)` -> usetheme-theme).
 * Repeats on one page get -2, -3, ...
 */
const KEEP = /[\p{L}\p{N}\-_’/&+”“→？#@：\s.]/u;

export function docsSlugBase(text) {
  // Slugs are made from the rendered (typographic) heading text.
  let s = smartQuotes(text).toLowerCase().trim();
  s = [...s].filter((c) => KEEP.test(c)).join("");
  return s.replace(/[\s.]+/g, "-").replace(/-+/g, "-");
}

function headingText(node) {
  if (node.type === "inlineCode") return node.value.replace(/\(/g, " ");
  if (node.type === "text") return node.value;
  if (node.children) return node.children.map(headingText).join("");
  return "";
}

const counters = new WeakMap();

export function docsSlug(root, heading) {
  let used = counters.get(root);
  if (!used) {
    used = new Map();
    counters.set(root, used);
  }
  const base = docsSlugBase(headingText(heading));
  const n = (used.get(base) ?? 0) + 1;
  used.set(base, n);
  return n === 1 ? base : `${base}-${n}`;
}
