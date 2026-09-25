import "server-only";

import {
  ALPENGLOW_DASHBOARD_NETWORKS,
  ALPENGLOW_DASHBOARD_RANGES,
  type AlpenglowDashboardData,
  type AlpenglowDashboardNetwork,
  type AlpenglowDashboardRange,
  type MetricSeries,
  type ValidatorSnapshot,
} from "./alpenglow-metrics-types";

const REQUEST_TIMEOUT_MS = 10_000;
const VALIDATOR_LIMIT = 100;

const RANGE_CONFIG: Record<
  AlpenglowDashboardRange,
  { seconds: number; step: number }
> = {
  "1h": { seconds: 60 * 60, step: 15 },
  "6h": { seconds: 6 * 60 * 60, step: 60 },
  "24h": { seconds: 24 * 60 * 60, step: 300 },
  "7d": { seconds: 7 * 24 * 60 * 60, step: 1_800 },
};

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

function prometheusConfig(network: AlpenglowDashboardNetwork): {
  baseUrl: URL;
  token: string | undefined;
} {
  const envNames = PROMETHEUS_ENV_NAMES[network];
  const legacyUrl =
    network === "testnet" ? process.env.ALPENGLOW_PROMETHEUS_URL : undefined;
  const configured = process.env[envNames.url] || legacyUrl;
  if (!configured) {
    throw new Error(`${envNames.url} is not configured`);
  }

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
  endpoint: "query" | "query_range",
  query: string,
  options: { start?: number; end?: number; step?: number } = {},
): Promise<PrometheusResult[]> {
  const { baseUrl, token } = prometheusConfig(network);
  const url = new URL(baseUrl);
  url.pathname = `${url.pathname.replace(/\/$/, "")}/api/v1/${endpoint}`;
  url.searchParams.set("query", query);

  if (options.start !== undefined) {
    url.searchParams.set("start", String(options.start));
  }
  if (options.end !== undefined) {
    url.searchParams.set("end", String(options.end));
  }
  if (options.step !== undefined) {
    url.searchParams.set("step", String(options.step));
  }

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
): Promise<PrometheusResult[]> {
  try {
    return await query();
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    warnings.push(`${name} is unavailable: ${reason}`);
    return [];
  }
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

export function isAlpenglowDashboardRange(
  value: string | null,
): value is AlpenglowDashboardRange {
  return ALPENGLOW_DASHBOARD_RANGES.some((range) => range === value);
}

export function isAlpenglowDashboardNetwork(
  value: string | null,
): value is AlpenglowDashboardNetwork {
  return ALPENGLOW_DASHBOARD_NETWORKS.some((network) => network === value);
}

export async function getAlpenglowDashboardData(
  range: AlpenglowDashboardRange,
  network: AlpenglowDashboardNetwork,
): Promise<AlpenglowDashboardData> {
  prometheusConfig(network);

  const warnings: string[] = [];
  const end = Math.floor(Date.now() / 1_000);
  const rangeConfig = RANGE_CONFIG[range];
  const rangeOptions = {
    start: end - rangeConfig.seconds,
    end,
    step: rangeConfig.step,
  };

  const rangeQueries = {
    p95FinalityLatencySeconds:
      "histogram_quantile(0.95, sum by (network, le) (rate(solana_rpc_finality_latency_seconds_bucket[5m]))) or histogram_quantile(0.95, sum by (network, le) (rate(solana_finality_latency_seconds_bucket[5m])))",
    transactionsPerSecond:
      "max(clamp_min(rate(solana_node_transactions_total[5m]), 0))",
    towerVoteSlotsPerSecond:
      "avg(clamp_min(deriv(solana_validator_last_vote[5m]), 0))",
    averageVoteRootLag:
      "avg(clamp_min(solana_validator_last_vote - solana_validator_root_slot, 0))",
    blockTransactions:
      "avg by (transaction_type) (solana_validator_block_size)",
  } as const;

  const instantQueries = {
    alpenglowRpcSupported: "max(solana_alpenglow_rpc_supported)",
    alpenglowActive: "max(solana_alpenglow_active)",
    genesisSlot: "max(solana_alpenglow_genesis_slot)",
    certificateValidatorCount:
      "max(solana_alpenglow_genesis_certificate_validator_count)",
    recentAverageFinalityLatencySeconds:
      "(sum(rate(solana_rpc_finality_latency_seconds_sum[1m])) / sum(rate(solana_rpc_finality_latency_seconds_count[1m]))) or (sum(rate(solana_finality_latency_seconds_sum[1m])) / sum(rate(solana_finality_latency_seconds_count[1m])))",
    trackedValidatorCount:
      "count(max by (nodekey) (solana_validator_last_vote))",
    delinquentValidatorCount:
      "sum(max by (nodekey) (solana_validator_delinquent))",
    lastVote: "max by (nodekey, votekey) (solana_validator_last_vote)",
    rootSlot: "max by (nodekey, votekey) (solana_validator_root_slot)",
    delinquent: "max by (nodekey, votekey) (solana_validator_delinquent)",
    activeStake: "max by (nodekey, votekey) (solana_validator_active_stake)",
    voteTransactions:
      'max by (nodekey) (solana_validator_block_size{transaction_type="vote"})',
  } as const;

  const rangeResults = Object.fromEntries(
    await Promise.all(
      Object.entries(rangeQueries).map(async ([name, query]) => [
        name,
        await optionalQuery(
          name,
          () => prometheusQuery(network, "query_range", query, rangeOptions),
          warnings,
        ),
      ]),
    ),
  ) as Record<keyof typeof rangeQueries, PrometheusResult[]>;

  const instantResults = Object.fromEntries(
    await Promise.all(
      Object.entries(instantQueries).map(async ([name, query]) => [
        name,
        await optionalQuery(
          name,
          () => prometheusQuery(network, "query", query),
          warnings,
        ),
      ]),
    ),
  ) as Record<keyof typeof instantQueries, PrometheusResult[]>;

  const supported = vectorValue(instantResults.alpenglowRpcSupported);
  const active = vectorValue(instantResults.alpenglowActive);

  return {
    generatedAt: new Date().toISOString(),
    network,
    range,
    status: {
      alpenglowRpcSupported: supported === null ? null : supported === 1,
      alpenglowActive: active === null ? null : active === 1,
      genesisSlot: vectorValue(instantResults.genesisSlot),
      certificateValidatorCount: vectorValue(
        instantResults.certificateValidatorCount,
      ),
      recentAverageFinalityLatencySeconds: vectorValue(
        instantResults.recentAverageFinalityLatencySeconds,
      ),
      trackedValidatorCount: vectorValue(instantResults.trackedValidatorCount),
      delinquentValidatorCount: vectorValue(
        instantResults.delinquentValidatorCount,
      ),
    },
    charts: {
      p95FinalityLatencySeconds: matrixSeries(
        rangeResults.p95FinalityLatencySeconds,
        "p95 observed finality",
      ),
      transactionsPerSecond: matrixSeries(
        rangeResults.transactionsPerSecond,
        "Transactions per second",
      ),
      towerVoteSlotsPerSecond: matrixSeries(
        rangeResults.towerVoteSlotsPerSecond,
        "Tower vote advancement",
      ),
      averageVoteRootLag: matrixSeries(
        rangeResults.averageVoteRootLag,
        "Average vote-root lag",
      ),
      blockTransactions: matrixSeries(
        rangeResults.blockTransactions,
        "Transactions per block",
      ),
    },
    validators: mergeValidators({
      lastVote: instantResults.lastVote,
      rootSlot: instantResults.rootSlot,
      delinquent: instantResults.delinquent,
      activeStake: instantResults.activeStake,
      voteTransactions: instantResults.voteTransactions,
    }),
    warnings,
  };
}
