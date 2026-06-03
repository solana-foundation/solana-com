/**
 * Server-side client for the public Tokens (tokens.xyz) Assets API.
 *
 * Used to populate the live "asset breadth" table on the tokenization
 * solutions page. The API key must stay server-side, so this module is only
 * ever imported from server components / route handlers.
 *
 * Docs: https://docs.tokens.xyz/v1/quickstart — `GET /v1/assets/curated`
 */

const DEFAULT_API_BASE_URL = "https://api.tokens.xyz";
const TOKENS_REVALIDATE_SECONDS = 60 * 60;
const MARKET_PROTOCOL_CONCURRENCY = 8;
const MARKET_PROTOCOL_TIMEOUT_MS = 2_500;

/** Categories surfaced on the tokenization page (real Tokens API categories). */
export const TOKENIZED_ASSET_CATEGORIES = [
  "rwa",
  "equity",
  "etf",
  "stablecoin",
  "commodity",
] as const;

export type TokenizedAssetCategory =
  (typeof TOKENIZED_ASSET_CATEGORIES)[number];

export type TokenizedAsset = {
  assetId: string;
  symbol: string;
  name: string;
  category: TokenizedAssetCategory;
  imageUrl: string | null;
  issuer: string | null;
  issuerUrl: string | null;
  marketCap: number | null;
  liquidity: number | null;
  volume24hUSD: number | null;
  price: number | null;
  priceChange24hPercent: number | null;
};

type CuratedStats = {
  price: number | null;
  liquidity: number | null;
  volume24hUSD: number | null;
  volume30dUSD: number | null;
  marketCap: number | null;
  priceChange24hPercent: number | null;
  priceChange1hPercent: number | null;
} | null;

type CuratedPrimaryVariant = {
  issuer?: string;
  issuerUrl?: string;
  label?: string;
  name?: string;
  symbol?: string;
  market: {
    marketCap?: number | null;
    liquidity?: number | null;
    volume24hUSD?: number | null;
    price?: number | null;
    priceChange24hPercent?: number | null;
  } | null;
} | null;

type CuratedAsset = {
  assetId: string;
  name?: string;
  symbol?: string;
  category: string;
  imageUrl: string | null;
  stats: CuratedStats;
  primaryVariant: CuratedPrimaryVariant;
};

type CuratedResponse = {
  assets?: CuratedAsset[];
};

type AssetMarket = {
  source?: string | null;
};

type AssetMarketsResponse = {
  includes?: {
    markets?: {
      ok: boolean;
      data?: {
        markets?: AssetMarket[];
      };
    };
  };
};

const getTokensApiBaseUrl = (): string => {
  const configuredBaseUrl =
    process.env.TOKENS_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

  return configuredBaseUrl.replace(/\/+$/, "").replace(/\/v1$/, "");
};

const firstText = (
  ...values: Array<string | null | undefined>
): string | null => {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return null;
};

const isTokenizedCategory = (
  category: string,
): category is TokenizedAssetCategory =>
  (TOKENIZED_ASSET_CATEGORIES as readonly string[]).includes(category);

const firstNumber = (
  ...values: Array<number | null | undefined>
): number | null => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return null;
};

const getVariantIssuerOrLabel = (asset: CuratedAsset): string | null =>
  firstText(asset.primaryVariant?.issuer, asset.primaryVariant?.label);

const getMarketProtocol = async (
  baseUrl: string,
  apiKey: string,
  assetId: string,
): Promise<string | null> => {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    MARKET_PROTOCOL_TIMEOUT_MS,
  );

  try {
    const response = await fetch(
      `${baseUrl}/v1/assets/${encodeURIComponent(assetId)}?include=markets`,
      {
        headers: {
          "x-api-key": apiKey,
          accept: "application/json",
        },
        next: { revalidate: TOKENS_REVALIDATE_SECONDS },
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as AssetMarketsResponse;
    const markets = data.includes?.markets?.data?.markets ?? [];
    const market = markets.find((market) => firstText(market.source));

    return firstText(market?.source);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

const getMarketProtocols = async (
  baseUrl: string,
  apiKey: string,
  assets: CuratedAsset[],
): Promise<Map<string, string>> => {
  const targets = assets
    .filter((asset) => isTokenizedCategory(asset.category))
    .filter((asset) => getVariantIssuerOrLabel(asset) === null)
    .map((asset) => asset.assetId);

  const protocols = new Map<string, string>();
  let nextTargetIndex = 0;

  const workers = Array.from(
    { length: Math.min(MARKET_PROTOCOL_CONCURRENCY, targets.length) },
    async () => {
      while (nextTargetIndex < targets.length) {
        const assetId = targets[nextTargetIndex++];
        const protocol = await getMarketProtocol(baseUrl, apiKey, assetId);

        if (protocol) {
          protocols.set(assetId, protocol);
        }
      }
    },
  );

  await Promise.all(workers);

  return protocols;
};

const toTokenizedAsset = (
  asset: CuratedAsset,
  marketProtocols: Map<string, string>,
): TokenizedAsset | null => {
  if (!isTokenizedCategory(asset.category)) {
    return null;
  }

  const market = asset.primaryVariant?.market ?? null;

  return {
    assetId: asset.assetId,
    symbol: (asset.symbol || asset.assetId).toUpperCase(),
    name: asset.name || asset.symbol || asset.assetId,
    category: asset.category,
    imageUrl: asset.imageUrl ?? null,
    issuer: firstText(
      asset.primaryVariant?.issuer,
      asset.primaryVariant?.label,
      marketProtocols.get(asset.assetId),
      asset.primaryVariant?.name,
      asset.primaryVariant?.symbol,
    ),
    issuerUrl: asset.primaryVariant?.issuerUrl ?? null,
    marketCap: firstNumber(asset.stats?.marketCap, market?.marketCap),
    liquidity: firstNumber(asset.stats?.liquidity, market?.liquidity),
    volume24hUSD: firstNumber(asset.stats?.volume24hUSD, market?.volume24hUSD),
    price: firstNumber(asset.stats?.price, market?.price),
    priceChange24hPercent: firstNumber(
      asset.stats?.priceChange24hPercent,
      market?.priceChange24hPercent,
    ),
  };
};

/**
 * Fetch the curated set of tokenized real-world assets from the Tokens API,
 * filtered to the categories surfaced on the tokenization page.
 *
 * Returns an empty array (rather than throwing) when the API key is missing or
 * the request fails, so the page degrades gracefully and can hide the section.
 */
export const fetchTokenizedAssets = async (): Promise<TokenizedAsset[]> => {
  const apiKey = process.env.TOKENS_API_KEY;

  if (!apiKey) {
    return [];
  }

  try {
    const baseUrl = getTokensApiBaseUrl();
    const response = await fetch(
      `${baseUrl}/v1/assets/curated?list=all&groupBy=asset&limit=500`,
      {
        headers: {
          "x-api-key": apiKey,
          accept: "application/json",
        },
        // Tokens caches upstream; refresh hourly.
        next: { revalidate: 60 * 60 },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as CuratedResponse;
    const assets = Array.isArray(data.assets) ? data.assets : [];
    const marketProtocols = await getMarketProtocols(baseUrl, apiKey, assets);

    const mapped = assets
      .map((asset) => toTokenizedAsset(asset, marketProtocols))
      .filter((asset): asset is TokenizedAsset => asset !== null);

    // Surface the assets with the most market presence first.
    return mapped.sort((left, right) => {
      const leftRank = left.marketCap ?? left.volume24hUSD ?? 0;
      const rightRank = right.marketCap ?? right.volume24hUSD ?? 0;
      return rightRank - leftRank;
    });
  } catch {
    return [];
  }
};
