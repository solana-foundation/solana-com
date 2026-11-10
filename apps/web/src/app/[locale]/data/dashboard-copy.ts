import type {
  ChartDefinition,
  ChartPeriodView,
  DashboardTab,
} from "./data-config";
import type { DashboardTranslator } from "./dashboard-types";
import { getRangeDayCount, type DashboardRange } from "./date-range";

export function formatPercent(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value);
}

export function formatTimestamp(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

/** Formats a `YYYY-MM-DD` date, e.g. "Apr 1, 2026", without shifting time zones. */
export function formatRangeDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

/** "Last 90 days" for a preset, "Apr 1, 2026 – Jun 30, 2026" for a custom range. */
export function getRangeLabel(
  t: DashboardTranslator,
  range: DashboardRange,
  locale: string,
) {
  return range.kind === "custom"
    ? t("footer.dateRange", getFormattedRangeDates(range, locale))
    : t("footer.lastDays", { days: range.days });
}

function getFormattedRangeDates(
  range: Extract<DashboardRange, { kind: "custom" }>,
  locale: string,
) {
  return {
    from: formatRangeDate(range.from, locale),
    to: formatRangeDate(range.to, locale),
  };
}

export function getTabContent(t: DashboardTranslator, tab: DashboardTab) {
  return {
    label: t(`tabs.${tab}.label`),
    description: t(`tabs.${tab}.description`),
    clarification: getTabClarification(t, tab),
  };
}

function getTabClarification(t: DashboardTranslator, tab: DashboardTab) {
  const clarificationKey = `tabs.${tab}.clarification`;

  return t.has(clarificationKey) ? t(clarificationKey) : undefined;
}

export function getChartTitle(t: DashboardTranslator, chart: ChartDefinition) {
  const titleKey = `charts.${chart.id}.title`;

  return t.has(titleKey) ? t(titleKey) : chart.title;
}

export function getChartCaption(
  t: DashboardTranslator,
  chart: ChartDefinition,
  values?: Record<string, string>,
) {
  const captionKey = `charts.${chart.id}.caption`;

  return t.has(captionKey) ? t(captionKey, values) : undefined;
}

/** A sentence-case note under the chart title, e.g. a data change. */
export function getChartNote(t: DashboardTranslator, chart: ChartDefinition) {
  const noteKey = `charts.${chart.id}.note`;

  return t.has(noteKey) ? t(noteKey) : undefined;
}

/** Explains how a non-daily view is calculated, e.g. "Weekly total". */
export function getPeriodViewCaption(
  t: DashboardTranslator,
  chart: ChartDefinition,
  periodView: ChartPeriodView,
  range: DashboardRange,
  locale: string,
) {
  if (!chart.periodViews || periodView === "daily") {
    return undefined;
  }

  if (periodView !== "cumulative") {
    return t(`periodViews.captions.${periodView}.${chart.periodViews.rollup}`);
  }

  return range.kind === "custom"
    ? t(
        "periodViews.captions.cumulativeRange",
        getFormattedRangeDates(range, locale),
      )
    : t("periodViews.captions.cumulative", {
        days: getRangeDayCount(range),
      });
}

export function getValueLabel(t: DashboardTranslator, valueLabel: string) {
  switch (valueLabel) {
    case "Count":
      return t("valueLabels.count");
    case "Compute Units":
      return t("valueLabels.computeUnits");
    case "Fees (SOL)":
      return t("valueLabels.feesSol");
    case "Milliseconds":
      return t("valueLabels.milliseconds");
    case "Percent":
      return t("valueLabels.percent");
    case "SOL":
      return t("valueLabels.sol");
    case "TPS":
      return t("valueLabels.tps");
    case "USD":
      return t("valueLabels.usd");
    default:
      return valueLabel;
  }
}
