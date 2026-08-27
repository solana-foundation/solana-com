"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleLog, scaleTime } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { TooltipWithBounds, useTooltip } from "@visx/tooltip";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";

import { cn } from "@/app/components/utils";

import type { ChartScale, MetricRowDetail } from "./data-config";

export type SeriesPoint = {
  date: Date;
  defined?: boolean;
  details?: MetricRowDetail[];
  value: number;
};

export type ChartSeries = {
  color: string;
  dashPattern?: string;
  id: string;
  label: string;
  points: SeriesPoint[];
};

type TimeSeriesChartProps = {
  ariaLabel?: string;
  height?: number;
  interactiveLegend?: boolean;
  scaleType?: ChartScale;
  series: ChartSeries[];
  showEndLabels?: boolean;
  timeGranularity?: TimeGranularity;
  valueLabel: string;
};

type TooltipValue = {
  color: string;
  details?: MetricRowDetail[];
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
  ariaLabel,
  series,
  valueLabel,
  height = 320,
  interactiveLegend = true,
  scaleType = "linear",
  showEndLabels = false,
  timeGranularity = "day",
}: TimeSeriesChartProps) {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");
  const [disabledSeries, setDisabledSeries] = useState<Set<string>>(new Set());
  const [hoveredSeriesId, setHoveredSeriesId] = useState<string | null>(null);
  const visibleSeries = useMemo(
    () =>
      interactiveLegend
        ? series.filter((item) => !disabledSeries.has(item.id))
        : series,
    [disabledSeries, interactiveLegend, series],
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
          const content = (
            <>
              <svg aria-hidden="true" className="h-2 w-4" viewBox="0 0 16 8">
                <line
                  opacity={disabled ? 0.4 : 1}
                  stroke={item.color}
                  strokeDasharray={item.dashPattern}
                  strokeLinecap="round"
                  strokeWidth={2}
                  x1={0}
                  x2={16}
                  y1={4}
                  y2={4}
                />
              </svg>
              {item.label}
            </>
          );

          if (!interactiveLegend) {
            return (
              <span
                className="inline-flex items-center gap-2 border border-nd-border-prominent px-2.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-high-em-text"
                key={item.id}
                onMouseEnter={() => setHoveredSeriesId(item.id)}
                onMouseLeave={() => setHoveredSeriesId(null)}
              >
                {content}
              </span>
            );
          }

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
              {content}
            </button>
          );
        })}
        {interactiveLegend && series.length > 1 ? (
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
                ariaLabel={ariaLabel}
                locale={locale}
                scaleType={scaleType}
                series={visibleSeries}
                seriesDashPatterns={seriesDashPatterns}
                showEndLabels={showEndLabels}
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
  ariaLabel,
  height,
  highlightedSeriesId,
  locale,
  scaleType,
  series,
  seriesDashPatterns,
  showEndLabels,
  timeGranularity,
  valueLabel,
  width,
}: {
  ariaLabel?: string;
  height: number;
  highlightedSeriesId: string | null;
  locale: string;
  scaleType: ChartScale;
  series: ChartSeries[];
  seriesDashPatterns: ReadonlyMap<string, string>;
  showEndLabels: boolean;
  timeGranularity: TimeGranularity;
  valueLabel: string;
  width: number;
}) {
  const t = useTranslations("dataDashboard");
  const {
    hideTooltip,
    showTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<TooltipData>();

  const isCompactChart = width <= compactChartMaxWidth;
  const margin = isCompactChart
    ? {
        top: 16,
        right: showEndLabels ? 92 : 12,
        bottom: 32,
        left: 52,
      }
    : {
        ...baseMargin,
        right: showEndLabels ? 140 : baseMargin.right,
      };
  const innerWidth = Math.max(width - margin.left - margin.right, 0);
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0);
  const points = series.flatMap((item) => item.points);
  const definedPoints = points.filter((point) => point.defined !== false);
  const dateValues = Array.from(
    new Set(points.map((point) => point.date.getTime())),
  ).sort((a, b) => a - b);
  const xDomain = getDateDomain(points);
  const yDomain =
    scaleType === "log"
      ? getLogValueDomain(definedPoints)
      : getValueDomain(definedPoints, valueLabel);
  const xScale = scaleTime<number>({
    domain: xDomain,
    range: [0, innerWidth],
  });
  const yScale =
    scaleType === "log"
      ? scaleLog<number>({
          domain: yDomain,
          range: [innerHeight, 0],
        })
      : scaleLinear<number>({
          domain: yDomain,
          nice: true,
          range: [innerHeight, 0],
        });
  const yTickValues =
    scaleType === "log"
      ? getLogTickValues(yDomain)
      : getYAxisTickValues(
          yScale.ticks(yAxisTickCount),
          yScale.domain(),
          valueLabel,
        );
  const formatYAxisValue = getAxisValueFormatter(valueLabel, locale);
  const endLabels = showEndLabels
    ? getEndLabelPositions(series, yScale, innerHeight)
    : [];

  if (width < 10 || height < 10 || innerWidth <= 0 || innerHeight <= 0) {
    return null;
  }

  return (
    <>
      <svg
        aria-label={ariaLabel}
        height={height}
        role={ariaLabel ? "img" : undefined}
        width={width}
      >
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
              formatDateTick(value as Date, locale, timeGranularity, xDomain)
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
            <g key={item.id}>
              <LinePath
                data={item.points}
                defined={(point) =>
                  point.defined !== false &&
                  Number.isFinite(point.value) &&
                  (scaleType !== "log" || point.value > 0)
                }
                stroke={item.color}
                strokeDasharray={
                  item.dashPattern ?? seriesDashPatterns.get(item.id)
                }
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
              {item.points.map((point, index) =>
                isIsolatedSeriesPoint(item.points, index, scaleType) ? (
                  <circle
                    cx={xScale(point.date)}
                    cy={yScale(getPlottedValue(point.value, valueLabel))}
                    fill={item.color}
                    key={point.date.getTime()}
                    r={2.5}
                  />
                ) : null,
              )}
            </g>
          ))}

          {endLabels.map((item) => (
            <g aria-hidden="true" key={item.id}>
              <line
                stroke={item.color}
                strokeDasharray={item.dashPattern}
                strokeOpacity={0.7}
                x1={xScale(item.point.date)}
                x2={innerWidth + 5}
                y1={yScale(getPlottedValue(item.point.value, valueLabel))}
                y2={item.y}
              />
              <text
                dominantBaseline="middle"
                fill={item.color}
                fontSize={10}
                fontWeight={700}
                x={innerWidth + 8}
                y={item.y}
              >
                <title>{item.label}</title>
                {truncateEndLabel(item.label, isCompactChart ? 10 : 18)}
              </text>
            </g>
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

            if (!point || point.defined === false) {
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
            onPointerLeave={hideTooltip}
            onPointerMove={(event) => {
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
                .map((item): TooltipValue | null => {
                  const seriesPoint = item.points.find(
                    (seriesPoint) => seriesPoint.date.getTime() === nearestTime,
                  );
                  const value = seriesPoint?.value;

                  if (
                    typeof value !== "number" ||
                    seriesPoint?.defined === false
                  ) {
                    return null;
                  }

                  return {
                    color: item.color,
                    details: seriesPoint?.details,
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
            style={{ touchAction: "pan-y" }}
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
              <div className="grid gap-1" key={item.label}>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
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
                {item.details?.length ? (
                  <div className="ml-3.5 grid gap-1 border-l border-nd-border-light pl-2.5">
                    {item.details.map((detail) => (
                      <div className="grid gap-0.5" key={detail.id}>
                        <div className="grid grid-cols-[1fr_auto] gap-3">
                          <span className="font-medium text-nd-high-em-text">
                            {getMetricDetailLabel(t, detail)}
                          </span>
                          <span className="font-medium tabular-nums text-nd-high-em-text">
                            {formatValue(detail.value, valueLabel, locale)}
                          </span>
                        </div>
                        <span className="max-w-[300px] text-[11px] leading-[1.35] text-nd-mid-em-text">
                          {getMetricDetailDescription(t, detail)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
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

function getEndLabelPositions(
  series: ChartSeries[],
  yScale: (_value: number) => number,
  innerHeight: number,
) {
  const minimumGap = 14;
  const labels = series
    .flatMap((item) => {
      const point = item.points.findLast(
        (candidate) =>
          candidate.defined !== false && Number.isFinite(candidate.value),
      );
      const targetY = point ? yScale(point.value) : Number.NaN;

      return point && Number.isFinite(targetY)
        ? [
            {
              color: item.color,
              dashPattern: item.dashPattern,
              id: item.id,
              label: item.label,
              point,
              targetY,
              y: targetY,
            },
          ]
        : [];
    })
    .sort((a, b) => a.targetY - b.targetY);

  labels.forEach((label, index) => {
    const previousLabel = labels[index - 1];

    if (previousLabel) {
      label.y = Math.max(label.targetY, previousLabel.y + minimumGap);
    }
  });

  const lastLabel = labels.at(-1);
  const overflow = lastLabel ? Math.max(lastLabel.y - innerHeight, 0) : 0;

  if (overflow > 0) {
    labels.forEach((label) => {
      label.y -= overflow;
    });
  }

  const firstLabel = labels[0];
  const underflow = firstLabel ? Math.min(firstLabel.y, 0) : 0;

  if (underflow < 0) {
    labels.forEach((label) => {
      label.y -= underflow;
    });
  }

  return labels;
}

function truncateEndLabel(value: string, maximumLength: number) {
  return value.length > maximumLength
    ? `${value.slice(0, Math.max(maximumLength - 1, 1))}…`
    : value;
}

function getMetricDetailLabel(
  t: ReturnType<typeof useTranslations>,
  detail: MetricRowDetail,
) {
  const key = `rpcErrors.${detail.id}.label`;

  return t.has(key) ? t(key) : detail.label;
}

function getMetricDetailDescription(
  t: ReturnType<typeof useTranslations>,
  detail: MetricRowDetail,
) {
  const key = `rpcErrors.${detail.id}.description`;

  return t.has(key) ? t(key) : detail.description;
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

function isIsolatedSeriesPoint(
  points: SeriesPoint[],
  index: number,
  scaleType: ChartScale,
) {
  const point = points[index];

  if (
    !point ||
    point.defined === false ||
    !Number.isFinite(point.value) ||
    (scaleType === "log" && point.value <= 0)
  ) {
    return false;
  }

  const previousPoint = points[index - 1];
  const nextPoint = points[index + 1];
  const previousIsDefined =
    previousPoint?.defined !== false &&
    typeof previousPoint?.value === "number" &&
    Number.isFinite(previousPoint.value) &&
    (scaleType !== "log" || previousPoint.value > 0);
  const nextIsDefined =
    nextPoint?.defined !== false &&
    typeof nextPoint?.value === "number" &&
    Number.isFinite(nextPoint.value) &&
    (scaleType !== "log" || nextPoint.value > 0);

  return !previousIsDefined && !nextIsDefined;
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

export function getLogValueDomain(points: SeriesPoint[]): [number, number] {
  const values = points
    .map((point) => point.value)
    .filter((value) => Number.isFinite(value) && value > 0);

  if (values.length === 0) {
    return [1, 10];
  }

  const minPower = Math.floor(Math.log10(Math.min(...values)));
  let maxPower = Math.ceil(Math.log10(Math.max(...values)));

  if (maxPower <= minPower) {
    maxPower = minPower + 1;
  }

  return [10 ** minPower, 10 ** maxPower];
}

export function getLogTickValues([minValue, maxValue]: readonly number[]) {
  const minPower = Math.ceil(Math.log10(minValue));
  const maxPower = Math.floor(Math.log10(maxValue));

  return Array.from(
    { length: Math.max(maxPower - minPower + 1, 0) },
    (_, index) => 10 ** (minPower + index),
  );
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
  domain: [Date, Date],
) {
  if (timeGranularity === "hour") {
    const rangeMilliseconds = domain[1].getTime() - domain[0].getTime();

    if (rangeMilliseconds <= 12 * 60 * 60 * 1000) {
      return new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
      }).format(value);
    }

    if (rangeMilliseconds <= 2 * 24 * 60 * 60 * 1000) {
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        hour: "numeric",
        month: "short",
      }).format(value);
    }

    if (rangeMilliseconds > 180 * 24 * 60 * 60 * 1000) {
      return new Intl.DateTimeFormat(locale, {
        month: "short",
        year: "2-digit",
      }).format(value);
    }

    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
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
