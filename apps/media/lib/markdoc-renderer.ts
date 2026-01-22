import Markdoc from "@markdoc/markdoc";
import type { RenderableTreeNode } from "@markdoc/markdoc";
import type { MarkdocDocument } from "./post-types";

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
export function extractPlainText(content: string | null | undefined): string {
  // Handle null, undefined, or empty content
  if (!content || typeof content !== "string") {
    return "";
  }

  // Handle empty string
  if (content.trim().length === 0) {
    return "";
  }

  try {
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
  } catch (error) {
    // If Markdoc parsing fails, return empty string or fallback to original content
    console.warn("Failed to parse Markdoc content:", error);
    return "";
  }
}

/**
 * Convert MarkdocDocument to plain text string
 * Handles both string and MarkdocDocument object types
 */
export function markdocDocumentToPlainText(
  content: MarkdocDocument | string | null | undefined
): string {
  if (!content) return "";

  if (typeof content === "string") {
    return extractPlainText(content);
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object") {
          const node = item as Record<string, unknown>;
          // Handle various markdoc node types
          if (node.type === "paragraph" && node.children) {
            return markdocDocumentToPlainText(node.children as MarkdocDocument);
          }
          if (node.type === "text" && node.text) {
            return String(node.text);
          }
          if (node.children) {
            return markdocDocumentToPlainText(node.children as MarkdocDocument);
          }
        }
        return "";
      })
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  // If it's an object but not an array, try to extract text from it
  if (content && typeof content === "object") {
    const node = content as Record<string, unknown>;
    if (node.children) {
      return markdocDocumentToPlainText(node.children as MarkdocDocument);
    }
    if (node.text) {
      return String(node.text);
    }
  }

  return "";
}

export { Markdoc };
