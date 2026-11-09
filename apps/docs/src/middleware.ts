import {
  createMiddleware,
  getEffectiveOrigin,
  routingWithoutDetection,
} from "@workspace/i18n/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@workspace/i18n/config";
import { prefersMarkdown } from "@/lib/docs/negotiation";
import { isDocsPagePath, isKnownDocsPage } from "@/lib/docs/page-paths";

// Pages under these prefixes, and the /developers landing, have a Markdown
// twin: `<page>.md`, or the page URL with an Accept header that prefers
// text/markdown (lib/docs/negotiation.ts). /learn is apps/web's.
const MARKDOWN_PREFIXES = [
  "/docs",
  "/developers/docs",
  "/developers/cookbook",
  "/developers/bootcamp",
] as const;
const MARKDOWN_PAGES = ["/developers"] as const;
const MARKDOWN_API_PREFIX = "/api/markdown";
const SOLANA_SITE_ORIGIN = "https://solana.com";
const DOCS_VERCEL_HOST = "solana-com-docs.vercel.app";
// No route matches it, so Next answers with the not-found page
// (app/global-not-found.tsx) and a 404.
const NOT_FOUND_PATH = "/_docs/not-found";
const DOCS_LLMS_TXT = `${SOLANA_SITE_ORIGIN}/developers/docs/llms.txt`;

function matchesMarkdownPrefix(path: string): boolean {
  const pathWithoutExt = path.endsWith(".md") ? path.slice(0, -3) : path;
  return (
    MARKDOWN_PAGES.some((page) => pathWithoutExt === page) ||
    MARKDOWN_PREFIXES.some(
      (prefix) =>
        pathWithoutExt === prefix || pathWithoutExt.startsWith(`${prefix}/`),
    )
  );
}

function decodePath(path: string): string {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

/**
 * A negotiated URL answers by Accept header as well as by URL, so caches
 * keep one copy per Accept value. Next's own Vary for app pages (the
 * routes manifest's `rsc.varyHeader`) is repeated first, for a platform
 * that replaces the page's Vary with this one rather than merging them.
 * (`next start` keeps only Next's own on app pages.)
 */
const NEGOTIATED_VARY =
  "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept";

/**
 * The HTML page: Vary, and where its Markdown twin and the docs index are
 * (RFC 8288 Link).
 */
function withNegotiationHeaders(
  response: Response,
  publicPath: string,
): Response {
  if (response.status !== 200) return response;
  response.headers.set("Vary", NEGOTIATED_VARY);
  response.headers.append(
    "Link",
    [
      `<${SOLANA_SITE_ORIGIN}${publicPath}.md>; rel="alternate"; type="text/markdown"`,
      `<${DOCS_LLMS_TXT}>; rel="describedby"; type="text/plain"`,
    ].join(", "),
  );
  return response;
}

// The markdown route takes the public path, locale included:
// /api/markdown/ja/developers/docs/quickstart.
function rewriteToMarkdownApi(
  req: NextRequest,
  locale: string | undefined,
  segments: string[],
) {
  const url = req.nextUrl.clone();
  const prefix = locale && locale !== defaultLocale ? `/${locale}` : "";
  url.pathname = `${MARKDOWN_API_PREFIX}${prefix}/${segments.join("/")}`;
  return NextResponse.rewrite(url);
}

function redirectWithEffectiveOrigin(
  req: NextRequest,
  pathname: string,
  status?: number,
  search = "",
) {
  const url = getEffectiveOrigin(req);
  url.pathname = pathname;
  url.search = search;
  return NextResponse.redirect(url, status);
}

// routingWithoutDetection: prevents redirects based on Accept-Language that would leak Vercel URL
// preserveProxiedLocaleCookie: prevents overwriting the main app's NEXT_LOCALE cookie
// when requests come through the web app's rewrite (fixes "random language" bug)
const handleI18nRouting = createMiddleware(routingWithoutDetection, {
  preserveProxiedLocaleCookie: true,
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The production Vercel alias is also the web app's rewrite target. Only
  // redirect direct visits: rewritten solana.com requests carry their public
  // host in x-forwarded-host and must continue to render here. Keep the direct
  // markdown API here because the web app does not proxy /api/markdown.
  if (
    pathname !== MARKDOWN_API_PREFIX &&
    !pathname.startsWith(`${MARKDOWN_API_PREFIX}/`) &&
    getEffectiveOrigin(req).hostname === DOCS_VERCEL_HOST
  ) {
    return NextResponse.redirect(
      new URL(`${pathname}${req.nextUrl.search}`, SOLANA_SITE_ORIGIN),
      308,
    );
  }

  if (
    pathname === MARKDOWN_API_PREFIX ||
    pathname.startsWith(`${MARKDOWN_API_PREFIX}/`)
  ) {
    return NextResponse.next();
  }

  if (pathname !== pathname.toLowerCase()) {
    return redirectWithEffectiveOrigin(
      req,
      pathname.toLowerCase(),
      308,
      req.nextUrl.search,
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
    return redirectWithEffectiveOrigin(
      req,
      cleanedPath,
      undefined,
      req.nextUrl.search,
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
  const locale = hasLocalePrefix ? pathSegments[0] : undefined;
  const normalizedSegments = hasLocalePrefix
    ? pathSegments.slice(1)
    : pathSegments;
  const normalizedPath = `/${normalizedSegments.join("/")}`;

  if (
    normalizedSegments[0] === "developers" &&
    normalizedSegments[1] === "learn"
  ) {
    const redirectedSegments = [...normalizedSegments];
    redirectedSegments[1] = "bootcamp";
    const url = req.nextUrl.clone();
    url.pathname = hasLocalePrefix
      ? `/${[pathSegments[0], ...redirectedSegments].join("/")}`
      : `/${redirectedSegments.join("/")}`;
    return redirectWithEffectiveOrigin(req, url.pathname, 308, url.search);
  }

  // A page's /index URL is the page's own: one URL per page.
  if (
    normalizedSegments.at(-1) === "index" &&
    matchesMarkdownPrefix(normalizedPath)
  ) {
    return redirectWithEffectiveOrigin(
      req,
      pathname.replace(/\/index$/, ""),
      308,
      req.nextUrl.search,
    );
  }

  if (normalizedPath.endsWith(".md") && matchesMarkdownPrefix(normalizedPath)) {
    const segments = [...normalizedSegments];
    segments[segments.length - 1] = segments[segments.length - 1].slice(0, -3);
    return rewriteToMarkdownApi(req, locale, segments);
  }

  const negotiable =
    !normalizedPath.endsWith("/llms.txt") &&
    matchesMarkdownPrefix(normalizedPath);
  if (!negotiable) {
    // No docs route answers other paths (on solana.com they are another
    // app's), so an agent asking for Markdown gets the Markdown 404.
    if (
      normalizedSegments.length > 0 &&
      prefersMarkdown(req.headers.get("accept"))
    ) {
      return rewriteToMarkdownApi(req, locale, normalizedSegments);
    }
    return handleI18nRouting(req);
  }

  // Accept header content negotiation (q-values count). The markdown route
  // answers a missing page with a Markdown 404.
  if (prefersMarkdown(req.headers.get("accept"))) {
    return rewriteToMarkdownApi(req, locale, normalizedSegments);
  }

  // A missing docs page: a real 404 page, rendered on the server.
  if (
    isDocsPagePath(normalizedPath) &&
    !isKnownDocsPage(decodePath(normalizedPath), locale)
  ) {
    const url = req.nextUrl.clone();
    url.pathname = NOT_FOUND_PATH;
    url.search = "";
    const response = NextResponse.rewrite(url);
    response.headers.set("Vary", NEGOTIATED_VARY);
    return response;
  }

  const publicPath = `${locale && locale !== defaultLocale ? `/${locale}` : ""}${normalizedPath}`;
  return withNegotiationHeaders(await handleI18nRouting(req), publicPath);
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
