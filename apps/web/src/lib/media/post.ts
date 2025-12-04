import { PostItem } from "@/types/media";
import { isExternalLink } from "../utils/isExternalLink";
import { MAIN_APP_URL } from "@@/apps-urls";

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
    let url = `${MAIN_APP_URL}/api/posts/latest`;

    if (params.limit) {
      url += `?limit=${params.limit}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      posts: (data.posts?.map((post: PostItem) => ({
        ...post,
        heroImage:
          post.heroImage && !isExternalLink(post.heroImage)
            ? `/media-assets${post.heroImage}`
            : post.heroImage,
      })) || []) as PostItem[],
    };
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    return { posts: [] };
  }
};
