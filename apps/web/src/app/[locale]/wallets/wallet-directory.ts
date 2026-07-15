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
