import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { Buffer } from "node:buffer";
import {
  brotliCompressSync,
  brotliDecompressSync,
  constants as zlibConstants,
} from "node:zlib";

import {
  type DataApiConfig,
  getDataApiMetricRows,
  getDataApiConfig,
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

const DATA_API_CACHE_REVALIDATE_SECONDS = 12 * 60 * 60;
const EDGE_STALE_SECONDS = 24 * 60 * 60;
const DEFAULT_RANGE_DAYS = 90;
const MAX_RANGE_DAYS = Math.max(...rangeOptions.map((option) => option.value));
const DATA_API_CACHE_KEY_VERSION = "solana-data-data-api-metric-rows-v1";
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

type DataApiMetricsData = {
  generatedAt: string;
  rows: MetricRow[];
  truncated: boolean;
};

type PackedDataApiMetricsData = {
  compression: "br";
  generatedAt: string;
  rows: string;
  truncated: boolean;
};

const metricNameSet = new Set<string>(metricNames);
const rangeValues = new Set<number>(rangeOptions.map((option) => option.value));

export async function GET(request: NextRequest) {
  const configResult = getDataApiConfig();

  if (!configResult.ok) {
    return json<ErrorResponse>(
      getConfigErrorResponse(configResult),
      503,
      NO_STORE_CACHE_CONTROL,
    );
  }

  const rangeDays = parseRangeDays(request.nextUrl.searchParams.get("days"));

  try {
    const result = await getMetricsData(configResult.config);

    return json<DataApiResponse>(
      buildDataResponse(result, rangeDays),
      200,
      getSuccessCacheControl(),
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

function getMetricsData(config: DataApiConfig): Promise<DataApiMetricsData> {
  return IS_PRODUCTION
    ? getCachedMetricsData(config)
    : fetchMetricsData(config);
}

async function getCachedMetricsData(config: DataApiConfig) {
  const dataCacheKey = getMetricsCacheKey(config);
  const cacheKeyParts = [DATA_API_CACHE_KEY_VERSION, dataCacheKey];

  const packedData = await unstable_cache(
    () => getInMemoryCachedMetricsData(config, cacheKeyParts.join("|")),
    cacheKeyParts,
    {
      revalidate: DATA_API_CACHE_REVALIDATE_SECONDS,
      tags: ["solana-data-metrics"],
    },
  )();

  return unpackMetricsData(packedData);
}

async function fetchMetricsData(
  config: DataApiConfig,
): Promise<DataApiMetricsData> {
  const result = await getDataApiMetricRows(config);

  return {
    ...result,
    generatedAt: new Date().toISOString(),
  };
}

async function fetchPackedMetricsData(config: DataApiConfig) {
  return packMetricsData(await fetchMetricsData(config));
}

function packMetricsData(data: DataApiMetricsData): PackedDataApiMetricsData {
  return {
    compression: "br",
    generatedAt: data.generatedAt,
    rows: brotliCompressSync(Buffer.from(JSON.stringify(data.rows)), {
      params: {
        [zlibConstants.BROTLI_PARAM_QUALITY]: 5,
      },
    }).toString("base64"),
    truncated: data.truncated,
  };
}

function unpackMetricsData(data: PackedDataApiMetricsData): DataApiMetricsData {
  return {
    generatedAt: data.generatedAt,
    rows: JSON.parse(
      brotliDecompressSync(Buffer.from(data.rows, "base64")).toString("utf8"),
    ) as MetricRow[],
    truncated: data.truncated,
  };
}

const metricsDataRequests = new Map<
  string,
  Promise<PackedDataApiMetricsData>
>();

function getInMemoryCachedMetricsData(config: DataApiConfig, cacheKey: string) {
  const cachedRequest = metricsDataRequests.get(cacheKey);

  if (cachedRequest) {
    return cachedRequest;
  }

  pruneMetricsDataRequests(cacheKey);

  const request = fetchPackedMetricsData(config);

  request.then(
    () => metricsDataRequests.delete(cacheKey),
    () => metricsDataRequests.delete(cacheKey),
  );

  metricsDataRequests.set(cacheKey, request);

  return request;
}

function pruneMetricsDataRequests(activeCacheKey: string) {
  for (const cacheKey of metricsDataRequests.keys()) {
    if (cacheKey !== activeCacheKey) {
      metricsDataRequests.delete(cacheKey);
    }
  }
}

function getMetricsCacheKey(config: DataApiConfig) {
  return [config.baseUrl, MAX_RANGE_DAYS, metricNames.join(",")].join("|");
}

function getSuccessCacheControl() {
  if (!IS_PRODUCTION) {
    return NO_STORE_CACHE_CONTROL;
  }

  return [
    "public",
    "max-age=0",
    `s-maxage=${DATA_API_CACHE_REVALIDATE_SECONDS}`,
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
