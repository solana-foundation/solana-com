import createMiddleware from "next-intl/middleware";
import { routing } from "@workspace/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";

const basePath =
  process.env.NEXT_PUBLIC_USE_BASE_PATH === "true"
    ? "/developers/templates"
    : undefined;

// next-intl's middleware options typing doesn't expose basePath, but the runtime supports it.
// Cast to keep TypeScript happy while allowing basePath-aware routing in the proxied build.
const handleI18nRouting = createMiddleware(routing, {
  basePath,
} as unknown as Parameters<typeof createMiddleware>[1]);

export default async function middleware(req: NextRequest) {
  console.log(
    "[templates-mw]",
    JSON.stringify({
      path: req.nextUrl.pathname,
      useBasePath: !!basePath,
    }),
  );

  // If basePath is active, strip it before handing off to next-intl so routes resolve.
  if (basePath && req.nextUrl.pathname.startsWith(basePath)) {
    const url = req.nextUrl.clone();
    const stripped = url.pathname.slice(basePath.length) || "/";
    url.pathname = stripped.startsWith("/") ? stripped : `/${stripped}`;
    console.log(
      "[templates-mw]",
      JSON.stringify({
        action: "rewrite",
        original: req.nextUrl.pathname,
        stripped: url.pathname,
      }),
    );
    const rewrittenReq = new NextRequest(url, {
      headers: req.headers,
      method: req.method,
      body: req.body,
    });
    return handleI18nRouting(rewrittenReq);
  }

  console.log(
    "[templates-mw]",
    JSON.stringify({ action: "passthrough", path: req.nextUrl.pathname }),
  );

  // Lowercase URL redirect
  if (req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase()) {
    return NextResponse.redirect(
      `${req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()}`,
    );
  }

  // Remove duplicate locale segments from path
  const pathSegments = req.nextUrl.pathname.split("/").filter(Boolean);
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
  matcher: [
    "/developers/templates/:path*",
    "/((?!api|opengraph|_next|_vercel|.*\\..*).*)",
  ],
  runtime: "nodejs",
};
