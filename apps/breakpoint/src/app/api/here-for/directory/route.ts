import { NextResponse } from "next/server";
import { loadDirectory } from "@/lib/here-for/data";
export const runtime = "nodejs";
// The directory only changes when someone reruns the seed script, so the CDN
// serves it and the database sees about one read an hour.
export async function GET() {
  try {
    return NextResponse.json(await loadDirectory(), {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Directory unavailable.", code: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
