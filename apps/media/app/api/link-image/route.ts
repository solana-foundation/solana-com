import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // Cache for 24 hours

const requestSchema = z.object({
  url: z.url(),
});

// Allowed image content types
const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
];

// Max image size (5MB)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    const parsed = requestSchema.safeParse({ url });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid URL parameter" },
        { status: 400 }
      );
    }

    const imageUrl = parsed.data.url;

    // Fetch the image with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/*",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    const contentLength = response.headers.get("content-length");

    // Validate content type
    const isValidType = ALLOWED_CONTENT_TYPES.some((type) =>
      contentType.includes(type)
    );
    if (!isValidType) {
      return NextResponse.json(
        { error: "Invalid image content type" },
        { status: 400 }
      );
    }

    // Check content length if available
    if (contentLength && parseInt(contentLength) > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Image too large" }, { status: 400 });
    }

    // Stream the image response
    const imageBuffer = await response.arrayBuffer();

    // Double-check size after download
    if (imageBuffer.byteLength > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Image too large" }, { status: 400 });
    }

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        "Content-Length": imageBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Image fetch timeout" },
        { status: 504 }
      );
    }

    console.error("Failed to proxy image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
