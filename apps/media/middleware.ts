import {
  createMiddleware,
  routingWithoutDetection,
} from "@workspace/i18n/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";

const MARKDOWN_PREFIXES = ["/news"] as const;

function matchesMarkdownPrefix(path: string): boolean {
  const pathWithoutExt = path.endsWith(".md") ? path.slice(0, -3) : path;
  return MARKDOWN_PREFIXES.some(
    (prefix) =>
      pathWithoutExt === prefix || pathWithoutExt.startsWith(`${prefix}/`)
  );
}

const handleI18nRouting = createMiddleware(routingWithoutDetection, {
  preserveProxiedLocaleCookie: true,
});

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip i18n for Keystatic admin and API routes
  if (pathname.startsWith("/keystatic") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Lowercase all paths
  if (pathname !== pathname.toLowerCase()) {
    return NextResponse.redirect(
      new URL(pathname.toLowerCase() + req.nextUrl.search, req.url)
    );
  }

  // Strip locale prefix to get the normalized path
  const pathSegments = pathname.split("/").filter(Boolean);
  const hasLocalePrefix = locales.includes(pathSegments[0]);
  const normalizedSegments = hasLocalePrefix
    ? pathSegments.slice(1)
    : pathSegments;
  const normalizedPath = `/${normalizedSegments.join("/")}`;

  // Serve raw markdown when Accept header requests text/markdown
  const acceptHeader = req.headers.get("accept") || "";
  const wantsMarkdown = acceptHeader.includes("text/markdown");

  if (
    wantsMarkdown &&
    !normalizedPath.endsWith(".md") &&
    matchesMarkdownPrefix(normalizedPath)
  ) {
    const url = req.nextUrl.clone();
    url.pathname = `/api/markdown/${normalizedSegments.join("/")}`;
    return NextResponse.rewrite(url);
  }

  // Serve raw markdown for .md extension URLs
  if (normalizedPath.endsWith(".md") && matchesMarkdownPrefix(normalizedPath)) {
    const segments = [...normalizedSegments];
    segments[segments.length - 1] = segments[segments.length - 1].slice(0, -3);
    const url = req.nextUrl.clone();
    url.pathname = `/api/markdown/${segments.join("/")}`;
    return NextResponse.rewrite(url);
  }

  return handleI18nRouting(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?!md$).*|uploads).*)",
    "/api/markdown/:path*",
  ],
};
