import { createMiddleware, routing } from "@workspace/i18n/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";

// The main web app uses routing with locale detection enabled
// and doesn't need preserveProxiedLocaleCookie since it's the source of truth
const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip i18n for paths that are proxied to other Vercel apps via rewrites
  // These paths are handled by their respective app's middleware
  if (
    pathname.startsWith("/accelerate") ||
    pathname.startsWith("/breakpoint") ||
    pathname === "/developers" ||
    pathname.startsWith("/developers/templates") ||
    pathname.startsWith("/developers/cookbook") ||
    pathname.startsWith("/developers/guides") ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/learn") ||
    (pathname.startsWith("/news") && !pathname.startsWith("/newsletter")) ||
    pathname.startsWith("/podcasts") ||
    pathname.startsWith("/media-assets") ||
    pathname.startsWith("/opengraph")
  ) {
    return NextResponse.next();
  }

  const canonicalSkillPath = "/SKILL.md";
  if (pathname.toLowerCase() === "/skill.md") {
    if (pathname !== canonicalSkillPath) {
      return NextResponse.redirect(
        `${req.nextUrl.origin}${canonicalSkillPath}`,
        308,
      );
    }

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

  const response = await handleI18nRouting(req);

  if (pathname.includes("/playgg")) {
    response.headers.set("x-custom-layout", "true");
  }

  return response;
}

export const config = {
  // Exclude paths that are proxied to other Vercel apps (handled by their own middleware)
  // Also exclude api routes, static files, and Next.js internals
  matcher: [
    "/SKILL.md",
    "/skill.md",
    "/((?!api|opengraph|_next|_vercel|accelerate|breakpoint|docs|learn|news(?!letter)|podcasts|media-assets|.*\\..*).*)",
  ],
  runtime: "nodejs",
};
