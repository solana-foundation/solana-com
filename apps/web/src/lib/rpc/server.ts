import "server-only";

import {
  defaultRpcInfra,
  defaultRpcMethod,
  getDefaultRpcRegion,
  getRpcErrorKindOption,
  getRpcInfraSourceValue,
  getRpcRegionSourceValue,
  getRpcTimeframeOption,
  isRpcLatencyInfra,
  isRpcLatencyRegion,
  normalizeRpcInfraParam,
  normalizeRpcRegionParam,
  parseRpcInfra,
  parseRpcMethod,
  parseRpcRegion,
  parseRpcTimeframe,
  rpcInfraOptions,
  rpcRegionOptions,
  type MetricRow,
  type MetricRowDetail,
  type RpcLatencyInfra,
  type RpcLatencyFiltersResponse,
  type RpcLatencyMethod,
  type RpcLatencyRegion,
  type RpcTimeframe,
} from "@/app/[locale]/data/data-config";

const ENV_KEYS = {
  baseUrl: "RPC_LATENCY_GRAFANA_BASE_URL",
  token: "RPC_LATENCY_GRAFANA_API_TOKEN",
} as const;

const QUERY_API_PATH = "/api/v1/query";
const QUERY_RANGE_API_PATH = "/api/v1/query_range";
const RPC_LATENCY_QUANTILE_RANGE = "1h";
const MS_PER_SECOND = 1000;

export const rpcLatencyProviders = [
  "alchemy",
  "helius",
  "quicknode",
  "triton",
] as const;

export type RpcLatencyProvider = (typeof rpcLatencyProviders)[number];

export type RpcLatencyQueryOptions = {
  infra?: RpcLatencyInfra;
  method?: RpcLatencyMethod;
  provider?: RpcLatencyProvider;
  region?: RpcLatencyRegion;
  timeframe?: RpcTimeframe;
};

export type RpcLatencyConfig = {
  baseUrl: string;
  token: string;
};

export type RpcLatencyFilterOptions = RpcLatencyFiltersResponse;

type RpcLatencyConfigError = {
  invalidEnv: string[];
  missingEnv: string[];
};

type PrometheusResponse<T> = {
  data?: {
    result?: T[];
    resultType?: string;
  };
  error?: string;
  errorType?: string;
  status?: string;
};

type PrometheusInstantResult = {
  metric?: Record<string, unknown>;
  value?: [number | string, string];
};

type PrometheusRangeResult = {
  metric?: Record<string, unknown>;
  values?: Array<[number | string, string]>;
};

type RpcLatencyRowsResult = {
  generatedAt: string;
  rows: MetricRow[];
  truncated: boolean;
};

type PrometheusLabelMatcher = readonly [
  key: string,
  operator: "=" | "=~",
  value: string,
];

const providerSet = new Set<string>(rpcLatencyProviders);

export function getRpcLatencyConfig():
  | { ok: true; config: RpcLatencyConfig }
  | ({ ok: false } & RpcLatencyConfigError) {
  const baseUrlRaw = readEnv(ENV_KEYS.baseUrl);
  const token = readEnv(ENV_KEYS.token);
  const baseUrl = baseUrlRaw ? normalizeBaseUrl(baseUrlRaw) : undefined;
  const missingEnv = getMissingConfigEnv({ baseUrlRaw, token });
  const invalidEnv = getInvalidConfigEnv({ baseUrl, baseUrlRaw });

  if (missingEnv.length > 0 || invalidEnv.length > 0 || !baseUrl || !token) {
    return { ok: false, invalidEnv, missingEnv };
  }

  return {
    ok: true,
    config: {
      baseUrl,
      token,
    },
  };
}

export function parseRpcLatencyQueryOptions(params: URLSearchParams): Required<
  Omit<RpcLatencyQueryOptions, "provider">
> & {
  provider?: RpcLatencyProvider;
} {
  const infra = parseRpcInfra(params.get("infra"));

  return {
    infra,
    method: parseRpcMethod(params.get("method")),
    provider: parseAllowedValue(params.get("provider"), providerSet) as
      | RpcLatencyProvider
      | undefined,
    region: parseRpcRegion(params.get("region"), infra),
    timeframe: parseRpcTimeframe(params.get("timeframe")),
  };
}

export function getRpcLatencyCacheKey(
  config: RpcLatencyConfig,
  options: RpcLatencyQueryOptions,
) {
  const timeframe = getRpcTimeframeOption(options.timeframe);

  return [
    config.baseUrl,
    options.infra,
    options.method,
    options.provider ?? "all",
    options.region,
    timeframe.value,
    timeframe.durationSeconds,
    timeframe.stepSeconds,
    buildRpcErrorRateQuery(options),
    buildRpcErrorRateBreakdownQuery(options),
    buildRpcAvgLatencyQuery(options),
    buildRpcP50LatencyQuery(options),
    buildRpcP95LatencyQuery(options),
    buildRpcP99LatencyQuery(options),
  ].join("|");
}

export async function getRpcLatencyFilterOptions(
  config: RpcLatencyConfig,
): Promise<RpcLatencyFilterOptions> {
  const results = await queryPrometheus<PrometheusInstantResult>(
    config,
    QUERY_API_PATH,
    { query: "count by (infra, region) (rpc_up)" },
  );
  const availableRegions = new Map<RpcLatencyInfra, Set<RpcLatencyRegion>>();

  for (const result of results) {
    const infra = normalizeRpcInfraParam(
      getMetricLabel(result.metric, "infra"),
    );
    const region = normalizeRpcRegionParam(
      getMetricLabel(result.metric, "region"),
    );

    if (!isRpcLatencyInfra(infra) || !isRpcLatencyRegion(region)) {
      continue;
    }

    const regions = availableRegions.get(infra) ?? new Set();

    regions.add(region);
    availableRegions.set(infra, regions);
  }

  return {
    regionsByInfra: Object.fromEntries(
      rpcInfraOptions.map((infraOption) => [
        infraOption.value,
        rpcRegionOptions
          .filter((regionOption) =>
            availableRegions.get(infraOption.value)?.has(regionOption.value),
          )
          .map((regionOption) => regionOption.value),
      ]),
    ) as RpcLatencyFilterOptions["regionsByInfra"],
  };
}

export async function getRpcLatencyMetricRows(
  config: RpcLatencyConfig,
  options: RpcLatencyQueryOptions = {},
): Promise<RpcLatencyRowsResult> {
  const timeframe = getRpcTimeframeOption(options.timeframe);
  const normalizedOptions = {
    infra: options.infra ?? defaultRpcInfra,
    method: options.method ?? defaultRpcMethod,
    provider: options.provider,
    region:
      options.region ?? getDefaultRpcRegion(options.infra ?? defaultRpcInfra),
    timeframe: timeframe.value,
  };
  const end = Math.floor(Date.now() / MS_PER_SECOND);
  const start = end - timeframe.durationSeconds;
  const [
    errorRateResults,
    errorRateBreakdownResults,
    avgLatencyResults,
    p50LatencyResults,
    p95LatencyResults,
    p99LatencyResults,
  ] = await Promise.all([
    queryPrometheus<PrometheusRangeResult>(config, QUERY_RANGE_API_PATH, {
      end: String(end),
      query: buildRpcErrorRateQuery(normalizedOptions),
      start: String(start),
      step: String(timeframe.stepSeconds),
    }),
    queryPrometheus<PrometheusRangeResult>(config, QUERY_RANGE_API_PATH, {
      end: String(end),
      query: buildRpcErrorRateBreakdownQuery(normalizedOptions),
      start: String(start),
      step: String(timeframe.stepSeconds),
    }),
    queryPrometheus<PrometheusInstantResult>(config, QUERY_API_PATH, {
      query: buildRpcAvgLatencyQuery(normalizedOptions),
    }),
    queryPrometheus<PrometheusRangeResult>(config, QUERY_RANGE_API_PATH, {
      end: String(end),
      query: buildRpcP50LatencyQuery(normalizedOptions),
      start: String(start),
      step: String(timeframe.stepSeconds),
    }),
    queryPrometheus<PrometheusRangeResult>(config, QUERY_RANGE_API_PATH, {
      end: String(end),
      query: buildRpcP95LatencyQuery(normalizedOptions),
      start: String(start),
      step: String(timeframe.stepSeconds),
    }),
    queryPrometheus<PrometheusRangeResult>(config, QUERY_RANGE_API_PATH, {
      end: String(end),
      query: buildRpcP99LatencyQuery(normalizedOptions),
      start: String(start),
      step: String(timeframe.stepSeconds),
    }),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    rows: [
      ...toErrorRateMetricRows(errorRateResults, errorRateBreakdownResults),
      ...toInstantMetricRows(avgLatencyResults, "RPC Avg Latency"),
      ...toRangeMetricRows(p50LatencyResults, "RPC P50 Latency"),
      ...toRangeMetricRows(p95LatencyResults, "RPC P95 Latency"),
      ...toRangeMetricRows(p99LatencyResults, "RPC P99 Latency"),
    ],
    truncated: false,
  };
}

export function buildRpcErrorRateQuery(options: RpcLatencyQueryOptions = {}) {
  const eligibleSelector = buildLabelSelector(options, [
    ["status", "=~", "success|error"],
  ]);
  const errorSelector = buildLabelSelector(options, [["status", "=", "error"]]);
  const eligibleRate = `sum by (provider)(rate(rpc_requests_total${eligibleSelector}[5m]))`;
  const errorRate = `sum by (provider)(rate(rpc_requests_total${errorSelector}[5m]))`;

  return [
    "100 *",
    `((${errorRate}) or on(provider) (0 * ${eligibleRate}))`,
    "/",
    eligibleRate,
  ].join(" ");
}

export function buildRpcErrorRateBreakdownQuery(
  options: RpcLatencyQueryOptions = {},
) {
  const eligibleSelector = buildLabelSelector(options, [
    ["status", "=~", "success|error"],
  ]);
  const errorSelector = buildLabelSelector(options, [["status", "=", "error"]]);

  return [
    "100 *",
    `sum by (provider, error_kind)(rate(rpc_requests_total${errorSelector}[5m]))`,
    "/ on(provider) group_left",
    `sum by (provider)(rate(rpc_requests_total${eligibleSelector}[5m]))`,
  ].join(" ");
}

export function buildRpcAvgLatencyQuery(options: RpcLatencyQueryOptions = {}) {
  const selector = buildLabelSelector(options, [["status", "=", "success"]]);

  return [
    "1000 *",
    `sum by (provider)(rate(rpc_latency_seconds_sum${selector}[5m]))`,
    "/",
    `sum by (provider)(rate(rpc_latency_seconds_count${selector}[5m]))`,
  ].join(" ");
}

export function buildRpcP99LatencyQuery(options: RpcLatencyQueryOptions = {}) {
  return buildRpcQuantileLatencyQuery(0.99, options);
}

export function buildRpcP95LatencyQuery(options: RpcLatencyQueryOptions = {}) {
  return buildRpcQuantileLatencyQuery(0.95, options);
}

export function buildRpcP50LatencyQuery(options: RpcLatencyQueryOptions = {}) {
  return buildRpcQuantileLatencyQuery(0.5, options);
}

function buildRpcQuantileLatencyQuery(
  quantile: number,
  options: RpcLatencyQueryOptions,
) {
  const selector = buildLabelSelector(options, [["status", "=", "success"]]);

  return [
    `1000 * histogram_quantile(${quantile.toFixed(2)},`,
    `sum by (le, provider)(rate(rpc_latency_seconds_bucket${selector}[${RPC_LATENCY_QUANTILE_RANGE}])))`,
  ].join(" ");
}

function buildLabelSelector(
  {
    infra = defaultRpcInfra,
    method = defaultRpcMethod,
    provider,
    region = getDefaultRpcRegion(infra),
  }: RpcLatencyQueryOptions,
  extraMatchers: readonly PrometheusLabelMatcher[] = [],
) {
  const matchers: PrometheusLabelMatcher[] = [
    ["method", "=", method],
    ["region", "=~", getRpcRegionMatcher(infra, region)],
    ["infra", "=~", getRpcInfraMatcher(infra)],
  ];

  if (provider) {
    matchers.push(["provider", "=", provider]);
  }

  matchers.push(...extraMatchers);

  return `{${matchers.map(formatLabelMatcher).join(",")}}`;
}

function getRpcInfraMatcher(infra: RpcLatencyInfra) {
  return getRpcInfraSourceValue(infra);
}

function getRpcRegionMatcher(infra: RpcLatencyInfra, region: RpcLatencyRegion) {
  return getRpcRegionSourceValue(infra, region);
}

function formatLabelMatcher([key, operator, value]: PrometheusLabelMatcher) {
  return `${key}${operator}"${escapePrometheusLabelValue(value)}"`;
}

function escapePrometheusLabelValue(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/"/g, '\\"');
}

async function queryPrometheus<T>(
  config: RpcLatencyConfig,
  path: string,
  params: Record<string, string>,
) {
  const url = new URL(`${config.baseUrl}${path}`);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
  });

  const payload = (await response
    .json()
    .catch(() => null)) as PrometheusResponse<T> | null;

  if (!response.ok) {
    throw new RpcLatencyResponseError(
      "Grafana Prometheus request",
      `${response.status} ${response.statusText}`.trim(),
    );
  }

  if (payload?.status !== "success" || !Array.isArray(payload.data?.result)) {
    throw new RpcLatencyResponseError(
      "Grafana Prometheus response",
      payload?.error ?? payload?.errorType ?? "invalid-payload",
    );
  }

  return payload.data.result;
}

function toErrorRateMetricRows(
  errorRateResults: PrometheusRangeResult[],
  breakdownResults: PrometheusRangeResult[],
) {
  const detailsBySample = getErrorRateDetailsBySample(breakdownResults);

  return toRangeMetricRows(errorRateResults, "RPC Error Rate", "Percent").map(
    (row) => {
      const details = detailsBySample.get(
        getMetricSampleKey(row.providerName, row.date),
      );

      return details?.length ? { ...row, details } : row;
    },
  );
}

function getErrorRateDetailsBySample(results: PrometheusRangeResult[]) {
  const detailsBySample = new Map<string, MetricRowDetail[]>();

  for (const result of results) {
    const providerName = getProviderLabel(result.metric);
    const errorKind = getMetricLabel(result.metric, "error_kind");

    if (!providerName || !errorKind || !Array.isArray(result.values)) {
      continue;
    }

    const option = getRpcErrorKindOption(errorKind);
    const detailMetadata = {
      description: option?.description ?? `The monitor reported ${errorKind}.`,
      id: errorKind,
      label: option?.label ?? formatErrorKindLabel(errorKind),
    };

    for (const [timestamp, value] of result.values) {
      const date = normalizePrometheusTimestamp(timestamp);
      const normalizedValue = normalizePrometheusNumber(value);

      if (
        !date ||
        typeof normalizedValue !== "number" ||
        normalizedValue <= 0
      ) {
        continue;
      }

      const key = getMetricSampleKey(providerName, date);
      const details = detailsBySample.get(key) ?? [];

      details.push({ ...detailMetadata, value: normalizedValue });
      detailsBySample.set(key, details);
    }
  }

  for (const details of detailsBySample.values()) {
    details.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  }

  return detailsBySample;
}

function getMetricSampleKey(providerName: string, date: string) {
  return `${providerName}\u0000${date}`;
}

function formatErrorKindLabel(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toInstantMetricRows(
  results: PrometheusInstantResult[],
  metricName: string,
  unit = "Milliseconds",
): MetricRow[] {
  return results.flatMap((result) => {
    const providerName = getProviderLabel(result.metric);
    const sample = result.value;

    if (!providerName || !sample) {
      return [];
    }

    return toMetricRow({
      metricName,
      providerName,
      timestamp: sample[0],
      unit,
      value: sample[1],
    });
  });
}

function toRangeMetricRows(
  results: PrometheusRangeResult[],
  metricName: string,
  unit = "Milliseconds",
): MetricRow[] {
  return results.flatMap((result) => {
    const providerName = getProviderLabel(result.metric);

    if (!providerName || !Array.isArray(result.values)) {
      return [];
    }

    return result.values.flatMap(([timestamp, value]) =>
      toMetricRow({
        metricName,
        providerName,
        timestamp,
        unit,
        value,
      }),
    );
  });
}

function toMetricRow({
  metricName,
  providerName,
  timestamp,
  unit,
  value,
}: {
  metricName: string;
  providerName: string;
  timestamp: number | string;
  unit: string;
  value: string;
}): MetricRow[] {
  const normalizedDate = normalizePrometheusTimestamp(timestamp);
  const normalizedValue = normalizePrometheusNumber(value);

  if (!normalizedDate || typeof normalizedValue !== "number") {
    return [];
  }

  return [
    {
      date: normalizedDate,
      metricName,
      providerName,
      unit,
      value: normalizedValue,
    },
  ];
}

function getProviderLabel(metric: Record<string, unknown> | undefined) {
  const provider = getMetricLabel(metric, "provider");

  return provider && providerSet.has(provider) ? provider : undefined;
}

function getMetricLabel(
  metric: Record<string, unknown> | undefined,
  label: string,
) {
  const value = metric?.[label];

  return typeof value === "string" ? value : undefined;
}

function normalizePrometheusTimestamp(value: number | string) {
  const seconds = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(seconds)) {
    return undefined;
  }

  return new Date(seconds * MS_PER_SECOND).toISOString();
}

function normalizePrometheusNumber(value: string) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseAllowedValue<T extends string>(
  value: string | null | undefined,
  allowedValues: ReadonlySet<string>,
  fallback?: T,
) {
  if (value && allowedValues.has(value)) {
    return value as T;
  }

  return fallback;
}

function normalizeBaseUrl(value: string) {
  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return undefined;
    }

    url.hash = "";
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";

    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

function getInvalidConfigEnv({
  baseUrl,
  baseUrlRaw,
}: {
  baseUrl?: string;
  baseUrlRaw?: string;
}) {
  const invalidEnv: string[] = [];

  if (baseUrlRaw && !baseUrl) {
    invalidEnv.push(ENV_KEYS.baseUrl);
  }

  return invalidEnv;
}

function getMissingConfigEnv({
  baseUrlRaw,
  token,
}: {
  baseUrlRaw?: string;
  token?: string;
}) {
  const missingEnv: string[] = [];

  if (!baseUrlRaw) {
    missingEnv.push(ENV_KEYS.baseUrl);
  }

  if (!token) {
    missingEnv.push(ENV_KEYS.token);
  }

  return missingEnv;
}

function readEnv(key: string) {
  const value = process.env[key]?.trim();

  if (!value || isPlaceholderValue(value)) {
    return undefined;
  }

  return value;
}

function isPlaceholderValue(value: string) {
  const lowerValue = value.toLowerCase();

  return (
    value.startsWith("<") ||
    lowerValue.startsWith("your_") ||
    lowerValue === "changeme" ||
    lowerValue === "todo"
  );
}

export class RpcLatencyResponseError extends Error {
  constructor(context: string, reason: string) {
    super(`${context} returned ${reason}`);
    this.name = "RpcLatencyResponseError";
  }
}
