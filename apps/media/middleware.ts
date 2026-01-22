import {
  createMiddleware,
  routingWithoutDetection,
} from "@workspace/i18n/middleware";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// routingWithoutDetection prevents redirects that leak the Vercel URL
// When accessed via rewrite from solana.com, next-intl would redirect to
// solana-com-media.vercel.app/ru/... because req.url is the rewrite destination
//
// preserveProxiedLocaleCookie: true prevents overwriting the main app's NEXT_LOCALE cookie
// when requests come through the web app's rewrite (fixes "random language" bug)
const handleI18nRouting = createMiddleware(routingWithoutDetection, {
  preserveProxiedLocaleCookie: true,
});

const SESSION_COOKIE_NAME = "admin_session";

// Get JWT secret - must be available at middleware runtime
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }
  return new TextEncoder().encode(secret);
};

// Verify session token in middleware (Edge-compatible)
async function verifySession(token: string): Promise<boolean> {
  const secret = getJwtSecret();
  if (!secret) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.type === "session" && typeof payload.email === "string";
  } catch {
    return false;
  }
}

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Handle Keystatic admin routes - skip i18n and auth
  // Keystatic uses GitHub OAuth for authentication
  if (pathname.startsWith("/keystatic")) {
    return NextResponse.next();
  }

  // Redirect /admin to /keystatic for backwards compatibility
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/keystatic", req.url));
  }

  // Handle legacy admin routes - check authentication
  if (pathname.startsWith("/admin")) {
    // Allow login and auth callback routes without authentication
    if (
      pathname.startsWith("/admin/login") ||
      pathname.startsWith("/admin/auth") ||
      pathname.startsWith("/admin/logout")
    ) {
      return NextResponse.next();
    }

    // Skip auth check in local development mode
    if (process.env.TINA_PUBLIC_IS_LOCAL === "true") {
      return NextResponse.next();
    }

    // Check for session cookie
    const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Verify the session token
    const isValid = await verifySession(sessionToken);

    if (!isValid) {
      // Clear invalid session and redirect to login
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
      return response;
    }

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
    // Match keystatic paths (for i18n skip)
    "/keystatic/:path*",
    // Match admin paths for authentication
    "/admin/:path*",
    // Match all paths except static files and Next.js internals
    "/((?!api|_next|_vercel|uploads|video|favicon|.*\\..*).*)",
  ],
  runtime: "nodejs",
};
