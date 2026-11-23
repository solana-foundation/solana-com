import { NextResponse } from "next/server";

import {
  loadMetrics,
  METRICS_STREAM_REVALIDATE_SECONDS,
} from "@/lib/metrics/loader";
import { metricRegistry, type MetricKey } from "@/lib/metrics/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Every registry metric with its current value, date, status, and source:
 * the same cached stream the site renders from. Reads never reach upstream
 * APIs directly; the stream refreshes once an hour.
 */
export async function GET() {
  const keys = Object.keys(metricRegistry) as MetricKey[];
  const metrics = await loadMetrics(keys);

  return NextResponse.json(
    {
      refreshSeconds: METRICS_STREAM_REVALIDATE_SECONDS,
      metrics: Object.fromEntries(
        keys.map((key) => {
          const { value, asOf, status, definition } = metrics[key];
          return [
            key,
            {
              value,
              asOf,
              status,
              unit: definition.unit,
              period: definition.period,
              source: definition.source,
              definition: definition.definition,
            },
          ];
        }),
      ),
    },
    {
      headers: {
        "Cache-Control": `public, s-maxage=300, stale-while-revalidate=${METRICS_STREAM_REVALIDATE_SECONDS}`,
      },
    },
  );
}
