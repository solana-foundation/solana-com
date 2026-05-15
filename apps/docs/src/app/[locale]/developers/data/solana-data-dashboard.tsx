"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

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

const tabs = [
  { label: "Stablecoins", value: "stablecoins" },
  { label: "Overview", value: "overview" },
] as const;

const defaultProviders = new Set<ProviderName>(providers);
const defaultRangeDays = 90;
const emptyRows: MetricRow[] = [];

export function SolanaDataDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = parseTab(searchParams.get("tab"));
  const rangeDays = parseRangeDays(searchParams.get("days"));
  const selectedProviders = parseProviders(searchParams.get("providers"));
  const selectedProviderList = providers.filter((provider) =>
    selectedProviders.has(provider),
  );
  const dataUrl = `/api/databricks/data?days=${rangeDays}`;
  const { data, error, isLoading, isValidating } = useSWR<DataApiResponse>(
    dataUrl,
    fetchData,
    {
      keepPreviousData: true,
      refreshInterval: 5 * 60 * 1000,
    },
  );
  const rows = data?.rows ?? emptyRows;
  const activeCharts = chartDefinitions.filter(
    (chart) => chart.tab === activeTab,
  );
  const kpis = useMemo(
    () =>
      activeCharts.slice(0, 4).map((chart) => ({
        chart,
        ...getKpiValue(chart, rows, selectedProviders),
      })),
    [activeCharts, rows, selectedProviders],
  );

  const updateQuery = (updates: {
    days?: number;
    providers?: Set<ProviderName>;
    tab?: DashboardTab;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.tab) {
      params.set("tab", updates.tab);
    }

    if (updates.days) {
      params.set("days", String(updates.days));
    }

    if (updates.providers) {
      const nextProviders = providers.filter((provider) =>
        updates.providers?.has(provider),
      );

      if (nextProviders.length === providers.length) {
        params.delete("providers");
      } else {
        params.set("providers", nextProviders.join(","));
      }
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text font-brand">
      <div className="max-w-screen-2xl w-full mx-auto px-5 md:px-8 xl:px-10 py-10 xl:py-16">
        <header>
          <div>
            <span className="font-brand-mono text-[11px] md:text-[12px] leading-[1.42] font-bold uppercase text-nd-mid-em-text inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-nd-highlight-green"
              />
              Live network data
            </span>
            <h1 className="nd-heading-l mt-3">Solana data</h1>
            <p className="nd-body-m text-nd-mid-em-text mt-3 max-w-[560px]">
              Network and stablecoin metrics, sourced live from leading on-chain
              providers.
            </p>
          </div>

          <div
            aria-label="Controls"
            className="sticky top-[64px] z-30 mt-6 -mx-5 md:-mx-8 xl:-mx-10 bg-nd-inverse/85 backdrop-blur-md border-y border-nd-border-light"
          >
            <div className="px-5 md:px-8 xl:px-10 py-2.5 flex flex-wrap items-center justify-between gap-x-5 gap-y-1">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <InlineControl
                  ariaLabel="Data section"
                  options={tabs}
                  value={activeTab}
                  onChange={(value) => updateQuery({ tab: value })}
                />
                <Separator />
                <InlineControl
                  ariaLabel="Date range"
                  options={rangeOptions}
                  value={rangeDays}
                  onChange={(value) => updateQuery({ days: value })}
                />
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-brand-mono text-[11px] leading-[1.42] font-bold uppercase text-nd-mid-em-text/70">
                  Providers
                </span>
                <ProviderToggle
                  active={selectedProviders.size === providers.length}
                  label="All"
                  onClick={() => updateQuery({ providers: new Set(providers) })}
                />
                {providers.map((provider) => (
                  <ProviderToggle
                    active={selectedProviders.has(provider)}
                    color={providerColors[provider]}
                    key={provider}
                    label={provider}
                    onClick={() => {
                      const nextProviders = new Set(selectedProviders);

                      if (nextProviders.has(provider)) {
                        nextProviders.delete(provider);
                      } else {
                        nextProviders.add(provider);
                      }

                      if (nextProviders.size === 0) {
                        nextProviders.add(provider);
                      }

                      updateQuery({ providers: nextProviders });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </header>

        {error ? <DataError error={error} /> : null}

        {!error ? (
          <>
            <section
              aria-label="Key metrics"
              className={cn(
                "mt-10 xl:mt-14 border-y border-nd-border-light relative",
                "before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-gradient-to-b before:from-[#D884F0] before:to-[#44EBA6]",
                "grid grid-cols-2 xl:grid-cols-4 divide-nd-border-light",
                "[&>*]:border-nd-border-light",
                isValidating && rows.length > 0 ? "opacity-75" : "",
              )}
            >
              {isLoading && rows.length === 0
                ? Array.from({ length: 4 }).map((_, index) => (
                    <KpiSkeleton index={index} key={index} />
                  ))
                : kpis.map((kpi, index) => (
                    <KpiCell
                      delta={kpi.delta}
                      index={index}
                      key={kpi.chart.id}
                      label={kpi.chart.title}
                      unit={kpi.chart.valueLabel}
                      value={formatValue(kpi.value, kpi.chart.valueLabel)}
                    />
                  ))}
            </section>

            <section
              aria-label={`${activeTab} charts`}
              className={cn(
                "border-x border-b border-nd-border-light grid grid-cols-1 lg:grid-cols-2 divide-y divide-nd-border-light lg:divide-y-0",
                "[&>*]:border-nd-border-light lg:[&>*:nth-child(even)]:border-l lg:[&>*:nth-child(n+3)]:border-t",
                isValidating && rows.length > 0 ? "opacity-75" : "",
              )}
            >
              {isLoading && rows.length === 0
                ? activeCharts.map((chart, index) => (
                    <ChartSkeleton
                      index={index}
                      key={chart.id}
                      title={chart.title}
                    />
                  ))
                : activeCharts.map((chart, index) => (
                    <ChartCard
                      chart={chart}
                      index={index}
                      key={chart.id}
                      rows={rows}
                      selectedProviders={selectedProviders}
                    />
                  ))}
            </section>
          </>
        ) : null}

        <footer className="mt-10 xl:mt-14 border-t border-nd-border-light pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between font-brand-mono text-[12px] md:text-[14px] leading-[1.42] uppercase text-nd-mid-em-text">
          <span>
            {selectedProviderList.length === providers.length
              ? "All providers"
              : selectedProviderList.join(" / ")}
            <span className="mx-3 text-nd-border-prominent">·</span>
            Last {rangeDays} days
          </span>
          {data?.revisionCreatedAt ? (
            <span>
              Databricks rev{" "}
              <span className="text-nd-high-em-text">
                {formatTimestamp(data.revisionCreatedAt)}
              </span>
            </span>
          ) : null}
        </footer>
      </div>
    </main>
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
  const series = useMemo(
    () => buildSeries(chart, rows, selectedProviders),
    [chart, rows, selectedProviders],
  );

  return (
    <article className="p-6 xl:p-8 flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[20px] xl:text-[24px] leading-[1.25] font-medium tracking-[-0.4px] xl:tracking-[-0.48px]">
          {chart.title}
        </h2>
        <span className="font-brand-mono text-[12px] leading-[1.42] font-bold uppercase text-nd-mid-em-text shrink-0">
          {chart.valueLabel}
        </span>
      </div>

      {series.length > 0 ? (
        <TimeSeriesChart
          height={320}
          series={series}
          valueLabel={chart.valueLabel}
        />
      ) : (
        <div className="flex h-[320px] items-center justify-center border border-dashed border-nd-border-light text-sm text-nd-mid-em-text font-brand-mono uppercase tracking-wider">
          No data for this selection
        </div>
      )}

      <span
        aria-hidden="true"
        className="font-brand-mono text-[10px] leading-none font-bold uppercase text-nd-mid-em-text/60 tracking-[0.1em]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
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
  return (
    <article
      className={cn(
        "py-6 px-5 md:py-8 md:px-8 xl:py-10 xl:px-10 flex flex-col gap-5 border-nd-border-light",
        index > 0 ? "border-l" : "",
        index >= 2 ? "border-t xl:border-t-0" : "",
        index === 2 ? "xl:border-l" : "",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-brand-mono text-[12px] md:text-[14px] leading-[1.42] font-bold uppercase text-nd-mid-em-text">
          {label}
        </h2>
        <span className="font-brand-mono text-[10px] leading-none uppercase text-nd-mid-em-text/60 tracking-[0.1em]">
          {unit}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="text-[28px] xl:text-[40px] leading-[1.0] font-light uppercase tabular-nums tracking-[-0.02em] text-nd-high-em-text">
          {value}
        </p>
        <p
          className={cn(
            "font-brand-mono text-[12px] md:text-[14px] leading-[1.42] font-bold uppercase tabular-nums",
            delta >= 0 ? "text-nd-highlight-green" : "text-nd-highlight-orange",
          )}
        >
          {delta >= 0 ? "↑" : "↓"} {formatPercent(Math.abs(delta))}
        </p>
      </div>
    </article>
  );
}

function KpiSkeleton({ index }: { index: number }) {
  return (
    <div
      className={cn(
        "py-6 px-5 md:py-8 md:px-8 xl:py-10 xl:px-10 flex flex-col gap-5 border-nd-border-light",
        index > 0 ? "border-l" : "",
        index >= 2 ? "border-t xl:border-t-0" : "",
        index === 2 ? "xl:border-l" : "",
      )}
    >
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
      <span
        aria-hidden="true"
        className="font-brand-mono text-[10px] leading-none font-bold uppercase text-nd-mid-em-text/60 tracking-[0.1em]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </article>
  );
}

function DataError({ error }: { error: Error }) {
  return (
    <section
      className="mt-10 border border-nd-highlight-orange/40 bg-nd-highlight-orange/10 p-6 text-sm text-nd-high-em-text"
      role="alert"
    >
      <h2 className="font-brand-mono text-[12px] leading-[1.42] font-bold uppercase text-nd-highlight-orange">
        Data unavailable
      </h2>
      <p className="mt-3 nd-body-m text-nd-mid-em-text">{error.message}</p>
    </section>
  );
}

function Separator() {
  return (
    <span
      aria-hidden="true"
      className="hidden md:inline-block h-3 w-px bg-nd-border-prominent"
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
      className="inline-flex items-center gap-1"
      role="group"
    >
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          className={cn(
            "px-2 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase transition-colors",
            option.value === value
              ? "bg-nd-primary text-nd-on-primary"
              : "text-nd-mid-em-text hover:text-nd-high-em-text",
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
        "inline-flex items-center gap-1.5 px-1.5 py-1 font-brand-mono text-[11px] leading-[1.42] font-bold uppercase transition-colors",
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

function buildSeries(
  chart: ChartDefinition,
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
): ChartSeries[] {
  const metricSet = new Set<string>(chart.metrics);
  const buckets = new Map<
    string,
    Map<string, { color: string; count: number; label: string; sum: number }>
  >();

  for (const row of rows) {
    if (
      !metricSet.has(row.metricName) ||
      !isProviderName(row.providerName) ||
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
      ? providers.filter((provider) => buckets.has(provider))
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

async function fetchData(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const payload = (await response.json().catch(() => null)) as
    | { detail?: string; error?: string }
    | DataApiResponse
    | null;

  if (!response.ok) {
    throw new Error(
      payload && "error" in payload && payload.error
        ? payload.detail
          ? `${payload.error} ${payload.detail}`
          : payload.error
        : "Solana data is unavailable right now.",
    );
  }

  return payload as DataApiResponse;
}

function parseTab(value: string | null): DashboardTab {
  return value === "overview" ? "overview" : "stablecoins";
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

function formatPercent(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value);
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
