import { unstable_cache } from "next/cache";

export type RwaStats = {
  /** Count of unique RWA assets with Solana deployments. */
  assetCount: number;
  /**
   * Circulating (distributed) value (USD) across Solana RWA deployments, the
   * figure RWA.xyz publishes as distributed asset value.
   */
  distributedValueUSD: number;
  /** Holding addresses summed across Solana RWA tokens. */
  holderCount: number;
};

export type RwaStatsResult = {
  stats: RwaStats;
  /** When the stats were fetched (ISO). */
  fetchedAt: string;
};

const REQUEST_TIMEOUT_MS = 8_000;

/** RWA totals move throughout the day, but the external API should be called sparingly. */
const CACHE_TTL_SECONDS = 60 * 60;

const RWA_XYZ_API_URL =
  process.env.RWA_XYZ_API_BASE_URL ?? "https://api.rwa.xyz";
const RWA_XYZ_PAGE_SIZE = 1000;
const RWA_XYZ_MAX_PAGES = 25;
const RWA_XYZ_CACHE_TAG = "rwa-stats";

const SOLANA_NETWORK_SLUG = "solana";

/**
 * RWA.xyz includes stablecoins, fiat currencies, and native cryptocurrencies in
 * the same schema. The solution page is about tokenized offchain assets, so keep
 * those out of the hero totals.
 */
const RWA_ASSET_CLASS_SLUGS = [
  "active-strategies",
  "asset-backed-credit",
  "commodities",
  "corporate-credit",
  "diversified-credit",
  "non-us-government-debt",
  "private-equity",
  "real-estate",
  "repurchase-agreements",
  "specialty-finance",
  "stocks",
  "us-treasury-debt",
  "venture-capital",
] as const;

type RwaXyzMetric = {
  val?: number | null;
};

type RwaXyzToken = {
  id?: number | string | null;
  holding_addresses_count?: RwaXyzMetric | null;
  circulating_asset_value_dollar?: RwaXyzMetric | null;
  token_id?: number | string | null;
  asset_id?: number | string | null;
  asset?: {
    id?: number | string | null;
    asset_id?: number | string | null;
  } | null;
};

type RwaXyzTokensResponse = {
  results?: RwaXyzToken[];
  pagination?: {
    page?: number;
    perPage?: number;
    pageCount?: number;
    resultCount?: number;
  };
};

type RwaXyzFilter = {
  operator: "and" | "or" | "equals";
  field?: string;
  value?: string;
  filters?: RwaXyzFilter[];
};

type RwaXyzTokenQuery = {
  filter: RwaXyzFilter;
  pagination: {
    page: number;
    perPage: number;
  };
};

const getRwaXyzTokenQuery = (page: number): RwaXyzTokenQuery => ({
  filter: {
    operator: "and",
    filters: [
      {
        operator: "equals",
        field: "network_slug",
        value: SOLANA_NETWORK_SLUG,
      },
      {
        operator: "or",
        filters: RWA_ASSET_CLASS_SLUGS.map((assetClassSlug) => ({
          operator: "equals",
          field: "asset_class_slug",
          value: assetClassSlug,
        })),
      },
    ],
  },
  pagination: {
    page,
    perPage: RWA_XYZ_PAGE_SIZE,
  },
});

const getMetricValue = (metric?: RwaXyzMetric | null) => {
  const value = metric?.val;

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
};

const getAssetId = (token: RwaXyzToken) =>
  token.asset_id ?? token.asset?.asset_id ?? token.asset?.id ?? token.id;

const fetchRwaXyzTokenPage = async (
  page: number,
): Promise<RwaXyzTokensResponse> => {
  const apiToken = process.env.RWA_XYZ_API_TOKEN;

  if (!apiToken) {
    throw new Error("RWA_XYZ_API_TOKEN is not configured");
  }

  const url = new URL("/v4/tokens", RWA_XYZ_API_URL);
  url.searchParams.set("query", JSON.stringify(getRwaXyzTokenQuery(page)));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`RWA.xyz request failed with status ${response.status}`);
    }

    return (await response.json()) as RwaXyzTokensResponse;
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Fetches live totals from RWA.xyz. Throws when the token is missing, a request
 * fails, or the response is empty, so callers can fall back explicitly.
 *
 * Value uses circulating asset value only. Total asset value describes the
 * underlying asset (e.g. a whole fund or listed share class), not what is
 * tokenized on Solana, so it must not stand in when circulating value is absent.
 */
const fetchRwaStatsFromApi = async (): Promise<RwaStatsResult> => {
  const firstPage = await fetchRwaXyzTokenPage(1);
  const pageCount = firstPage.pagination?.pageCount ?? 1;

  if (pageCount > RWA_XYZ_MAX_PAGES) {
    throw new Error(
      `RWA.xyz response requires ${pageCount} pages, exceeding the ${RWA_XYZ_MAX_PAGES}-page safety limit`,
    );
  }

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      fetchRwaXyzTokenPage(index + 2),
    ),
  );

  const tokens = [
    ...(firstPage.results ?? []),
    ...remainingPages.flatMap((page) => page.results ?? []),
  ];
  const uniqueAssetIds = new Set<NonNullable<ReturnType<typeof getAssetId>>>();
  let distributedValueUSD = 0;
  let holderCount = 0;

  tokens.forEach((token) => {
    const assetId = getAssetId(token);

    if (assetId !== null && assetId !== undefined) {
      uniqueAssetIds.add(assetId);
    }

    distributedValueUSD +=
      getMetricValue(token.circulating_asset_value_dollar) ?? 0;
    holderCount += getMetricValue(token.holding_addresses_count) ?? 0;
  });

  const stats: RwaStats = {
    assetCount: uniqueAssetIds.size,
    distributedValueUSD,
    holderCount,
  };

  if (stats.assetCount === 0 || stats.distributedValueUSD === 0) {
    throw new Error("RWA.xyz returned no Solana RWA totals");
  }

  return { stats, fetchedAt: new Date().toISOString() };
};

export const fetchRwaStats = unstable_cache(
  fetchRwaStatsFromApi,
  ["rwa-xyz-stats-v2"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [RWA_XYZ_CACHE_TAG],
  },
);
