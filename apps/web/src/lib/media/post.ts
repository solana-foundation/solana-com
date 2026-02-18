import { PostItem } from "@/types/media";
import { MEDIA_APP_URL } from "../../../apps-urls";

export interface FetchLatestPostsParams {
  limit?: number;
}

export interface FetchLatestPostsResponse {
  posts: PostItem[];
}

/**
 * Get the base URL for fetching posts
 * - Client-side: use relative URL that goes through rewrites
 * - Server-side (getStaticProps): use MEDIA_APP_URL directly since rewrites don't work during build
 */
function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return MEDIA_APP_URL;
  }
  return "";
}

/**
 * On Vercel preview deployments, the cross-app rewrite chain for image
 * optimization can fail. Convert relative image URLs to absolute so
 * next/image fetches directly from the media app. On production (solana.com)
 * and localhost, keep relative URLs so they go through the normal rewrites.
 */
function resolveImageUrl(url: string | null | undefined): typeof url {
  if (!url || url.startsWith("http")) return url;
  if (process.env.VERCEL_ENV === "preview") {
    return `${MEDIA_APP_URL}${url}`;
  }
  return url;
}

/**
 * Fetch latest posts from the media app API
 */
export const fetchLatestPosts = async (
  params: FetchLatestPostsParams = {},
): Promise<FetchLatestPostsResponse> => {
  try {
    const baseUrl = getBaseUrl();
    let url = `${baseUrl}/api/posts/latest`;

    if (params.limit) {
      url += `?limit=${params.limit}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return {
      posts: ((data.posts || []) as PostItem[]).map((post) => ({
        ...post,
        heroImage: resolveImageUrl(post.heroImage),
      })),
    };
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    return { posts: [] };
  }
};
