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
const BROWSER_CACHE_SECONDS = 60;
const EDGE_STALE_SECONDS = 24 * 60 * 60;
const DEFAULT_RANGE_DAYS = 90;
const IS_PRODUCTION = isProduction();
const NO_STORE_CACHE_CONTROL = "no-store, max-age=0";
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DATA_REFRESH_TIME_ZONE = "America/New_York";
// Source jobs run around 9 AM and 9 PM Eastern; roll dashboard caches an hour later.
const DATA_REFRESH_HOURS = [10, 22] as const;
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
    const result = await getDatabricksData(configResult.config, rangeDays);

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

function getDatabricksData(config: DatabricksConfig, rangeDays: number) {
  return IS_PRODUCTION
    ? getCachedDatabricksData(config, rangeDays)
    : fetchDatabricksData(config, rangeDays);
}

function getCachedDatabricksData(config: DatabricksConfig, rangeDays: number) {
  return unstable_cache(
    () => fetchDatabricksData(config, rangeDays),
    [
      "solana-data-databricks-metric-rows-v3",
      getDatabricksRefreshCacheKey(),
      getDatabricksCacheKey(config, rangeDays),
    ],
    {
      revalidate: DATABRICKS_CACHE_REVALIDATE_SECONDS,
      tags: ["solana-data-databricks"],
    },
  )();
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

function getDatabricksRefreshCacheKey(now = new Date()) {
  const parts = getTimeZoneDateTimeParts(now, DATA_REFRESH_TIME_ZONE);
  const latestRefreshHour = getLatestScheduledRefreshHour(parts.hour);
  const refreshHour =
    latestRefreshHour ?? DATA_REFRESH_HOURS[DATA_REFRESH_HOURS.length - 1];
  const refreshDate = new Date(
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day + (latestRefreshHour === undefined ? -1 : 0),
      refreshHour,
    ),
  );

  return `${refreshDate.toISOString().slice(0, 10)}-${String(refreshHour).padStart(2, "0")}`;
}

function getSuccessCacheControl(now = new Date()) {
  if (!IS_PRODUCTION) {
    return NO_STORE_CACHE_CONTROL;
  }

  return [
    "public",
    `max-age=${BROWSER_CACHE_SECONDS}`,
    `s-maxage=${getSecondsUntilNextScheduledRefresh(now)}`,
    `stale-while-revalidate=${EDGE_STALE_SECONDS}`,
  ].join(", ");
}

function getSecondsUntilNextScheduledRefresh(now = new Date()) {
  const parts = getTimeZoneDateTimeParts(now, DATA_REFRESH_TIME_ZONE);
  const nextRefresh = getScheduledRefreshDate(parts, now);
  const seconds = Math.ceil((nextRefresh.getTime() - now.getTime()) / 1000);

  return Math.max(1, seconds);
}

function getScheduledRefreshDate(
  parts: ReturnType<typeof getTimeZoneDateTimeParts>,
  now: Date,
) {
  const nextRefreshHour = getNextScheduledRefreshHour(parts.hour);
  const refreshHour = nextRefreshHour ?? DATA_REFRESH_HOURS[0];
  const dayOffset = nextRefreshHour === undefined ? 1 : 0;

  return zonedTimeToUtc(
    parts.year,
    parts.month,
    parts.day + dayOffset,
    refreshHour,
    DATA_REFRESH_TIME_ZONE,
    now,
  );
}

function getLatestScheduledRefreshHour(hour: number) {
  return DATA_REFRESH_HOURS.findLast((refreshHour) => hour >= refreshHour);
}

function getNextScheduledRefreshHour(hour: number) {
  return DATA_REFRESH_HOURS.find((refreshHour) => hour < refreshHour);
}

function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  timeZone: string,
  referenceDate: Date,
) {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour));
  const firstPass = new Date(
    utcGuess.getTime() - getTimeZoneOffsetMs(utcGuess, timeZone),
  );
  const secondPass = new Date(
    utcGuess.getTime() - getTimeZoneOffsetMs(firstPass, timeZone),
  );

  return Math.abs(secondPass.getTime() - referenceDate.getTime()) <
    DAY_IN_MS * 2
    ? secondPass
    : firstPass;
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = getTimeZoneDateTimeParts(date, timeZone);
  const zonedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return zonedAsUtc - date.getTime();
}

function getTimeZoneDateTimeParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(date);
  const valueByType = new Map(
    parts.map((part) => [part.type, Number(part.value)]),
  );

  return {
    day: valueByType.get("day") ?? 1,
    hour: valueByType.get("hour") ?? 0,
    minute: valueByType.get("minute") ?? 0,
    month: valueByType.get("month") ?? 1,
    second: valueByType.get("second") ?? 0,
    year: valueByType.get("year") ?? 1970,
  };
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
