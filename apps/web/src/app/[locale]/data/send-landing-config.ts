import {
  normalizeRpcRegionParam,
  rpcRegionOptions,
  rpcTimeframeOptions,
  type RpcTimeframe,
} from "./data-config";

// The send benchmark runs about one round a minute, so a bucket shorter than
// 15 minutes holds too few rounds to rank paths. Windows below a day are left
// out. Rows are kept 400 days, so a year is available.
const minimumBucketSeconds = 15 * 60;
const sendLandingTimeframes = ["24h", "7d", "30d", "90d", "1y"] as const;

export type SendLandingTimeframe = (typeof sendLandingTimeframes)[number];
export const defaultSendLandingTimeframe: SendLandingTimeframe = "7d";
export const sendLandingTimeframeOptions = sendLandingTimeframes.map(
  (value) => {
    const option = rpcTimeframeOptions.find((item) => item.value === value)!;
    return {
      label: option.label,
      value,
      durationSeconds: option.durationSeconds,
      stepSeconds: Math.max(option.stepSeconds, minimumBucketSeconds),
    };
  },
);

export const sendLandingRepositoryUrl =
  "https://github.com/Lusitaniae/send-latency-monitor/blob/main/docs/methodology.md";

export type SendLandingProviderStats = {
  provider: string;
  /** Complete rounds in which the path sent a copy. */
  rounds: number;
  landed: number;
  failed: number;
  dropped: number;
  /** Rounds in which the path sent and at least one copy of the round was included. */
  scoredRounds: number;
  firstOnChain: number;
  indexP50: number | null;
  indexP90: number | null;
  /** Included copies that landed in a later slot than the round's first copy. */
  laterSlot: number;
  slotsToLandP50: number | null;
  responseP50Ms: number | null;
  /** Fees and tips paid by included copies. */
  costLamports: number;
};

export type SendLandingPair = {
  provider: string;
  otherProvider: string;
  /** Rounds where both copies were included and `provider` landed first. */
  ahead: number;
  /** Rounds where both copies were included. */
  rounds: number;
};

export type SendLandingBucket = {
  provider: string;
  /** Bucket start, Unix seconds. */
  timestamp: number;
  rounds: number;
  landed: number;
  scoredRounds: number;
  firstOnChain: number;
};

export type SendLandingResponse = {
  generatedAt: string;
  region: string;
  timeframe: SendLandingTimeframe;
  stepSeconds: number;
  rounds: { complete: number; skipped: number };
  providers: SendLandingProviderStats[];
  headToHead: SendLandingPair[];
  buckets: SendLandingBucket[];
};

export type SendLandingFiltersResponse = {
  regions: string[];
  providers: string[];
};

export function getSendLandingTimeframeOption(value: SendLandingTimeframe) {
  return (
    sendLandingTimeframeOptions.find((option) => option.value === value) ??
    sendLandingTimeframeOptions.find(
      (option) => option.value === defaultSendLandingTimeframe,
    )!
  );
}

export function parseSendLandingTimeframe(
  value: string | null | undefined,
): SendLandingTimeframe {
  return (
    sendLandingTimeframeOptions.find((option) => option.value === value)
      ?.value ?? defaultSendLandingTimeframe
  );
}

/**
 * The landing section follows the page's time frame. Windows under a day hold
 * too few rounds to rank paths, so they are raised to 24h and `raised` says so.
 */
export function getSendLandingTimeframeForPage(pageTimeframe: RpcTimeframe): {
  timeframe: SendLandingTimeframe;
  raised: boolean;
} {
  const match = sendLandingTimeframeOptions.find(
    (option) => option.value === pageTimeframe,
  );
  return match
    ? { timeframe: match.value, raised: false }
    : { timeframe: "24h", raised: true };
}

/**
 * Rankings are only comparable within one vantage point, so the page opens on
 * one region (the RPC tab's default) rather than all of them.
 */
export const defaultSendLandingRegion = "fra";

// Benchmark hosts name the same metro differently (e.g. Latitude "ams", TSW
// "ams3"), so the region filter uses the RPC tab's canonical colos.
export function normalizeSendLandingRegion(value: string) {
  const region = value.toLowerCase();
  return normalizeRpcRegionParam(region) ?? region;
}

export function getSendLandingRegionLabel(value: string) {
  return (
    rpcRegionOptions.find((option) => option.value === value)?.label ??
    value.toUpperCase()
  );
}

/** Canonical colos in the RPC tab's geographic order, unknown regions last. */
export function sortSendLandingRegions(regions: Iterable<string>) {
  const order = new Map<string, number>(
    rpcRegionOptions.map(({ value }, index) => [value, index]),
  );
  return [...new Set(regions)].sort(
    (a, b) =>
      (order.get(a) ?? order.size) - (order.get(b) ?? order.size) ||
      a.localeCompare(b),
  );
}

export function parseSendLandingRegion(
  value: string | null | undefined,
  fallback = "all",
) {
  const region = value?.trim().slice(0, 128);
  if (!region) return fallback;
  return region === "all" ? "all" : normalizeSendLandingRegion(region);
}

export function getSendLandingDataUrl(
  region: string,
  timeframe: SendLandingTimeframe,
) {
  const params = new URLSearchParams({ region, timeframe });
  return `/api/senders/landing/data?${params.toString()}`;
}

const isCount = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 0;
const isOptionalNumber = (value: unknown, allowNegative = false) =>
  value === null ||
  (typeof value === "number" &&
    Number.isFinite(value) &&
    (allowNegative || value >= 0));
const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

export function isSendLandingProviderStats(
  value: unknown,
): value is SendLandingProviderStats {
  if (!isRecord(value) || typeof value.provider !== "string") return false;
  const counts = [
    "rounds",
    "landed",
    "failed",
    "dropped",
    "scoredRounds",
    "firstOnChain",
    "laterSlot",
    "costLamports",
  ];
  if (!counts.every((key) => isCount(value[key]))) return false;
  const stats = value as SendLandingProviderStats;
  return (
    isOptionalNumber(stats.indexP50) &&
    isOptionalNumber(stats.indexP90) &&
    isOptionalNumber(stats.slotsToLandP50, true) &&
    isOptionalNumber(stats.responseP50Ms) &&
    stats.landed + stats.failed + stats.dropped <= stats.rounds &&
    stats.firstOnChain <= stats.scoredRounds &&
    stats.scoredRounds <= stats.rounds &&
    stats.laterSlot <= stats.landed + stats.failed
  );
}

export function isSendLandingPair(value: unknown): value is SendLandingPair {
  return (
    isRecord(value) &&
    typeof value.provider === "string" &&
    typeof value.otherProvider === "string" &&
    value.provider !== value.otherProvider &&
    isCount(value.ahead) &&
    isCount(value.rounds) &&
    value.ahead <= value.rounds
  );
}

export function isSendLandingBucket(
  value: unknown,
): value is SendLandingBucket {
  return (
    isRecord(value) &&
    typeof value.provider === "string" &&
    isCount(value.timestamp) &&
    isCount(value.rounds) &&
    isCount(value.landed) &&
    isCount(value.scoredRounds) &&
    isCount(value.firstOnChain) &&
    value.landed <= value.rounds &&
    value.firstOnChain <= value.scoredRounds &&
    value.scoredRounds <= value.rounds
  );
}

export function isSendLandingResponse(
  value: unknown,
): value is SendLandingResponse {
  if (!isRecord(value)) return false;
  const rounds = value.rounds;
  return (
    typeof value.generatedAt === "string" &&
    typeof value.region === "string" &&
    sendLandingTimeframeOptions.some(
      (option) => option.value === value.timeframe,
    ) &&
    isCount(value.stepSeconds) &&
    isRecord(rounds) &&
    isCount(rounds.complete) &&
    isCount(rounds.skipped) &&
    Array.isArray(value.providers) &&
    value.providers.every(isSendLandingProviderStats) &&
    Array.isArray(value.headToHead) &&
    value.headToHead.every(isSendLandingPair) &&
    Array.isArray(value.buckets) &&
    value.buckets.every(isSendLandingBucket)
  );
}

export function isSendLandingFiltersResponse(
  value: unknown,
): value is SendLandingFiltersResponse {
  const isStringArray = (items: unknown): items is string[] =>
    Array.isArray(items) && items.every((item) => typeof item === "string");
  return (
    isRecord(value) &&
    isStringArray(value.regions) &&
    isStringArray(value.providers)
  );
}
