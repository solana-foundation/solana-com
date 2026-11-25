import { NextResponse } from "next/server";

import { getDataApiConfig, isProduction } from "@/lib/databricks/server";
import { getStablecoinCoverage } from "@/lib/databricks/stablecoin-coverage";
import {
  DATA_API_STABLECOIN_COVERAGE_TTL_SECONDS,
  getEdgeMaxAgeSeconds,
} from "@/lib/databricks/cache-control";
import type { StablecoinCoverageResponse } from "@/app/[locale]/data/stablecoin-coverage-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const EDGE_STALE_SECONDS = 24 * 60 * 60;
const IS_PRODUCTION = isProduction();
const NO_STORE_CACHE_CONTROL = "no-store, max-age=0";
const COVERAGE_UNAVAILABLE_ERROR =
  "Stablecoin coverage is unavailable right now. Try again in a moment.";

type ErrorResponse = {
  error: string;
  detail?: string;
  invalidEnv?: string[];
  missingEnv?: string[];
};

export async function GET() {
  const configResult = getDataApiConfig();

  if (!configResult.ok) {
    return json<ErrorResponse>(
      {
        error: "The Solana data API is not configured.",
        ...devOnly({
          invalidEnv: configResult.invalidEnv,
          missingEnv: configResult.missingEnv,
        }),
      },
      503,
      NO_STORE_CACHE_CONTROL,
    );
  }

  try {
    const result = await getStablecoinCoverage(configResult.config);

    return json<StablecoinCoverageResponse>(
      result,
      200,
      getSuccessCacheControl(result.generatedAt),
    );
  } catch (error) {
    console.error("Failed to load stablecoin coverage from data-api", error);

    return json<ErrorResponse>(
      {
        error: COVERAGE_UNAVAILABLE_ERROR,
        ...devOnly({
          detail: error instanceof Error ? error.message : String(error),
        }),
      },
      502,
      NO_STORE_CACHE_CONTROL,
    );
  }
}

function getSuccessCacheControl(generatedAt: string) {
  if (!IS_PRODUCTION) {
    return NO_STORE_CACHE_CONTROL;
  }

  return [
    "public",
    "max-age=0",
    `s-maxage=${getEdgeMaxAgeSeconds(
      generatedAt,
      Date.now(),
      DATA_API_STABLECOIN_COVERAGE_TTL_SECONDS,
    )}`,
    `stale-while-revalidate=${EDGE_STALE_SECONDS}`,
  ].join(", ");
}

function devOnly<T extends Record<string, unknown>>(value: T) {
  return IS_PRODUCTION ? {} : value;
}

function json<T>(body: T, status: number, cacheControl: string) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": cacheControl,
    },
  });
}
