import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

import {
  type DatabricksConfig,
  getDatabricksConfig,
  getPublishedDashboardMetricRows,
  isProduction,
} from "@/lib/databricks/server";
import {
  metricNames,
  rangeOptions,
  type DataApiResponse,
  type MetricRow,
} from "@/app/[locale]/developers/data/data-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATABRICKS_CACHE_SECONDS = 10 * 60;
const BROWSER_CACHE_SECONDS = 60;
const EDGE_STALE_SECONDS = 30 * 60;
const DEFAULT_RANGE_DAYS = 90;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DATA_UNAVAILABLE_ERROR =
  "Solana data is unavailable right now. Try again in a moment.";
const SUCCESS_CACHE_CONTROL = [
  "public",
  `max-age=${BROWSER_CACHE_SECONDS}`,
  `s-maxage=${DATABRICKS_CACHE_SECONDS}`,
  `stale-while-revalidate=${EDGE_STALE_SECONDS}`,
].join(", ");

type ErrorResponse = {
  error: string;
  detail?: string;
  invalidEnv?: string[];
  missingEnv?: string[];
};

type CachedDatabricksData = Awaited<
  ReturnType<typeof getPublishedDashboardMetricRows>
> & {
  generatedAt: string;
};

const metricNameSet = new Set<string>(metricNames);
const rangeValues = new Set<number>(rangeOptions.map((option) => option.value));
const inFlightDatabricksRequests = new Map<
  string,
  Promise<CachedDatabricksData>
>();
const databricksMemoryCache = new Map<
  string,
  {
    data: CachedDatabricksData;
    expiresAt: number;
    staleUntil: number;
  }
>();

const getCachedDatabricksData = unstable_cache(
  async (cacheKey: string) => {
    const configResult = getDatabricksConfig();

    if (!configResult.ok) {
      throw new Error("Databricks data source is not configured.");
    }

    return getDatabricksDataWithSingleFlight(cacheKey, configResult.config);
  },
  ["solana-data-databricks-metric-rows-v1"],
  {
    revalidate: DATABRICKS_CACHE_SECONDS,
    tags: ["solana-data-databricks"],
  },
);

export async function GET(request: NextRequest) {
  const configResult = getDatabricksConfig();

  if (!configResult.ok) {
    return json<ErrorResponse>(
      {
        error: "The Databricks data source is not configured.",
        ...(isProduction()
          ? {}
          : {
              invalidEnv: configResult.invalidEnv,
              missingEnv: configResult.missingEnv,
            }),
      },
      503,
      "no-store, max-age=0",
    );
  }

  const rangeDays = parseRangeDays(request.nextUrl.searchParams.get("days"));

  try {
    const result = await getCachedDatabricksData(
      getDatabricksCacheKey(configResult.config),
    );
    const rows = filterRowsByRange(result.rows, rangeDays);

    return json<DataApiResponse>(
      {
        generatedAt: result.generatedAt,
        revisionCreatedAt: result.revisionCreatedAt,
        rangeDays,
        truncated: result.truncated,
        rows,
      },
      200,
      SUCCESS_CACHE_CONTROL,
    );
  } catch (error) {
    console.error("Failed to load Solana Databricks data", error);

    return json<ErrorResponse>(
      {
        error: DATA_UNAVAILABLE_ERROR,
        ...(isProduction()
          ? {}
          : {
              detail: error instanceof Error ? error.message : String(error),
            }),
      },
      502,
      "no-store, max-age=0",
    );
  }
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

async function getDatabricksDataWithSingleFlight(
  cacheKey: string,
  config: DatabricksConfig,
) {
  const cached = databricksMemoryCache.get(cacheKey);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const inFlightRequest = inFlightDatabricksRequests.get(cacheKey);

  if (inFlightRequest) {
    return inFlightRequest;
  }

  if (cached && cached.staleUntil > now) {
    void refreshDatabricksData(cacheKey, config).catch((error) => {
      console.error("Failed to refresh cached Solana Databricks data", error);
    });

    return cached.data;
  }

  return refreshDatabricksData(cacheKey, config);
}

function refreshDatabricksData(cacheKey: string, config: DatabricksConfig) {
  const request = getPublishedDashboardMetricRows(config)
    .then((result) => {
      const data = {
        ...result,
        generatedAt: new Date().toISOString(),
      };
      const cachedAt = Date.now();

      databricksMemoryCache.set(cacheKey, {
        data,
        expiresAt: cachedAt + DATABRICKS_CACHE_SECONDS * 1000,
        staleUntil:
          cachedAt + (DATABRICKS_CACHE_SECONDS + EDGE_STALE_SECONDS) * 1000,
      });

      return data;
    })
    .finally(() => {
      inFlightDatabricksRequests.delete(cacheKey);
    });

  inFlightDatabricksRequests.set(cacheKey, request);

  return request;
}

function getDatabricksCacheKey(config: DatabricksConfig) {
  return [
    config.instanceUrl,
    config.workspaceId,
    config.dashboardId,
    config.externalViewerId,
    config.externalValue,
  ].join("|");
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
