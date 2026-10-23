import type {
  ChartDefinition,
  ChartPeriodView,
  DashboardTab,
} from "./data-config";
import type { DashboardTranslator } from "./dashboard-types";

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
  rangeDays: number,
) {
  if (!chart.periodViews || periodView === "daily") {
    return undefined;
  }

  return periodView === "cumulative"
    ? t("periodViews.captions.cumulative", { days: rangeDays })
    : t(`periodViews.captions.${periodView}.${chart.periodViews.rollup}`);
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
    case "USD":
      return t("valueLabels.usd");
    default:
      return valueLabel;
  }
}
