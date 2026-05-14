"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { TooltipWithBounds, useTooltip } from "@visx/tooltip";
import { useMemo, useState } from "react";

import { cn } from "@/app/components/utils";

export type SeriesPoint = {
  date: Date;
  value: number;
};

export type ChartSeries = {
  id: string;
  label: string;
  color: string;
  points: SeriesPoint[];
};

type TimeSeriesChartProps = {
  series: ChartSeries[];
  valueLabel: string;
  height?: number;
};

type TooltipValue = {
  color: string;
  label: string;
  value: number;
};

type TooltipData = {
  date: Date;
  values: TooltipValue[];
};

const margin = {
  top: 16,
  right: 20,
  bottom: 36,
  left: 62,
};

export function TimeSeriesChart({
  series,
  valueLabel,
  height = 320,
}: TimeSeriesChartProps) {
  const [disabledSeries, setDisabledSeries] = useState<Set<string>>(new Set());
  const visibleSeries = useMemo(
    () => series.filter((item) => !disabledSeries.has(item.id)),
    [disabledSeries, series],
  );

  return (
    <div className="grid gap-3 [--chart-axis:#a1a1aa] [--chart-grid:#e4e4e7] [--chart-muted:#71717a] dark:[--chart-axis:#71717a] dark:[--chart-grid:#27272a] dark:[--chart-muted:#a1a1aa]">
      <div className="flex min-h-6 flex-wrap items-center gap-2">
        {series.map((item) => {
          const disabled = disabledSeries.has(item.id);

          return (
            <button
              aria-pressed={!disabled}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                disabled
                  ? "border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700",
              )}
              key={item.id}
              onClick={() => {
                setDisabledSeries((current) => {
                  const next = new Set(current);

                  if (next.has(item.id)) {
                    next.delete(item.id);
                  } else if (next.size < series.length - 1) {
                    next.add(item.id);
                  }

                  return next;
                });
              }}
              type="button"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="relative" style={{ height }}>
        {visibleSeries.length > 0 ? (
          <ParentSize>
            {({ width, height: measuredHeight }) => (
              <ChartSvg
                height={measuredHeight}
                series={visibleSeries}
                valueLabel={valueLabel}
                width={width}
              />
            )}
          </ParentSize>
        ) : (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-zinc-200 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
            Select at least one series
          </div>
        )}
      </div>
    </div>
  );
}

function ChartSvg({
  height,
  series,
  valueLabel,
  width,
}: {
  height: number;
  series: ChartSeries[];
  valueLabel: string;
  width: number;
}) {
  const {
    hideTooltip,
    showTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<TooltipData>();

  const innerWidth = Math.max(width - margin.left - margin.right, 0);
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0);
  const points = series.flatMap((item) => item.points);
  const dateValues = Array.from(
    new Set(points.map((point) => point.date.getTime())),
  ).sort((a, b) => a - b);
  const xDomain = getDateDomain(points);
  const yDomain = getValueDomain(points);
  const xScale = scaleTime<number>({
    domain: xDomain,
    range: [0, innerWidth],
  });
  const yScale = scaleLinear<number>({
    domain: yDomain,
    nice: true,
    range: [innerHeight, 0],
  });

  if (width < 10 || height < 10 || innerWidth <= 0 || innerHeight <= 0) {
    return null;
  }

  return (
    <>
      <svg height={height} width={width}>
        <Group left={margin.left} top={margin.top}>
          <GridRows
            height={innerHeight}
            left={0}
            numTicks={4}
            scale={yScale}
            stroke="var(--chart-grid)"
            strokeDasharray="2 4"
            width={innerWidth}
          />

          <AxisLeft
            hideAxisLine
            hideTicks
            numTicks={4}
            scale={yScale}
            tickFormat={(value) => formatCompactNumber(Number(value))}
            tickLabelProps={() => ({
              fill: "var(--chart-muted)",
              fontSize: 11,
              fontWeight: 600,
              textAnchor: "end",
              dy: "0.33em",
              dx: "-0.6em",
            })}
          />

          <AxisBottom
            hideAxisLine
            hideTicks
            numTicks={Math.max(2, Math.floor(innerWidth / 140))}
            scale={xScale}
            tickFormat={(value) => formatDateTick(value as Date)}
            tickLabelProps={() => ({
              fill: "var(--chart-muted)",
              fontSize: 11,
              fontWeight: 600,
              textAnchor: "middle",
              dy: "0.75em",
            })}
            top={innerHeight}
          />

          {series.map((item) => (
            <LinePath
              data={item.points}
              defined={(point) => Number.isFinite(point.value)}
              key={item.id}
              stroke={item.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              x={(point) => xScale(point.date)}
              y={(point) => yScale(point.value)}
            />
          ))}

          {tooltipData ? (
            <line
              stroke="var(--chart-axis)"
              strokeDasharray="3 4"
              x1={tooltipLeft - margin.left}
              x2={tooltipLeft - margin.left}
              y1={0}
              y2={innerHeight}
            />
          ) : null}

          {tooltipData?.values.map((item) => {
            const point = series
              .find((seriesItem) => seriesItem.label === item.label)
              ?.points.find(
                (seriesPoint) =>
                  seriesPoint.date.getTime() === tooltipData.date.getTime(),
              );

            if (!point) {
              return null;
            }

            return (
              <circle
                cx={xScale(point.date)}
                cy={yScale(point.value)}
                fill="var(--chart-bg, #09090b)"
                key={item.label}
                r={4}
                stroke={item.color}
                strokeWidth={2}
              />
            );
          })}

          <rect
            fill="transparent"
            height={innerHeight}
            onMouseLeave={hideTooltip}
            onMouseMove={(event) => {
              const point = localPoint(event);

              if (!point || dateValues.length === 0) {
                return;
              }

              const x = point.x - margin.left;
              const date = xScale.invert(x);
              const nearestTime = getNearestDateValue(
                date.getTime(),
                dateValues,
              );

              if (!nearestTime) {
                return;
              }

              const tooltipDate = new Date(nearestTime);
              const values = series
                .map((item) => {
                  const value = item.points.find(
                    (seriesPoint) => seriesPoint.date.getTime() === nearestTime,
                  )?.value;

                  if (typeof value !== "number") {
                    return null;
                  }

                  return {
                    color: item.color,
                    label: item.label,
                    value,
                  };
                })
                .filter((item): item is TooltipValue => Boolean(item));

              showTooltip({
                tooltipData: {
                  date: tooltipDate,
                  values,
                },
                tooltipLeft: xScale(tooltipDate) + margin.left,
                tooltipTop: margin.top,
              });
            }}
            width={innerWidth}
          />
        </Group>
      </svg>

      {tooltipData ? (
        <TooltipWithBounds
          className="!rounded-md !border !border-zinc-200 !bg-white !px-3 !py-2 !text-xs !text-zinc-950 !shadow-lg dark:!border-zinc-800 dark:!bg-zinc-950 dark:!text-zinc-50"
          left={tooltipLeft}
          top={tooltipTop}
        >
          <div className="font-semibold">
            {formatTooltipDate(tooltipData.date)}
          </div>
          <div className="mt-2 grid gap-1.5">
            {tooltipData.values.map((item) => (
              <div
                className="grid grid-cols-[auto_1fr_auto] items-center gap-2"
                key={item.label}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-zinc-500 dark:text-zinc-400">
                  {item.label}
                </span>
                <span className="font-semibold tabular-nums">
                  {formatValue(item.value, valueLabel)}
                </span>
              </div>
            ))}
          </div>
        </TooltipWithBounds>
      ) : null}
    </>
  );
}

function getDateDomain(points: SeriesPoint[]): [Date, Date] {
  if (points.length === 0) {
    const now = new Date();
    return [now, now];
  }

  const values = points.map((point) => point.date.getTime());
  return [new Date(Math.min(...values)), new Date(Math.max(...values))];
}

function getValueDomain(points: SeriesPoint[]): [number, number] {
  if (points.length === 0) {
    return [0, 1];
  }

  const values = points.map((point) => point.value);
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(...values);

  if (minValue === maxValue) {
    return [0, maxValue || 1];
  }

  return [minValue, maxValue * 1.08];
}

function getNearestDateValue(value: number, values: number[]) {
  let nearest = values[0];
  let nearestDistance = Math.abs(value - nearest);

  for (const item of values) {
    const distance = Math.abs(value - item);

    if (distance < nearestDistance) {
      nearest = item;
      nearestDistance = distance;
    }
  }

  return nearest;
}

function formatDateTick(value: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(value);
}

function formatTooltipDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export function formatValue(value: number, valueLabel: string) {
  if (valueLabel === "USD") {
    return `$${formatCompactNumber(value)}`;
  }

  return formatCompactNumber(value);
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: value >= 10 ? 1 : 2,
    notation: "compact",
  }).format(value);
}
