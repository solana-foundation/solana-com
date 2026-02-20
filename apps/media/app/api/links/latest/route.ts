import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { fetchLatestLinks } from "@/lib/link-data";
import { LinkItem } from "@/lib/link-types";

const CACHE_TAG = "links";
const REVALIDATE_SECONDS = 300; // 5 minutes
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Terminal item format expected by the web app
interface TerminalItem {
  id: string;
  index: number;
  title: string;
  categoryId: string;
  date: string;
  url: string;
}

// Map category names to category IDs
const CATEGORY_NAME_TO_ID: Record<string, string> = {
  DeFi: "defi",
  Institutions: "institutions",
  Consumer: "consumer",
  Developers: "developers",
  Ecosystem: "ecosystem",
  Community: "community",
  Upgrades: "upgrades",
};

interface LinkConnectionParams {
  limit?: number;
  category?: string;
}

/**
 * Transform LinkItem to TerminalItem format
 */
function transformToTerminalItem(link: LinkItem, index: number): TerminalItem {
  // Get the first category and convert to ID
  const categoryName = link.categories[0] || "";
  const categoryId =
    CATEGORY_NAME_TO_ID[categoryName] || categoryName.toLowerCase();

  return {
    id: link.id,
    index: index + 1,
    title: link.title,
    categoryId,
    date: link.publishedAt,
    url: link.url,
  };
}

/**
 * Cached function to fetch links from Keystatic
 */
async function fetchLinks(params: LinkConnectionParams) {
  try {
    // Map category ID back to category name for Keystatic query
    const categoryName = params.category
      ? Object.entries(CATEGORY_NAME_TO_ID).find(
          ([, id]) => id === params.category
        )?.[0] || params.category
      : undefined;

    const { links } = await fetchLatestLinks({
      limit: params.limit ?? DEFAULT_LIMIT,
      category: categoryName,
    });

    // Transform links to terminal format
    const terminalItems: TerminalItem[] = links.map((link, index) =>
      transformToTerminalItem(link, index)
    );

    return terminalItems;
  } catch (error) {
    console.error("Failed to fetch links:", error);
    throw error;
  }
}

/**
 * Parse and validate query parameters
 */
function parseQueryParams(searchParams: URLSearchParams): LinkConnectionParams {
  const params: LinkConnectionParams = {};

  const limitParam = searchParams.get("limit");
  if (limitParam) {
    const limit = parseInt(limitParam, 10);
    if (!Number.isNaN(limit) && limit > 0 && limit <= MAX_LIMIT) {
      params.limit = limit;
    }
  }

  const categoryParam = searchParams.get("category");
  if (categoryParam && categoryParam !== "all") {
    params.category = categoryParam;
  }

  return params;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseQueryParams(searchParams);

    // Create cache key from params to ensure different queries are cached separately
    const cacheKey = `links-${params.limit ?? DEFAULT_LIMIT}-${params.category ?? "all"}`;
    const data = await unstable_cache(() => fetchLinks(params), [cacheKey], {
      tags: [CACHE_TAG],
      revalidate: REVALIDATE_SECONDS,
    })();

    // Return the data
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
      },
    });
  } catch (error) {
    // Log the error
    console.error("Links endpoint error:", error);

    // Return the error
    return NextResponse.json(
      {
        error: "Failed to fetch links",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
