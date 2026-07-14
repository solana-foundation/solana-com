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
  getWalletCompanyId,
  type WalletDirectoryData,
  type WalletDirectoryEntry,
} from "@/data/wallets/wallet-directory";

const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
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

function buildWalletEntries(
  overrides: typeof curatedWalletOverrides = curatedWalletOverrides,
): WalletDirectoryEntry[] {
  return sortWallets(
    Object.entries(overrides).map(([slug, wallet]) => {
      const company = getCompanyForWallet(slug, wallet.canonicalName);

      return {
        id: slug,
        name: wallet.canonicalName ?? company?.name ?? slug,
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

export { WEEK_IN_SECONDS as WALLET_DIRECTORY_REVALIDATE_SECONDS };
