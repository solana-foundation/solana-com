import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { fetchLatestReports } from "@/lib/keystatic/report-data";

const CACHE_TAG = "reports";
const REVALIDATE_SECONDS = 300;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

interface ReportConnectionParams {
  limit?: number;
  cursor?: string;
  category?: string;
  tag?: string;
}

async function fetchReports(params: ReportConnectionParams) {
  try {
    return await fetchLatestReports({
      limit: params.limit ?? DEFAULT_LIMIT,
      cursor: params.cursor,
      category: params.category,
      tag: params.tag,
    });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    throw error;
  }
}

function parseQueryParams(
  searchParams: URLSearchParams
): ReportConnectionParams {
  const params: ReportConnectionParams = {};

  const limitParam = searchParams.get("limit");
  if (limitParam) {
    const limit = parseInt(limitParam, 10);
    if (!Number.isNaN(limit) && limit > 0 && limit <= MAX_LIMIT) {
      params.limit = limit;
    }
  }

  const cursorParam = searchParams.get("cursor");
  if (cursorParam) {
    params.cursor = cursorParam;
  }

  const categoryParam = searchParams.get("category");
  if (categoryParam) {
    params.category = categoryParam;
  }

  const tagParam = searchParams.get("tag");
  if (tagParam) {
    params.tag = tagParam;
  }

  return params;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseQueryParams(searchParams);
    const cacheKey = `reports-${params.limit ?? DEFAULT_LIMIT}-${params.cursor || "start"}-${params.category || "all"}-${params.tag || "all"}`;

    const data = await unstable_cache(() => fetchReports(params), [cacheKey], {
      tags: [CACHE_TAG],
      revalidate: REVALIDATE_SECONDS,
    })();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
      },
    });
  } catch (error) {
    console.error("Reports endpoint error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch reports",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
