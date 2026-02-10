import {
  createMiddleware,
  routingWithoutDetection,
} from "@workspace/i18n/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";
import {
  MarkdownRequestSource,
  trackMarkdownRequest,
} from "@@/src/lib/posthog/server";

// These are the prefixes that we want to serve as markdown if
// the Accept header includes "text/markdown" or if
// the pathname ends with ".md"
const MARKDOWN_PREFIXES = [
  "/docs",
  "/developers/guides",
  "/developers/cookbook",
  "/learn",
] as const;
const MARKDOWN_API_PREFIX = "/api/markdown";

function matchesMarkdownPrefix(path: string): boolean {
  const pathWithoutExt = path.endsWith(".md") ? path.slice(0, -3) : path;
  return MARKDOWN_PREFIXES.some(
    (prefix) =>
      pathWithoutExt === prefix || pathWithoutExt.startsWith(`${prefix}/`),
  );
}

function getRouteFromMarkdownApiPath(pathname: string): string {
  const route = pathname.slice(MARKDOWN_API_PREFIX.length);
  if (!route) {
    return "/";
  }
  return route.startsWith("/") ? route : `/${route}`;
}

function trackMarkdownRequestInBackground(
  req: NextRequest,
  event: NextFetchEvent,
  route: string,
  source: MarkdownRequestSource,
) {
  const normalizedRoute = route.endsWith(".md") ? route.slice(0, -3) : route;
  event.waitUntil(
    trackMarkdownRequest({
      route: normalizedRoute,
      source,
      currentUrl: `${req.nextUrl.origin}${normalizedRoute}`,
    }),
  );
}

function rewriteToMarkdownApi(req: NextRequest, segments: string[]) {
  const url = req.nextUrl.clone();
  url.pathname = `/api/markdown/${segments.join("/")}`;
  return NextResponse.rewrite(url);
}

// routingWithoutDetection: prevents redirects based on Accept-Language that would leak Vercel URL
// preserveProxiedLocaleCookie: prevents overwriting the main app's NEXT_LOCALE cookie
// when requests come through the web app's rewrite (fixes "random language" bug)
const handleI18nRouting = createMiddleware(routingWithoutDetection, {
  preserveProxiedLocaleCookie: true,
});

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  const { pathname } = req.nextUrl;

  if (
    pathname === MARKDOWN_API_PREFIX ||
    pathname.startsWith(`${MARKDOWN_API_PREFIX}/`)
  ) {
    trackMarkdownRequestInBackground(
      req,
      event,
      getRouteFromMarkdownApiPath(pathname),
      "direct-api",
    );
    return NextResponse.next();
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

  const hasLocalePrefix = locales.includes(pathSegments[0]);
  const normalizedSegments = hasLocalePrefix
    ? pathSegments.slice(1)
    : pathSegments;
  const normalizedPath = `/${normalizedSegments.join("/")}`;

  // Accept header content negotiation for markdown
  const acceptHeader = req.headers.get("accept") || "";
  const wantsMarkdown = acceptHeader.includes("text/markdown");

  if (
    wantsMarkdown &&
    !normalizedPath.endsWith(".md") &&
    matchesMarkdownPrefix(normalizedPath)
  ) {
    trackMarkdownRequestInBackground(
      req,
      event,
      normalizedPath,
      "accept-header",
    );
    return rewriteToMarkdownApi(req, normalizedSegments);
  }

  if (normalizedPath.endsWith(".md") && matchesMarkdownPrefix(normalizedPath)) {
    trackMarkdownRequestInBackground(
      req,
      event,
      normalizedPath,
      "md-extension",
    );
    const segments = [...normalizedSegments];
    segments[segments.length - 1] = segments[segments.length - 1].slice(0, -3);
    return rewriteToMarkdownApi(req, segments);
  }

  return handleI18nRouting(req);
}

export const config = {
  // Exclude paths that are proxied to other Vercel apps (handled by their own middleware)
  // Also exclude api routes, static files, and Next.js internals
  matcher: [
    "/((?!api|opengraph|_next|_vercel|breakpoint|news|podcasts|docs-assets|.*\\.(?!md$)).*)",
    "/api/markdown/:path*",
  ],
  runtime: "nodejs",
};
