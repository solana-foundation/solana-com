import createMiddleware from "next-intl/middleware";
import { routing } from "@workspace/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip i18n for /admin path (TinaCMS admin panel)
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Skip i18n for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Get the correct origin from Vercel's forwarded headers (when accessed via rewrites)
  const forwardedHost = req.headers.get("x-forwarded-host");
  const origin = forwardedHost
    ? `${req.headers.get("x-forwarded-proto") || "https"}://${forwardedHost}`
    : req.nextUrl.origin;

  // Lowercase all paths
  if (pathname !== pathname.toLowerCase()) {
    return NextResponse.redirect(
      new URL(pathname.toLowerCase() + req.nextUrl.search, origin)
    );
  }

  // If origin differs, create a modified request so next-intl uses the correct domain
  if (origin !== req.nextUrl.origin) {
    const modifiedUrl = new URL(
      req.nextUrl.pathname + req.nextUrl.search,
      origin
    );
    const modifiedReq = new NextRequest(modifiedUrl, {
      headers: req.headers,
      method: req.method,
    });
    return handleI18nRouting(modifiedReq);
  }

  // Let next-intl handle locale detection and routing
  // It will treat paths without locale prefix as default locale (en)
  return handleI18nRouting(req);
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!api|admin|_next|_vercel|uploads|video|favicon|.*\\..*).*)",
  ],
  runtime: "nodejs",
};
