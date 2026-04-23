export type PostItem = {
  id: string;
  published: string;
  publishedAt?: string | null;
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

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  date: string;
  source?: string;
  linkType?: string;
  categories?: string[];
  description?: string;
  thumbnailImage?: string | null;
  cursor?: string;
};

export type ReportItem = {
  id: string;
  title: string;
  published: string;
  tags: string[];
  categories: string[];
  url: string;
  description: string;
  heroImage: string | null;
  eyebrow: string | null;
  headline: string | null;
  pdfUrl: string | null;
  cursor?: string;
};
