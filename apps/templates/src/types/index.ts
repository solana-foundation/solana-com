export type Tech = "next" | "vite" | "react" | "node" | "expo" | "other";

export type TemplateTag =
  | "nextjs"
  | "react"
  | "solana-kit"
  | "tailwind"
  | "typescript"
  | "wallet-ui"
  | "anchor-basic"
  | "anchor-counter"
  | "javascript"
  | "vite"
  | "nodejs"
  | "expo";

export type TemplateSource = {
  id: string;
  name: string;
  source: string;
  provider: string;
  owner: string;
  repo: string;
};

/**
 * Dataset record used by the search UI.
 * Updated to match the structure from the provided example.
 */
export type TemplateRecord = {
  id: string;
  name: string;
  description: string;
  displayName?: string;

  source: TemplateSource;

  keywords: TemplateTag[];
  path: string;
  readme: string;
  repoUrl: string;

  tech: Tech;
  logoUrl?: string;
  featured?: boolean;

  href?: string;
  author?: string;
  tags?: TemplateTag[];
  title?: string;
};
