import { NextRequest, NextResponse } from "next/server";

import {
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

const DEFAULT_RANGE_DAYS = 90;
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
    const result = await getPublishedDashboardMetricRows(configResult.config);
    const rows = filterRowsByRange(result.rows, rangeDays);

    return json<DataApiResponse>(
      {
        generatedAt: new Date().toISOString(),
        revisionCreatedAt: result.revisionCreatedAt,
        rangeDays,
        truncated: result.truncated,
        rows,
      },
      200,
      "public, s-maxage=300, stale-while-revalidate=1800",
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
