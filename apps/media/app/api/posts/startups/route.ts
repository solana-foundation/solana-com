import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { fetchStartupPosts } from "@/lib/startup-posts";

const REVALIDATE_SECONDS = 300;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await unstable_cache(fetchStartupPosts, ["startup-posts"], {
      tags: ["posts"],
      revalidate: REVALIDATE_SECONDS,
    })();

    return NextResponse.json(
      { posts },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
        },
      },
    );
  } catch (error) {
    console.error("Startup posts endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup posts" },
      { status: 500 },
    );
  }
}
