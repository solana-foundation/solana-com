import { withRelatedProject } from "@vercel/related-projects";

// Media app URLs
const vercelMediaUrl = withRelatedProject({
  projectName: "solana-com-media",
  defaultHost: "https://solana-com-media.vercel.app",
});
const developmentMediaUrl = "http://localhost:3002";

export const MEDIA_APP_URL =
  process.env.NEXT_PUBLIC_MEDIA_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? vercelMediaUrl
    : developmentMediaUrl);

// Docs app URLs
const vercelDocsUrl = withRelatedProject({
  projectName: "solana-com-docs",
  defaultHost: "https://solana-com-docs.vercel.app",
});
const developmentDocsUrl = "http://localhost:3003";

export const DOCS_APP_URL =
  process.env.NEXT_PUBLIC_DOCS_APP_URL ||
  (process.env.NODE_ENV === "production" ? vercelDocsUrl : developmentDocsUrl);

// Templates app URLs
const vercelTemplatesUrl = withRelatedProject({
  projectName: "templates",
  defaultHost: "https://solana-templates.vercel.app",
});
const developmentTemplatesUrl = "http://localhost:3001";

export const templatesAppUrl =
  process.env.NEXT_PUBLIC_TEMPLATES_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? vercelTemplatesUrl
    : developmentTemplatesUrl);

// Accelerate app URLs
const vercelAccelerateUrl = withRelatedProject({
  projectName: "solana-com-accelerate",
  defaultHost: "https://solana-com-accelerate.vercel.app",
});
const developmentAccelerateUrl = "http://localhost:3004";

export const ACCELERATE_APP_URL =
  process.env.NEXT_PUBLIC_ACCELERATE_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? vercelAccelerateUrl
    : developmentAccelerateUrl);

// Breakpoint app URLs
const vercelBreakpointUrl = withRelatedProject({
  projectName: "solana-com-breakpoint-2",
  defaultHost: "https://solana-com-breakpoint-2.vercel.app",
});
const developmentBreakpointUrl = "http://localhost:3005";

export const BREAKPOINT_APP_URL =
  process.env.NEXT_PUBLIC_BREAKPOINT_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? vercelBreakpointUrl
    : developmentBreakpointUrl);

// Builder (BLDR) app URLs
const vercelBuilderUrl = withRelatedProject({
  projectName: "solana-com-bldr",
  defaultHost: "https://solana-com-bldr.vercel.app",
});
const developmentBuilderUrl = "http://localhost:3007";

export const BUILDER_APP_URL =
  process.env.NEXT_PUBLIC_BUILDER_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? vercelBuilderUrl
    : developmentBuilderUrl);

// Breakpoint badge site (BP26 badges): a Bun server on Google Cloud Run, not a
// Vercel project, behind its own load balancer at badge-api.solana.com. It
// serves its site and API under /breakpoint/badge itself.
export const BREAKPOINT_BADGE_URL =
  process.env.NEXT_PUBLIC_BREAKPOINT_BADGE_URL ||
  "https://badge-api.solana.com";
