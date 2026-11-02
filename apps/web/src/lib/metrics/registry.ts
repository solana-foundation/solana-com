import apps from "@/data/metrics/apps.json";
import defi from "@/data/metrics/defi.json";
import network from "@/data/metrics/network.json";
import rwa from "@/data/metrics/rwa.json";
import stablecoins from "@/data/metrics/stablecoins.json";

/**
 * One file per key prefix in src/data/metrics/ (see its README). Add a new
 * file here when a new prefix is introduced.
 */
const registryFiles = { apps, defi, network, rwa, stablecoins };

export type MetricUnit = "usd" | "count" | "ms";

export type MetricPeriod =
  | { kind: "point" }
  | { kind: "trailing"; days: number };

/** Daily-median rollup over /data providers, matching the dashboard KPIs. */
export type DataApiLiveSpec = {
  provider: "data-api";
  /** Summed per day when more than one metric is listed. */
  metrics: string[];
  /** Daily multiplier, e.g. SOL price to value SOL-denominated fees in USD. */
  multiplyBy?: string;
  /** Window total of these metrics divides the window total of `metrics`. */
  divideBy?: string[];
  rollup: "sum" | "avg" | "last";
  days: number;
};

export type RwaXyzLiveSpec = {
  provider: "rwa-xyz";
  field: "distributedValueUSD" | "assetCount" | "holderCount";
};

/** DefiLlama public API: chain TVL (slug = chain name), protocol Solana TVL, or all-time aggregator volume. */
export type DefiLlamaLiveSpec = {
  provider: "defillama";
  query: "chain-tvl" | "protocol-tvl" | "aggregator-volume";
  slug: string;
};

/** Computed from mainnet getVoteAccounts. */
export type SolanaRpcLiveSpec = {
  provider: "solana-rpc";
  query: "nakamoto-coefficient";
};

export type MetricDefinition = {
  unit: MetricUnit;
  definition: string;
  period: MetricPeriod;
  source: { name: string; url: string };
  owner: string;
  /** Absent for curated snapshots. */
  live?:
    | DataApiLiveSpec
    | RwaXyzLiveSpec
    | DefiLlamaLiveSpec
    | SolanaRpcLiveSpec;
  /**
   * Curated value: published as-is for snapshot metrics, and the explicit
   * fallback for live metrics when their source fails or returns nothing.
   */
  snapshot: { value: number; asOf: string };
  verifiedAt: string;
  reviewBy: string;
};

type RegistryFiles = typeof registryFiles;
export type MetricKey = {
  [File in keyof RegistryFiles]: keyof RegistryFiles[File];
}[keyof RegistryFiles] &
  string;

export const metricRegistry = Object.assign(
  {},
  ...Object.values(registryFiles),
) as Record<MetricKey, MetricDefinition>;

export function getMetricDefinition(key: MetricKey): MetricDefinition {
  return metricRegistry[key];
}
