/** Minimal mdast-compatible node. */
export interface AstNode {
  type: string;
  children?: AstNode[];
  [key: string]: unknown;
}
