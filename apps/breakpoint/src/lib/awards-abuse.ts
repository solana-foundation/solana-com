import { createHmac } from "node:crypto";
import { checkRateLimit } from "@vercel/firewall";
import type { NextRequest } from "next/server";
import { config } from "@/config";

const SUBMIT_RATE_LIMIT_IDS = [
  "breakpoint-awards-submit-burst",
  "breakpoint-awards-submit-hourly",
] as const;

function hashSecret() {
  return (
    process.env.AWARDS_IP_HASH_SECRET ?? process.env.AWARDS_COOKIE_SECRET ?? ""
  );
}

export function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
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

export async function enforceSubmissionRateLimit(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return false;

  for (const id of SUBMIT_RATE_LIMIT_IDS) {
    const result = await checkRateLimit(id, { request });
    if (result.error === "not-found") {
      throw new Error(`Vercel WAF rate limit '${id}' is not configured.`);
    }
    if (result.rateLimited) return true;
  }
  return false;
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
