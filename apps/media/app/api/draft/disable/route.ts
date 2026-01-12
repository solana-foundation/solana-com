import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Draft Mode Disable Route
 *
 * Disables Next.js draft mode and redirects back to the content.
 *
 * Usage:
 * GET /api/draft/disable?redirect=/news/my-post
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const redirect = searchParams.get("redirect") || "/";

  // Disable draft mode
  const draft = await draftMode();
  draft.disable();

  // Redirect to the content page
  return NextResponse.redirect(new URL(redirect, req.url));
}

export async function POST(req: NextRequest) {
  // Also support POST for programmatic disabling
  const draft = await draftMode();
  draft.disable();

  return NextResponse.json({ draftMode: false });
}
