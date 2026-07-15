import {
  DEFAULT_WALLET_ICON,
  WALLET_CATEGORIES,
  WALLET_CATEGORY_METADATA,
  WALLET_FEATURES,
  WALLET_FEATURE_METADATA,
  WALLET_PLATFORMS,
  WALLET_PLATFORM_METADATA,
  type ImportedAssetModule,
  type WalletCategory,
  type WalletFeature,
  type WalletPlatform,
} from "@workspace/ecosystem-data";

export {
  WALLET_CATEGORIES,
  WALLET_FEATURES,
  WALLET_PLATFORMS,
  type WalletCategory,
  type WalletFeature,
  type WalletPlatform,
};

export function resolveWalletAssetSrc(asset: ImportedAssetModule) {
  return typeof asset === "string" ? asset : asset.src;
}

export const DEFAULT_WALLET_ICON_URL =
  resolveWalletAssetSrc(DEFAULT_WALLET_ICON);

function pickWalletMetadata<
  TKey extends string,
  TValueKey extends string,
  TMetadata extends Record<TKey, Record<TValueKey, string>>,
>(keys: readonly TKey[], metadata: TMetadata, valueKey: TValueKey) {
  const values = {} as Record<TKey, string>;

  for (const key of keys) {
    values[key] = metadata[key][valueKey];
  }

  return values;
}

export const WALLET_CATEGORY_LABELS = pickWalletMetadata(
  WALLET_CATEGORIES,
  WALLET_CATEGORY_METADATA,
  "label",
);

export const WALLET_PLATFORM_LABELS = pickWalletMetadata(
  WALLET_PLATFORMS,
  WALLET_PLATFORM_METADATA,
  "label",
);

export const WALLET_FEATURE_LABELS = pickWalletMetadata(
  WALLET_FEATURES,
  WALLET_FEATURE_METADATA,
  "label",
);

export const WALLET_FEATURE_DESCRIPTIONS = pickWalletMetadata(
  WALLET_FEATURES,
  WALLET_FEATURE_METADATA,
  "description",
);

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
};
