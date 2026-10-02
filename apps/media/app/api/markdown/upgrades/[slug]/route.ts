import { NextRequest, NextResponse } from "next/server";
import { reader } from "@/lib/reader";
import { isPublishedUpgrade } from "@/lib/keystatic/upgrade-status";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const entry = await reader.collections.upgrades.read(slug);

  if (!isPublishedUpgrade(entry)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const body = await entry.body();

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
