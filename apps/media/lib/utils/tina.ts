import { TinaMarkdownContent } from "tinacms/dist/rich-text";

export const extractPlainText = (
  richTextContent: TinaMarkdownContent | null | undefined
) => {
  if (!richTextContent) return "";

  const traverse = (node: TinaMarkdownContent & { text?: string }) => {
    if (node.type === "text") {
      return node.text;
    }
    if (node.children) {
      return node.children.map(traverse).join("");
    }
    return "";
  };

  return richTextContent.children.map(traverse).join("");
};
