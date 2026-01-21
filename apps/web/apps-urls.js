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

export const TEMPLATES_APP_URL =
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

console.log("MEDIA_APP_URL", MEDIA_APP_URL);
console.log("DOCS_APP_URL", DOCS_APP_URL);
console.log("TEMPLATES_APP_URL", TEMPLATES_APP_URL);
console.log("ACCELERATE_APP_URL", ACCELERATE_APP_URL);
