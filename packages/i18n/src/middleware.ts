import createNextIntlMiddleware from "next-intl/middleware";
import { defineRouting } from "next-intl/routing";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./config";

interface CreateMiddlewareOptions {
  /**
   * When true, the middleware will strip the NEXT_LOCALE cookie from responses
   * when the request comes through a proxy (detected via x-forwarded-host).
   * This prevents sub-apps from overwriting the main app's locale cookie.
   * @default false
   */
  preserveProxiedLocaleCookie?: boolean;
}

/**
 * Routing configuration with locale detection enabled.
 * Use this for the main app that should detect browser language.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: true,
});

/**
 * Routing configuration with locale detection disabled.
 * Use this for sub-apps that are accessed via rewrites to prevent
 * redirect loops to the internal Vercel URL.
 */
export const routingWithoutDetection = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
});

/**
 * Creates an i18n middleware that wraps next-intl's middleware with additional
 * functionality to handle multi-app deployments on the same domain.
 *
 * When multiple apps are served via rewrites on the same domain (e.g., main site,
 * docs, media), each app's middleware would normally set the NEXT_LOCALE cookie,
 * potentially overwriting each other. This wrapper prevents that by:
 *
 * 1. Detecting when a request comes through a proxy (via x-forwarded-host header)
 * 2. Stripping the NEXT_LOCALE Set-Cookie header from the response
 * 3. Fixing redirect URLs to use the original host instead of the proxy target
 *
 * @param routingConfig - Use `routing` or `routingWithoutDetection` from this module
 * @param options - Additional options for multi-app handling
 */
export function createMiddleware<
  T extends typeof routing | typeof routingWithoutDetection,
>(routingConfig: T, options: CreateMiddlewareOptions = {}) {
  const { preserveProxiedLocaleCookie = false } = options;
  const handleI18nRouting = createNextIntlMiddleware(routingConfig);

  return async function middleware(req: NextRequest) {
    const response = await handleI18nRouting(req);

    // Check if request came through a proxy (e.g., rewrite from another Vercel app)
    const forwardedHost = req.headers.get("x-forwarded-host");
    const currentHost = req.headers.get("host");
    const isProxied =
      forwardedHost && currentHost && forwardedHost !== currentHost;

    if (!isProxied || !preserveProxiedLocaleCookie) {
      return response;
    }

    // When proxied, we need to:
    // 1. Fix redirect URLs to use the original host
    // 2. Remove NEXT_LOCALE cookie to prevent overwriting the main app's cookie
    const location = response.headers.get("location");
    const setCookie = response.headers.get("set-cookie");

    // Only create a new response if we need to modify headers
    if (!location && !setCookie) {
      return response;
    }

    const fixedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers),
    });

    // Fix redirect URL if present
    if (location) {
      const fixedLocation = location.replace(currentHost, forwardedHost);
      fixedResponse.headers.set("location", fixedLocation);
    }

    // Remove NEXT_LOCALE cookie from response to prevent overwriting the main app's cookie
    if (setCookie) {
      // Handle both single cookies and multiple cookies (separated by ", ")
      // Note: Cookies can contain commas in values, but NEXT_LOCALE is a simple string
      const cookies = setCookie
        .split(/,(?=\s*NEXT_LOCALE=|[^;]*?=)/)
        .filter((cookie) => !cookie.trim().startsWith("NEXT_LOCALE="));

      if (cookies.length > 0) {
        fixedResponse.headers.set("set-cookie", cookies.join(", "));
      } else {
        fixedResponse.headers.delete("set-cookie");
      }
    }

    return fixedResponse;
  };
}
