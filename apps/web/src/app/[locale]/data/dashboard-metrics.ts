import { cn } from "@/app/components/utils";
import {
  chartDefinitions,
  metricColors,
  type Aggregation,
  type ChartDefinition,
  type DashboardTab,
  type MetricRow,
  type ProviderName,
} from "./data-config";
import { kpiCount } from "./dashboard-constants";
import { getChartTitle } from "./dashboard-copy";
import {
  getOrderedProviderNames,
  getProviderColor,
  getRowProviderName,
} from "./dashboard-providers";
import type {
  KpiAggregation,
  KpiItem,
  DashboardTranslator,
} from "./dashboard-types";
import type { ChartSeries } from "./time-series-chart";

export function getChartsForTab(tab: DashboardTab) {
  const charts = chartDefinitions.filter((chart) => chart.tab === tab);

  if (tab !== "rpc") {
    return charts;
  }

  const rpcChartPriority = [
    "rpc-p95-latency",
    "rpc-p99-latency",
    "rpc-p50-latency",
    "rpc-avg-latency",
    "rpc-error-rate",
  ];

  return charts.sort((a, b) => {
    const aPriority = rpcChartPriority.indexOf(a.id);
    const bPriority = rpcChartPriority.indexOf(b.id);

    return (
      (aPriority === -1 ? rpcChartPriority.length : aPriority) -
      (bPriority === -1 ? rpcChartPriority.length : bPriority)
    );
  });
}

export function getVisibleCharts(
  activeCharts: readonly ChartDefinition[],
  rows: MetricRow[],
) {
  return rows.length > 0
    ? activeCharts.filter((chart) => hasChartSourceData(chart, rows))
    : activeCharts;
}

export function getKpiCharts(
  visibleCharts: readonly ChartDefinition[],
  isRpcTab: boolean,
) {
  return isRpcTab
    ? visibleCharts
        .filter((chart) => chart.valueLabel === "Milliseconds")
        .slice(0, kpiCount)
    : visibleCharts.slice(0, kpiCount);
}

export function filterRowsForCharts(
  rows: readonly MetricRow[],
  charts: readonly ChartDefinition[],
  additionalMetrics: readonly string[] = [],
) {
  const metricSet = new Set([
    ...charts.flatMap((chart) => chart.metrics),
    ...additionalMetrics,
  ]);

  return rows.filter((row) => isChartDataRow(row, metricSet));
}

export function getKpis(
  charts: readonly ChartDefinition[],
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
  aggregation: KpiAggregation,
): KpiItem[] {
  return charts.map((chart) => ({
    chart,
    ...getKpiValue(chart, rows, selectedProviders, aggregation),
  }));
}

export function getKpiSummary(
  t: DashboardTranslator,
  chart: ChartDefinition,
  aggregation: KpiAggregation,
) {
  if (chart.seriesField === "provider") {
    if (aggregation === "minimum") {
      return chart.timeGranularity === "hour"
        ? t("kpis.providerMinimumSampleTooltip")
        : t("kpis.providerMinimumTooltip");
    }

    return chart.timeGranularity === "hour"
      ? t("kpis.providerSampleTooltip")
      : t("kpis.providerTooltip");
  }

  if (chart.metrics.length > 1) {
    return t("kpis.compositeTooltip", {
      metrics: chart.metrics.join(t("kpis.metricListSeparator")),
    });
  }

  return chart.timeGranularity === "hour"
    ? t("kpis.metricSampleTooltip", {
        metric: chart.metrics[0] ?? getChartTitle(t, chart),
      })
    : t("kpis.metricTooltip", {
        metric: chart.metrics[0] ?? getChartTitle(t, chart),
      });
}

export function getKpiCellClassName(index: number) {
  return cn(
    "py-5 px-4 md:py-8 md:px-8 xl:py-10 xl:px-10 flex flex-col gap-5 border-nd-border-light",
    index > 0 ? "border-t" : "",
    index === 1 ? "sm:border-t-0" : "",
    index % 2 === 1 ? "sm:border-l" : "",
    index >= 2 ? "xl:border-t-0" : "",
    index > 0 ? "xl:border-l" : "",
  );
}

function hasChartSourceData(chart: ChartDefinition, rows: MetricRow[]) {
  const metricSet = new Set<string>(chart.metrics);

  return rows.some((row) => isChartDataRow(row, metricSet));
}

export function buildSeries(
  chart: ChartDefinition,
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
): ChartSeries[] {
  const metricSet = new Set<string>(chart.metrics);
  const buckets = new Map<
    string,
    Map<
      string,
      {
        color: string;
        count: number;
        details?: MetricRow["details"];
        label: string;
        sum: number;
      }
    >
  >();

  for (const row of rows) {
    const providerName = getRowProviderName(row);

    if (
      !isChartDataRow(row, metricSet) ||
      !selectedProviders.has(providerName)
    ) {
      continue;
    }

    const seriesId =
      chart.seriesField === "provider" ? providerName : row.metricName;
    const seriesLabel = seriesId;
    const color =
      chart.seriesField === "provider"
        ? getProviderColor(providerName)
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
    bucket.details = row.details ?? bucket.details;
    seriesBucket.set(row.date, bucket);
    buckets.set(seriesId, seriesBucket);
  }

  const orderedSeriesIds =
    chart.seriesField === "provider"
      ? getOrderedProviderNames(Array.from(buckets.keys()))
      : chart.metrics.filter((metric) => buckets.has(metric));

  return orderedSeriesIds.map((seriesId) => {
    const seriesBucket = buckets.get(seriesId) ?? new Map();

    return {
      id: seriesId,
      label: seriesId,
      color:
        chart.seriesField === "provider"
          ? getProviderColor(seriesId)
          : (metricColors[seriesId] ?? "#A78BFA"),
      points: Array.from(seriesBucket.entries())
        .flatMap(([date, bucket]) => {
          const parsedDate = parseMetricRowDate(date);

          return parsedDate
            ? [
                {
                  date: parsedDate,
                  details: bucket.details,
                  value: aggregate(bucket.sum, bucket.count, chart.aggregation),
                },
              ]
            : [];
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    };
  });
}

function parseMetricRowDate(value: string) {
  const parsedDate = value.includes("T")
    ? new Date(value)
    : new Date(`${value}T00:00:00.000Z`);

  return Number.isFinite(parsedDate.getTime()) ? parsedDate : undefined;
}

function isChartDataRow(
  row: MetricRow,
  metricSet: ReadonlySet<string>,
): row is MetricRow & { providerName: ProviderName } {
  return metricSet.has(row.metricName) && getRowProviderName(row).length > 0;
}

export function getKpiValue(
  chart: ChartDefinition,
  rows: MetricRow[],
  selectedProviders: Set<ProviderName>,
  aggregation: KpiAggregation = "median",
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
    ? getAggregateSeriesValue(
        series,
        latestDate,
        chart.seriesField,
        aggregation,
      )
    : 0;
  const previousValue = previousDate
    ? getAggregateSeriesValue(
        series,
        previousDate,
        chart.seriesField,
        aggregation,
      )
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
  aggregation: KpiAggregation,
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
    return aggregation === "minimum" ? Math.min(...values) : getMedian(values);
  }

  return values.reduce((sum, value) => sum + value, 0);
}

export function getMedian(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function aggregate(sum: number, count: number, aggregation: Aggregation) {
  return aggregation === "avg" && count > 0 ? sum / count : sum;
}
