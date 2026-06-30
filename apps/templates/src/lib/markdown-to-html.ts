import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { codeToHtml } from "shiki";

/**
 * Custom renderer for marked that uses Shiki for syntax highlighting
 */
const renderer = {
  code(token: { text: string; lang?: string }) {
    const code = token.text;
    const language = token.lang || "text";
    const id = Math.random().toString(36).substring(7);
    return `<pre data-code-id="${id}" data-lang="${language}" data-code="${encodeURIComponent(code)}"></pre>`;
  },
};

marked.use({ renderer });

const ALLOWED_TAGS = [
  "a",
  "blockquote",
  "br",
  "code",
  "dd",
  "del",
  "details",
  "div",
  "dl",
  "dt",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "kbd",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "name", "rel", "target", "title"],
  code: ["class", "style"],
  div: ["class"],
  img: ["alt", "height", "src", "title", "width"],
  pre: ["class", "style", "tabindex"],
  span: ["class", "style"],
  td: ["align", "colspan", "rowspan"],
  th: ["align", "colspan", "rowspan"],
};

const ALLOWED_STYLES: sanitizeHtml.IOptions["allowedStyles"] = {
  "*": {
    "background-color": [
      /^#[0-9a-f]{3,8}$/i,
      /^rgb(a)?\([\d\s,%.]+\)$/i,
      /^hsl(a)?\([\d\s,%.]+\)$/i,
    ],
    color: [
      /^#[0-9a-f]{3,8}$/i,
      /^rgb(a)?\([\d\s,%.]+\)$/i,
      /^hsl(a)?\([\d\s,%.]+\)$/i,
    ],
    "font-style": [/^italic$/, /^normal$/],
    "font-weight": [/^\d{3}$/, /^bold$/, /^normal$/],
    "text-decoration": [/^underline$/, /^none$/],
  },
};

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
  allowedStyles: ALLOWED_STYLES,
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
};

/**
 * Convert markdown to HTML with syntax highlighting
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // First pass: convert markdown to HTML with placeholders
  const html = await marked.parse(markdown);

  // Second pass: find all code blocks and highlight them
  const codeBlocks: Array<{ id: string; lang: string; code: string }> = [];
  const regex =
    /<pre data-code-id="([^"]+)" data-lang="([^"]+)" data-code="([^"]+)"><\/pre>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    codeBlocks.push({
      id: match[1] || "",
      lang: match[2] || "text",
      code: decodeURIComponent(match[3] || ""),
    });
  }

  // Highlight all code blocks
  let result = html;
  for (const block of codeBlocks) {
    try {
      const highlighted = await codeToHtml(block.code, {
        lang: block.lang || "text",
        theme: "github-dark",
      });
      result = result.replace(
        `<pre data-code-id="${block.id}" data-lang="${block.lang}" data-code="${encodeURIComponent(block.code)}"></pre>`,
        highlighted,
      );
    } catch {
      // If language is not supported, fall back to 'text'
      const highlighted = await codeToHtml(block.code, {
        lang: "text",
        theme: "github-dark",
      });
      result = result.replace(
        `<pre data-code-id="${block.id}" data-lang="${block.lang}" data-code="${encodeURIComponent(block.code)}"></pre>`,
        highlighted,
      );
    }
  }

  return sanitizeHtml(result, SANITIZE_OPTIONS);
}
