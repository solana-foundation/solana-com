export const TWEET_ID_PATTERN = /^\d{1,40}$/;

const TWEET_HOSTS = new Set([
  "x.com",
  "www.x.com",
  "mobile.x.com",
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
]);

export function isTweetId(value: string): boolean {
  return TWEET_ID_PATTERN.test(value);
}

/**
 * Accepts the value authors naturally paste, but returns the numeric ID that
 * react-tweet and the media API use as their canonical contract.
 */
export function normalizeTweetId(input: string): string | null {
  const value = input.trim();
  if (isTweetId(value)) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (
    (url.protocol !== "https:" && url.protocol !== "http:") ||
    !TWEET_HOSTS.has(url.hostname.toLowerCase())
  ) {
    return null;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  const statusIndex = segments.findIndex(
    (segment) => segment.toLowerCase() === "status",
  );
  if (statusIndex < 1) return null;

  const tweetId = segments[statusIndex + 1];
  return tweetId && isTweetId(tweetId) ? tweetId : null;
}
