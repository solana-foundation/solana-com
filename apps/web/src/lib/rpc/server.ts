import "server-only";

import {
  defaultRpcMethod,
  defaultRpcRegion,
  rpcMethodOptions,
  rpcRegionOptions,
  type MetricRow,
  type RpcLatencyMethod,
  type RpcLatencyRegion,
} from "@/app/[locale]/data/data-config";

const ENV_KEYS = {
  baseUrl: "RPC_LATENCY_GRAFANA_BASE_URL",
  token: "RPC_LATENCY_GRAFANA_API_TOKEN",
} as const;

const QUERY_API_PATH = "/api/v1/query";
const QUERY_RANGE_API_PATH = "/api/v1/query_range";
const RANGE_HOURS = 6;
const RANGE_STEP_SECONDS = 3600;
const MS_PER_SECOND = 1000;

export const rpcLatencyProviders = [
  "alchemy",
  "helius",
  "quicknode",
  "triton",
] as const;

export type RpcLatencyProvider = (typeof rpcLatencyProviders)[number];

export type RpcLatencyQueryOptions = {
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

const providerSet = new Set<string>(rpcLatencyProviders);
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
    method: parseAllowedValue(
      params.get("method"),
      methodSet,
      defaultRpcMethod,
    ) as RpcLatencyMethod,
    provider: parseAllowedValue(params.get("provider"), providerSet) as
      | RpcLatencyProvider
      | undefined,
    region: parseAllowedValue(
      params.get("region"),
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
    method: options.method ?? defaultRpcMethod,
    provider: options.provider,
    region: options.region ?? defaultRpcRegion,
  };
  const end = Math.floor(Date.now() / MS_PER_SECOND);
  const start = end - RANGE_HOURS * 60 * 60;
  const [avgLatencyResults, p99LatencyResults] = await Promise.all([
    queryPrometheus<PrometheusInstantResult>(config, QUERY_API_PATH, {
      query: buildRpcAvgLatencyQuery(normalizedOptions),
    }),
    queryPrometheus<PrometheusRangeResult>(config, QUERY_RANGE_API_PATH, {
      end: String(end),
      query: buildRpcP99LatencyQuery(normalizedOptions),
      start: String(start),
      step: String(RANGE_STEP_SECONDS),
    }),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    rows: [
      ...toInstantMetricRows(avgLatencyResults, "RPC Avg Latency"),
      ...toRangeMetricRows(p99LatencyResults, "RPC P99 Latency"),
    ],
    truncated: false,
  };
}

export function buildRpcAvgLatencyQuery(options: RpcLatencyQueryOptions = {}) {
  const selector = buildLabelSelector(options);

  return [
    "1000 *",
    `sum by (provider)(rate(rpc_latency_seconds_sum${selector}[5m]))`,
    "/",
    `sum by (provider)(rate(rpc_latency_seconds_count${selector}[5m]))`,
  ].join(" ");
}

export function buildRpcP99LatencyQuery(options: RpcLatencyQueryOptions = {}) {
  const selector = buildLabelSelector(options);

  return [
    "1000 * histogram_quantile(0.99,",
    `sum by (le, provider)(rate(rpc_latency_seconds_bucket${selector}[1h])))`,
  ].join(" ");
}

function buildLabelSelector({
  method = defaultRpcMethod,
  provider,
  region = defaultRpcRegion,
}: RpcLatencyQueryOptions) {
  const labels = [
    ["method", method],
    ["region", region],
    provider ? ["provider", provider] : undefined,
  ].filter((label): label is [string, string] => Boolean(label));

  return `{${labels.map(([key, value]) => `${key}="${value}"`).join(",")}}`;
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
      value: sample[1],
    });
  });
}

function toRangeMetricRows(
  results: PrometheusRangeResult[],
  metricName: string,
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
        value,
      }),
    );
  });
}

function toMetricRow({
  metricName,
  providerName,
  timestamp,
  value,
}: {
  metricName: string;
  providerName: string;
  timestamp: number | string;
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
      unit: "Milliseconds",
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

    if (url.protocol !== "https:" && url.protocol !== "http:") {
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
