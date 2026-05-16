import { MEDIA_APP_URL } from "../../../apps-urls";
import type { ReportItem } from "@/types/media";

export interface FetchLatestReportsParams {
  limit?: number;
  cursor?: string;
  category?: string;
  tag?: string;
}

export interface FetchLatestReportsResponse {
  reports: ReportItem[];
  pageInfo?: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
  };
}

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return MEDIA_APP_URL;
  }

  return "";
}

export const fetchLatestReports = async (
  params: FetchLatestReportsParams = {},
): Promise<FetchLatestReportsResponse> => {
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
    const url = `${baseUrl}/api/reports/latest${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return {
      reports: (data.reports || []) as ReportItem[],
      pageInfo: data.pageInfo,
    };
  } catch (error) {
    console.error("Failed to fetch latest reports:", error);
    return { reports: [] };
  }
};
