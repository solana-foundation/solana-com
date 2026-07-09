import { reader } from "../reader";
import { PostItem } from "../post-types";
import { isPublishedPost } from "./post-status";
import { formatPublishedAt, parsePublishedAt } from "./publishing";

export interface LatestPostsParams {
  limit?: number;
  cursor?: string;
  category?: string;
  tag?: string;
  excludeTag?: string;
}

export interface LatestPostsResponse {
  posts: PostItem[];
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor?: string;
    startCursor?: string;
  };
}

type PostEntry = Awaited<ReturnType<typeof reader.collections.posts.read>>;
const FEATURED_TAG = "featured";

function normalizeFilter(value?: string): string | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized || undefined;
}

function getTaxonomySlug(
  item: unknown,
  key: "category" | "tag",
): string | null {
  if (typeof item === "string") {
    return item;
  }

  if (item && typeof item === "object" && key in item) {
    const value = (item as Record<string, unknown>)[key];
    return value ? String(value) : null;
  }

  return null;
}

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values));
}

async function postMatchesCategory(
  post: PostEntry,
  normalizedCategory?: string,
): Promise<boolean> {
  if (!normalizedCategory) return true;
  if (!post?.categories) return false;

  for (const catRef of post.categories) {
    const categorySlug = getTaxonomySlug(catRef, "category");
    if (!categorySlug) continue;

    if (categorySlug.toLowerCase() === normalizedCategory) {
      return true;
    }

    const catData = await reader.collections.categories.read(categorySlug);
    const categoryName = String(catData?.name || "").toLowerCase();

    if (categoryName === normalizedCategory) {
      return true;
    }
  }

  return false;
}

async function postMatchesTag(
  post: PostEntry,
  normalizedTag?: string,
): Promise<boolean> {
  if (!normalizedTag) return true;
  if (!post?.tags) return false;

  for (const tagRef of post.tags) {
    const tagSlug = getTaxonomySlug(tagRef, "tag");
    if (!tagSlug) continue;

    if (tagSlug.toLowerCase() === normalizedTag) {
      return true;
    }

    const tagData = await reader.collections.tags.read(tagSlug);
    const tagName = String(tagData?.name || "").toLowerCase();

    if (tagName === normalizedTag) {
      return true;
    }
  }

  return false;
}

export async function readPostBySlug(
  slug: string,
  context?: string,
): Promise<PostEntry | null> {
  try {
    return await reader.collections.posts.read(slug);
  } catch (error) {
    const suffix = context ? ` in ${context}` : "";
    console.error(`Failed to read post "${slug}"${suffix}:`, error);
    return null;
  }
}

/**
 * Transform Keystatic post entry to PostItem
 */
async function transformPost(
  slug: string,
  post: PostEntry,
): Promise<PostItem | null> {
  if (!post) return null;

  const publishedAt =
    typeof post.publishedAt === "string" ? post.publishedAt : null;
  const formattedDate = formatPublishedAt(publishedAt);

  // Resolve author reference
  let authorName = "Solana Foundation";
  let authorAvatar: string | null = null;

  if (post.author) {
    const authorData = await reader.collections.authors.read(post.author);
    if (authorData) {
      // Keystatic slug field returns string directly
      authorName = String(authorData.name) || "Solana Foundation";
      authorAvatar = authorData.avatar || null;
    }
  }

  // Resolve category names
  // Handle both object format (category: slug) and string format
  const categoryNames: string[] = [];
  if (post.categories) {
    for (const catItem of post.categories) {
      // Check if it's an object with a category property (relationship format)
      if (catItem && typeof catItem === "object" && "category" in catItem) {
        if (catItem.category) {
          const catData = await reader.collections.categories.read(
            catItem.category,
          );
          if (catData?.name) {
            categoryNames.push(String(catData.name));
          }
        }
      } else if (typeof catItem === "string") {
        // Handle string format directly
        categoryNames.push(catItem);
      }
    }
  }

  // Resolve tag names
  // Tags are now strings (not relationship objects)
  const tagNames: string[] = [];
  if (post.tags) {
    for (const tagItem of post.tags) {
      // Handle both string format (new) and object format (legacy)
      const tagSlug = getTaxonomySlug(tagItem, "tag");
      if (!tagSlug) continue;

      if (typeof tagItem === "string") {
        tagNames.push(tagSlug);
      } else {
        // Legacy format: relationship object
        const tagData = await reader.collections.tags.read(tagSlug);
        if (tagData?.name) {
          tagNames.push(String(tagData.name));
        }
      }
    }
  }

  // Serialize description to ensure it's JSON-serializable (removes any functions)
  let serializedDescription: object | null = null;

  try {
    let rawDescription = post.description;

    // Handle if description is a function (getter/lazy-loaded value)
    if (typeof rawDescription === "function") {
      // Try to call the function to get the actual value
      try {
        rawDescription = rawDescription();
      } catch {
        // If calling fails, try to access as a property or set to null
        rawDescription = post.description?.value || null;
      }
    }

    // Only serialize if we have a valid value that's not a function
    if (
      rawDescription !== null &&
      rawDescription !== undefined &&
      typeof rawDescription !== "function"
    ) {
      // Use JSON.stringify with a replacer to remove any nested functions
      const jsonString = JSON.stringify(rawDescription, (key, value) => {
        // Remove functions and other non-serializable values
        if (typeof value === "function") {
          return undefined;
        }
        return value;
      });

      if (jsonString) {
        serializedDescription = JSON.parse(jsonString);
      }
    }
  } catch (e) {
    // If serialization fails, set to null to avoid passing functions to RSC
    console.warn(`Failed to serialize description for post ${slug}:`, e);
    serializedDescription = null;
  }

  return {
    id: slug,
    published: formattedDate,
    publishedAt,
    title: String(post.title),
    tags: dedupeStrings(tagNames),
    categories: dedupeStrings(categoryNames),
    url: `/news/${slug}`,
    description: serializedDescription, // Content document type, serialized for RSC
    heroImage: post.heroImage || "/uploads/posts/default-blog.webp",
    author: {
      name: authorName,
      avatar: authorAvatar,
    },
    cursor: slug,
  };
}

/**
 * Fetch latest posts from Keystatic
 */
export const fetchLatestPosts = async (
  params: LatestPostsParams,
): Promise<LatestPostsResponse> => {
  try {
    const allSlugs = await reader.collections.posts.list();
    const limit = params.limit ?? 10;

    // Fetch all posts to sort by date
    const postsWithDates: Array<{
      slug: string;
      date: Date | null;
      post: PostEntry;
    }> = [];

    for (const slug of allSlugs) {
      try {
        const post = await reader.collections.posts.read(slug);
        if (isPublishedPost(post)) {
          postsWithDates.push({
            slug,
            date: parsePublishedAt(post.publishedAt),
            post,
          });
        }
      } catch (error) {
        // Log error but continue processing other posts
        console.error(`Failed to read post "${slug}":`, error);
        // Skip this post and continue with others
      }
    }

    // Sort by date descending
    postsWithDates.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.getTime() - a.date.getTime();
    });

    const normalizedCategory = normalizeFilter(params.category);
    const normalizedTag = normalizeFilter(params.tag);
    const normalizedExcludeTag = normalizeFilter(params.excludeTag);

    // Filter by category and/or tag if specified
    let filteredPosts = postsWithDates;
    if (normalizedCategory || normalizedTag || normalizedExcludeTag) {
      filteredPosts = [];

      for (const item of postsWithDates) {
        const matchesCategory = await postMatchesCategory(
          item.post,
          normalizedCategory,
        );
        const matchesTag = await postMatchesTag(item.post, normalizedTag);
        const matchesExcludedTag = normalizedExcludeTag
          ? await postMatchesTag(item.post, normalizedExcludeTag)
          : false;

        if (matchesCategory && matchesTag && !matchesExcludedTag) {
          filteredPosts.push(item);
        }
      }
    }

    // Apply cursor-based pagination
    let startIndex = 0;
    if (params.cursor) {
      const cursorIndex = filteredPosts.findIndex(
        (p) => p.slug === params.cursor,
      );
      if (cursorIndex >= 0) {
        startIndex = cursorIndex + 1;
      }
    }

    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);

    // Transform posts
    const posts: PostItem[] = [];
    for (const item of paginatedPosts) {
      const transformed = await transformPost(item.slug, item.post);
      if (transformed) {
        posts.push(transformed);
      }
    }

    return {
      posts,
      pageInfo: {
        hasNextPage: startIndex + limit < filteredPosts.length,
        hasPreviousPage: startIndex > 0,
        endCursor: paginatedPosts[paginatedPosts.length - 1]?.slug,
        startCursor: paginatedPosts[0]?.slug,
      },
    };
  } catch (error) {
    console.error("Failed to fetch latest posts from Keystatic:", error);
    return { posts: [] };
  }
};

export interface FeaturedPostResponse {
  post: PostItem | null;
}

export interface FeaturedPostsParams {
  limit?: number;
}

export interface FeaturedPostsResponse {
  posts: PostItem[];
}

export async function fetchPublishedPostBySlug(slug: string, now?: Date) {
  const post = await readPostBySlug(slug, "fetchPublishedPostBySlug");
  return isPublishedPost(post, now) ? post : null;
}

/**
 * Fetch featured posts from Keystatic, newest first.
 */
export const fetchFeaturedPosts = async (
  params: FeaturedPostsParams = {},
): Promise<FeaturedPostsResponse> => {
  try {
    const allSlugs = await reader.collections.posts.list();

    const featuredCandidates: Array<{
      slug: string;
      date: Date | null;
      post: PostEntry;
    }> = [];

    for (const slug of allSlugs) {
      try {
        const post = await reader.collections.posts.read(slug);
        if (
          isPublishedPost(post) &&
          (await postMatchesTag(post, FEATURED_TAG))
        ) {
          featuredCandidates.push({
            slug,
            date: parsePublishedAt(post.publishedAt),
            post,
          });
        }
      } catch (error) {
        console.error(
          `Failed to read post "${slug}" in fetchFeaturedPosts:`,
          error,
        );
      }
    }

    featuredCandidates.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.getTime() - a.date.getTime();
    });

    const limitedCandidates =
      typeof params.limit === "number"
        ? featuredCandidates.slice(0, params.limit)
        : featuredCandidates;

    const posts: PostItem[] = [];
    for (const item of limitedCandidates) {
      const transformed = await transformPost(item.slug, item.post);
      if (transformed) {
        posts.push(transformed);
      }
    }

    return { posts };
  } catch (error) {
    console.error("Failed to fetch featured posts from Keystatic:", error);
    return { posts: [] };
  }
};

/**
 * Fetch the most recent featured post from Keystatic.
 */
export const fetchFeaturedPost = async (): Promise<FeaturedPostResponse> => {
  const response = await fetchFeaturedPosts({ limit: 1 });
  return { post: response.posts[0] ?? null };
};
