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
