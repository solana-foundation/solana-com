import "server-only";

import { isPublishedPost } from "./keystatic/post-status";
import { NEWS_NAV_ITEMS, type NewsNavItem } from "./news-nav";
import { reader } from "./reader";

const POST_READ_BATCH_SIZE = 24;

function normalizeCategoryKey(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized || null;
}

function getCategoryReferenceKey(reference: unknown): string | null {
  if (typeof reference === "string") {
    return normalizeCategoryKey(reference);
  }

  if (reference && typeof reference === "object" && "category" in reference) {
    return normalizeCategoryKey(reference.category);
  }

  return null;
}

interface NewsNavLookup {
  slugs: Map<string, string>;
  labels: Map<string, string>;
}

function buildNavLookup(navItems: NewsNavItem[]): NewsNavLookup {
  const slugs = new Map<string, string>();
  const labels = new Map<string, string>();

  for (const item of navItems) {
    slugs.set(item.slug.toLowerCase(), item.slug);
  }

  for (const item of navItems) {
    const labelKey = normalizeCategoryKey(item.label);

    if (labelKey && !slugs.has(labelKey) && !labels.has(labelKey)) {
      labels.set(labelKey, item.slug);
    }
  }

  return { slugs, labels };
}

function getNavSlugFromCategory(
  lookup: NewsNavLookup,
  categoryKey: string,
): string | null {
  return (
    lookup.slugs.get(categoryKey) ?? lookup.labels.get(categoryKey) ?? null
  );
}

async function readPostForNav(postSlug: string) {
  try {
    const post = await reader.collections.posts.read(postSlug);
    return { postSlug, post };
  } catch (error) {
    console.error(`Failed to read post "${postSlug}" for news navigation:`, {
      error,
    });
    return null;
  }
}

export async function fetchNewsNavItemsWithPosts(
  navItems: NewsNavItem[] = NEWS_NAV_ITEMS,
): Promise<NewsNavItem[]> {
  if (navItems.length === 0) {
    return [];
  }

  let postSlugs: string[];

  try {
    postSlugs = await reader.collections.posts.list();
  } catch (error) {
    console.error("Failed to list posts for news navigation:", error);
    return navItems;
  }

  const navLookup = buildNavLookup(navItems);
  const visibleNavSlugs = new Set<string>();

  for (
    let index = 0;
    index < postSlugs.length && visibleNavSlugs.size < navItems.length;
    index += POST_READ_BATCH_SIZE
  ) {
    const batch = postSlugs.slice(index, index + POST_READ_BATCH_SIZE);
    const posts = await Promise.all(batch.map(readPostForNav));

    for (const result of posts) {
      if (
        !result ||
        !isPublishedPost(result.post) ||
        !Array.isArray(result.post.categories)
      ) {
        continue;
      }

      for (const categoryReference of result.post.categories) {
        const categoryKey = getCategoryReferenceKey(categoryReference);
        const navSlug = categoryKey
          ? getNavSlugFromCategory(navLookup, categoryKey)
          : null;

        if (navSlug) {
          visibleNavSlugs.add(navSlug);
        }
      }

      if (visibleNavSlugs.size === navItems.length) {
        break;
      }
    }
  }

  return navItems.filter((item) => visibleNavSlugs.has(item.slug));
}
