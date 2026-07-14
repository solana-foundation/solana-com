/**
 * Canonical wallet directory data. This module exports data and types only —
 * all interpretation (directory entry building, filtering, label lookup, icon
 * fallback) lives in the consuming app (apps/web/src/app/[locale]/wallets).
 */

export {
  DEFAULT_WALLET_ICON,
  walletData,
  type WalletRecord,
  type WalletSlug,
} from "./wallet-data";

export {
  WALLET_CATEGORIES,
  WALLET_CATEGORY_METADATA,
  WALLET_FEATURES,
  WALLET_FEATURE_METADATA,
  WALLET_PLATFORMS,
  WALLET_PLATFORM_METADATA,
  type WalletCategory,
  type WalletFeature,
  type WalletPlatform,
} from "./taxonomy";
