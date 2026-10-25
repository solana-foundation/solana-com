/**
 * Shiki options for docs code blocks (Fumadocs rehype-code).
 *
 * Themes and markup follow the docs as they have always been: dual themes
 * github-light / github-dark-dimmed with the light colours inline and the
 * dark ones in `--shiki-dark` (html.dark swaps them, see docs CSS), and
 * `line-highlight` / `line-focus` classes on highlighted or focused lines.
 *
 * Fence meta keeps the syntax the content is written in:
 *   ```lang Title {1-3} highlight={4,6-7} focus={2} expandable wrap lines
 *   ```lang title="Title" ...
 * The parsed values become <pre> attributes (Shiki copies `meta` keys onto
 * the element): `title`, `data-highlight`, `data-focus`, `data-expandable`,
 * `data-wrap`, `data-lines`, `data-icon`. The MDX `pre` component
 * (CodeBlock in components/docs/docs-components.tsx) reads them.
 */
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins/rehype-code";

const FLAGS = new Set(["expandable", "wrap", "lines", "twoslash"]);

/** "1-3,5" -> Set{1,2,3,5} (1-based). */
export function parseRanges(value) {
  const out = new Set();
  for (const part of String(value ?? "").split(",")) {
    const m = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;
    for (let i = start; i <= end; i++) out.add(i);
  }
  return out;
}

/**
 * Docs fence meta -> attributes. Bare words before the first
 * attribute or `{range}` form the title ("bash Install the CLI").
 */
function parseDocsMeta(meta) {
  const attrs = {};
  const titleWords = [];
  let titleOpen = true;
  const re =
    /([A-Za-z_][\w-]*)=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}|(\S+))|\{([^}]*)\}|(\S+)/g;
  let m;
  while ((m = re.exec(meta ?? ""))) {
    if (m[1]) {
      titleOpen = false;
      const key = m[1];
      const value = m[2] ?? m[3] ?? m[4] ?? m[5] ?? "";
      if (key === "highlight") attrs["data-highlight"] = value;
      else if (key === "focus") attrs["data-focus"] = value;
      else if (key === "title") attrs.title = value;
      else if (key === "icon") attrs["data-icon"] = value;
      else attrs[`data-${key.toLowerCase()}`] = value;
    } else if (m[6] !== undefined) {
      titleOpen = false;
      attrs["data-highlight"] = attrs["data-highlight"]
        ? `${attrs["data-highlight"]},${m[6]}`
        : m[6];
    } else if (m[7]) {
      const word = m[7];
      if (FLAGS.has(word)) {
        titleOpen = false;
        attrs[`data-${word}`] = "true";
      } else if (titleOpen) {
        titleWords.push(word);
      }
    }
  }
  if (titleWords.length && attrs.title === undefined)
    attrs.title = titleWords.join(" ");
  return attrs;
}

/** Adds `line-highlight` / `line-focus` to the lines named in the meta. */
const transformerDocsLines = {
  name: "docs:line-classes",
  line(node, line) {
    const meta = this.options.meta ?? {};
    const highlight = meta["data-highlight"];
    const focus = meta["data-focus"];
    if (highlight && parseRanges(highlight).has(line))
      this.addClassToHast(node, "line-highlight");
    if (focus && parseRanges(focus).has(line))
      this.addClassToHast(node, "line-focus");
  },
  // Every line ends with a newline, the last one too, as the docs have
  // rendered code: a fence that ends with a blank line shows it.
  code(node) {
    node.children.push({ type: "text", value: "\n" });
  },
  pre(node) {
    node.properties["data-language"] = this.options.lang;
    if (this.options.meta?.["data-focus"])
      this.addClassToHast(node, "has-focused");
    if (this.options.meta?.["data-highlight"])
      this.addClassToHast(node, "has-highlighted");
  },
};

/** @type {import("fumadocs-core/mdx-plugins").RehypeCodeOptions} */
export const codeBlockOptions = {
  themes: { light: "github-light", dark: "github-dark-dimmed" },
  defaultColor: "light",
  fallbackLanguage: "plaintext",
  icon: false,
  tab: false,
  transformers: [
    ...(rehypeCodeDefaultOptions.transformers ?? []),
    transformerDocsLines,
  ],
  parseMetaString(meta) {
    return { ...parseDocsMeta(meta), __raw: meta };
  },
};
