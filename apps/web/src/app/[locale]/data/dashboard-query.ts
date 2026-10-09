import {
  rangeOptions,
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
