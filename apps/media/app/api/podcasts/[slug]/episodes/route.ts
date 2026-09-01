import { NextRequest, NextResponse } from "next/server";
import {
  fetchPodcastBySlug,
  fetchEpisodesForPodcast,
} from "@/lib/podcast-data";
import {
  parseEpisodeLimit,
  parseEpisodeOffset,
} from "@/lib/podcast-pagination";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const limit = parseEpisodeLimit(request.nextUrl.searchParams.get("limit"));
    const offset = parseEpisodeOffset(
      request.nextUrl.searchParams.get("offset"),
    );

    const podcast = await fetchPodcastBySlug(slug);
    if (!podcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }

    const result = await fetchEpisodesForPodcast(podcast, limit, offset);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch episodes:", error);
    return NextResponse.json(
      { error: "Failed to fetch episodes" },
      { status: 500 },
    );
  }
}
