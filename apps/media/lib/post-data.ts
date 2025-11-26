import client from "@/tina/__generated__/client";
import { PostItem } from "./post-types";
import { transformPost } from "./post-utils";
import { PageInfo, PostConnectionEdges } from "@/tina/__generated__/types";

export interface LatestPostsParams {
  limit?: number;
  cursor?: string;
  category?: string;
}

export interface LatestPostsResponse {
  posts: PostItem[];
  pageInfo?: PageInfo;
}

/**
 * Fetch latest posts from TinaCMS
 */
export const fetchLatestPosts = async (
  params: LatestPostsParams
): Promise<LatestPostsResponse> => {
  try {
    const response = await client.queries.postConnection({
      last: params.limit ?? 10,
      sort: "date",
      before: params.cursor ?? undefined,
      filter: params.category
        ? {
            categories: {
              category: {
                category: {
                  name: { eq: params.category },
                },
              },
            },
          }
        : undefined,
    });

    if (!response.data.postConnection.edges) {
      return { posts: [] };
    }

    const edges = response.data.postConnection.edges || [];
    const posts: PostItem[] = edges.map((edge) =>
      transformPost(edge as PostConnectionEdges)
    );

    return {
      posts,
      pageInfo: response.data.postConnection.pageInfo,
    };
  } catch (error) {
    console.error("Failed to fetch latest posts from TinaCMS:", error);
    return { posts: [] };
  }
};

export interface FeaturedPostResponse {
  post: PostItem | null;
}

export const fetchFeaturedPost = async (): Promise<FeaturedPostResponse> => {
  const response = await client.queries.postConnection({
    last: 1,
    sort: "date",
    filter: {
      tags: {
        tag: {
          tag: {
            name: {
              eq: "Featured",
            },
          },
        },
      },
    },
  });

  const edge = response.data.postConnection.edges?.[0];

  if (!edge) {
    return { post: null };
  }

  const post: PostItem = transformPost(edge as PostConnectionEdges);

  return {
    post,
  };
};
