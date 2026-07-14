import { walletData } from "./wallet-data";

export const WALLET_CATEGORIES = [
  "consumer",
  "hardware",
  "infrastructure",
  "institutional",
  "payments",
] as const;

export type WalletCategory = (typeof WALLET_CATEGORIES)[number];

export const WALLET_CATEGORY_LABELS = {
  consumer: "Wallets",
  hardware: "Hardware",
  infrastructure: "Developer tools",
  institutional: "Institutional",
  payments: "Payments",
} as const satisfies Record<WalletCategory, string>;

export const WALLET_PLATFORMS = [
  "ios",
  "android",
  "chrome",
  "firefox",
  "brave",
  "edge",
  "desktop",
  "web",
  "hardware",
  "api",
  "sdk",
] as const;

export type WalletPlatform = (typeof WALLET_PLATFORMS)[number];

export const WALLET_PLATFORM_LABELS = {
  ios: "iOS",
  android: "Android",
  chrome: "Chrome",
  firefox: "Firefox",
  brave: "Brave",
  edge: "Edge",
  desktop: "Desktop",
  web: "Web",
  hardware: "Hardware",
  api: "API",
  sdk: "SDK",
} as const satisfies Record<WalletPlatform, string>;

export const WALLET_FEATURES = [
  "custodial",
  "non_custodial",
  "te",
  "blinks_and_actions",
  "solana_pay",
  "buy_crypto",
  "sell_crypto",
  "hold_nfts",
  "mpc",
  "gas_abstraction",
  "social_recovery",
  "staking",
  "spending_limits",
  "open_source",
  "hardware",
  "private_key_infrastructure",
  "multi_chain",
  "solana_native",
  "multi_sig",
] as const;

export type WalletFeature = (typeof WALLET_FEATURES)[number];

export const WALLET_FEATURE_LABELS = {
  custodial: "Custodial",
  non_custodial: "Self-custody",
  te: "Token Extensions",
  blinks_and_actions: "Blinks and Actions",
  solana_pay: "Solana Pay",
  buy_crypto: "Buy crypto",
  sell_crypto: "Sell crypto",
  hold_nfts: "NFTs",
  mpc: "MPC",
  gas_abstraction: "Gas abstraction",
  social_recovery: "Social recovery",
  staking: "Staking",
  spending_limits: "Spending limits",
  open_source: "Open source",
  hardware: "Hardware support",
  private_key_infrastructure: "Key infrastructure",
  multi_chain: "Multi-chain",
  solana_native: "Solana native",
  multi_sig: "Multisig",
} as const satisfies Record<WalletFeature, string>;

export const WALLET_FEATURE_DESCRIPTIONS = {
  custodial: "The provider controls custody or account access for users.",
  non_custodial: "Users control their keys or signing authority.",
  te: "Supports Solana Token Extensions capabilities.",
  blinks_and_actions: "Supports Solana Actions or Blinks transaction flows.",
  solana_pay: "Supports Solana Pay payment flows.",
  buy_crypto: "Lets users buy crypto from fiat or linked accounts.",
  sell_crypto: "Lets users sell crypto to fiat or linked accounts.",
  hold_nfts: "Displays or manages NFTs and collectibles.",
  mpc: "Uses multi-party computation for key management.",
  gas_abstraction: "Can hide or sponsor network fee complexity.",
  social_recovery: "Supports account recovery through trusted or social flows.",
  staking: "Supports SOL staking or staking account management.",
  spending_limits: "Supports programmable spend controls or policy limits.",
  open_source: "Publishes relevant source code or SDKs.",
  hardware: "Works as or with a hardware wallet.",
  private_key_infrastructure: "Provides key custody or signing infrastructure.",
  multi_chain: "Supports multiple blockchain networks.",
  solana_native: "Built primarily for Solana users or Solana-first flows.",
  multi_sig: "Supports multiple approvals for account or treasury control.",
} as const satisfies Record<WalletFeature, string>;

export type WalletDirectoryEntry = {
  id: string;
  name: string;
  slug: string;
  companyId?: string;
  category: WalletCategory;
  platforms: WalletPlatform[];
  features: WalletFeature[];
  description: string;
  website: string;
  iconUrl?: string;
  sourceUrl?: string;
  docsUrl?: string;
  supportedChains: string[];
  supportedAssets: string[];
  lastVerified?: string;
  gridRank?: number;
  dataSources: Array<"the-grid" | "ecosystem-data" | "solana-overrides">;
};

export type WalletDirectoryData = {
  wallets: WalletDirectoryEntry[];
  lastFetchedAt: string;
  source: "the-grid" | "fallback";
};

type CuratedWallet = (typeof walletData)[number];

type CuratedWalletOverride = {
  canonicalName?: string;
  companyId?: string;
  category: WalletCategory;
  platforms: WalletPlatform[];
  features: WalletFeature[];
  description: string;
  website: string;
  iconUrl?: string;
  lastVerified?: string;
};

const CURATED_FEATURE_KEYS = [
  "custodial",
  "non_custodial",
  "te",
  "blinks_and_actions",
  "solana_pay",
  "buy_crypto",
  "sell_crypto",
  "hold_nfts",
  "mpc",
  "gas_abstraction",
  "social_recovery",
  "staking",
  "spending_limits",
  "open_source",
  "hardware",
  "private_key_infrastructure",
  "multi_chain",
  "solana_native",
] as const;

export function normalizeWalletKey(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\b(wallet|wallets|mobile|app|web3|crypto)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

function resolveIconUrl(icon: CuratedWallet["icon"]) {
  return typeof icon === "string" ? icon : icon.src;
}

function resolveWalletFeatures(wallet: CuratedWallet) {
  return CURATED_FEATURE_KEYS.filter((feature) => Boolean(wallet[feature]));
}

export const WALLET_COMPANY_ALIASES: Record<string, string> = {
  backpack: "backpack",
  brave: "brave",
  "brave-wallet": "brave",
  coinbase: "coinbase",
  "coinbase-wallet": "coinbase",
  dynamic: "dynamic",
  jupiter: "jupiter",
  "jupiter-mobile": "jupiter",
  phantom: "phantom",
  safepal: "safepal-wallet",
  "safepal-wallet": "safepal-wallet",
  solflare: "solflare",
  walletconnect: "walletconnect",
  "wallet-connect": "walletconnect",
};

export const WALLET_OVERRIDE_ALIASES: Record<string, string> = {
  backpack: "backpack",
  "backpack-exchange": "backpack",
  brave: "brave",
  "brave-wallet": "brave",
  coinbase: "coinbase",
  "coinbase-wallet": "coinbase",
  "exodus-wallet": "exodus",
  fuse: "fuse",
  "fuse-wallet": "fuse",
  "jupiter-mobile": "jupiter",
  metamask: "metamask",
  "meta-mask": "metamask",
  nightly: "nightly",
  phantom: "phantom",
  solflare: "solflare",
  "trezor-safe-5": "trezor",
  walletconnect: "walletconnect",
  "wallet-connect": "walletconnect",
};

export const curatedWalletOverrides = Object.fromEntries(
  walletData.map((wallet): [string, CuratedWalletOverride] => [
    normalizeWalletKey(wallet.name),
    {
      canonicalName: wallet.name,
      category: wallet.category as WalletCategory,
      platforms: [...wallet.platforms] as WalletPlatform[],
      features: resolveWalletFeatures(wallet),
      description: wallet.body,
      website: wallet.website,
      iconUrl: resolveIconUrl(wallet.icon),
      lastVerified: wallet.last_verified,
    },
  ]),
) as Record<string, CuratedWalletOverride>;

export function getCuratedWalletOverride(...names: Array<string | undefined>) {
  for (const name of names) {
    if (!name) {
      continue;
    }

    const normalizedName = normalizeWalletKey(name);
    const alias = WALLET_OVERRIDE_ALIASES[normalizedName];
    const override =
      curatedWalletOverrides[normalizedName] ??
      (alias ? curatedWalletOverrides[alias] : undefined);

    if (override) {
      return override;
    }
  }

  return undefined;
}

export function getWalletCompanyId(...names: Array<string | undefined>) {
  for (const name of names) {
    if (!name) {
      continue;
    }

    const normalizedName = normalizeWalletKey(name);
    const companyId =
      WALLET_COMPANY_ALIASES[normalizedName] ??
      WALLET_COMPANY_ALIASES[normalizedName.replace(/-/g, "")];

    if (companyId) {
      return companyId;
    }
  }

  return undefined;
}
