import { TinaMarkdownContent } from "tinacms/dist/rich-text";

export type PostItem = {
  id: string;
  published: string;
  title: string;
  tags: string[];
  categories: string[];
  url: string;
  description: TinaMarkdownContent;
  heroImage: string | null | undefined;
  author: {
    name: string;
    avatar: string | null | undefined;
  };
  cursor?: string;
};
