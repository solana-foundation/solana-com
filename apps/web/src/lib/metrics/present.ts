import "server-only";

import { getLocale, getTranslations } from "next-intl/server";
import { formatMetricValue } from "./format";
import { loadMetrics, type MetricStatus } from "./loader";
import type { MetricKey } from "./registry";

/** Serializable metric ready for a client component. */
export type DisplayMetric = {
  key: MetricKey;
  value: string;
  status: MetricStatus;
  source: {
    name: string;
    href: string;
    /** Localized reporting period, e.g. "30 days to Oct 29, 2026". */
    period: string;
  };
};

export async function getDisplayMetrics<const K extends MetricKey>(
  keys: readonly K[],
): Promise<Record<K, DisplayMetric>> {
  const [locale, t, metrics] = await Promise.all([
    getLocale(),
    getTranslations("metrics"),
    loadMetrics(keys),
  ]);

  return Object.fromEntries(
    keys.map((key) => {
      const metric = metrics[key];
      const { period, source, unit } = metric.definition;
      const date = new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(new Date(`${metric.asOf}T00:00:00Z`));

      return [
        key,
        {
          key,
          value: formatMetricValue(metric.value, unit, locale),
          status: metric.status,
          source: {
            name: source.name,
            href: source.url,
            period:
              period.kind === "point"
                ? t("period.asOf", { date })
                : period.days === 365
                  ? t("period.trailingYear", { date })
                  : t("period.trailingDays", { days: period.days, date }),
          },
        } satisfies DisplayMetric,
      ];
    }),
  ) as Record<K, DisplayMetric>;
}
