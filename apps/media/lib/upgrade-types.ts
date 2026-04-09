import type { PageInfo } from "./post-types";

export type SIMDStatus =
  | "idea"
  | "draft"
  | "review"
  | "accepted"
  | "implemented"
  | "activated"
  | "withdrawn"
  | "stagnant"
  | "living";

export type SIMDCategory = "standard" | "meta" | "advisory";
export type SIMDType = "core" | "networking" | "interfaces";

export type UpgradeItem = {
  id: string;
  slug: string;
  simdNumber: string;
  title: string;
  status: SIMDStatus;
  category: SIMDCategory;
  type?: SIMDType;
  authors: string[];
  createdDate: string | null;
  updatedDate: string | null;
  featureGate?: string;
  githubUrl: string;
  discussionUrl?: string;
  summary: string;
  description?: string;
  editorialNote?: string;
  relatedSimds: string[];
  featured: boolean;
  tags: string[];
  heroImage?: string | null;
  cursor?: string;
  url: string;
};

export type UpgradeOverview = {
  eyebrow?: string;
  title: string;
  intro: string;
  currentFocus?: string;
  statusGuide?: string;
  resources: { label: string; url: string }[];
};

export type FetchUpgradesParams = {
  limit?: number;
  cursor?: string;
  status?: SIMDStatus;
  category?: SIMDCategory;
  type?: SIMDType;
  search?: string;
  sort?: "updated-desc" | "created-desc" | "simd-asc";
};

export type FetchUpgradesResponse = {
  items: UpgradeItem[];
  pageInfo: PageInfo;
};

export type UpgradeNote = {
  slug: string;
  upgradeSlug: string;
  upgradeTitle: string;
  simdNumber: string;
  publishedAt: string;
  expectedRelease?: string;
  body: string;
};
