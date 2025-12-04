import { withRelatedProject } from "@vercel/related-projects";

// Media app URLs
const vercelMediaUrl = `https://${withRelatedProject({
  projectName: "solana-com-media",
  defaultHost: "solana-com-media.vercel.app",
})}`;
const developmentMediaUrl = "http://localhost:3002";

export const MEDIA_APP_URL =
  process.env.NEXT_PUBLIC_MEDIA_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? vercelMediaUrl
    : developmentMediaUrl);

// Main app URLs
const vercelMainUrl = `https://${withRelatedProject({
  projectName: "solana-com",
  defaultHost: "solana.com",
})}`;
const developmentMainUrl = "http://localhost:3000";

export const MAIN_APP_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL ||
  (process.env.NODE_ENV === "production" ? vercelMainUrl : developmentMainUrl);
