import { getProviderColor } from "./dashboard-providers";
import type {
  SendLandingBucket,
  SendLandingPair,
  SendLandingProviderStats,
} from "./send-landing-config";
import type { ChartSeries, SeriesPoint } from "./time-series-chart";

/** Every value derived per path; the API's raw counts become shares here. */
export const sendLandingMetrics = [
  "rounds",
  "firstOnChain",
  "landed",
  "failed",
  "dropped",
  "indexP50",
  "indexP90",
  "laterSlot",
  "slotsToLand",
  "response",
  "cost",
] as const;
export type SendLandingMetric = (typeof sendLandingMetrics)[number];

/**
 * The columns shown. Failed and dropped sit under Landed instead of in columns
 * of their own, and slots to land (one slot nearly everywhere) is left out, so
 * the table fits a 1280px screen without scrolling.
 */
export const sendLandingTableMetrics = [
  "rounds",
  "firstOnChain",
  "landed",
  "indexP50",
  "indexP90",
  "laterSlot",
  "response",
  "cost",
] as const satisfies readonly SendLandingMetric[];
export type SendLandingTableMetric = (typeof sendLandingTableMetrics)[number];
export type SendLandingSortKey = "provider" | SendLandingMetric;
export type SendLandingTrendMetric = "firstOnChain" | "landed";
export type SortDirection = "ascending" | "descending";

/** Metrics where a higher value is better; the rest rank ascending first. */
const higherIsBetter = new Set<SendLandingSortKey>([
  "rounds",
  "firstOnChain",
  "landed",
]);

export function getDefaultSortDirection(
  key: SendLandingSortKey,
): SortDirection {
  return higherIsBetter.has(key) ? "descending" : "ascending";
}

export type SendLandingProviderItem = {
  provider: string;
  values: Record<SendLandingMetric, number | null>;
  trend: SeriesPoint[];
};

const share = (part: number, whole: number) =>
  whole > 0 ? (part / whole) * 100 : null;

export function getSendLandingProviderItems(
  providers: readonly SendLandingProviderStats[],
  buckets: readonly SendLandingBucket[],
  stepSeconds: number,
): SendLandingProviderItem[] {
  const trends = new Map(
    getSendLandingTrendSeries(
      buckets,
      "firstOnChain",
      new Set(providers.map((item) => item.provider)),
      stepSeconds,
    ).map((series) => [series.id, series.points]),
  );
  return providers.map((stats) => {
    const included = stats.landed + stats.failed;
    return {
      provider: stats.provider,
      values: {
        rounds: stats.rounds,
        firstOnChain: share(stats.firstOnChain, stats.scoredRounds),
        landed: share(stats.landed, stats.rounds),
        failed: share(stats.failed, stats.rounds),
        dropped: share(stats.dropped, stats.rounds),
        indexP50: stats.indexP50,
        indexP90: stats.indexP90,
        laterSlot: share(stats.laterSlot, included),
        slotsToLand: stats.slotsToLandP50,
        response: stats.responseP50Ms,
        cost: included > 0 ? stats.costLamports / included : null,
      },
      trend: trends.get(stats.provider) ?? [],
    };
  });
}

/** Missing values sort last in either direction. */
export function sortSendLandingProviderItems(
  items: readonly SendLandingProviderItem[],
  key: SendLandingSortKey,
  direction: SortDirection,
) {
  const multiplier = direction === "ascending" ? 1 : -1;
  return [...items].sort((a, b) => {
    if (key === "provider")
      return a.provider.localeCompare(b.provider) * multiplier;
    const first = a.values[key];
    const second = b.values[key];
    if (first === null)
      return second === null ? a.provider.localeCompare(b.provider) : 1;
    if (second === null) return -1;
    return (
      (first - second) * multiplier || a.provider.localeCompare(b.provider)
    );
  });
}

export type HeadToHeadCell = {
  otherProvider: string;
  ahead: number;
  rounds: number;
  /** Percent of shared rounds the row's copy landed first; null when none shared. */
  share: number | null;
};

export type HeadToHeadRow = {
  provider: string;
  cells: HeadToHeadCell[];
};

export function getHeadToHeadMatrix(
  pairs: readonly SendLandingPair[],
  providerOrder: readonly string[],
): HeadToHeadRow[] {
  const byPair = new Map(
    pairs.map((pair) => [`${pair.provider}\u0000${pair.otherProvider}`, pair]),
  );
  return providerOrder.map((provider) => ({
    provider,
    cells: providerOrder
      .filter((other) => other !== provider)
      .map((otherProvider) => {
        const pair = byPair.get(`${provider}\u0000${otherProvider}`);
        const ahead = pair?.ahead ?? 0;
        const rounds = pair?.rounds ?? 0;
        return { otherProvider, ahead, rounds, share: share(ahead, rounds) };
      }),
  }));
}

export function getSendLandingTrendSeries(
  buckets: readonly SendLandingBucket[],
  metric: SendLandingTrendMetric,
  providers: ReadonlySet<string>,
  stepSeconds: number,
): ChartSeries[] {
  const values = new Map<string, Map<number, number>>();
  const timestamps = new Set<number>();
  for (const bucket of buckets) {
    if (!providers.has(bucket.provider)) continue;
    const value =
      metric === "firstOnChain"
        ? share(bucket.firstOnChain, bucket.scoredRounds)
        : share(bucket.landed, bucket.rounds);
    const time = bucket.timestamp * 1000;
    timestamps.add(time);
    if (value === null) continue;
    const providerValues = values.get(bucket.provider) ?? new Map();
    providerValues.set(time, value);
    values.set(bucket.provider, providerValues);
  }
  // A run of empty buckets becomes one undefined point, so the line breaks.
  const orderedTimes = [...timestamps].sort((a, b) => a - b);
  const timesWithGaps = orderedTimes.flatMap((time, index) => {
    const next = orderedTimes[index + 1];
    return next !== undefined && next - time > stepSeconds * 1500
      ? [time, time + stepSeconds * 1000]
      : [time];
  });
  return [...values.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([provider, providerValues]) => ({
      id: provider,
      label: provider,
      color: getProviderColor(provider),
      points: timesWithGaps.map((time) => ({
        date: new Date(time),
        value: providerValues.get(time) ?? 0,
        defined: providerValues.has(time),
      })),
    }));
}

export function formatLamportsAsSol(lamports: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumSignificantDigits: 3,
  }).format(lamports / 1e9);
}
