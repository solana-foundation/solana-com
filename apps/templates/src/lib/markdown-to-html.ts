import { marked } from "marked";
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

  return result;
}
