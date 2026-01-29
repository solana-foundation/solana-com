import { getSerializedMdxContent, getAllMdxSlugs } from "@/lib/mdx";

// Priority routes that have been migrated to MDX
const MIGRATED_ROUTES = [
  "solutions",
  "solutions/token-extensions",
  "solutions/actions",
  "solutions/solana-permissioned-environments",
  "solutions/games-tooling",
  "solutions/payments-tooling",
  "solutions/commerce-tooling",
  "solutions/financial-infrastructure",
  "solutions/digital-assets",
  "solutions/real-world-assets",
  "solutions/gaming-and-entertainment",
  "solutions/artists-creators",
  "rpc",
  "tos",
  "privacy-policy",
];

/**
 * Get landing page content for a given slug and locale
 * Loads from MDX files, falls back to English if locale-specific content doesn't exist
 */
export async function getLandingContent(slug, locale = "en") {
  return getSerializedMdxContent(slug, locale);
}

/**
 * Get all available landing page slugs for static path generation
 */
export function getAllLandingSlugs() {
  return getAllMdxSlugs();
}

/**
 * Get migrated slugs only (for the new handler)
 */
export function getMigratedSlugs() {
  return MIGRATED_ROUTES;
}
