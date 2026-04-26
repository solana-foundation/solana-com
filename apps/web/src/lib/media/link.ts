import type { LinkItem } from "@/types/media";
import { MEDIA_APP_URL } from "../../../apps-urls";

export interface FetchLatestLinksParams {
  limit?: number;
  cursor?: string;
  category?: string;
  tag?: string;
}

export interface FetchLatestLinksResponse {
  links: LinkItem[];
}

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return MEDIA_APP_URL;
  }

  return "";
}

export const fetchLatestLinks = async (
  params: FetchLatestLinksParams = {},
): Promise<FetchLatestLinksResponse> => {
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
    const url = `${baseUrl}/api/links/latest${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return {
      links: Array.isArray(data)
        ? (data as LinkItem[])
        : ((data.links || []) as LinkItem[]),
    };
  } catch (error) {
    console.error("Failed to fetch latest links:", error);
    return { links: [] };
  }
};
