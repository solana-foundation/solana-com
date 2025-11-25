import createMiddleware from "next-intl/middleware";
import { routing } from "@workspace/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale } from "@workspace/i18n/config";

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

  // Lowercase all paths
  if (pathname !== pathname.toLowerCase()) {
    return NextResponse.redirect(
      new URL(pathname.toLowerCase() + req.nextUrl.search, req.url)
    );
  }

  // Redirect default locale paths to remove locale prefix (e.g., /en/news -> /news)
  // This ensures consistency with localePrefix: "as-needed"
  if (pathname.startsWith(`/${defaultLocale}/`)) {
    const pathWithoutLocale = pathname.slice(`/${defaultLocale}`.length);
    return NextResponse.redirect(
      new URL(pathWithoutLocale + req.nextUrl.search, req.url)
    );
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
