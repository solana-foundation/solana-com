import { NextRequest, NextResponse } from "next/server";

import { getDataApiConfig, isProduction } from "@/lib/databricks/server";
import {
  type DataApiMetricsData,
  getMetricsData,
} from "@/lib/databricks/metrics-data";
import { getEdgeMaxAgeSeconds } from "@/lib/databricks/cache-control";
import {
  metricNames,
  normalizeProviderName,
  type DataApiResponse,
  type MetricRow,
} from "@/app/[locale]/data/data-config";
import {
  getRangeDates,
  getRangeDayCount,
  getUtcToday,
  isDateInRange,
  parseDashboardRange,
  type DashboardRange,
} from "@/app/[locale]/data/date-range";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const EDGE_STALE_SECONDS = 24 * 60 * 60;
const IS_PRODUCTION = isProduction();
const NO_STORE_CACHE_CONTROL = "no-store, max-age=0";
const DATA_UNAVAILABLE_ERROR =
  "Solana data is unavailable right now. Try again in a moment.";

type ErrorResponse = {
  error: string;
  detail?: string;
  invalidEnv?: string[];
  missingEnv?: string[];
};

const metricNameSet = new Set<string>(metricNames);

export async function GET(request: NextRequest) {
  const configResult = getDataApiConfig();

  if (!configResult.ok) {
    return json<ErrorResponse>(
      getConfigErrorResponse(configResult),
      503,
      NO_STORE_CACHE_CONTROL,
    );
  }

  const range = parseDashboardRange(
    request.nextUrl.searchParams,
    getUtcToday(),
  );

  try {
    const result = await getMetricsData(configResult.config);

    return json<DataApiResponse>(
      buildDataResponse(result, range),
      200,
      getSuccessCacheControl(result.generatedAt),
    );
  } catch (error) {
    console.error("Failed to load Solana data from data-api", error);

    return json<ErrorResponse>(
      getDataErrorResponse(error),
      502,
      NO_STORE_CACHE_CONTROL,
    );
  }
}

function buildDataResponse(
  result: DataApiMetricsData,
  range: DashboardRange,
): DataApiResponse {
  return {
    generatedAt: result.generatedAt,
    rangeDays: getRangeDayCount(range),
    truncated: result.truncated,
    rows: filterRowsByRange(result.rows, range),
  };
}

function filterRowsByRange(rows: MetricRow[], range: DashboardRange) {
  const dates = getRangeDates(range, getUtcToday());

  return rows.flatMap((row) => {
    if (!metricNameSet.has(row.metricName) || !isDateInRange(row.date, dates)) {
      return [];
    }

    return [
      {
        ...row,
        providerName: normalizeProviderName(row.providerName),
      },
    ];
  });
}

function getSuccessCacheControl(generatedAt: string) {
  if (!IS_PRODUCTION) {
    return NO_STORE_CACHE_CONTROL;
  }

  return [
    "public",
    "max-age=0",
    `s-maxage=${getEdgeMaxAgeSeconds(generatedAt)}`,
    `stale-while-revalidate=${EDGE_STALE_SECONDS}`,
  ].join(", ");
}

function getConfigErrorResponse(
  configResult: Extract<ReturnType<typeof getDataApiConfig>, { ok: false }>,
): ErrorResponse {
  return {
    error: "The Solana data API is not configured.",
    ...devOnly({
      invalidEnv: configResult.invalidEnv,
      missingEnv: configResult.missingEnv,
    }),
  };
}

function getDataErrorResponse(error: unknown): ErrorResponse {
  return {
    error: DATA_UNAVAILABLE_ERROR,
    ...devOnly({
      detail: error instanceof Error ? error.message : String(error),
    }),
  };
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
