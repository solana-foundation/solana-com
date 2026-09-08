import { NextResponse } from "next/server";
import { getAirtableSpeakers } from "@/content/speakers/airtable";
import { toSpeakerDeliveryItem } from "@/content/speakers/types";
import { AIRTABLE_CACHE_SECONDS } from "@/lib/airtable";

export const runtime = "nodejs";
// Next requires this export to be a literal; 1800 seconds = 30 minutes.
export const revalidate = 1800;

const CACHE_CONTROL = `public, s-maxage=${AIRTABLE_CACHE_SECONDS}, stale-while-revalidate=60`;

export async function GET() {
  const speakers = await getAirtableSpeakers();

  if (!speakers) {
    return NextResponse.json(
      { speakers: [], status: "unavailable" },
      {
        headers: { "Cache-Control": "no-store" },
        status: 503,
      },
    );
  }

  return NextResponse.json(
    { speakers: speakers.map(toSpeakerDeliveryItem) },
    { headers: { "Cache-Control": CACHE_CONTROL } },
  );
}
