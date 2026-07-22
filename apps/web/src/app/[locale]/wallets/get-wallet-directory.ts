import "server-only";

import {
  DEFAULT_WALLET_ICON,
  walletData,
  type WalletRecord,
} from "@workspace/ecosystem-data/wallets";
import {
  buildWalletCategories,
  type WalletDirectoryData,
  type WalletDirectoryEntry,
} from "./wallet-directory";

const SOLANA_MAINNET = "Solana Mainnet";
const DEFAULT_WALLET_ICON_URL = resolveAssetSrc(DEFAULT_WALLET_ICON);

function resolveAssetSrc(asset: string | { src: string }) {
  return typeof asset === "string" ? asset : asset.src;
}

// Every researched wallet icon is a square local asset. The placeholder keeps
// the tile dimensions stable if an icon is missing or fails to load.
function getWalletIconUrls(recordIcon: WalletRecord["icon"]) {
  const recordIconUrl = recordIcon ? resolveAssetSrc(recordIcon) : undefined;
  const candidates = [recordIconUrl, DEFAULT_WALLET_ICON_URL];

  return [...new Set(candidates.filter((url): url is string => Boolean(url)))];
}

function sortWallets(wallets: WalletDirectoryEntry[]) {
  return [...wallets].sort((a, b) => a.name.localeCompare(b.name));
}

function buildWalletEntries(): WalletDirectoryEntry[] {
  return sortWallets(
    Object.entries(walletData).map(([slug, record]) => {
      const iconUrls = getWalletIconUrls(record.icon);

      return {
        id: slug,
        name: record.name,
        slug,
        companyId: record.companyId,
        category: record.category,
        categories: buildWalletCategories(record.category, record.features),
        platforms: record.platforms,
        features: record.features,
        description: record.description,
        website: record.website,
        iconUrl: iconUrls[0],
        iconUrls,
        supportedChains: [SOLANA_MAINNET],
        supportedAssets: [],
        lastVerified: record.lastVerified,
      };
    }),
  );
}

function getLastReviewed(wallets: WalletDirectoryEntry[]) {
  return wallets.reduce<string | undefined>((latest, wallet) => {
    if (!wallet.lastVerified) {
      return latest;
    }

    return !latest || wallet.lastVerified > latest
      ? wallet.lastVerified
      : latest;
  }, undefined);
}

export async function getWalletDirectoryData(): Promise<WalletDirectoryData> {
  const wallets = buildWalletEntries();

  return {
    wallets,
    lastReviewed: getLastReviewed(wallets),
  };
}
