/**
 * Source-preserving MDX AST codec (generator `--sync`, verify checks).
 *
 * parse:     unified + remark-parse + remark-frontmatter(yaml) + remark-gfm +
 *            remark-mdx (remark-mdx is skipped for `.md` files). Frontmatter
 *            is parsed with `yaml` and returned as a plain object.
 * stringify: source-preserving. Every node remembers its original source
 *            range and a structural fingerprint. On output:
 *            - a node whose fingerprint is unchanged is copied byte-for-byte
 *              from the source, so an unchanged file round-trips identically
 *              and an edit only rewrites the nodes it touched;
 *            - `root`, JSX elements and phrasing containers whose children
 *              changed are *spliced*: original gaps between untouched
 *              siblings are kept and only changed or new children are
 *              serialized. A renamed JSX element (or changed attributes) only
 *              regenerates its opening and closing tags;
 *            - anything else that changed is serialized with remark-stringify
 *              (prettier-compatible options below), reusing the original
 *              text of any untouched descendants.
 *
 * Escape hatch for editors: a node `{ type: "raw", value }` is emitted
 * verbatim (flow or phrasing). Prefer real mdast nodes; use `raw` only for
 * syntax mdast cannot express.
 *
 * Edit the frontmatter object, never the `yaml` node: the codec rewrites the
 * yaml node from the object (changed keys only, through a `yaml` Document so
 * comments and untouched keys keep their formatting).
 */
import { createHash } from "node:crypto";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";
import YAML from "yaml";
import type { Root } from "mdast";
import type { AstNode } from "../types.ts";

/** Parse/serialize pair. */
export interface Codec {
  name: string;
  parse(
    source: string,
    file?: { path: string },
  ): { tree: AstNode; frontmatter: Record<string, unknown> };
  stringify(tree: AstNode, frontmatter: Record<string, unknown>): string;
}

/**
 * remark-stringify options for newly generated markdown (prettier style,
 * except `*` emphasis: `_` cannot open/close intraword, e.g. next to CJK).
 */
export const STRINGIFY_OPTIONS = {
  bullet: "-",
  bulletOther: "*",
  emphasis: "*",
  strong: "*",
  fence: "`",
  fences: true,
  rule: "-",
  listItemIndent: "one",
  incrementListMarker: true,
  handlers: {
    raw: (node: { value?: unknown }) => String(node.value ?? ""),
  },
} as const;

function makeProcessor(mdx: boolean) {
  const p = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkGfm);
  // `.md` pages are plain markdown: `<` and `{` are text, not JSX/expressions.
  const withMdx = mdx ? p.use(remarkMdx) : p;
  return withMdx.use(remarkStringify, STRINGIFY_OPTIONS as never);
}

let mdxProcessor: ReturnType<typeof makeProcessor> | undefined;
let mdProcessor: ReturnType<typeof makeProcessor> | undefined;
function processorFor(path: string | undefined) {
  if (path && /\.md$/i.test(path))
    return (mdProcessor ??= makeProcessor(false));
  return (mdxProcessor ??= makeProcessor(true));
}

// ---------------------------------------------------------------------------
// Fingerprints
// ---------------------------------------------------------------------------

const SKIP_KEYS = new Set(["children", "position", "data"]);

/** Own (non-children) props, ignoring positions and `data` (estree etc.). */
function selfFingerprint(node: AstNode): string {
  const own: Record<string, unknown> = {};
  for (const k of Object.keys(node).sort()) {
    if (!SKIP_KEYS.has(k)) own[k] = node[k];
  }
  return JSON.stringify(own, (key, value) =>
    key === "position" || key === "data" ? undefined : value,
  );
}

function fingerprint(node: AstNode, memo: Map<AstNode, string>): string {
  const hit = memo.get(node);
  if (hit !== undefined) return hit;
  const h = createHash("sha1").update(selfFingerprint(node));
  for (const c of node.children ?? [])
    h.update("\0").update(fingerprint(c, memo));
  const fp = h.digest("base64");
  memo.set(node, fp);
  return fp;
}

// ---------------------------------------------------------------------------
// Per-document state
// ---------------------------------------------------------------------------

interface Origin {
  start: number;
  end: number;
  /** Column (0-based) the node starts at; continuation lines carry it. */
  col: number;
  /** Every continuation line has >= `col` leading whitespace (or is blank). */
  movable: boolean;
  fp: string;
  self: string;
  /** JSX only: the element name and attributes as parsed. */
  jsxName?: string | null;
  attrs?: string;
  parent: AstNode | null;
  /** Every original child has a source range (required for splicing). */
  kidsPositioned: boolean;
  kids: AstNode[];
  kidIndex: Map<AstNode, number>;
}

interface DocState {
  source: string;
  path?: string;
  origins: WeakMap<AstNode, Origin>;
  frontmatterSnapshot: string;
}

const docs = new WeakMap<AstNode, DocState>();

interface Pos {
  start?: { offset?: number; column?: number };
  end?: { offset?: number };
}

function recordOrigins(
  node: AstNode,
  parent: AstNode | null,
  source: string,
  origins: WeakMap<AstNode, Origin>,
  memo: Map<AstNode, string>,
) {
  const pos = node.position as Pos | undefined;
  const kids = node.children ?? [];
  for (const c of kids) recordOrigins(c, node, source, origins, memo);
  const start = parent === null ? 0 : pos?.start?.offset;
  const end = parent === null ? source.length : pos?.end?.offset;
  if (start === undefined || end === undefined) return;
  const col = parent === null ? 0 : Math.max(0, (pos?.start?.column ?? 1) - 1);
  const text = source.slice(start, end);
  const movable = text
    .split("\n")
    .slice(1)
    .every((line) => /^\s*$/.test(line) || leadingWs(line) >= col);
  origins.set(node, {
    start,
    end,
    col,
    movable,
    fp: fingerprint(node, memo),
    self: selfFingerprint(node),
    ...(JX(node)
      ? {
          jsxName: (node.name as string | null) ?? null,
          attrs: attrsFingerprint(node),
        }
      : {}),
    parent,
    kidsPositioned: kids.every((k) => origins.has(k)),
    kids: [...kids],
    kidIndex: new Map(kids.map((k, i) => [k, i])),
  });
}

function attrsFingerprint(node: AstNode): string {
  return JSON.stringify(node.attributes ?? [], (key, value) =>
    key === "position" || key === "data" ? undefined : value,
  );
}

/**
 * Name-only change of a JSX element (attributes untouched): swap the names
 * in the original text so attribute formatting and expressions stay exact.
 */
function renameOpen(text: string, from: string, to: string): string | null {
  if (!text.startsWith(`<${from}`)) return null;
  const after = text.charAt(from.length + 1);
  if (after && !/[\s/>{]/.test(after)) return null;
  return `<${to}${text.slice(from.length + 1)}`;
}

function renameClose(text: string, from: string, to: string): string | null {
  const close = `</${from}>`;
  return text.endsWith(close)
    ? `${text.slice(0, -close.length)}</${to}>`
    : null;
}

function renameJsx(text: string, from: string, to: string): string | null {
  const opened = renameOpen(text, from, to);
  if (opened === null) return null;
  if (/\/>$/.test(opened)) return opened;
  return renameClose(opened, from, to);
}

function leadingWs(line: string): number {
  return line.length - line.trimStart().length;
}

// ---------------------------------------------------------------------------
// Frontmatter
// ---------------------------------------------------------------------------

function findYaml(tree: AstNode): AstNode | undefined {
  const first = tree.children?.[0];
  return first?.type === "yaml" ? first : undefined;
}

function syncFrontmatter(
  tree: AstNode,
  frontmatter: Record<string, unknown>,
  state: DocState,
) {
  if (JSON.stringify(frontmatter) === state.frontmatterSnapshot) return;
  const yamlNode = findYaml(tree);
  const before = JSON.parse(state.frontmatterSnapshot) as Record<
    string,
    unknown
  >;
  const original = typeof yamlNode?.value === "string" ? yamlNode.value : "";
  const value =
    rewriteYamlBlocks(original, before, frontmatter) ??
    rewriteYamlDocument(original, before, frontmatter);
  const empty = Object.keys(frontmatter).length === 0;
  if (yamlNode) {
    if (empty) tree.children!.splice(0, 1);
    else yamlNode.value = value;
  } else if (!empty) {
    (tree.children ??= []).unshift({ type: "yaml", value });
  }
}

/** `og:title` -> `"og:title"`; plain identifiers stay bare. */
function yamlKey(k: string): string {
  return /^[A-Za-z_][\w-]*$/.test(k) ? k : JSON.stringify(k);
}

/** One `key: value` entry, value rendered by `yaml` (default 80 columns). */
export function renderYamlEntry(k: string, v: unknown): string {
  const doc = new YAML.Document({ x: v });
  const out = doc.toString().replace(/\n+$/, "");
  return yamlKey(k) + out.slice(1);
}

/**
 * Line-local frontmatter rewrite: the YAML text is split into top-level
 * entries (a key line plus its indented continuation lines; comments and
 * blank lines stay with the entry that follows them). Untouched entries are
 * copied byte for byte, so folded `description: >-` scalars and multi-line
 * plain scalars keep their line breaks; changed entries are re-rendered in
 * place; deleted entries are removed; new keys are appended in object
 * order. Returns undefined when the text cannot be split safely (the
 * caller then falls back to a `yaml` Document rewrite).
 */
export function rewriteYamlBlocks(
  original: string,
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): string | undefined {
  const lines = original.split("\n");
  const blocks: { key: string | undefined; lines: string[] }[] = [];
  let pending: string[] = [];
  for (const line of lines) {
    const top = line !== "" && !/^[\s#]/.test(line) && !line.startsWith("---");
    if (top) {
      blocks.push({ key: undefined, lines: [...pending, line] });
      pending = [];
    } else if (
      blocks.length &&
      /^\s+\S/.test(line) &&
      pending.every((l) => l.trim() === "")
    ) {
      // Continuation line (blank lines inside block scalars included).
      blocks[blocks.length - 1]!.lines.push(...pending, line);
      pending = [];
    } else {
      pending.push(line);
    }
  }
  const seen = new Set<string>();
  for (const b of blocks) {
    let parsed: unknown;
    try {
      parsed = YAML.parse(b.lines.join("\n"));
    } catch {
      return undefined;
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return undefined;
    const keys = Object.keys(parsed);
    if (keys.length !== 1 || seen.has(keys[0]!)) return undefined;
    b.key = keys[0]!;
    seen.add(b.key);
    if (
      JSON.stringify((parsed as Record<string, unknown>)[b.key]) !==
      JSON.stringify(before[b.key])
    )
      return undefined;
  }
  if (seen.size !== Object.keys(before).length) return undefined;
  const out: string[] = [];
  for (const b of blocks) {
    const k = b.key!;
    if (JSON.stringify(after[k]) === JSON.stringify(before[k])) {
      out.push(...b.lines);
      continue;
    }
    // Leading comment lines stay (also for a deleted key); the entry itself
    // is replaced or removed.
    let i = 0;
    while (
      i < b.lines.length &&
      (b.lines[i] === "" || /^\s*#/.test(b.lines[i]!))
    )
      i++;
    out.push(...b.lines.slice(0, i).filter((l) => l !== ""));
    if (k in after) out.push(renderYamlEntry(k, after[k]));
  }
  for (const [k, v] of Object.entries(after)) {
    if (!seen.has(k)) out.push(renderYamlEntry(k, v));
  }
  out.push(...pending.filter((l) => l !== ""));
  return out.join("\n").replace(/\n+$/, "");
}

/** Fallback: rewrite through a `yaml` Document (changed keys only). */
function rewriteYamlDocument(
  original: string,
  before: Record<string, unknown>,
  frontmatter: Record<string, unknown>,
): string {
  const doc = YAML.parseDocument(original);
  if (!doc.contents) doc.contents = doc.createNode({}) as never;
  for (const k of Object.keys(before)) {
    if (!(k in frontmatter)) doc.delete(k);
  }
  for (const [k, v] of Object.entries(frontmatter)) {
    if (JSON.stringify(before[k]) !== JSON.stringify(v)) doc.set(k, v);
  }
  return doc.toString({ lineWidth: 80 }).replace(/\n+$/, "");
}

// ---------------------------------------------------------------------------
// Stringify
// ---------------------------------------------------------------------------

/** Containers whose children may be spliced (gaps hold no line prefixes). */
const FLOW_SPLICE = new Set(["root", "mdxJsxFlowElement"]);
const PHRASING_SPLICE = new Set([
  "paragraph",
  "heading",
  "emphasis",
  "strong",
  "delete",
  "link",
  "linkReference",
  "tableCell",
  "mdxJsxTextElement",
]);
const JSX = new Set(["mdxJsxFlowElement", "mdxJsxTextElement"]);
const MARK = "\uE000";
const PHRASING_TYPES = new Set([
  "text",
  "emphasis",
  "strong",
  "delete",
  "inlineCode",
  "break",
  "link",
  "linkReference",
  "image",
  "imageReference",
  "footnoteReference",
  "mdxJsxTextElement",
  "mdxTextExpression",
]);
const NO_SHIELD = new Set(["listItem", "tableRow", "tableCell"]);

interface Emitted {
  text: string;
  /** Indentation frame of continuation lines (0 = fresh output). */
  col: number;
}

/** Move continuation lines from frame `fromCol` to indentation `to`. */
function rebase(text: string, fromCol: number, to: string): string {
  if (fromCol === to.length) return text;
  const lines = text.split("\n");
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!;
    if (/^\s*$/.test(line)) {
      lines[i] = "";
      continue;
    }
    const stripped = line.slice(Math.min(fromCol, leadingWs(line)));
    lines[i] = to + stripped;
  }
  return lines.join("\n");
}

class Emitter {
  readonly memo = new Map<AstNode, string>();
  /** Escaping context for the next fresh phrasing node (see splice). */
  lineStart = true;
  constructor(
    readonly state: DocState,
    readonly reuse: boolean,
  ) {}

  origin(node: AstNode): Origin | undefined {
    return this.reuse ? this.state.origins.get(node) : undefined;
  }

  emit(node: AstNode): Emitted {
    const o = this.origin(node);
    if (o && fingerprint(node, this.memo) === o.fp) {
      return { text: this.state.source.slice(o.start, o.end), col: o.col };
    }
    const renamed = o && this.renameOnly(node, o);
    if (renamed) return { text: renamed, col: o.col };
    if (o && this.canSplice(node, o)) {
      return { text: this.splice(node, o), col: o.col };
    }
    return { text: this.fresh(node), col: 0 };
  }

  /** Whole-element text when only a JSX name changed and nothing inside. */
  renameOnly(node: AstNode, o: Origin): string | null {
    if (!JX(node) || typeof node.name !== "string" || !o.jsxName) return null;
    if (attrsFingerprint(node) !== o.attrs) return null;
    const kids = node.children ?? [];
    if (kids.length !== o.kids.length) return null;
    for (let i = 0; i < kids.length; i++) {
      const ko = this.origin(kids[i]!);
      if (
        kids[i] !== o.kids[i] ||
        !ko ||
        fingerprint(kids[i]!, this.memo) !== ko.fp
      )
        return null;
    }
    const src = this.state.source.slice(o.start, o.end);
    return renameJsx(src, o.jsxName, node.name);
  }

  canSplice(node: AstNode, o: Origin): boolean {
    const kids = node.children;
    if (!kids?.length || o.kids.length === 0 || !o.kidsPositioned) return false;
    if (!FLOW_SPLICE.has(node.type) && !PHRASING_SPLICE.has(node.type))
      return false;
    if (node.type === "root") return true;
    // Spliced nodes reuse their own head/tail text, so the node itself must
    // be unchanged unless it is JSX (tags are regenerated below).
    return JX(node) || selfFingerprint(node) === o.self;
  }

  splice(node: AstNode, o: Origin): string {
    const src = this.state.source;
    const first = this.state.origins.get(o.kids[0]!)!;
    const last = this.state.origins.get(o.kids[o.kids.length - 1]!)!;
    let head = src.slice(o.start, first.start);
    let tail = src.slice(last.end, o.end);
    if (JX(node) && selfFingerprint(node) !== o.self) {
      const name = node.name;
      const from = o.jsxName;
      const rename =
        attrsFingerprint(node) === o.attrs && from && typeof name === "string";
      const h = rename ? renameOpen(head, from, name) : null;
      const t = rename ? renameClose(tail, from, name) : null;
      if (h !== null && t !== null) {
        head = h;
        tail = t;
      } else {
        const [open, close] = this.jsxTags(node);
        head = open + (head.match(/\s*$/)?.[0] ?? "");
        tail = (tail.match(/^\s*/)?.[0] ?? "") + close;
      }
    }
    const flow = FLOW_SPLICE.has(node.type);
    const indent = " ".repeat(flow ? first.col : o.col);
    let out = head;
    let prev: AstNode | undefined;
    for (const child of node.children!) {
      const co = this.origin(child);
      const idx = co && co.parent === node ? o.kidIndex.get(child) : undefined;
      const prevIdx = prev !== undefined ? o.kidIndex.get(prev) : undefined;
      let inPlace = idx !== undefined;
      if (prev !== undefined) {
        if (
          idx !== undefined &&
          prevIdx !== undefined &&
          idx === prevIdx + 1 &&
          this.origin(prev)?.parent === node
        ) {
          out += src.slice(this.state.origins.get(prev)!.end, co!.start);
        } else {
          out += flow ? `\n\n${indent}` : "";
          inPlace = false;
        }
      } else if (idx !== 0) {
        inPlace = false;
      }
      // Fresh phrasing is escaped for its context: at a line start (e.g.
      // a leading `#` or space) or mid-line after the previous sibling.
      this.lineStart = flow || out === "" || out.endsWith("\n");
      out += this.place(child, inPlace, indent);
      prev = child;
    }
    return out + tail;
  }

  /** Text for `child` placed at `indent`; untouched in-place text is as-is. */
  place(child: AstNode, inPlace: boolean, indent: string): string {
    const co = this.origin(child);
    const e = this.emit(child);
    if (inPlace && co && e.col === co.col) return e.text;
    if (co && e.col !== indent.length && !co.movable) {
      return rebase(this.fresh(child), 0, indent);
    }
    return rebase(e.text, e.col, indent);
  }

  /** Regenerate `<Name attrs>` / `</Name>` for a JSX element. */
  jsxTags(node: AstNode): [string, string] {
    const flow = node.type === "mdxJsxFlowElement";
    const probe: AstNode = {
      ...node,
      children: flow
        ? [{ type: "paragraph", children: [{ type: "text", value: MARK }] }]
        : [{ type: "text", value: MARK }],
    };
    delete probe.position;
    const s = this.serialize(probe);
    const i = s.indexOf(MARK);
    return [s.slice(0, i).trimEnd(), s.slice(i + MARK.length).trimStart()];
  }

  /**
   * Serialize with remark-stringify. Descendants that still have an origin
   * are replaced by `raw` nodes holding their (rebased) original text, so
   * untouched code, tables, etc. inside a rewritten parent stay verbatim.
   */
  fresh(node: AstNode): string {
    const copy = {
      ...node,
      children: node.children?.map((c) => this.shield(c)),
    };
    return this.serialize(copy);
  }

  shield(node: AstNode): AstNode {
    const o = this.origin(node);
    // Handlers that read their parent (list items: marker/numbering; GFM
    // table rows/cells: alignment) are never shielded; their children are.
    if (o && o.movable && !NO_SHIELD.has(node.type)) {
      // Only context-free text: an untouched node, or a spliced container.
      // Anything else is serialized here, in its new parent's context.
      if (fingerprint(node, this.memo) === o.fp || this.canSplice(node, o)) {
        const e = this.emit(node);
        return { type: "raw", value: rebase(e.text, e.col, "") };
      }
    }
    if (!node.children) return node;
    const children = node.children.map((c, i) =>
      // GFM task items look for a real leading paragraph to put `[ ]` in.
      node.type === "listItem" && i === 0 && c.type === "paragraph"
        ? { ...c, children: c.children?.map((g) => this.shield(g)) }
        : this.shield(c),
    );
    return { ...node, children };
  }

  serialize(node: AstNode): string {
    const processor = processorFor(this.state.path);
    if (node.type === "root") return processor.stringify(node as never as Root);
    if (PHRASING_TYPES.has(node.type)) {
      // Phrasing output may itself end in "\n" (text, break): serialize it
      // inside a paragraph between markers and cut there. A leading marker
      // stands in for the previous sibling when not at a line start.
      const lead = this.lineStart ? [] : [{ type: "raw", value: MARK }];
      this.lineStart = true;
      const out = processor.stringify({
        type: "paragraph",
        children: [...lead, node, { type: "raw", value: MARK }],
      } as never as Root);
      return out.slice(
        lead.length ? out.indexOf(MARK) + MARK.length : 0,
        out.lastIndexOf(MARK),
      );
    }
    // Flow output never ends in "\n"; remark-stringify appends exactly one.
    return processor.stringify(node as never as Root).replace(/\n$/, "");
  }
}

function JX(node: AstNode) {
  return JSX.has(node.type);
}

function frontmatterOf(tree: AstNode): Record<string, unknown> {
  const y = findYaml(tree);
  if (!y || typeof y.value !== "string" || y.value.trim() === "") return {};
  const parsed: unknown = YAML.parse(y.value);
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? (parsed as Record<string, unknown>)
    : {};
}

export const mdxCodec: Codec = {
  name: "mdx",
  parse(source, file) {
    const tree = processorFor(file?.path).parse(source) as unknown as AstNode;
    const origins = new WeakMap<AstNode, Origin>();
    recordOrigins(tree, null, source, origins, new Map());
    const frontmatter = frontmatterOf(tree);
    docs.set(tree, {
      source,
      path: file?.path,
      origins,
      frontmatterSnapshot: JSON.stringify(frontmatter),
    });
    return { tree, frontmatter };
  },
  stringify(tree, frontmatter) {
    const state = docs.get(tree);
    if (!state) {
      // A tree the codec did not parse: plain remark-stringify.
      return new Emitter(
        { source: "", origins: new WeakMap(), frontmatterSnapshot: "{}" },
        false,
      ).emit(tree).text;
    }
    syncFrontmatter(tree, frontmatter, state);
    return new Emitter(state, true).emit(tree).text;
  },
};

/**
 * Serialize `tree` from the AST alone, ignoring the original source. Used by
 * tests to prove the fallback serializer is lossless (reparse is equal).
 */
export function stringifyFresh(tree: AstNode, path?: string): string {
  return new Emitter(
    { source: "", path, origins: new WeakMap(), frontmatterSnapshot: "{}" },
    false,
  ).emit(tree).text;
}

/** Structural fingerprint (positions and `data` ignored), for tests. */
export function treeFingerprint(tree: AstNode): string {
  return fingerprint(tree, new Map());
}
