import { createHmac } from "node:crypto";
import { checkRateLimit } from "@vercel/firewall";
import type { NextRequest } from "next/server";
import { config } from "@/config";

const SUBMIT_RATE_LIMIT_IDS = [
  "breakpoint-awards-submit-burst",
  "breakpoint-awards-submit-hourly",
] as const;
const VOTE_RATE_LIMIT_IDS = [
  "breakpoint-awards-vote-burst",
  "breakpoint-awards-vote-hourly",
] as const;

function hashSecret() {
  return (
    process.env.AWARDS_IP_HASH_SECRET ?? process.env.AWARDS_COOKIE_SECRET ?? ""
  );
}

/** Only headers Vercel sets itself; the order mirrors its documentation. */
export function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null
  );
}

export function clientCountry(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country");
  return country && /^[a-z]{2}$/i.test(country) ? country.toUpperCase() : null;
}

export function hashIp(ip: string | null) {
  const key = hashSecret();
  if (!ip || !key) return null;
  return createHmac("sha256", key).update(ip).digest("base64url");
}

async function enforceRateLimit(
  request: NextRequest,
  ids: readonly string[],
  rateLimitKeys?: (id: string) => readonly (string | undefined)[],
) {
  if (process.env.NODE_ENV !== "production") return false;

  for (const id of ids) {
    for (const rateLimitKey of rateLimitKeys?.(id) ?? [undefined]) {
      const result = await checkRateLimit(id, { request, rateLimitKey });
      if (result.error === "not-found") {
        throw new Error(`Vercel WAF rate limit '${id}' is not configured.`);
      }
      if (result.rateLimited) return true;
    }
  }
  return false;
}

export function enforceSubmissionRateLimit(request: NextRequest) {
  return enforceRateLimit(request, SUBMIT_RATE_LIMIT_IDS);
}

/**
 * The burst rule is checked twice: once per ballot and once per client IP
 * (the default key). A caller who mints a fresh anonymous ballot for every
 * vote would otherwise start each one with an empty burst bucket.
 */
export function enforceVotingRateLimit(request: NextRequest, ballotId: string) {
  return enforceRateLimit(request, VOTE_RATE_LIMIT_IDS, (id) =>
    id === VOTE_RATE_LIMIT_IDS[0] ? [ballotId, undefined] : [undefined],
  );
}

export function hasSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";

  if (origin === new URL(request.url).origin) return true;

  // Production serves this app through solana.com, but the external rewrite
  // gives the route handler the Breakpoint deployment URL as request.url.
  return (
    process.env.VERCEL_ENV === "production" &&
    origin === config.publicSiteOrigin
  );
}
