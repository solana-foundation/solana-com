import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import PodcastApi from "@/lib/podcast";
import {
  EPISODE_PAGE_SIZE,
  parseEpisodePage,
  parseEpisodeSort,
} from "@/lib/podcast/episode-query";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseEpisodePage(searchParams.get("page"));
  const query = searchParams.get("query") ?? "";
  const sort = parseEpisodeSort(searchParams.get("sort"));

  const { episodes, hasMore } = await PodcastApi.getEpisodes({
    query,
    offset: page * EPISODE_PAGE_SIZE,
    sort,
  });

  return NextResponse.json({ episodes, hasMore });
}
