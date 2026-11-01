import type { MetricUnit } from "./registry";

/**
 * Locale-aware display value. Large values use compact notation with three
 * significant digits so equivalent metrics render identically across pages.
 */
export function formatMetricValue(
  value: number,
  unit: MetricUnit,
  locale: string,
): string {
  if (unit === "ms") {
    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "millisecond",
      unitDisplay: "narrow",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (unit === "usd") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      ...(Math.abs(value) < 1
        ? { maximumSignificantDigits: 2 }
        : { notation: "compact", maximumSignificantDigits: 3 }),
    }).format(value);
  }

  return new Intl.NumberFormat(
    locale,
    Math.abs(value) < 10_000
      ? { maximumFractionDigits: 0 }
      : { notation: "compact", maximumSignificantDigits: 3 },
  ).format(value);
}
