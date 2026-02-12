import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { fetchLatestPosts } from "@/lib/keystatic/post-data";
import { extractPlainText } from "@/lib/content-renderer";

const CACHE_TAG = "posts";
const REVALIDATE_SECONDS = 300; // 5 minutes
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

interface PostConnectionParams {
  limit?: number;
  cursor?: string;
  category?: string;
}

/**
 * Cached function to fetch posts from Keystatic
 */
async function fetchPosts(params: PostConnectionParams) {
  try {
    const response = await fetchLatestPosts({
      limit: params.limit ?? DEFAULT_LIMIT,
      cursor: params.cursor,
      category: params.category,
    });

    return {
      posts:
        response.posts
          // Convert content to plain text for description
          ?.map((post) => ({
            ...post,
            description: extractPlainText(
              post.description ? String(post.description) : ""
            ),
          })) || [],
      pageInfo: response.pageInfo,
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

/**
 * Parse and validate query parameters
 */
function parseQueryParams(searchParams: URLSearchParams): PostConnectionParams {
  const params: PostConnectionParams = {};

  const limitParam = searchParams.get("limit");
  if (limitParam) {
    const limit = parseInt(limitParam, 10);
    if (!Number.isNaN(limit) && limit > 0 && limit <= MAX_LIMIT) {
      params.limit = limit;
    }
  }

  const cursorParam = searchParams.get("cursor");
  if (cursorParam) {
    params.cursor = cursorParam;
  }

  const categoryParam = searchParams.get("category");
  if (categoryParam) {
    params.category = categoryParam;
  }

  return params;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseQueryParams(searchParams);

    // Create cache key from params to ensure different queries are cached separately
    const cacheKey = `posts-${params.limit ?? DEFAULT_LIMIT}-${params.cursor || "start"}-${params.category || "all"}`;
    const data = await unstable_cache(() => fetchPosts(params), [cacheKey], {
      tags: [CACHE_TAG],
      revalidate: REVALIDATE_SECONDS,
    })();

    // Return the data
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
      },
    });
  } catch (error) {
    // Log the error
    console.error("Posts endpoint error:", error);

    // Return the error
    return NextResponse.json(
      {
        error: "Failed to fetch posts",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
