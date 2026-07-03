import "server-only";

import { isPublishedPost } from "./keystatic/post-status";
import { NEWS_NAV_ITEMS, type NewsNavItem } from "./news-nav";
import { reader } from "./reader";

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

function buildNavLookup(navItems: NewsNavItem[]): Map<string, string> {
  const lookup = new Map<string, string>();

  for (const item of navItems) {
    lookup.set(item.slug.toLowerCase(), item.slug);
    lookup.set(item.label.toLowerCase(), item.slug);
  }

  return lookup;
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

  for (const postSlug of postSlugs) {
    try {
      const post = await reader.collections.posts.read(postSlug);

      if (!isPublishedPost(post) || !Array.isArray(post.categories)) {
        continue;
      }

      for (const categoryReference of post.categories) {
        const categoryKey = getCategoryReferenceKey(categoryReference);
        const navSlug = categoryKey ? navLookup.get(categoryKey) : null;

        if (navSlug) {
          visibleNavSlugs.add(navSlug);
        }
      }

      if (visibleNavSlugs.size === navItems.length) {
        break;
      }
    } catch (error) {
      console.error(`Failed to read post "${postSlug}" for news navigation:`, {
        error,
      });
    }
  }

  return navItems.filter((item) => visibleNavSlugs.has(item.slug));
}
