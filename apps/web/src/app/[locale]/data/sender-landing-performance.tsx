"use client";

import { ArrowDown } from "@boxicons/react/ArrowDown";
import { ArrowUp } from "@boxicons/react/ArrowUp";
import { ArrowOutUpRightSquare as ExternalLink } from "@boxicons/react/ArrowOutUpRightSquare";
import { InfoCircle } from "@boxicons/react/InfoCircle";
import { LoaderLines as Loader2 } from "@boxicons/react/LoaderLines";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { cn } from "@/app/components/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { rpcDataSWRConfig, rpcFiltersSWRConfig } from "./dashboard-constants";
import { FilterSelect } from "./dashboard-controls";
import {
  fetchSendLandingData,
  fetchSendLandingFilters,
} from "./dashboard-fetch";
import { getProviderColor } from "./dashboard-providers";
import { ProviderSparkline } from "./provider-sparkline";
import type { RpcTimeframe } from "./data-config";
import {
  getSendLandingDataUrl,
  getSendLandingRegionLabel,
  getSendLandingTimeframeForPage,
  sendLandingRepositoryUrl,
  type SendLandingFiltersResponse,
  type SendLandingResponse,
  type SendLandingTimeframe,
} from "./send-landing-config";
import {
  formatLamportsAsSol,
  getDefaultSortDirection,
  getHeadToHeadMatrix,
  getSendLandingProviderItems,
  getSendLandingTrendSeries,
  sendLandingTableMetrics,
  sortSendLandingProviderItems,
  type HeadToHeadCell,
  type SendLandingProviderItem,
  type SendLandingSortKey,
  type SendLandingTableMetric,
  type SendLandingTrendMetric,
  type SortDirection,
} from "./send-landing-metrics";
import { TimeSeriesChart, formatValue } from "./time-series-chart";

const filtersUrl = "/api/senders/landing/filters";
const percentMetrics = new Set<SendLandingTableMetric>([
  "firstOnChain",
  "landed",
  "laterSlot",
]);
const trendMetrics = ["firstOnChain", "landed"] as const;

export function SenderLandingPerformance({
  region,
  pageTimeframe,
  onRegionChange,
}: {
  region: string;
  /** The page's time frame, which also drives the tips and fees above. */
  pageTimeframe: RpcTimeframe;
  onRegionChange: (_region: string) => void;
}) {
  const { timeframe, raised } = getSendLandingTimeframeForPage(pageTimeframe);
  const { data: filters } = useSWR<SendLandingFiltersResponse>(
    filtersUrl,
    fetchSendLandingFilters,
    rpcFiltersSWRConfig,
  );
  const { data, error, isLoading, isValidating } = useSWR<SendLandingResponse>(
    getSendLandingDataUrl(region, timeframe),
    fetchSendLandingData,
    rpcDataSWRConfig,
  );

  // Move off a region the benchmark doesn't report (the default, or one carried
  // over from the RPC tab) to the first region it does.
  useEffect(() => {
    if (filters && region !== "all" && !filters.regions.includes(region))
      onRegionChange(filters.regions[0] ?? "all");
  }, [filters, region, onRegionChange]);

  return (
    <SenderLandingPerformanceView
      data={data}
      isUnavailable={!!error}
      isLoading={isLoading && !data}
      isRefreshing={isValidating && !!data}
      regions={filters?.regions ?? (region === "all" ? [] : [region])}
      region={region}
      timeframe={timeframe}
      timeframeRaised={raised}
      onRegionChange={onRegionChange}
    />
  );
}

export function SenderLandingPerformanceView({
  data,
  isUnavailable,
  isLoading,
  isRefreshing,
  regions,
  region,
  timeframe,
  timeframeRaised = false,
  onRegionChange,
}: {
  data?: SendLandingResponse;
  isUnavailable: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  regions: readonly string[];
  region: string;
  timeframe: SendLandingTimeframe;
  /** The page asked for less than a day; the section shows 24h and says so. */
  timeframeRaised?: boolean;
  onRegionChange: (_region: string) => void;
}) {
  const t = useTranslations("dataDashboard");
  const locale = useLocale();
  const [sortKey, setSortKey] = useState<SendLandingSortKey>("firstOnChain");
  const [direction, setDirection] = useState<SortDirection>("descending");
  const [trendMetric, setTrendMetric] =
    useState<SendLandingTrendMetric>("firstOnChain");
  const stepSeconds = data?.stepSeconds ?? 0;
  const items = useMemo(
    () =>
      data
        ? sortSendLandingProviderItems(
            getSendLandingProviderItems(
              data.providers,
              data.buckets,
              stepSeconds,
            ),
            sortKey,
            direction,
          )
        : [],
    [data, stepSeconds, sortKey, direction],
  );
  const matrix = useMemo(
    () =>
      getHeadToHeadMatrix(
        data?.headToHead ?? [],
        items.map((item) => item.provider),
      ),
    [data?.headToHead, items],
  );
  const chartSeries = useMemo(
    () =>
      data
        ? getSendLandingTrendSeries(
            data.buckets,
            trendMetric,
            new Set(items.map((item) => item.provider)),
            stepSeconds,
          )
        : [],
    [data, trendMetric, items, stepSeconds],
  );
  // While a new selection loads, the previous results stay on screen, so
  // label them with the selection they came from.
  const shownRegion = data?.region ?? region;
  const shownTimeframe = data?.timeframe ?? timeframe;
  const regionLabel =
    shownRegion === "all"
      ? t("controls.landingAllRegions")
      : getSendLandingRegionLabel(shownRegion);
  const trendLabel = (metric: SendLandingTrendMetric) =>
    t(
      metric === "firstOnChain"
        ? "landingExperience.chartFirstOnChain"
        : "landingExperience.chartLanded",
    );

  function updateSort(key: SendLandingSortKey) {
    if (key === sortKey)
      setDirection((current) =>
        current === "ascending" ? "descending" : "ascending",
      );
    else {
      setSortKey(key);
      setDirection(getDefaultSortDirection(key));
    }
  }

  const percent = (value: number) =>
    `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)}%`;

  function metricValue(
    item: SendLandingProviderItem,
    metric: SendLandingTableMetric,
  ): React.ReactNode {
    const value = item.values[metric];
    if (value === null) return "—";
    if (metric === "landed") {
      const { dropped, failed } = item.values;
      return (
        <Stacked
          primary={percent(value)}
          secondary={t("landingExperience.landedDetail", {
            dropped: dropped === null ? "—" : percent(dropped),
            failed: failed === null ? "—" : percent(failed),
          })}
        />
      );
    }
    if (percentMetrics.has(metric)) return percent(value);
    if (metric === "response")
      return `${formatValue(value, "Milliseconds", locale)} ms`;
    if (metric === "cost")
      return (
        <Stacked
          primary={t("landingExperience.lamports", {
            value: new Intl.NumberFormat(locale).format(Math.round(value)),
          })}
          secondary={t("landingExperience.sol", {
            value: formatLamportsAsSol(value, locale),
          })}
        />
      );
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
      value,
    );
  }

  const controls = (
    <div className="flex flex-wrap items-center gap-3 border-b border-nd-border-light px-4 py-4 md:px-6 xl:px-8">
      <FilterSelect
        ariaLabel={t("controls.landingRegionAriaLabel")}
        label={t("controls.rpcRegionLabel")}
        options={[
          { label: t("controls.landingAllRegions"), value: "all" },
          ...regions.map((value) => ({
            label: getSendLandingRegionLabel(value),
            value,
          })),
        ]}
        value={region}
        onChange={onRegionChange}
      />
      {data ? (
        <span className="font-brand-mono text-[11px] uppercase text-nd-mid-em-text">
          {t("landingExperience.tableScope", {
            timeframe: shownTimeframe,
            rounds: data.rounds.complete,
          })}
        </span>
      ) : null}
      {timeframeRaised ? (
        <span className="font-brand-mono text-[11px] text-nd-mid-em-text/80">
          {t("landingExperience.timeframeRaised")}
        </span>
      ) : null}
      {data && data.rounds.skipped > 0 ? (
        <span className="font-brand-mono text-[11px] text-nd-mid-em-text/80">
          {t("landingExperience.skippedRounds", {
            count: data.rounds.skipped,
          })}
        </span>
      ) : null}
    </div>
  );

  return (
    <div className="mt-10">
      <section
        aria-label={t("landingExperience.ariaLabel")}
        className="border border-nd-border-light"
      >
        <div className="border-b border-nd-border-light px-4 py-4 md:px-6 xl:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="m-0 text-[20px] font-medium leading-[1.25] tracking-normal xl:text-[24px]">
              {t("landingExperience.title")}
            </h2>
            {isRefreshing ? (
              <span
                aria-live="polite"
                className="inline-flex items-center gap-2 font-brand-mono text-[11px] font-bold uppercase text-nd-mid-em-text"
              >
                <Loader2
                  aria-hidden="true"
                  className="h-3.5 w-3.5 animate-spin"
                />
                {t("loading.refreshing")}
              </span>
            ) : null}
          </div>
          <p className="nd-body-s mt-2 max-w-[720px] text-nd-mid-em-text">
            {t("landingExperience.description")}
          </p>
        </div>

        {controls}

        {isUnavailable ? (
          <div role="status" className="px-6 py-12 text-center">
            <p className="m-0 font-brand-mono text-[12px] font-bold uppercase text-nd-high-em-text">
              {t("landingExperience.unavailableTitle")}
            </p>
            <p className="mx-auto mt-2 max-w-[480px] nd-body-s text-nd-mid-em-text">
              {t("landingExperience.unavailable")}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              {/* Fits from 1120px (a 1280px screen); narrower screens scroll here. */}
              <table className="w-full min-w-[1120px] table-fixed border-collapse">
                <caption className="sr-only">
                  {t("landingExperience.tableCaption")}
                </caption>
                <colgroup>
                  <col className="w-[256px]" />
                  <col className="w-[128px]" />
                  {sendLandingTableMetrics.map((metric) => (
                    <col
                      className={
                        metric === "landed" || metric === "cost"
                          ? "w-[150px]"
                          : undefined
                      }
                      key={metric}
                    />
                  ))}
                </colgroup>
                <thead>
                  <tr className="font-brand-mono text-[11px] font-bold uppercase text-nd-mid-em-text">
                    <SortHeader
                      active={sortKey === "provider"}
                      direction={direction}
                      label={t("landingExperience.provider")}
                      alignStart
                      onClick={() => updateSort("provider")}
                    />
                    <th className="px-4 py-3 text-left" scope="col">
                      {t("landingExperience.trend")}
                    </th>
                    {sendLandingTableMetrics.map((metric) => (
                      <SortHeader
                        active={sortKey === metric}
                        description={t(
                          `landingExperience.metricDescriptions.${metric}`,
                        )}
                        direction={direction}
                        key={metric}
                        label={t(`landingExperience.metrics.${metric}`)}
                        onClick={() => updateSort(metric)}
                      />
                    ))}
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
                            colSpan={sendLandingTableMetrics.length + 2}
                          >
                            <div className="h-5 animate-pulse bg-nd-border-light/30" />
                          </td>
                        </tr>
                      ))
                    : items.map((item, index) => (
                        <tr
                          className="border-t border-nd-border-light font-brand-mono text-[12px] font-bold text-nd-high-em-text"
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
                              <span
                                aria-hidden="true"
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{
                                  backgroundColor: getProviderColor(
                                    item.provider,
                                  ),
                                }}
                              />
                              <span
                                className="truncate uppercase"
                                title={item.provider}
                              >
                                {item.provider}
                              </span>
                            </div>
                          </th>
                          <td className="px-4 py-2">
                            <ProviderSparkline
                              color={getProviderColor(item.provider)}
                              points={item.trend}
                              minimumRange={10}
                            />
                          </td>
                          {sendLandingTableMetrics.map((metric) => (
                            <td
                              className="whitespace-nowrap py-2 pl-2 pr-5 text-right tabular-nums"
                              key={metric}
                            >
                              {metricValue(item, metric)}
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
                  <MobileProviderCard
                    item={item}
                    key={item.provider}
                    label={(metric) => t(`landingExperience.metrics.${metric}`)}
                    description={(metric) =>
                      t(`landingExperience.metricDescriptions.${metric}`)
                    }
                    value={(metric) => metricValue(item, metric)}
                  />
                ))
              )}
            </div>

            {!isLoading && items.length === 0 ? (
              <p className="px-6 py-12 text-center font-brand-mono text-[12px] uppercase text-nd-mid-em-text">
                {t("landingExperience.empty")}
              </p>
            ) : null}
          </>
        )}
      </section>

      {!isUnavailable && items.length > 1 ? (
        <section
          aria-labelledby="landing-head-to-head-title"
          className="min-w-0 border-x border-b border-nd-border-light p-4 md:p-6 xl:p-8"
        >
          <h2
            id="landing-head-to-head-title"
            className="m-0 text-[20px] font-medium leading-[1.25] tracking-normal xl:text-[24px]"
          >
            {t("landingExperience.headToHeadTitle")}
          </h2>
          <p className="nd-body-s mt-2 max-w-[720px] text-nd-mid-em-text">
            {t("landingExperience.headToHeadDescription")}
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="border-collapse font-brand-mono text-[12px] font-bold">
              <caption className="sr-only">
                {t("landingExperience.headToHeadCaption")}
              </caption>
              <thead>
                <tr className="text-[11px] uppercase text-nd-mid-em-text">
                  <th
                    className="border border-nd-border-light px-3 py-2 text-left font-bold"
                    scope="col"
                  >
                    {t("landingExperience.headToHeadCorner")}
                  </th>
                  {matrix.map((row) => (
                    <th
                      className="border border-nd-border-light px-3 py-2 text-right font-bold"
                      key={row.provider}
                      scope="col"
                    >
                      {row.provider}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.provider}>
                    <th
                      className="border border-nd-border-light px-3 py-2 text-left uppercase text-nd-high-em-text"
                      scope="row"
                    >
                      {row.provider}
                    </th>
                    {matrix.map((column) =>
                      column.provider === row.provider ? (
                        <td
                          aria-hidden="true"
                          className="border border-nd-border-light bg-nd-border-light/10 px-3 py-2"
                          key={column.provider}
                        />
                      ) : (
                        <HeadToHeadMatrixCell
                          cell={row.cells.find(
                            (cell) => cell.otherProvider === column.provider,
                          )!}
                          key={column.provider}
                          label={(cell) =>
                            t("landingExperience.headToHeadCell", {
                              provider: row.provider,
                              other: cell.otherProvider,
                              ahead: cell.ahead,
                              rounds: cell.rounds,
                            })
                          }
                          locale={locale}
                        />
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {!isUnavailable && items.length > 0 ? (
        <TooltipProvider delayDuration={100}>
          <section
            aria-labelledby="landing-trend-title"
            className="min-w-0 border-x border-b border-nd-border-light p-4 md:p-6 xl:p-8"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-center gap-2">
                <h2
                  id="landing-trend-title"
                  className="m-0 text-[20px] font-medium leading-[1.25] tracking-normal xl:text-[24px]"
                >
                  {t("landingExperience.chartTitle", {
                    metric: trendLabel(trendMetric),
                  })}
                </h2>
                <Tooltip disableHoverableContent>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={t("landingExperience.chartDetails")}
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
                      {t("landingExperience.chartDescription", {
                        step: formatStep(stepSeconds),
                      })}
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </div>
              <div
                role="group"
                aria-label={t("landingExperience.chartMetricLabel")}
                className="flex flex-wrap items-center gap-1"
              >
                {trendMetrics.map((metric) => (
                  <button
                    aria-pressed={trendMetric === metric}
                    className={cn(
                      "border px-2.5 py-1 font-brand-mono text-[11px] font-bold uppercase transition-colors",
                      trendMetric === metric
                        ? "border-nd-primary bg-white/[0.05] text-nd-high-em-text"
                        : "border-nd-border-prominent text-nd-mid-em-text hover:text-nd-high-em-text",
                    )}
                    key={metric}
                    onClick={() => setTrendMetric(metric)}
                    type="button"
                  >
                    {trendLabel(metric)}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 min-w-0">
              {chartSeries.length ? (
                <TimeSeriesChart
                  key={`${shownRegion}-${shownTimeframe}-${trendMetric}`}
                  ariaLabel={t("landingExperience.chartAriaLabel", {
                    metric: trendLabel(trendMetric),
                    region: regionLabel,
                  })}
                  height={320}
                  series={chartSeries}
                  timeGranularity="hour"
                  valueLabel="Percent"
                />
              ) : (
                <div className="flex h-[320px] items-center justify-center border border-dashed border-nd-border-light px-4 text-center font-brand-mono text-[12px] uppercase text-nd-mid-em-text">
                  {t("landingExperience.empty")}
                </div>
              )}
            </div>
          </section>
        </TooltipProvider>
      ) : null}

      <p className="nd-body-s mt-4 max-w-[720px] text-nd-mid-em-text/80">
        {t("landingExperience.methodology")}{" "}
        <a
          className="inline-flex items-center gap-1 text-nd-high-em-text underline underline-offset-2 hover:text-nd-primary"
          href={sendLandingRepositoryUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("landingExperience.methodologyLink")}
          <ExternalLink aria-hidden="true" className="h-3 w-3" />
        </a>
      </p>
    </div>
  );
}

/**
 * A value with a smaller line under it. In the table (md and up) both lines are
 * right-aligned and kept on one line; in the phone cards' narrow grid they
 * align left and may wrap, so nothing runs past the screen edge.
 */
function Stacked({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <span className="inline-flex flex-col items-start md:items-end">
      <span className="md:whitespace-nowrap">{primary}</span>
      <span className="text-[10px] font-normal text-nd-mid-em-text md:whitespace-nowrap">
        {secondary}
      </span>
    </span>
  );
}

function SortHeader({
  active,
  alignStart = false,
  description,
  direction,
  label,
  onClick,
}: {
  active: boolean;
  alignStart?: boolean;
  description?: string;
  direction: SortDirection;
  label: string;
  onClick: () => void;
}) {
  return (
    <th
      aria-sort={active ? direction : undefined}
      className="border-r border-nd-border-light"
      scope="col"
    >
      <button
        className={cn(
          "relative flex w-full items-center gap-1.5 py-3 leading-tight hover:bg-white/[0.04] hover:text-nd-high-em-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-nd-primary",
          // Right-aligned headers keep the sort arrow in their right padding,
          // so narrow columns give the label the whole width.
          alignStart
            ? "justify-start px-4 xl:px-6"
            : "justify-end pl-2 pr-5 text-right",
        )}
        onClick={onClick}
        title={description}
        type="button"
      >
        {label}
        {active ? (
          direction === "ascending" ? (
            <ArrowUp
              aria-hidden="true"
              className={cn(
                "h-3.5 w-3.5 shrink-0",
                !alignStart && "absolute right-1 top-1/2 -translate-y-1/2",
              )}
            />
          ) : (
            <ArrowDown
              aria-hidden="true"
              className={cn(
                "h-3.5 w-3.5 shrink-0",
                !alignStart && "absolute right-1 top-1/2 -translate-y-1/2",
              )}
            />
          )
        ) : alignStart ? (
          <span aria-hidden="true" className="w-3.5" />
        ) : null}
      </button>
    </th>
  );
}

function MobileProviderCard({
  item,
  label,
  description,
  value,
}: {
  item: SendLandingProviderItem;
  label: (_metric: SendLandingTableMetric) => string;
  description: (_metric: SendLandingTableMetric) => string;
  value: (_metric: SendLandingTableMetric) => React.ReactNode;
}) {
  return (
    <article className="p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate font-brand-mono text-[12px] font-bold uppercase">
          {item.provider}
        </span>
        <ProviderSparkline
          color={getProviderColor(item.provider)}
          points={item.trend}
          minimumRange={10}
        />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4">
        {sendLandingTableMetrics.map((metric) => (
          <div key={metric}>
            <dt
              className="font-brand-mono text-[10px] font-bold uppercase text-nd-mid-em-text"
              title={description(metric)}
            >
              {label(metric)}
            </dt>
            <dd className="mt-1 font-brand-mono text-[12px] font-bold tabular-nums">
              {value(metric)}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function HeadToHeadMatrixCell({
  cell,
  label,
  locale,
}: {
  cell: HeadToHeadCell;
  label: (_cell: HeadToHeadCell) => string;
  locale: string;
}) {
  const text = label(cell);
  return (
    <td
      aria-label={text}
      className={cn(
        "border border-nd-border-light px-3 py-2 text-right tabular-nums",
        cell.share === null
          ? "text-nd-mid-em-text"
          : cell.share >= 60
            ? "bg-emerald-500/20 text-nd-high-em-text"
            : cell.share >= 50
              ? "bg-emerald-500/10 text-nd-high-em-text"
              : cell.share >= 40
                ? "bg-rose-500/10 text-nd-high-em-text"
                : "bg-rose-500/20 text-nd-high-em-text",
      )}
      title={text}
    >
      {cell.share === null ? (
        "—"
      ) : (
        <span className="inline-flex flex-col items-end">
          <span>
            {new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
              cell.share,
            )}
            %
          </span>
          <span className="text-[10px] font-normal text-nd-mid-em-text">
            {cell.ahead}/{cell.rounds}
          </span>
        </span>
      )}
    </td>
  );
}

/** A bucket length as the time frame labels write it: 15m, 1h, 12h. */
export function formatStep(seconds: number) {
  if (seconds >= 3600 && seconds % 3600 === 0) return `${seconds / 3600}h`;
  return `${Math.round(seconds / 60)}m`;
}
