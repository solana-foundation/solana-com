import "server-only";

import {
  getCompanyBySlug,
  getCompanyLogo,
  getCompanyLogoSrc,
  resolveImportedAssetSrc,
  type CompanyRecord,
} from "@workspace/ecosystem-data";
import {
  DEFAULT_WALLET_ICON_URL,
  curatedWalletOverrides,
  getCuratedWalletOverride,
  getWalletCompanyId,
  localWalletDirectoryOverrides,
  normalizeWalletKey,
  type WalletCategory,
  type WalletDirectoryData,
  type WalletDirectoryEntry,
} from "@/data/wallets/wallet-directory";

const THE_GRID_GRAPHQL_ENDPOINT = "https://beta.node.thegrid.id/graphql";
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
const SOLANA_MAINNET = "Solana Mainnet";
const GRID_WALLET_DATA_SOURCES: WalletDirectoryEntry["dataSources"] = [
  "the-grid",
  "ecosystem-data",
  "solana-overrides",
];
const LOCAL_WALLET_DATA_SOURCES: WalletDirectoryEntry["dataSources"] = [
  "ecosystem-data",
  "solana-overrides",
];
const CATEGORY_PRIORITY: WalletCategory[] = [
  "consumer",
  "payments",
  "hardware",
  "infrastructure",
  "institutional",
];

type GridUrl = {
  url?: string | null;
  urlType?: {
    slug?: string | null;
  } | null;
};

type GridProduct = {
  id?: string | null;
  name?: string | null;
  root?: {
    slug?: string | null;
    urlMain?: string | null;
    profileInfos?: Array<{
      name?: string | null;
    }> | null;
  } | null;
  urls?: GridUrl[] | null;
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
      root {
        slug
        urlMain
        profileInfos {
          name
        }
      }
      urls {
        url
        urlType {
          slug
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

// Square marks scale to the directory's fixed logo tiles; wordmark-shaped
// logos become illegible there, so only an explicit `kind: "mark"` qualifies
// (getCompanyLogo falls back to the default logo when no mark exists).
function getCompanyMarkSrc(company: CompanyRecord) {
  const mark = getCompanyLogo(company, { kind: "mark" });
  return mark?.kind === "mark"
    ? resolveImportedAssetSrc(mark.source)
    : undefined;
}

function getCompanyForWallet(...names: Array<string | undefined>) {
  const companyId = getWalletCompanyId(...names);
  return companyId ? getCompanyBySlug(companyId) : undefined;
}

function getWalletIconUrl(
  company: CompanyRecord | undefined,
  overrideIconUrl?: string,
) {
  if (!company) {
    return overrideIconUrl ?? DEFAULT_WALLET_ICON_URL;
  }

  return (
    getCompanyMarkSrc(company) ??
    overrideIconUrl ??
    getCompanyLogoSrc(company, { theme: "dark" }) ??
    getCompanyLogoSrc(company) ??
    DEFAULT_WALLET_ICON_URL
  );
}

function sortWallets(wallets: WalletDirectoryEntry[]) {
  return [...wallets].sort((a, b) => a.name.localeCompare(b.name));
}

function sortCategories(categories: WalletCategory[]) {
  return unique(categories).sort(
    (a, b) => CATEGORY_PRIORITY.indexOf(a) - CATEGORY_PRIORITY.indexOf(b),
  );
}

function getWalletMergeKey(wallet: WalletDirectoryEntry) {
  return wallet.companyId ?? wallet.slug ?? normalizeWalletKey(wallet.name);
}

function getWalletPriorityScore(wallet: WalletDirectoryEntry) {
  return (
    (wallet.dataSources.includes("solana-overrides") ? 10_000 : 0) +
    (wallet.dataSources.includes("ecosystem-data") ? 1_000 : 0) +
    (CATEGORY_PRIORITY.length - CATEGORY_PRIORITY.indexOf(wallet.category)) * 10
  );
}

function getMostRecentDate(values: Array<string | undefined>) {
  const validDates = values.filter((value): value is string => Boolean(value));

  return validDates.sort((a, b) => b.localeCompare(a))[0];
}

function mergeWalletGroup(wallets: WalletDirectoryEntry[]) {
  const primary = [...wallets].sort(
    (a, b) => getWalletPriorityScore(b) - getWalletPriorityScore(a),
  )[0];

  const categories = sortCategories(
    wallets.flatMap((wallet) => wallet.categories),
  );
  const platforms = unique(wallets.flatMap((wallet) => wallet.platforms));
  const features = unique(wallets.flatMap((wallet) => wallet.features));
  const supportedChains = unique(
    wallets.flatMap((wallet) => wallet.supportedChains),
  );
  const supportedAssets = unique(
    wallets.flatMap((wallet) => wallet.supportedAssets),
  ).slice(0, 8);
  const dataSources = unique(
    wallets.flatMap((wallet) => wallet.dataSources),
  ) as WalletDirectoryEntry["dataSources"];

  return {
    ...primary,
    id: getWalletMergeKey(primary),
    category: categories.includes(primary.category)
      ? primary.category
      : categories[0],
    categories,
    platforms,
    features,
    supportedChains,
    supportedAssets,
    lastVerified: getMostRecentDate(
      wallets.map((wallet) => wallet.lastVerified),
    ),
    dataSources,
  };
}

function mergeDuplicateWallets(wallets: WalletDirectoryEntry[]) {
  const groups = new Map<string, WalletDirectoryEntry[]>();

  for (const wallet of wallets) {
    const key = getWalletMergeKey(wallet);
    const group = groups.get(key);

    if (group) {
      group.push(wallet);
    } else {
      groups.set(key, [wallet]);
    }
  }

  return [...groups.values()].map(mergeWalletGroup);
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

  if (!override) {
    return undefined;
  }

  const company = getCompanyForWallet(
    product.root?.slug ?? undefined,
    profileName,
    productName,
    override?.canonicalName,
  );
  const gridWebsite = selectWebsite(product);

  return {
    id: product.id ?? product.root?.slug ?? normalizeWalletKey(productName),
    name: override.canonicalName ?? productName,
    slug: normalizeWalletKey(
      override.canonicalName ?? product.root?.slug ?? productName,
    ),
    companyId: company?.id,
    category: override.category,
    categories: [override.category],
    platforms: override.platforms,
    features: override.features,
    description: override.description,
    website: gridWebsite === "#" ? override.website : gridWebsite,
    iconUrl: getWalletIconUrl(company, override.iconUrl),
    sourceUrl: `https://thegrid.id/profiles/${product.root?.slug ?? normalizeWalletKey(productName)}`,
    docsUrl: selectUrl(product, "documentation"),
    supportedChains: [SOLANA_MAINNET],
    supportedAssets: [],
    lastVerified: override.lastVerified,
    dataSources: [...GRID_WALLET_DATA_SOURCES],
  };
}

function fallbackWallets(
  overrides: typeof curatedWalletOverrides = curatedWalletOverrides,
): WalletDirectoryEntry[] {
  return sortWallets(
    Object.entries(overrides).map(([slug, wallet]) => {
      const company = getCompanyForWallet(slug, wallet.canonicalName);

      return {
        id: slug,
        name: company?.name ?? wallet.canonicalName ?? slug,
        slug,
        companyId: company?.id,
        category: wallet.category,
        categories: [wallet.category],
        platforms: wallet.platforms,
        features: wallet.features,
        description: wallet.description,
        website: wallet.website,
        iconUrl: getWalletIconUrl(company, wallet.iconUrl),
        supportedChains: [SOLANA_MAINNET],
        supportedAssets: [],
        lastVerified: wallet.lastVerified,
        dataSources: [...LOCAL_WALLET_DATA_SOURCES],
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
    const gridWallets = compact(products.map(normalizeGridProduct));
    const localWallets = fallbackWallets(localWalletDirectoryOverrides);
    const wallets = sortWallets(
      mergeDuplicateWallets([...gridWallets, ...localWallets]),
    );

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
