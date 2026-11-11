import faviconPng from "@solana-com/ui-chrome/assets/favicon.png";

/**
 * Asset prefix for static files when deployed behind the main solana.com proxy.
 * Matches `assetPrefix` in next.config.ts.
 */
export const ASSET_PREFIX = "/builder-assets";

/**
 * Prefixes a public-folder path (e.g. "/images/logo.svg") so it resolves both
 * on the app's own deployment and through the solana.com rewrite.
 */
export function getImagePath(path: string): string {
  if (
    !path ||
    path.startsWith(ASSET_PREFIX) ||
    path.startsWith("http") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  return `${ASSET_PREFIX}${path.startsWith("/") ? path : `/${path}`}`;
}

const PUBLIC_SITE_URL = "https://solana.com/builder";

const getSiteUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3007";
  }
  if (process.env.VERCEL_ENV !== "production" && !!process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return PUBLIC_SITE_URL;
};

const siteUrl = getSiteUrl();
// Assets are served from the origin root under /builder-assets; in production
// the site URL includes /builder, so strip it to build absolute asset URLs.
const assetBaseUrl = siteUrl.replace(/\/builder$/, "");

export const config = {
  siteUrl,
  publicUrl: PUBLIC_SITE_URL,
  siteIcon: faviconPng.src,
  socialShare: `${assetBaseUrl}${getImagePath("/images/social-card.jpg")}`,
  twitterHandle: "solana",
  event: {
    name: "BLDR Epoch//01",
    city: "San Francisco",
    region: "CA",
    country: "US",
    startDate: "2027-03-09",
    endDate: "2027-03-10",
  },
};
