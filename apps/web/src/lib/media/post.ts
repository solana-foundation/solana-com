import { NEXT_PUBLIC_MAIN_APP_URL } from "@/constants/apps";
import { PostItem } from "@/types/media";

export interface FetchLatestPostsParams {
  limit?: number;
}

export interface FetchLatestPostsResponse {
  posts: PostItem[];
}

/**
 * Fetch latest posts from the media app API
 */
export const fetchLatestPosts = async (
  params: FetchLatestPostsParams = {},
): Promise<FetchLatestPostsResponse> => {
  try {
    let url = `${NEXT_PUBLIC_MAIN_APP_URL}/api/posts/latest`;

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
