import client from "@/tina/__generated__/client";
import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { PostConnectionEdges } from "@/tina/__generated__/types";
import { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { format } from "date-fns";
import { extractPlainText } from "@/lib/utils";

// TODO: remove
type PostItem = {
  id: string;
  published: string;
  title: string;
  tags: string[];
  categories: string[];
  url: string;
  description: TinaMarkdownContent;
  heroImage: string | null | undefined;
  author: {
    name: string;
    avatar: string | null | undefined;
  };
};

// TODO: remove
function transformPost(postData: PostConnectionEdges): PostItem | null {
  const post = postData?.node;
  if (!post) return null;

  const date = post.date ? new Date(post.date) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime()) ? format(date, "dd MMM yyyy") : "";

  return {
    id: post.id,
    published: formattedDate,
    title: post.title,
    tags: post.tags?.map((tag) => tag?.tag?.name),
    categories:
      post.categories?.map((category) => category?.category?.name) || [],
    url: `/news/${post._sys.breadcrumbs.join("/")}`,
    description: post.description,
    heroImage: post.heroImage || "/uploads/posts/default-blog.webp",
    author: {
      name: post.author?.name || "Solana Foundation",
      avatar: post.author?.avatar,
    },
  } as PostItem;
}

const CACHE_TAG = "posts";
const REVALIDATE_SECONDS = 300; // 5 minutes
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

interface PostConnectionParams {
  limit?: number;
}

/**
 * Cached function to fetch posts from TinaCMS
 */
async function fetchPosts(params: PostConnectionParams) {
  try {
    const posts = await client.queries.postConnection({
      last: params.limit ?? DEFAULT_LIMIT,
      sort: "date",
    });

    return {
      posts:
        posts.data.postConnection.edges
          ?.map((edge) => transformPost(edge as PostConnectionEdges))
          // Convert TinaMarkdownContent to plain text
          ?.map((post) => ({
            ...post,
            description: extractPlainText(post.description),
          })) || [],
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

  return params;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseQueryParams(searchParams);

    // Create cache key from params to ensure different queries are cached separately
    const cacheKey = `posts-${params.limit ?? DEFAULT_LIMIT}`;
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
