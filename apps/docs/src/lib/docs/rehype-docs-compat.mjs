/**
 * rehype-docs-compat (runs before rehype-code):
 *
 * - Mermaid: each ```mermaid fence in the content is followed by its
 *   pre-rendered light/dark SVG pair (`<div className="sol-mermaid">`,
 *   written by docs-tooling's mermaid transform and scripts/render-mermaid.ts).
 *   The page shows the images; the fence stays in the source and in the
 *   Markdown twin (this runs on HTML only), but is not rendered. A fence
 *   without a figure after it is kept as a code block.
 * - Steps: every <Step> gets an anchor id from its title (as the docs have
 *   published them, unique on the page), and in <Steps titleSize="h2|h3">
 *   the title becomes a real heading, so it is listed in "On this page"
 *   under its section, as before. The Step component renders that heading
 *   as its title.
 * - Anchor aliases: headings also answer to the ids older links use (see
 *   anchorAliases below).
 */
import { docsSlugBase } from "./remark-docs-compat.mjs";
import { smartPunctuation, smartQuotes } from "./smart-quotes.mjs";
function isWhitespace(node) {
  return node.type === "text" && !node.value.trim();
}

function className(node) {
  const attr = node.attributes?.find?.(
    (a) => a.type === "mdxJsxAttribute" && a.name === "className",
  );
  return typeof attr?.value === "string" ? attr.value : "";
}

function isMermaidFence(node) {
  if (node.type !== "element" || node.tagName !== "pre") return false;
  const code = node.children?.[0];
  const cls = code?.properties?.className;
  return Array.isArray(cls) && cls.includes("language-mermaid");
}

function isMermaidFigure(node) {
  return (
    node?.type === "mdxJsxFlowElement" &&
    node.name === "div" &&
    /(^|\s)sol-mermaid(\s|$)/.test(className(node))
  );
}

function strip(parent) {
  if (!parent.children) return;
  parent.children = parent.children.filter((node, i, all) => {
    if (!isMermaidFence(node)) return true;
    let j = i + 1;
    while (j < all.length && isWhitespace(all[j])) j++;
    return !isMermaidFigure(all[j]);
  });
  for (const child of parent.children) strip(child);
}

function attr(node, name) {
  const a = node.attributes?.find?.(
    (x) => x.type === "mdxJsxAttribute" && x.name === name,
  );
  return typeof a?.value === "string" ? a.value : undefined;
}

function walk(node, visit) {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

function stepTitles(tree) {
  const used = new Map();
  walk(tree, (node) => {
    if (node.type === "element" && /^h[1-6]$/.test(node.tagName)) {
      const id = node.properties?.id;
      if (typeof id === "string") used.set(id, (used.get(id) ?? 0) + 1);
    }
  });
  const unique = (base) => {
    let id = base;
    let n = used.get(base) ?? 0;
    if (n > 0) {
      do id = `${base}-${++n}`;
      while (used.has(id));
    }
    used.set(base, n || 1);
    used.set(id, 1);
    return id;
  };
  walk(tree, (node) => {
    if (node.type !== "mdxJsxFlowElement" || node.name !== "Steps") return;
    const size = attr(node, "titleSize");
    for (const step of node.children ?? []) {
      if (step.type !== "mdxJsxFlowElement" || step.name !== "Step") continue;
      const title = attr(step, "title");
      if (!title) continue;
      const id = unique(docsSlugBase(title));
      step.attributes.push({
        type: "mdxJsxAttribute",
        name: "data-step-id",
        value: id,
      });
      if (size === "h2" || size === "h3") {
        step.children.unshift({
          type: "element",
          tagName: size,
          properties: { id, dataStepTitle: "" },
          children: [{ type: "text", value: title }],
        });
      }
    }
  });
}

const NO_QUOTES = new Set(["code", "pre", "kbd", "samp", "script", "style"]);

/** Typographic quotes, dashes and ellipses in text, outside code (smart-quotes.mjs). */
function quotes(node, state = { prev: "" }) {
  if (node.type === "text") {
    node.value = smartQuotes(
      smartPunctuation(node.value, state.prev),
      state.prev,
    );
    state.prev = node.value.slice(-1) || state.prev;
    return;
  }
  if (node.type === "element" && NO_QUOTES.has(node.tagName)) {
    state.prev = "x";
    return;
  }
  if (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    /^[A-Z]/.test(node.name ?? "") === false &&
    NO_QUOTES.has(node.name)
  )
    return;
  if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression")
    return;
  // Block boundaries reset the context.
  const block =
    node.type === "root" ||
    (node.type === "element" &&
      /^(p|h[1-6]|li|td|th|div|blockquote)$/.test(node.tagName)) ||
    node.type === "mdxJsxFlowElement";
  const inner = block ? { prev: "" } : state;
  for (const child of node.children ?? []) quotes(child, inner);
}

/**
 * Markdown images and tables (not JSX <img>/<table>): images get the docs'
 * rounded corners, tables are marked for the scrolling table frame.
 */
function markMarkdown(node) {
  if (node.type === "element" && node.tagName === "img") {
    const cls = node.properties.className ?? [];
    node.properties.className = [
      ...(Array.isArray(cls) ? cls : [cls]),
      "rounded",
    ];
  }
  if (node.type === "element" && node.tagName === "table")
    node.properties.dataMdTable = "";
  for (const child of node.children ?? []) markMarkdown(child);
}

/**
 * A heading's id as github-slugger makes it (before repeats are numbered):
 * lower case, every character but letters, marks, digits, `_`, `-` and
 * spaces dropped, spaces turned into hyphens. solana.com/docs published its
 * heading ids this way before this app, as GitHub does for Markdown.
 */
const GITHUB_STRIP = /[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu;

export function githubSlugBase(text) {
  return text.toLowerCase().replace(GITHUB_STRIP, "").replace(/ /g, "-");
}

/** github-slugger's numbering: repeats get -1, -2, ... (skipping taken ids). */
function githubSlugger() {
  const seen = new Map();
  return (text) => {
    const base = githubSlugBase(text);
    let slug = base;
    while (seen.has(slug)) {
      const n = seen.get(base) + 1;
      seen.set(base, n);
      slug = `${base}-${n}`;
    }
    seen.set(slug, 0);
    return slug;
  };
}

/** The heading's text as Markdown had it (text and inline code). */
function plainText(node) {
  if (node.type === "text") return node.value;
  if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression")
    return "";
  return (node.children ?? []).map(plainText).join("");
}

function isHeading(node) {
  return node.type === "element" && /^h[1-6]$/.test(node.tagName);
}

/**
 * Anchor aliases: ids that older links use for a heading, written to the
 * heading as `data-anchor-aliases` (the Heading component renders an empty
 * target for each, so `#alias` scrolls to the heading).
 *
 * - The github-slugger id, where it differs from the heading's id: the docs
 *   published "Fees & compute" as #fees--compute, so external deep links
 *   keep landing on their section. (Repeats are numbered -1, -2 by both, see
 *   docsSlug.)
 * - `anchorAliases` in the page's frontmatter (`old-id: current-id`), for
 *   headings and steps that were renamed. A `<Step>` target gets the
 *   attribute too (StepItem renders the targets).
 *
 * An alias that any element on the page already uses as its id is skipped,
 * so aliases never take an anchor from another section. Step titles were
 * not headings before, so they get no github-slugger alias.
 */
function anchorAliases(tree, file) {
  const taken = new Set();
  const headings = [];
  // id -> the heading or <Step> that renders aliases for it.
  const owners = new Map();
  walk(tree, (node) => {
    const id =
      node.type === "element"
        ? node.properties?.id
        : (attr(node, "id") ?? attr(node, "data-step-id"));
    if (typeof id === "string") taken.add(id);
    if (isHeading(node)) {
      headings.push(node);
      if (typeof id === "string" && !("dataStepTitle" in node.properties))
        owners.set(id, node);
    }
    if (
      node.type === "mdxJsxFlowElement" &&
      node.name === "Step" &&
      typeof id === "string"
    )
      owners.set(id, node);
  });
  const aliases = new Map();
  const add = (heading, alias) => {
    if (!alias || taken.has(alias)) return;
    taken.add(alias);
    aliases.set(heading, [...(aliases.get(heading) ?? []), alias]);
  };
  const slug = githubSlugger();
  for (const heading of headings) {
    const id = heading.properties?.id;
    if (typeof id !== "string" || "dataStepTitle" in heading.properties)
      continue;
    const alias = slug(plainText(heading).trim());
    if (alias !== id) add(heading, alias);
  }
  const renamed = file?.data?.frontmatter?.anchorAliases;
  if (renamed && typeof renamed === "object") {
    for (const [alias, target] of Object.entries(renamed)) {
      const owner = owners.get(target);
      if (owner) add(owner, alias);
    }
  }
  for (const [owner, ids] of aliases) {
    if (owner.type === "element")
      owner.properties.dataAnchorAliases = ids.join(" ");
    else
      owner.attributes.push({
        type: "mdxJsxAttribute",
        name: "data-anchor-aliases",
        value: ids.join(" "),
      });
  }
}

export function rehypeDocsCompat() {
  return (tree, file) => {
    strip(tree);
    stepTitles(tree);
    // Before quotes(): the github-slugger ids come from the source text.
    anchorAliases(tree, file);
    quotes(tree);
    markMarkdown(tree);
  };
}
