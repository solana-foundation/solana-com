import { getSourceLocation } from "./inkeep-sources";
import { findSitePages, sitePageHit } from "./inkeep-site-context";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function buildSiteSearchResponse(
  payload: unknown,
  query: string,
  locale = "en",
  limit = 40,
) {
  const candidate =
    isRecord(payload) && isRecord(payload.data) && isRecord(payload.data.search)
      ? payload.data.search
      : null;
  const search =
    candidate && Array.isArray(candidate.searchHits) ? candidate : null;
  const upstreamHits =
    search && Array.isArray(search.searchHits)
      ? search.searchHits.filter(isRecord)
      : [];
  const destinations = findSitePages(query).map(sitePageHit);
  if (!search && !destinations.length) return null;

  const languageScore = (hit: Record<string, unknown>) => {
    const location = getSourceLocation(hitUrl(hit) ?? "");
    return location?.locale === locale ? 1 : 0;
  };
  const ordered = [...upstreamHits].sort(
    (a, b) => languageScore(b) - languageScore(a),
  );
  const preferredDestinations = destinations.map((destination) => {
    if (languageScore(destination)) return destination;
    const key = hitKey(destination);
    return (
      ordered.find((hit) => languageScore(hit) && hitKey(hit) === key) ??
      destination
    );
  });
  const seen = new Set<string>();
  const hits = [...preferredDestinations, ...ordered]
    .filter((hit) => {
      const location = getSourceLocation(hitUrl(hit) ?? "");
      if (!location || !["https:", "http:"].includes(location.url.protocol))
        return false;
      const isSite = ["solana.com", "www.solana.com"].includes(
        location.url.hostname,
      );
      if (isSite && /^\/(llms[^/]*\.txt|SKILL\.md)$/.test(location.pathname))
        return false;
      // Keep distinct heading links, but consolidate locale variants and repeated chunks.
      const key = hitKey(hit)!;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);

  return {
    data: { search: { ...search, searchHits: hits, searchQuery: query } },
  };
}

function hitUrl(hit: Record<string, unknown>): string | null {
  if (typeof hit.url === "string" && hit.url) return hit.url;
  return isRecord(hit.rootRecord) && typeof hit.rootRecord.url === "string"
    ? hit.rootRecord.url
    : null;
}

function hitKey(hit: Record<string, unknown>): string | null {
  const location = getSourceLocation(hitUrl(hit) ?? "");
  if (!location) return null;
  return ["solana.com", "www.solana.com"].includes(location.url.hostname)
    ? `solana.com${location.pathname}${location.url.hash}`
    : `${location.url.origin}${location.url.pathname}${location.url.hash}`;
}
