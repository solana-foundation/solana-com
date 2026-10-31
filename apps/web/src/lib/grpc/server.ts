import "server-only";

import {
  getRpcTimeframeOption,
  normalizeProviderName,
  type DataApiResponse,
  type MetricRow,
} from "@/app/[locale]/data/data-config";
import {
  parseGrpcCommitment,
  parseGrpcStream,
  parseGrpcTimeframe,
  type GrpcFiltersResponse,
} from "@/app/[locale]/data/grpc-config";

export type GrpcConfig = {
  url: string;
  database: string;
  user: string;
  password: string;
};
export type GrpcQueryOptions = ReturnType<typeof parseGrpcQueryOptions>;

export function getGrpcConfig(): GrpcConfig | undefined {
  const url = process.env.GRPC_BENCHMARK_CLICKHOUSE_URL?.trim();
  const database = process.env.GRPC_BENCHMARK_CLICKHOUSE_DATABASE?.trim();
  const user = process.env.GRPC_BENCHMARK_CLICKHOUSE_USER?.trim();
  const password = process.env.GRPC_BENCHMARK_CLICKHOUSE_PASSWORD;
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

export function parseGrpcQueryOptions(params: URLSearchParams) {
  return {
    region: params.get("region")?.trim().slice(0, 128) || "all",
    cloudProvider: params.get("cloud")?.trim().slice(0, 128) || "all",
    stream: parseGrpcStream(params.get("stream")),
    commitment: parseGrpcCommitment(params.get("commitment")),
    timeframe: parseGrpcTimeframe(params.get("timeframe")),
  };
}

// Match the benchmark's publication rules: select the latest generation, then
// reject it if later writes, missing expected rows, or an incomplete marker exist.
// Bound both edges to completed minutes; raw events are intentionally not queried.
export function committedGrpcMinutes(
  timeFilter: string,
  locationFilter: string,
) {
  return `SELECT c.region, c.cloud_provider, c.bucket, c.generation FROM
    (SELECT region, cloud_provider, bucket, max(commits.generation) AS generation,
      argMax(commits.revision, commits.generation) AS revision
     FROM benchmark_rollup_commits AS commits WHERE ${timeFilter} AND ${locationFilter}
     GROUP BY region, cloud_provider, bucket) AS c
    LEFT JOIN
    (SELECT region, cloud_provider, bucket, sum(revision) AS revision,
      sum(expected) AS expected, sum(incomplete) AS incomplete
     FROM benchmark_dirty_minutes WHERE ${timeFilter} AND ${locationFilter}
     GROUP BY region, cloud_provider, bucket) AS d
    ON c.region = d.region AND c.cloud_provider = d.cloud_provider AND c.bucket = d.bucket
    WHERE c.revision >= d.revision AND d.revision >= d.expected AND d.incomplete = 0`;
}

const grpcCloudFilter =
  "({cloudProvider:String} = 'all' OR cloud_provider = {cloudProvider:String})";

// Slots have one stream for all lifecycle statuses, stored as processed.
// Apply the selected commitment only to account and transaction streams;
// retired finalized slot duplicates must never enter metrics or outages.
const grpcCommitmentFilter =
  "((data_type = 'slot' AND commitment = 'processed') OR (data_type != 'slot' AND commitment = {commitment:String}))";

export function buildGrpcDataQuery() {
  const timeFilter =
    "bucket >= toDateTime({start:UInt32}, 'UTC') AND bucket < toDateTime({end:UInt32}, 'UTC')";
  const locationFilter = `({region:String} = 'all' OR region = {region:String}) AND ${grpcCloudFilter}`;
  return `WITH
    (SELECT groupArray(tuple(region, cloud_provider, bucket, generation))
     FROM (${committedGrpcMinutes(timeFilter, locationFilter)})) AS committed,
    selected AS (
      SELECT bucket, provider, delivered, missed, lag_sum, percentiles FROM benchmark_minute_rollups
      WHERE ${timeFilter} AND ${locationFilter} AND kind = 'provider'
        AND ({stream:String} = 'all' OR data_type = {stream:String})
        AND ${grpcCommitmentFilter}
        AND (region, cloud_provider, bucket, generation) IN
          (SELECT arrayJoin(committed))
    )
    SELECT provider, toUnixTimestamp(toStartOfInterval(bucket, INTERVAL {step:UInt32} SECOND)) AS timestamp,
      grouping(bucket) AS entire_period,
      quantilesTDigestIfMerge(0.001, 0.01, 0.05, 0.5, 0.95, 0.99, 0.999)(percentiles) AS quantiles,
      if(sum(delivered) > 0, quantiles[4] / 1e6, NULL) AS p50_ms,
      if(sum(delivered) > 0, quantiles[5] / 1e6, NULL) AS p95_ms,
      if(sum(delivered) > 0, quantiles[6] / 1e6, NULL) AS p99_ms,
      if(sum(delivered) > 0, quantiles[7] / 1e6, NULL) AS p999_ms,
      toFloat64(sum(lag_sum)) / nullIf(sum(delivered), 0) / 1e6 AS avg_ms,
      toFloat64(sum(missed)) AS missed_updates
    FROM (SELECT toStartOfInterval(bucket, INTERVAL {step:UInt32} SECOND) AS bucket,
      provider, delivered, missed, lag_sum, percentiles FROM selected)
    GROUP BY GROUPING SETS ((provider, bucket), (provider))
    HAVING sum(delivered) + sum(missed) > 0
    ORDER BY entire_period, timestamp, provider`;
}

type GrpcResult = {
  provider: string;
  timestamp: number;
  entire_period: number;
  p50_ms: number | null;
  p95_ms: number | null;
  p99_ms: number | null;
  p999_ms: number | null;
  avg_ms: number | null;
  missed_updates: number;
};

const grpcMetricFields = [
  ["p50_ms", "P50"],
  ["p95_ms", "P95"],
  ["p99_ms", "P99"],
  ["p999_ms", "P99.9"],
  ["avg_ms", "Avg"],
] as const;

export async function getGrpcMetricRows(
  config: GrpcConfig,
  options: GrpcQueryOptions,
  now = Date.now(),
  includeConnections = false,
): Promise<DataApiResponse> {
  const timeframe = getRpcTimeframeOption(options.timeframe);
  const end = Math.floor(now / 60_000) * 60;
  const [results, connections] = await Promise.all([
    queryClickHouse<GrpcResult>(config, buildGrpcDataQuery(), {
      start: end - timeframe.durationSeconds,
      end,
      step: timeframe.stepSeconds,
      region: options.region,
      cloudProvider: options.cloudProvider,
      stream: options.stream,
      commitment: options.commitment,
    }),
    includeConnections
      ? getGrpcConnectionMetrics(config, options, now)
      : Promise.resolve([]),
  ]);
  const rows: MetricRow[] = results.flatMap((row) => {
    if (!Number.isFinite(row.timestamp) || typeof row.provider !== "string")
      return [];
    const metricRows: MetricRow[] = grpcMetricFields.flatMap(
      ([field, label]) => {
        const value = row[field];
        if (value === null || !Number.isFinite(value) || value < 0) return [];
        return [
          {
            date: new Date(
              (row.entire_period ? end : row.timestamp) * 1000,
            ).toISOString(),
            metricName: row.entire_period
              ? `gRPC ${label} Lag Entire Period`
              : `gRPC ${label} Lag`,
            providerName: normalizeProviderName(row.provider),
            unit: "Milliseconds",
            value,
          },
        ];
      },
    );
    if (Number.isInteger(row.missed_updates) && row.missed_updates >= 0) {
      metricRows.push({
        date: new Date(
          (row.entire_period ? end : row.timestamp) * 1000,
        ).toISOString(),
        providerName: normalizeProviderName(row.provider),
        metricName: row.entire_period
          ? "gRPC Missed Updates"
          : "gRPC Missed Updates Trend",
        unit: "Count",
        value: row.missed_updates,
      });
    }
    return metricRows;
  });
  if (includeConnections) {
    // Match the benchmark: observed providers without recorded outages get zero;
    // connection-only providers remain visible even if they delivered no events.
    const providers = new Map<
      string,
      { downtime: number; reconnects: number }
    >();
    const buckets = new Map<
      string,
      Map<number, { downtime: number; reconnects: number }>
    >();
    for (const row of rows) {
      providers.set(row.providerName, { downtime: 0, reconnects: 0 });
      if (
        row.metricName === "gRPC P50 Lag" ||
        row.metricName === "gRPC Missed Updates Trend"
      ) {
        const providerBuckets = buckets.get(row.providerName) ?? new Map();
        providerBuckets.set(Date.parse(row.date) / 1000, {
          downtime: 0,
          reconnects: 0,
        });
        buckets.set(row.providerName, providerBuckets);
      }
    }
    for (const row of connections) {
      const values = { downtime: row.downtime, reconnects: row.reconnects };
      if (row.entire_period === 1) providers.set(row.provider, values);
      else if (row.entire_period === 2) {
        rows.push({
          date: new Date(row.timestamp * 1000).toISOString(),
          providerName: row.provider,
          metricName: "gRPC Reconnect Event",
          unit: "Count",
          value: row.reconnects,
        });
      } else {
        const providerBuckets = buckets.get(row.provider) ?? new Map();
        providerBuckets.set(row.timestamp, values);
        buckets.set(row.provider, providerBuckets);
      }
    }
    for (const [providerName, values] of providers) {
      const date = new Date(end * 1000).toISOString();
      rows.push({
        date,
        providerName,
        metricName: "gRPC Downtime",
        unit: "Seconds",
        value: values.downtime,
      });
      rows.push({
        date,
        providerName,
        metricName: "gRPC Reconnects",
        unit: "Count",
        value: values.reconnects,
      });
    }
    for (const [providerName, providerBuckets] of buckets) {
      for (const [timestamp, values] of providerBuckets) {
        const date = new Date(timestamp * 1000).toISOString();
        rows.push({
          date,
          providerName,
          metricName: "gRPC Downtime Trend",
          unit: "Seconds",
          value: values.downtime,
        });
        rows.push({
          date,
          providerName,
          metricName: "gRPC Reconnects Trend",
          unit: "Count",
          value: values.reconnects,
        });
      }
    }
  }
  return {
    generatedAt: new Date(now).toISOString(),
    rangeDays: 0,
    rows,
    truncated: false,
  };
}

// Follow the benchmark's downtime rule and one-day connection lookback: an outage
// is downtime if a reconnect attempt was refused (a provider failure right after
// another disconnect) or it lasted at least 10 seconds. A drop whose first
// reconnect succeeds is only a reconnect. Partition by the full subscriber/stream
// identity when combining regions. A reconnect needs an earlier successful
// connection, which may predate the lookback on a long-lived stream.
export function buildGrpcConnectionQuery() {
  const keys =
    "region, cloud_provider, data_type, commitment, subscription_id, provider";
  const local = "('arrival queue full', 'control queue full')";
  const filters = `({region:String} = 'all' OR region = {region:String})
        AND ${grpcCloudFilter}
        AND ({stream:String} = 'all' OR data_type = {stream:String})
        AND ${grpcCommitmentFilter}`;
  return `WITH
    toDateTime64({start:UInt32}, 9, 'UTC') AS range_start,
    toDateTime64({end:UInt32}, 9, 'UTC') AS range_end,
    transitions AS (
      SELECT ${keys}, event_utc, connected,
        NOT connected AND reason NOT IN ${local} AS provider_down,
        lagInFrame(toUInt8(NOT connected AND reason NOT IN ${local}), 1, toUInt8(0)) OVER stream AS previous_provider_down,
        maxIf(event_utc, connected OR reason IN ${local}) OVER before AS outage,
        countIf(connected) OVER before > 0 OR (${keys}) IN (
          SELECT ${keys} FROM benchmark_connection_events
          WHERE ${filters} AND connected AND event_utc < range_start - INTERVAL 1 DAY
        ) AS connected_before,
        NOT lagInFrame(connected, 1, true) OVER stream AS after_disconnect,
        leadInFrame(event_utc, 1, least(now64(9, 'UTC'), range_end + INTERVAL 10 SECOND)) OVER stream AS next_utc
      FROM benchmark_connection_events
      WHERE ${filters}
        AND event_utc >= range_start - INTERVAL 1 DAY
        AND event_utc <= range_end + INTERVAL 10 SECOND
      WINDOW stream AS (PARTITION BY ${keys} ORDER BY event_utc
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING),
      before AS (PARTITION BY ${keys} ORDER BY event_utc
        ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING)
    ), outages AS (
      SELECT ${keys}, min(event_utc) AS start_utc, max(next_utc) AS end_utc,
        max(after_disconnect) AS refused
      FROM transitions WHERE provider_down GROUP BY ${keys}, outage
    ), outage_buckets AS (
      SELECT provider, start_utc, end_utc,
        arrayJoin(range(
          toUInt32(toStartOfInterval(greatest(start_utc, range_start), INTERVAL {step:UInt32} SECOND)),
          toUInt32(least(end_utc, range_end)) + {step:UInt32}, {step:UInt32})) AS timestamp
      FROM outages
      WHERE (refused OR dateDiff('millisecond', start_utc, end_utc) >= 10000)
        AND start_utc < range_end AND end_utc > range_start
    )
    SELECT * FROM (SELECT provider, toUInt32(ifNull(status.timestamp, 0)) AS timestamp,
      grouping(status.timestamp) AS entire_period,
      sum(status.downtime) AS downtime, sum(status.reconnects) AS reconnects FROM (
      SELECT provider, toNullable(timestamp) AS timestamp,
        sum(greatest(0, dateDiff('millisecond',
          greatest(start_utc, range_start, toDateTime64(timestamp, 9, 'UTC')),
          least(end_utc, range_end, toDateTime64(timestamp + {step:UInt32}, 9, 'UTC'))))) / 1000 AS downtime,
        toFloat64(0) AS reconnects
      FROM outage_buckets
      WHERE toDateTime64(timestamp, 9, 'UTC') < least(end_utc, range_end)
      GROUP BY provider, timestamp
      UNION ALL
      SELECT provider, toNullable(toUnixTimestamp(toStartOfInterval(event_utc, INTERVAL {step:UInt32} SECOND))) AS timestamp,
        toFloat64(0) AS downtime,
        toFloat64(countIf(connected AND previous_provider_down AND connected_before AND event_utc >= range_start AND event_utc < range_end)) AS reconnects
      FROM transitions WHERE event_utc >= range_start AND event_utc < range_end GROUP BY provider, timestamp
      UNION ALL
      SELECT DISTINCT provider, CAST(NULL AS Nullable(UInt32)) AS timestamp, toFloat64(0) AS downtime, toFloat64(0) AS reconnects
      FROM transitions WHERE event_utc < range_end
    ) AS status GROUP BY GROUPING SETS ((provider, status.timestamp), (provider))
    HAVING entire_period = 1 OR isNotNull(status.timestamp)
    UNION ALL
    SELECT provider, toFloat64(toUnixTimestamp64Milli(event_utc)) / 1000 AS timestamp,
      toUInt64(2) AS entire_period, toFloat64(0) AS downtime, toFloat64(count()) AS reconnects
    FROM transitions
    WHERE connected AND previous_provider_down AND connected_before
      AND event_utc >= range_start AND event_utc < range_end
    GROUP BY provider, event_utc)
    ORDER BY entire_period, timestamp, provider`;
}

async function getGrpcConnectionMetrics(
  config: GrpcConfig,
  options: GrpcQueryOptions,
  now: number,
) {
  const end = Math.floor(now / 60_000) * 60;
  const rows = await queryClickHouse<{
    provider: string;
    downtime: number;
    reconnects: number;
    timestamp: number;
    entire_period: number;
  }>(config, buildGrpcConnectionQuery(), {
    start: end - getRpcTimeframeOption(options.timeframe).durationSeconds,
    end,
    step: getRpcTimeframeOption(options.timeframe).stepSeconds,
    region: options.region,
    cloudProvider: options.cloudProvider,
    stream: options.stream,
    commitment: options.commitment,
  });
  if (
    rows.some(
      (row) =>
        typeof row.provider !== "string" ||
        !Number.isFinite(row.downtime) ||
        row.downtime < 0 ||
        !Number.isInteger(row.reconnects) ||
        row.reconnects < 0 ||
        !Number.isFinite(row.timestamp) ||
        (row.entire_period !== 0 &&
          row.entire_period !== 1 &&
          row.entire_period !== 2),
    )
  )
    throw new Error("Invalid gRPC connection metrics");
  return rows.map((row) => ({
    ...row,
    provider: normalizeProviderName(row.provider),
  }));
}

export async function getGrpcFilters(
  config: GrpcConfig,
): Promise<GrpcFiltersResponse> {
  const timeFilter =
    "bucket >= now() - INTERVAL 30 DAY AND bucket < toStartOfMinute(now())";
  const rows = await queryClickHouse<{
    region: string;
    cloud_provider: string;
    provider: string;
    data_type: string;
    commitment: string;
  }>(
    config,
    `SELECT DISTINCT region, cloud_provider, provider, data_type, commitment FROM benchmark_minute_rollups
     WHERE ${timeFilter} AND kind = 'provider'
       AND (data_type != 'slot' OR commitment = 'processed')
       AND (region, cloud_provider, bucket, generation)
       IN (${committedGrpcMinutes(timeFilter, "1")})`,
  );
  const unique = (key: keyof (typeof rows)[number]) =>
    [...new Set(rows.map((row) => row[key]))].sort();
  return {
    regions: unique("region"),
    cloudProviders: unique("cloud_provider"),
    cloudProvidersByRegion: Object.fromEntries(
      unique("region").map((region) => [
        region,
        [
          ...new Set(
            rows
              .filter((row) => row.region === region)
              .map((row) => row.cloud_provider),
          ),
        ].sort(),
      ]),
    ),
    providers: unique("provider").map(normalizeProviderName),
    streams: unique("data_type"),
    commitments: unique("commitment"),
  };
}

async function queryClickHouse<T>(
  config: GrpcConfig,
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
  // Newer servers return grouping() as UInt64, which JSON quotes by default.
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
    throw new Error(`gRPC benchmark query failed (${response.status})`);
  const result = (await response.json()) as { data?: T[] };
  if (!Array.isArray(result.data))
    throw new Error("Invalid gRPC benchmark response");
  return result.data;
}
