import "server-only";

import { unstable_cache } from "next/cache";
import {
  ALPENGLOW_DASHBOARD_NETWORKS,
  type AlpenglowDashboardLiveData,
  type AlpenglowDashboardNetwork,
} from "./alpenglow-metrics-types";

const REQUEST_TIMEOUT_MS = 10_000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const LIVE_CACHE_SECONDS = 1;
/** Maximum age of a live performance snapshot returned to visitors. */
export const ALPENGLOW_LIVE_MAXIMUM_AGE_SECONDS = 3;
const LIVE_MAXIMUM_AGE_MS = ALPENGLOW_LIVE_MAXIMUM_AGE_SECONDS * 1_000;

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

const LIVE_QUERIES = {
  latestFinalityLatencySeconds:
    'max(solana_finality_latency_latest_seconds{job="solana-exporter-live"}) or max(solana_finality_latency_latest_seconds) or (sum(rate(solana_rpc_finality_latency_seconds_sum[30s])) / sum(rate(solana_rpc_finality_latency_seconds_count[30s]))) or (sum(rate(solana_finality_latency_seconds_sum[30s])) / sum(rate(solana_finality_latency_seconds_count[30s])))',
  transactionsPerSecond:
    'max(clamp_min(rate(solana_node_transactions_total{job="solana-exporter-live"}[30s]), 0)) or max(clamp_min(rate(solana_node_transactions_total[30s]), 0))',
  voteAccountProgressSlotsPerSecond:
    "avg(clamp_min(irate(solana_validator_last_vote[15s]), 0) and on (nodekey, votekey) (solana_validator_delinquent == 0))",
  blockTransactions:
    'max by (transaction_type) (solana_block_transactions_latest{job="solana-exporter-live"})',
} as const;

type PrometheusMetric = Record<string, string>;

interface PrometheusResult {
  metric: PrometheusMetric;
  value?: [number, string];
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

async function prometheusQuery(
  network: AlpenglowDashboardNetwork,
  query: string,
): Promise<PrometheusResult[]> {
  const { baseUrl, token } = prometheusConfig(network);
  const url = new URL(baseUrl);
  url.pathname = `${url.pathname.replace(/\/$/, "")}/api/v1/query`;
  url.searchParams.set("query", query);

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

function finiteNumber(value: string | undefined): number | null {
  if (value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function vectorValue(result: PrometheusResult[]): number | null {
  return finiteNumber(result[0]?.value?.[1]);
}

function vectorValueByLabel(
  result: PrometheusResult[],
  label: string,
  value: string,
): number | null {
  return finiteNumber(
    result.find((item) => item.metric[label] === value)?.value?.[1],
  );
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
  queries: T,
  warnings: string[],
): Promise<PrometheusQueryBatch<T>> {
  const entries = await Promise.all(
    Object.entries(queries).map(async ([name, query]) => {
      const outcome = await optionalQuery(
        name,
        () => prometheusQuery(network, query),
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
  const batch = await executeQueries(network, LIVE_QUERIES, warnings);
  requireSuccessfulQuery("live", batch.successfulQueryCount, warnings);
  const { results } = batch;

  return {
    generatedAt: new Date().toISOString(),
    network,
    latestFinalityLatencySeconds: vectorValue(
      results.latestFinalityLatencySeconds,
    ),
    transactionsPerSecond: vectorValue(results.transactionsPerSecond),
    voteAccountProgressSlotsPerSecond: vectorValue(
      results.voteAccountProgressSlotsPerSecond,
    ),
    totalTransactionsPerBlock: vectorValueByLabel(
      results.blockTransactions,
      "transaction_type",
      "total",
    ),
    voteTransactionsPerBlock: vectorValueByLabel(
      results.blockTransactions,
      "transaction_type",
      "vote",
    ),
    nonVoteTransactionsPerBlock: vectorValueByLabel(
      results.blockTransactions,
      "transaction_type",
      "non_vote",
    ),
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

const liveRequests = new Map<
  AlpenglowDashboardNetwork,
  Promise<AlpenglowDashboardLiveData>
>();

function uncachedLiveData(network: AlpenglowDashboardNetwork) {
  return coalesce(liveRequests, network, () => loadAlpenglowLiveData(network));
}

const cachedLiveData = unstable_cache(uncachedLiveData, ["alpenglow-live-v1"], {
  revalidate: LIVE_CACHE_SECONDS,
});

/** Returns whether a requested dashboard network is supported. */
export function isAlpenglowDashboardNetwork(
  value: string | null,
): value is AlpenglowDashboardNetwork {
  return ALPENGLOW_DASHBOARD_NETWORKS.some((network) => network === value);
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
