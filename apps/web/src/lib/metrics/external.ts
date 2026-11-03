import "server-only";

import { computeNakamotoCoefficient } from "./nakamoto";
import { callSolanaRpc, type VoteAccounts } from "./solana-rpc";
import type {
  ClimateLiveSpec,
  DefiLlamaLiveSpec,
  SolanaRpcLiveSpec,
  X402scanLiveSpec,
} from "./registry";

/** Every live provider other than data-api and RWA.xyz. */
export type ExternalLiveSpec =
  | DefiLlamaLiveSpec
  | SolanaRpcLiveSpec
  | X402scanLiveSpec
  | ClimateLiveSpec;

export type ExternalValue = {
  value: number;
  /** When the value was fetched (ISO). */
  fetchedAt: string;
};

const REQUEST_TIMEOUT_MS = 10_000;
const DEFILLAMA_API_URL = "https://api.llama.fi";
const DEFILLAMA_STABLECOINS_URL = "https://stablecoins.llama.fi";
const X402SCAN_STATS_URL =
  "https://www.x402scan.com/api/trpc/public.stats.overall";
const CLIMATE_KPIS_URL = "https://climate.solana.com/api/kpis";
const DAY_SECONDS = 24 * 60 * 60;

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
    case "chain-dex-volume-30d":
      return `${DEFILLAMA_API_URL}/overview/dexs/${slug}?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`;
    case "stablecoin-chain-supply":
      return `${DEFILLAMA_STABLECOINS_URL}/stablecoin/${slug}`;
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
  now = Date.now(),
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
      case "chain-dex-volume-30d":
        return (payload as { total30d?: unknown })?.total30d;
      case "stablecoin-chain-supply": {
        // The last entry is today's partial reading; use the latest complete day.
        const startOfToday = Math.floor(now / 1000 / DAY_SECONDS) * DAY_SECONDS;
        const tokens = (
          payload as {
            chainBalances?: Record<
              string,
              {
                tokens?: {
                  date: number;
                  circulating?: { peggedUSD?: number };
                }[];
              }
            >;
          }
        )?.chainBalances?.[spec.chain]?.tokens;
        return tokens?.filter((entry) => entry.date < startOfToday).at(-1)
          ?.circulating?.peggedUSD;
      }
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

  const value = positive(await resolveOther(spec));
  if (value === undefined) {
    throw new Error(
      `${spec.provider} returned no value for ${JSON.stringify(spec)}`,
    );
  }
  return { value, fetchedAt };
}

type X402Stats = {
  total_transactions?: number;
  /** USDC base units (6 decimals). */
  total_amount?: number;
  unique_buyers?: number;
  unique_sellers?: number;
};

async function fetchX402Stats(
  timeframe: X402scanLiveSpec["timeframe"],
  chain?: "solana",
): Promise<X402Stats> {
  const input = JSON.stringify({
    json: { timeframe, ...(chain && { chain }) },
  });
  const payload = (await fetchJson(
    `${X402SCAN_STATS_URL}?input=${encodeURIComponent(input)}`,
  )) as { result?: { data?: { json?: X402Stats } } };
  return payload.result?.data?.json ?? {};
}

/** Solana's x402 figure, or its percent share of all chains. */
export function extractX402Value(
  spec: X402scanLiveSpec,
  solana: X402Stats,
  allChains?: X402Stats,
): number | undefined {
  const share = (part?: number, whole?: number) =>
    part !== undefined && whole ? (part / whole) * 100 : undefined;
  switch (spec.query) {
    case "transactions":
      return solana.total_transactions;
    case "volume-usd":
      return solana.total_amount !== undefined
        ? solana.total_amount / 1e6
        : undefined;
    case "buyers":
      return solana.unique_buyers;
    case "sellers":
      return solana.unique_sellers;
    case "buyers-and-sellers":
      // An address can be both, so this is an upper bound on participants.
      return solana.unique_buyers !== undefined &&
        solana.unique_sellers !== undefined
        ? solana.unique_buyers + solana.unique_sellers
        : undefined;
    case "transaction-share":
      return share(solana.total_transactions, allChains?.total_transactions);
    case "volume-share":
      return share(solana.total_amount, allChains?.total_amount);
  }
}

function positive(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

async function resolveOther(
  spec: Exclude<ExternalLiveSpec, DefiLlamaLiveSpec>,
): Promise<number | undefined> {
  switch (spec.provider) {
    case "solana-rpc": {
      if (spec.query === "token-supply-sum") {
        const supplies = await Promise.all(
          spec.mints.map((mint) =>
            callSolanaRpc<{ value: { uiAmount: number | null } }>(
              "getTokenSupply",
              [mint],
            ),
          ),
        );
        return supplies.reduce(
          (sum, supply) => sum + (supply.value.uiAmount ?? 0),
          0,
        );
      }
      const voteAccounts = await callSolanaRpc<VoteAccounts>("getVoteAccounts");
      return computeNakamotoCoefficient(
        voteAccounts.current.map((account) => account.activatedStake),
      );
    }
    case "x402scan": {
      const isShare = spec.query.endsWith("-share");
      const [solana, allChains] = await Promise.all([
        fetchX402Stats(spec.timeframe, "solana"),
        isShare ? fetchX402Stats(spec.timeframe) : undefined,
      ]);
      return extractX402Value(spec, solana, allChains);
    }
    case "climate": {
      const payload = (await fetchJson(CLIMATE_KPIS_URL)) as {
        result?: { sol?: Record<string, { data?: unknown } | undefined> };
      };
      const value = payload.result?.sol?.[spec.field]?.data;
      return typeof value === "number" ? value : undefined;
    }
  }
}

/** Uncached: the shared metrics stream (loader.ts) caches resolved values. */
export function fetchExternalMetric(
  spec: ExternalLiveSpec,
): Promise<ExternalValue> {
  return resolveExternal(spec);
}
