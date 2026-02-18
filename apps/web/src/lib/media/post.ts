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
      posts: (data.posts || []) as PostItem[],
    };
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    return { posts: [] };
  }
};
