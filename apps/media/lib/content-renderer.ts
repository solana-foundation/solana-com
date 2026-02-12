import type { ContentDocument } from "./post-types";

/**
 * Extract plain text from a string by stripping basic markdown/HTML
 */
export function extractPlainText(content: string | null | undefined): string {
  if (!content || typeof content !== "string") {
    return "";
  }

  if (content.trim().length === 0) {
    return "";
  }

  // Strip markdown/HTML syntax to get plain text
  return content
    .replace(/#{1,6}\s+/g, "") // headings
    .replace(/\*\*(.+?)\*\*/g, "$1") // bold
    .replace(/\*(.+?)\*/g, "$1") // italic
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links
    .replace(/!\[.*?\]\(.+?\)/g, "") // images
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // code
    .replace(/<[^>]+>/g, "") // HTML tags
    .replace(/\n+/g, " ")
    .trim();
}

/**
 * Convert a Keystatic content document to plain text string
 * Handles both string and document object types
 */
export function contentDocumentToPlainText(
  content: ContentDocument | string | null | undefined
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
          if (node.type === "paragraph" && node.children) {
            return contentDocumentToPlainText(node.children as ContentDocument);
          }
          if (node.type === "text" && node.text) {
            return String(node.text);
          }
          if (node.children) {
            return contentDocumentToPlainText(node.children as ContentDocument);
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
      return contentDocumentToPlainText(node.children as ContentDocument);
    }
    if (node.text) {
      return String(node.text);
    }
  }

  return "";
}

// Backwards-compatible aliases
export const markdocDocumentToPlainText = contentDocumentToPlainText;
