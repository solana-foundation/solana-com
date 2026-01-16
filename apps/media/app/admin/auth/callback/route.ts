import { NextRequest, NextResponse } from "next/server";
import {
  verifyMagicLinkToken,
  createSessionToken,
  isEmailWhitelisted,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login?error=missing_token", request.url)
    );
  }

  // Verify the magic link token
  const payload = await verifyMagicLinkToken(token);

  if (!payload) {
    return NextResponse.redirect(
      new URL("/admin/login?error=invalid_token", request.url)
    );
  }

  // Double-check email is still whitelisted
  if (!isEmailWhitelisted(payload.email)) {
    return NextResponse.redirect(
      new URL("/admin/login?error=unauthorized", request.url)
    );
  }

  // Create session token
  const sessionToken = await createSessionToken(payload.email);

  // Redirect to admin with session cookie
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set(
    SESSION_COOKIE_NAME,
    sessionToken,
    SESSION_COOKIE_OPTIONS
  );

  return response;
}
