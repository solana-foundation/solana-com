import { NextRequest, NextResponse } from "next/server";
import { MEDIA_APP_URL } from "../../../../../apps-urls";

const CACHE_SECONDS = 300;
const MAX_BYTES = 15 * 1024 * 1024;
const IMAGE_TYPES = /^image\/(?:avif|gif|jpeg|png|webp)(?:;|$)/i;
const PUBLIC_MEDIA_URL = "https://solana-com-media.vercel.app";
const FETCH_OPTIONS = { redirect: "manual", cache: "no-store" } as const;

const normalizePath = (input: string) => {
  if (input.startsWith("/media-assets/uploads/")) {
    return input.replace(/^\/media-assets/, "");
  }

  return input;
};

const isServableImage = (response: Response) => {
  const contentType = response.headers.get("Content-Type") ?? "";
  const contentLength = Number(response.headers.get("Content-Length"));

  return (
    response.ok &&
    Boolean(response.body) &&
    IMAGE_TYPES.test(contentType) &&
    !(Number.isFinite(contentLength) && contentLength > MAX_BYTES)
  );
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

  let upstreamResponse = await fetch(upstreamUrl, FETCH_OPTIONS);

  // A protected Media preview answers with a login redirect or an HTML login
  // page. Retry the same upload on the public Media origin before giving up.
  if (
    process.env.NODE_ENV === "production" &&
    MEDIA_APP_URL !== PUBLIC_MEDIA_URL &&
    !isServableImage(upstreamResponse)
  ) {
    const publicUrl = new URL(PUBLIC_MEDIA_URL);
    publicUrl.pathname = upstreamUrl.pathname;
    upstreamResponse = await fetch(publicUrl, FETCH_OPTIONS);
  }

  if (!isServableImage(upstreamResponse) || !upstreamResponse.body) {
    return new NextResponse(null, {
      status: upstreamResponse.ok ? 415 : upstreamResponse.status || 502,
      headers: { "Cache-Control": "public, s-maxage=60" },
    });
  }

  return new NextResponse(upstreamResponse.body, {
    status: 200,
    headers: {
      "Content-Type": upstreamResponse.headers.get("Content-Type") ?? "",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 2}`,
    },
  });
}
