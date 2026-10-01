"use client";

import type { MetricSeries } from "@/lib/upgrades/alpenglow-metrics-types";
import { MetricInfo } from "./metric-info";

const COLORS = ["#14F195", "#9945FF", "#00C2FF", "#F6C344"];
const WIDTH = 720;
const HEIGHT = 240;
const PADDING = { top: 16, right: 16, bottom: 32, left: 56 };

function compactNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Renders a compact time-series card with on-demand metric context. */
export function MetricChart({
  title,
  description,
  series,
  unit,
}: {
  title: string;
  description: string;
  series: MetricSeries[];
  unit: string;
}) {
  const allPoints = series.flatMap((item) => item.points);

  if (allPoints.length === 0) {
    return (
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-1">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <MetricInfo label={title} description={description} />
        </div>
        <div className="mt-5 flex h-48 items-center justify-center rounded-lg border border-dashed border-white/10 text-center text-sm text-gray-500">
          No samples are available for this metric.
        </div>
      </section>
    );
  }

  const timestamps = allPoints.map(([timestamp]) => timestamp);
  const values = allPoints.map(([, value]) => value);
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const valuePadding =
    rawMax === rawMin ? Math.max(Math.abs(rawMax) * 0.1, 1) : 0;
  const minValue = Math.min(0, rawMin - valuePadding);
  const maxValue = rawMax + valuePadding;
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const timestampSpan = Math.max(1, maxTimestamp - minTimestamp);
  const valueSpan = Math.max(1, maxValue - minValue);
  const x = (timestamp: number) =>
    PADDING.left + ((timestamp - minTimestamp) / timestampSpan) * plotWidth;
  const y = (value: number) =>
    PADDING.top + ((maxValue - value) / valueSpan) * plotHeight;

  const paths = series.map((item) =>
    item.points
      .map(
        ([timestamp, value], index) =>
          `${index === 0 ? "M" : "L"}${x(timestamp).toFixed(2)},${y(value).toFixed(2)}`,
      )
      .join(" "),
  );
  const formatTime = (timestamp: number) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(timestamp * 1_000);

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-1">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <MetricInfo label={title} description={description} />
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{unit}</p>
          <div className="mt-1.5 flex flex-wrap justify-end gap-x-4 gap-y-2 text-xs text-gray-300">
            {series.map((item, index) => (
              <span key={item.label} className="inline-flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label={`${title}, measured in ${unit}`}
        >
          <desc>{description}</desc>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const gridY = PADDING.top + ratio * plotHeight;
            const value = maxValue - ratio * valueSpan;
            return (
              <g key={ratio}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={gridY}
                  y2={gridY}
                  stroke="rgba(255,255,255,0.08)"
                />
                <text
                  x={PADDING.left - 8}
                  y={gridY + 4}
                  textAnchor="end"
                  fill="#9CA3AF"
                  fontSize="10"
                >
                  {compactNumber(value)}
                </text>
              </g>
            );
          })}
          {paths[0] && (
            <path
              d={`${paths[0]} L${x(maxTimestamp)},${y(minValue)} L${x(minTimestamp)},${y(minValue)} Z`}
              fill={COLORS[0]}
              fillOpacity="0.08"
            />
          )}
          {paths.map((path, index) => (
            <path
              key={series[index]?.label}
              d={path}
              fill="none"
              stroke={COLORS[index % COLORS.length]}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.25"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <text x={PADDING.left} y={HEIGHT - 7} fill="#9CA3AF" fontSize="10">
            {formatTime(minTimestamp)}
          </text>
          <text
            x={WIDTH - PADDING.right}
            y={HEIGHT - 7}
            textAnchor="end"
            fill="#9CA3AF"
            fontSize="10"
          >
            {formatTime(maxTimestamp)}
          </text>
        </svg>
      </div>
    </section>
  );
}
