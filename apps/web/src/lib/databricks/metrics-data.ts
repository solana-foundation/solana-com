import "server-only";

import { Buffer } from "node:buffer";
import {
  brotliCompressSync,
  brotliDecompressSync,
  constants as zlibConstants,
} from "node:zlib";
import { unstable_cache } from "next/cache";

import {
  type DataApiConfig,
  getDataApiMetricRows,
  isProduction,
} from "@/lib/databricks/server";
import {
  metricNames,
  rangeOptions,
  type MetricRow,
} from "@/app/[locale]/data/data-config";

const DATA_API_CACHE_REVALIDATE_SECONDS = 5 * 60;
const MAX_RANGE_DAYS = Math.max(...rangeOptions.map((option) => option.value));
const DATA_API_CACHE_KEY_VERSION = "solana-data-data-api-metric-rows-v1";
const IS_PRODUCTION = isProduction();

export type DataApiMetricsData = {
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

/**
 * The full data-api metric set behind /data. Production reads go through one
 * shared data cache, so the dashboard route and site metrics reuse the same
 * payload and calculations.
 */
export function getMetricsData(
  config: DataApiConfig,
): Promise<DataApiMetricsData> {
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

function fetchMetricsData(config: DataApiConfig): Promise<DataApiMetricsData> {
  return getDataApiMetricRows(config);
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
