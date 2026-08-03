"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";

import { cn } from "@/app/components/utils";

import {
  normalizeProviderName,
  senderEconomicsMetricNames,
  type ChartScale,
  type MetricRow,
  type ProviderName,
} from "./data-config";
import {
  formatValue,
  TimeSeriesChart,
  type ChartSeries,
  type SeriesPoint,
} from "./time-series-chart";

const defaultVisibleProviderCount = 10;
const maxComparisonProviderCount = 4;
const overviewProviderCount = 5;
const senderComparisonColors = [
  "#14F195",
  "#60A5FA",
  "#FACC15",
  "#FB7185",
  "#A78BFA",
] as const;
const senderComparisonDashPatterns = [
  undefined,
  "8 4",
  "3 3",
  "10 3 2 3",
  "1 3",
] as const;
const otherProviderColor = "#ABABBA";
const otherProviderDashPattern = "2 4";

export type SenderEconomicsItem = {
  medianFeeLamports: number | null;
  medianTipLamports: number | null;
  provider: ProviderName;
  totalFeesSol: number | null;
  totalTipsSol: number | null;
  transactions: number;
};

export type SenderSortKey =
  | "provider"
  | "transactions"
  | "totalTipsSol"
  | "totalFeesSol"
  | "medianTipLamports"
  | "medianFeeLamports";

type SortDirection = "ascending" | "descending";

type SenderProviderExperienceProps = {
  availableProviders: ProviderName[];
  comparisonProviders: ReadonlySet<ProviderName>;
  hasExplicitComparison: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  onComparisonChange: (_providers: Set<ProviderName> | null) => void;
  rows: MetricRow[];
};

type SenderProviderItem = SenderEconomicsItem & {
  share: number;
  trend: SeriesPoint[];
};

export function SenderProviderExperience({
  availableProviders,
  comparisonProviders,
  hasExplicitComparison,
  isLoading,
  isRefreshing,
  onComparisonChange,
  rows,
}: SenderProviderExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");
  const [expandedProvider, setExpandedProvider] = useState<ProviderName | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [scaleType, setScaleType] = useState<ChartScale>("log");
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("descending");
  const [sortKey, setSortKey] = useState<SenderSortKey>("transactions");
  const availableProviderSet = useMemo(
    () => new Set(availableProviders),
    [availableProviders],
  );
  const economicsItems = useMemo(
    () => getSenderEconomicsItems(rows, availableProviderSet),
    [availableProviderSet, rows],
  );
  const transactionSeries = useMemo(
    () => getSenderProviderTransactionSeries(rows),
    [rows],
  );
  const totalTransactions = useMemo(
    () => economicsItems.reduce((sum, item) => sum + item.transactions, 0),
    [economicsItems],
  );
  const items = useMemo<SenderProviderItem[]>(
    () =>
      economicsItems.map((item) => ({
        ...item,
        share:
          totalTransactions > 0 ? item.transactions / totalTransactions : 0,
        trend: transactionSeries.get(item.provider)?.points ?? [],
      })),
    [economicsItems, totalTransactions, transactionSeries],
  );
  const selectedProviders = useMemo(
    () =>
      economicsItems
        .filter((item) => comparisonProviders.has(item.provider))
        .slice(0, maxComparisonProviderCount)
        .map((item) => item.provider),
    [comparisonProviders, economicsItems],
  );
  const selectedProviderSet = useMemo(
    () => new Set(selectedProviders),
    [selectedProviders],
  );
  const selectedProviderColors = useMemo(
    () =>
      new Map(
        selectedProviders.map((provider, index) => [
          provider,
          senderComparisonColors[index % senderComparisonColors.length],
        ]),
      ),
    [selectedProviders],
  );
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);
    const matchingItems = normalizedQuery
      ? items.filter((item) =>
          item.provider.toLocaleLowerCase(locale).includes(normalizedQuery),
        )
      : items;

    return sortSenderProviderItems(matchingItems, sortKey, sortDirection);
  }, [items, locale, query, sortDirection, sortKey]);
  const visibleItems = showAllProviders
    ? filteredItems
    : filteredItems.slice(0, defaultVisibleProviderCount);
  const chartSeries = useMemo(
    () =>
      getSenderComparisonSeries({
        economicsItems,
        otherLabel: t("senderExperience.otherProviders"),
        overview: !hasExplicitComparison,
        rows,
        selectedProviders: selectedProviderSet,
      }),
    [economicsItems, hasExplicitComparison, rows, selectedProviderSet, t],
  );
  const summaryValues = useMemo(
    () => getSenderSummaryValues(economicsItems),
    [economicsItems],
  );
  const hasIncompleteEconomics = economicsItems.some(
    (item) =>
      item.totalTipsSol === null ||
      item.totalFeesSol === null ||
      item.medianTipLamports === null ||
      item.medianFeeLamports === null,
  );
  const comparisonLimitReached =
    hasExplicitComparison &&
    selectedProviders.length >= maxComparisonProviderCount;

  useEffect(() => {
    const availableSelectedProviders = economicsItems
      .filter((item) => comparisonProviders.has(item.provider))
      .map((item) => item.provider);

    if (
      hasExplicitComparison &&
      availableSelectedProviders.length > maxComparisonProviderCount
    ) {
      onComparisonChange(
        new Set(
          availableSelectedProviders.slice(0, maxComparisonProviderCount),
        ),
      );
    }
  }, [
    comparisonProviders,
    economicsItems,
    hasExplicitComparison,
    onComparisonChange,
  ]);

  function updateSort(nextSortKey: SenderSortKey) {
    if (nextSortKey === sortKey) {
      setSortDirection((current) =>
        current === "descending" ? "ascending" : "descending",
      );
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection(nextSortKey === "provider" ? "ascending" : "descending");
    setShowAllProviders(false);
  }

  function toggleComparison(provider: ProviderName) {
    onComparisonChange(
      getNextSenderComparison({
        hasExplicitComparison,
        provider,
        selectedProviders: selectedProviderSet,
      }),
    );
  }

  return (
    <div className="mt-10 xl:mt-14">
      <section
        aria-label={t("senderExperience.overviewAriaLabel")}
        className="border border-nd-border-light"
      >
        <div className="flex flex-col gap-5 border-b border-nd-border-light px-4 py-5 md:px-6 xl:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="m-0 text-[20px] leading-[1.25] font-medium tracking-normal xl:text-[24px]">
                {t("senderExperience.title")}
              </h2>
              <p className="mt-2 max-w-[680px] nd-body-s text-nd-mid-em-text">
                {t("senderExperience.description")}
              </p>
            </div>
            <div
              aria-live="polite"
              className="flex shrink-0 items-center gap-2 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text"
              id="sender-comparison-status"
            >
              {isRefreshing ? (
                <Loader2
                  aria-hidden="true"
                  className="h-3.5 w-3.5 animate-spin"
                />
              ) : null}
              {hasExplicitComparison
                ? t("senderExperience.compareCount", {
                    count: selectedProviders.length,
                    max: maxComparisonProviderCount,
                  })
                : t("senderExperience.overviewMode")}
            </div>
          </div>

          <SenderSummary
            isLoading={isLoading}
            providerCount={economicsItems.length}
            totalFeesSol={summaryValues.totalFeesSol}
            totalTipsSol={summaryValues.totalTipsSol}
            totalTransactions={summaryValues.totalTransactions}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block min-w-0 flex-1 sm:max-w-[360px]">
              <span className="sr-only">
                {t("senderExperience.searchLabel")}
              </span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nd-mid-em-text"
              />
              <input
                className="h-10 w-full rounded-none border border-nd-border-prominent bg-transparent pl-9 pr-9 font-brand-mono text-[12px] text-nd-high-em-text outline-none placeholder:text-nd-mid-em-text/60 focus:border-nd-primary"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setShowAllProviders(false);
                }}
                placeholder={t("senderExperience.searchPlaceholder")}
                type="search"
                value={query}
              />
              {query ? (
                <button
                  aria-label={t("senderExperience.clearSearch")}
                  className="absolute right-1.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center text-nd-mid-em-text transition-colors hover:text-nd-high-em-text"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              ) : null}
            </label>

            <div className="flex items-center gap-2 md:hidden">
              <label
                className="font-brand-mono text-[11px] font-bold uppercase text-nd-mid-em-text"
                htmlFor="sender-sort-select"
              >
                {t("senderExperience.sortBy")}
              </label>
              <select
                className="h-10 min-w-0 flex-1 rounded-none border border-nd-border-prominent bg-nd-inverse px-2.5 font-brand-mono text-[11px] font-bold uppercase text-nd-high-em-text"
                id="sender-sort-select"
                onChange={(event) =>
                  updateSort(event.target.value as SenderSortKey)
                }
                value={sortKey}
              >
                {getSenderSortOptions(t).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                aria-label={
                  sortDirection === "descending"
                    ? t("senderExperience.sortDescending")
                    : t("senderExperience.sortAscending")
                }
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-nd-border-prominent text-nd-high-em-text"
                onClick={() =>
                  setSortDirection((current) =>
                    current === "descending" ? "ascending" : "descending",
                  )
                }
                type="button"
              >
                {sortDirection === "descending" ? (
                  <ArrowDown aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <ArrowUp aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="sr-only" id="sender-table-sort-help">
          {t("senderExperience.sortHelp")}
        </p>

        <div className="hidden overflow-x-auto md:block">
          <table
            aria-describedby="sender-table-sort-help sender-comparison-status"
            className="w-full min-w-[1160px] border-collapse"
          >
            <caption className="sr-only">
              {t("senderExperience.tableCaption")}
            </caption>
            <thead>
              <tr className="font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text">
                <SenderSortableHeader
                  direction={sortDirection}
                  label={t("senderEconomics.provider")}
                  onSort={updateSort}
                  sortKey="provider"
                  selectedSortKey={sortKey}
                />
                <SenderSortableHeader
                  align="right"
                  direction={sortDirection}
                  label={t("senderEconomics.transactions")}
                  onSort={updateSort}
                  sortKey="transactions"
                  selectedSortKey={sortKey}
                />
                <th className="px-4 py-3 text-left" scope="col">
                  {t("senderExperience.trend")}
                </th>
                <SenderSortableHeader
                  align="right"
                  direction={sortDirection}
                  label={t("senderEconomics.totalTips")}
                  onSort={updateSort}
                  sortKey="totalTipsSol"
                  selectedSortKey={sortKey}
                />
                <SenderSortableHeader
                  align="right"
                  direction={sortDirection}
                  label={t("senderEconomics.totalFees")}
                  onSort={updateSort}
                  sortKey="totalFeesSol"
                  selectedSortKey={sortKey}
                />
                <SenderSortableHeader
                  align="right"
                  direction={sortDirection}
                  label={t("senderEconomics.medianTip")}
                  onSort={updateSort}
                  sortKey="medianTipLamports"
                  selectedSortKey={sortKey}
                />
                <SenderSortableHeader
                  align="right"
                  direction={sortDirection}
                  label={t("senderEconomics.medianFee")}
                  onSort={updateSort}
                  sortKey="medianFeeLamports"
                  selectedSortKey={sortKey}
                />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SenderTableSkeleton />
              ) : (
                visibleItems.map((item, index) => {
                  const isSelected = selectedProviderSet.has(item.provider);
                  const comparisonDisabled =
                    comparisonLimitReached && !isSelected;

                  return (
                    <tr
                      className={cn(
                        "border-t border-nd-border-light font-brand-mono text-[12px] leading-[1.42] font-bold text-nd-high-em-text",
                        isSelected ? "bg-white/[0.035]" : "",
                      )}
                      key={item.provider}
                    >
                      <th
                        className="border-r border-nd-border-light px-4 py-3 text-left xl:px-6"
                        scope="row"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="w-5 shrink-0 text-[10px] text-nd-mid-em-text/60">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <CompareProviderButton
                            color={selectedProviderColors.get(item.provider)}
                            disabled={comparisonDisabled}
                            isSelected={isSelected}
                            onClick={() => toggleComparison(item.provider)}
                            provider={item.provider}
                          />
                          <span className="truncate uppercase">
                            {item.provider}
                          </span>
                        </div>
                      </th>
                      <td className="min-w-[180px] px-4 py-3 text-right tabular-nums">
                        <div className="grid gap-1.5">
                          <div className="flex items-baseline justify-end gap-2">
                            <span>
                              {formatSenderEconomicsValue(
                                item.transactions,
                                "count",
                                locale,
                              )}
                            </span>
                            <span className="text-[10px] text-nd-mid-em-text">
                              {formatShare(item.share, locale)}
                            </span>
                          </div>
                          <div className="ml-auto h-1.5 w-full max-w-[150px] overflow-hidden bg-nd-border-light/40">
                            <span
                              className="block h-full bg-nd-primary"
                              style={{ width: `${item.share * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="w-[120px] px-4 py-3">
                        <SenderSparkline
                          color={
                            selectedProviderColors.get(item.provider) ??
                            otherProviderColor
                          }
                          points={item.trend}
                        />
                      </td>
                      <SenderValueCell
                        locale={locale}
                        unit="sol"
                        value={item.totalTipsSol}
                      />
                      <SenderValueCell
                        locale={locale}
                        unit="sol"
                        value={item.totalFeesSol}
                      />
                      <SenderValueCell
                        locale={locale}
                        unit="lamports"
                        value={item.medianTipLamports}
                      />
                      <SenderValueCell
                        locale={locale}
                        unit="lamports"
                        value={item.medianFeeLamports}
                      />
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-nd-border-light md:hidden">
          {isLoading ? (
            <SenderMobileSkeleton />
          ) : (
            visibleItems.map((item, index) => {
              const isExpanded = expandedProvider === item.provider;
              const isSelected = selectedProviderSet.has(item.provider);
              const comparisonDisabled = comparisonLimitReached && !isSelected;

              return (
                <article className="px-4 py-4" key={item.provider}>
                  <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
                    <CompareProviderButton
                      color={selectedProviderColors.get(item.provider)}
                      disabled={comparisonDisabled}
                      isSelected={isSelected}
                      onClick={() => toggleComparison(item.provider)}
                      provider={item.provider}
                    />
                    <button
                      aria-expanded={isExpanded}
                      className="min-w-0 text-left"
                      onClick={() =>
                        setExpandedProvider(isExpanded ? null : item.provider)
                      }
                      type="button"
                    >
                      <span className="flex items-center gap-2 font-brand-mono text-[12px] font-bold uppercase text-nd-high-em-text">
                        <span className="text-[10px] text-nd-mid-em-text/60">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate">{item.provider}</span>
                      </span>
                      <span className="mt-2 block font-brand-mono text-[10px] font-bold uppercase text-nd-mid-em-text">
                        {getSenderSortLabel(t, sortKey)}
                      </span>
                      <span className="mt-1 block font-brand-mono text-[18px] font-bold tabular-nums text-nd-high-em-text">
                        {formatSenderSortValue(item, sortKey, locale)}
                      </span>
                      {sortKey === "transactions" ? (
                        <span className="mt-1 block font-brand-mono text-[10px] font-bold uppercase text-nd-mid-em-text">
                          {t("senderExperience.share", {
                            share: formatPercentNumber(item.share, locale),
                          })}
                        </span>
                      ) : null}
                    </button>
                    <div className="grid justify-items-end gap-3">
                      <SenderSparkline
                        color={
                          selectedProviderColors.get(item.provider) ??
                          otherProviderColor
                        }
                        points={item.trend}
                      />
                      {isExpanded ? (
                        <ChevronUp
                          aria-hidden="true"
                          className="h-4 w-4 text-nd-mid-em-text"
                        />
                      ) : (
                        <ChevronDown
                          aria-hidden="true"
                          className="h-4 w-4 text-nd-mid-em-text"
                        />
                      )}
                    </div>
                  </div>

                  {isExpanded ? (
                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-nd-border-light pt-4">
                      {getSenderDetailItems(t, item).map((detail) => (
                        <div className="min-w-0" key={detail.key}>
                          <dt className="font-brand-mono text-[10px] font-bold uppercase text-nd-mid-em-text">
                            {detail.label}
                          </dt>
                          <dd className="mt-1 font-brand-mono text-[12px] font-bold tabular-nums text-nd-high-em-text">
                            {formatSenderEconomicsValue(
                              detail.value,
                              detail.unit,
                              locale,
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </article>
              );
            })
          )}
        </div>

        {!isLoading && filteredItems.length === 0 ? (
          <div className="border-t border-nd-border-light px-6 py-12 text-center font-brand-mono text-[12px] uppercase text-nd-mid-em-text">
            {t("senderExperience.noSearchResults")}
          </div>
        ) : null}

        {!isLoading && hasIncompleteEconomics ? (
          <p className="border-t border-nd-border-light px-4 py-3 font-brand-mono text-[10px] font-bold uppercase text-nd-mid-em-text md:px-6 xl:px-8">
            {t("senderExperience.incompleteEconomicsNotice")}
          </p>
        ) : null}

        {!isLoading && filteredItems.length > defaultVisibleProviderCount ? (
          <div className="flex flex-col gap-3 border-t border-nd-border-light px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 xl:px-8">
            <span
              aria-live="polite"
              className="font-brand-mono text-[11px] font-bold uppercase text-nd-mid-em-text"
            >
              {t("senderExperience.showingProviders", {
                count: visibleItems.length,
                total: filteredItems.length,
              })}
            </span>
            <button
              aria-expanded={showAllProviders}
              className="inline-flex min-h-10 items-center justify-center gap-2 border border-nd-border-prominent px-3 font-brand-mono text-[11px] font-bold uppercase text-nd-high-em-text transition-colors hover:bg-white/[0.06]"
              onClick={() => setShowAllProviders((current) => !current)}
              type="button"
            >
              {showAllProviders
                ? t("senderExperience.showFewer")
                : t("senderExperience.showAll", {
                    count: filteredItems.length,
                  })}
              {showAllProviders ? (
                <ChevronUp aria-hidden="true" className="h-4 w-4" />
              ) : (
                <ChevronDown aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          </div>
        ) : null}
      </section>

      <section
        aria-labelledby="sender-comparison-title"
        className="relative border-x border-b border-nd-border-light p-4 md:p-6 xl:p-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2
              className="m-0 text-[20px] leading-[1.25] font-medium tracking-normal xl:text-[24px]"
              id="sender-comparison-title"
            >
              {t("senderExperience.chartTitle")}
            </h2>
            <p className="mt-2 max-w-[680px] nd-body-s text-nd-mid-em-text">
              {hasExplicitComparison
                ? t("senderExperience.chartDescriptionComparison")
                : t("senderExperience.chartDescriptionOverview")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div
              aria-label={t("senderExperience.scale")}
              className="inline-flex items-center gap-1"
              role="group"
            >
              {(["linear", "log"] as const).map((scale) => (
                <button
                  aria-pressed={scaleType === scale}
                  className={cn(
                    "border px-2.5 py-1 font-brand-mono text-[11px] font-bold uppercase transition-colors",
                    scaleType === scale
                      ? "border-nd-primary bg-white/[0.05] text-nd-high-em-text"
                      : "border-nd-border-prominent text-nd-mid-em-text hover:text-nd-high-em-text",
                  )}
                  key={scale}
                  onClick={() => setScaleType(scale)}
                  type="button"
                >
                  {scale === "linear"
                    ? t("senderExperience.linearScale")
                    : t("senderExperience.logScale")}
                </button>
              ))}
            </div>
            {hasExplicitComparison ? (
              <button
                className="inline-flex min-h-7 items-center gap-1.5 border border-nd-border-prominent px-2.5 font-brand-mono text-[11px] font-bold uppercase text-nd-high-em-text transition-colors hover:bg-white/[0.06]"
                onClick={() => onComparisonChange(null)}
                type="button"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
                {t("senderExperience.clearComparison")}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          {isLoading ? (
            <div className="h-[380px] animate-pulse bg-nd-border-light/40" />
          ) : chartSeries.length > 0 ? (
            <TimeSeriesChart
              ariaLabel={t("senderExperience.chartAriaLabel", {
                count: chartSeries.length,
                mode: hasExplicitComparison
                  ? t("senderExperience.comparisonMode")
                  : t("senderExperience.overviewMode"),
                scale:
                  scaleType === "log"
                    ? t("senderExperience.logScale")
                    : t("senderExperience.linearScale"),
              })}
              height={380}
              interactiveLegend={false}
              scaleType={scaleType}
              series={chartSeries}
              showEndLabels
              timeGranularity="hour"
              valueLabel="Count"
            />
          ) : (
            <div className="flex h-[320px] items-center justify-center border border-dashed border-nd-border-light px-6 text-center font-brand-mono text-[12px] uppercase text-nd-mid-em-text">
              {t("senderExperience.emptyComparison")}
            </div>
          )}
        </div>

        <p className="mt-4 font-brand-mono text-[10px] font-bold uppercase text-nd-mid-em-text/80">
          {t("senderExperience.missingDataNotice")}
        </p>

        {chartSeries.length > 0 ? (
          <SenderTrendAccessibleTable series={chartSeries} />
        ) : null}

        {isRefreshing ? (
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
        ) : null}
      </section>
    </div>
  );
}

function SenderSummary({
  isLoading,
  providerCount,
  totalFeesSol,
  totalTipsSol,
  totalTransactions,
}: {
  isLoading: boolean;
  providerCount: number;
  totalFeesSol: number;
  totalTipsSol: number;
  totalTransactions: number;
}) {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");
  const summaryItems = [
    {
      label: t("senderExperience.reportingProviders"),
      value: new Intl.NumberFormat(locale).format(providerCount),
    },
    {
      label: t("senderExperience.totalTransactions"),
      value: formatValue(totalTransactions, "Count", locale),
    },
    {
      label: t("senderExperience.totalTips"),
      value: `${formatValue(totalTipsSol, "SOL", locale)} SOL`,
    },
    {
      label: t("senderExperience.totalFees"),
      value: `${formatValue(totalFeesSol, "SOL", locale)} SOL`,
    },
  ];

  return (
    <dl className="grid grid-cols-2 border border-nd-border-light lg:grid-cols-4 lg:divide-x lg:divide-nd-border-light">
      {summaryItems.map((item, index) => (
        <div
          className={cn(
            "min-w-0 px-3 py-3 md:px-4",
            index >= 2 ? "border-t border-nd-border-light lg:border-t-0" : "",
            index % 2 === 1
              ? "border-l border-nd-border-light lg:border-l-0"
              : "",
          )}
          key={item.label}
        >
          <dt className="font-brand-mono text-[10px] font-bold uppercase text-nd-mid-em-text">
            {item.label}
          </dt>
          <dd className="mt-1.5 font-brand-mono text-[18px] font-bold tabular-nums text-nd-high-em-text md:text-[20px]">
            {isLoading ? (
              <span className="block h-6 w-20 animate-pulse bg-nd-border-light" />
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function SenderSortableHeader({
  align = "left",
  direction,
  label,
  onSort,
  selectedSortKey,
  sortKey,
}: {
  align?: "left" | "right";
  direction: SortDirection;
  label: string;
  onSort: (_sortKey: SenderSortKey) => void;
  selectedSortKey: SenderSortKey;
  sortKey: SenderSortKey;
}) {
  const isSelected = selectedSortKey === sortKey;

  return (
    <th
      aria-sort={isSelected ? direction : undefined}
      className={cn(
        "border-r border-nd-border-light px-0 py-0 last:border-r-0",
        align === "right" ? "text-right" : "text-left",
      )}
      scope="col"
    >
      <button
        className={cn(
          "flex min-h-10 w-full items-center gap-1.5 px-4 py-3 transition-colors hover:bg-white/[0.04] hover:text-nd-high-em-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-nd-primary",
          align === "right" ? "justify-end" : "justify-start",
        )}
        onClick={() => onSort(sortKey)}
        type="button"
      >
        <span>{label}</span>
        {isSelected ? (
          direction === "descending" ? (
            <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
          )
        ) : (
          <span aria-hidden="true" className="h-3.5 w-3.5" />
        )}
      </button>
    </th>
  );
}

function CompareProviderButton({
  color,
  disabled,
  isSelected,
  onClick,
  provider,
}: {
  color?: string;
  disabled: boolean;
  isSelected: boolean;
  onClick: () => void;
  provider: ProviderName;
}) {
  const t = useTranslations("dataDashboard");

  return (
    <button
      aria-label={
        isSelected
          ? t("senderExperience.removeComparison", { provider })
          : t("senderExperience.addComparison", { provider })
      }
      aria-pressed={isSelected}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nd-primary",
        isSelected
          ? "border-current text-nd-high-em-text"
          : "border-nd-border-prominent text-nd-mid-em-text hover:border-nd-high-em-text hover:text-nd-high-em-text",
        disabled ? "cursor-not-allowed opacity-35" : "",
      )}
      disabled={disabled}
      onClick={onClick}
      style={isSelected && color ? { borderColor: color, color } : undefined}
      title={disabled ? t("senderExperience.comparisonLimit") : undefined}
      type="button"
    >
      {isSelected ? (
        <Check aria-hidden="true" className="h-4 w-4" />
      ) : (
        <Plus aria-hidden="true" className="h-4 w-4" />
      )}
    </button>
  );
}

function SenderValueCell({
  locale,
  unit,
  value,
}: {
  locale: string;
  unit: "lamports" | "sol";
  value: number | null;
}) {
  return (
    <td className="px-4 py-3 text-right font-brand-mono text-[12px] font-bold tabular-nums text-nd-high-em-text">
      {formatSenderEconomicsValue(value, unit, locale)}
    </td>
  );
}

function SenderSparkline({
  color,
  points,
}: {
  color: string;
  points: SeriesPoint[];
}) {
  const width = 96;
  const height = 28;
  const padding = 2;
  const definedValues = points
    .filter((point) => point.defined !== false && Number.isFinite(point.value))
    .map((point) => point.value);

  if (definedValues.length === 0) {
    return <span className="block h-7 w-24 bg-nd-border-light/20" />;
  }

  const minValue = Math.min(...definedValues);
  const maxValue = Math.max(...definedValues);
  const valueRange = Math.max(maxValue - minValue, 1);
  const pointStep =
    points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  const segments: string[] = [];
  let currentSegment: string[] = [];

  points.forEach((point, index) => {
    if (point.defined === false || !Number.isFinite(point.value)) {
      if (currentSegment.length > 0) {
        segments.push(currentSegment.join(" "));
        currentSegment = [];
      }
      return;
    }

    const x = padding + index * pointStep;
    const y =
      height -
      padding -
      ((point.value - minValue) / valueRange) * (height - padding * 2);

    currentSegment.push(
      `${currentSegment.length === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`,
    );
  });

  if (currentSegment.length > 0) {
    segments.push(currentSegment.join(" "));
  }

  return (
    <svg
      aria-hidden="true"
      className="block h-7 w-24 overflow-visible"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <line
        stroke="rgba(236, 228, 253, 0.12)"
        x1={0}
        x2={width}
        y1={height - 1}
        y2={height - 1}
      />
      {segments.map((segment, index) => (
        <path
          d={segment}
          fill="none"
          key={`${segment}-${index}`}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
}

function SenderTrendAccessibleTable({ series }: { series: ChartSeries[] }) {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");

  return (
    <table className="sr-only">
      <caption>{t("senderExperience.trendTableCaption")}</caption>
      <thead>
        <tr>
          <th scope="col">{t("senderEconomics.provider")}</th>
          <th scope="col">{t("senderExperience.firstObserved")}</th>
          <th scope="col">{t("senderExperience.latestObserved")}</th>
        </tr>
      </thead>
      <tbody>
        {series.map((item) => {
          const definedPoints = item.points.filter(
            (point) => point.defined !== false,
          );

          return (
            <tr key={item.id}>
              <th scope="row">{item.label}</th>
              <td>
                {formatSenderEconomicsValue(
                  definedPoints[0]?.value ?? 0,
                  "count",
                  locale,
                )}
              </td>
              <td>
                {formatSenderEconomicsValue(
                  definedPoints.at(-1)?.value ?? 0,
                  "count",
                  locale,
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SenderTableSkeleton() {
  return Array.from({ length: defaultVisibleProviderCount }).map((_, index) => (
    <tr className="border-t border-nd-border-light" key={index}>
      {Array.from({ length: 7 }).map((__, columnIndex) => (
        <td className="px-4 py-4" key={columnIndex}>
          <span
            className={cn(
              "block h-3 animate-pulse bg-nd-border-light",
              columnIndex === 0 ? "w-28" : "ml-auto w-16",
            )}
          />
        </td>
      ))}
    </tr>
  ));
}

function SenderMobileSkeleton() {
  return Array.from({ length: 6 }).map((_, index) => (
    <div className="grid grid-cols-[28px_1fr_96px] gap-3 px-4 py-4" key={index}>
      <span className="h-7 animate-pulse bg-nd-border-light" />
      <span className="h-12 animate-pulse bg-nd-border-light" />
      <span className="h-7 animate-pulse bg-nd-border-light" />
    </div>
  ));
}

function getSenderSortOptions(t: ReturnType<typeof useTranslations>) {
  return [
    { label: t("senderEconomics.transactions"), value: "transactions" },
    { label: t("senderEconomics.totalTips"), value: "totalTipsSol" },
    { label: t("senderEconomics.totalFees"), value: "totalFeesSol" },
    { label: t("senderEconomics.medianTip"), value: "medianTipLamports" },
    { label: t("senderEconomics.medianFee"), value: "medianFeeLamports" },
    { label: t("senderEconomics.provider"), value: "provider" },
  ] as const satisfies readonly { label: string; value: SenderSortKey }[];
}

function getSenderSortLabel(
  t: ReturnType<typeof useTranslations>,
  sortKey: SenderSortKey,
) {
  return (
    getSenderSortOptions(t).find((option) => option.value === sortKey)?.label ??
    sortKey
  );
}

function getSenderDetailItems(
  t: ReturnType<typeof useTranslations>,
  item: SenderProviderItem,
) {
  return [
    {
      key: "transactions",
      label: t("senderEconomics.transactions"),
      unit: "count",
      value: item.transactions,
    },
    {
      key: "totalTipsSol",
      label: t("senderEconomics.totalTips"),
      unit: "sol",
      value: item.totalTipsSol,
    },
    {
      key: "totalFeesSol",
      label: t("senderEconomics.totalFees"),
      unit: "sol",
      value: item.totalFeesSol,
    },
    {
      key: "medianTipLamports",
      label: t("senderEconomics.medianTip"),
      unit: "lamports",
      value: item.medianTipLamports,
    },
    {
      key: "medianFeeLamports",
      label: t("senderEconomics.medianFee"),
      unit: "lamports",
      value: item.medianFeeLamports,
    },
  ] as const;
}

function getSenderSummaryValues(items: SenderEconomicsItem[]) {
  return items.reduce(
    (summary, item) => ({
      totalFeesSol: summary.totalFeesSol + (item.totalFeesSol ?? 0),
      totalTipsSol: summary.totalTipsSol + (item.totalTipsSol ?? 0),
      totalTransactions: summary.totalTransactions + item.transactions,
    }),
    { totalFeesSol: 0, totalTipsSol: 0, totalTransactions: 0 },
  );
}

function formatSenderSortValue(
  item: SenderProviderItem,
  sortKey: SenderSortKey,
  locale: string,
) {
  switch (sortKey) {
    case "provider":
      return item.provider;
    case "transactions":
      return formatSenderEconomicsValue(item.transactions, "count", locale);
    case "totalTipsSol":
      return formatSenderEconomicsValueWithUnit(
        item.totalTipsSol,
        "sol",
        "SOL",
        locale,
      );
    case "totalFeesSol":
      return formatSenderEconomicsValueWithUnit(
        item.totalFeesSol,
        "sol",
        "SOL",
        locale,
      );
    case "medianTipLamports":
      return formatSenderEconomicsValueWithUnit(
        item.medianTipLamports,
        "lamports",
        "lamports",
        locale,
      );
    case "medianFeeLamports":
      return formatSenderEconomicsValueWithUnit(
        item.medianFeeLamports,
        "lamports",
        "lamports",
        locale,
      );
  }
}

function formatSenderEconomicsValue(
  value: number | null,
  unit: "count" | "lamports" | "sol",
  locale: string,
) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: unit === "sol" ? 4 : 0,
  }).format(value);
}

function formatSenderEconomicsValueWithUnit(
  value: number | null,
  unit: "lamports" | "sol",
  suffix: string,
  locale: string,
) {
  return value === null
    ? formatSenderEconomicsValue(value, unit, locale)
    : `${formatSenderEconomicsValue(value, unit, locale)} ${suffix}`;
}

function formatShare(share: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: share >= 0.01 ? 1 : 2,
    style: "percent",
  }).format(share);
}

function formatPercentNumber(share: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: share >= 0.01 ? 1 : 2,
  }).format(share * 100);
}

export function sortSenderProviderItems<T extends SenderEconomicsItem>(
  items: readonly T[],
  sortKey: SenderSortKey,
  direction: SortDirection,
) {
  const directionMultiplier = direction === "ascending" ? 1 : -1;

  return [...items].sort((a, b) => {
    if (sortKey === "provider") {
      return (
        a.provider.localeCompare(b.provider) * directionMultiplier ||
        b.transactions - a.transactions
      );
    }

    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue === null && bValue === null) {
      return a.provider.localeCompare(b.provider);
    }

    if (aValue === null) {
      return 1;
    }

    if (bValue === null) {
      return -1;
    }

    return (
      (aValue - bValue) * directionMultiplier ||
      a.provider.localeCompare(b.provider)
    );
  });
}

export function getNextSenderComparison({
  hasExplicitComparison,
  provider,
  selectedProviders,
}: {
  hasExplicitComparison: boolean;
  provider: ProviderName;
  selectedProviders: ReadonlySet<ProviderName>;
}) {
  if (!hasExplicitComparison) {
    return new Set<ProviderName>([provider]);
  }

  const nextProviders = new Set(selectedProviders);

  if (nextProviders.has(provider)) {
    nextProviders.delete(provider);
    return nextProviders;
  }

  if (nextProviders.size < maxComparisonProviderCount) {
    nextProviders.add(provider);
  }

  return nextProviders;
}

export function getSenderEconomicsItems(
  rows: readonly MetricRow[],
  selectedProviders: ReadonlySet<ProviderName>,
): SenderEconomicsItem[] {
  const rowsByProvider = new Map<ProviderName, MetricRow[]>();

  for (const row of rows) {
    const providerName = normalizeProviderName(row.providerName).trim();

    if (
      !selectedProviders.has(providerName) ||
      (row.metricName !== "Sender Transactions" &&
        !senderEconomicsMetricNames.includes(
          row.metricName as (typeof senderEconomicsMetricNames)[number],
        ))
    ) {
      continue;
    }

    const providerRows = rowsByProvider.get(providerName) ?? [];

    providerRows.push(row);
    rowsByProvider.set(providerName, providerRows);
  }

  return Array.from(rowsByProvider.entries())
    .flatMap(([provider, providerRows]) => {
      const transactions =
        getLatestMetricValue(providerRows, "Sender Total Transactions") ??
        getObservedTransactionTotal(providerRows);
      const totalTipsSol = getLatestMetricValue(
        providerRows,
        "Sender Total Tips",
      );
      const totalFeesSol = getLatestMetricValue(
        providerRows,
        "Sender Total Fees",
      );
      const medianTipLamports = getLatestMetricValue(
        providerRows,
        "Sender Median Tip",
      );
      const medianFeeLamports = getLatestMetricValue(
        providerRows,
        "Sender Median Fee",
      );

      return transactions !== undefined
        ? [
            {
              medianFeeLamports: medianFeeLamports ?? null,
              medianTipLamports: medianTipLamports ?? null,
              provider,
              totalFeesSol: totalFeesSol ?? null,
              totalTipsSol: totalTipsSol ?? null,
              transactions,
            },
          ]
        : [];
    })
    .sort(
      (a, b) =>
        b.transactions - a.transactions || a.provider.localeCompare(b.provider),
    );
}

function getObservedTransactionTotal(rows: readonly MetricRow[]) {
  const transactionRows = rows.filter(
    (row) => row.metricName === "Sender Transactions",
  );

  return transactionRows.length > 0
    ? transactionRows.reduce((total, row) => total + row.value, 0)
    : undefined;
}

function getLatestMetricValue(rows: MetricRow[], metricName: string) {
  return rows
    .filter((row) => row.metricName === metricName)
    .sort((a, b) => b.date.localeCompare(a.date))[0]?.value;
}

function getSenderProviderTransactionSeries(rows: readonly MetricRow[]) {
  const transactionRows = rows.filter(
    (row) => row.metricName === "Sender Transactions",
  );
  const timestamps = Array.from(
    new Set(transactionRows.map((row) => row.date)),
  ).sort((a, b) => a.localeCompare(b));
  const valuesByProvider = new Map<ProviderName, Map<string, number>>();

  for (const row of transactionRows) {
    const provider = normalizeProviderName(row.providerName).trim();
    const valuesByTimestamp = valuesByProvider.get(provider) ?? new Map();

    valuesByTimestamp.set(
      row.date,
      (valuesByTimestamp.get(row.date) ?? 0) + row.value,
    );
    valuesByProvider.set(provider, valuesByTimestamp);
  }

  return new Map(
    Array.from(valuesByProvider.entries()).map(
      ([provider, valuesByTimestamp]) => [
        provider,
        {
          id: provider,
          label: provider,
          color: otherProviderColor,
          points: timestamps.flatMap((timestamp) => {
            const date = new Date(timestamp);

            if (Number.isNaN(date.getTime())) {
              return [];
            }

            const value = valuesByTimestamp.get(timestamp);

            return [
              {
                date,
                defined: value !== undefined,
                value: value ?? 0,
              },
            ];
          }),
        } satisfies ChartSeries,
      ],
    ),
  );
}

export function getSenderComparisonSeries({
  economicsItems,
  otherLabel,
  overview,
  rows,
  selectedProviders,
}: {
  economicsItems: readonly SenderEconomicsItem[];
  otherLabel: string;
  overview: boolean;
  rows: readonly MetricRow[];
  selectedProviders: ReadonlySet<ProviderName>;
}) {
  const seriesByProvider = getSenderProviderTransactionSeries(rows);
  const providers = overview
    ? economicsItems
        .slice(0, overviewProviderCount)
        .map((item) => item.provider)
    : economicsItems
        .filter((item) => selectedProviders.has(item.provider))
        .slice(0, maxComparisonProviderCount)
        .map((item) => item.provider);
  const selectedSeries = providers.flatMap((provider, index) => {
    const series = seriesByProvider.get(provider);

    return series && series.points.some((point) => point.defined !== false)
      ? [
          {
            ...series,
            color:
              senderComparisonColors[index % senderComparisonColors.length],
            dashPattern:
              senderComparisonDashPatterns[
                index % senderComparisonDashPatterns.length
              ],
          },
        ]
      : [];
  });

  if (!overview) {
    return selectedSeries;
  }

  const selectedProviderSet = new Set(providers);
  const otherSeries = Array.from(seriesByProvider.values()).filter(
    (series) => !selectedProviderSet.has(series.id),
  );

  if (otherSeries.length === 0 || selectedSeries.length === 0) {
    return selectedSeries;
  }

  const points = selectedSeries[0].points.map((point, index) => {
    const observedPoints = otherSeries
      .map((series) => series.points[index])
      .filter(
        (otherPoint) =>
          otherPoint !== undefined && otherPoint.defined !== false,
      );

    return {
      date: point.date,
      defined: observedPoints.length > 0,
      value: observedPoints.reduce(
        (sum, observedPoint) => sum + observedPoint.value,
        0,
      ),
    };
  });

  return [
    ...selectedSeries,
    {
      color: otherProviderColor,
      dashPattern: otherProviderDashPattern,
      id: "sender-other-observed-providers",
      label: otherLabel,
      points,
    },
  ];
}
