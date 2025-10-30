import createMiddleware from "next-intl/middleware";
import { routing } from "@workspace/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";

const handleI18nRouting = createMiddleware(routing);

const templatesAppUrl = process.env.TEMPLATES_APP_URL
  ? process.env.TEMPLATES_APP_URL.replace(/\/$/, "")
  : null;

export default async function middleware(req: NextRequest) {
  // Skip i18n for /breakpoint/* paths
  if (req.nextUrl.pathname.startsWith("/breakpoint")) {
    return NextResponse.next();
  }

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

  if (templatesAppUrl) {
    const pathname = req.nextUrl.pathname;
    const isTemplatesRoot =
      pathname === "/templates" || pathname.startsWith("/templates/");
    const matchedLocale = locales.find(
      (locale) =>
        pathname === `/${locale}/templates` ||
        pathname.startsWith(`/${locale}/templates/`),
    );

    if (isTemplatesRoot || matchedLocale) {
      const rewriteUrl = new URL(pathname, `${templatesAppUrl}/`);
      rewriteUrl.search = req.nextUrl.search;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  return handleI18nRouting(req);
}

export const config = {
  matcher: ["/((?!api|opengraph|_next|_vercel|breakpoint|.*\\..*).*)"],
  runtime: "nodejs",
};
