import "server-only";

import { getCompanyBySlug, getCompanyLogoSrc } from "@workspace/ecosystem-data";
import {
  curatedWalletOverrides,
  getCuratedWalletOverride,
  getWalletCompanyId,
  normalizeWalletKey,
  type WalletCategory,
  type WalletDirectoryData,
  type WalletDirectoryEntry,
  type WalletFeature,
  type WalletPlatform,
} from "@/data/wallets/wallet-directory";

const THE_GRID_GRAPHQL_ENDPOINT = "https://beta.node.thegrid.id/graphql";
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

type GridUrl = {
  url?: string | null;
  urlType?: {
    name?: string | null;
    slug?: string | null;
  } | null;
};

type GridMedia = {
  url?: string | null;
  mediaType?: {
    slug?: string | null;
  } | null;
};

type GridProduct = {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  productType?: {
    name?: string | null;
    slug?: string | null;
  } | null;
  root?: {
    slug?: string | null;
    urlMain?: string | null;
    lastPublicValidation?: string | null;
    gridRank?: {
      ranking?: number | null;
      score?: number | null;
    } | null;
    profileInfos?: Array<{
      name?: string | null;
      descriptionShort?: string | null;
      profileSector?: {
        name?: string | null;
        slug?: string | null;
      } | null;
    }> | null;
    media?: GridMedia[] | null;
    profileTags?: Array<{
      tag?: {
        name?: string | null;
        slug?: string | null;
      } | null;
    }> | null;
  } | null;
  media?: GridMedia[] | null;
  urls?: GridUrl[] | null;
  supportsProducts?: Array<{
    supportsProduct?: {
      name?: string | null;
      productType?: {
        slug?: string | null;
      } | null;
    } | null;
  }> | null;
  productAssetRelationships?: Array<{
    asset?: {
      name?: string | null;
      ticker?: string | null;
      assetType?: {
        slug?: string | null;
      } | null;
    } | null;
  }> | null;
};

type GridWalletResponse = {
  data?: {
    products?: GridProduct[] | null;
  } | null;
  errors?: Array<{ message?: string }>;
};

const GRID_WALLETS_QUERY = /* GraphQL */ `
  query SolanaWalletProducts {
    products(
      where: {
        productType: {
          slug: {
            _in: [
              "wallet"
              "hardware_wallet"
              "embedded_wallet"
              "multi_sig_wallet"
            ]
          }
        }
        productStatus: { slug: { _eq: "live" } }
        supportsProducts: {
          supportsProduct: { name: { _eq: "Solana Mainnet" } }
        }
      }
      limit: 250
    ) {
      id
      name
      description
      productType {
        name
        slug
      }
      root {
        slug
        urlMain
        lastPublicValidation
        gridRank {
          ranking
          score
        }
        profileInfos {
          name
          descriptionShort
          profileSector {
            name
            slug
          }
        }
        media {
          url
          mediaType {
            slug
          }
        }
        profileTags {
          tag {
            name
            slug
          }
        }
      }
      media {
        url
        mediaType {
          slug
        }
      }
      urls {
        url
        urlType {
          name
          slug
        }
      }
      supportsProducts {
        supportsProduct {
          name
          productType {
            slug
          }
        }
      }
      productAssetRelationships {
        asset {
          name
          ticker
          assetType {
            slug
          }
        }
      }
    }
  }
`;

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function compact<T>(values: Array<T | null | undefined>) {
  return values.filter(
    (value): value is T => value !== null && value !== undefined,
  );
}

function parseGridDate(value?: string | null) {
  return value?.split(" ")[0];
}

function categoryFromProductType(slug?: string | null): WalletCategory {
  switch (slug) {
    case "hardware_wallet":
      return "hardware";
    case "embedded_wallet":
      return "infrastructure";
    case "multi_sig_wallet":
      return "institutional";
    default:
      return "consumer";
  }
}

function platformsFromGrid(product: GridProduct): WalletPlatform[] {
  const platforms = new Set<WalletPlatform>();

  for (const url of product.urls ?? []) {
    switch (url.urlType?.slug) {
      case "apple_app_store":
        platforms.add("ios");
        break;
      case "google_play_store":
        platforms.add("android");
        break;
      case "chrome_web_store":
        platforms.add("chrome");
        break;
      case "desktop_app":
        platforms.add("desktop");
        break;
      case "product":
        platforms.add("web");
        break;
      default:
        break;
    }
  }

  if (product.productType?.slug === "hardware_wallet") {
    platforms.add("hardware");
  }

  if (product.productType?.slug === "embedded_wallet") {
    platforms.add("api");
    platforms.add("sdk");
  }

  return [...platforms];
}

function featuresFromGrid(product: GridProduct): WalletFeature[] {
  const features = new Set<WalletFeature>();
  const supportedChains = product.supportsProducts ?? [];
  const l1OrL2Count = supportedChains.filter(({ supportsProduct }) => {
    const type = supportsProduct?.productType?.slug;
    return type === "l1" || type === "l2";
  }).length;

  if (product.productType?.slug === "hardware_wallet") {
    features.add("hardware");
  }

  if (product.productType?.slug === "embedded_wallet") {
    features.add("private_key_infrastructure");
  }

  if (product.productType?.slug === "multi_sig_wallet") {
    features.add("multi_sig");
    features.add("spending_limits");
  }

  if (l1OrL2Count > 1) {
    features.add("multi_chain");
  }

  const stablecoinAssets = product.productAssetRelationships?.some(
    ({ asset }) => asset?.assetType?.slug === "stablecoin",
  );

  if (stablecoinAssets) {
    features.add("buy_crypto");
  }

  return [...features];
}

function selectUrl(product: GridProduct, slug: string) {
  return (
    product.urls?.find((url) => url.urlType?.slug === slug)?.url ?? undefined
  );
}

function selectWebsite(product: GridProduct) {
  return (
    selectUrl(product, "product") ??
    product.root?.urlMain ??
    product.urls?.find((url) => url.url)?.url ??
    "#"
  );
}

function selectGridMedia(product: GridProduct) {
  const media = [...(product.media ?? []), ...(product.root?.media ?? [])];
  const preferred =
    media.find((item) => item.mediaType?.slug === "icon") ??
    media.find((item) => item.mediaType?.slug === "logo_dark_bg") ??
    media.find((item) => item.mediaType?.slug === "logo_light_bg") ??
    media[0];

  return preferred?.url ?? undefined;
}

function supportedChainsFromGrid(product: GridProduct) {
  return unique(
    compact(
      product.supportsProducts?.map(
        ({ supportsProduct }) => supportsProduct?.name ?? undefined,
      ) ?? [],
    ),
  );
}

function supportedAssetsFromGrid(product: GridProduct) {
  return unique(
    compact(
      product.productAssetRelationships?.map(({ asset }) => {
        if (!asset?.ticker && !asset?.name) {
          return undefined;
        }

        return asset.ticker ?? asset.name ?? undefined;
      }) ?? [],
    ),
  ).slice(0, 8);
}

function sortWallets(wallets: WalletDirectoryEntry[]) {
  return [...wallets].sort((a, b) => {
    const rankA = a.gridRank ?? 0;
    const rankB = b.gridRank ?? 0;

    if (rankA !== rankB) {
      return rankB - rankA;
    }

    return a.name.localeCompare(b.name);
  });
}

function normalizeGridProduct(
  product: GridProduct,
): WalletDirectoryEntry | undefined {
  const productName = product.name?.trim();
  const profileInfo = product.root?.profileInfos?.[0];
  const profileName = profileInfo?.name?.trim();

  if (!productName) {
    return undefined;
  }

  const override = getCuratedWalletOverride(
    productName,
    profileName,
    product.root?.slug ?? undefined,
  );
  const companyId = getWalletCompanyId(
    product.root?.slug ?? undefined,
    profileName,
    productName,
    override?.canonicalName,
  );
  const company = companyId ? getCompanyBySlug(companyId) : undefined;
  const companyLogo = company
    ? getCompanyLogoSrc(company, { theme: "dark" })
    : undefined;
  const fallbackLogo = company ? getCompanyLogoSrc(company) : undefined;

  const features = unique([
    ...(override?.features ?? []),
    ...featuresFromGrid(product),
  ]);
  const platforms = unique([
    ...(override?.platforms ?? []),
    ...platformsFromGrid(product),
  ]);
  const dataSources: WalletDirectoryEntry["dataSources"] = ["the-grid"];

  if (company) {
    dataSources.push("ecosystem-data");
  }

  if (override) {
    dataSources.push("solana-overrides");
  }

  return {
    id: product.id ?? product.root?.slug ?? normalizeWalletKey(productName),
    name: company?.name ?? override?.canonicalName ?? productName,
    slug: normalizeWalletKey(
      company?.slug ?? product.root?.slug ?? productName,
    ),
    companyId: company?.id,
    category:
      override?.category ?? categoryFromProductType(product.productType?.slug),
    platforms,
    features,
    description:
      override?.description ??
      company?.profile?.summary ??
      profileInfo?.descriptionShort ??
      product.description ??
      "",
    website:
      override?.website ??
      company?.profile?.links?.website ??
      selectWebsite(product),
    iconUrl:
      companyLogo ??
      fallbackLogo ??
      override?.iconUrl ??
      selectGridMedia(product),
    sourceUrl: `https://thegrid.id/profiles/${product.root?.slug ?? normalizeWalletKey(productName)}`,
    docsUrl: selectUrl(product, "documentation"),
    supportedChains: supportedChainsFromGrid(product),
    supportedAssets: supportedAssetsFromGrid(product),
    lastVerified:
      override?.lastVerified ??
      parseGridDate(product.root?.lastPublicValidation),
    gridRank: product.root?.gridRank?.score ?? undefined,
    dataSources,
  };
}

function fallbackWallets(): WalletDirectoryEntry[] {
  return sortWallets(
    Object.entries(curatedWalletOverrides).map(([slug, wallet]) => {
      const companyId = getWalletCompanyId(slug, wallet.canonicalName);
      const company = companyId ? getCompanyBySlug(companyId) : undefined;
      const companyLogo = company
        ? getCompanyLogoSrc(company, { theme: "dark" })
        : undefined;
      const fallbackLogo = company ? getCompanyLogoSrc(company) : undefined;

      return {
        id: slug,
        name: company?.name ?? wallet.canonicalName ?? slug,
        slug,
        companyId: company?.id,
        category: wallet.category,
        platforms: wallet.platforms,
        features: wallet.features,
        description: wallet.description,
        website: wallet.website,
        iconUrl: companyLogo ?? fallbackLogo ?? wallet.iconUrl,
        supportedChains: ["Solana Mainnet"],
        supportedAssets: [],
        lastVerified: wallet.lastVerified,
        dataSources: company
          ? ["ecosystem-data", "solana-overrides"]
          : ["solana-overrides"],
      };
    }),
  );
}

async function fetchGridWalletProducts() {
  const response = await fetch(THE_GRID_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GRID_WALLETS_QUERY }),
    next: {
      revalidate: WEEK_IN_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`The Grid request failed with ${response.status}`);
  }

  const payload = (await response.json()) as GridWalletResponse;

  if (payload.errors?.length) {
    throw new Error(
      payload.errors
        .map((error) => error.message)
        .filter(Boolean)
        .join("; "),
    );
  }

  return payload.data?.products ?? [];
}

export async function getWalletDirectoryData(): Promise<WalletDirectoryData> {
  try {
    const products = await fetchGridWalletProducts();
    const wallets = sortWallets(compact(products.map(normalizeGridProduct)));

    if (wallets.length > 0) {
      return {
        wallets,
        lastFetchedAt: new Date().toISOString(),
        source: "the-grid",
      };
    }
  } catch (error) {
    console.warn("Falling back to curated wallet data", error);
  }

  return {
    wallets: fallbackWallets(),
    lastFetchedAt: new Date().toISOString(),
    source: "fallback",
  };
}

export { WEEK_IN_SECONDS as WALLET_DIRECTORY_REVALIDATE_SECONDS };
