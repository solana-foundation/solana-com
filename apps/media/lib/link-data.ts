import client from "@/tina/__generated__/client";
import { LinkItem } from "./link-types";
import { transformLink } from "./link-utils";
import { PageInfo } from "@/tina/__generated__/types";

export interface LatestLinksParams {
  limit?: number;
  cursor?: string;
  category?: string;
}

export interface LatestLinksResponse {
  links: LinkItem[];
  pageInfo?: PageInfo;
}

/**
 * Fetch latest links from TinaCMS
 */
export const fetchLatestLinks = async (
  params: LatestLinksParams
): Promise<LatestLinksResponse> => {
  try {
    const response = await client.queries.linkConnection({
      last: params.limit ?? 10,
      sort: "publishedAt",
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

    if (!response.data.linkConnection.edges) {
      return { links: [] };
    }

    const edges = response.data.linkConnection.edges || [];
    const links: LinkItem[] = edges
      .map((edge) => transformLink(edge as any))
      .filter((link): link is LinkItem => link !== null)
      .reverse(); // Reverse to show newest first (descending order)

    return {
      links,
      pageInfo: response.data.linkConnection.pageInfo,
    };
  } catch (error) {
    console.error("Failed to fetch latest links from TinaCMS:", error);
    return { links: [] };
  }
};

export interface FeaturedLinksResponse {
  links: LinkItem[];
}

/**
 * Fetch featured links from TinaCMS
 */
export const fetchFeaturedLinks = async (
  limit: number = 5
): Promise<FeaturedLinksResponse> => {
  try {
    const response = await client.queries.linkConnection({
      last: limit,
      sort: "publishedAt",
      filter: {
        featured: { eq: true },
      },
    });

    if (!response.data.linkConnection.edges) {
      return { links: [] };
    }

    const edges = response.data.linkConnection.edges || [];
    const links: LinkItem[] = edges
      .map((edge) => transformLink(edge as any))
      .filter((link): link is LinkItem => link !== null)
      .reverse(); // Reverse to show newest first (descending order)

    return { links };
  } catch (error) {
    console.error("Failed to fetch featured links from TinaCMS:", error);
    return { links: [] };
  }
};

/**
 * Fetch links by tag
 */
export const fetchLinksByTag = async (
  tagName: string,
  limit: number = 10
): Promise<LatestLinksResponse> => {
  try {
    const response = await client.queries.linkConnection({
      last: limit,
      sort: "publishedAt",
      filter: {
        tags: {
          tag: {
            tag: {
              name: { eq: tagName },
            },
          },
        },
      },
    });

    if (!response.data.linkConnection.edges) {
      return { links: [] };
    }

    const edges = response.data.linkConnection.edges || [];
    const links: LinkItem[] = edges
      .map((edge) => transformLink(edge as any))
      .filter((link): link is LinkItem => link !== null)
      .reverse(); // Reverse to show newest first (descending order)

    return {
      links,
      pageInfo: response.data.linkConnection.pageInfo,
    };
  } catch (error) {
    console.error("Failed to fetch links by tag from TinaCMS:", error);
    return { links: [] };
  }
};
