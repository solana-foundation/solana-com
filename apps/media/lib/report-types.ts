import type { PageInfo } from "./post-types";

export type ReportItem = {
  id: string;
  title: string;
  published: string;
  publishedAt: string | null;
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

export type ReportEntry = {
  title: string;
  status?: string | null;
  publishedAt?: string | null;
  description?: string | null;
  eyebrow?: string | null;
  headline?: string | null;
  pdfUrl?: string | null;
  image?: { src?: string | null; alt?: string | null } | null;
  hubspotForm?: {
    buttonLabel?: string | null;
    portalId?: string | null;
    formId?: string | null;
    formUrl?: string | null;
  } | null;
  categories?: Array<{ category?: string | null } | null> | null;
  tags?: Array<{ tag?: string | null } | null> | null;
  buttons?: Array<{ label?: string | null; url?: string | null } | null> | null;
  body: () => Promise<string>;
};

export type { PageInfo };
