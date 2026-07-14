import "server-only";

import {
  getCompanyBySlug,
  getCompanyLogo,
  getCompanyLogoSrc,
  resolveImportedAssetSrc,
  walletData,
  type CompanyRecord,
  type WalletRecord,
} from "@workspace/ecosystem-data";
import {
  DEFAULT_WALLET_ICON_URL,
  resolveWalletAssetSrc,
  type WalletDirectoryData,
  type WalletDirectoryEntry,
} from "./wallet-directory";

const SOLANA_MAINNET = "Solana Mainnet";
const ECOSYSTEM_WALLET_DATA_SOURCES: WalletDirectoryEntry["dataSources"] = [
  "ecosystem-data",
];

// Square marks scale to the directory's fixed logo tiles; wordmark-shaped
// logos become illegible there, so only an explicit `kind: "mark"` qualifies
// (getCompanyLogo falls back to the default logo when no mark exists).
function getCompanyMarkSrc(company: CompanyRecord) {
  const mark = getCompanyLogo(company, { kind: "mark" });
  return mark?.kind === "mark"
    ? resolveImportedAssetSrc(mark.source)
    : undefined;
}

// Ordered best-first: square company mark, researched wallet icon, company
// logos, then the placeholder. The client walks this chain when a candidate
// fails to load, so every entry ends with a guaranteed local asset.
function getWalletIconUrls(
  company: CompanyRecord | undefined,
  recordIcon: WalletRecord["icon"],
) {
  const recordIconUrl = recordIcon
    ? resolveWalletAssetSrc(recordIcon)
    : undefined;
  const candidates = company
    ? [
        getCompanyMarkSrc(company),
        recordIconUrl,
        getCompanyLogoSrc(company, { theme: "dark" }),
        getCompanyLogoSrc(company),
        DEFAULT_WALLET_ICON_URL,
      ]
    : [recordIconUrl, DEFAULT_WALLET_ICON_URL];

  return [...new Set(candidates.filter((url): url is string => Boolean(url)))];
}

function sortWallets(wallets: WalletDirectoryEntry[]) {
  return [...wallets].sort((a, b) => a.name.localeCompare(b.name));
}

function buildWalletEntries(): WalletDirectoryEntry[] {
  return sortWallets(
    Object.entries(walletData).map(([slug, record]) => {
      const company = record.companyId
        ? getCompanyBySlug(record.companyId)
        : undefined;
      const iconUrls = getWalletIconUrls(company, record.icon);

      return {
        id: slug,
        name: record.name,
        slug,
        companyId: company?.id,
        category: record.category,
        categories: [record.category],
        platforms: record.platforms,
        features: record.features,
        description: record.description,
        website: record.website,
        iconUrl: iconUrls[0],
        iconUrls,
        supportedChains: [SOLANA_MAINNET],
        supportedAssets: [],
        lastVerified: record.lastVerified,
        dataSources: [...ECOSYSTEM_WALLET_DATA_SOURCES],
      };
    }),
  );
}

export async function getWalletDirectoryData(): Promise<WalletDirectoryData> {
  return {
    wallets: buildWalletEntries(),
    lastFetchedAt: new Date().toISOString(),
    source: "ecosystem-data",
  };
}
