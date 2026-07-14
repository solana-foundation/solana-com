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

export const curatedWalletOverrides = {
  ...legacyWalletOverrides,
  ...walletDirectoryOverrides,
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
