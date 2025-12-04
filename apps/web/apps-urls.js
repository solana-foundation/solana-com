import { withRelatedProject } from "@vercel/related-projects";

// Media app URLs
const vercelMediaUrl = `https://${withRelatedProject({
  projectName: "prj_40kDwTp9P4bvvGlaoU8U0cp4VG6N",
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
  projectName: "prj_sS1OQUbA5luVqKHn2M9yU2r4n4yo",
  defaultHost: "solana.com",
})}`;
const developmentMainUrl = "http://localhost:3000";

export const MAIN_APP_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL ||
  (process.env.NODE_ENV === "production" ? vercelMainUrl : developmentMainUrl);
