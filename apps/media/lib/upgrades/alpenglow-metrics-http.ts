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
    ...(staleSeconds > 0 ? [`stale-while-revalidate=${staleSeconds}`] : []),
  ].join(", ");

  return {
    "Cache-Control": sharedPolicy,
    "CDN-Cache-Control": sharedPolicy,
    "Vercel-CDN-Cache-Control": sharedPolicy,
  };
}

/**
 * Builds edge-cache headers without allowing the cache to extend a snapshot
 * beyond its maximum acceptable age.
 *
 * @param generatedAt - ISO timestamp at which the snapshot was generated.
 * @param sharedSeconds - Preferred fresh lifetime in shared caches.
 * @param maximumAgeSeconds - Oldest snapshot that may be served to a visitor.
 * @return Age-aware cache headers, or no-store headers for an invalid timestamp.
 */
export function alpenglowFreshSnapshotCacheHeaders(
  generatedAt: string,
  sharedSeconds: number,
  maximumAgeSeconds: number,
): Record<string, string> {
  const generatedAtMs = Date.parse(generatedAt);
  if (!Number.isFinite(generatedAtMs)) {
    return { ...ALPENGLOW_NO_STORE_HEADERS };
  }

  const ageSeconds = Math.max(
    0,
    Math.ceil((Date.now() - generatedAtMs) / 1_000),
  );
  const remainingSeconds = Math.max(0, maximumAgeSeconds - ageSeconds);
  const freshSeconds = Math.min(sharedSeconds, remainingSeconds);

  return alpenglowPublicCacheHeaders(freshSeconds, 0);
}
