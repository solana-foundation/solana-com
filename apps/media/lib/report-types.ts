import type { PageInfo } from "./post-types";

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

export type { PageInfo };
