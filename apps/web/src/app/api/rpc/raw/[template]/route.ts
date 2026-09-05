import { NextRequest, NextResponse } from "next/server";

import {
  parseRawQuery,
  runRawQuery,
  toCsv,
  verifyRawApiToken,
  RawQueryError,
} from "@/lib/rpc/raw";
import { getRpcLatencyConfig } from "@/lib/rpc/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const RATE_LIMIT_PER_MINUTE = 60;
const RATE_WINDOW_MS = 60_000;
const NO_STORE_CACHE_CONTROL = "no-store, max-age=0";

const rateWindows = new Map<string, { windowStart: number; count: number }>();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ template: string }> },
) {
  const secret = process.env.RAW_API_JWT_SECRET?.trim();

  if (!secret) {
    return errorResponse(503, "The raw data API is not configured.");
  }

  const claims = verifyRawApiToken(getBearerToken(request), secret);

  if (!claims) {
    return errorResponse(401, "Invalid, expired, or missing token.");
  }

  const retryAfterSeconds = takeRateLimitSlot(claims.sub);

  if (retryAfterSeconds > 0) {
    return errorResponse(429, "Rate limit exceeded.", {
      "Retry-After": String(retryAfterSeconds),
    });
  }

  const configResult = getRpcLatencyConfig();

  if (!configResult.ok) {
    return errorResponse(503, "The RPC latency data source is not configured.");
  }

  const { template } = await context.params;

  try {
    const query = parseRawQuery(template, request.nextUrl.searchParams);
    const series = await runRawQuery(configResult.config, query);

    if (query.format === "csv") {
      return new NextResponse(toCsv(series), {
        headers: {
          "Cache-Control": NO_STORE_CACHE_CONTROL,
          "Content-Type": "text/csv; charset=utf-8",
        },
      });
    }

    return NextResponse.json(
      {
        generatedAt: new Date().toISOString(),
        template: query.template,
        series,
      },
      { headers: { "Cache-Control": NO_STORE_CACHE_CONTROL } },
    );
  } catch (error) {
    if (error instanceof RawQueryError) {
      return errorResponse(400, error.message);
    }

    console.error("Raw data API query failed", error);

    return errorResponse(502, "Upstream query failed. Try again in a moment.");
  }
}

function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");

  return header?.startsWith("Bearer ") ? header.slice(7).trim() : undefined;
}

function takeRateLimitSlot(sub: string) {
  const now = Date.now();
  const window = rateWindows.get(sub);

  if (!window || now - window.windowStart >= RATE_WINDOW_MS) {
    rateWindows.set(sub, { windowStart: now, count: 1 });

    return 0;
  }

  if (window.count >= RATE_LIMIT_PER_MINUTE) {
    return Math.ceil((window.windowStart + RATE_WINDOW_MS - now) / 1000);
  }

  window.count += 1;

  return 0;
}

function errorResponse(
  status: number,
  message: string,
  headers: Record<string, string> = {},
) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": NO_STORE_CACHE_CONTROL, ...headers },
    },
  );
}
