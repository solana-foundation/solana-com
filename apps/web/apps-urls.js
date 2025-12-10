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

// Main app URLs
const vercelMainUrl = withRelatedProject({
  projectName: "solana-com",
  defaultHost: "https://solana.com",
});
const developmentMainUrl = "http://localhost:3000";

export const MAIN_APP_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL ||
  (process.env.NODE_ENV === "production" ? vercelMainUrl : developmentMainUrl);

console.log("MEDIA_APP_URL", MEDIA_APP_URL);
console.log("MAIN_APP_URL", MAIN_APP_URL);
