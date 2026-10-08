import {
  normalizeProviderName,
  providerColors,
  rpcInfraOptions,
  rpcRegionOptions,
  type DashboardTab,
  type MetricRow,
  type ProviderName,
  type RpcLatencyInfra,
  type RpcLatencyRegion,
} from "./data-config";
import {
  emptyProvidersParam,
  fallbackProviderColors,
} from "./dashboard-constants";
import type { DashboardTranslator } from "./dashboard-types";

export function updateProvidersParam(
  params: URLSearchParams,
  selectedProviders: Set<ProviderName>,
  availableProviders: readonly ProviderName[],
) {
  const nextProviders = getOrderedSelectedProviders(
    selectedProviders,
    availableProviders,
  );

  if (nextProviders.length === 0) {
    params.set("providers", emptyProvidersParam);
  } else if (hasAllProvidersSelected(selectedProviders, availableProviders)) {
    params.delete("providers");
  } else {
    params.set("providers", nextProviders.join(","));
  }
}

export function toggleProvider(
  selectedProviders: Set<ProviderName>,
  provider: ProviderName,
) {
  const nextProviders = new Set(selectedProviders);

  if (nextProviders.has(provider)) {
    nextProviders.delete(provider);
  } else {
    nextProviders.add(provider);
  }

  return nextProviders;
}

export function getFooterProvidersLabel(
  t: DashboardTranslator,
  selectedProviderList: ProviderName[],
  availableProviders: readonly ProviderName[],
  providerParam: string | null,
) {
  if (selectedProviderList.length === 0) {
    return providerParam ? t("footer.noProviders") : t("footer.allProviders");
  }

  if (selectedProviderList.length === availableProviders.length) {
    return t("footer.allProviders");
  }

  return selectedProviderList.join(t("footer.providerListSeparator"));
}

export function getSelectedProviderList(
  selectedProviders: ReadonlySet<ProviderName>,
  availableProviders: readonly ProviderName[],
) {
  return availableProviders.length > 0
    ? getOrderedSelectedProviders(selectedProviders, availableProviders)
    : getOrderedProviderNames(selectedProviders);
}

function getOrderedSelectedProviders(
  selectedProviders: ReadonlySet<ProviderName>,
  availableProviders: readonly ProviderName[],
) {
  return availableProviders.filter((provider) =>
    selectedProviders.has(provider),
  );
}

export function getAvailableProviders(rows: readonly MetricRow[]) {
  return getOrderedProviderNames(rows.map((row) => row.providerName));
}

export function getRowProviderName(row: MetricRow) {
  return normalizeProviderName(row.providerName).trim();
}

export function getOrderedProviderNames(providerNames: Iterable<string>) {
  const providerSet = new Set<ProviderName>();

  for (const providerName of providerNames) {
    const normalizedProviderName = normalizeProviderName(providerName).trim();

    if (normalizedProviderName) {
      providerSet.add(normalizedProviderName);
    }
  }

  return Array.from(providerSet).sort((a, b) => a.localeCompare(b));
}

export function parseProviders(
  value: string | null,
  availableProviders: readonly ProviderName[] = [],
) {
  if (!value) {
    return new Set(availableProviders);
  }

  if (value === emptyProvidersParam) {
    return new Set<ProviderName>();
  }

  const parsedProviders = getOrderedProviderNames(value.split(","));

  if (parsedProviders.length === 0 || availableProviders.length === 0) {
    return new Set(
      parsedProviders.length > 0 ? parsedProviders : availableProviders,
    );
  }

  if (hasInvalidProviderParam(value, availableProviders)) {
    return new Set(availableProviders);
  }

  const availableProviderSet = new Set(availableProviders);
  const selectedProviders = parsedProviders.filter((provider) =>
    availableProviderSet.has(provider),
  );

  return selectedProviders.length > 0
    ? new Set(selectedProviders)
    : new Set(availableProviders);
}

export function hasInvalidProviderParam(
  value: string,
  availableProviders: readonly ProviderName[],
) {
  if (value === emptyProvidersParam || availableProviders.length === 0) {
    return false;
  }

  const parsedProviders = getOrderedProviderNames(value.split(","));
  const availableProviderSet = new Set(availableProviders);

  return (
    parsedProviders.length === 0 ||
    parsedProviders.some((provider) => !availableProviderSet.has(provider))
  );
}

export function getProviderScope(tab: DashboardTab) {
  if (tab === "rpc" || tab === "senders") {
    return tab;
  }

  return "warehouse";
}

export function hasAllProvidersSelected(
  selectedProviders: ReadonlySet<ProviderName>,
  availableProviders: readonly ProviderName[],
) {
  return (
    availableProviders.length > 0 &&
    availableProviders.every((provider) => selectedProviders.has(provider))
  );
}

export function getProviderColor(providerName: ProviderName) {
  return (
    providerColors[providerName] ??
    fallbackProviderColors[getStableColorIndex(providerName)]
  );
}

export function getRpcInfraLabel(value: RpcLatencyInfra) {
  return (
    rpcInfraOptions.find((option) => option.value === value)?.label ?? value
  );
}

export function getRpcRegionLabel(value: RpcLatencyRegion) {
  return (
    rpcRegionOptions.find((option) => option.value === value)?.label ?? value
  );
}

function getStableColorIndex(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash % fallbackProviderColors.length;
}
