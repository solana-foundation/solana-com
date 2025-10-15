import createMiddleware from "next-intl/middleware";
import { routing } from "@workspace/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip i18n for /breakpoint/* paths
  if (pathname.startsWith("/breakpoint")) {
    return NextResponse.next();
  }

  if (pathname !== pathname.toLowerCase()) {
    return NextResponse.redirect(
      `${req.nextUrl.origin + pathname.toLowerCase()}`,
    );
  }

  // 🚨 FIX: Prevent infinite reload when multiple locales appear (e.g., /ja/us/docs)
  const pathParts = pathname.split("/").filter(Boolean);
  const detectedLocales = pathParts.filter((p) => locales.includes(p));

  if (detectedLocales.length > 1) {
    const primaryLocale = detectedLocales[0];
    const cleanPath = [
      "",
      primaryLocale,
      ...pathParts.filter((p) => !locales.includes(p) || p === primaryLocale),
    ].join("/");

    return NextResponse.redirect(new URL(cleanPath, req.url));
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
  matcher: ["/((?!api|opengraph|_next|_vercel|breakpoint|.*\\..*).*)"],
  runtime: "nodejs",
};
