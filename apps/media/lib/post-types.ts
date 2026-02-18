// Content document type for Keystatic content
export type ContentDocument = unknown;

// Backwards-compatible alias
export type MarkdocDocument = ContentDocument;

export type PostItem = {
  id: string;
  published: string;
  title: string;
  tags: string[];
  categories: string[];
  url: string;
  description: ContentDocument;
  heroImage: string | null | undefined;
  author: {
    name: string;
    avatar: string | null | undefined;
  };
  cursor?: string;
};

// PageInfo type for pagination (replaces TinaCMS PageInfo)
export type PageInfo = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
};
