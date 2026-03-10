import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import PodcastApi from "@/lib/podcast";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page") ?? 0);
  const query = searchParams.get("query") ?? "";
  const sort = searchParams.get("sort") ?? "desc";

  const { episodes, hasMore } = await PodcastApi.getEpisodes({
    query,
    offset: page * 15,
    sort,
  });

  return NextResponse.json({ episodes, hasMore });
}
