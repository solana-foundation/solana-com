import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { fetchLatestDeveloperUpdates } from "@/lib/developer-updates";

const CACHE_TAG = "developer-updates";
const REVALIDATE_SECONDS = 300;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const updates = await unstable_cache(
      () => fetchLatestDeveloperUpdates(),
      ["developer-updates-latest"],
      {
        tags: [CACHE_TAG, "posts", "upgrades", "releases"],
        revalidate: REVALIDATE_SECONDS,
      },
    )();

    return NextResponse.json(
      { updates },
      {
        status: 200,
        headers: {
          "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
        },
      },
    );
  } catch (error) {
    console.error("Developer updates endpoint error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch developer updates",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
