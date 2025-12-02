export type PostItem = {
  id: string;
  published: string;
  title: string;
  tags: string[];
  categories: string[];
  url: string;
  description: string;
  heroImage: string | null | undefined;
  author: {
    name: string;
    avatar: string | null | undefined;
  };
  cursor?: string;
};
