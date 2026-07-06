/**
 * Editorial section navigation for the News front.
 *
 * This is deliberately a small, curated list of durable verticals rather than a
 * dynamic list of every tag/category. Each entry maps to an existing category
 * slug under `content/categories`, so the nav links resolve to the existing
 * `/news/category/[category]` route without any schema or route changes.
 *
 * Keeping this in config (not the CMS) lets us ship a clean masthead now while
 * the richer category schema described in the conversion brief is deferred.
 */

export interface NewsNavItem {
  /** Human-readable label shown in the masthead nav. */
  label: string;
  /** Existing category slug under `content/categories` (kebab-case). */
  slug: string;
}

/**
 * Canonical vertical order. Slugs must exist in `content/categories`.
 * Order follows the recommended vertical priority in the conversion brief.
 */
export const NEWS_NAV_ITEMS: NewsNavItem[] = [
  { label: "Ecosystem", slug: "ecosystem" },
  { label: "Developers", slug: "developers" },
  { label: "Institutions", slug: "institutions" },
  { label: "Finance", slug: "finance" },
  { label: "Payments", slug: "payments" },
  { label: "DeFi", slug: "defi" },
  { label: "Consumer", slug: "consumer" },
  { label: "Network", slug: "upgrades" },
  { label: "Community", slug: "community" },
  { label: "Breakpoint", slug: "breakpoint" },
];

export function newsNavHref(slug: string): string {
  return `/news/category/${slug}`;
}
