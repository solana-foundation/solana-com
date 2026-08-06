import createNextIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import {
  routing,
  routingWithoutDetection,
  SHARED_LOCALE_COOKIE,
} from "./routing-config";

export { getLocaleFromPathname } from "./pathname";
export {
  routing,
  routingWithoutDetection,
  SHARED_LOCALE_COOKIE,
} from "./routing-config";

interface CreateMiddlewareOptions {
  /**
   * When true, the middleware will strip the NEXT_LOCALE cookie from responses
   * when the request comes through a proxy (detected via x-forwarded-host).
   * This prevents sub-apps from overwriting the main app's locale cookie.
   * @default false
   */
  preserveProxiedLocaleCookie?: boolean;
}

export function getEffectiveOrigin(req: NextRequest) {
  const url = req.nextUrl.clone();
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    url.host = forwardedHost;
  }

  if (forwardedProto) {
    url.protocol = `${forwardedProto}:`;
  }

  return url;
}

export function getFixedProxiedLocation({
  currentHost,
  forwardedHost,
  forwardedProto,
  location,
}: {
  currentHost: string;
  forwardedHost: string;
  forwardedProto?: string | null;
  location: string;
}) {
  try {
    const locationUrl = new URL(location);

    if (locationUrl.host !== currentHost) {
      return location;
    }

    locationUrl.host = forwardedHost;

    if (forwardedProto) {
      locationUrl.protocol = `${forwardedProto}:`;
    }

    return locationUrl.toString();
  } catch {
    return location.replace(currentHost, forwardedHost);
  }
}

/**
 * Creates an i18n middleware that wraps next-intl's middleware with additional
 * functionality to handle multi-app deployments on the same domain.
 *
 * When multiple apps are served via rewrites on the same domain (e.g., main site,
 * docs, media), each app's middleware would normally set the locale cookie,
 * potentially overwriting each other. This wrapper prevents that by:
 *
 * 1. Detecting when a request comes through a proxy (via x-forwarded-host header)
 * 2. Stripping the locale Set-Cookie header from the response
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
    // 2. Remove locale cookie to prevent overwriting the main app's cookie
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
      const fixedLocation = getFixedProxiedLocation({
        currentHost,
        forwardedHost,
        forwardedProto: req.headers.get("x-forwarded-proto"),
        location,
      });
      fixedResponse.headers.set("location", fixedLocation);
    }

    // Remove the locale cookie from the response to prevent overwriting the
    // main app's cookie. NEXT_LOCALE is also removed during migration from the
    // previous next-intl default.
    if (setCookie) {
      const localeCookieNames = [SHARED_LOCALE_COOKIE, "NEXT_LOCALE"];
      const cookies = setCookie
        .split(/,(?=\s*[^;,=]+=[^;,]*)/)
        .filter((cookie) =>
          localeCookieNames.every(
            (name) => !cookie.trim().startsWith(`${name}=`),
          ),
        );

      if (cookies.length > 0) {
        fixedResponse.headers.set("set-cookie", cookies.join(", "));
      } else {
        fixedResponse.headers.delete("set-cookie");
      }
    }

    return fixedResponse;
  };
}
