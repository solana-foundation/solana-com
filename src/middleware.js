import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config.cjs";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req) {
  // Handle lowercase redirects
  if (req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase()) {
    return NextResponse.redirect(
      `${req.nextUrl.origin}${req.nextUrl.pathname.toLowerCase()}`,
    );
  }

  // Clean up invalid locale params from the URL
  const localeParam = req.nextUrl?.searchParams?.get("locale");
  if (localeParam && !locales.includes(localeParam)) {
    req.nextUrl.searchParams.delete("locale");
    req.nextUrl.searchParams.delete("slug");
  }

  const response = await handleI18nRouting(req);
  const urlLocale = locales.find((locale) =>
    req.nextUrl.pathname.startsWith(`/${locale}`),
  );

  // Sync cookie with URL locale for better consistency
  if (req.headers.get("referer")) {
    const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
    if (cookieLocale && cookieLocale !== defaultLocale && !urlLocale) {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/${cookieLocale}${req.nextUrl.pathname}`,
      );
    }
  }

  response.cookies.set("NEXT_LOCALE", urlLocale || defaultLocale);
  return response;
}

export const config = {
  matcher: ["/((?!api|opengraph|_next|_vercel|.*\\..*).*)"],
};
