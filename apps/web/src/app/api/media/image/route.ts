import { NextRequest, NextResponse } from "next/server";
import { MEDIA_APP_URL } from "../../../../../apps-urls";

const CACHE_SECONDS = 300;

const normalizePath = (input: string) => {
  if (input.startsWith("/media-assets/uploads/")) {
    return input.replace(/^\/media-assets/, "");
  }

  return input;
};

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");

  if (!path) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 },
    );
  }

  const normalizedPath = normalizePath(path);

  if (!normalizedPath.startsWith("/uploads/")) {
    return NextResponse.json(
      { error: "Only media upload assets are supported" },
      { status: 400 },
    );
  }

  const upstreamUrl = new URL(normalizedPath, MEDIA_APP_URL);
  const upstreamResponse = await fetch(upstreamUrl, {
    next: { revalidate: CACHE_SECONDS },
  });

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return new NextResponse(null, {
      status: upstreamResponse.status || 502,
    });
  }

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: {
      "Content-Type":
        upstreamResponse.headers.get("Content-Type") ||
        "application/octet-stream",
      "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 2}`,
    },
  });
}
