import Markdoc from "@markdoc/markdoc";
import type { RenderableTreeNode } from "@markdoc/markdoc";

/**
 * Transform Markdoc content to a renderable tree
 */
export function transformMarkdocContent(content: string): RenderableTreeNode {
  const ast = Markdoc.parse(content);
  const transformed = Markdoc.transform(ast);
  return transformed;
}

/**
 * Render Markdoc to HTML string
 */
export function renderMarkdocToHtml(content: string): string {
  const transformed = transformMarkdocContent(content);
  return Markdoc.renderers.html(transformed);
}

/**
 * Extract plain text from Markdoc content
 */
export function extractPlainText(content: string): string {
  const ast = Markdoc.parse(content);

  function extractText(node: any): string {
    if (typeof node === "string") return node;
    if (!node) return "";

    if (node.children) {
      return node.children.map(extractText).join("");
    }

    return "";
  }

  return extractText(ast);
}

export { Markdoc };
