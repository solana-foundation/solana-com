import { NextRequest, NextResponse } from "next/server";
import { reader } from "@/lib/reader";
import { isPublishedPost } from "@/lib/keystatic/post-status";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const postSlug = slug.join("/");
  const post = await reader.collections.posts.read(postSlug);

  if (!isPublishedPost(post)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const body = await post.body();

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
