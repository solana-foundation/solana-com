export const VENUE_MAP_ANCHOR = "venue-map";

function parseHash(hash: string, anchor: string): string | null {
  const prefix = `#${anchor}/`;
  if (!hash.startsWith(prefix)) return null;
  try {
    const value = decodeURIComponent(hash.slice(prefix.length)).trim();
    return value || null;
  } catch {
    // A malformed percent escape in a shared link is ignored, not fatal.
    return null;
  }
}

/** Zone id from `#venue-map/<zone id>`, or null for any other hash. */
export function parseVenueMapHash(hash: string): string | null {
  return parseHash(hash, VENUE_MAP_ANCHOR);
}

/** Scroll a section into view the way the browser would for an anchor. */
export function scrollToAnchor(id: string) {
  if (typeof document === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
