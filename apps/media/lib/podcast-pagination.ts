/**
 * Pagination handling for the public podcast episodes endpoint.
 *
 * `limit` and `offset` arrive as raw query-string values and are used to
 * slice the episode list, so they are normalized here before use. Invalid
 * values fall back to the defaults rather than erroring, matching how the
 * `posts`, `reports` and `links` latest routes treat their query parameters.
 */

export const DEFAULT_EPISODE_LIMIT = 12;

export const MAX_EPISODE_LIMIT = 50;

/**
 * Upper bound on `offset`, so a caller cannot ask for a slice start beyond
 * any plausible feed length.
 */
export const MAX_EPISODE_OFFSET = 10_000;

/**
 * Coerces `limit` to a positive whole number no larger than
 * `MAX_EPISODE_LIMIT`.
 */
export function parseEpisodeLimit(value: string | null | undefined): number {
  if (!value) {
    return DEFAULT_EPISODE_LIMIT;
  }

  const limit = parseInt(value, 10);

  if (Number.isNaN(limit) || limit <= 0) {
    return DEFAULT_EPISODE_LIMIT;
  }

  return Math.min(limit, MAX_EPISODE_LIMIT);
}

/**
 * Coerces `offset` to a non-negative whole number no larger than
 * `MAX_EPISODE_OFFSET`.
 */
export function parseEpisodeOffset(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }

  const offset = parseInt(value, 10);

  if (Number.isNaN(offset) || offset < 0) {
    return 0;
  }

  return Math.min(offset, MAX_EPISODE_OFFSET);
}
