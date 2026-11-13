import type { MapZone, VenueMapData } from "@/content/venue/types";

/**
 * Deep links between the live agenda and the venue map on the home page.
 *
 * Both sections sit on the same page, so links are hash fragments that no
 * element owns: `#venue-map/<zone id>` opens the map on that zone and
 * `#today/<stage slug>` opens the agenda on that stage. Each section listens
 * for `hashchange`, selects its target and scrolls itself into view. The
 * same fragments work from other pages, e.g. `/#venue-map/royal-exchange`.
 */
export const VENUE_MAP_ANCHOR = "venue-map";
export const TODAY_ANCHOR = "today";

/** Lower-case, hyphenated; "Royal Exchange Stage" and "Royal Exchange" agree. */
export function stageSlug(stage: string): string {
  return stage
    .trim()
    .toLowerCase()
    .replace(/\s+stage$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The map zone named after a stage, tolerant of case and a trailing "Stage". */
export function zoneForStage(
  data: Pick<VenueMapData, "zones">,
  stage: string | undefined,
): MapZone | undefined {
  if (!stage) return undefined;
  const wanted = stageSlug(stage);
  if (!wanted) return undefined;
  return data.zones.find((zone) => stageSlug(zone.name) === wanted);
}

export function venueMapHash(zoneId: string): string {
  return `#${VENUE_MAP_ANCHOR}/${zoneId}`;
}

export function todayHash(stage: string): string {
  return `#${TODAY_ANCHOR}/${stageSlug(stage)}`;
}

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

/** Stage slug from `#today/<stage slug>`, or null for any other hash. */
export function parseTodayHash(hash: string): string | null {
  return parseHash(hash, TODAY_ANCHOR);
}

/**
 * Click handler for a hash link. When the hash is already in the address
 * bar the browser fires no `hashchange`, so dispatch one by hand and the
 * target section still responds. Navigating to the same hash is otherwise
 * a no-op, so the default click can proceed.
 */
export function followHashLink(href: string) {
  if (typeof window === "undefined" || window.location.hash !== href) return;
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

/** Scroll a section into view the way the browser would for an anchor. */
export function scrollToAnchor(id: string) {
  if (typeof document === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
