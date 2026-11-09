"use client";

import { ArrowDown } from "@boxicons/react/ArrowDown";
import { ArrowUp } from "@boxicons/react/ArrowUp";
import { Check } from "@boxicons/react/Check";
import { Plus } from "@boxicons/react/Plus";
import { InfoCircle } from "@boxicons/react/InfoCircle";
import { LoaderLines as Loader2 } from "@boxicons/react/LoaderLines";
import { useMemo, useState, type ReactElement } from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { cn } from "@/app/components/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
} from "@/app/components/ui/tooltip";
import {
  getRpcTimeframeOption,
  type MetricRow,
  type RpcTimeframe,
} from "./data-config";
import { FilterSelect } from "./dashboard-controls";
import { getProviderColor, toggleProvider } from "./dashboard-providers";
import {
  grpcChartMetrics,
  getGrpcRegionLabel,
  getGrpcRegions,
  grpcStreamOptions,
  grpcCommitmentOptions,
  type GrpcFiltersResponse,
  type GrpcStream,
  type GrpcCommitment,
  type GrpcChartMetric,
} from "./grpc-config";
import {
  getGrpcProviderItems,
  getGrpcTrendSeries,
  sortGrpcProviderItems,
  defaultGrpcSortKey,
  grpcTableMetrics,
  type GrpcSortKey,
  type GrpcSortState,
  type GrpcProviderItem,
  type GrpcTableMetric,
  formatGrpcDowntime,
} from "./grpc-provider-metrics";
import { ProviderSparkline } from "./provider-sparkline";
import { GrpcUptimeTimeline } from "./grpc-uptime-timeline";
import { TimeSeriesChart, formatValue } from "./time-series-chart";

export function GrpcProviderExperience({
  rows,
  filters,
  region,
  cloudProvider,
  stream,
  commitment,
  timeframe,
  generatedAt,
  selectedProviders,
  isLoading,
  isRefreshing,
  onRegionChange,
  onCloudProviderChange,
  onStreamChange,
  onCommitmentChange,
  onProvidersChange,
}: {
  rows: MetricRow[];
  filters?: GrpcFiltersResponse;
  region: string;
  cloudProvider: string;
  stream: GrpcStream;
  commitment: GrpcCommitment;
  timeframe: RpcTimeframe;
  generatedAt?: string;
  selectedProviders: Set<string>;
  isLoading: boolean;
  isRefreshing: boolean;
  onRegionChange: (_region: string) => void;
  onCloudProviderChange: (_cloudProvider: string) => void;
  onStreamChange: (_stream: GrpcStream) => void;
  onCommitmentChange: (_commitment: GrpcCommitment) => void;
  onProvidersChange: (_providers: Set<string>) => void;
}) {
  const t = useTranslations("dataDashboard");
  const locale = useLocale();
  const [percentile, setPercentile] = useState<GrpcChartMetric>("P50");
  const [sortKey, setSortKey] = useState<GrpcSortState>(defaultGrpcSortKey);
  const [direction, setDirection] = useState<"ascending" | "descending">(
    "ascending",
  );
  const regions = filters
    ? getGrpcRegions(filters, cloudProvider)
    : region === "all"
      ? []
      : [region];
  const cloudProviders =
    filters?.cloudProviders ?? (cloudProvider === "all" ? [] : [cloudProvider]);
  const stepSeconds = getRpcTimeframeOption(timeframe).stepSeconds;
  const items = useMemo(
    () =>
      sortGrpcProviderItems(
        getGrpcProviderItems(rows, stepSeconds),
        sortKey,
        direction,
      ),
    [rows, stepSeconds, sortKey, direction],
  );
  const chartSeries = useMemo(
    () =>
      percentile === "Uptime"
        ? []
        : getGrpcTrendSeries(rows, percentile, selectedProviders, stepSeconds),
    [rows, percentile, selectedProviders, stepSeconds],
  );
  const selectedCount = items.filter((item) =>
    selectedProviders.has(item.provider),
  ).length;
  const allSelected = items.length > 0 && selectedCount === items.length;

  function updateSort(key: GrpcSortKey) {
    if (key === sortKey)
      setDirection((current) =>
        current === "ascending" ? "descending" : "ascending",
      );
    else {
      setSortKey(key);
      setDirection("ascending");
    }
  }

  function compareButton(item: GrpcProviderItem) {
    const selected = selectedProviders.has(item.provider);
    return (
      <button
        aria-label={t(
          selected
            ? "senderExperience.removeComparison"
            : "senderExperience.addComparison",
          { provider: item.provider },
        )}
        aria-pressed={selected}
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nd-primary",
          selected
            ? "border-current"
            : "border-nd-border-prominent text-nd-mid-em-text hover:text-nd-high-em-text",
        )}
        style={
          selected ? { color: getProviderColor(item.provider) } : undefined
        }
        onClick={() =>
          onProvidersChange(toggleProvider(selectedProviders, item.provider))
        }
        type="button"
      >
        {selected ? (
          <Check aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Plus aria-hidden="true" className="h-4 w-4" />
        )}
      </button>
    );
  }

  function metricValue(value: number | null, metric: GrpcTableMetric) {
    if (value === null) return "—";
    if (metric === "Downtime" || metric === "Miss Rate") {
      const formatted =
        metric === "Downtime"
          ? formatGrpcDowntime(value, locale)
          : formatValue(value, "Rate", locale);
      return value > 0 ? (
        <span className="text-rose-400">{formatted}</span>
      ) : (
        <span className="text-emerald-400">{formatted}</span>
      );
    }
    return metric === "Reconnects"
      ? new Intl.NumberFormat(locale).format(value)
      : `${formatValue(value, "Milliseconds", locale)} ms`;
  }

  function metricLabel(metric: GrpcTableMetric) {
    return metric === "Downtime"
      ? t("grpcExperience.downtime")
      : metric === "Reconnects"
        ? t("grpcExperience.reconnects")
        : metric === "Miss Rate"
          ? t("grpcExperience.missRate")
          : metric === "Avg"
            ? t("grpcExperience.avgLag")
            : metric;
  }

  function metricDescription(metric: GrpcSortKey | "trend") {
    return metric === "provider"
      ? undefined
      : t(`grpcExperience.columns.${grpcColumnMessageKeys[metric]}`);
  }

  function columnTooltip(metric: GrpcSortKey | "trend", trigger: ReactElement) {
    const description = metricDescription(metric);
    if (!description) return trigger;
    return (
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            side="top"
            collisionPadding={16}
            className="max-w-[min(320px,calc(100vw-32px))] rounded-none border-nd-border-prominent bg-[#1D1D20] px-3 py-2 text-left font-brand-mono text-[11px] font-normal normal-case leading-relaxed text-nd-mid-em-text"
          >
            {description}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="mt-6">
        <section
          aria-label={t("grpcExperience.overviewAriaLabel")}
          className="border border-nd-border-light"
        >
          <div className="border-b border-nd-border-light px-4 py-4 md:px-6 xl:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="m-0 text-[20px] font-medium leading-[1.25] tracking-normal xl:text-[24px]">
                {t("grpcExperience.title")}
              </h2>
              <span
                aria-live="polite"
                className="inline-flex items-center gap-2 font-brand-mono text-[11px] font-bold uppercase text-nd-mid-em-text"
              >
                {isRefreshing ? (
                  <Loader2
                    aria-hidden="true"
                    className="h-3.5 w-3.5 animate-spin"
                  />
                ) : null}
                {t("grpcExperience.selectedCount", {
                  selected: selectedCount,
                  total: items.length,
                })}
              </span>
            </div>
            <p className="m-0 mt-2 max-w-[720px] text-[14px] leading-[1.5] text-nd-mid-em-text">
              {t("grpcExperience.rankingNote")}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-nd-border-light px-4 py-4 md:px-6 xl:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <FilterSelect
                ariaLabel={t("controls.grpcCloudProviderAriaLabel")}
                label={t("controls.grpcCloudProviderLabel")}
                options={[
                  { label: t("controls.grpcAllCloudProviders"), value: "all" },
                  ...cloudProviders.map((value) => ({
                    label: value,
                    value,
                  })),
                ]}
                value={cloudProvider}
                onChange={onCloudProviderChange}
              />
              <FilterSelect
                ariaLabel={t("controls.grpcRegionAriaLabel")}
                label={t("controls.rpcRegionLabel")}
                options={[
                  { label: t("controls.grpcAllRegions"), value: "all" },
                  ...regions.map((value) => ({
                    label: getGrpcRegionLabel(value),
                    value,
                  })),
                ]}
                value={region}
                onChange={onRegionChange}
              />
              <FilterSelect
                ariaLabel={t("controls.grpcStreamAriaLabel")}
                label={t("controls.grpcStreamLabel")}
                options={grpcStreamOptions.filter(
                  (option) =>
                    option.value === "all" ||
                    !filters ||
                    filters.streams.includes(option.value),
                )}
                value={stream}
                onChange={onStreamChange}
              />
              {stream === "slot" ? (
                <span className="font-brand-mono text-[11px] text-nd-mid-em-text">
                  {t("controls.grpcAllSlotStatuses")}
                </span>
              ) : (
                <FilterSelect
                  ariaLabel={t("controls.grpcCommitmentAriaLabel")}
                  label={t("controls.grpcCommitmentLabel")}
                  options={grpcCommitmentOptions.filter(
                    (option) =>
                      !filters || filters.commitments.includes(option.value),
                  )}
                  value={commitment}
                  onChange={onCommitmentChange}
                />
              )}
              <span className="font-brand-mono text-[11px] uppercase text-nd-mid-em-text">
                {t("grpcExperience.tableScope", { timeframe })}
              </span>
            </div>
            <button
              className="border border-nd-border-prominent px-2.5 py-1 font-brand-mono text-[11px] font-bold uppercase text-nd-mid-em-text hover:text-nd-high-em-text"
              onClick={() =>
                onProvidersChange(
                  allSelected
                    ? new Set()
                    : new Set(items.map((item) => item.provider)),
                )
              }
              type="button"
            >
              {t(allSelected ? "legend.deselectAll" : "legend.selectAll")}
            </button>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1280px] table-fixed border-collapse">
              <caption className="sr-only">
                {t("grpcExperience.tableCaption")}
              </caption>
              <colgroup>
                <col className="w-[220px]" />
                <col className="w-[140px]" />
                {grpcTableMetrics.map((metric) => (
                  <col key={metric} />
                ))}
              </colgroup>
              <thead>
                <tr className="font-brand-mono text-[11px] font-bold uppercase text-nd-mid-em-text">
                  {(["provider", "trend", ...grpcTableMetrics] as const).map(
                    (key) =>
                      key === "trend" ? (
                        <th
                          className="px-4 py-3 text-left"
                          key={key}
                          scope="col"
                        >
                          {columnTooltip(
                            "trend",
                            <span
                              className="cursor-help underline decoration-dotted underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nd-primary"
                              tabIndex={0}
                            >
                              {t("grpcExperience.trend")}
                            </span>,
                          )}
                        </th>
                      ) : (
                        <th
                          aria-sort={sortKey === key ? direction : undefined}
                          className="border-r border-nd-border-light"
                          key={key}
                          scope="col"
                        >
                          {columnTooltip(
                            key,
                            <button
                              className={cn(
                                "flex w-full items-center gap-1.5 px-4 py-3 hover:bg-white/[0.04] hover:text-nd-high-em-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-nd-primary",
                                key === "provider"
                                  ? "justify-start xl:px-6"
                                  : "justify-end",
                              )}
                              onClick={() => updateSort(key)}
                              type="button"
                            >
                              {key === "provider"
                                ? t("senderEconomics.provider")
                                : metricLabel(key)}
                              {sortKey === key ? (
                                direction === "ascending" ? (
                                  <ArrowUp
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5"
                                  />
                                ) : (
                                  <ArrowDown
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5"
                                  />
                                )
                              ) : (
                                <span aria-hidden="true" className="w-3.5" />
                              )}
                            </button>,
                          )}
                        </th>
                      ),
                  )}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? [0, 1, 2].map((index) => (
                      <tr
                        className="border-t border-nd-border-light"
                        key={index}
                      >
                        <td
                          className="px-4 py-5"
                          colSpan={grpcTableMetrics.length + 2}
                        >
                          <div className="h-5 animate-pulse bg-nd-border-light/30" />
                        </td>
                      </tr>
                    ))
                  : items.map((item, index) => (
                      <tr
                        className={cn(
                          "border-t border-nd-border-light font-brand-mono text-[12px] font-bold text-nd-high-em-text",
                          selectedProviders.has(item.provider) &&
                            "bg-white/[0.035]",
                        )}
                        key={item.provider}
                      >
                        <th
                          className="border-r border-nd-border-light px-4 py-3 text-left xl:px-6"
                          scope="row"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 text-[10px] text-nd-mid-em-text/60">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {compareButton(item)}
                            <span className="uppercase">{item.provider}</span>
                          </div>
                        </th>
                        <td className="px-4 py-3">
                          <ProviderSparkline
                            color={getProviderColor(item.provider)}
                            points={item.trend}
                            minimumRange={0}
                          />
                        </td>
                        {grpcTableMetrics.map((metric) => (
                          <td
                            className="px-4 py-3 text-right tabular-nums"
                            key={metric}
                          >
                            {metricValue(item.values[metric], metric)}
                          </td>
                        ))}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-nd-border-light md:hidden">
            {isLoading ? (
              <div className="m-4 h-32 animate-pulse bg-nd-border-light/30" />
            ) : (
              items.map((item) => (
                <article className="p-4" key={item.provider}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {compareButton(item)}
                      <span className="truncate font-brand-mono text-[12px] font-bold uppercase">
                        {item.provider}
                      </span>
                    </div>
                    <ProviderSparkline
                      color={getProviderColor(item.provider)}
                      points={item.trend}
                      minimumRange={0}
                    />
                  </div>
                  <dl className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4">
                    {grpcTableMetrics.map((metric) => (
                      <div key={metric}>
                        <dt
                          className="font-brand-mono text-[10px] font-bold uppercase text-nd-mid-em-text"
                          title={metricDescription(metric)}
                        >
                          {metricLabel(metric)}
                        </dt>
                        <dd className="mt-1 font-brand-mono text-[12px] font-bold tabular-nums">
                          {metricValue(item.values[metric], metric)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))
            )}
          </div>
          {!isLoading && items.length === 0 ? (
            <p className="px-6 py-12 text-center font-brand-mono text-[12px] uppercase text-nd-mid-em-text">
              {t("empty.noDataForSelection")}
            </p>
          ) : null}
        </section>

        <section
          aria-labelledby="grpc-comparison-title"
          className="min-w-0 border-x border-b border-nd-border-light p-4 md:p-6 xl:p-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="grpc-comparison-title"
                  className="m-0 text-[20px] font-medium leading-[1.25] tracking-normal xl:text-[24px]"
                >
                  {percentile === "Uptime"
                    ? t("grpcExperience.uptimeChartTitle")
                    : percentile === "Miss Rate"
                      ? t("grpcExperience.missRateChartTitle")
                      : t("grpcExperience.chartTitle", { percentile })}
                </h2>
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={t("grpcExperience.chartDetails")}
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-nd-mid-em-text/70 hover:text-nd-high-em-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nd-primary"
                    >
                      <InfoCircle aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent
                      side="top"
                      align="start"
                      collisionPadding={16}
                      className="max-w-[min(360px,calc(100vw-32px))] rounded-none border-nd-border-prominent bg-[#1D1D20] px-3 py-2 font-brand-mono text-[11px] leading-relaxed text-nd-mid-em-text"
                    >
                      {t(
                        percentile === "Uptime"
                          ? "grpcExperience.uptimeChartDescription"
                          : percentile === "Miss Rate"
                            ? "grpcExperience.missRateChartDescription"
                            : "grpcExperience.chartDescription",
                      )}
                      {percentile === "Uptime" ? (
                        <span className="mt-2 block border-t border-nd-border-light pt-2">
                          {t("grpcExperience.uptimeInspect")}
                        </span>
                      ) : null}
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </div>
            </div>
            <div
              role="group"
              aria-label={t("grpcExperience.percentileLabel")}
              className="flex flex-wrap items-center gap-1"
            >
              {grpcChartMetrics.map((option) => (
                <button
                  aria-pressed={percentile === option}
                  className={cn(
                    "border px-2.5 py-1 font-brand-mono text-[11px] font-bold uppercase transition-colors",
                    percentile === option
                      ? "border-nd-primary bg-white/[0.05] text-nd-high-em-text"
                      : "border-nd-border-prominent text-nd-mid-em-text hover:text-nd-high-em-text",
                  )}
                  key={option}
                  onClick={() => setPercentile(option)}
                  type="button"
                >
                  {option === "Uptime"
                    ? t("grpcExperience.uptime")
                    : option === "Miss Rate"
                      ? t("grpcExperience.missRate")
                      : option}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 min-w-0" aria-busy={isLoading}>
            {isLoading ? (
              <div className="h-[360px] animate-pulse bg-nd-border-light/20" />
            ) : percentile === "Uptime" && selectedProviders.size > 0 ? (
              <GrpcUptimeTimeline
                key={`${region}-${cloudProvider}-${stream}-${commitment}-${timeframe}-${generatedAt}-${[...selectedProviders].sort().join(",")}`}
                rows={rows}
                selectedProviders={selectedProviders}
                timeframe={timeframe}
                generatedAt={generatedAt}
              />
            ) : chartSeries.length ? (
              <TimeSeriesChart
                key={`${region}-${percentile}`}
                ariaLabel={
                  percentile === "Miss Rate"
                    ? t("grpcExperience.missRateChartTitle")
                    : t("grpcExperience.chartAriaLabel", {
                        percentile,
                        region:
                          region === "all"
                            ? t("controls.grpcAllRegions")
                            : getGrpcRegionLabel(region),
                      })
                }
                height={360}
                interactiveLegend={false}
                series={chartSeries}
                timeGranularity="hour"
                valueLabel={
                  percentile === "Miss Rate" ? "Rate" : "Milliseconds"
                }
              />
            ) : (
              <div className="flex h-[360px] items-center justify-center border border-dashed border-nd-border-light px-4 text-center font-brand-mono text-[12px] uppercase text-nd-mid-em-text">
                {t(
                  selectedCount
                    ? "empty.noDataForSelection"
                    : "grpcExperience.emptyComparison",
                )}
              </div>
            )}
          </div>
        </section>

        <section
          aria-labelledby="grpc-methodology-title"
          className="border-x border-b border-nd-border-light p-4 md:p-6 xl:p-8"
        >
          <h2
            id="grpc-methodology-title"
            className="m-0 text-[20px] font-medium leading-[1.25] tracking-normal xl:text-[24px]"
          >
            {t("grpcExperience.methodology.title")}
          </h2>
          <p className="m-0 mt-3 max-w-[720px] text-[14px] leading-[1.5] text-nd-mid-em-text">
            {t("grpcExperience.methodology.purpose")}
          </p>
          <dl className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            {grpcMethodologyItems.map((item) => (
              <div key={item}>
                <dt className="font-brand-mono text-[11px] font-bold uppercase text-nd-high-em-text">
                  {t(`grpcExperience.methodology.${item}.title`)}
                </dt>
                <dd className="m-0 mt-1.5 text-[14px] leading-[1.5] text-nd-mid-em-text">
                  {t(`grpcExperience.methodology.${item}.body`)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="m-0 mt-5 max-w-[720px] text-[13px] leading-[1.5] text-nd-mid-em-text/80">
            {t("grpcExperience.methodology.limits")}
          </p>
        </section>
      </div>
    </TooltipProvider>
  );
}

const grpcColumnMessageKeys = {
  trend: "trend",
  "Miss Rate": "missRate",
  Avg: "avg",
  P50: "p50",
  P95: "p95",
  P99: "p99",
  Downtime: "downtime",
  Reconnects: "reconnects",
} as const satisfies Record<GrpcTableMetric | "trend", string>;

const grpcMethodologyItems = [
  "setup",
  "lag",
  "missRate",
  "ranking",
  "availability",
  "freshness",
] as const;
