/**
 * Vercel WAF rate-limit rule ids used by the Inkeep proxy routes and the docs
 * feedback action. Every id must exist as a rule in each Vercel project that
 * serves these routes; `checkRateLimit` fails closed in production otherwise.
 * Kept free of `server-only` so unit tests can import it directly.
 */
export type InkeepRateLimitedEndpoint =
  | "analytics"
  | "chat"
  | "challenge"
  | "search";

export const RATE_LIMIT_IDS: Record<InkeepRateLimitedEndpoint, string> = {
  analytics: "inkeep-analytics",
  chat: "inkeep-chat",
  challenge: "inkeep-chat",
  search: "inkeep-search",
};
