import "server-only";

import {
  getRegionSourceValues,
  normalizeProviderName,
} from "@/app/[locale]/data/data-config";
import {
  getSendLandingTimeframeOption,
  isSendLandingBucket,
  isSendLandingPair,
  isSendLandingProviderStats,
  normalizeSendLandingRegion,
  parseSendLandingRegion,
  parseSendLandingTimeframe,
  sendLandingTimeframeOptions,
  sortSendLandingRegions,
  type SendLandingBucket,
  type SendLandingFiltersResponse,
  type SendLandingPair,
  type SendLandingProviderStats,
  type SendLandingResponse,
} from "@/app/[locale]/data/send-landing-config";

export type SendLandingConfig = {
  url: string;
  database: string;
  user: string;
  password: string;
};
export type SendLandingQueryOptions = ReturnType<
  typeof parseSendLandingQueryOptions
>;

export function getSendLandingConfig(): SendLandingConfig | undefined {
  const url = process.env.SEND_BENCHMARK_CLICKHOUSE_URL?.trim();
  const database = process.env.SEND_BENCHMARK_CLICKHOUSE_DATABASE?.trim();
  const user = process.env.SEND_BENCHMARK_CLICKHOUSE_USER?.trim();
  const password = process.env.SEND_BENCHMARK_CLICKHOUSE_PASSWORD;
  if (!url || !database || !user || !password) return undefined;
  try {
    const parsed = new URL(url);
    const localHttp =
      process.env.NODE_ENV !== "production" &&
      parsed.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
    if (parsed.protocol !== "https:" && !localHttp) return undefined;
    if (parsed.username || parsed.password) return undefined;
    return { url, database, user, password };
  } catch {
    return undefined;
  }
}

export function parseSendLandingQueryOptions(params: URLSearchParams) {
  return {
    region: parseSendLandingRegion(params.get("region")),
    timeframe: parseSendLandingTimeframe(params.get("timeframe")),
  };
}

// A canonical colo matches every raw label a sender host may emit for it.
const regionFilter =
  "(empty({regions:Array(String)}) OR has({regions:Array(String)}, lower(region)))";
const timeFilter =
  "started_utc >= toDateTime64({start:UInt32}, 9, 'UTC') AND started_utc < toDateTime64({end:UInt32}, 9, 'UTC')";

function quoteClickHouseString(value: string) {
  return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

export function getSendLandingRegionParam(region: string) {
  const values =
    region === "all"
      ? []
      : getRegionSourceValues(normalizeSendLandingRegion(region));
  return `[${values.map(quoteClickHouseString).join(",")}]`;
}

// The contract (sql/migrations/00001_send_benchmark.sql in send-latency-monitor):
// a round counts only once its round row says 'complete', which the sender writes
// after every attempt row. Retried inserts repeat rows, so both tables are read
// with FINAL. A round is scored when at least one of its copies was included.
function attemptsCte() {
  return `complete AS (
      SELECT region, cloud_provider, round_id FROM benchmark_send_rounds FINAL
      WHERE ${timeFilter} AND ${regionFilter} AND status = 'complete'
    ),
    attempts AS (
      SELECT region, cloud_provider, round_id, provider, started_utc, outcome,
        response_ns, send_status, landed_slot, tx_index, slot_delta, \`rank\` AS copy_rank,
        slots_behind_first, fee_lamports, tip_lamports,
        outcome IN ('landed', 'failed') AS included,
        max(outcome IN ('landed', 'failed'))
          OVER (PARTITION BY region, cloud_provider, round_id) AS round_scored
      FROM benchmark_send_attempts FINAL
      WHERE ${timeFilter} AND ${regionFilter}
        AND (region, cloud_provider, round_id) IN
          (SELECT region, cloud_provider, round_id FROM complete)
    )`;
}

export function buildSendLandingProviderQuery() {
  return `WITH ${attemptsCte()}
    SELECT provider,
      count() AS rounds,
      countIf(outcome = 'landed') AS landed,
      countIf(outcome = 'failed') AS failed,
      countIf(outcome = 'dropped') AS dropped,
      countIf(round_scored) AS scored_rounds,
      countIf(included AND copy_rank = 1) AS first_on_chain,
      quantileExactIf(0.5)(tx_index, included) AS index_p50,
      quantileExactIf(0.9)(tx_index, included) AS index_p90,
      countIf(included AND slots_behind_first > 0) AS later_slot,
      quantileExactIf(0.5)(slot_delta, included) AS slots_to_land_p50,
      quantileExactIf(0.5)(response_ns, send_status = 'accepted') / 1e6 AS response_p50_ms,
      sumIf(fee_lamports + tip_lamports, included) AS cost_lamports
    FROM attempts
    GROUP BY provider
    ORDER BY provider`;
}

// Ordered pairs: (A, B) counts the rounds where both copies were included and A's
// copy landed first, by slot and then position in the block.
export function buildSendLandingHeadToHeadQuery() {
  return `WITH ${attemptsCte()},
    included_copies AS (
      SELECT region, cloud_provider, round_id, provider,
        assumeNotNull(landed_slot) AS slot, assumeNotNull(tx_index) AS position
      FROM attempts WHERE included
    )
    SELECT a.provider AS provider, b.provider AS other_provider,
      countIf((a.slot, a.position) < (b.slot, b.position)) AS ahead,
      count() AS rounds
    FROM included_copies AS a
    INNER JOIN included_copies AS b
      ON a.region = b.region AND a.cloud_provider = b.cloud_provider
        AND a.round_id = b.round_id
    WHERE a.provider != b.provider
    GROUP BY provider, other_provider
    ORDER BY provider, other_provider`;
}

export function buildSendLandingBucketQuery() {
  return `WITH ${attemptsCte()}
    SELECT provider,
      toUInt32(toUnixTimestamp(toStartOfInterval(started_utc, INTERVAL {step:UInt32} SECOND))) AS timestamp,
      count() AS rounds,
      countIf(outcome = 'landed') AS landed,
      countIf(round_scored) AS scored_rounds,
      countIf(included AND copy_rank = 1) AS first_on_chain
    FROM attempts
    GROUP BY provider, timestamp
    ORDER BY timestamp, provider`;
}

export function buildSendLandingRoundsQuery() {
  return `SELECT countIf(status = 'complete') AS complete,
      countIf(status != 'complete') AS skipped
    FROM benchmark_send_rounds FINAL
    WHERE ${timeFilter} AND ${regionFilter}`;
}

type ProviderResult = {
  provider: string;
  rounds: number;
  landed: number;
  failed: number;
  dropped: number;
  scored_rounds: number;
  first_on_chain: number;
  index_p50: number | null;
  index_p90: number | null;
  later_slot: number;
  slots_to_land_p50: number | null;
  response_p50_ms: number | null;
  cost_lamports: number;
};
type PairResult = {
  provider: string;
  other_provider: string;
  ahead: number;
  rounds: number;
};
type BucketResult = {
  provider: string;
  timestamp: number;
  rounds: number;
  landed: number;
  scored_rounds: number;
  first_on_chain: number;
};
type RoundsResult = { complete: number; skipped: number };

export async function getSendLandingData(
  config: SendLandingConfig,
  options: SendLandingQueryOptions,
  now = Date.now(),
): Promise<SendLandingResponse> {
  const timeframe = getSendLandingTimeframeOption(options.timeframe);
  const end = Math.floor(now / 60_000) * 60;
  const params = {
    start: end - timeframe.durationSeconds,
    end,
    step: timeframe.stepSeconds,
    regions: getSendLandingRegionParam(options.region),
  };
  const [providerRows, pairRows, bucketRows, roundRows] = await Promise.all([
    queryClickHouse<ProviderResult>(
      config,
      buildSendLandingProviderQuery(),
      params,
    ),
    queryClickHouse<PairResult>(
      config,
      buildSendLandingHeadToHeadQuery(),
      params,
    ),
    queryClickHouse<BucketResult>(
      config,
      buildSendLandingBucketQuery(),
      params,
    ),
    queryClickHouse<RoundsResult>(
      config,
      buildSendLandingRoundsQuery(),
      params,
    ),
  ]);
  const providers: SendLandingProviderStats[] = providerRows.map((row) => ({
    provider: normalizeProviderName(row.provider),
    rounds: row.rounds,
    landed: row.landed,
    failed: row.failed,
    dropped: row.dropped,
    scoredRounds: row.scored_rounds,
    firstOnChain: row.first_on_chain,
    indexP50: row.index_p50,
    indexP90: row.index_p90,
    laterSlot: row.later_slot,
    slotsToLandP50: row.slots_to_land_p50,
    responseP50Ms: row.response_p50_ms,
    costLamports: row.cost_lamports,
  }));
  const headToHead: SendLandingPair[] = pairRows.map((row) => ({
    provider: normalizeProviderName(row.provider),
    otherProvider: normalizeProviderName(row.other_provider),
    ahead: row.ahead,
    rounds: row.rounds,
  }));
  const buckets: SendLandingBucket[] = bucketRows.map((row) => ({
    provider: normalizeProviderName(row.provider),
    timestamp: row.timestamp,
    rounds: row.rounds,
    landed: row.landed,
    scoredRounds: row.scored_rounds,
    firstOnChain: row.first_on_chain,
  }));
  const rounds = roundRows[0] ?? { complete: 0, skipped: 0 };
  if (
    !providers.every(isSendLandingProviderStats) ||
    !headToHead.every(isSendLandingPair) ||
    !buckets.every(isSendLandingBucket) ||
    roundRows.length > 1 ||
    !Number.isInteger(rounds.complete) ||
    rounds.complete < 0 ||
    !Number.isInteger(rounds.skipped) ||
    rounds.skipped < 0
  )
    throw new Error("Invalid send benchmark data");
  return {
    generatedAt: new Date(now).toISOString(),
    region: options.region,
    timeframe: timeframe.value,
    stepSeconds: timeframe.stepSeconds,
    rounds: { complete: rounds.complete, skipped: rounds.skipped },
    providers,
    headToHead,
    buckets,
  };
}

// The longest window the section offers, so any region it can show is listed.
const filtersLookbackSeconds = Math.max(
  ...sendLandingTimeframeOptions.map((option) => option.durationSeconds),
);

export async function getSendLandingFilters(
  config: SendLandingConfig,
): Promise<SendLandingFiltersResponse> {
  const params = { lookback: filtersLookbackSeconds };
  const [regionRows, providerRows] = await Promise.all([
    queryClickHouse<{ region: string }>(
      config,
      `SELECT DISTINCT region FROM benchmark_send_rounds FINAL
       WHERE status = 'complete'
         AND started_utc >= now64(9, 'UTC') - INTERVAL {lookback:UInt32} SECOND`,
      params,
    ),
    queryClickHouse<{ provider: string }>(
      config,
      `SELECT DISTINCT provider FROM benchmark_send_attempts FINAL
       WHERE started_utc >= now64(9, 'UTC') - INTERVAL {lookback:UInt32} SECOND`,
      params,
    ),
  ]);
  if (
    !regionRows.every((row) => typeof row.region === "string") ||
    !providerRows.every((row) => typeof row.provider === "string")
  )
    throw new Error("Invalid send benchmark filters");
  return {
    regions: sortSendLandingRegions(
      regionRows.map((row) => normalizeSendLandingRegion(row.region)),
    ),
    providers: [
      ...new Set(
        providerRows.map((row) => normalizeProviderName(row.provider)),
      ),
    ].sort(),
  };
}

async function queryClickHouse<T>(
  config: SendLandingConfig,
  query: string,
  params: Record<string, string | number> = {},
): Promise<T[]> {
  const url = new URL(config.url);
  url.search = "";
  url.hash = "";
  url.searchParams.set("database", config.database);
  url.searchParams.set("readonly", "2");
  url.searchParams.set("max_execution_time", "15");
  url.searchParams.set("max_memory_usage", "536870912");
  url.searchParams.set("max_result_rows", "100000");
  url.searchParams.set("result_overflow_mode", "throw");
  // Counts are UInt64, which JSON quotes by default.
  url.searchParams.set("output_format_json_quote_64bit_integers", "0");
  for (const [key, value] of Object.entries(params))
    url.searchParams.set(`param_${key}`, String(value));
  const response = await fetch(url, {
    method: "POST",
    body: `${query}\nFORMAT JSON`,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(20_000),
    headers: {
      "Content-Type": "text/plain",
      Authorization: `Basic ${Buffer.from(`${config.user}:${config.password}`).toString("base64")}`,
    },
  });
  // Keep endpoint details, SQL, and upstream error text out of public responses/logs.
  if (!response.ok)
    throw new Error(`Send benchmark query failed (${response.status})`);
  const result = (await response.json()) as { data?: T[] };
  if (!Array.isArray(result.data))
    throw new Error("Invalid send benchmark response");
  return result.data;
}
