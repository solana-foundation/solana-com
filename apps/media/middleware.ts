import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "@workspace/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// localeDetection: false prevents redirects that leak the Vercel URL
// When accessed via rewrite from solana.com, next-intl would redirect to
// solana-com-media.vercel.app/ru/... because req.url is the rewrite destination
const handleI18nRouting = createMiddleware({
  ...routing,
  localeDetection: false,
});

/**
 * Paths that require authentication
 */
const PROTECTED_PATHS = ["/admin", "/api/tina"];

/**
 * Paths that should never require authentication
 */
const PUBLIC_PATHS = [
  "/admin/login",
  "/api/auth", // NextAuth routes
];

/**
 * Check if a path requires authentication
 */
function isProtectedPath(pathname: string): boolean {
  // Check if it's a public path first
  for (const publicPath of PUBLIC_PATHS) {
    if (pathname.startsWith(publicPath)) {
      return false;
    }
  }

  // Check if it's a protected path
  for (const protectedPath of PROTECTED_PATHS) {
    if (pathname.startsWith(protectedPath)) {
      return true;
    }
  }

  return false;
}

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Handle protected routes (admin and tina API)
  if (isProtectedPath(pathname)) {
    // Check for valid JWT token
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    // If no token, redirect to login (for pages) or return 401 (for API)
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Redirect to login page with callback URL
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Skip i18n for /admin path (TinaCMS admin panel)
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Skip i18n for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Lowercase all paths
  if (pathname !== pathname.toLowerCase()) {
    return NextResponse.redirect(
      new URL(pathname.toLowerCase() + req.nextUrl.search, req.url)
    );
  }

  return handleI18nRouting(req);
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next|_vercel|uploads|video|favicon|.*\\..*).*)",
  ],
  runtime: "nodejs",
};
