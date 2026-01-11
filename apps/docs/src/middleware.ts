import createMiddleware from "next-intl/middleware";
import { routing } from "@workspace/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@workspace/i18n/config";

const handleI18nRouting = createMiddleware(routing);

function log(...args: unknown[]) {
  console.log("[docs-middleware]", ...args);
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  log("=== MIDDLEWARE START ===");
  log("pathname:", pathname);
  log("full url:", req.nextUrl.toString());
  log("method:", req.method);
  log("headers.host:", req.headers.get("host"));
  log("x-forwarded-host:", req.headers.get("x-forwarded-host"));

  if (pathname !== pathname.toLowerCase()) {
    log("-> Redirecting to lowercase:", pathname.toLowerCase());
    log("=== MIDDLEWARE END ===");
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
    log("-> Redirecting to remove duplicate locales:", cleanedPath);
    log("=== MIDDLEWARE END ===");
    return NextResponse.redirect(
      `${req.nextUrl.origin}${cleanedPath}${req.nextUrl.search}`,
    );
  }

  const localeParam = req.nextUrl?.searchParams?.get("locale");
  if (localeParam && !locales.includes(localeParam)) {
    log("-> Removing invalid locale param:", localeParam);
    // An invalid locale search param means that the pages router was trying
    // to do a soft navigation and matched the route pages/[locale]/[...slug]
    // the right route will be resolved after the middleware adds the right locale prefix
    // we can safely remove the locale and slug params to avoid poluting the URL
    req.nextUrl.searchParams.delete("locale");
    req.nextUrl.searchParams.delete("slug");
  }

  log("-> Calling handleI18nRouting");
  const response = handleI18nRouting(req);

  // Log what handleI18nRouting returned
  if (response instanceof Response) {
    log("handleI18nRouting returned Response");
    log("  status:", response.status);
    log("  headers.location:", response.headers.get("location"));
    log(
      "  headers.x-middleware-rewrite:",
      response.headers.get("x-middleware-rewrite"),
    );

    // Fix redirect URLs when request came through a proxy (web app).
    // When a user visits solana.com/docs/rpc with locale cookie "es":
    // 1. Web app rewrites to docs app: solana-com-docs.vercel.app/docs/rpc
    // 2. Docs middleware detects locale cookie and redirects to /es/docs/rpc
    // 3. BUT the redirect URL uses the docs app host: solana-com-docs.vercel.app/es/docs/rpc
    // 4. Browser follows redirect and ends up on the docs app domain directly!
    // Fix: Replace the docs app host with the original host (from x-forwarded-host)
    // so the redirect goes to solana.com/es/docs/rpc instead.
    const forwardedHost = req.headers.get("x-forwarded-host");
    const currentHost = req.headers.get("host");
    const location = response.headers.get("location");

    if (
      forwardedHost &&
      currentHost &&
      forwardedHost !== currentHost &&
      location
    ) {
      const fixedLocation = location.replace(currentHost, forwardedHost);
      log("  -> Fixing redirect to use forwarded host:", fixedLocation);

      const fixedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers),
      });
      fixedResponse.headers.set("location", fixedLocation);

      log("=== MIDDLEWARE END ===");
      return fixedResponse;
    }
  } else {
    log("handleI18nRouting returned Promise");
  }

  log("=== MIDDLEWARE END ===");
  return response;
}

export const config = {
  // Exclude paths that are proxied to other Vercel apps (handled by their own middleware)
  // Also exclude api routes, static files, and Next.js internals
  matcher: [
    "/((?!api|opengraph|_next|_vercel|breakpoint|news|podcasts|media-assets|.*\\..*).*)",
  ],
  runtime: "nodejs",
};
