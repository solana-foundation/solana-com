import {
  chartDefinitions,
  rangeOptions,
  type ChartDefinition,
  type DashboardTab,
  type ProviderName,
  type RpcLatencyInfra,
  type RpcLatencyMethod,
  type RpcLatencyRegion,
  type RpcTimeframe,
} from "./data-config";
import { defaultRangeDays } from "./dashboard-constants";
import { getProviderScope, updateProvidersParam } from "./dashboard-providers";
import type { QueryUpdates } from "./dashboard-types";

export function applyQueryUpdates(
  params: URLSearchParams,
  updates: QueryUpdates,
  availableProviders: readonly ProviderName[],
) {
  if (updates.tab) {
    const currentTab = parseTab(params.get("tab"));

    if (getProviderScope(currentTab) !== getProviderScope(updates.tab)) {
      params.delete("providers");
    }

    params.set("tab", updates.tab);
  }

  if (updates.days) {
    params.set("days", String(updates.days));
  }

  if (updates.infra) {
    params.set("infra", updates.infra);
  }

  if (updates.method) {
    params.set("method", updates.method);
  }

  if (updates.providers) {
    updateProvidersParam(params, updates.providers, availableProviders);
  }

  if (updates.region) {
    params.set("region", updates.region);
  }

  if (updates.timeframe) {
    params.set("timeframe", updates.timeframe);
  }
}

export function getDashboardUrl(pathname: string, params: URLSearchParams) {
  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

/**
 * Chart links cover the warehouse-data tabs only; the RPC and Tx Senders tabs
 * are live infrastructure views with their own filters and data sources.
 */
export function canLinkToChart(chart: ChartDefinition) {
  return getProviderScope(chart.tab) === "warehouse";
}

/** The chart a `#chart-id` link points at, if the hash names a linkable chart. */
export function getLinkedChart(hash: string): ChartDefinition | undefined {
  // Chart IDs are plain a-z, 0-9, and "-", so the hash is compared as-is.
  // Decoding it would throw on malformed input like "#%E0%A4%A".
  const chartId = hash.replace(/^#/, "");

  return chartId
    ? (chartDefinitions as readonly ChartDefinition[]).find(
        (chart) => chart.id === chartId && canLinkToChart(chart),
      )
    : undefined;
}

// Dashboard settings a shared chart link carries over from the sender's URL.
// Anything else in the URL (e.g. utm_* campaign tags) is left out.
const sharedLinkParams = ["days", "providers"] as const;

/**
 * The shareable link for one chart: its tab, the sender's current range and
 * providers, plus a `#chart-id` anchor.
 */
export function getChartLinkUrl(
  chart: ChartDefinition,
  origin: string,
  pathname: string,
  search: string,
) {
  const current = new URLSearchParams(search);
  const params = new URLSearchParams({ tab: chart.tab });

  for (const key of sharedLinkParams) {
    const value = current.get(key);

    if (value !== null) {
      params.set(key, value);
    }
  }

  return `${origin}${pathname}?${params.toString()}#${chart.id}`;
}

export function getDashboardDataUrl({
  activeTab,
  rpcInfra,
  rangeDays,
  rpcMethod,
  rpcRegion,
  rpcTimeframe,
}: {
  activeTab: DashboardTab;
  rpcInfra: RpcLatencyInfra;
  rangeDays: number;
  rpcMethod: RpcLatencyMethod;
  rpcRegion: RpcLatencyRegion;
  rpcTimeframe: RpcTimeframe;
}) {
  if (activeTab !== "rpc" && activeTab !== "senders") {
    return `/api/databricks/data?days=${rangeDays}`;
  }

  if (activeTab === "senders") {
    const params = new URLSearchParams({
      timeframe: rpcTimeframe,
    });

    return `/api/rpc/sender/data?${params.toString()}`;
  }

  const params = new URLSearchParams({
    infra: rpcInfra,
    method: rpcMethod,
    region: rpcRegion,
    timeframe: rpcTimeframe,
  });

  return `/api/rpc/data?${params.toString()}`;
}

export function parseTab(value: string | null): DashboardTab {
  return value === "network" ||
    value === "stablecoins" ||
    value === "defi" ||
    value === "lending" ||
    value === "rpc" ||
    value === "senders"
    ? value
    : "overview";
}

export function parseRangeDays(value: string | null) {
  const parsed = value ? Number(value) : defaultRangeDays;
  return rangeOptions.some((option) => option.value === parsed)
    ? parsed
    : defaultRangeDays;
}
