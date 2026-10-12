"use client";

import { motion } from "motion/react";
import { InfoCircle as Info } from "@boxicons/react/InfoCircle";
import { LoaderLines as Loader2 } from "@boxicons/react/LoaderLines";
import { type ReactNode, useMemo } from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { cn } from "@/app/components/utils";
import {
  getRpcTimeframeOption,
  type ChartDefinition,
  type DashboardTab,
  type MetricRow,
  type ProviderName,
  type RpcTimeframe,
} from "./data-config";
import {
  chartHeight,
  kpiCount,
  tabIndicatorSpring,
} from "./dashboard-constants";
import {
  formatPercent,
  getChartCaption,
  getChartTitle,
  getTabContent,
  getValueLabel,
} from "./dashboard-copy";
import {
  buildSeries,
  getKpiCellClassName,
  getKpiSummary,
} from "./dashboard-metrics";
import type { KpiAggregation, KpiItem } from "./dashboard-types";
import {
  formatValue,
  TimeSeriesChart,
  type ChartSeries,
} from "./time-series-chart";

export function KpiGrid({
  aggregation,
  isLoading,
  kpis,
}: {
  aggregation: KpiAggregation;
  isLoading: boolean;
  kpis: KpiItem[];
}) {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");

  return (
    <TooltipProvider delayDuration={100}>
      <section
        aria-label={t("kpisAriaLabel")}
        className={cn(
          "mt-10 xl:mt-14 border-y border-nd-border-light relative",
          "before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-gradient-to-b before:from-[#D884F0] before:to-[#44EBA6]",
          "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-nd-border-light",
          "[&>*]:border-nd-border-light",
        )}
      >
        {isLoading
          ? Array.from({ length: kpiCount }).map((_, index) => (
              <KpiSkeleton index={index} key={index} />
            ))
          : kpis.map((kpi, index) => (
              <KpiCell
                delta={kpi.delta}
                index={index}
                key={kpi.chart.id}
                label={getChartTitle(t, kpi.chart)}
                lowerIsBetter={kpi.chart.lowerIsBetter}
                summary={getKpiSummary(t, kpi.chart, aggregation)}
                unit={getValueLabel(t, kpi.chart.valueLabel)}
                value={formatValue(kpi.value, kpi.chart.valueLabel, locale)}
              />
            ))}
      </section>
    </TooltipProvider>
  );
}

export function ChartGrid({
  activeCharts,
  activeTab,
  isLoading,
  isRefreshing,
  isConnectedToPrevious,
  rows,
  rpcTimeframe,
  selectedProviders,
  visibleCharts,
}: {
  activeCharts: readonly ChartDefinition[];
  activeTab: DashboardTab;
  isConnectedToPrevious: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  rows: MetricRow[];
  rpcTimeframe: RpcTimeframe;
  selectedProviders: Set<ProviderName>;
  visibleCharts: readonly ChartDefinition[];
}) {
  const t = useTranslations("dataDashboard");
  const hasLeadingFullWidthChart = activeCharts[0]?.fullWidth === true;

  return (
    <TooltipProvider delayDuration={100}>
      <section
        aria-label={t("chartsAriaLabel", {
          tab: getTabContent(t, activeTab).label,
        })}
        className={cn(
          "border-x border-b border-nd-border-light grid grid-cols-1 lg:grid-cols-2",
          isConnectedToPrevious ? "" : "mt-10 border-t xl:mt-14",
        )}
      >
        {isLoading
          ? activeCharts.map((chart, index) => (
              <ChartSkeleton
                className={getChartGridItemClassName(
                  chart,
                  index,
                  hasLeadingFullWidthChart,
                )}
                index={index}
                key={chart.id}
                title={getChartTitle(t, chart)}
              />
            ))
          : visibleCharts.map((chart, index) => (
              <ChartCard
                chart={chart}
                className={getChartGridItemClassName(
                  chart,
                  index,
                  hasLeadingFullWidthChart,
                )}
                index={index}
                isRefreshing={isRefreshing}
                key={chart.id}
                rows={rows}
                rpcTimeframe={rpcTimeframe}
                selectedProviders={selectedProviders}
              />
            ))}
      </section>
    </TooltipProvider>
  );
}

function ChartCard({
  chart,
  className,
  index,
  isRefreshing,
  rows,
  rpcTimeframe,
  selectedProviders,
}: {
  chart: ChartDefinition;
  className?: string;
  index: number;
  isRefreshing: boolean;
  rows: MetricRow[];
  rpcTimeframe: RpcTimeframe;
  selectedProviders: Set<ProviderName>;
}) {
  const t = useTranslations("dataDashboard");
  const series = useMemo(
    () => buildSeries(chart, rows, selectedProviders),
    [chart, rows, selectedProviders],
  );
  const valueLabel = getValueLabel(t, chart.valueLabel);
  const title = getChartTitle(t, chart);
  const caption = getChartCaption(t, chart, {
    timeframe: getRpcTimeframeOption(rpcTimeframe).label,
  });
  const resolvedChartHeight =
    chart.visualization === "bar"
      ? Math.max(chartHeight, series.length * 56)
      : chartHeight;

  return (
    <article
      className={cn(
        "relative p-3 md:p-6 xl:p-8 flex flex-col gap-4 md:gap-5",
        className,
      )}
    >
      <div className="grid gap-1.5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="m-0 min-w-0 text-[20px] xl:text-[24px] leading-[1.25] font-medium tracking-normal">
            {title}
          </h2>
          <span className="font-brand-mono text-[12px] leading-[1.42] font-bold uppercase text-nd-mid-em-text shrink-0">
            {valueLabel}
          </span>
        </div>
        {caption ? (
          <p className="m-0 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text/70">
            {caption}
          </p>
        ) : null}
      </div>

      <ChartWatermarkFrame height={resolvedChartHeight}>
        {series.length > 0 ? (
          chart.visualization === "bar" ? (
            <ProviderBarChart
              height={resolvedChartHeight}
              lowerIsBetter={chart.lowerIsBetter}
              series={series}
              valueLabel={chart.valueLabel}
            />
          ) : (
            <TimeSeriesChart
              height={resolvedChartHeight}
              scaleType={chart.scale}
              series={series}
              timeGranularity={chart.timeGranularity}
              valueLabel={chart.valueLabel}
            />
          )
        ) : (
          <div className="flex h-[320px] items-center justify-center border border-dashed border-nd-border-light text-sm text-nd-mid-em-text font-brand-mono uppercase tracking-normal">
            {t("empty.noDataForSelection")}
          </div>
        )}
      </ChartWatermarkFrame>

      {chart.visualization === "bar" ? null : <ChartOrdinal index={index} />}
      {isRefreshing ? <ChartRefreshingOverlay /> : null}
    </article>
  );
}

function ChartWatermarkFrame({
  children,
  height,
}: {
  children: ReactNode;
  height: number;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex items-center justify-center overflow-hidden"
        style={{ height }}
      >
        <img
          alt=""
          className="h-auto w-[45%] min-w-[220px] max-w-[300px] opacity-[0.1] mix-blend-screen brightness-0 invert"
          height={96}
          src="/src/img/branding/solanaLogo.svg"
          width={646}
        />
      </div>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

function ProviderBarChart({
  height,
  lowerIsBetter = false,
  series,
  valueLabel,
}: {
  height: number;
  lowerIsBetter?: boolean;
  series: ChartSeries[];
  valueLabel: string;
}) {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");
  const items = useMemo(
    () => getLatestSeriesValues(series, lowerIsBetter),
    [lowerIsBetter, series],
  );
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  if (items.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center border border-dashed border-nd-border-light text-sm text-nd-mid-em-text font-brand-mono uppercase tracking-normal">
        {t("empty.noDataForSelection")}
      </div>
    );
  }

  return (
    <div
      aria-label={t("barChart.ariaLabel")}
      className="flex min-w-0 flex-col justify-center gap-4"
      role="list"
      style={{ height }}
    >
      {items.map((item, index) => (
        <motion.div
          className="grid min-w-0 gap-2"
          key={item.id}
          layout
          role="listitem"
          transition={tabIndicatorSpring}
        >
          <div className="flex min-w-0 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="w-6 shrink-0 font-brand-mono text-[10px] leading-none font-bold uppercase text-nd-mid-em-text/60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate font-brand-mono text-[12px] leading-[1.42] font-bold uppercase text-nd-high-em-text">
                {item.label}
              </span>
            </div>
            <span className="shrink-0 font-brand-mono text-[12px] leading-[1.42] font-bold tabular-nums text-nd-high-em-text">
              {formatValue(item.value, valueLabel, locale)}
            </span>
          </div>
          <div className="h-3 overflow-hidden bg-nd-border-light/30">
            <div
              className="h-full transition-[width] duration-500 ease-out"
              style={{
                backgroundColor: item.color,
                width: `${getBarWidth(item.value, maxValue)}%`,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function getLatestSeriesValues(series: ChartSeries[], lowerIsBetter: boolean) {
  return series
    .flatMap((item) => {
      const latestPoint = item.points.at(-1);

      return latestPoint
        ? [
            {
              color: item.color,
              id: item.id,
              label: item.label,
              value: latestPoint.value,
            },
          ]
        : [];
    })
    .sort((a, b) =>
      lowerIsBetter
        ? a.value - b.value || a.label.localeCompare(b.label)
        : b.value - a.value || a.label.localeCompare(b.label),
    );
}

function getBarWidth(value: number, maxValue: number) {
  if (maxValue <= 0) {
    return 0;
  }

  return Math.min(Math.max((value / maxValue) * 100, 2), 100);
}

function ChartRefreshingOverlay() {
  const t = useTranslations("dataDashboard");

  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/10"
      role="status"
    >
      <Loader2
        aria-hidden="true"
        className="h-8 w-8 animate-spin text-nd-high-em-text/80"
      />
      <span className="sr-only">{t("loading.refreshing")}</span>
    </div>
  );
}

function KpiCell({
  delta,
  index,
  label,
  lowerIsBetter,
  summary,
  unit,
  value,
}: {
  delta: number;
  index: number;
  label: string;
  lowerIsBetter?: boolean;
  summary: string;
  unit: string;
  value: string;
}) {
  const locale = useLocale();
  const isFavorableTrend = lowerIsBetter ? delta <= 0 : delta >= 0;

  return (
    <article className={getKpiCellClassName(index)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-1.5">
          <h2 className="font-brand-mono text-[12px] md:text-[14px] leading-[1.42] font-bold uppercase text-nd-mid-em-text">
            {label}
          </h2>
          <KpiSummaryTooltip label={label} summary={summary} />
        </div>
        <span className="hidden md:inline font-brand-mono text-[10px] leading-5 uppercase text-nd-mid-em-text/60 tracking-normal shrink-0">
          {unit}
        </span>
      </div>
      <div className="flex flex-col items-start gap-1 md:flex-row md:items-end md:justify-between md:gap-2">
        <p className="text-[28px] xl:text-[40px] leading-[1.0] font-light uppercase tabular-nums tracking-normal text-nd-high-em-text">
          {value}
        </p>
        <p
          className={cn(
            "shrink-0 whitespace-nowrap font-brand-mono text-[12px] md:text-[14px] leading-[1.42] font-bold uppercase tabular-nums",
            isFavorableTrend
              ? "text-nd-highlight-green"
              : "text-nd-highlight-orange",
          )}
        >
          {delta >= 0 ? "↑" : "↓"} {formatPercent(Math.abs(delta), locale)}
        </p>
      </div>
    </article>
  );
}

function KpiSummaryTooltip({
  label,
  summary,
}: {
  label: string;
  summary: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={summary}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-nd-mid-em-text/70 transition-colors hover:text-nd-high-em-text focus-visible:outline-none focus-visible:text-nd-high-em-text"
          type="button"
        >
          <Info aria-hidden="true" className="h-3.5 w-3.5" />
          <span className="sr-only">{summary}</span>
        </button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          className="max-w-[260px] border-nd-border-prominent bg-[#1D1D20] px-3 py-2 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-high-em-text"
          side="top"
        >
          <span className="sr-only">{label}: </span>
          {summary}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

function KpiSkeleton({ index }: { index: number }) {
  return (
    <div className={getKpiCellClassName(index)}>
      <div className="h-3 w-24 rounded-sm bg-nd-border-light animate-pulse" />
      <div className="h-8 w-32 rounded-sm bg-nd-border-light animate-pulse" />
    </div>
  );
}

function ChartSkeleton({
  className,
  index,
  title,
}: {
  className?: string;
  index: number;
  title: string;
}) {
  return (
    <article
      className={cn(
        "p-3 md:p-6 xl:p-8 flex flex-col gap-4 md:gap-5",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="h-5 w-40 rounded-sm bg-nd-border-light animate-pulse">
          <span className="sr-only">{title}</span>
        </div>
        <div className="h-3 w-12 rounded-sm bg-nd-border-light animate-pulse" />
      </div>
      <div className="h-[352px] animate-pulse bg-nd-border-light/40" />
      <ChartOrdinal index={index} />
    </article>
  );
}

function getChartGridItemClassName(
  chart: ChartDefinition,
  index: number,
  hasLeadingFullWidthChart: boolean,
) {
  const hasDesktopTopBorder = hasLeadingFullWidthChart ? index > 0 : index >= 2;
  const hasDesktopLeftBorder = hasLeadingFullWidthChart
    ? index > 0 && index % 2 === 0
    : index % 2 === 1;

  return cn(
    "border-nd-border-light",
    chart.fullWidth ? "lg:col-span-2" : "",
    index > 0 ? "border-t" : "",
    hasDesktopTopBorder ? "lg:border-t" : "lg:border-t-0",
    hasDesktopLeftBorder ? "lg:border-l" : "",
  );
}

function ChartOrdinal({ index }: { index: number }) {
  return (
    <span
      aria-hidden="true"
      className="font-brand-mono text-[10px] leading-none font-bold uppercase text-nd-mid-em-text/60 tracking-normal"
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

export function DataError({ error }: { error: Error }) {
  const t = useTranslations("dataDashboard");

  return (
    <section
      className="mt-10 border border-nd-highlight-orange/40 bg-nd-highlight-orange/10 p-6 text-sm text-nd-high-em-text"
      role="alert"
    >
      <h2 className="font-brand-mono text-[12px] leading-[1.42] font-bold uppercase text-nd-highlight-orange">
        {t("errors.title")}
      </h2>
      <p className="mt-3 nd-body-m text-nd-mid-em-text">{error.message}</p>
    </section>
  );
}
