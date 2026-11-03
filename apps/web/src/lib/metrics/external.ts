import "server-only";

import { computeNakamotoCoefficient } from "./nakamoto";
import { callSolanaRpc, type VoteAccounts } from "./solana-rpc";
import type { DefiLlamaLiveSpec, SolanaRpcLiveSpec } from "./registry";

export type ExternalLiveSpec = DefiLlamaLiveSpec | SolanaRpcLiveSpec;

export type ExternalValue = {
  value: number;
  /** When the value was fetched (ISO). */
  fetchedAt: string;
};

const REQUEST_TIMEOUT_MS = 10_000;
const DEFILLAMA_API_URL = "https://api.llama.fi";

/** The DefiLlama endpoint behind each query. */
export function defiLlamaUrl(spec: DefiLlamaLiveSpec): string {
  const slug = encodeURIComponent(spec.slug);
  switch (spec.query) {
    case "chain-tvl":
      return `${DEFILLAMA_API_URL}/v2/chains`;
    case "protocol-tvl":
      return `${DEFILLAMA_API_URL}/protocol/${slug}`;
    case "aggregator-volume":
      return `${DEFILLAMA_API_URL}/summary/aggregators/${slug}?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`;
  }
}

/**
 * Reads the figure DefiLlama shows on the linked page: chain TVL, a
 * protocol's Solana TVL (excluding borrowed and staked), or all-time
 * aggregator volume.
 */
export function extractDefiLlamaValue(
  spec: DefiLlamaLiveSpec,
  payload: unknown,
): number | undefined {
  const value = (() => {
    switch (spec.query) {
      case "chain-tvl":
        return Array.isArray(payload)
          ? (payload as { name?: string; tvl?: unknown }[]).find(
              (chain) => chain.name === spec.slug,
            )?.tvl
          : undefined;
      case "protocol-tvl":
        return (payload as { currentChainTvls?: Record<string, unknown> })
          ?.currentChainTvls?.Solana;
      case "aggregator-volume":
        return (payload as { totalAllTime?: unknown })?.totalAllTime;
    }
  })();

  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...init,
      // The cached result is the extracted number, not the (large) payload.
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`${url} responded ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function resolveExternal(spec: ExternalLiveSpec): Promise<ExternalValue> {
  const fetchedAt = new Date().toISOString();

  if (spec.provider === "defillama") {
    const value = extractDefiLlamaValue(
      spec,
      await fetchJson(defiLlamaUrl(spec)),
    );
    if (value === undefined) {
      throw new Error(`DefiLlama returned no ${spec.query} for ${spec.slug}`);
    }
    return { value, fetchedAt };
  }

  const voteAccounts = await callSolanaRpc<VoteAccounts>("getVoteAccounts");
  const value = computeNakamotoCoefficient(
    voteAccounts.current.map((account) => account.activatedStake),
  );
  if (value === undefined) {
    throw new Error("getVoteAccounts returned no active stake");
  }
  return { value, fetchedAt };
}

/** Uncached: the shared metrics stream (loader.ts) caches resolved values. */
export function fetchExternalMetric(
  spec: ExternalLiveSpec,
): Promise<ExternalValue> {
  return resolveExternal(spec);
}
