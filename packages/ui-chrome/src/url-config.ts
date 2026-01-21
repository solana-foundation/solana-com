/**
 * URL configuration helper for handling links across different apps.
 *
 * All apps are served behind solana.com via rewrites (proxy-only mode).
 * This module decides whether to use Next.js Link (client navigation)
 * or regular <a> tag (full page load) for cross-app navigation.
 *
 * Configuration: Set NEXT_PUBLIC_APP_NAME in each non-web app's next.config.ts
 */

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

/**
 * Regex patterns for routes internal to each app.
 * Routes matching these patterns will use Next.js Link for client-side navigation.
 * Routes not matching will use <a> tags for full page load.
 */
const APP_INTERNAL_ROUTES: Record<string, RegExp> = {
  // docs app handles: /docs/*, /learn/*, /developers, /developers/cookbook/*, /developers/guides/*
  docs: /^\/(?:docs|learn)(?:\/|$)|^\/developers(?:$|\/(?:cookbook|guides)(?:\/|$))/,
  media: /^\/(?:news|podcasts)(?:\/|$)/,
  // templates app handles: /developers/templates/*
  templates: /^\/developers\/templates(?:\/|$)/,
  // accelerate app handles: /accelerate/*
  accelerate: /^\/accelerate(?:\/|$)/,
};

const INTERNAL_PATTERN = APP_NAME ? APP_INTERNAL_ROUTES[APP_NAME] : null;

/**
 * Checks if a href is a relative path (starts with / but not //).
 */
function isRelativePath(href: string): boolean {
  return (
    typeof href === "string" && href.startsWith("/") && !href.startsWith("//")
  );
}

/**
 * Checks if a route is internal to the current app.
 */
function isInternalRoute(href: string): boolean {
  return INTERNAL_PATTERN ? INTERNAL_PATTERN.test(href) : false;
}

/**
 * Checks if a route is handled by any non-web app.
 */
function isHandledByOtherApp(href: string): boolean {
  return Object.values(APP_INTERNAL_ROUTES).some((pattern) =>
    pattern.test(href),
  );
}

/**
 * Checks if a URL should use Next.js Link component or a regular anchor tag.
 * - On web app: use Link for routes NOT handled by other apps
 * - On other apps: use Link only for internal routes
 */
export function shouldUseNextLink(href: string): boolean {
  if (!isRelativePath(href)) {
    return false;
  }

  // On web app (no APP_NAME): use Link for routes not handled by other apps
  if (!APP_NAME) {
    return !isHandledByOtherApp(href);
  }

  // On non-web apps: use Link only for internal routes
  return isInternalRoute(href);
}
