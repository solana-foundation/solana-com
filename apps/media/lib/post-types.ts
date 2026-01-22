// Markdoc document type for Keystatic content
export type MarkdocDocument = unknown;

export type PostItem = {
  id: string;
  published: string;
  title: string;
  tags: string[];
  categories: string[];
  url: string;
  description: MarkdocDocument;
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
