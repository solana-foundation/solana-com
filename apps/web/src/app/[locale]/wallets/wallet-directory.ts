import {
  WALLET_CATEGORIES,
  WALLET_FEATURES,
  WALLET_PLATFORMS,
  type WalletCategory,
  type WalletFeature,
  type WalletPlatform,
} from "@workspace/ecosystem-data/wallet-taxonomy";

export {
  WALLET_CATEGORIES,
  WALLET_FEATURES,
  WALLET_PLATFORMS,
  type WalletCategory,
  type WalletFeature,
  type WalletPlatform,
};

export type WalletDirectoryEntry = {
  id: string;
  name: string;
  slug: string;
  companyId?: string;
  category: WalletCategory;
  categories: WalletCategory[];
  platforms: WalletPlatform[];
  features: WalletFeature[];
  description: string;
  website: string;
  iconUrl?: string;
  /** Ordered icon candidates, best first, for graceful client-side fallback. */
  iconUrls?: string[];
  supportedChains: string[];
  supportedAssets: string[];
  lastVerified?: string;
};

export type WalletDirectoryData = {
  wallets: WalletDirectoryEntry[];
  lastReviewed?: string;
};

const FEATURED_EVERYDAY_WALLET_COUNT = 4;
const FEATURED_EVERYDAY_WALLET_IDS = [
  "solflare",
  "backpack",
  "phantom",
  "fuse",
  "jupiter",
] as const;

export function getFeaturedEverydayWallets(
  wallets: readonly WalletDirectoryEntry[],
  {
    randomize = false,
    random = Math.random,
  }: { randomize?: boolean; random?: () => number } = {},
) {
  const candidates = FEATURED_EVERYDAY_WALLET_IDS.flatMap((id) => {
    const wallet = wallets.find(
      (candidate) => candidate.id === id && candidate.category === "consumer",
    );

    return wallet ? [wallet] : [];
  });

  if (randomize) {
    for (let index = candidates.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [candidates[index], candidates[swapIndex]] = [
        candidates[swapIndex]!,
        candidates[index]!,
      ];
    }
  }

  return candidates.slice(0, FEATURED_EVERYDAY_WALLET_COUNT);
}

const PAYMENT_CATEGORY_FEATURES = [
  "buy_crypto",
  "sell_crypto",
  "get_paid",
  "card_spending",
] as const satisfies readonly WalletFeature[];

/**
 * Categories describe both the wallet's primary product type and the
 * capabilities promised by category landing URLs. A wallet belongs in the
 * Payments results when users can buy, sell, get paid, or spend through an
 * integrated card with it.
 */
export function buildWalletCategories(
  category: WalletCategory,
  features: readonly WalletFeature[],
) {
  const categories: WalletCategory[] = [category];
  const supportsPayments = PAYMENT_CATEGORY_FEATURES.some((feature) =>
    features.includes(feature),
  );

  if (supportsPayments && !categories.includes("payments")) {
    categories.push("payments");
  }

  return categories;
}
