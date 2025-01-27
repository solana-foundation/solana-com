import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req) {
  if (req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase()) {
    return NextResponse.redirect(
      `${req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()}`,
    );
  }
  return handleI18nRouting(req);
}

export const config = {
  matcher: ["/((?!api|opengraph|_next|_vercel|.*\\..*).*)"],
};
