import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config.cjs";

const handleI18nRouting = createMiddleware(routing);

const getUrlLocale = (pathname) =>
  locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

export default async function middleware(req) {
  // Handle lowercase redirects
  if (req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase()) {
    return NextResponse.redirect(
      `${req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()}`,
    );
  }

  // Clean up invalid locale params from the URL
  const localeParam = req.nextUrl?.searchParams?.get("locale");
  if (localeParam && !locales.includes(localeParam)) {
    req.nextUrl.searchParams.delete("locale");
    req.nextUrl.searchParams.delete("slug");
  }

  const response = await handleI18nRouting(req);

  // Sync cookie with URL locale for better consistency
  response.cookies.set(
    "NEXT_LOCALE",
    getUrlLocale(req.nextUrl.pathname) || defaultLocale,
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|opengraph|_next|_vercel|.*\\..*).*)"],
};
