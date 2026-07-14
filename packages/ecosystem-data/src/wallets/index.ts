import { walletData } from "./wallet-data";
import defaultWalletIcon from "../../assets/wallets/wallet-placeholder-icon.webp";
import nightlyIcon from "../../assets/wallets/icons/nightly.webp";
import ryderIcon from "../../assets/wallets/icons/ryder.webp";
import safepalIcon from "../../assets/wallets/icons/safepal.webp";

export { walletData } from "./wallet-data";

const WALLET_CATEGORY_METADATA = {
  consumer: { label: "Wallets" },
  hardware: { label: "Hardware" },
  infrastructure: { label: "Developer tools" },
  institutional: { label: "Institutional" },
  payments: { label: "Payments" },
} as const;

export type WalletCategory = keyof typeof WALLET_CATEGORY_METADATA;

export const WALLET_CATEGORIES = Object.keys(
  WALLET_CATEGORY_METADATA,
) as WalletCategory[];

export const WALLET_CATEGORY_LABELS = pickWalletMetadata(
  WALLET_CATEGORIES,
  WALLET_CATEGORY_METADATA,
  "label",
);

const WALLET_PLATFORM_METADATA = {
  ios: { label: "iOS" },
  android: { label: "Android" },
  chrome: { label: "Chrome" },
  firefox: { label: "Firefox" },
  brave: { label: "Brave" },
  edge: { label: "Edge" },
  desktop: { label: "Desktop" },
  web: { label: "Web" },
  hardware: { label: "Hardware" },
  api: { label: "API" },
  sdk: { label: "SDK" },
} as const;

export type WalletPlatform = keyof typeof WALLET_PLATFORM_METADATA;

export const WALLET_PLATFORMS = Object.keys(
  WALLET_PLATFORM_METADATA,
) as WalletPlatform[];

export const WALLET_PLATFORM_LABELS = pickWalletMetadata(
  WALLET_PLATFORMS,
  WALLET_PLATFORM_METADATA,
  "label",
);

const WALLET_FEATURE_METADATA = {
  custodial: {
    label: "Custodial",
    description: "The provider controls custody or account access for users.",
  },
  non_custodial: {
    label: "Self-custody",
    description: "Users control their keys or signing authority.",
  },
  te: {
    label: "Token Extensions",
    description: "Supports Solana Token Extensions capabilities.",
  },
  blinks_and_actions: {
    label: "Blinks and Actions",
    description: "Supports Solana Actions or Blinks transaction flows.",
  },
  solana_pay: {
    label: "Solana Pay",
    description: "Supports Solana Pay payment flows.",
  },
  buy_crypto: {
    label: "Buy crypto",
    description: "Lets users buy crypto from fiat or linked accounts.",
  },
  sell_crypto: {
    label: "Sell crypto",
    description: "Lets users sell crypto to fiat or linked accounts.",
  },
  hold_nfts: {
    label: "NFTs",
    description: "Displays or manages NFTs and collectibles.",
  },
  mpc: {
    label: "MPC",
    description: "Uses multi-party computation for key management.",
  },
  gas_abstraction: {
    label: "Gas abstraction",
    description: "Can hide or sponsor network fee complexity.",
  },
  social_recovery: {
    label: "Social recovery",
    description: "Supports account recovery through trusted or social flows.",
  },
  staking: {
    label: "Staking",
    description: "Supports SOL staking or staking account management.",
  },
  spending_limits: {
    label: "Spending limits",
    description: "Supports programmable spend controls or policy limits.",
  },
  open_source: {
    label: "Open source",
    description: "Publishes relevant source code or SDKs.",
  },
  hardware: {
    label: "Hardware support",
    description: "Works as or with a hardware wallet.",
  },
  private_key_infrastructure: {
    label: "Key infrastructure",
    description: "Provides key custody or signing infrastructure.",
  },
  multi_chain: {
    label: "Multi-chain",
    description: "Supports multiple blockchain networks.",
  },
  solana_native: {
    label: "Solana native",
    description: "Built primarily for Solana users or Solana-first flows.",
  },
  multi_sig: {
    label: "Multisig",
    description: "Supports multiple approvals for account or treasury control.",
  },
} as const;

export type WalletFeature = keyof typeof WALLET_FEATURE_METADATA;

export const WALLET_FEATURES = Object.keys(
  WALLET_FEATURE_METADATA,
) as WalletFeature[];

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
  sourceUrl?: string;
  docsUrl?: string;
  supportedChains: string[];
  supportedAssets: string[];
  lastVerified?: string;
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

type LegacyWalletFeature = Exclude<WalletFeature, "multi_sig">;

const CURATED_FEATURE_KEYS = WALLET_FEATURES.filter(
  (feature): feature is LegacyWalletFeature => feature !== "multi_sig",
);

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

export const DEFAULT_WALLET_ICON_URL = resolveIconUrl(defaultWalletIcon);

function resolveWalletFeatures(wallet: CuratedWallet) {
  return CURATED_FEATURE_KEYS.filter((feature) => Boolean(wallet[feature]));
}

export const WALLET_COMPANY_ALIASES: Record<string, string> = {
  backpack: "backpack",
  brave: "brave",
  "brave-wallet": "brave",
  "base-app": "coinbase",
  "base-formerly-coinbase": "coinbase",
  coinbase: "coinbase",
  "coinbase-wallet": "coinbase",
  dynamic: "dynamic",
  fireblocks: "fireblocks",
  jupiter: "jupiter",
  "jupiter-mobile": "jupiter",
  phantom: "phantom",
  ryder: "ryder",
  safepal: "safepal-wallet",
  "safepal-wallet": "safepal-wallet",
  solflare: "solflare",
  squads: "squads",
  walletconnect: "walletconnect",
  "wallet-connect": "walletconnect",
  zerion: "zerion",
};

export const WALLET_OVERRIDE_ALIASES: Record<string, string> = {
  backpack: "backpack",
  "backpack-exchange": "backpack",
  brave: "brave",
  "brave-wallet": "brave",
  "base-app": "coinbase",
  "base-formerly-coinbase": "coinbase",
  "cdp-coinbase": "cdp",
  "cdp-embedded-wallets": "cdp",
  "cdp-server-wallets": "cdp",
  coinbase: "coinbase",
  "coinbase-wallet": "coinbase",
  "coinbase-developer-platform": "cdp",
  crossmint: "crossmint-non-custodial",
  "exodus-wallet": "exodus",
  fireblocks: "fireblocks-embedded",
  fuse: "fuse",
  "fuse-wallet": "fuse",
  "jupiter-mobile": "jupiter",
  metamask: "metamask",
  "meta-mask": "metamask",
  nightly: "nightly",
  paypal: "paypal-cryptocurrency-services",
  phantom: "phantom",
  solflare: "solflare",
  squads: "squadsx",
  "trezor-safe-5": "trezor",
  walletconnect: "walletconnect",
  "wallet-connect": "walletconnect",
};

const legacyWalletOverrides = Object.fromEntries(
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

const walletDirectoryOverrides = {
  coinbase: {
    canonicalName: "Base App",
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "gas_abstraction",
      "social_recovery",
      "multi_chain",
    ],
    description:
      "Self-custody wallet and browser formerly known as Coinbase Wallet, with Base, Solana, Ethereum, and BNB Chain support",
    website: "https://base.app/",
    lastVerified: "2026-07-14",
  },
  "fireblocks-embedded": {
    canonicalName: "Fireblocks Embedded Wallets",
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "mpc",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Embedded wallet infrastructure with MPC signing and native web and mobile SDKs for businesses",
    website: "https://www.fireblocks.com/platforms/embedded-wallets",
    lastVerified: "2026-07-14",
  },
  gate: {
    canonicalName: "Gate Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: ["non_custodial", "buy_crypto", "sell_crypto", "multi_chain"],
    description:
      "Self-custody multi-chain wallet for swaps, transfers, earning, and dApp access",
    website: "https://web3.gate.com/",
    lastVerified: "2026-07-14",
  },
  jupiter: {
    canonicalName: "Jupiter Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "brave", "edge"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "solana_native",
    ],
    description:
      "Self-custodial Solana wallet from Jupiter for swaps, trading, portfolio management, payments, and dApp access",
    website: "https://jup.ag/wallet",
    lastVerified: "2026-07-14",
  },
  kraken: {
    canonicalName: "Kraken Wallet",
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["non_custodial", "hold_nfts", "open_source", "multi_chain"],
    description:
      "Self-custody multi-chain wallet for managing crypto, NFTs, DeFi positions, and Solana dApps",
    website: "https://www.kraken.com/wallet",
    lastVerified: "2026-07-14",
  },
  nightly: {
    canonicalName: "Nightly",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox", "brave", "edge"],
    features: [
      "non_custodial",
      "te",
      "hold_nfts",
      "social_recovery",
      "staking",
      "hardware",
      "multi_chain",
    ],
    description:
      "Self-custody multi-chain wallet for Solana, Sui, Aptos, and EVM with staking, NFTs, and Ledger support",
    website: "https://nightly.app/",
    iconUrl: resolveIconUrl(nightlyIcon),
    lastVerified: "2026-07-14",
  },
  "paypal-cryptocurrency-services": {
    canonicalName: "PayPal Cryptocurrency Services",
    category: "payments",
    platforms: ["ios", "web"],
    features: ["custodial", "buy_crypto", "sell_crypto", "multi_chain"],
    description:
      "PayPal crypto wallet services for buying, selling, holding, transferring, and checking out with supported cryptocurrencies",
    website: "https://www.paypal.com/us/digital-wallet/manage-money/crypto",
    lastVerified: "2026-07-14",
  },
  okx: {
    canonicalName: "OKX Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "brave", "edge", "web"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "mpc",
      "gas_abstraction",
      "staking",
      "open_source",
      "multi_chain",
    ],
    description:
      "Self-custodial multi-chain wallet for swaps, staking, NFTs, account-abstraction smart accounts, and dApp access",
    website: "https://web3.okx.com/",
    lastVerified: "2026-07-14",
  },
  openfort: {
    canonicalName: "Openfort",
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "gas_abstraction",
      "social_recovery",
      "spending_limits",
      "open_source",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Open-source wallet infrastructure for embedded wallets, smart accounts, gas sponsorship, policy controls, and stablecoin payments",
    website: "https://www.openfort.io/",
    lastVerified: "2026-07-14",
  },
  phantom: {
    canonicalName: "Phantom",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox", "brave"],
    features: [
      "non_custodial",
      "te",
      "blinks_and_actions",
      "solana_pay",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "hardware",
      "multi_chain",
      "solana_native",
    ],
    description:
      "Multi-chain self-custody wallet for buying, selling, staking, spending, and managing tokens and NFTs",
    website: "https://phantom.com/",
    lastVerified: "2026-07-14",
  },
  privy: {
    canonicalName: "Privy",
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "custodial",
      "non_custodial",
      "buy_crypto",
      "gas_abstraction",
      "social_recovery",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Embedded wallet and authentication infrastructure with configurable custody, policy controls, fiat onramps, cloud recovery, and Solana gas sponsorship",
    website: "https://www.privy.io/",
    lastVerified: "2026-07-14",
  },
  ryder: {
    canonicalName: "Ryder",
    category: "hardware",
    platforms: ["ios", "android", "hardware"],
    features: [
      "non_custodial",
      "social_recovery",
      "staking",
      "hardware",
      "multi_chain",
    ],
    description:
      "Seed-phrase-free hardware wallet with TapSafe recovery and a companion app for SPL tokens and SOL staking",
    website: "https://ryder.id/",
    iconUrl: resolveIconUrl(ryderIcon),
    lastVerified: "2026-07-14",
  },
  safepal: {
    canonicalName: "SafePal",
    category: "hardware",
    platforms: ["ios", "android", "chrome", "firefox", "edge", "hardware"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "open_source",
      "hardware",
      "multi_chain",
    ],
    description:
      "Hardware wallet family with companion mobile app and browser extension for SOL staking, swaps, and NFTs across 200+ chains",
    website: "https://www.safepal.com/",
    iconUrl: resolveIconUrl(safepalIcon),
    lastVerified: "2026-07-14",
  },
  squadsx: {
    canonicalName: "SquadsX",
    category: "institutional",
    platforms: ["chrome"],
    features: ["non_custodial", "solana_native", "multi_sig"],
    description:
      "Browser extension that lets Squads multisigs connect to Solana dApps while retaining multisig transaction approvals",
    website:
      "https://chromewebstore.google.com/detail/squadsx/jhmfofkpljgmilikdmkglcmekjnlekda",
    lastVerified: "2026-07-14",
  },
  trezor: {
    canonicalName: "Trezor",
    category: "hardware",
    platforms: ["desktop", "web", "hardware"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "open_source",
      "hardware",
      "multi_chain",
    ],
    description:
      "Open-source hardware wallet and Trezor Suite app for buying, selling, managing NFTs, and staking supported assets including Solana",
    website: "https://trezor.io/",
    lastVerified: "2026-07-14",
  },
  zerion: {
    canonicalName: "Zerion Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "web"],
    features: ["non_custodial", "buy_crypto", "hold_nfts", "multi_chain"],
    description:
      "Self-custody wallet for Solana, Ethereum, and major EVM networks with portfolio tracking, swaps, and NFT support",
    website: "https://zerion.io/",
    lastVerified: "2026-07-14",
  },
} satisfies Record<string, CuratedWalletOverride>;

export const localWalletDirectoryOverrides = {
  unruggable: {
    canonicalName: "Unruggable",
    category: "hardware",
    platforms: ["android", "desktop", "hardware"],
    features: [
      "non_custodial",
      "staking",
      "open_source",
      "hardware",
      "solana_native",
    ],
    description:
      "Solana-native open-source hardware wallet with desktop and Android companion apps for cold wallet signing, staking, and swapping",
    website: "https://www.unruggable.io/",
    iconUrl: "https://www.unruggable.io/unruggable-icon-v2.png?v=20260517",
    lastVerified: "2026-07-14",
  },
} satisfies Record<string, CuratedWalletOverride>;

export const curatedWalletOverrides = {
  ...legacyWalletOverrides,
  ...walletDirectoryOverrides,
  ...localWalletDirectoryOverrides,
} as Record<string, CuratedWalletOverride>;

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
