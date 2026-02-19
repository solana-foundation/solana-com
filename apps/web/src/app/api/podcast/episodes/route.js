import { NextResponse } from "next/server";

import PodcastApi from "@/lib/podcast";

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const page = searchParams.get("page") ?? 0;
  const query = searchParams.get("query") ?? "";
  const sort = searchParams.get("sort") ?? "desc";

  const { episodes, hasMore } = await PodcastApi.getEpisodes({
    query,
    offset: page * 15,
    sort,
  });

  return NextResponse.json({ episodes, hasMore });
}
