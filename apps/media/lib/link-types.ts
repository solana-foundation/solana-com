import { ContentDocument } from "./post-types";

export type LinkType = "article" | "tweet" | "video" | "github" | "other";

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  linkType: LinkType;
  description?: ContentDocument;
  thumbnailImage?: string | null;
  source?: string;
  publishedAt: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  cursor?: string;
};

export interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  type?: string;
}
