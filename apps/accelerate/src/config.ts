/**
 * Asset prefix for static files (images, etc.) when deployed behind the main solana.com proxy.
 * This matches the assetPrefix in next.config.ts and uses the same proxy path.
 */
export const ASSET_PREFIX = "/accelerate-assets";

/**
 * Prefixes a path with the asset prefix for static files.
 * Use this for all image src attributes to ensure they work in production.
 * @param path - The path to prefix (e.g., "/images/logo.svg")
 * @returns The prefixed path (e.g., "/accelerate-assets/images/logo.svg")
 */
export function getImagePath(path: string): string {
  if (!path) return path;
  // Already has the asset prefix or is an external URL
  if (path.startsWith(ASSET_PREFIX) || path.startsWith("http")) {
    return path;
  }
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${ASSET_PREFIX}${normalizedPath}`;
}

const getSiteUrl = () => {
  if (process.env.NODE_ENV === `development`) {
    return `http://localhost:3004`;
  }
  if (process.env.VERCEL_ENV !== "production" && !!process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `https://solana.com/accelerate`;
};

const siteUrl = getSiteUrl();
// Assets are served from the root with an /accelerate-assets prefix; in production
// the site URL includes /accelerate, so strip it to build absolute asset URLs.
const assetBaseUrl = siteUrl.replace(/\/accelerate$/, "");

export const config = {
  siteMetadata: {
    title: `Solana Accelerate APAC - Hong Kong`,
    description: `Join us at Solana Accelerate APAC in Hong Kong on 11 February 2026. Connect with the Solana ecosystem, meet builders, and explore the future of blockchain.`,
    shortDescription: `Solana Accelerate APAC - Hong Kong | 11 February 2026`,
    keywords: [
      "Solana",
      "blockchain",
      "cryptocurrency",
      "web3",
      "Hong Kong",
      "APAC",
      "conference",
      "event",
      "crypto event",
      "blockchain conference",
    ],
    socialShare: `${assetBaseUrl}${getImagePath("/images/social-card.webp")}`,
    author: `@solana`,
  },
  siteUrl,
  social: {
    twitter: {
      name: `solana`,
    },
  },
  siteIcon: `https://solana.com/favicon.png`,
  event: {
    name: "Solana Accelerate APAC",
    location: {
      name: "Hong Kong",
      address: "Hong Kong",
    },
    startDate: "2026-02-11",
    endDate: "2026-02-11",
    description:
      "Join us at Solana Accelerate APAC in Hong Kong on 11 February 2026. Connect with the Solana ecosystem, meet builders, and explore the future of blockchain.",
  },
};
