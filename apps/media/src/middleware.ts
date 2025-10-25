import createMiddleware from "next-intl/middleware";
import { routing } from "@workspace/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  // Skip i18n for /admin path (TinaCMS admin panel)
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Skip i18n for API routes
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Lowercase all paths
  if (req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase()) {
    return NextResponse.redirect(
      `${req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()}${req.nextUrl.search}`
    );
  }

  // Handle paths that don't start with a valid locale
  const pathSegments = req.nextUrl.pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];

  if (firstSegment && !locales.includes(firstSegment)) {
    // Redirect to include default locale
    return NextResponse.redirect(
      new URL(`/en${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }

  return handleI18nRouting(req);
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!api|admin|_next|_vercel|uploads|video|favicon|.*\\..*).*)",
  ],
  runtime: "nodejs",
};
