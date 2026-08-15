export const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

export function isYouTubeVideoId(value: string): boolean {
  return YOUTUBE_ID_PATTERN.test(value);
}

/**
 * Extracts and normalizes the 11-character YouTube video ID from various URL formats
 * (watch?v=..., youtu.be/..., shorts/..., live/..., embed/..., /v/...).
 */
export function extractYouTubeVideoId(input: string): string | null {
  const value = input.trim();
  if (isYouTubeVideoId(value)) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (
    (url.protocol !== "https:" && url.protocol !== "http:") ||
    !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())
  ) {
    return null;
  }

  const hostname = url.hostname.toLowerCase();

  // Short domain: youtu.be/<id>
  if (hostname === "youtu.be" || hostname === "www.youtu.be") {
    const id = url.pathname.slice(1).split("/")[0] ?? "";
    return id && isYouTubeVideoId(id) ? id : null;
  }

  // Query parameter: watch?v=<id> (handles ?feature=share&v=<id> and ?t=10s&v=<id>)
  const searchId = url.searchParams.get("v");
  if (searchId && isYouTubeVideoId(searchId)) {
    return searchId;
  }

  // Path prefixes: /embed/<id>, /v/<id>, /live/<id>, /shorts/<id>
  const segments = url.pathname.split("/").filter(Boolean);
  const pathPrefixes = new Set(["embed", "v", "live", "shorts"]);
  const firstSegment = segments[0]?.toLowerCase();
  if (segments.length >= 2 && firstSegment && pathPrefixes.has(firstSegment)) {
    const id = segments[1];
    return id && isYouTubeVideoId(id) ? id : null;
  }

  return null;
}
