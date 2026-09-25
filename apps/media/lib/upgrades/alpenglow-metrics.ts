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
  type ValidatorSnapshot,
} from "./alpenglow-metrics-types";

const REQUEST_TIMEOUT_MS = 10_000;
const VALIDATOR_LIMIT = 100;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const ACTIVATION_CACHE_SECONDS = 10;
const LIVE_CACHE_SECONDS = 3;
const DETAIL_CACHE_SECONDS = 15;

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
    "histogram_quantile(0.95, sum by (network, le) (rate(solana_rpc_finality_latency_seconds_bucket[5m]))) or histogram_quantile(0.95, sum by (network, le) (rate(solana_finality_latency_seconds_bucket[5m])))",
  transactionsPerSecond:
    "max(clamp_min(rate(solana_node_transactions_total[5m]), 0))",
  towerVoteSlotsPerSecond:
    "avg(clamp_min(deriv(solana_validator_last_vote[5m]), 0))",
  averageVoteRootLag:
    "avg(clamp_min(solana_validator_last_vote - solana_validator_root_slot, 0))",
  blockTransactions: "avg by (transaction_type) (solana_validator_block_size)",
} as const;

const LIVE_QUERIES = {
  recentAverageFinalityLatencySeconds:
    "(sum(rate(solana_rpc_finality_latency_seconds_sum[1m])) / sum(rate(solana_rpc_finality_latency_seconds_count[1m]))) or (sum(rate(solana_finality_latency_seconds_sum[1m])) / sum(rate(solana_finality_latency_seconds_count[1m])))",
  transactionsPerSecond:
    "max(clamp_min(rate(solana_node_transactions_total[1m]), 0))",
} as const;

const VALIDATOR_QUERIES = {
  trackedValidatorCount: "count(max by (nodekey) (solana_validator_last_vote))",
  delinquentValidatorCount:
    "sum(max by (nodekey) (solana_validator_delinquent))",
  lastVote: "max by (nodekey, votekey) (solana_validator_last_vote)",
  rootSlot: "max by (nodekey, votekey) (solana_validator_root_slot)",
  delinquent: "max by (nodekey, votekey) (solana_validator_delinquent)",
  activeStake: "max by (nodekey, votekey) (solana_validator_active_stake)",
  voteTransactions:
    'max by (nodekey) (solana_validator_block_size{transaction_type="vote"})',
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

interface AlpenglowValidatorData {
  generatedAt: string;
  network: AlpenglowDashboardNetwork;
  status: AlpenglowDashboardDetailData["status"];
  validators: ValidatorSnapshot[];
  warnings: string[];
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

    if (!response.ok) {
      throw new Error(`Solana RPC returned HTTP ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload)) {
      throw new Error("Solana RPC returned an invalid response");
    }

    const error = rpcError(payload);
    if (error?.code === -32601) {
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

function errorReason(error: unknown): string {
  return error instanceof Error ? error.message : "unknown error";
}

function emptyCharts(): AlpenglowDashboardCharts {
  return {
    p95FinalityLatencySeconds: [],
    transactionsPerSecond: [],
    towerVoteSlotsPerSecond: [],
    averageVoteRootLag: [],
    blockTransactions: [],
  };
}

function mergeValidators(
  results: Record<string, PrometheusResult[]>,
): ValidatorSnapshot[] {
  const validators = new Map<string, ValidatorSnapshot>();

  function update(
    result: PrometheusResult[],
    apply: (_validator: ValidatorSnapshot, _value: number) => void,
  ) {
    for (const item of result) {
      const nodekey = item.metric.nodekey;
      const value = finiteNumber(item.value?.[1]);
      if (!nodekey || value === null) continue;

      const validator = validators.get(nodekey) ?? {
        nodekey,
        votekey: item.metric.votekey ?? "",
        lastVote: null,
        rootSlot: null,
        voteRootLag: null,
        delinquent: null,
        activeStake: null,
        voteTransactionsPerBlock: null,
      };
      if (!validator.votekey && item.metric.votekey) {
        validator.votekey = item.metric.votekey;
      }
      apply(validator, value);
      validators.set(nodekey, validator);
    }
  }

  update(results.lastVote ?? [], (validator, value) => {
    validator.lastVote = value;
  });
  update(results.rootSlot ?? [], (validator, value) => {
    validator.rootSlot = value;
  });
  update(results.delinquent ?? [], (validator, value) => {
    validator.delinquent = value === 1;
  });
  update(results.activeStake ?? [], (validator, value) => {
    validator.activeStake = value;
  });
  update(results.voteTransactions ?? [], (validator, value) => {
    validator.voteTransactionsPerBlock = value;
  });

  for (const validator of validators.values()) {
    if (validator.lastVote !== null && validator.rootSlot !== null) {
      validator.voteRootLag = Math.max(
        0,
        validator.lastVote - validator.rootSlot,
      );
    }
  }

  return [...validators.values()]
    .sort((a, b) => {
      const statusRank = (delinquent: boolean | null) =>
        delinquent === true ? 0 : delinquent === false ? 1 : 2;
      const rankDifference =
        statusRank(a.delinquent) - statusRank(b.delinquent);
      if (rankDifference !== 0) return rankDifference;
      return (b.voteRootLag ?? -1) - (a.voteRootLag ?? -1);
    })
    .slice(0, VALIDATOR_LIMIT);
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
        "Tower vote advancement",
      ),
      averageVoteRootLag: matrixSeries(
        results.averageVoteRootLag,
        "Average vote-root lag",
      ),
      blockTransactions: matrixSeries(
        results.blockTransactions,
        "Transactions per block",
      ),
    },
    warnings,
  };
}

async function loadAlpenglowValidatorData(
  network: AlpenglowDashboardNetwork,
): Promise<AlpenglowValidatorData> {
  prometheusConfig(network);
  const warnings: string[] = [];
  const batch = await executeQueries(
    network,
    "query",
    VALIDATOR_QUERIES,
    warnings,
  );
  requireSuccessfulQuery("validator", batch.successfulQueryCount, warnings);
  const { results } = batch;

  return {
    generatedAt: new Date().toISOString(),
    network,
    status: {
      trackedValidatorCount: vectorValue(results.trackedValidatorCount),
      delinquentValidatorCount: vectorValue(results.delinquentValidatorCount),
    },
    validators: mergeValidators({
      lastVote: results.lastVote,
      rootSlot: results.rootSlot,
      delinquent: results.delinquent,
      activeStake: results.activeStake,
      voteTransactions: results.voteTransactions,
    }),
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
const validatorRequests = new Map<
  AlpenglowDashboardNetwork,
  Promise<AlpenglowValidatorData>
>();

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

function uncachedValidatorData(network: AlpenglowDashboardNetwork) {
  return coalesce(validatorRequests, network, () =>
    loadAlpenglowValidatorData(network),
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
const cachedValidatorData = unstable_cache(
  uncachedValidatorData,
  ["alpenglow-validators-v1"],
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
export function getAlpenglowLiveData(
  network: AlpenglowDashboardNetwork,
): Promise<AlpenglowDashboardLiveData> {
  return IS_PRODUCTION ? cachedLiveData(network) : uncachedLiveData(network);
}

/** Loads cached historical charts and validator diagnostics for a cluster. */
export async function getAlpenglowDetailData(
  range: AlpenglowDashboardRange,
  network: AlpenglowDashboardNetwork,
): Promise<AlpenglowDashboardDetailData> {
  const [chartResult, validatorResult] = await Promise.allSettled([
    IS_PRODUCTION
      ? cachedChartData(range, network)
      : uncachedChartData(range, network),
    IS_PRODUCTION
      ? cachedValidatorData(network)
      : uncachedValidatorData(network),
  ]);

  if (
    chartResult.status === "rejected" &&
    validatorResult.status === "rejected"
  ) {
    throw new Error("Every detail Prometheus query failed");
  }

  const chartData =
    chartResult.status === "fulfilled" ? chartResult.value : null;
  const validatorData =
    validatorResult.status === "fulfilled" ? validatorResult.value : null;
  const generatedAt =
    chartData && validatorData
      ? chartData.generatedAt > validatorData.generatedAt
        ? chartData.generatedAt
        : validatorData.generatedAt
      : null;

  return {
    generatedAt,
    chartsGeneratedAt: chartData?.generatedAt ?? null,
    validatorsGeneratedAt: validatorData?.generatedAt ?? null,
    network,
    range,
    status: validatorData?.status ?? {
      trackedValidatorCount: null,
      delinquentValidatorCount: null,
    },
    charts: chartData?.charts ?? emptyCharts(),
    validators: validatorData?.validators ?? [],
    warnings: [
      ...(chartData?.warnings ?? []),
      ...(validatorData?.warnings ?? []),
      ...(chartResult.status === "rejected"
        ? [
            `Historical charts are unavailable: ${errorReason(chartResult.reason)}`,
          ]
        : []),
      ...(validatorResult.status === "rejected"
        ? [
            `Validator diagnostics are unavailable: ${errorReason(validatorResult.reason)}`,
          ]
        : []),
    ],
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
      detail.chartsGeneratedAt && detail.chartsGeneratedAt > live.generatedAt
        ? detail.chartsGeneratedAt
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
      trackedValidatorCount: detail.status.trackedValidatorCount,
      delinquentValidatorCount: detail.status.delinquentValidatorCount,
    },
    charts: detail.charts,
    validators: detail.validators,
    warnings: [...activation.warnings, ...live.warnings, ...detail.warnings],
  };
}
