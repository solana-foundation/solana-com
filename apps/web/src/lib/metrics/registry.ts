import agents from "@/data/metrics/agents.json";
import apps from "@/data/metrics/apps.json";
import btcfi from "@/data/metrics/btcfi.json";
import consumer from "@/data/metrics/consumer.json";
import dao from "@/data/metrics/dao.json";
import defi from "@/data/metrics/defi.json";
import depin from "@/data/metrics/depin.json";
import desci from "@/data/metrics/desci.json";
import gaming from "@/data/metrics/gaming.json";
import institutions from "@/data/metrics/institutions.json";
import network from "@/data/metrics/network.json";
import nfts from "@/data/metrics/nfts.json";
import privacy from "@/data/metrics/privacy.json";
import pyusd from "@/data/metrics/pyusd.json";
import research from "@/data/metrics/research.json";
import rwa from "@/data/metrics/rwa.json";
import stablecoins from "@/data/metrics/stablecoins.json";
import tokenization from "@/data/metrics/tokenization.json";
import x402 from "@/data/metrics/x402.json";

/**
 * One file per key prefix in src/data/metrics/ (see its README). Add a new
 * file here when a new prefix is introduced.
 */
const registryFiles = {
  agents,
  apps,
  btcfi,
  consumer,
  dao,
  defi,
  depin,
  desci,
  gaming,
  institutions,
  network,
  nfts,
  privacy,
  pyusd,
  research,
  rwa,
  stablecoins,
  tokenization,
  x402,
};

/**
 * usd ($1.5B), count (2.9M), ms (200ms), percent (value 37 → 37%), sol
 * (0.009 SOL), bytes (4,096 bytes), wh (0.0083 Wh), kwh (7.3 GWh).
 */
export type MetricUnit =
  | "usd"
  | "count"
  | "ms"
  | "percent"
  | "sol"
  | "bytes"
  | "wh"
  | "kwh";

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
export type DefiLlamaLiveSpec =
  | {
      provider: "defillama";
      /**
       * chain-tvl: slug = chain name. protocol-tvl: Solana TVL of a protocol.
       * aggregator-volume: all-time volume. chain-dex-volume-30d: slug =
       * chain slug.
       */
      query:
        | "chain-tvl"
        | "protocol-tvl"
        | "aggregator-volume"
        | "chain-dex-volume-30d";
      slug: string;
    }
  | {
      provider: "defillama";
      /** Circulating supply of one stablecoin (slug = DefiLlama id) on a chain, latest complete day. */
      query: "stablecoin-chain-supply";
      slug: string;
      chain: string;
    };

/** Read from mainnet RPC on the server. */
export type SolanaRpcLiveSpec =
  | { provider: "solana-rpc"; query: "nakamoto-coefficient" }
  | {
      provider: "solana-rpc";
      /** Sum of getTokenSupply (UI amount) across mints. */
      query: "token-supply-sum";
      mints: string[];
    };

/** x402scan public stats; timeframe in days (0 = all time). Shares are Solana's percent of all chains. */
export type X402scanLiveSpec = {
  provider: "x402scan";
  query:
    | "transactions"
    | "volume-usd"
    | "buyers"
    | "sellers"
    | "buyers-and-sellers"
    | "transaction-share"
    | "volume-share";
  timeframe: 0 | 7 | 30;
};

/** Solana Climate Dashboard KPIs (climate.solana.com/api/kpis). */
export type ClimateLiveSpec = {
  provider: "climate";
  field: "electricityTx" | "electricity365" | "emissionsTx" | "emissions365";
};

export type MetricDefinition = {
  unit: MetricUnit;
  definition: string;
  period: MetricPeriod;
  /** Reader-facing source. Omitted only for `verification: "unverified"`. */
  source?: { name: string; url: string };
  /**
   * "unverified": a figure kept as published because no citable source was
   * found. It renders without a source; `note` records what was checked.
   */
  verification?: "unverified";
  /** Maintainer note, e.g. why a figure is unverified. Not shown to readers. */
  note?: string;
  owner: string;
  /** Absent for curated snapshots. */
  live?:
    | DataApiLiveSpec
    | RwaXyzLiveSpec
    | DefiLlamaLiveSpec
    | SolanaRpcLiveSpec
    | X402scanLiveSpec
    | ClimateLiveSpec;
  /** Characters around the formatted value, e.g. "+" for "100M+", "~", "#", "x". */
  display?: { prefix?: string; suffix?: string };
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
