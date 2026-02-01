import {
  createMiddleware,
  routingWithoutDetection,
} from "@workspace/i18n/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";

// routingWithoutDetection: prevents redirects based on Accept-Language that would leak Vercel URL
// preserveProxiedLocaleCookie: prevents overwriting the main app's NEXT_LOCALE cookie
// when requests come through the web app's rewrite (fixes "random language" bug)
const handleI18nRouting = createMiddleware(routingWithoutDetection, {
  preserveProxiedLocaleCookie: true,
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle index.html.md requests (for directory URLs)
  if (pathname.endsWith("/index.html.md")) {
    const basePath = pathname.slice(0, -14); // Remove /index.html.md
    const url = req.nextUrl.clone();
    url.pathname = `/api/md${basePath}`;
    return NextResponse.rewrite(url);
  }

  // Handle .md requests - serve raw markdown for LLM consumption
  // See https://llmstxt.org/ for specification
  if (pathname.endsWith(".md")) {
    // Remove .md extension and rewrite to API route
    const basePath = pathname.slice(0, -3);
    const url = req.nextUrl.clone();
    url.pathname = `/api/md${basePath}`;
    return NextResponse.rewrite(url);
  }

  if (pathname !== pathname.toLowerCase()) {
    return NextResponse.redirect(
      `${req.nextUrl.origin + pathname.toLowerCase()}`,
    );
  }

  // Remove duplicate locale segments from path
  const pathSegments = pathname.split("/").filter(Boolean);
  const localeSegments = pathSegments.filter((segment) =>
    locales.includes(segment),
  );

  if (localeSegments.length > 1) {
    // Keep only the first locale, remove all others
    const firstLocale = localeSegments[0];
    const cleanedSegments = pathSegments.filter(
      (segment, index) =>
        !locales.includes(segment) ||
        (segment === firstLocale && pathSegments.indexOf(segment) === index),
    );

    const cleanedPath = `/${cleanedSegments.join("/")}`;
    return NextResponse.redirect(
      `${req.nextUrl.origin}${cleanedPath}${req.nextUrl.search}`,
    );
  }

  const localeParam = req.nextUrl?.searchParams?.get("locale");
  if (localeParam && !locales.includes(localeParam)) {
    // An invalid locale search param means that the pages router was trying
    // to do a soft navigation and matched the route pages/[locale]/[...slug]
    // the right route will be resolved after the middleware adds the right locale prefix
    // we can safely remove the locale and slug params to avoid poluting the URL
    req.nextUrl.searchParams.delete("locale");
    req.nextUrl.searchParams.delete("slug");
  }

  return handleI18nRouting(req);
}

export const config = {
  // Match all paths including .md files for LLM consumption
  // Exclude api routes, static files, and Next.js internals
  matcher: [
    // Include .md files for markdown serving
    "/:path*.md",
    // Include index.html.md for directory URLs
    "/:path*/index.html.md",
    // Include all other paths except static assets
    "/((?!api|opengraph|_next|_vercel|breakpoint|news|podcasts|docs-assets|.*\\.(?!md)[^/]*$).*)",
  ],
  runtime: "nodejs",
};
