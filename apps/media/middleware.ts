import {
  createMiddleware,
  routingWithoutDetection,
} from "@workspace/i18n/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";

// routingWithoutDetection prevents redirects that leak the Vercel URL
// When accessed via rewrite from solana.com, next-intl would redirect to
// solana-com-media.vercel.app/ru/... because req.url is the rewrite destination
//
// preserveProxiedLocaleCookie: true prevents overwriting the main app's NEXT_LOCALE cookie
// when requests come through the web app's rewrite (fixes "random language" bug)
const handleI18nRouting = createMiddleware(routingWithoutDetection, {
  preserveProxiedLocaleCookie: true,
});

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

  // Handle index.html.md requests (for directory URLs)
  if (pathname.endsWith("/index.html.md")) {
    const segments = pathname.split("/").filter(Boolean);
    const hasLocale = locales.includes(segments[0]);
    const pathWithoutLocale = hasLocale ? segments.slice(1) : segments;
    const basePath = pathWithoutLocale.slice(0, -1).join("/"); // Remove index.html.md

    const url = req.nextUrl.clone();
    url.pathname = `/api/md/${basePath}`;
    return NextResponse.rewrite(url);
  }

  // Handle .md requests - serve raw markdown for LLM consumption
  // See https://llmstxt.org/ for specification
  if (pathname.endsWith(".md")) {
    // Remove locale prefix if present, then .md extension
    const segments = pathname.split("/").filter(Boolean);
    const hasLocale = locales.includes(segments[0]);
    const pathWithoutLocale = hasLocale ? segments.slice(1) : segments;
    const basePath = pathWithoutLocale.join("/").slice(0, -3); // Remove .md

    const url = req.nextUrl.clone();
    url.pathname = `/api/md/${basePath}`;
    return NextResponse.rewrite(url);
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
    // Include .md files for markdown serving (LLM consumption)
    "/:path*.md",
    // Include index.html.md for directory URLs
    "/:path*/index.html.md",
    // Match all paths except static files and Next.js internals
    "/((?!api|admin|_next|_vercel|uploads|video|favicon|.*\\.(?!md)[^/]*$).*)",
  ],
  runtime: "nodejs",
};
