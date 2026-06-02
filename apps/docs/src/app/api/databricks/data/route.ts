import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

import {
  type DatabricksConfig,
  getDatabricksSqlMetricRows,
  getDatabricksConfig,
  isProduction,
} from "@/lib/databricks/server";
import {
  metricNames,
  rangeOptions,
  type DataApiResponse,
  type MetricRow,
} from "@/app/[locale]/data/data-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATABRICKS_CACHE_SECONDS = 6 * 60 * 60;
const BROWSER_CACHE_SECONDS = 60;
const EDGE_STALE_SECONDS = 6 * 60 * 60;
const DEFAULT_RANGE_DAYS = 90;
const IS_PRODUCTION = isProduction();
const NO_STORE_CACHE_CONTROL = "no-store, max-age=0";
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DATA_UNAVAILABLE_ERROR =
  "Solana data is unavailable right now. Try again in a moment.";
const SUCCESS_CACHE_CONTROL = IS_PRODUCTION
  ? [
      "public",
      `max-age=${BROWSER_CACHE_SECONDS}`,
      `s-maxage=${DATABRICKS_CACHE_SECONDS}`,
      `stale-while-revalidate=${EDGE_STALE_SECONDS}`,
    ].join(", ")
  : NO_STORE_CACHE_CONTROL;

type ErrorResponse = {
  error: string;
  detail?: string;
  invalidEnv?: string[];
  missingEnv?: string[];
};

const metricNameSet = new Set<string>(metricNames);
const rangeValues = new Set<number>(rangeOptions.map((option) => option.value));

const getCachedDatabricksData = unstable_cache(
  async (_cacheKey: string, lookbackDays: number) => {
    return fetchDatabricksData(getRequiredDatabricksConfig(), lookbackDays);
  },
  ["solana-data-databricks-metric-rows-v2"],
  {
    revalidate: DATABRICKS_CACHE_SECONDS,
    tags: ["solana-data-databricks"],
  },
);

export async function GET(request: NextRequest) {
  const configResult = getDatabricksConfig();

  if (!configResult.ok) {
    return json<ErrorResponse>(
      getConfigErrorResponse(configResult),
      503,
      NO_STORE_CACHE_CONTROL,
    );
  }

  const rangeDays = parseRangeDays(request.nextUrl.searchParams.get("days"));

  try {
    const result = await getDatabricksData(configResult.config, rangeDays);

    return json<DataApiResponse>(
      buildDataResponse(result, rangeDays),
      200,
      SUCCESS_CACHE_CONTROL,
    );
  } catch (error) {
    console.error("Failed to load Solana Databricks data", error);

    return json<ErrorResponse>(
      getDataErrorResponse(error),
      502,
      NO_STORE_CACHE_CONTROL,
    );
  }
}

function buildDataResponse(
  result: Awaited<ReturnType<typeof fetchDatabricksData>>,
  rangeDays: number,
): DataApiResponse {
  return {
    generatedAt: result.generatedAt,
    rangeDays,
    truncated: result.truncated,
    rows: filterRowsByRange(result.rows, rangeDays),
  };
}

function filterRowsByRange(rows: MetricRow[], rangeDays: number) {
  const cutoffTime = Date.now() - rangeDays * DAY_IN_MS;

  return rows.filter((row) => {
    if (!metricNameSet.has(row.metricName)) {
      return false;
    }

    return new Date(`${row.date}T00:00:00.000Z`).getTime() >= cutoffTime;
  });
}

function getDatabricksData(config: DatabricksConfig, rangeDays: number) {
  return IS_PRODUCTION
    ? getCachedDatabricksData(
        getDatabricksCacheKey(config, rangeDays),
        rangeDays,
      )
    : fetchDatabricksData(config, rangeDays);
}

async function fetchDatabricksData(
  config: DatabricksConfig,
  rangeDays: number,
) {
  const result = await getDatabricksSqlMetricRows(config, {
    lookbackDays: rangeDays,
    metricNames,
  });

  return {
    ...result,
    generatedAt: new Date().toISOString(),
  };
}

function getDatabricksCacheKey(config: DatabricksConfig, rangeDays: number) {
  return [
    config.serverHostname,
    config.httpPath,
    config.warehouseId,
    rangeDays,
    metricNames.join(","),
  ].join("|");
}

function getRequiredDatabricksConfig() {
  const configResult = getDatabricksConfig();

  if (!configResult.ok) {
    throw new Error("Databricks data source is not configured.");
  }

  return configResult.config;
}

function getConfigErrorResponse(
  configResult: Extract<ReturnType<typeof getDatabricksConfig>, { ok: false }>,
): ErrorResponse {
  return {
    error: "The Databricks data source is not configured.",
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

function parseRangeDays(value: string | null) {
  if (!value) {
    return DEFAULT_RANGE_DAYS;
  }

  const parsed = Number(value);

  return rangeValues.has(parsed) ? parsed : DEFAULT_RANGE_DAYS;
}

function json<T>(body: T, status: number, cacheControl: string) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": cacheControl,
    },
  });
}
