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

  const date = post.date ? new Date(post.date) : null;
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
  const categoryNames: string[] = [];
  if (post.categories) {
    for (const catRef of post.categories) {
      if (catRef.category) {
        const catData = await reader.collections.categories.read(
          catRef.category
        );
        if (catData?.name) {
          categoryNames.push(String(catData.name));
        }
      }
    }
  }

  // Resolve tag names
  const tagNames: string[] = [];
  if (post.tags) {
    for (const tagRef of post.tags) {
      if (tagRef.tag) {
        const tagData = await reader.collections.tags.read(tagRef.tag);
        if (tagData?.name) {
          tagNames.push(String(tagData.name));
        }
      }
    }
  }

  return {
    id: slug,
    published: formattedDate,
    title: String(post.title),
    tags: tagNames,
    categories: categoryNames,
    url: `/news/${slug}`,
    description: post.description as any, // Markdoc content type differs from TinaMarkdownContent
    heroImage: post.heroImage || "/media-assets/uploads/posts/default-blog.webp",
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
      const post = await reader.collections.posts.read(slug);
      if (post) {
        postsWithDates.push({
          slug,
          date: post.date ? new Date(post.date) : null,
          post,
        });
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

    // Find posts with "Featured" tag
    for (const slug of allSlugs) {
      const post = await reader.collections.posts.read(slug);
      if (post?.tags) {
        for (const tagRef of post.tags) {
          if (tagRef.tag) {
            const tagData = await reader.collections.tags.read(tagRef.tag);
            if (String(tagData?.name) === "Featured") {
              const transformed = await transformPost(slug, post);
              return { post: transformed };
            }
          }
        }
      }
    }

    return { post: null };
  } catch (error) {
    console.error("Failed to fetch featured post from Keystatic:", error);
    return { post: null };
  }
};
