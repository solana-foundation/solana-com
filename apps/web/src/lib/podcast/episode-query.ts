/**
 * Query handling for the Simplecast episodes endpoint.
 *
 * Values reaching these helpers come straight from the public
 * `/api/podcast/episodes` query string, so they are normalized here before
 * they are used to build an upstream request.
 */

export const EPISODE_PAGE_SIZE = 15;

export const EPISODE_SORT_VALUES = ["asc", "desc"] as const;

export type EpisodeSort = (typeof EPISODE_SORT_VALUES)[number];

export const DEFAULT_EPISODE_SORT: EpisodeSort = "desc";

/**
 * Upper bound on the requested page. Without it a caller could ask for an
 * offset large enough to lose integer precision.
 */
export const MAX_EPISODE_PAGE = 1000;

/**
 * Coerces the `page` query parameter to a whole page index, falling back to
 * the first page for anything non-numeric, negative or fractional.
 */
export function parseEpisodePage(value: string | null | undefined): number {
  const page = Number(value ?? "");

  if (!Number.isFinite(page) || page < 0) {
    return 0;
  }

  return Math.min(Math.floor(page), MAX_EPISODE_PAGE);
}

/**
 * Restricts the `sort` query parameter to the values the upstream API accepts.
 */
export function parseEpisodeSort(
  value: string | null | undefined,
): EpisodeSort {
  return EPISODE_SORT_VALUES.includes(value as EpisodeSort)
    ? (value as EpisodeSort)
    : DEFAULT_EPISODE_SORT;
}

/**
 * Builds the upstream episodes URL. Every value goes through
 * `URLSearchParams` so a search term containing `&` or `#` cannot add or
 * truncate parameters on the request.
 */
export function buildEpisodesUrl({
  podcastId,
  limit,
  offset,
  query,
  sort,
}: {
  podcastId: string;
  limit: number;
  offset: number;
  query: string;
  sort: string;
}): string {
  const searchParams = new URLSearchParams({
    status: "published",
    limit: String(limit),
    offset: String(offset),
    search: query,
    sort,
  });

  return `https://api.simplecast.com/podcasts/${encodeURIComponent(
    podcastId,
  )}/episodes?${searchParams.toString()}`;
}
