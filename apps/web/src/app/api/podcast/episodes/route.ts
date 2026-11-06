import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import PodcastApi from "@/lib/podcast";

const PAGE_SIZE = 15;
const MAX_PAGE = 500;
const MAX_QUERY_LENGTH = 100;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawPage = Number.parseInt(searchParams.get("page") ?? "0", 10);
  const page = Number.isFinite(rawPage)
    ? Math.min(Math.max(rawPage, 0), MAX_PAGE)
    : 0;
  const query = (searchParams.get("query") ?? "").slice(0, MAX_QUERY_LENGTH);
  const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";

  const { episodes, hasMore } = await PodcastApi.getEpisodes({
    query,
    offset: page * PAGE_SIZE,
    sort,
  });

  return NextResponse.json(
    { episodes, hasMore },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
