import { RPC_FEATURES, type RpcFeatureId } from "./provider-features";
import type { RpcProvider } from "./providers";

export function parseRpcQuery(params: URLSearchParams): string {
  return (params.get("q") ?? "").trim().slice(0, 100);
}

const featureIds = RPC_FEATURES.map((feature) => feature.id);

export function parseRpcFeatures(params: URLSearchParams): RpcFeatureId[] {
  const requested = new Set((params.get("f") ?? "").split(","));
  return featureIds.filter((id) => requested.has(id));
}

export function parseRpcPins(
  params: URLSearchParams,
  providers: readonly RpcProvider[],
): string[] {
  const requested = new Set((params.get("pin") ?? "").split(","));
  return providers
    .filter((provider) => requested.has(provider.id))
    .slice(0, 3)
    .map((provider) => provider.id);
}

export function filterRpcProviders(
  providers: readonly RpcProvider[],
  query: string,
  features: readonly RpcFeatureId[],
): RpcProvider[] {
  return searchRpcProviders(providers, query).filter((provider) =>
    features.every((feature) => Boolean(provider.features[feature]?.sourceUrl)),
  );
}

export const RPC_PATHS = ["local", "public", "production"] as const;
export type RpcPath = (typeof RPC_PATHS)[number];

export function parseRpcPath(params: URLSearchParams): RpcPath {
  const value = params.get("path");
  return RPC_PATHS.find((path) => path === value) ?? "production";
}

/** Docs are served by another app, whose unprefixed routes use English. */
export function localizeRpcHref(href: string, locale: string): string {
  return href.startsWith("/docs/") && locale !== "en"
    ? `/${locale}${href}`
    : href;
}

export function searchRpcProviders<T extends { name: string }>(
  providers: readonly T[],
  query: string,
): T[] {
  const needle = query.trim().toLocaleLowerCase();
  return needle
    ? providers.filter((provider) =>
        provider.name.toLocaleLowerCase().includes(needle),
      )
    : [...providers];
}
