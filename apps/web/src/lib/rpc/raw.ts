import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import {
  getRpcInfraSourceValue,
  getRpcRegionSourceValue,
  isRpcLatencyInfra,
  isRpcLatencyRegion,
  rpcMethodOptions,
  type RpcLatencyInfra,
  type RpcLatencyMethod,
  type RpcLatencyRegion,
} from "@/app/[locale]/data/data-config";
import {
  escapePrometheusLabelValue,
  queryPrometheus,
  rpcLatencyProviders,
  type PrometheusRangeResult,
  type RpcLatencyConfig,
  type RpcLatencyProvider,
} from "@/lib/rpc/server";

export const rawTemplates = [
  "latency",
  "latency_buckets",
  "requests",
  "win_rate",
  "claim_checks",
] as const;

export type RawTemplate = (typeof rawTemplates)[number];

export type RawQuery = {
  template: RawTemplate;
  provider?: RpcLatencyProvider;
  method?: RpcLatencyMethod;
  infra?: RpcLatencyInfra;
  region?: RpcLatencyRegion;
  start: number;
  end: number;
  step: number;
  quantiles: number[];
  by: "status" | "error_kind";
  format: "json" | "csv";
};

export type RawSeries = {
  labels: Record<string, string>;
  points?: Array<[number, number]>;
  wins?: number;
  samples?: number;
  winPct?: number;
};

export class RawQueryError extends Error {}

const QUERY_RANGE_API_PATH = "/api/v1/query_range";
const MAX_POINTS = 5000;
const MAX_RANGE_SECONDS = 400 * 24 * 60 * 60;
const MIN_STEP_SECONDS = 60;
const DEFAULT_RANGE_SECONDS = 24 * 60 * 60;
const DEFAULT_TARGET_POINTS = 500;
const DEFAULT_QUANTILES = [0.5, 0.95, 0.99];
const ALLOWED_QUANTILES = new Set([0.5, 0.9, 0.95, 0.99]);

const templateSet = new Set<string>(rawTemplates);
const providerSet = new Set<string>(rpcLatencyProviders);
const methodSet = new Set<string>(
  rpcMethodOptions.map((option) => option.value),
);

export function verifyRawApiToken(
  token: string | undefined,
  secret: string,
): { sub: string } | undefined {
  if (!token) {
    return undefined;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return undefined;
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  const expected = createHmac("sha256", secret)
    .update(`${headerPart}.${payloadPart}`)
    .digest();
  const given = Buffer.from(signaturePart, "base64url");

  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return undefined;
  }

  let header: unknown;
  let payload: unknown;

  try {
    header = JSON.parse(Buffer.from(headerPart, "base64url").toString("utf8"));
    payload = JSON.parse(
      Buffer.from(payloadPart, "base64url").toString("utf8"),
    );
  } catch {
    return undefined;
  }

  if (getField(header, "alg") !== "HS256") {
    return undefined;
  }

  const sub = getField(payload, "sub");
  const exp = getField(payload, "exp");

  if (typeof sub !== "string" || !sub) {
    return undefined;
  }

  if (typeof exp !== "number" || exp * 1000 <= Date.now()) {
    return undefined;
  }

  return { sub };
}

export function parseRawQuery(
  template: string,
  params: URLSearchParams,
): RawQuery {
  if (!templateSet.has(template)) {
    throw new RawQueryError(
      `unknown template "${template}"; expected one of ${rawTemplates.join(", ")}`,
    );
  }

  const provider = parseEnumParam(params, "provider", providerSet) as
    | RpcLatencyProvider
    | undefined;
  const method = parseEnumParam(params, "method", methodSet) as
    | RpcLatencyMethod
    | undefined;
  const infra = parseInfraParam(params);
  const region = parseRegionParam(params, infra);

  if (template === "claim_checks" && (infra || region)) {
    throw new RawQueryError(
      "claim_checks has no infra or region dimension; remove those filters",
    );
  }

  const end = parseTimeParam(params, "end", nowSeconds());
  const start = parseTimeParam(params, "start", end - DEFAULT_RANGE_SECONDS);

  if (start >= end) {
    throw new RawQueryError("start must be before end");
  }

  if (end - start > MAX_RANGE_SECONDS) {
    throw new RawQueryError(
      `range exceeds retention; maximum is ${MAX_RANGE_SECONDS} seconds`,
    );
  }

  const step = parseStepParam(params, end - start);

  if ((end - start) / step > MAX_POINTS) {
    throw new RawQueryError(
      `too many points; keep (end - start) / step at or below ${MAX_POINTS}`,
    );
  }

  return {
    template: template as RawTemplate,
    provider,
    method,
    infra,
    region,
    start,
    end,
    step,
    quantiles: parseQuantilesParam(params),
    by: parseByParam(params),
    format: parseFormatParam(params),
  };
}

export async function runRawQuery(
  config: RpcLatencyConfig,
  query: RawQuery,
): Promise<RawSeries[]> {
  switch (query.template) {
    case "latency":
      return runLatencyQuery(config, query);
    case "latency_buckets":
      return runRangeQuery(
        config,
        query,
        `sum by (provider, le)(increase(rpc_latency_seconds_bucket${buildSelector(query, ['status="success"'])}[${query.step}s]))`,
        ["provider", "le"],
      );
    case "requests":
      return runRequestsQuery(config, query);
    case "win_rate":
      return runWinRateQuery(config, query);
    case "claim_checks":
      return runRangeQuery(
        config,
        query,
        `sum by (provider, method, result)(increase(rpc_claim_check_total${buildSelector(query)}[${query.step}s]))`,
        ["provider", "method", "result"],
      );
  }
}

export function toCsv(series: RawSeries[]): string {
  const labelKeys = [
    ...new Set(series.flatMap((entry) => Object.keys(entry.labels))),
  ].sort();

  if (series.some((entry) => entry.points === undefined)) {
    const rows = series.map((entry) => [
      ...labelKeys.map((key) => entry.labels[key] ?? ""),
      String(entry.wins ?? 0),
      String(entry.samples ?? 0),
      String(entry.winPct ?? 0),
    ]);

    return formatCsv([...labelKeys, "wins", "samples", "win_pct"], rows);
  }

  const rows = series.flatMap((entry) =>
    (entry.points ?? []).map(([timestamp, value]) => [
      new Date(timestamp * 1000).toISOString(),
      ...labelKeys.map((key) => entry.labels[key] ?? ""),
      String(value),
    ]),
  );

  return formatCsv(["timestamp", ...labelKeys, "value"], rows);
}

function runLatencyQuery(config: RpcLatencyConfig, query: RawQuery) {
  const selector = buildSelector(query, ['status="success"']);

  return Promise.all(
    query.quantiles.map((quantile) =>
      runRangeQuery(
        config,
        query,
        `1000 * histogram_quantile(${quantile}, sum by (le, provider)(rate(rpc_latency_seconds_bucket${selector}[${query.step}s])))`,
        ["provider"],
        { quantile: String(quantile) },
      ),
    ),
  ).then((results) => results.flat());
}

function runRequestsQuery(config: RpcLatencyConfig, query: RawQuery) {
  const extraMatchers = query.by === "error_kind" ? ['status="error"'] : [];

  return runRangeQuery(
    config,
    query,
    `sum by (provider, ${query.by})(increase(rpc_requests_total${buildSelector(query, extraMatchers)}[${query.step}s]))`,
    ["provider", query.by],
  );
}

async function runWinRateQuery(config: RpcLatencyConfig, query: RawQuery) {
  const selector = buildSelector(query, ['status="success"']);
  const series = await runRangeQuery(
    config,
    query,
    `1000 * sum by (provider)(rate(rpc_latency_seconds_sum${selector}[${query.step}s])) / sum by (provider)(rate(rpc_latency_seconds_count${selector}[${query.step}s]))`,
    ["provider"],
  );
  const winners = new Map<number, { provider: string; value: number }>();

  for (const entry of series) {
    for (const [timestamp, value] of entry.points ?? []) {
      const current = winners.get(timestamp);

      if (!current || value < current.value) {
        winners.set(timestamp, { provider: entry.labels.provider, value });
      }
    }
  }

  return series.map((entry) => {
    const samples = entry.points?.length ?? 0;
    const wins = (entry.points ?? []).filter(
      ([timestamp]) =>
        winners.get(timestamp)?.provider === entry.labels.provider,
    ).length;

    return {
      labels: entry.labels,
      wins,
      samples,
      winPct: samples ? Math.round((10000 * wins) / samples) / 100 : 0,
    };
  });
}

async function runRangeQuery(
  config: RpcLatencyConfig,
  query: RawQuery,
  promql: string,
  labelKeys: string[],
  extraLabels: Record<string, string> = {},
): Promise<RawSeries[]> {
  const results = await queryPrometheus<PrometheusRangeResult>(
    config,
    QUERY_RANGE_API_PATH,
    {
      end: String(query.end),
      query: promql,
      start: String(query.start),
      step: String(query.step),
    },
  );

  return results.flatMap((result) => {
    const labels: Record<string, string> = { ...extraLabels };

    for (const key of labelKeys) {
      const value = result.metric?.[key];

      if (typeof value !== "string") {
        return [];
      }

      labels[key] = value;
    }

    if (!providerSet.has(labels.provider)) {
      return [];
    }

    const points = (result.values ?? []).flatMap(([timestamp, value]) => {
      const normalizedTimestamp = Number(timestamp);
      const normalizedValue = Number(value);

      return Number.isFinite(normalizedTimestamp) &&
        Number.isFinite(normalizedValue)
        ? [[normalizedTimestamp, normalizedValue] as [number, number]]
        : [];
    });

    return [{ labels, points }];
  });
}

function buildSelector(query: RawQuery, extraMatchers: string[] = []) {
  const matchers = [...extraMatchers];

  if (query.provider) {
    matchers.push(`provider="${escapePrometheusLabelValue(query.provider)}"`);
  }

  if (query.method) {
    matchers.push(`method="${escapePrometheusLabelValue(query.method)}"`);
  }

  if (query.infra) {
    matchers.push(`infra=~"${getRpcInfraSourceValue(query.infra)}"`);

    if (query.region) {
      matchers.push(
        `region=~"${getRpcRegionSourceValue(query.infra, query.region)}"`,
      );
    }
  }

  return matchers.length ? `{${matchers.join(",")}}` : "";
}

function parseEnumParam(
  params: URLSearchParams,
  key: string,
  allowedValues: ReadonlySet<string>,
) {
  const value = params.get(key);

  if (!value) {
    return undefined;
  }

  if (!allowedValues.has(value)) {
    throw new RawQueryError(
      `invalid ${key} "${value}"; expected one of ${[...allowedValues].join(", ")}`,
    );
  }

  return value;
}

function parseInfraParam(params: URLSearchParams) {
  const value = params.get("infra");

  if (!value) {
    return undefined;
  }

  if (!isRpcLatencyInfra(value)) {
    throw new RawQueryError(`invalid infra "${value}"`);
  }

  return value;
}

function parseRegionParam(
  params: URLSearchParams,
  infra: RpcLatencyInfra | undefined,
) {
  const value = params.get("region");

  if (!value) {
    return undefined;
  }

  if (!infra) {
    throw new RawQueryError("region requires infra");
  }

  if (!isRpcLatencyRegion(value)) {
    throw new RawQueryError(`invalid region "${value}"`);
  }

  return value;
}

function parseTimeParam(
  params: URLSearchParams,
  key: string,
  fallback: number,
) {
  const value = params.get(key);

  if (!value) {
    return fallback;
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  const milliseconds = Date.parse(value);

  if (Number.isNaN(milliseconds)) {
    throw new RawQueryError(
      `invalid ${key} "${value}"; use unix seconds or RFC 3339`,
    );
  }

  return Math.floor(milliseconds / 1000);
}

function parseStepParam(params: URLSearchParams, rangeSeconds: number) {
  const value = params.get("step");

  if (!value) {
    return Math.max(
      MIN_STEP_SECONDS,
      Math.ceil(rangeSeconds / DEFAULT_TARGET_POINTS / MIN_STEP_SECONDS) *
        MIN_STEP_SECONDS,
    );
  }

  const step = /^\d+$/.test(value) ? Number(value) : NaN;

  if (!Number.isFinite(step) || step < MIN_STEP_SECONDS) {
    throw new RawQueryError(
      `invalid step "${value}"; use whole seconds, minimum ${MIN_STEP_SECONDS}`,
    );
  }

  return step;
}

function parseQuantilesParam(params: URLSearchParams) {
  const value = params.get("q");

  if (!value) {
    return DEFAULT_QUANTILES;
  }

  const quantiles = value.split(",").map(Number);

  for (const quantile of quantiles) {
    if (!ALLOWED_QUANTILES.has(quantile)) {
      throw new RawQueryError(
        `invalid quantile "${value}"; allowed: ${[...ALLOWED_QUANTILES].join(", ")}`,
      );
    }
  }

  return [...new Set(quantiles)];
}

function parseByParam(params: URLSearchParams) {
  const value = params.get("by") ?? "status";

  if (value !== "status" && value !== "error_kind") {
    throw new RawQueryError(`invalid by "${value}"; use status or error_kind`);
  }

  return value;
}

function parseFormatParam(params: URLSearchParams) {
  const value = params.get("format") ?? "json";

  if (value !== "json" && value !== "csv") {
    throw new RawQueryError(`invalid format "${value}"; use json or csv`);
  }

  return value;
}

function formatCsv(header: string[], rows: string[][]) {
  return [header, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\n");
}

function escapeCsvField(value: string) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function getField(value: unknown, key: string) {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)[key]
    : undefined;
}

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}
