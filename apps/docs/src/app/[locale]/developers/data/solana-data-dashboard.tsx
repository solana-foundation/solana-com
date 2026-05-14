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
    <main className="min-h-screen bg-zinc-50 text-zinc-950 transition-colors dark:bg-[#050506] dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-zinc-200 pb-5 dark:border-zinc-800/80 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
              Solana data
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Live network and stablecoin metrics.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center xl:justify-end">
            <SegmentedControl
              ariaLabel="Data section"
              options={tabs}
              value={activeTab}
              onChange={(value) => updateQuery({ tab: value })}
            />
            <SegmentedControl
              ariaLabel="Date range"
              options={rangeOptions}
              value={rangeDays}
              onChange={(value) => updateQuery({ days: value })}
            />
          </div>
        </header>

        <section
          aria-label="Providers"
          className="flex flex-wrap items-center gap-2"
        >
          <span className="mr-1 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-500">
            Provider
          </span>
          <ProviderButton
            active={selectedProviders.size === providers.length}
            label="All"
            onClick={() => updateQuery({ providers: new Set(providers) })}
          />
          {providers.map((provider) => (
            <ProviderButton
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
        </section>

        {error ? <DataError error={error} /> : null}

        {!error ? (
          <>
            <section
              aria-label="Key metrics"
              className={cn(
                "grid grid-cols-2 gap-3 xl:grid-cols-4",
                isValidating && rows.length > 0 ? "opacity-75" : "",
              )}
            >
              {isLoading && rows.length === 0
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      className="h-[112px] animate-pulse rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                      key={index}
                    />
                  ))
                : kpis.map((kpi) => (
                    <KpiCard
                      delta={kpi.delta}
                      key={kpi.chart.id}
                      label={kpi.chart.title}
                      value={formatValue(kpi.value, kpi.chart.valueLabel)}
                    />
                  ))}
            </section>

            <section
              aria-label={`${activeTab} charts`}
              className={cn(
                "grid gap-4 lg:grid-cols-2",
                isValidating && rows.length > 0 ? "opacity-75" : "",
              )}
            >
              {isLoading && rows.length === 0
                ? activeCharts.map((chart) => (
                    <ChartSkeleton key={chart.id} title={chart.title} />
                  ))
                : activeCharts.map((chart) => (
                    <ChartCard
                      chart={chart}
                      key={chart.id}
                      rows={rows}
                      selectedProviders={selectedProviders}
                    />
                  ))}
            </section>
          </>
        ) : null}

        <footer className="flex flex-col gap-1 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {selectedProviderList.length === providers.length
              ? "All providers"
              : selectedProviderList.join(", ")}
            {" · "}
            Last {rangeDays} days
          </span>
          {data?.revisionCreatedAt ? (
            <span>
              Databricks revision {formatTimestamp(data.revisionCreatedAt)}
            </span>
          ) : null}
        </footer>
      </div>
    </main>
  );
}

function ChartCard({
  chart,
  rows,
  selectedProviders,
}: {
  chart: ChartDefinition;
  rows: MetricRow[];
  selectedProviders: Set<ProviderName>;
}) {
  const series = useMemo(
    () => buildSeries(chart, rows, selectedProviders),
    [chart, rows, selectedProviders],
  );

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-normal text-zinc-900 dark:text-zinc-200">
            {chart.title}
          </h2>
          <p className="mt-1 text-xs font-medium uppercase text-zinc-500 dark:text-zinc-500">
            {chart.valueLabel}
          </p>
        </div>
      </div>

      {series.length > 0 ? (
        <TimeSeriesChart
          height={320}
          series={series}
          valueLabel={chart.valueLabel}
        />
      ) : (
        <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed border-zinc-200 text-sm text-zinc-500 dark:border-zinc-800">
          No data for this selection
        </div>
      )}
    </article>
  );
}

function KpiCard({
  delta,
  label,
  value,
}: {
  delta: number;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors dark:border-zinc-800 dark:bg-zinc-900/80">
      <h2 className="text-[10px] font-semibold uppercase leading-4 tracking-normal text-zinc-500 dark:text-zinc-500 sm:text-xs">
        {label}
      </h2>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-xl font-semibold tabular-nums tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-2xl">
          {value}
        </p>
        <p
          className={cn(
            "text-xs font-semibold tabular-nums",
            delta >= 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400",
          )}
        >
          {delta >= 0 ? "+" : ""}
          {formatPercent(delta)}
        </p>
      </div>
    </article>
  );
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mb-4 h-5 w-40 rounded bg-zinc-100 dark:bg-zinc-800">
        <span className="sr-only">{title}</span>
      </div>
      <div className="h-[352px] animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-950" />
    </article>
  );
}

function DataError({ error }: { error: Error }) {
  return (
    <section
      className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm text-rose-950 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"
      role="alert"
    >
      <h2 className="text-base font-semibold tracking-normal">
        Data unavailable
      </h2>
      <p className="mt-2 leading-6">{error.message}</p>
    </section>
  );
}

function SegmentedControl<T extends string | number>({
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
      className="inline-flex w-fit rounded-md border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-900"
      role="group"
    >
      {options.map((option) => (
        <button
          className={cn(
            "rounded px-3 py-1.5 text-sm font-semibold transition-colors",
            option.value === value
              ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
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

function ProviderButton({
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
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-zinc-300 bg-white text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-500 dark:hover:border-zinc-700",
      )}
      onClick={onClick}
      type="button"
    >
      {color ? (
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
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
