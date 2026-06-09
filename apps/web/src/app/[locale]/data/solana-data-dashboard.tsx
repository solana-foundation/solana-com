"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { usePathname, useRouter } from "@workspace/i18n/routing";

import { cn } from "@/app/components/utils";

import {
  chartDefinitions,
  metricColors,
  providerColors,
  providers,
  rangeOptions,
  type Aggregation,
  type ChartDefinition,
  type DashboardTab,
  type DataApiResponse,
  type MetricRow,
  type ProviderName,
} from "./data-config";
import {
  formatValue,
  TimeSeriesChart,
  type ChartSeries,
} from "./time-series-chart";

const tabOptions = [
  { labelKey: "tabs.overview.label", value: "overview" },
  { labelKey: "tabs.stablecoins.label", value: "stablecoins" },
  { labelKey: "tabs.defi.label", value: "defi" },
] as const satisfies readonly { labelKey: string; value: DashboardTab }[];

const defaultProviders = new Set<ProviderName>(providers);
const defaultRangeDays = 90;
const emptyRows: MetricRow[] = [];
const kpiCount = 4;
const chartHeight = 320;
const dataRefreshIntervalMs = 10 * 60 * 1000;
const dataDedupingIntervalMs = 60 * 1000;
const dataSWRConfig = {
  dedupingInterval: dataDedupingIntervalMs,
  keepPreviousData: true,
  refreshInterval: dataRefreshIntervalMs,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
} as const;

type QueryUpdates = {
  days?: number;
  providers?: Set<ProviderName>;
  tab?: DashboardTab;
};

type KpiItem = {
  chart: ChartDefinition;
  delta: number;
  value: number;
};

type DashboardTranslator = ReturnType<typeof useTranslations>;

type DataFetchErrorMessages = {
  defaultUnavailable: string;
  invalidResponse: string;
};

type DataErrorPayload = {
  detail?: string;
  error?: string;
};

export function SolanaDataDashboard() {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");
  const showProviderControls = useMinWidth("(min-width: 768px)");
  const {
    activeTab,
    rangeDays,
    selectedProviderList,
    selectedProviders,
    updateQuery,
  } = useDashboardQueryState();
  const activeTabContent = getTabContent(t, activeTab);
  const dataUrl = `/api/databricks/data?days=${rangeDays}`;
  const errorMessages = useMemo(
    () => ({
      defaultUnavailable: t("errors.defaultUnavailable"),
      invalidResponse: t("errors.invalidResponse"),
    }),
    [t],
  );
  const fetchDashboardData = useCallback(
    (url: string) => fetchData(url, errorMessages),
    [errorMessages],
  );
  const { data, error, isLoading, isValidating } = useSWR<DataApiResponse>(
    dataUrl,
    fetchDashboardData,
    dataSWRConfig,
  );
  const rows = data?.rows ?? emptyRows;
  const activeCharts = useMemo(() => getChartsForTab(activeTab), [activeTab]);
  const visibleCharts = useMemo(
    () => getVisibleCharts(activeCharts, rows),
    [activeCharts, rows],
  );
  const kpis = useMemo(
    () => getKpis(visibleCharts, rows, selectedProviders),
    [visibleCharts, rows, selectedProviders],
  );
  const isInitialLoading = isLoading && rows.length === 0;
  const isRefreshing = isValidating && rows.length > 0;

  return (
    <main className="relative bg-nd-inverse text-nd-high-em-text font-brand">
      <div className="max-w-screen-2xl w-full mx-auto px-5 md:px-8 xl:px-10 py-10 xl:py-16">
        <header>
          <div>
            <span className="font-brand-mono text-[11px] md:text-[12px] leading-[1.42] font-bold uppercase text-nd-mid-em-text inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-nd-highlight-green"
              />
              {t("header.eyebrow")}
            </span>
            <h1 className="nd-heading-l mt-3">{t("header.title")}</h1>
            <p className="nd-body-m text-nd-mid-em-text mt-3 max-w-[560px]">
              {t("header.description")}
            </p>
          </div>
        </header>

        <nav
          aria-label={t("controls.ariaLabel")}
          className="sticky top-[65px] lg:top-[71px] z-40 mt-8 -mx-5 md:-mx-8 xl:-mx-10 bg-nd-inverse/90 backdrop-blur-md border-y border-nd-border-light"
        >
          <DashboardControls
            activeTab={activeTab}
            rangeDays={rangeDays}
            selectedProviders={selectedProviders}
            showProviderControls={showProviderControls}
            onUpdateQuery={updateQuery}
          />
        </nav>

        <section
          aria-label={t("summaryAriaLabel", {
            tab: activeTabContent.label,
          })}
          className="mt-8 max-w-[720px]"
        >
          <h2 className="font-brand-mono text-[12px] leading-[1.42] font-bold uppercase text-nd-mid-em-text">
            {activeTabContent.label}
          </h2>
          <p className="nd-body-m text-nd-mid-em-text mt-2">
            {activeTabContent.description}
          </p>
        </section>

        {error ? <DataError error={error} /> : null}

        {!error ? (
          <>
            <KpiGrid
              isLoading={isInitialLoading}
              isRefreshing={isRefreshing}
              kpis={kpis}
            />

            <ChartGrid
              activeCharts={activeCharts}
              activeTab={activeTab}
              isLoading={isInitialLoading}
              isRefreshing={isRefreshing}
              rows={rows}
              selectedProviders={selectedProviders}
              visibleCharts={visibleCharts}
            />
          </>
        ) : null}

        <footer className="mt-10 xl:mt-14 border-t border-nd-border-light pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between font-brand-mono text-[12px] md:text-[14px] leading-[1.42] uppercase text-nd-mid-em-text">
          <span>
            {selectedProviderList.length === providers.length
              ? t("footer.allProviders")
              : selectedProviderList.join(t("footer.providerListSeparator"))}
            <span className="mx-3 text-nd-border-prominent">·</span>
            {t("footer.lastDays", { days: rangeDays })}
          </span>
          {data?.generatedAt ? (
            <span>
              {t("footer.updated")}{" "}
              <span className="text-nd-high-em-text">
                {formatTimestamp(data.generatedAt, locale)}
              </span>
            </span>
          ) : null}
        </footer>
      </div>
    </main>
  );
}

function DashboardControls({
  activeTab,
  onUpdateQuery,
  rangeDays,
  selectedProviders,
  showProviderControls,
}: {
  activeTab: DashboardTab;
  onUpdateQuery: (_updates: QueryUpdates) => void;
  rangeDays: number;
  selectedProviders: Set<ProviderName>;
  showProviderControls: boolean;
}) {
  const t = useTranslations("dataDashboard");
  const translatedTabOptions = tabOptions.map((option) => ({
    label: t(option.labelKey),
    value: option.value,
  }));

  return (
    <div className="px-5 md:px-8 xl:px-10 py-2.5 grid gap-2 xl:flex xl:items-center xl:justify-between">
      <div className="-mx-1 flex items-center gap-x-4 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <InlineControl
          ariaLabel={t("controls.tabsAriaLabel")}
          options={translatedTabOptions}
          value={activeTab}
          onChange={(value) => onUpdateQuery({ tab: value })}
        />
        <Separator />
        <InlineControl
          ariaLabel={t("controls.rangeAriaLabel")}
          options={rangeOptions}
          value={rangeDays}
          onChange={(value) => onUpdateQuery({ days: value })}
        />
      </div>

      {showProviderControls ? (
        <ProviderControls
          selectedProviders={selectedProviders}
          onChange={(nextProviders) =>
            onUpdateQuery({ providers: nextProviders })
          }
        />
      ) : null}
    </div>
  );
}

function ProviderControls({
  onChange,
  selectedProviders,
}: {
  onChange: (_providers: Set<ProviderName>) => void;
  selectedProviders: Set<ProviderName>;
}) {
  const t = useTranslations("dataDashboard");

  return (
    <div className="-mx-1 flex items-center gap-x-3 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text/70">
        {t("controls.providersLabel")}
      </span>
      <ProviderToggle
        active={selectedProviders.size === providers.length}
        label={t("controls.allProviders")}
        onClick={() => onChange(new Set(providers))}
      />
      {providers.map((provider) => (
        <ProviderToggle
          active={selectedProviders.has(provider)}
          color={providerColors[provider]}
          key={provider}
          label={provider}
          onClick={() => onChange(toggleProvider(selectedProviders, provider))}
        />
      ))}
    </div>
  );
}

function KpiGrid({
  isLoading,
  isRefreshing,
  kpis,
}: {
  isLoading: boolean;
  isRefreshing: boolean;
  kpis: KpiItem[];
}) {
  const locale = useLocale();
  const t = useTranslations("dataDashboard");

  return (
    <section
      aria-label={t("kpisAriaLabel")}
      className={cn(
        "mt-10 xl:mt-14 border-y border-nd-border-light relative",
        "before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-gradient-to-b before:from-[#D884F0] before:to-[#44EBA6]",
        "grid grid-cols-2 xl:grid-cols-4 divide-nd-border-light",
        "[&>*]:border-nd-border-light",
        isRefreshing ? "opacity-75" : "",
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
              unit={getValueLabel(t, kpi.chart.valueLabel)}
              value={formatValue(kpi.value, kpi.chart.valueLabel, locale)}
            />
          ))}
    </section>
  );
}

function ChartGrid({
  activeCharts,
  activeTab,
  isLoading,
  isRefreshing,
  rows,
  selectedProviders,
  visibleCharts,
}: {
  activeCharts: readonly ChartDefinition[];
  activeTab: DashboardTab;
  isLoading: boolean;
  isRefreshing: boolean;
  rows: MetricRow[];
  selectedProviders: Set<ProviderName>;
  visibleCharts: readonly ChartDefinition[];
}) {
  const t = useTranslations("dataDashboard");

  return (
    <section
      aria-label={t("chartsAriaLabel", {
        tab: getTabContent(t, activeTab).label,
      })}
      className={cn(
        "border-x border-b border-nd-border-light grid grid-cols-1 lg:grid-cols-2 divide-y divide-nd-border-light lg:divide-y-0",
        "[&>*]:border-nd-border-light lg:[&>*:nth-child(even)]:border-l lg:[&>*:nth-child(n+3)]:border-t",
        isRefreshing ? "opacity-75" : "",
      )}
    >
      {isLoading
        ? activeCharts.map((chart, index) => (
            <ChartSkeleton
              index={index}
              key={chart.id}
              title={getChartTitle(t, chart)}
            />
          ))
        : visibleCharts.map((chart, index) => (
            <ChartCard
              chart={chart}
              index={index}
              key={chart.id}
              rows={rows}
              selectedProviders={selectedProviders}
            />
          ))}
    </section>
  );
}

function ChartCard({
  chart,
  index,
  rows,
  selectedProviders,
}: {
  chart: ChartDefinition;
  index: number;
  rows: MetricRow[];
  selectedProviders: Set<ProviderName>;
}) {
  const t = useTranslations("dataDashboard");
  const series = useMemo(
    () => buildSeries(chart, rows, selectedProviders),
    [chart, rows, selectedProviders],
  );
  const valueLabel = getValueLabel(t, chart.valueLabel);

  return (
    <article className="p-6 xl:p-8 flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[20px] xl:text-[24px] leading-[1.25] font-medium tracking-normal">
          {getChartTitle(t, chart)}
        </h2>
        <span className="font-brand-mono text-[12px] leading-[1.42] font-bold uppercase text-nd-mid-em-text shrink-0">
          {valueLabel}
        </span>
      </div>

      {series.length > 0 ? (
        <TimeSeriesChart
          height={chartHeight}
          series={series}
          valueLabel={chart.valueLabel}
        />
      ) : (
        <div className="flex h-[320px] items-center justify-center border border-dashed border-nd-border-light text-sm text-nd-mid-em-text font-brand-mono uppercase tracking-normal">
          {t("empty.noDataForSelection")}
        </div>
      )}

      <ChartOrdinal index={index} />
    </article>
  );
}

function KpiCell({
  delta,
  index,
  label,
  unit,
  value,
}: {
  delta: number;
  index: number;
  label: string;
  unit: string;
  value: string;
}) {
  const locale = useLocale();

  return (
    <article className={getKpiCellClassName(index)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-brand-mono text-[12px] md:text-[14px] leading-[1.42] font-bold uppercase text-nd-mid-em-text">
          {label}
        </h2>
        <span className="font-brand-mono text-[10px] leading-none uppercase text-nd-mid-em-text/60 tracking-normal">
          {unit}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="text-[28px] xl:text-[40px] leading-[1.0] font-light uppercase tabular-nums tracking-normal text-nd-high-em-text">
          {value}
        </p>
        <p
          className={cn(
            "font-brand-mono text-[12px] md:text-[14px] leading-[1.42] font-bold uppercase tabular-nums",
            delta >= 0 ? "text-nd-highlight-green" : "text-nd-highlight-orange",
          )}
        >
          {delta >= 0 ? "↑" : "↓"} {formatPercent(Math.abs(delta), locale)}
        </p>
      </div>
    </article>
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

function ChartSkeleton({ index, title }: { index: number; title: string }) {
  return (
    <article className="p-6 xl:p-8 flex flex-col gap-5">
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

function DataError({ error }: { error: Error }) {
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

function Separator() {
  return (
    <span
      aria-hidden="true"
      className="hidden md:inline-block h-3 w-px shrink-0 bg-nd-border-prominent"
    />
  );
}

function InlineControl<T extends string | number>({
  ariaLabel,
  onChange,
  options,
  value,
}: {
  ariaLabel: string;
  onChange: (_value: T) => void;
  options: readonly { label: string; value: T }[];
  value: T;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className="inline-flex shrink-0 items-center gap-1.5"
      role="group"
    >
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          className={cn(
            "border px-2.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase transition-colors",
            option.value === value
              ? "border-nd-primary bg-nd-border-light/20 text-nd-high-em-text"
              : "border-nd-border-prominent text-nd-mid-em-text hover:bg-nd-border-light/20 hover:text-nd-high-em-text",
          )}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ProviderToggle({
  active,
  color,
  label,
  onClick,
}: {
  active: boolean;
  color?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 px-1.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase transition-colors",
        active
          ? "text-nd-high-em-text"
          : "text-nd-mid-em-text/60 hover:text-nd-high-em-text",
      )}
      onClick={onClick}
      type="button"
    >
      {color ? (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5"
          style={{ backgroundColor: active ? color : `${color}40` }}
        />
      ) : null}
      {label}
    </button>
  );
}

function useDashboardQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const providerParam = searchParams.get("providers");
  const selectedProviders = useMemo(
    () => parseProviders(providerParam),
    [providerParam],
  );
  const selectedProviderList = useMemo(
    () => getOrderedSelectedProviders(selectedProviders),
    [selectedProviders],
  );

  const updateQuery = useCallback(
    (updates: QueryUpdates) => {
      const params = new URLSearchParams(searchParams.toString());

      applyQueryUpdates(params, updates);
      router.replace(getDashboardUrl(pathname, params), { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return {
    activeTab: parseTab(searchParams.get("tab")),
    rangeDays: parseRangeDays(searchParams.get("days")),
    selectedProviderList,
    selectedProviders,
    updateQuery,
  };
}

function applyQueryUpdates(params: URLSearchParams, updates: QueryUpdates) {
  if (updates.tab) {
    params.set("tab", updates.tab);
  }

  if (updates.days) {
    params.set("days", String(updates.days));
  }

  if (updates.providers) {
    updateProvidersParam(params, updates.providers);
  }
}

function updateProvidersParam(
  params: URLSearchParams,
  selectedProviders: Set<ProviderName>,
) {
  const nextProviders = getOrderedSelectedProviders(selectedProviders);

  if (nextProviders.length === 0 || nextProviders.length === providers.length) {
    params.delete("providers");
  } else {
    params.set("providers", nextProviders.join(","));
  }
}

function getDashboardUrl(pathname: string, params: URLSearchParams) {
  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

function toggleProvider(
  selectedProviders: Set<ProviderName>,
  provider: ProviderName,
) {
  const nextProviders = new Set(selectedProviders);

  if (nextProviders.has(provider)) {
    nextProviders.delete(provider);
  } else {
    nextProviders.add(provider);
  }

  if (nextProviders.size === 0) {
    nextProviders.add(provider);
  }

  return nextProviders;
}

function getOrderedSelectedProviders(
  selectedProviders: ReadonlySet<ProviderName>,
) {
  return providers.filter((provider) => selectedProviders.has(provider));
}

function getChartsForTab(tab: DashboardTab) {
  return chartDefinitions.filter((chart) => chart.tab === tab);
}

function getVisibleCharts(
  activeCharts: readonly ChartDefinition[],
  rows: MetricRow[],
) {
  return rows.length > 0
    ? activeCharts.filter((chart) => hasChartSourceData(chart, rows))
    : activeCharts;
}

function getKpis(
  charts: readonly ChartDefinition[],
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
): KpiItem[] {
  return charts.slice(0, kpiCount).map((chart) => ({
    chart,
    ...getKpiValue(chart, rows, selectedProviders),
  }));
}

function getKpiCellClassName(index: number) {
  return cn(
    "py-6 px-5 md:py-8 md:px-8 xl:py-10 xl:px-10 flex flex-col gap-5 border-nd-border-light",
    index > 0 ? "border-l" : "",
    index >= 2 ? "border-t xl:border-t-0" : "",
    index === 2 ? "xl:border-l" : "",
  );
}

function hasChartSourceData(chart: ChartDefinition, rows: MetricRow[]) {
  const metricSet = new Set<string>(chart.metrics);
  const chartProviderSet = new Set<ProviderName>(getChartProviders(chart));

  return rows.some((row) => isChartDataRow(row, metricSet, chartProviderSet));
}

function buildSeries(
  chart: ChartDefinition,
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
): ChartSeries[] {
  const metricSet = new Set<string>(chart.metrics);
  const chartProviders = getChartProviders(chart);
  const chartProviderSet = new Set<ProviderName>(chartProviders);
  const buckets = new Map<
    string,
    Map<string, { color: string; count: number; label: string; sum: number }>
  >();

  for (const row of rows) {
    if (
      !isChartDataRow(row, metricSet, chartProviderSet) ||
      !selectedProviders.has(row.providerName)
    ) {
      continue;
    }

    const seriesId =
      chart.seriesField === "provider" ? row.providerName : row.metricName;
    const seriesLabel = seriesId;
    const color =
      chart.seriesField === "provider"
        ? providerColors[row.providerName]
        : (metricColors[row.metricName] ?? "#A78BFA");
    const seriesBucket = buckets.get(seriesId) ?? new Map();
    const bucket = seriesBucket.get(row.date) ?? {
      color,
      count: 0,
      label: seriesLabel,
      sum: 0,
    };

    bucket.sum += row.value;
    bucket.count += 1;
    seriesBucket.set(row.date, bucket);
    buckets.set(seriesId, seriesBucket);
  }

  const orderedSeriesIds =
    chart.seriesField === "provider"
      ? chartProviders.filter((provider) => buckets.has(provider))
      : chart.metrics.filter((metric) => buckets.has(metric));

  return orderedSeriesIds.map((seriesId) => {
    const seriesBucket = buckets.get(seriesId) ?? new Map();

    return {
      id: seriesId,
      label: seriesId,
      color:
        chart.seriesField === "provider" && isProviderName(seriesId)
          ? providerColors[seriesId]
          : (metricColors[seriesId] ?? "#A78BFA"),
      points: Array.from(seriesBucket.entries())
        .map(([date, bucket]) => ({
          date: new Date(`${date}T00:00:00.000Z`),
          value: aggregate(bucket.sum, bucket.count, chart.aggregation),
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    };
  });
}

function getChartProviders(chart: ChartDefinition) {
  return chart.providers ?? providers;
}

function isChartDataRow(
  row: MetricRow,
  metricSet: ReadonlySet<string>,
  chartProviderSet: ReadonlySet<ProviderName>,
): row is MetricRow & { providerName: ProviderName } {
  return (
    metricSet.has(row.metricName) &&
    isProviderName(row.providerName) &&
    chartProviderSet.has(row.providerName)
  );
}

function getKpiValue(
  chart: ChartDefinition,
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
) {
  const series = buildSeries(chart, rows, selectedProviders);
  const dates = Array.from(
    new Set(
      series.flatMap((item) =>
        item.points.map((point) => point.date.getTime()),
      ),
    ),
  ).sort((a, b) => a - b);
  const latestDate = dates.at(-1);
  const previousDate = dates.at(-2);
  const latestValue = latestDate
    ? getAggregateSeriesValue(series, latestDate, chart.seriesField)
    : 0;
  const previousValue = previousDate
    ? getAggregateSeriesValue(series, previousDate, chart.seriesField)
    : latestValue;

  return {
    value: latestValue,
    delta:
      previousValue === 0 ? 0 : (latestValue - previousValue) / previousValue,
  };
}

function getAggregateSeriesValue(
  series: ChartSeries[],
  date: number,
  seriesField: ChartDefinition["seriesField"],
) {
  const values = series
    .map(
      (item) =>
        item.points.find((point) => point.date.getTime() === date)?.value,
    )
    .filter((value): value is number => typeof value === "number");

  if (values.length === 0) {
    return 0;
  }

  if (seriesField === "provider") {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  return values.reduce((sum, value) => sum + value, 0);
}

function aggregate(sum: number, count: number, aggregation: Aggregation) {
  return aggregation === "avg" && count > 0 ? sum / count : sum;
}

async function fetchData(url: string, errorMessages: DataFetchErrorMessages) {
  const response = await fetch(url, { cache: "no-store" });
  const payload = await readDataPayload(response, errorMessages);

  if (!response.ok) {
    throw new Error(getDataFetchErrorMessage(payload, errorMessages));
  }

  if (!isDataApiResponse(payload)) {
    throw new Error(errorMessages.invalidResponse);
  }

  return payload;
}

async function readDataPayload(
  response: Response,
  errorMessages: DataFetchErrorMessages,
) {
  try {
    return (await response.json()) as DataErrorPayload | DataApiResponse | null;
  } catch {
    if (response.ok) {
      throw new Error(errorMessages.invalidResponse);
    }

    return null;
  }
}

function getDataFetchErrorMessage(
  payload: DataErrorPayload | DataApiResponse | null,
  errorMessages: DataFetchErrorMessages,
) {
  if (payload && "detail" in payload && payload.detail) {
    return `${errorMessages.defaultUnavailable} ${payload.detail}`;
  }

  return errorMessages.defaultUnavailable;
}

function isDataApiResponse(value: unknown): value is DataApiResponse {
  return (
    !!value &&
    typeof value === "object" &&
    "rows" in value &&
    Array.isArray(value.rows)
  );
}

function useMinWidth(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => mediaQuery.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
}

function parseTab(value: string | null): DashboardTab {
  return value === "stablecoins" || value === "defi" ? value : "overview";
}

function parseRangeDays(value: string | null) {
  const parsed = value ? Number(value) : defaultRangeDays;
  return rangeOptions.some((option) => option.value === parsed)
    ? parsed
    : defaultRangeDays;
}

function parseProviders(value: string | null) {
  if (!value) {
    return new Set(defaultProviders);
  }

  const parsedProviders = value
    .split(",")
    .filter((provider): provider is ProviderName => isProviderName(provider));

  return parsedProviders.length > 0
    ? new Set(parsedProviders)
    : new Set(defaultProviders);
}

function isProviderName(value: string): value is ProviderName {
  return providers.includes(value as ProviderName);
}

function formatPercent(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value);
}

function formatTimestamp(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getTabContent(t: DashboardTranslator, tab: DashboardTab) {
  return {
    label: t(`tabs.${tab}.label`),
    description: t(`tabs.${tab}.description`),
  };
}

function getChartTitle(t: DashboardTranslator, chart: ChartDefinition) {
  const titleKey = `charts.${chart.id}.title`;

  return t.has(titleKey) ? t(titleKey) : chart.title;
}

function getValueLabel(t: DashboardTranslator, valueLabel: string) {
  switch (valueLabel) {
    case "Count":
      return t("valueLabels.count");
    case "Compute Units":
      return t("valueLabels.computeUnits");
    case "Fees (SOL)":
      return t("valueLabels.feesSol");
    case "USD":
      return t("valueLabels.usd");
    default:
      return valueLabel;
  }
}
