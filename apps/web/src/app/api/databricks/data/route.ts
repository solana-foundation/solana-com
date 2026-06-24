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
  normalizeProviderName,
  rangeOptions,
  type DataApiResponse,
  type MetricRow,
} from "@/app/[locale]/data/data-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATABRICKS_CACHE_REVALIDATE_SECONDS = 12 * 60 * 60;
const EDGE_STALE_SECONDS = 24 * 60 * 60;
const DEFAULT_RANGE_DAYS = 90;
const MAX_RANGE_DAYS = Math.max(...rangeOptions.map((option) => option.value));
const DATABRICKS_CACHE_KEY_VERSION = "solana-data-databricks-metric-rows-v4";
const IS_PRODUCTION = isProduction();
const NO_STORE_CACHE_CONTROL = "no-store, max-age=0";
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DATA_UNAVAILABLE_ERROR =
  "Solana data is unavailable right now. Try again in a moment.";

type ErrorResponse = {
  error: string;
  detail?: string;
  invalidEnv?: string[];
  missingEnv?: string[];
};

const metricNameSet = new Set<string>(metricNames);
const rangeValues = new Set<number>(rangeOptions.map((option) => option.value));

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
    const result = await getDatabricksData(configResult.config);

    return json<DataApiResponse>(
      buildDataResponse(result, rangeDays),
      200,
      getSuccessCacheControl(),
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
  const cutoffDate = new Date(Date.now() - rangeDays * DAY_IN_MS)
    .toISOString()
    .slice(0, 10);

  return rows.flatMap((row) => {
    if (!metricNameSet.has(row.metricName) || row.date < cutoffDate) {
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

function getDatabricksData(config: DatabricksConfig) {
  return IS_PRODUCTION
    ? getCachedDatabricksData(config)
    : fetchDatabricksData(config);
}

function getCachedDatabricksData(config: DatabricksConfig) {
  const dataCacheKey = getDatabricksCacheKey(config);
  const cacheKeyParts = [DATABRICKS_CACHE_KEY_VERSION, dataCacheKey];

  return unstable_cache(
    () => getInMemoryCachedDatabricksData(config, cacheKeyParts.join("|")),
    cacheKeyParts,
    {
      revalidate: DATABRICKS_CACHE_REVALIDATE_SECONDS,
      tags: ["solana-data-databricks"],
    },
  )();
}

async function fetchDatabricksData(config: DatabricksConfig) {
  const result = await getDatabricksSqlMetricRows(config, {
    lookbackDays: MAX_RANGE_DAYS,
    metricNames,
  });

  return {
    ...result,
    generatedAt: new Date().toISOString(),
  };
}

const databricksDataRequests = new Map<
  string,
  Promise<Awaited<ReturnType<typeof fetchDatabricksData>>>
>();

function getInMemoryCachedDatabricksData(
  config: DatabricksConfig,
  cacheKey: string,
) {
  const cachedRequest = databricksDataRequests.get(cacheKey);

  if (cachedRequest) {
    return cachedRequest;
  }

  pruneDatabricksDataRequests(cacheKey);

  const request = fetchDatabricksData(config);

  request.then(
    () => databricksDataRequests.delete(cacheKey),
    () => databricksDataRequests.delete(cacheKey),
  );

  databricksDataRequests.set(cacheKey, request);

  return request;
}

function pruneDatabricksDataRequests(activeCacheKey: string) {
  for (const cacheKey of databricksDataRequests.keys()) {
    if (cacheKey !== activeCacheKey) {
      databricksDataRequests.delete(cacheKey);
    }
  }
}

function getDatabricksCacheKey(config: DatabricksConfig) {
  return [
    config.serverHostname,
    config.httpPath,
    config.warehouseId,
    MAX_RANGE_DAYS,
    metricNames.join(","),
  ].join("|");
}

function getSuccessCacheControl() {
  if (!IS_PRODUCTION) {
    return NO_STORE_CACHE_CONTROL;
  }

  return [
    "public",
    "max-age=0",
    `s-maxage=${DATABRICKS_CACHE_REVALIDATE_SECONDS}`,
    `stale-while-revalidate=${EDGE_STALE_SECONDS}`,
  ].join(", ");
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
