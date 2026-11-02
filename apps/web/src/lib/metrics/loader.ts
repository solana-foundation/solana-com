import "server-only";

import type { MetricRow } from "@/app/[locale]/data/data-config";
import { getDataApiConfig } from "@/lib/databricks/server";
import { getMetricsData } from "@/lib/databricks/metrics-data";
import { fetchRwaStats, type RwaStatsResult } from "@/lib/tokens/rwa-stats";
import { computeDataApiMetric } from "./data-api";
import {
  fetchExternalMetric,
  type ExternalLiveSpec,
  type ExternalValue,
} from "./external";
import {
  getMetricDefinition,
  type MetricDefinition,
  type MetricKey,
} from "./registry";

/**
 * `live`: fresh from its source. `stale`: from its source, but the latest data
 * is older than expected. `fallback`: the source failed, so the registry's
 * dated snapshot is shown. `snapshot`: a curated value with no live source.
 */
export type MetricStatus = "live" | "stale" | "fallback" | "snapshot";

export type ResolvedMetric = {
  key: MetricKey;
  value: number;
  /** Date (YYYY-MM-DD) the value describes; the window end for trailing periods. */
  asOf: string;
  status: MetricStatus;
  definition: MetricDefinition;
};

/** Daily data-api rows land the next day; allow a short pipeline delay. */
const DATA_API_STALE_AFTER_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

type SourceLoaders = {
  dataApiRows: () => Promise<readonly MetricRow[]>;
  rwaStats: () => Promise<RwaStatsResult>;
  /** DefiLlama and Solana RPC values, one request per spec. */
  external: (spec: ExternalLiveSpec) => Promise<ExternalValue>;
  today: () => string;
};

const defaultSources: SourceLoaders = {
  dataApiRows: async () => {
    const config = getDataApiConfig();

    if (!config.ok) {
      throw new Error(
        `data-api is not configured (${[...config.missingEnv, ...config.invalidEnv].join(", ")})`,
      );
    }

    return (await getMetricsData(config.config)).rows;
  },
  rwaStats: () => fetchRwaStats(),
  external: fetchExternalMetric,
  today: () => new Date().toISOString().slice(0, 10),
};

/**
 * Resolves registry metrics for a page. Each upstream source is requested at
 * most once per call, and every failure degrades to that metric's dated
 * snapshot rather than an undated or missing number.
 */
export async function loadMetrics<const K extends MetricKey>(
  keys: readonly K[],
  sources: SourceLoaders = defaultSources,
): Promise<Record<K, ResolvedMetric>> {
  const definitions = keys.map(
    (key) => [key, getMetricDefinition(key)] as const,
  );
  const needs = new Set(definitions.map(([, def]) => def.live?.provider));
  const [dataApiRows, rwaStats] = await Promise.all([
    needs.has("data-api") ? settle(sources.dataApiRows, "data-api") : undefined,
    needs.has("rwa-xyz") ? settle(sources.rwaStats, "RWA.xyz") : undefined,
  ]);
  const externalSpecs = new Map<string, ExternalLiveSpec>();
  for (const [, { live }] of definitions) {
    if (isExternalSpec(live)) externalSpecs.set(JSON.stringify(live), live);
  }
  const externalValues = new Map(
    await Promise.all(
      [...externalSpecs].map(
        async ([id, spec]) =>
          [
            id,
            await settle(
              () => sources.external(spec),
              `${spec.provider} ${spec.query}`,
            ),
          ] as const,
      ),
    ),
  );
  const today = sources.today();

  return Object.fromEntries(
    definitions.map(([key, definition]) => [
      key,
      resolveMetric(key, definition, {
        dataApiRows,
        rwaStats,
        external: isExternalSpec(definition.live)
          ? externalValues.get(JSON.stringify(definition.live))
          : undefined,
        today,
      }),
    ]),
  ) as Record<K, ResolvedMetric>;
}

function resolveMetric(
  key: MetricKey,
  definition: MetricDefinition,
  context: {
    dataApiRows?: readonly MetricRow[];
    rwaStats?: RwaStatsResult;
    external?: ExternalValue;
    today: string;
  },
): ResolvedMetric {
  const live = definition.live;
  const fallback: ResolvedMetric = {
    key,
    value: definition.snapshot.value,
    asOf: definition.snapshot.asOf,
    status: live ? "fallback" : "snapshot",
    definition,
  };

  if (live?.provider === "data-api" && context.dataApiRows) {
    const result = computeDataApiMetric(live, context.dataApiRows);

    if (!result) {
      return fallback;
    }

    return {
      key,
      value: result.value,
      asOf: result.endDate,
      status:
        daysBetween(result.endDate, context.today) > DATA_API_STALE_AFTER_DAYS
          ? "stale"
          : "live",
      definition,
    };
  }

  if (live?.provider === "rwa-xyz" && context.rwaStats) {
    return {
      key,
      value: context.rwaStats.stats[live.field],
      asOf: context.rwaStats.fetchedAt.slice(0, 10),
      status: "live",
      definition,
    };
  }

  if (isExternalSpec(live) && context.external) {
    return {
      key,
      value: context.external.value,
      asOf: context.external.fetchedAt.slice(0, 10),
      status: "live",
      definition,
    };
  }

  return fallback;
}

function isExternalSpec(
  live: MetricDefinition["live"],
): live is ExternalLiveSpec {
  return live?.provider === "defillama" || live?.provider === "solana-rpc";
}

async function settle<T>(load: () => Promise<T>, label: string) {
  try {
    return await load();
  } catch (error) {
    console.error(`[metrics] ${label} unavailable, using snapshots:`, error);
    return undefined;
  }
}

function daysBetween(from: string, to: string) {
  return (
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS
  );
}
