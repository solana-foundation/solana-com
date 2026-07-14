import "server-only";

import {
  defaultRpcInfra,
  defaultRpcMethod,
  defaultRpcRegion,
  getRpcInfraSourceValue,
  getRpcRegionSourceValue,
  normalizeRpcInfraParam,
  normalizeRpcRegionParam,
  rpcInfraOptions,
  rpcLatencyRangeHours,
  rpcMethodOptions,
  rpcRegionOptions,
  type MetricRow,
  type RpcLatencyInfra,
  type RpcLatencyMethod,
  type RpcLatencyRegion,
} from "@/app/[locale]/data/data-config";

const ENV_KEYS = {
  baseUrl: "RPC_LATENCY_GRAFANA_BASE_URL",
  token: "RPC_LATENCY_GRAFANA_API_TOKEN",
} as const;

const QUERY_API_PATH = "/api/v1/query";
const QUERY_RANGE_API_PATH = "/api/v1/query_range";
export const RPC_LATENCY_RANGE_HOURS = rpcLatencyRangeHours;
export const RPC_LATENCY_RANGE_STEP_SECONDS = 3600;
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
};

export type RpcLatencyConfig = {
  baseUrl: string;
  token: string;
};

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
const infraSet = new Set<string>(rpcInfraOptions.map((option) => option.value));
const regionSet = new Set<string>(
  rpcRegionOptions.map((option) => option.value),
);
const methodSet = new Set<string>(
  rpcMethodOptions.map((option) => option.value),
);

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
  return {
    infra: parseAllowedValue(
      normalizeRpcInfraParam(params.get("infra")),
      infraSet,
      defaultRpcInfra,
    ) as RpcLatencyInfra,
    method: parseAllowedValue(
      params.get("method"),
      methodSet,
      defaultRpcMethod,
    ) as RpcLatencyMethod,
    provider: parseAllowedValue(params.get("provider"), providerSet) as
      | RpcLatencyProvider
      | undefined,
    region: parseAllowedValue(
      normalizeRpcRegionParam(params.get("region")),
      regionSet,
      defaultRpcRegion,
    ) as RpcLatencyRegion,
  };
}

export async function getRpcLatencyMetricRows(
  config: RpcLatencyConfig,
  options: RpcLatencyQueryOptions = {},
): Promise<RpcLatencyRowsResult> {
  const normalizedOptions = {
    infra: options.infra ?? defaultRpcInfra,
    method: options.method ?? defaultRpcMethod,
    provider: options.provider,
    region: options.region ?? defaultRpcRegion,
  };
  const end = Math.floor(Date.now() / MS_PER_SECOND);
  const start = end - RPC_LATENCY_RANGE_HOURS * 60 * 60;
  const [
    successRateResults,
    avgLatencyResults,
    p50LatencyResults,
    p95LatencyResults,
    p99LatencyResults,
  ] = await Promise.all([
    queryPrometheus<PrometheusRangeResult>(config, QUERY_RANGE_API_PATH, {
      end: String(end),
      query: buildRpcSuccessRateQuery(normalizedOptions),
      start: String(start),
      step: String(RPC_LATENCY_RANGE_STEP_SECONDS),
    }),
    queryPrometheus<PrometheusInstantResult>(config, QUERY_API_PATH, {
      query: buildRpcAvgLatencyQuery(normalizedOptions),
    }),
    queryPrometheus<PrometheusRangeResult>(config, QUERY_RANGE_API_PATH, {
      end: String(end),
      query: buildRpcP50LatencyQuery(normalizedOptions),
      start: String(start),
      step: String(RPC_LATENCY_RANGE_STEP_SECONDS),
    }),
    queryPrometheus<PrometheusRangeResult>(config, QUERY_RANGE_API_PATH, {
      end: String(end),
      query: buildRpcP95LatencyQuery(normalizedOptions),
      start: String(start),
      step: String(RPC_LATENCY_RANGE_STEP_SECONDS),
    }),
    queryPrometheus<PrometheusRangeResult>(config, QUERY_RANGE_API_PATH, {
      end: String(end),
      query: buildRpcP99LatencyQuery(normalizedOptions),
      start: String(start),
      step: String(RPC_LATENCY_RANGE_STEP_SECONDS),
    }),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    rows: [
      ...toRangeMetricRows(successRateResults, "RPC Success Rate", "Percent"),
      ...toInstantMetricRows(avgLatencyResults, "RPC Avg Latency"),
      ...toRangeMetricRows(p50LatencyResults, "RPC P50 Latency"),
      ...toRangeMetricRows(p95LatencyResults, "RPC P95 Latency"),
      ...toRangeMetricRows(p99LatencyResults, "RPC P99 Latency"),
    ],
    truncated: false,
  };
}

export function buildRpcSuccessRateQuery(options: RpcLatencyQueryOptions = {}) {
  const totalSelector = buildLabelSelector(options);
  const successSelector = buildLabelSelector(options, [
    ["status", "=", "success"],
  ]);
  const totalRate = `sum by (provider)(rate(rpc_requests_total${totalSelector}[5m]))`;
  const successRate = `sum by (provider)(rate(rpc_requests_total${successSelector}[5m]))`;

  return [
    "100 *",
    `((${successRate}) or on(provider) (0 * ${totalRate}))`,
    "/",
    totalRate,
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
    region = defaultRpcRegion,
  }: RpcLatencyQueryOptions,
  extraMatchers: readonly PrometheusLabelMatcher[] = [],
) {
  const matchers: PrometheusLabelMatcher[] = [
    ["method", "=", method],
    ["region", "=~", getRpcRegionMatcher(region)],
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

function getRpcRegionMatcher(region: RpcLatencyRegion) {
  return getRpcRegionSourceValue(region);
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
  const provider = metric?.provider;

  return typeof provider === "string" && providerSet.has(provider)
    ? provider
    : undefined;
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
  value: string | null,
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
