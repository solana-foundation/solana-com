import "server-only";

import { unstable_cache } from "next/cache";
import {
  ALPENGLOW_DASHBOARD_NETWORKS,
  ALPENGLOW_DASHBOARD_RANGES,
  type AlpenglowDashboardActivationData,
  type AlpenglowDashboardCharts,
  type AlpenglowDashboardData,
  type AlpenglowDashboardDetailData,
  type AlpenglowDashboardLiveData,
  type AlpenglowDashboardNetwork,
  type AlpenglowDashboardRange,
  type MetricSeries,
} from "./alpenglow-metrics-types";

const REQUEST_TIMEOUT_MS = 10_000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const ACTIVATION_CACHE_SECONDS = 2;
const LIVE_CACHE_SECONDS = 8;
const DETAIL_CACHE_SECONDS = 8;
/** Maximum age of a live performance snapshot returned to the dashboard. */
export const ALPENGLOW_LIVE_MAXIMUM_AGE_SECONDS = 15;
const LIVE_MAXIMUM_AGE_MS = ALPENGLOW_LIVE_MAXIMUM_AGE_SECONDS * 1_000;
const DETAIL_MAXIMUM_AGE_MS = 90_000;

const RANGE_CONFIG: Record<
  AlpenglowDashboardRange,
  { seconds: number; step: number }
> = {
  "1h": { seconds: 60 * 60, step: 15 },
  "6h": { seconds: 6 * 60 * 60, step: 60 },
  "24h": { seconds: 24 * 60 * 60, step: 300 },
  "7d": { seconds: 7 * 24 * 60 * 60, step: 1_800 },
};

const PROMETHEUS_ENV_NAMES: Record<
  AlpenglowDashboardNetwork,
  { url: string; token: string }
> = {
  mainnet: {
    url: "ALPENGLOW_PROMETHEUS_MAINNET_URL",
    token: "ALPENGLOW_PROMETHEUS_MAINNET_BEARER_TOKEN",
  },
  testnet: {
    url: "ALPENGLOW_PROMETHEUS_TESTNET_URL",
    token: "ALPENGLOW_PROMETHEUS_TESTNET_BEARER_TOKEN",
  },
  devnet: {
    url: "ALPENGLOW_PROMETHEUS_DEVNET_URL",
    token: "ALPENGLOW_PROMETHEUS_DEVNET_BEARER_TOKEN",
  },
};

const RPC_ENV_NAMES: Record<
  AlpenglowDashboardNetwork,
  { url: string; defaultUrl: string }
> = {
  mainnet: {
    url: "ALPENGLOW_RPC_MAINNET_URL",
    defaultUrl: "https://api.mainnet-beta.solana.com",
  },
  testnet: {
    url: "ALPENGLOW_RPC_TESTNET_URL",
    defaultUrl: "https://api.testnet.solana.com",
  },
  devnet: {
    url: "ALPENGLOW_RPC_DEVNET_URL",
    defaultUrl: "https://api.devnet.solana.com",
  },
};

const RANGE_QUERIES = {
  p95FinalityLatencySeconds:
    "histogram_quantile(0.95, sum by (network, le) (rate(solana_rpc_finality_latency_seconds_bucket[2m]))) or histogram_quantile(0.95, sum by (network, le) (rate(solana_finality_latency_seconds_bucket[2m])))",
  transactionsPerSecond:
    "max(clamp_min(rate(solana_node_transactions_total[1m]), 0))",
  towerVoteSlotsPerSecond:
    "avg(clamp_min(deriv(solana_validator_last_vote[2m]), 0))",
  averageVoteRootLag:
    "quantile(0.95, clamp_min(solana_validator_last_vote - solana_validator_root_slot, 0) and on (nodekey, votekey) (solana_validator_delinquent == 0))",
  blockTransactions: "avg by (transaction_type) (solana_validator_block_size)",
} as const;

const LIVE_QUERIES = {
  recentAverageFinalityLatencySeconds:
    "(sum(rate(solana_rpc_finality_latency_seconds_sum[30s])) / sum(rate(solana_rpc_finality_latency_seconds_count[30s]))) or (sum(rate(solana_finality_latency_seconds_sum[30s])) / sum(rate(solana_finality_latency_seconds_count[30s])))",
  transactionsPerSecond:
    "max(clamp_min(rate(solana_node_transactions_total[30s]), 0))",
} as const;

type PrometheusMetric = Record<string, string>;

interface PrometheusResult {
  metric: PrometheusMetric;
  value?: [number, string];
  values?: Array<[number, string]>;
}

interface PrometheusResponse {
  status: "success" | "error";
  data?: { result: PrometheusResult[] };
  error?: string;
}

interface PrometheusQueryResult {
  failed: boolean;
  result: PrometheusResult[];
}

interface PrometheusQueryBatch<T extends Record<string, string>> {
  results: Record<keyof T, PrometheusResult[]>;
  successfulQueryCount: number;
}

interface AlpenglowChartData {
  generatedAt: string;
  network: AlpenglowDashboardNetwork;
  range: AlpenglowDashboardRange;
  charts: AlpenglowDashboardCharts;
  warnings: string[];
}

function exceedsMaximumAge(generatedAt: string, maximumAgeMs: number): boolean {
  const generatedAtMs = Date.parse(generatedAt);
  return (
    !Number.isFinite(generatedAtMs) || Date.now() - generatedAtMs > maximumAgeMs
  );
}

function prometheusConfig(network: AlpenglowDashboardNetwork): {
  baseUrl: URL;
  token: string | undefined;
} {
  const envNames = PROMETHEUS_ENV_NAMES[network];
  const legacyUrl =
    network === "testnet" ? process.env.ALPENGLOW_PROMETHEUS_URL : undefined;
  const configured = process.env[envNames.url] || legacyUrl;
  if (!configured) throw new Error(`${envNames.url} is not configured`);

  const url = new URL(configured);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${envNames.url} must use http or https`);
  }

  const legacyToken =
    network === "testnet"
      ? process.env.ALPENGLOW_PROMETHEUS_BEARER_TOKEN
      : undefined;

  return {
    baseUrl: url,
    token: process.env[envNames.token] || legacyToken,
  };
}

function rpcUrl(network: AlpenglowDashboardNetwork): URL {
  const envNames = RPC_ENV_NAMES[network];
  const configured = process.env[envNames.url] || envNames.defaultUrl;
  const url = new URL(configured);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${envNames.url} must use http or https`);
  }

  return url;
}

async function prometheusQuery(
  network: AlpenglowDashboardNetwork,
  endpoint: "query" | "query_range",
  query: string,
  options: { start?: number; end?: number; step?: number } = {},
): Promise<PrometheusResult[]> {
  const { baseUrl, token } = prometheusConfig(network);
  const url = new URL(baseUrl);
  url.pathname = `${url.pathname.replace(/\/$/, "")}/api/v1/${endpoint}`;
  url.searchParams.set("query", query);

  if (options.start !== undefined)
    url.searchParams.set("start", String(options.start));
  if (options.end !== undefined)
    url.searchParams.set("end", String(options.end));
  if (options.step !== undefined)
    url.searchParams.set("step", String(options.step));

  const headers = new Headers({ Accept: "application/json" });
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(url, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Prometheus returned HTTP ${response.status}`);
  }

  const payload = (await response.json()) as PrometheusResponse;
  if (payload.status !== "success" || !payload.data) {
    throw new Error(payload.error ?? "Prometheus query failed");
  }

  return payload.data.result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function rpcError(payload: Record<string, unknown>): {
  code: number;
  message: string;
} | null {
  const error = payload.error;
  if (!isRecord(error)) return null;

  return {
    code: typeof error.code === "number" ? error.code : 0,
    message:
      typeof error.message === "string" ? error.message : "Solana RPC failed",
  };
}

function countBitmapSigners(bitmap: number[]): number {
  let signers = 0;
  for (const rawByte of bitmap) {
    let byte = rawByte;
    while (byte > 0) {
      signers += byte & 1;
      byte >>>= 1;
    }
  }
  return signers;
}

function isByteArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every(
      (byte) =>
        typeof byte === "number" &&
        Number.isInteger(byte) &&
        byte >= 0 &&
        byte <= 255,
    )
  );
}

function unsupportedActivationData(
  network: AlpenglowDashboardNetwork,
): AlpenglowDashboardActivationData {
  return {
    generatedAt: new Date().toISOString(),
    network,
    alpenglowRpcSupported: false,
    alpenglowActive: null,
    genesisSlot: null,
    certificateValidatorCount: null,
    warnings: [],
  };
}

async function loadAlpenglowActivationData(
  network: AlpenglowDashboardNetwork,
): Promise<AlpenglowDashboardActivationData> {
  const url = rpcUrl(network);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "alpenglow-dashboard-status",
        method: "getAgGenesisCert",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 404) {
      return unsupportedActivationData(network);
    }
    if (!response.ok) {
      throw new Error(`Solana RPC returned HTTP ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload)) {
      throw new Error("Solana RPC returned an invalid response");
    }

    const error = rpcError(payload);
    if (error?.code === -32601) {
      return unsupportedActivationData(network);
    }
    if (error) throw new Error(`Solana RPC error: ${error.message}`);
    if (!("result" in payload)) {
      throw new Error("Solana RPC response is missing a result");
    }

    if (payload.result === null) {
      return {
        generatedAt: new Date().toISOString(),
        network,
        alpenglowRpcSupported: true,
        alpenglowActive: false,
        genesisSlot: null,
        certificateValidatorCount: null,
        warnings: [],
      };
    }

    if (!isRecord(payload.result)) {
      throw new Error("Solana RPC returned an invalid genesis certificate");
    }
    const block = payload.result.block;
    const signature = payload.result.signature;
    if (!isRecord(block) || !isRecord(signature)) {
      throw new Error("Solana RPC returned an incomplete genesis certificate");
    }

    const slot = block.slot;
    const bitmap = signature.bitmap;
    if (
      typeof slot !== "number" ||
      !Number.isSafeInteger(slot) ||
      slot < 0 ||
      !isByteArray(bitmap)
    ) {
      throw new Error("Solana RPC returned invalid certificate fields");
    }

    return {
      generatedAt: new Date().toISOString(),
      network,
      alpenglowRpcSupported: true,
      alpenglowActive: true,
      genesisSlot: slot,
      certificateValidatorCount: countBitmapSigners(bitmap),
      warnings: [],
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    return {
      generatedAt: new Date().toISOString(),
      network,
      alpenglowRpcSupported: null,
      alpenglowActive: null,
      genesisSlot: null,
      certificateValidatorCount: null,
      warnings: [`Alpenglow activation status is unavailable: ${reason}`],
    };
  }
}

function finiteNumber(value: string | undefined): number | null {
  if (value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function vectorValue(result: PrometheusResult[]): number | null {
  return finiteNumber(result[0]?.value?.[1]);
}

function matrixSeries(
  result: PrometheusResult[],
  defaultLabel: string,
): MetricSeries[] {
  return result.map((item) => ({
    label:
      item.metric.transaction_type === "vote"
        ? "Vote transactions"
        : item.metric.transaction_type === "non_vote"
          ? "Non-vote transactions"
          : item.metric.network
            ? `${defaultLabel} (${item.metric.network})`
            : defaultLabel,
    points: (item.values ?? []).flatMap(([timestamp, rawValue]) => {
      const value = finiteNumber(rawValue);
      return value === null ? [] : [[timestamp, value]];
    }),
  }));
}

async function optionalQuery(
  name: string,
  query: () => Promise<PrometheusResult[]>,
  warnings: string[],
): Promise<PrometheusQueryResult> {
  try {
    return { failed: false, result: await query() };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    warnings.push(`${name} is unavailable: ${reason}`);
    return { failed: true, result: [] };
  }
}

async function executeQueries<T extends Record<string, string>>(
  network: AlpenglowDashboardNetwork,
  endpoint: "query" | "query_range",
  queries: T,
  warnings: string[],
  options: { start?: number; end?: number; step?: number } = {},
): Promise<PrometheusQueryBatch<T>> {
  const entries = await Promise.all(
    Object.entries(queries).map(async ([name, query]) => {
      const outcome = await optionalQuery(
        name,
        () => prometheusQuery(network, endpoint, query, options),
        warnings,
      );
      return { name, outcome };
    }),
  );

  return {
    results: Object.fromEntries(
      entries.map(({ name, outcome }) => [name, outcome.result]),
    ) as Record<keyof T, PrometheusResult[]>,
    successfulQueryCount: entries.filter(({ outcome }) => !outcome.failed)
      .length,
  };
}

function requireSuccessfulQuery(
  group: string,
  successfulQueryCount: number,
  warnings: string[],
) {
  if (successfulQueryCount > 0) return;
  throw new Error(
    `Every ${group} Prometheus query failed: ${warnings.join("; ")}`,
  );
}

async function loadAlpenglowLiveData(
  network: AlpenglowDashboardNetwork,
): Promise<AlpenglowDashboardLiveData> {
  prometheusConfig(network);
  const warnings: string[] = [];
  const batch = await executeQueries(network, "query", LIVE_QUERIES, warnings);
  requireSuccessfulQuery("live", batch.successfulQueryCount, warnings);
  const { results } = batch;

  return {
    generatedAt: new Date().toISOString(),
    network,
    recentAverageFinalityLatencySeconds: vectorValue(
      results.recentAverageFinalityLatencySeconds,
    ),
    transactionsPerSecond: vectorValue(results.transactionsPerSecond),
    warnings,
  };
}

async function loadAlpenglowChartData(
  range: AlpenglowDashboardRange,
  network: AlpenglowDashboardNetwork,
): Promise<AlpenglowChartData> {
  prometheusConfig(network);
  const warnings: string[] = [];
  const end = Math.floor(Date.now() / 1_000);
  const rangeConfig = RANGE_CONFIG[range];
  const batch = await executeQueries(
    network,
    "query_range",
    RANGE_QUERIES,
    warnings,
    {
      start: end - rangeConfig.seconds,
      end,
      step: rangeConfig.step,
    },
  );
  requireSuccessfulQuery("historical", batch.successfulQueryCount, warnings);
  const { results } = batch;

  return {
    generatedAt: new Date().toISOString(),
    network,
    range,
    charts: {
      p95FinalityLatencySeconds: matrixSeries(
        results.p95FinalityLatencySeconds,
        "p95 observed finality",
      ),
      transactionsPerSecond: matrixSeries(
        results.transactionsPerSecond,
        "Transactions per second",
      ),
      towerVoteSlotsPerSecond: matrixSeries(
        results.towerVoteSlotsPerSecond,
        "Vote-account progress",
      ),
      averageVoteRootLag: matrixSeries(
        results.averageVoteRootLag,
        "Finalization-certificate lag (p95)",
      ),
      blockTransactions: matrixSeries(
        results.blockTransactions,
        "Transactions per block",
      ),
    },
    warnings,
  };
}

function coalesce<K, T>(
  requests: Map<K, Promise<T>>,
  key: K,
  load: () => Promise<T>,
): Promise<T> {
  const current = requests.get(key);
  if (current) return current;

  const request = load();
  requests.set(key, request);
  request.then(
    () => requests.delete(key),
    () => requests.delete(key),
  );
  return request;
}

const activationRequests = new Map<
  AlpenglowDashboardNetwork,
  Promise<AlpenglowDashboardActivationData>
>();
const liveRequests = new Map<
  AlpenglowDashboardNetwork,
  Promise<AlpenglowDashboardLiveData>
>();
const chartRequests = new Map<string, Promise<AlpenglowChartData>>();

function uncachedActivationData(network: AlpenglowDashboardNetwork) {
  return coalesce(activationRequests, network, () =>
    loadAlpenglowActivationData(network),
  );
}

function uncachedLiveData(network: AlpenglowDashboardNetwork) {
  return coalesce(liveRequests, network, () => loadAlpenglowLiveData(network));
}

function uncachedChartData(
  range: AlpenglowDashboardRange,
  network: AlpenglowDashboardNetwork,
) {
  return coalesce(chartRequests, `${network}:${range}`, () =>
    loadAlpenglowChartData(range, network),
  );
}

const cachedActivationData = unstable_cache(
  uncachedActivationData,
  ["alpenglow-activation-v1"],
  { revalidate: ACTIVATION_CACHE_SECONDS },
);
const cachedLiveData = unstable_cache(uncachedLiveData, ["alpenglow-live-v1"], {
  revalidate: LIVE_CACHE_SECONDS,
});
const cachedChartData = unstable_cache(
  uncachedChartData,
  ["alpenglow-charts-v1"],
  { revalidate: DETAIL_CACHE_SECONDS },
);

/** Returns whether a requested dashboard range is supported. */
export function isAlpenglowDashboardRange(
  value: string | null,
): value is AlpenglowDashboardRange {
  return ALPENGLOW_DASHBOARD_RANGES.some((range) => range === value);
}

/** Returns whether a requested dashboard network is supported. */
export function isAlpenglowDashboardNetwork(
  value: string | null,
): value is AlpenglowDashboardNetwork {
  return ALPENGLOW_DASHBOARD_NETWORKS.some((network) => network === value);
}

/** Loads the canonical Alpenglow activation snapshot for a cluster. */
export function getAlpenglowActivationData(
  network: AlpenglowDashboardNetwork,
): Promise<AlpenglowDashboardActivationData> {
  return IS_PRODUCTION
    ? cachedActivationData(network)
    : uncachedActivationData(network);
}

/** Loads fast-changing finality and throughput values for a cluster. */
export async function getAlpenglowLiveData(
  network: AlpenglowDashboardNetwork,
): Promise<AlpenglowDashboardLiveData> {
  const liveData = IS_PRODUCTION
    ? await cachedLiveData(network)
    : await uncachedLiveData(network);

  if (
    IS_PRODUCTION &&
    exceedsMaximumAge(liveData.generatedAt, LIVE_MAXIMUM_AGE_MS)
  ) {
    return uncachedLiveData(network);
  }

  return liveData;
}

/** Loads cached historical charts for a cluster. */
export async function getAlpenglowDetailData(
  range: AlpenglowDashboardRange,
  network: AlpenglowDashboardNetwork,
): Promise<AlpenglowDashboardDetailData> {
  let chartData = IS_PRODUCTION
    ? await cachedChartData(range, network)
    : await uncachedChartData(range, network);

  if (
    IS_PRODUCTION &&
    exceedsMaximumAge(chartData.generatedAt, DETAIL_MAXIMUM_AGE_MS)
  ) {
    chartData = await uncachedChartData(range, network);
  }

  return {
    generatedAt: chartData.generatedAt,
    network,
    range,
    charts: chartData.charts,
    warnings: chartData.warnings,
  };
}

/** Composes the legacy combined response from the split cached loaders. */
export async function getAlpenglowDashboardData(
  range: AlpenglowDashboardRange,
  network: AlpenglowDashboardNetwork,
): Promise<AlpenglowDashboardData> {
  const [activation, live, detail] = await Promise.all([
    getAlpenglowActivationData(network),
    getAlpenglowLiveData(network),
    getAlpenglowDetailData(range, network),
  ]);

  return {
    generatedAt:
      detail.generatedAt > live.generatedAt
        ? detail.generatedAt
        : live.generatedAt,
    network,
    range,
    status: {
      alpenglowRpcSupported: activation.alpenglowRpcSupported,
      alpenglowActive: activation.alpenglowActive,
      genesisSlot: activation.genesisSlot,
      certificateValidatorCount: activation.certificateValidatorCount,
      recentAverageFinalityLatencySeconds:
        live.recentAverageFinalityLatencySeconds,
    },
    charts: detail.charts,
    warnings: [...activation.warnings, ...live.warnings, ...detail.warnings],
  };
}
