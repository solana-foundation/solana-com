/**
 * Wallet directory filter taxonomy: categories, platforms, and feature tags
 * with their display labels and descriptions. Pure data — apps derive label
 * maps and filter UI from these objects.
 */

export const WALLET_CATEGORY_METADATA = {
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

export const WALLET_PLATFORM_METADATA = {
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

export const WALLET_FEATURE_METADATA = {
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
    description: "Lets users directly cash out crypto to a fiat account.",
  },
  get_paid: {
    label: "Get paid",
    description:
      "Lets users or businesses accept payments, payment requests, or payouts.",
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
    description:
      "Provides configurable spend controls or transaction policies.",
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
