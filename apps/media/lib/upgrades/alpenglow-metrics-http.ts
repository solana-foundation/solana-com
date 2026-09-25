import "server-only";

/** Cache headers for validation failures and upstream errors. */
export const ALPENGLOW_NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
} as const;

/**
 * Builds browser and shared-cache headers for a successful public snapshot.
 *
 * @param sharedSeconds - Fresh lifetime in shared caches.
 * @param staleSeconds - Time a shared cache may serve stale while refreshing.
 * @return Headers for the browser, generic CDN, and Vercel CDN.
 */
export function alpenglowPublicCacheHeaders(
  sharedSeconds: number,
  staleSeconds: number,
): Record<string, string> {
  const sharedPolicy = [
    "public",
    "max-age=0",
    `s-maxage=${sharedSeconds}`,
    `stale-while-revalidate=${staleSeconds}`,
  ].join(", ");

  return {
    "Cache-Control": sharedPolicy,
    "CDN-Cache-Control": sharedPolicy,
    "Vercel-CDN-Cache-Control": sharedPolicy,
  };
}
