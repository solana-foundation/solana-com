import { TinaMarkdownContent } from "tinacms/dist/rich-text";

export type LinkType = "article" | "tweet" | "video" | "github" | "other";

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  linkType: LinkType;
  description?: TinaMarkdownContent;
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
