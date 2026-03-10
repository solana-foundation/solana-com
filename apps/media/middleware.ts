import {
  createMiddleware,
  routingWithoutDetection,
} from "@workspace/i18n/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";
import { verifyJwt } from "./lib/auth/jwt";
import { isAuthEnabled } from "./lib/auth/config";

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

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("keystatic_session")?.value;
  if (!token) return false;
  const payload = await verifyJwt(token);
  return payload !== null;
}

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Handle Keystatic admin routes — apply JWT auth if enabled
  if (pathname.startsWith("/keystatic")) {
    // Login page is always accessible
    if (pathname.startsWith("/keystatic/login")) {
      return NextResponse.next();
    }

    // If auth is enabled, check JWT
    if (isAuthEnabled()) {
      const authed = await isAuthenticated(req);
      if (!authed) {
        const loginUrl = new URL("/keystatic/login", req.url);
        // Use 127.0.0.1 to match Keystatic's RedirectToLoopback cookie domain
        if (loginUrl.hostname === "localhost") {
          loginUrl.hostname = "127.0.0.1";
        }
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  }

  // Skip i18n for API routes, but apply auth to Keystatic API
  if (pathname.startsWith("/api")) {
    // Auth API routes are always public
    if (pathname.startsWith("/api/auth/")) {
      return NextResponse.next();
    }

    // Protect Keystatic API routes
    if (pathname.startsWith("/api/keystatic")) {
      if (isAuthEnabled()) {
        const authed = await isAuthenticated(req);
        if (!authed) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      }
    }

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
    // Match all paths except static files and API routes
    // Allow .md files through so middleware can serve them as markdown
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?!md$).*|uploads).*)",
    "/api/markdown/:path*",
    "/api/keystatic/:path*",
    "/api/auth/:path*",
  ],
  runtime: "nodejs",
};
