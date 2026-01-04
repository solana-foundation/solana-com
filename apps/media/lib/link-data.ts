import client from "@/tina/__generated__/client";
import { LinkItem } from "./link-types";
import { transformLink } from "./link-utils";
import { PageInfo } from "@/tina/__generated__/types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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
    // Fetch more items than needed to ensure we get the most recent ones after sorting
    // Multiply by 2 to have a buffer, but cap at 100 to avoid fetching too many
    const fetchLimit = Math.min((params.limit ?? 10) * 2, 100);

    const response = await client.queries.linkConnection({
      last: fetchLimit,
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

    // Sort edges by publishedAt in descending order (most recent first) before transforming
    const sortedEdges = [...edges].sort((a, b) => {
      const dateA = a?.node?.publishedAt;
      const dateB = b?.node?.publishedAt;

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1; // Put items without dates at the end
      if (!dateB) return -1;

      // Compare UTC dates - most recent first (descending)
      return dayjs.utc(dateB).valueOf() - dayjs.utc(dateA).valueOf();
    });

    // Transform and limit to requested number
    const links: LinkItem[] = sortedEdges
      .map((edge) => transformLink(edge as any))
      .filter((link): link is LinkItem => link !== null)
      .slice(0, params.limit ?? 10);

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

    // Sort edges by publishedAt in descending order (most recent first) before transforming
    const sortedEdges = [...edges].sort((a, b) => {
      const dateA = a?.node?.publishedAt;
      const dateB = b?.node?.publishedAt;

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1; // Put items without dates at the end
      if (!dateB) return -1;

      // Compare UTC dates - most recent first (descending)
      return dayjs.utc(dateB).valueOf() - dayjs.utc(dateA).valueOf();
    });

    // Transform and limit to requested number
    const links: LinkItem[] = sortedEdges
      .map((edge) => transformLink(edge as any))
      .filter((link): link is LinkItem => link !== null)
      .slice(0, limit);

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

    // Sort edges by publishedAt in descending order (most recent first) before transforming
    const sortedEdges = [...edges].sort((a, b) => {
      const dateA = a?.node?.publishedAt;
      const dateB = b?.node?.publishedAt;

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1; // Put items without dates at the end
      if (!dateB) return -1;

      // Compare UTC dates - most recent first (descending)
      return dayjs.utc(dateB).valueOf() - dayjs.utc(dateA).valueOf();
    });

    // Transform and limit to requested number
    const links: LinkItem[] = sortedEdges
      .map((edge) => transformLink(edge as any))
      .filter((link): link is LinkItem => link !== null)
      .slice(0, limit);

    return {
      links,
      pageInfo: response.data.linkConnection.pageInfo,
    };
  } catch (error) {
    console.error("Failed to fetch links by tag from TinaCMS:", error);
    return { links: [] };
  }
};
