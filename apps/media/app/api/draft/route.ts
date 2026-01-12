import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Draft Mode Enable Route
 *
 * Enables Next.js draft mode for content preview.
 * Requires a valid signed token for security.
 *
 * Usage:
 * GET /api/draft?token=<signed-token>&slug=/news/my-post
 */

/**
 * Generate a signed preview token
 */
export function generatePreviewToken(slug: string): string {
  const secret = process.env.PREVIEW_SECRET;
  if (!secret) {
    throw new Error("PREVIEW_SECRET is not configured");
  }

  const timestamp = Date.now();
  const payload = `${slug}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

/**
 * Verify a signed preview token
 */
function verifyPreviewToken(
  token: string,
  maxAge: number = 60 * 60 * 1000 // 1 hour
): { valid: boolean; slug?: string; error?: string } {
  const secret = process.env.PREVIEW_SECRET;
  if (!secret) {
    return { valid: false, error: "PREVIEW_SECRET is not configured" };
  }

  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const [slug, timestampStr, signature] = decoded.split(":");

    if (!slug || !timestampStr || !signature) {
      return { valid: false, error: "Invalid token format" };
    }

    // Verify signature
    const payload = `${slug}:${timestampStr}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return { valid: false, error: "Invalid signature" };
    }

    // Check timestamp
    const timestamp = parseInt(timestampStr, 10);
    if (Date.now() - timestamp > maxAge) {
      return { valid: false, error: "Token expired" };
    }

    return { valid: true, slug };
  } catch {
    return { valid: false, error: "Failed to decode token" };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const slug = searchParams.get("slug") || "/";

  // If no token is provided, check if user is authenticated
  if (!token) {
    // For authenticated users, allow preview without token
    const session = await fetch(
      new URL("/api/auth/session", req.url).toString(),
      {
        headers: { cookie: req.headers.get("cookie") || "" },
      }
    ).then((r) => r.json());

    if (session?.user) {
      // Authenticated user - enable draft mode
      const draft = await draftMode();
      draft.enable();

      return NextResponse.redirect(new URL(slug, req.url));
    }

    return NextResponse.json(
      { error: "Token or authentication required" },
      { status: 401 }
    );
  }

  // Verify the token
  const verification = verifyPreviewToken(token);
  if (!verification.valid) {
    return NextResponse.json({ error: verification.error }, { status: 401 });
  }

  // Enable draft mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the content page
  const redirectSlug = verification.slug || slug;
  return NextResponse.redirect(new URL(redirectSlug, req.url));
}

/**
 * POST handler for generating preview tokens
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Generate preview URL
    const token = generatePreviewToken(slug);
    const previewUrl = new URL("/api/draft", req.url);
    previewUrl.searchParams.set("token", token);
    previewUrl.searchParams.set("slug", slug);

    return NextResponse.json({
      token,
      url: previewUrl.toString(),
      slug,
      expiresIn: "1 hour",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate token",
      },
      { status: 500 }
    );
  }
}
