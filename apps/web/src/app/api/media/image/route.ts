import { NextRequest, NextResponse } from "next/server";
import { MEDIA_APP_URL } from "../../../../../apps-urls";

const CACHE_SECONDS = 300;
const PUBLIC_MEDIA_URL = "https://solana-com-media.vercel.app";

const isImageResponse = (response: Response) =>
  response.ok &&
  response.headers.get("Content-Type")?.toLowerCase().startsWith("image/");

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
  let upstreamResponse = await fetch(upstreamUrl, {
    next: { revalidate: CACHE_SECONDS },
  });

  // A protected Media preview may return a login page with status 200.
  // Retry public uploads before handing an image to Next's optimizer.
  if (
    process.env.NODE_ENV === "production" &&
    MEDIA_APP_URL !== PUBLIC_MEDIA_URL &&
    !isImageResponse(upstreamResponse)
  ) {
    upstreamResponse = await fetch(new URL(normalizedPath, PUBLIC_MEDIA_URL), {
      next: { revalidate: CACHE_SECONDS },
    });
  }

  if (!isImageResponse(upstreamResponse) || !upstreamResponse.body) {
    return new NextResponse(null, {
      status: upstreamResponse.ok ? 502 : upstreamResponse.status,
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
