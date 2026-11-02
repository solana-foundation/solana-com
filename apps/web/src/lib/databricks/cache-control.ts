// Mirrors data-api's METRICS_CACHE_TTL_SECONDS; generatedAt is stamped there.
export const DATA_API_METRICS_TTL_SECONDS = 12 * 60 * 60;

// Floor so the edge still coalesces requests once a payload is past the TTL.
export const MIN_EDGE_MAX_AGE_SECONDS = 60;

export function getPayloadAgeSeconds(generatedAt: string, now = Date.now()) {
  const generatedAtMs = Date.parse(generatedAt);

  if (!Number.isFinite(generatedAtMs)) {
    return undefined;
  }

  return Math.max(0, Math.floor((now - generatedAtMs) / 1000));
}

// TTL minus payload age, so the edge expires when the payload does.
export function getEdgeMaxAgeSeconds(
  generatedAt: string,
  now = Date.now(),
  ttlSeconds = DATA_API_METRICS_TTL_SECONDS,
) {
  const ageSeconds = getPayloadAgeSeconds(generatedAt, now) ?? 0;

  return Math.max(MIN_EDGE_MAX_AGE_SECONDS, ttlSeconds - ageSeconds);
}
