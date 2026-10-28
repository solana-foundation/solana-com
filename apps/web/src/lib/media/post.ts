import { PostItem } from "@/types/media";
import { MEDIA_APP_URL } from "../../../apps-urls";

export interface FetchLatestPostsParams {
  limit?: number;
  cursor?: string;
  category?: string;
  tag?: string;
}

export interface FetchLatestPostsResponse {
  posts: PostItem[];
  pageInfo?: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
  };
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
const fetchPosts = async (
  params: FetchLatestPostsParams = {},
  endpoint: "latest" | "startups" = "latest",
): Promise<FetchLatestPostsResponse> => {
  try {
    const baseUrl = getBaseUrl();
    const searchParams = new URLSearchParams();

    if (params.limit) {
      searchParams.set("limit", String(params.limit));
    }

    if (params.cursor) {
      searchParams.set("cursor", params.cursor);
    }

    if (params.category) {
      searchParams.set("category", params.category);
    }

    if (params.tag) {
      searchParams.set("tag", params.tag);
    }

    const query = searchParams.toString();
    const url = `${baseUrl}/api/posts/${endpoint}${query ? `?${query}` : ""}`;

    let response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    // Related Media previews can be deployment-protected and return a login
    // page. The public Media app still serves the published news feed.
    if (
      typeof window === "undefined" &&
      process.env.NODE_ENV === "production" &&
      baseUrl !== "https://solana-com-media.vercel.app" &&
      (!response.ok ||
        !response.headers.get("content-type")?.includes("application/json"))
    ) {
      response = await fetch(
        `https://solana-com-media.vercel.app/api/posts/${endpoint}${query ? `?${query}` : ""}`,
        { next: { revalidate: 300 } },
      );
    }

    if (
      !response.ok ||
      !response.headers.get("content-type")?.includes("application/json")
    ) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return {
      posts: (data.posts || []) as PostItem[],
      pageInfo: data.pageInfo,
    };
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    return { posts: [] };
  }
};

export const fetchLatestPosts = (params: FetchLatestPostsParams = {}) =>
  fetchPosts(params);

export const fetchStartupPosts = () => fetchPosts({}, "startups");
