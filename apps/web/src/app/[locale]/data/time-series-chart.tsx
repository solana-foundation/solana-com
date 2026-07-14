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
import { useLocale, useTranslations } from "@workspace/i18n/client";

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
  timeGranularity?: TimeGranularity;
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

export type TimeGranularity = "day" | "hour";

const baseMargin = {
  top: 16,
  right: 20,
  bottom: 36,
  left: 62,
};

const compactChartMaxWidth = 767;
const coincidentDashPatterns = ["6 4", "2 4"] as const;
const dimmedSeriesOpacity = 0.25;
const yAxisTickCount = 4;
const percentDomainMin = 0;
const percentDomainMax = 100;
const percentMinimumDomainSpan = 1;

export function TimeSeriesChart({
  series,
  valueLabel,
  height = 320,
  timeGranularity = "day",
}: TimeSeriesChartProps) {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");
  const [disabledSeries, setDisabledSeries] = useState<Set<string>>(new Set());
  const [hoveredSeriesId, setHoveredSeriesId] = useState<string | null>(null);
  const visibleSeries = useMemo(
    () => series.filter((item) => !disabledSeries.has(item.id)),
    [disabledSeries, series],
  );
  const seriesDashPatterns = useMemo(
    () => getSeriesDashPatterns(visibleSeries),
    [visibleSeries],
  );
  const highlightedSeriesId = visibleSeries.some(
    (item) => item.id === hoveredSeriesId,
  )
    ? hoveredSeriesId
    : null;
  const allSeriesSelected = visibleSeries.length === series.length;

  return (
    <div className="flex min-w-0 flex-col gap-4 [--chart-axis:#ABABBA] [--chart-grid:#ECE4FD1F] [--chart-muted:#ABABBA]">
      <div className="flex min-h-6 w-full flex-wrap items-center gap-1.5">
        {series.map((item) => {
          const disabled = disabledSeries.has(item.id);

          return (
            <button
              aria-pressed={!disabled}
              className={cn(
                "inline-flex items-center gap-2 border px-2.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase transition-colors",
                disabled
                  ? "border-nd-border-light text-nd-mid-em-text/50"
                  : "border-nd-border-prominent text-nd-high-em-text hover:bg-nd-border-light/20",
              )}
              key={item.id}
              onBlur={() => setHoveredSeriesId(null)}
              onClick={() => {
                setDisabledSeries((current) => {
                  const next = new Set(current);

                  if (next.has(item.id)) {
                    next.delete(item.id);
                  } else {
                    next.add(item.id);
                  }

                  return next;
                });
              }}
              onFocus={() => setHoveredSeriesId(item.id)}
              onMouseEnter={() => setHoveredSeriesId(item.id)}
              onMouseLeave={() => setHoveredSeriesId(null)}
              type="button"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5"
                style={{
                  backgroundColor: disabled ? `${item.color}66` : item.color,
                }}
              />
              {item.label}
            </button>
          );
        })}
        {series.length > 1 ? (
          <button
            className="inline-flex items-center border border-nd-border-prominent px-2.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text transition-colors hover:bg-nd-border-light/20 hover:text-nd-high-em-text"
            onClick={() => {
              setDisabledSeries(
                allSeriesSelected
                  ? new Set(series.map((item) => item.id))
                  : new Set(),
              );
            }}
            type="button"
          >
            {allSeriesSelected
              ? t("legend.deselectAll")
              : t("legend.selectAll")}
          </button>
        ) : null}
      </div>

      <div className="relative" style={{ height }}>
        {visibleSeries.length > 0 ? (
          <ParentSize>
            {({ width, height: measuredHeight }) => (
              <ChartSvg
                height={measuredHeight}
                highlightedSeriesId={highlightedSeriesId}
                locale={locale}
                series={visibleSeries}
                seriesDashPatterns={seriesDashPatterns}
                timeGranularity={timeGranularity}
                valueLabel={valueLabel}
                width={width}
              />
            )}
          </ParentSize>
        ) : (
          <div className="flex h-full items-center justify-center border border-dashed border-nd-border-light font-brand-mono text-[12px] uppercase tracking-normal text-nd-mid-em-text">
            {t("empty.selectAtLeastOneSeries")}
          </div>
        )}
      </div>
    </div>
  );
}

function ChartSvg({
  height,
  highlightedSeriesId,
  locale,
  series,
  seriesDashPatterns,
  timeGranularity,
  valueLabel,
  width,
}: {
  height: number;
  highlightedSeriesId: string | null;
  locale: string;
  series: ChartSeries[];
  seriesDashPatterns: ReadonlyMap<string, string>;
  timeGranularity: TimeGranularity;
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

  const margin =
    width <= compactChartMaxWidth
      ? { top: 16, right: 12, bottom: 32, left: 52 }
      : baseMargin;
  const innerWidth = Math.max(width - margin.left - margin.right, 0);
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0);
  const points = series.flatMap((item) => item.points);
  const dateValues = Array.from(
    new Set(points.map((point) => point.date.getTime())),
  ).sort((a, b) => a - b);
  const xDomain = getDateDomain(points);
  const yDomain = getValueDomain(points, valueLabel);
  const xScale = scaleTime<number>({
    domain: xDomain,
    range: [0, innerWidth],
  });
  const yScale = scaleLinear<number>({
    domain: yDomain,
    nice: true,
    range: [innerHeight, 0],
  });
  const yTickValues = getYAxisTickValues(
    yScale.ticks(yAxisTickCount),
    yScale.domain(),
    valueLabel,
  );
  const formatYAxisValue = getAxisValueFormatter(valueLabel, locale);

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
            scale={yScale}
            stroke="var(--chart-grid)"
            strokeDasharray="2 4"
            tickValues={yTickValues}
            width={innerWidth}
          />

          <AxisLeft
            hideAxisLine
            hideTicks
            scale={yScale}
            tickFormat={(value) => formatYAxisValue(Number(value))}
            tickLabelProps={() => ({
              fill: "var(--chart-muted)",
              fontSize: 11,
              fontWeight: 600,
              textAnchor: "end",
              dy: "0.33em",
              dx: "-0.6em",
            })}
            tickValues={yTickValues}
          />

          <AxisBottom
            hideAxisLine
            hideTicks
            numTicks={Math.max(2, Math.floor(innerWidth / 140))}
            scale={xScale}
            tickFormat={(value) =>
              formatDateTick(value as Date, locale, timeGranularity)
            }
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
              strokeDasharray={seriesDashPatterns.get(item.id)}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={
                highlightedSeriesId && highlightedSeriesId !== item.id
                  ? dimmedSeriesOpacity
                  : 1
              }
              strokeWidth={2}
              style={{ transition: "stroke-opacity 150ms ease" }}
              x={(point) => xScale(point.date)}
              y={(point) => yScale(getPlottedValue(point.value, valueLabel))}
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
              <rect
                fill="#000000"
                height={8}
                key={item.label}
                stroke={item.color}
                strokeWidth={2}
                width={8}
                x={xScale(point.date) - 4}
                y={yScale(getPlottedValue(point.value, valueLabel)) - 4}
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
                .filter((item): item is TooltipValue => Boolean(item))
                .sort(compareTooltipValues);

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
          className="!rounded-none !border !border-nd-border-prominent !bg-nd-inverse !px-3 !py-2.5 !text-xs !text-nd-high-em-text !shadow-2xl font-brand"
          left={tooltipLeft}
          top={tooltipTop}
        >
          <div className="font-brand-mono text-[11px] font-bold uppercase tracking-normal text-nd-mid-em-text">
            {formatTooltipDate(tooltipData.date, locale, timeGranularity)}
          </div>
          <div className="mt-2 grid gap-1.5">
            {tooltipData.values.map((item) => (
              <div
                className="grid grid-cols-[auto_1fr_auto] items-center gap-2"
                key={item.label}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-nd-mid-em-text">{item.label}</span>
                <span className="font-medium tabular-nums text-nd-high-em-text">
                  {formatValue(item.value, valueLabel, locale)}
                </span>
              </div>
            ))}
          </div>
        </TooltipWithBounds>
      ) : null}
    </>
  );
}

export function getSeriesDashPatterns(series: ChartSeries[]) {
  const patterns = new Map<string, string>();

  series.forEach((item, index) => {
    const coincidentCount = series
      .slice(0, index)
      .filter((earlier) =>
        arePointsCoincident(item.points, earlier.points),
      ).length;

    if (coincidentCount > 0) {
      patterns.set(
        item.id,
        coincidentDashPatterns[
          (coincidentCount - 1) % coincidentDashPatterns.length
        ],
      );
    }
  });

  return patterns;
}

export function compareTooltipValues(a: TooltipValue, b: TooltipValue) {
  return b.value - a.value || a.label.localeCompare(b.label);
}

export function getAxisValueFormatter(valueLabel: string, locale = "en") {
  if (valueLabel !== "Percent") {
    return (value: number) => formatAxisValue(value, valueLabel, locale);
  }

  return (value: number) => formatWholePercentNumber(value, locale);
}

export function getYAxisTickValues(
  tickValues: readonly number[],
  domain: readonly number[],
  valueLabel: string,
) {
  if (valueLabel !== "Percent") {
    return [...tickValues];
  }

  return getWholePercentTickValues(domain);
}

function arePointsCoincident(a: SeriesPoint[], b: SeriesPoint[]) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((pointA, index) => {
    const pointB = b[index];

    return (
      pointA.date.getTime() === pointB.date.getTime() &&
      areValuesClose(pointA.value, pointB.value)
    );
  });
}

function areValuesClose(a: number, b: number) {
  const scale = Math.max(Math.abs(a), Math.abs(b));

  return Math.abs(a - b) <= scale * 1e-9;
}

function getDateDomain(points: SeriesPoint[]): [Date, Date] {
  if (points.length === 0) {
    const now = new Date();
    return [now, now];
  }

  const values = points.map((point) => point.date.getTime());
  return [new Date(Math.min(...values)), new Date(Math.max(...values))];
}

export function getValueDomain(
  points: SeriesPoint[],
  valueLabel?: string,
): [number, number] {
  const values = points
    .map((point) => point.value)
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) {
    return [0, 1];
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  if (valueLabel === "Percent") {
    return getPercentValueDomain(minValue, maxValue);
  }

  if (minValue === maxValue) {
    const padding = Math.max(Math.abs(maxValue) * 0.08, 1);
    return [
      maxValue >= 0 ? Math.max(0, maxValue - padding) : maxValue - padding,
      maxValue + padding,
    ];
  }

  const padding = (maxValue - minValue) * 0.08;

  return [
    minValue >= 0 ? Math.max(0, minValue - padding) : minValue - padding,
    maxValue + padding,
  ];
}

function getPercentValueDomain(
  minValue: number,
  maxValue: number,
): [number, number] {
  const boundedMinValue = clamp(minValue, percentDomainMin, percentDomainMax);
  const boundedMaxValue = clamp(maxValue, percentDomainMin, percentDomainMax);
  const domain =
    boundedMinValue === boundedMaxValue
      ? fitBoundedDomainToMinimumSpan(
          boundedMinValue - percentMinimumDomainSpan / 2,
          boundedMaxValue + percentMinimumDomainSpan / 2,
          percentDomainMin,
          percentDomainMax,
          percentMinimumDomainSpan,
        )
      : fitBoundedDomainToMinimumSpan(
          boundedMinValue - (boundedMaxValue - boundedMinValue) * 0.08,
          boundedMaxValue + (boundedMaxValue - boundedMinValue) * 0.08,
          percentDomainMin,
          percentDomainMax,
          percentMinimumDomainSpan,
        );

  return roundPercentDomainToWholeNumbers(domain);
}

function roundPercentDomainToWholeNumbers([minValue, maxValue]: [
  number,
  number,
]): [number, number] {
  let domainMin = clamp(
    Math.floor(minValue),
    percentDomainMin,
    percentDomainMax,
  );
  let domainMax = clamp(
    Math.ceil(maxValue),
    percentDomainMin,
    percentDomainMax,
  );

  if (domainMax - domainMin < percentMinimumDomainSpan) {
    if (domainMax >= percentDomainMax) {
      domainMin = percentDomainMax - percentMinimumDomainSpan;
    } else {
      domainMax = domainMin + percentMinimumDomainSpan;
    }
  }

  return [
    clamp(domainMin, percentDomainMin, percentDomainMax),
    clamp(domainMax, percentDomainMin, percentDomainMax),
  ];
}

function getWholePercentTickValues(domain: readonly number[]) {
  const [rawMin = percentDomainMin, rawMax = percentDomainMax] = domain;
  const domainMin = Math.ceil(
    clamp(Math.min(rawMin, rawMax), percentDomainMin, percentDomainMax),
  );
  const domainMax = Math.floor(
    clamp(Math.max(rawMin, rawMax), percentDomainMin, percentDomainMax),
  );

  if (domainMax < domainMin) {
    return [clamp(Math.round(rawMax), percentDomainMin, percentDomainMax)];
  }

  const span = domainMax - domainMin;

  if (span <= 6) {
    return Array.from({ length: span + 1 }, (_, index) => domainMin + index);
  }

  const step = getWholePercentTickStep(span);
  const ticks = [domainMin];

  for (
    let tick = Math.ceil(domainMin / step) * step;
    tick < domainMax;
    tick += step
  ) {
    if (tick !== domainMin) {
      ticks.push(tick);
    }
  }

  if (ticks.at(-1) !== domainMax) {
    ticks.push(domainMax);
  }

  return ticks;
}

function getWholePercentTickStep(span: number) {
  const targetStep = span / yAxisTickCount;

  return (
    [1, 2, 5, 10, 20, 25, 50, 100].find((step) => step >= targetStep) ?? 100
  );
}

function getPlottedValue(value: number, valueLabel: string) {
  if (valueLabel === "Percent") {
    return clamp(value, percentDomainMin, percentDomainMax);
  }

  return value;
}

function clamp(value: number, minValue: number, maxValue: number) {
  return Math.min(Math.max(value, minValue), maxValue);
}

function fitBoundedDomainToMinimumSpan(
  minValue: number,
  maxValue: number,
  lowerBound: number,
  upperBound: number,
  minimumSpan: number,
): [number, number] {
  let domainMin = Math.max(lowerBound, minValue);
  let domainMax = Math.min(upperBound, maxValue);

  if (domainMax - domainMin < minimumSpan) {
    const deficit = minimumSpan - (domainMax - domainMin);

    domainMin -= deficit / 2;
    domainMax += deficit / 2;
  }

  if (domainMin < lowerBound) {
    domainMax += lowerBound - domainMin;
    domainMin = lowerBound;
  }

  if (domainMax > upperBound) {
    domainMin -= domainMax - upperBound;
    domainMax = upperBound;
  }

  return [Math.max(lowerBound, domainMin), Math.min(upperBound, domainMax)];
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

function formatDateTick(
  value: Date,
  locale: string,
  timeGranularity: TimeGranularity,
) {
  if (timeGranularity === "hour") {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      hour: "numeric",
      month: "short",
    }).format(value);
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(value);
}

function formatTooltipDate(
  value: Date,
  locale: string,
  timeGranularity: TimeGranularity,
) {
  if (timeGranularity === "hour") {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(value);
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export function formatValue(value: number, valueLabel: string, locale = "en") {
  if (valueLabel === "USD") {
    return `$${formatCompactNumber(value, locale)}`;
  }

  if (valueLabel === "Percent") {
    return formatWholePercentNumber(value, locale);
  }

  if (valueLabel === "Milliseconds") {
    return formatMillisecondsNumber(value, locale);
  }

  return formatCompactNumber(value, locale);
}

function formatAxisValue(value: number, valueLabel: string, locale: string) {
  if (valueLabel === "Percent") {
    return formatWholePercentNumber(value, locale);
  }

  return formatCompactNumber(value, locale);
}

function formatWholePercentNumber(value: number, locale: string) {
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(clamp(Math.round(value), percentDomainMin, percentDomainMax))}%`;
}

function formatCompactNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: value >= 10 ? 1 : 2,
    notation: "compact",
  }).format(value);
}

function formatMillisecondsNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value);
}
