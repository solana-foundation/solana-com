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
  // Check if we're in a server environment (getStaticProps, etc.)
  if (typeof window === "undefined") {
    // Server-side: use MEDIA_APP_URL directly
    return MEDIA_APP_URL;
  }
  // Client-side: use relative URL that goes through rewrite
  return "";
}

/**
 * On Vercel preview deployments, convert relative media image URLs to absolute
 * URLs pointing to the media app. This bypasses the cross-app rewrite chain
 * which can fail on preview deployments. On production, relative URLs are kept
 * so images are served through the standard rewrite chain on solana.com.
 */
function resolveMediaImageUrl(
  imageUrl: string | null | undefined,
): string | null | undefined {
  if (!imageUrl) return imageUrl;
  if (imageUrl.startsWith("http")) return imageUrl;

  const isPreview =
    process.env.VERCEL_ENV === "preview" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

  if (isPreview) {
    return `${MEDIA_APP_URL}${imageUrl}`;
  }

  return imageUrl;
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
        heroImage: resolveMediaImageUrl(post.heroImage),
      })),
    };
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    return { posts: [] };
  }
};
