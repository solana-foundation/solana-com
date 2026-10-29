import { defaultLocale } from "@workspace/i18n/config";
import { NextRequest, NextResponse } from "next/server";
import { getLearnPage } from "@/lib/learn";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;

  if (!slug || slug[0] !== "learn") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const page = getLearnPage(slug.slice(1), defaultLocale);

  if (!page) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(page.raw, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
