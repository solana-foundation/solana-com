/**
 * Live RWA stats sourced from the Tokens.xyz Assets API.
 *
 * The RWA solution page surfaces how much tokenized value is live on Solana and
 * how active it is. Those figures move constantly as issuers list assets and
 * markets trade, so we read them from the same canonical source the page links
 * to (tokens.xyz) rather than hardcoding numbers that go stale.
 *
 * A single curated-list request gives us everything: per-category counts plus
 * aggregate market cap and 24h volume across the RWA-relevant categories.
 *
 * Falls back to last-known-good values when the API key is absent (e.g. during
 * CI builds) or the request fails, so the page always renders sensible stats.
 */

/** Tokens.xyz categories that make up the RWA surface shown on this page. */
const RWA_CATEGORIES = ["rwa", "etf", "commodity", "equity"] as const;

export type RwaStats = {
  /** Tokenized treasuries and yield-bearing fund products (API category `rwa`). */
  treasuries: number;
  /** Tokenized ETFs / public-market funds (API category `etf`). */
  etfs: number;
  /** Metals and commodity markets (API category `commodity`). */
  commodities: number;
  /** Tokenized equities / stocks (API category `equity`). */
  stocks: number;
  /** Count of assets across all RWA-relevant categories. */
  totalAssets: number;
  /** Aggregate onchain market cap (USD) across RWA-relevant categories. */
  totalValueUSD: number;
  /** Aggregate 24h trading volume (USD) across RWA-relevant categories. */
  volume24hUSD: number;
};

/** Verified against the live API on 2026-06-19; used when the API is unreachable. */
const FALLBACK_STATS: RwaStats = {
  treasuries: 15,
  etfs: 24,
  commodities: 4,
  stocks: 389,
  totalAssets: 432,
  totalValueUSD: 2_200_000_000,
  volume24hUSD: 205_000_000,
};

type CuratedAsset = {
  category?: string;
  stats?: { marketCap?: number | null; volume24hUSD?: number | null };
};
type CuratedResponse = { assets?: CuratedAsset[] };

const REQUEST_TIMEOUT_MS = 8_000;

/** RWA totals move slowly; refresh the Tokens API data once per day. */
const CACHE_TTL_SECONDS = 60 * 60 * 24;

export const fetchRwaStats = async (): Promise<RwaStats> => {
  const apiKey = process.env.TOKENS_API_KEY;
  const baseUrl = process.env.TOKENS_API_BASE_URL ?? "https://api.tokens.xyz";

  if (!apiKey) {
    return FALLBACK_STATS;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/v1/assets/curated?listId=all`, {
      headers: { "x-api-key": apiKey },
      signal: controller.signal,
      next: { revalidate: CACHE_TTL_SECONDS, tags: ["rwa-stats"] },
    });

    if (!response.ok) {
      return FALLBACK_STATS;
    }

    const data = (await response.json()) as CuratedResponse;
    const assets = data.assets ?? [];

    if (assets.length === 0) {
      return FALLBACK_STATS;
    }

    const isRwaCategory = (category?: string) =>
      RWA_CATEGORIES.includes(category as (typeof RWA_CATEGORIES)[number]);

    const countByCategory = (category: string) =>
      assets.filter((asset) => asset.category === category).length;

    const relevant = assets.filter((asset) => isRwaCategory(asset.category));
    const sum = (pick: (asset: CuratedAsset) => number | null | undefined) =>
      relevant.reduce((total, asset) => total + (pick(asset) ?? 0), 0);

    const stats: RwaStats = {
      treasuries: countByCategory("rwa"),
      etfs: countByCategory("etf"),
      commodities: countByCategory("commodity"),
      stocks: countByCategory("equity"),
      totalAssets: relevant.length,
      totalValueUSD: sum((asset) => asset.stats?.marketCap),
      volume24hUSD: sum((asset) => asset.stats?.volume24hUSD),
    };

    // Guard against a partial/empty payload: if no relevant assets surfaced,
    // all derived aggregates would be zero/stale so fall back entirely.
    if (stats.totalAssets === 0) {
      return FALLBACK_STATS;
    }

    return {
      treasuries: stats.treasuries || FALLBACK_STATS.treasuries,
      etfs: stats.etfs || FALLBACK_STATS.etfs,
      commodities: stats.commodities || FALLBACK_STATS.commodities,
      stocks: stats.stocks || FALLBACK_STATS.stocks,
      totalAssets: stats.totalAssets,
      totalValueUSD: stats.totalValueUSD || FALLBACK_STATS.totalValueUSD,
      volume24hUSD: stats.volume24hUSD,
    };
  } catch (err) {
    console.error("[fetchRwaStats] failed, using fallback stats:", err);
    return FALLBACK_STATS;
  } finally {
    clearTimeout(timeout);
  }
};
