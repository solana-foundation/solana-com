import { createMiddleware, routing } from "@workspace/i18n/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";
import { getPathnameWithoutLocale } from "@workspace/i18n/pathname";

// The main web app uses routing with locale detection enabled
// and doesn't need preserveProxiedLocaleCookie since it's the source of truth
const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const pathSegments = pathname.split("/").filter(Boolean);
  const normalizedPathname = getPathnameWithoutLocale(pathname);

  // Skip i18n for paths that are proxied to other Vercel apps via rewrites
  // These paths are handled by their respective app's middleware
  if (
    normalizedPathname.startsWith("/accelerate") ||
    normalizedPathname.startsWith("/breakpoint") ||
    normalizedPathname === "/developers" ||
    normalizedPathname.startsWith("/developers/templates") ||
    normalizedPathname.startsWith("/developers/cookbook") ||
    normalizedPathname.startsWith("/developers/guides") ||
    normalizedPathname.startsWith("/developers/bootcamp") ||
    normalizedPathname.startsWith("/docs") ||
    normalizedPathname.startsWith("/learn") ||
    (normalizedPathname.startsWith("/news") &&
      !normalizedPathname.startsWith("/newsletter")) ||
    normalizedPathname.startsWith("/reports") ||
    normalizedPathname.startsWith("/podcasts") ||
    normalizedPathname === "/upgrade" ||
    normalizedPathname.startsWith("/upgrades") ||
    normalizedPathname.startsWith("/media-assets") ||
    normalizedPathname.startsWith("/templates-assets") ||
    normalizedPathname.startsWith("/opengraph")
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

    // Rewrite /SKILL.md to the skills.md route handler
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = "/skill.md";
    return NextResponse.rewrite(rewriteUrl);
  }

  if (pathname !== pathname.toLowerCase()) {
    return NextResponse.redirect(
      `${req.nextUrl.origin + pathname.toLowerCase()}`,
    );
  }

  // Remove duplicate locale segments from path
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

  return response;
}

export const config = {
  // Exclude paths that are proxied to other Vercel apps (handled by their own middleware)
  // Also exclude api routes, static files, and Next.js internals
  matcher: [
    "/SKILL.md",
    "/skill.md",
    "/((?!api|opengraph|_next|_vercel|accelerate|breakpoint|docs|learn|news(?!letter)|reports|podcasts|upgrade|upgrades|media-assets|templates-assets|.*\\..*).*)",
  ],
  runtime: "nodejs",
};
