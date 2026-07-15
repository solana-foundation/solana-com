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

const PAYMENT_CATEGORY_FEATURES = [
  "buy_crypto",
  "sell_crypto",
  "get_paid",
] as const satisfies readonly WalletFeature[];

/**
 * Categories describe both the wallet's primary product type and the
 * capabilities promised by category landing URLs. A wallet belongs in the
 * Payments results when users can buy, sell, or get paid with it.
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
