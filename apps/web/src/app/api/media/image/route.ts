import { NextRequest, NextResponse } from "next/server";
import { MEDIA_APP_URL } from "../../../../../apps-urls";

const CACHE_SECONDS = 300;
const MAX_BYTES = 15 * 1024 * 1024;
const IMAGE_TYPES = /^image\/(?:avif|gif|jpeg|png|webp)(?:;|$)/i;

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

  // Resolve first, then check: `/uploads/../api/...` would pass a prefix test
  // on the raw string but normalises to a different path on the media app.
  let upstreamUrl: URL;
  try {
    upstreamUrl = new URL(normalizePath(path), MEDIA_APP_URL);
  } catch {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  if (
    upstreamUrl.origin !== new URL(MEDIA_APP_URL).origin ||
    !upstreamUrl.pathname.startsWith("/uploads/") ||
    upstreamUrl.pathname.includes("/../")
  ) {
    return NextResponse.json(
      { error: "Only media upload assets are supported" },
      { status: 400 },
    );
  }
  upstreamUrl.search = "";
  upstreamUrl.hash = "";

  const upstreamResponse = await fetch(upstreamUrl, {
    redirect: "manual",
    cache: "no-store",
  });

  const contentType = upstreamResponse.headers.get("Content-Type") ?? "";
  const contentLength = Number(upstreamResponse.headers.get("Content-Length"));
  if (
    !upstreamResponse.ok ||
    !upstreamResponse.body ||
    !IMAGE_TYPES.test(contentType) ||
    (Number.isFinite(contentLength) && contentLength > MAX_BYTES)
  ) {
    return new NextResponse(null, {
      status: upstreamResponse.ok ? 415 : upstreamResponse.status || 502,
      headers: { "Cache-Control": "public, s-maxage=60" },
    });
  }

  return new NextResponse(upstreamResponse.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 2}`,
    },
  });
}
