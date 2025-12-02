import { locales } from "@workspace/i18n/config";
import { NextRequest, NextResponse } from "next/server";

const basePath =
  process.env.NEXT_PUBLIC_USE_BASE_PATH === "true"
    ? "/developers/templates"
    : "";
const defaultLocale = "en";
const localeSet = new Set(locales);

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const search = req.nextUrl.search;

  // Normalize base path handling: if missing locale, insert default locale
  const prefix = basePath || "";
  const isUnderBasePath =
    prefix === "" ? true : path === prefix || path.startsWith(`${prefix}/`);

  if (isUnderBasePath) {
    // Compute path relative to basePath
    const relative =
      prefix && path.startsWith(prefix)
        ? path.slice(prefix.length) || "/"
        : path;
    const segments = relative.split("/").filter(Boolean);

    if (segments.length === 0) {
      // / or /developers/templates -> redirect to default locale
      return NextResponse.redirect(
        new URL(`${prefix}/${defaultLocale}`, req.nextUrl),
      );
    }

    const first = segments[0];
    if (!localeSet.has(first)) {
      // Missing locale segment; insert default locale
      const rest = segments.join("/");
      const target = `${prefix}/${defaultLocale}/${rest}`;
      return NextResponse.redirect(new URL(target, req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|opengraph|_next/static|_next/image|_vercel|.*\\..*).*)"],
  runtime: "nodejs",
};
