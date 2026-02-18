import {
  createMiddleware,
  routingWithoutDetection,
} from "@workspace/i18n/middleware";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routingWithoutDetection, {
  preserveProxiedLocaleCookie: true,
});

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Handle Keystatic admin routes
  // Keystatic uses GitHub OAuth for authentication
  if (pathname.startsWith("/keystatic")) {
    return NextResponse.next();
  }

  // Skip i18n for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Lowercase all paths
  if (pathname !== pathname.toLowerCase()) {
    return NextResponse.redirect(
      new URL(pathname.toLowerCase() + req.nextUrl.search, req.url)
    );
  }

  return handleI18nRouting(req);
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|uploads).*)",
  ],
  runtime: "nodejs",
};
