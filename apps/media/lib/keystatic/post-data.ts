import { reader } from "../reader";
import { PostItem } from "../post-types";
import { format } from "date-fns";

export interface LatestPostsParams {
  limit?: number;
  cursor?: string;
  category?: string;
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

/**
 * Transform Keystatic post entry to PostItem
 */
async function transformPost(
  slug: string,
  post: Awaited<ReturnType<typeof reader.collections.posts.read>>
): Promise<PostItem | null> {
  if (!post) return null;

  // Ensure date is a string before processing
  const dateString =
    typeof post.date === "string" ? post.date : String(post.date || "");
  const date = dateString ? new Date(dateString) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime()) ? format(date, "dd MMM yyyy") : "";

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
            catItem.category
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
      if (typeof tagItem === "string") {
        tagNames.push(tagItem);
      } else if (tagItem && typeof tagItem === "object" && "tag" in tagItem) {
        // Legacy format: relationship object
        if (tagItem.tag) {
          const tagData = await reader.collections.tags.read(tagItem.tag);
          if (tagData?.name) {
            tagNames.push(String(tagData.name));
          }
        }
      }
    }
  }

  // Serialize description to ensure it's JSON-serializable (removes any functions)
  let serializedDescription: any = null;

  try {
    let rawDescription = post.description;

    // Handle if description is a function (getter/lazy-loaded value)
    if (typeof rawDescription === "function") {
      // Try to call the function to get the actual value
      try {
        rawDescription = rawDescription();
      } catch (e) {
        // If calling fails, try to access as a property or set to null
        rawDescription = (post as any).description?.value || null;
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
    title: String(post.title),
    tags: tagNames,
    categories: categoryNames,
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
  params: LatestPostsParams
): Promise<LatestPostsResponse> => {
  try {
    const allSlugs = await reader.collections.posts.list();
    const limit = params.limit ?? 10;

    // Fetch all posts to sort by date
    const postsWithDates: Array<{
      slug: string;
      date: Date | null;
      post: Awaited<ReturnType<typeof reader.collections.posts.read>>;
    }> = [];

    for (const slug of allSlugs) {
      try {
        const post = await reader.collections.posts.read(slug);
        if (post) {
          // Ensure date is a string before creating Date object
          const dateString =
            typeof post.date === "string" ? post.date : String(post.date || "");
          postsWithDates.push({
            slug,
            date: dateString ? new Date(dateString) : null,
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

    // Filter by category if specified
    let filteredPosts = postsWithDates;
    if (params.category) {
      filteredPosts = [];
      for (const item of postsWithDates) {
        if (item.post?.categories) {
          for (const catRef of item.post.categories) {
            if (catRef.category) {
              const catData = await reader.collections.categories.read(
                catRef.category
              );
              if (String(catData?.name) === params.category) {
                filteredPosts.push(item);
                break;
              }
            }
          }
        }
      }
    }

    // Apply cursor-based pagination
    let startIndex = 0;
    if (params.cursor) {
      const cursorIndex = filteredPosts.findIndex(
        (p) => p.slug === params.cursor
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

/**
 * Fetch featured post from Keystatic
 */
export const fetchFeaturedPost = async (): Promise<FeaturedPostResponse> => {
  try {
    const allSlugs = await reader.collections.posts.list();

    // Collect all posts with "Featured" tag, then pick the most recent
    const featuredCandidates: Array<{
      slug: string;
      date: Date | null;
      post: Awaited<ReturnType<typeof reader.collections.posts.read>>;
    }> = [];

    for (const slug of allSlugs) {
      try {
        const post = await reader.collections.posts.read(slug);
        if (post?.tags) {
          let isFeatured = false;
          for (const tagItem of post.tags) {
            let tagSlug: string | null = null;
            if (typeof tagItem === "string") {
              tagSlug = tagItem;
            } else if (
              tagItem &&
              typeof tagItem === "object" &&
              "tag" in tagItem
            ) {
              if (tagItem.tag) {
                tagSlug = tagItem.tag;
              }
            }
            if (tagSlug === "featured") {
              isFeatured = true;
              break;
            }
          }

          if (isFeatured) {
            const dateString =
              typeof post.date === "string"
                ? post.date
                : String(post.date || "");
            featuredCandidates.push({
              slug,
              date: dateString ? new Date(dateString) : null,
              post,
            });
          }
        }
      } catch (error) {
        console.error(
          `Failed to read post "${slug}" in fetchFeaturedPost:`,
          error
        );
      }
    }

    // Sort by date descending and pick the most recent
    featuredCandidates.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.getTime() - a.date.getTime();
    });

    if (featuredCandidates.length > 0) {
      const newest = featuredCandidates[0];
      const transformed = await transformPost(newest.slug, newest.post);
      return { post: transformed };
    }

    return { post: null };
  } catch (error) {
    console.error("Failed to fetch featured post from Keystatic:", error);
    return { post: null };
  }
};
