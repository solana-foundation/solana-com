import type { MetricUnit } from "./registry";

/**
 * Formats a compact value with at most one decimal, and none once the
 * locale's compact figure reaches two digits ($3.3B, $15B, $392B). The digit
 * count is read from the formatted parts because compact thresholds differ by
 * locale (for example, Japanese groups by 10,000).
 */
function formatCompact(
  value: number,
  locale: string,
  options: Intl.NumberFormatOptions,
): string {
  const oneDecimal = new Intl.NumberFormat(locale, {
    ...options,
    notation: "compact",
    maximumFractionDigits: 1,
  });
  const integerDigits = oneDecimal
    .formatToParts(value)
    .filter((part) => part.type === "integer")
    .reduce((digits, part) => digits + part.value.length, 0);

  if (integerDigits < 2) return oneDecimal.format(value);

  return new Intl.NumberFormat(locale, {
    ...options,
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Locale-aware display value, so equivalent metrics render identically across
 * pages. Large values use compact notation with at most one decimal.
 */
export function formatMetricValue(
  value: number,
  unit: MetricUnit,
  locale: string,
  /** Round down, for "at least" figures shown with "+" (11.5M+ → 11M+). */
  roundDown = false,
): string {
  const rounding: Intl.NumberFormatOptions = roundDown
    ? { roundingMode: "floor" }
    : {};

  if (unit === "ms") {
    return new Intl.NumberFormat(locale, {
      ...rounding,
      style: "unit",
      unit: "millisecond",
      unitDisplay: "narrow",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (unit === "percent") {
    return new Intl.NumberFormat(locale, {
      ...rounding,
      style: "percent",
      maximumFractionDigits: Math.abs(value) < 10 ? 1 : 0,
    }).format(value / 100);
  }

  if (unit === "bytes") {
    return new Intl.NumberFormat(locale, {
      ...rounding,
      style: "unit",
      unit: "byte",
      unitDisplay: "long",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (unit === "sol" || unit === "wh") {
    // Small per-action amounts: two significant digits (0.009 SOL, 0.0083 Wh).
    const amount = new Intl.NumberFormat(locale, {
      ...rounding,
      maximumSignificantDigits: 2,
    }).format(value);
    return `${amount} ${unit === "sol" ? "SOL" : "Wh"}`;
  }

  if (unit === "kwh") {
    const [scaled, symbol] =
      value >= 1e6
        ? [value / 1e6, "GWh"]
        : value >= 1e3
          ? [value / 1e3, "MWh"]
          : [value, "kWh"];
    return `${new Intl.NumberFormat(locale, {
      ...rounding,
      maximumFractionDigits: scaled < 10 ? 1 : 0,
    }).format(scaled)} ${symbol}`;
  }

  if (unit === "usd") {
    const currency = { style: "currency", currency: "USD" } as const;
    // Sub-dollar values (per-transaction fees) keep one significant digit.
    if (Math.abs(value) < 1) {
      return new Intl.NumberFormat(locale, {
        ...rounding,
        ...currency,
        maximumSignificantDigits: 1,
      }).format(value);
    }
    return formatCompact(value, locale, { ...rounding, ...currency });
  }

  if (Math.abs(value) < 10_000) {
    return new Intl.NumberFormat(locale, {
      ...rounding,
      maximumFractionDigits: 0,
    }).format(value);
  }
  return formatCompact(value, locale, rounding);
}
