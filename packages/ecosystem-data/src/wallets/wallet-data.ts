import type { ImportedAssetModule } from "../types";
import type { WalletCategory, WalletFeature, WalletPlatform } from "./taxonomy";
import defaultWalletIcon from "../../assets/wallets/wallet-placeholder-icon.webp";
import atomicwalletIcon from "../../assets/wallets/icons/atomicwallet.webp";
import backpackIcon from "../../assets/wallets/icons/backpack.webp";
import binanceIcon from "../../assets/wallets/icons/binance.webp";
import bitgetIcon from "../../assets/wallets/icons/bitget.webp";
import braveIcon from "../../assets/wallets/icons/brave.webp";
import cakewalletIcon from "../../assets/wallets/icons/cakewallet.webp";
import cdpIcon from "../../assets/wallets/icons/cdp.webp";
import circleIcon from "../../assets/wallets/icons/circle.webp";
import coinbaseIcon from "../../assets/wallets/icons/coinbase.webp";
import coinwalletIcon from "../../assets/wallets/icons/coinwallet.webp";
import crossmintIcon from "../../assets/wallets/icons/crossmint.webp";
import cypherockIcon from "../../assets/wallets/icons/cypherock.webp";
import decafIcon from "../../assets/wallets/icons/decaf.webp";
import dynamicIcon from "../../assets/wallets/icons/dynamic.webp";
import enkryptIcon from "../../assets/wallets/icons/enkrypt.webp";
import exodusIcon from "../../assets/wallets/icons/exodus.webp";
import fuseIcon from "../../assets/wallets/icons/fuse.webp";
import gemIcon from "../../assets/wallets/icons/gem.webp";
import glowIcon from "../../assets/wallets/icons/glow.webp";
import guardaIcon from "../../assets/wallets/icons/guarda.webp";
import heliumIcon from "../../assets/wallets/icons/helium.webp";
import infinexIcon from "../../assets/wallets/icons/infinex.webp";
import jupiterIcon from "../../assets/wallets/icons/jupiter.webp";
import keystoneIcon from "../../assets/wallets/icons/keystone.webp";
import ledgerIcon from "../../assets/wallets/icons/ledger.webp";
import metamaskIcon from "../../assets/wallets/icons/metamask.webp";
import nightlyIcon from "../../assets/wallets/icons/nightly.webp";
import nowwalletIcon from "../../assets/wallets/icons/nowwallet.webp";
import okxIcon from "../../assets/wallets/icons/okx.webp";
import onekeyIcon from "../../assets/wallets/icons/onekey.webp";
import openfortIcon from "../../assets/wallets/icons/openfort.webp";
import opensignerIcon from "../../assets/wallets/icons/opensigner.webp";
import paraIcon from "../../assets/wallets/icons/para.webp";
import phantomIcon from "../../assets/wallets/icons/phantom.webp";
import privyIcon from "../../assets/wallets/icons/privy.webp";
import robinhoodIcon from "../../assets/wallets/icons/robinhood.webp";
import ryderIcon from "../../assets/wallets/icons/ryder.webp";
import safepalIcon from "../../assets/wallets/icons/safepal.webp";
import samuiIcon from "../../assets/wallets/icons/samui.webp";
import solflareIcon from "../../assets/wallets/icons/solflare.webp";
import tiplinkIcon from "../../assets/wallets/icons/tiplink.webp";
import tokenpocketIcon from "../../assets/wallets/icons/tokenpocket.webp";
import trezorIcon from "../../assets/wallets/icons/trezor.webp";
import trustwalletcoreIcon from "../../assets/wallets/icons/trustwalletcore.webp";
import turnkeyIcon from "../../assets/wallets/icons/turnkey.webp";
import web3authIcon from "../../assets/wallets/icons/web3auth.webp";

export type WalletRecord = {
  /** Display name for the wallet product. */
  name: string;
  /** Slug of the owning company in `src/companies`, when one exists. */
  companyId?: string;
  /** Alternate normalized product names (e.g. from The Grid) that map to this record. */
  aliases?: string[];
  category: WalletCategory;
  platforms: WalletPlatform[];
  features: WalletFeature[];
  description: string;
  website: string;
  /** Verified wallet product icon; omit to fall back to the placeholder. */
  icon?: ImportedAssetModule;
  /** Date (YYYY-MM-DD) the record was last researched end-to-end. */
  lastVerified?: string;
};

export const DEFAULT_WALLET_ICON: ImportedAssetModule = defaultWalletIcon;

/**
 * Canonical Solana wallet directory records, keyed by wallet slug.
 * This is the single source of truth: research updates edit these records
 * directly. No override layers exist.
 */
const walletRecords = {
  atomic: {
    name: "Atomic Wallet",
    category: "consumer",
    platforms: ["ios", "android", "desktop"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "staking",
      "multi_chain",
    ],
    description:
      "Non-custodial multi-asset wallet with built-in swaps, staking for 30+ coins, and NFT support",
    website: "https://atomicwallet.io/",
    icon: atomicwalletIcon,
    lastVerified: "2026-03-30",
  },
  backpack: {
    name: "Backpack",
    companyId: "backpack",
    aliases: ["backpack-exchange"],
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "open_source",
      "hardware",
      "multi_chain",
      "solana_native",
      "multi_sig",
    ],
    description:
      "Self-custody wallet and exchange for Solana, Ethereum, and BTC, with mobile apps, a browser extension, SOL staking, hardware wallet import, and 3-of-3 multisig support",
    website: "https://backpack.app/",
    icon: backpackIcon,
    lastVerified: "2026-07-14",
  },
  binance: {
    name: "Binance Web3 Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "mpc",
      "staking",
      "multi_chain",
    ],
    description:
      "Self-custody MPC wallet integrated into Binance with multi-chain swaps, staking, and dApp access",
    website: "https://www.binance.com/en/web3wallet",
    icon: binanceIcon,
    lastVerified: "2026-03-30",
  },
  bitget: {
    name: "Bitget",
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: [
      "non_custodial",
      "solana_pay",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "mpc",
      "gas_abstraction",
      "staking",
      "multi_chain",
    ],
    description:
      "Non-custodial multi-chain wallet with MPC security and gas-free transactions on Solana",
    website: "https://web3.bitget.com/en/",
    icon: bitgetIcon,
    lastVerified: "2026-03-30",
  },
  bitgo: {
    name: "BitGo Wallet as a Service",
    aliases: ["bitgo-as-a-service"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: ["spending_limits", "private_key_infrastructure", "multi_chain"],
    description:
      "Wallet-as-a-service infrastructure for businesses to create wallets, receive addresses, transaction signing, whitelists, velocity controls, and user permissions",
    website: "https://www.bitgo.com/products/wallet-as-a-service",
    lastVerified: "2026-07-14",
  },
  brave: {
    name: "Brave",
    companyId: "brave",
    aliases: ["brave-wallet"],
    category: "consumer",
    platforms: ["ios", "android", "desktop"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "open_source",
      "multi_chain",
    ],
    description:
      "Browser-native self-custody wallet with multi-chain swaps, NFTs, and hardware wallet support",
    website: "https://brave.com/wallet/",
    icon: braveIcon,
    lastVerified: "2026-03-30",
  },
  cake: {
    name: "Cake Wallet",
    category: "consumer",
    platforms: ["ios", "android", "desktop"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "open_source",
      "multi_chain",
    ],
    description:
      "Open-source, privacy-focused non-custodial wallet with Solana support via Jupiter DEX integration",
    website: "https://cakewallet.com/",
    icon: cakewalletIcon,
    lastVerified: "2026-03-30",
  },
  cdp: {
    name: "CDP Wallets",
    aliases: [
      "cdp-coinbase",
      "cdp-embedded-wallets",
      "cdp-server-wallets",
      "coinbase-developer-platform",
    ],
    category: "institutional",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Programmable wallet infrastructure by Coinbase with policy engine and TEE-based key management",
    website: "https://www.coinbase.com/developer-platform/products/wallets",
    icon: cdpIcon,
    lastVerified: "2026-03-30",
  },
  circle: {
    name: "Circle",
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "custodial",
      "non_custodial",
      "mpc",
      "gas_abstraction",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Programmable wallet infrastructure with MPC security and gas sponsorship for developers",
    website: "https://www.circle.com/programmable-wallets",
    icon: circleIcon,
    lastVerified: "2026-03-30",
  },
  cobo: {
    name: "Cobo Portal",
    aliases: ["cobo-portal"],
    category: "institutional",
    platforms: ["web", "api"],
    features: [
      "custodial",
      "mpc",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Institutional wallet platform with custodial, MPC, smart contract, and exchange wallet technology for token operations across 80+ chains",
    website: "https://www.cobo.com/products/portal",
    lastVerified: "2026-07-14",
  },
  coin: {
    name: "Coin Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "desktop"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "open_source",
      "multi_chain",
    ],
    description:
      "Open-source self-custodial multicurrency wallet for multiple platforms, available since 2015",
    website: "https://coin.space/",
    icon: coinwalletIcon,
    lastVerified: "2026-03-30",
  },
  coinbase: {
    name: "Base App",
    companyId: "coinbase",
    aliases: ["base-app", "base-formerly-coinbase", "coinbase-wallet"],
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
    icon: coinbaseIcon,
    lastVerified: "2026-07-14",
  },
  coolwallet: {
    name: "CoolWallet",
    aliases: ["coolwallet-app", "coolwallet-go", "coolwallet-pro"],
    category: "hardware",
    platforms: ["ios", "android", "hardware"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "hardware",
      "multi_chain",
    ],
    description:
      "Hardware wallet and companion app for managing cold and hot wallets, buying, selling, staking, NFTs, and Solana across supported chains",
    website: "https://www.coolwallet.io/pages/coolwallet-app",
    lastVerified: "2026-07-14",
  },
  "crossmint-custodial": {
    name: "Crossmint Custodial",
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "custodial",
      "buy_crypto",
      "hold_nfts",
      "mpc",
      "gas_abstraction",
      "social_recovery",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Enterprise custodial wallet-as-a-service with MPC key management and compliance tools",
    website: "https://www.crossmint.com/products/custodial-wallet-as-a-service",
    icon: crossmintIcon,
    lastVerified: "2026-03-30",
  },
  "crossmint-non-custodial": {
    name: "Crossmint Non-Custodial",
    aliases: ["crossmint"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "mpc",
      "gas_abstraction",
      "social_recovery",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Embedded smart wallet infrastructure with gas sponsorship and onchain security controls for developers",
    website:
      "https://www.crossmint.com/products/non-custodial-wallets-as-a-service",
    icon: crossmintIcon,
    lastVerified: "2026-03-30",
  },
  cypherock: {
    name: "Cypherock",
    category: "hardware",
    platforms: ["desktop"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "social_recovery",
      "open_source",
      "hardware",
      "multi_chain",
    ],
    description:
      "Open-source hardware wallet splitting keys across 4 NFC cards using Shamir Secret Sharing",
    website: "https://www.cypherock.com/",
    icon: cypherockIcon,
    lastVerified: "2026-03-30",
  },
  decaf: {
    name: "Decaf",
    category: "payments",
    platforms: ["ios", "android"],
    features: ["non_custodial", "buy_crypto", "sell_crypto", "solana_native"],
    description:
      "Non-custodial wallet for USDC payments, payment links, local-currency transfers, cash pickup, and Visa card spending",
    website: "https://www.decaf.so/",
    icon: decafIcon,
    lastVerified: "2026-07-14",
  },
  dfns: {
    name: "DFNS Wallet-as-a-Service",
    aliases: ["dfns-as-a-service-platform-waas"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "custodial",
      "non_custodial",
      "mpc",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Wallet API for creating and managing custodial or delegated MPC wallets, policies, approvals, tags, and transactions across many networks",
    website: "https://dfns.co/wallet-as-a-service/",
    lastVerified: "2026-07-14",
  },
  dynamic: {
    name: "Dynamic",
    companyId: "dynamic",
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "buy_crypto",
      "mpc",
      "gas_abstraction",
      "social_recovery",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Embedded wallet infrastructure with MPC key management and multi-chain auth for developers",
    website: "https://www.dynamic.xyz/",
    icon: dynamicIcon,
    lastVerified: "2026-03-30",
  },
  ellipal: {
    name: "ELLIPAL",
    aliases: ["ellipal-titan-2-0"],
    category: "hardware",
    platforms: ["ios", "android", "hardware"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "hardware",
      "multi_chain",
    ],
    description:
      "Air-gapped hardware wallet family with a non-custodial mobile app for swaps, buy and sell flows, NFTs, and Solana among 40+ blockchains",
    website: "https://www.ellipal.com/",
    lastVerified: "2026-07-14",
  },
  enkrypt: {
    name: "Enkrypt",
    category: "consumer",
    platforms: ["chrome", "firefox", "edge", "brave"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "open_source",
      "multi_chain",
    ],
    description:
      "Open-source multichain browser wallet by MyEtherWallet with 70+ natively integrated chains",
    website: "https://www.enkrypt.com/",
    icon: enkryptIcon,
    lastVerified: "2026-03-30",
  },
  exodus: {
    name: "Exodus",
    aliases: ["exodus-wallet"],
    category: "consumer",
    platforms: ["ios", "android", "chrome", "desktop"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "multi_chain",
    ],
    description:
      "Multi-chain self-custody wallet with built-in exchange, staking, and Trezor hardware integration",
    website: "https://www.exodus.com/",
    icon: exodusIcon,
    lastVerified: "2026-03-30",
  },
  "fireblocks-embedded": {
    name: "Fireblocks Embedded Wallets",
    aliases: ["fireblocks"],
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
  fuse: {
    name: "Fuse Wallet",
    aliases: ["fuse-wallet"],
    category: "consumer",
    platforms: ["ios"],
    features: [
      "non_custodial",
      "buy_crypto",
      "gas_abstraction",
      "social_recovery",
      "staking",
      "spending_limits",
      "open_source",
      "solana_native",
    ],
    description:
      "Solana smart wallet built on Squads Protocol with multisig security and spending limits",
    website: "https://www.fusewallet.com/",
    icon: fuseIcon,
    lastVerified: "2026-03-30",
  },
  gate: {
    name: "Gate Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: ["non_custodial", "buy_crypto", "sell_crypto", "multi_chain"],
    description:
      "Self-custody multi-chain wallet for swaps, transfers, earning, and dApp access",
    website: "https://web3.gate.com/",
    lastVerified: "2026-07-14",
  },
  gem: {
    name: "Gem Wallet",
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "open_source",
      "multi_chain",
    ],
    description:
      "Open-source self-custodial wallet supporting 100+ chains with staking, swaps, and NFT management",
    website: "https://gemwallet.com/",
    icon: gemIcon,
    lastVerified: "2026-03-30",
  },
  glow: {
    name: "Glow",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox", "brave", "edge"],
    features: ["non_custodial", "hold_nfts", "staking", "solana_native"],
    description:
      "Solana-native wallet with zero-fee swaps, staking, NFT gallery, and spam token burner",
    website: "https://glow.app/",
    icon: glowIcon,
    lastVerified: "2026-07-14",
  },
  guarda: {
    name: "Guarda Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "desktop"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "multi_chain",
    ],
    description:
      "Non-custodial multi-platform wallet supporting 70+ blockchains with staking and crypto exchange",
    website: "https://guarda.com/",
    icon: guardaIcon,
    lastVerified: "2026-03-30",
  },
  helium: {
    name: "Helium",
    aliases: ["helium-network"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "hold_nfts",
      "staking",
      "open_source",
      "solana_native",
    ],
    description:
      "Open-source Solana wallet for managing HNT, MOBILE, and IOT tokens with governance staking",
    website: "https://docs.helium.com/wallets/helium-wallet-app/",
    icon: heliumIcon,
    lastVerified: "2026-07-14",
  },
  infinex: {
    name: "Infinex",
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "gas_abstraction",
      "social_recovery",
      "staking",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Passkey-first cross-chain wallet with gas abstraction, social recovery, and integrated trading",
    website: "https://infinex.xyz/?ref=solwf",
    icon: infinexIcon,
    lastVerified: "2026-03-30",
  },
  jupiter: {
    name: "Jupiter Wallet",
    companyId: "jupiter",
    aliases: ["jupiter-mobile"],
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
    icon: jupiterIcon,
    lastVerified: "2026-07-14",
  },
  keepkey: {
    name: "KeepKey",
    aliases: ["keepkey-vault-desktop"],
    category: "hardware",
    platforms: ["desktop", "chrome", "hardware"],
    features: ["non_custodial", "open_source", "hardware", "multi_chain"],
    description:
      "Open-source hardware wallet with desktop and browser software for self-custody, swaps, and Solana among supported native chains",
    website: "https://keepkey.com/",
    lastVerified: "2026-07-14",
  },
  keystone: {
    name: "Keystone",
    category: "hardware",
    platforms: ["android"],
    features: [
      "non_custodial",
      "hold_nfts",
      "staking",
      "open_source",
      "hardware",
      "multi_chain",
    ],
    description:
      "Air-gapped open-source hardware wallet using QR codes for secure transaction signing",
    website: "https://keyst.one/",
    icon: keystoneIcon,
    lastVerified: "2026-03-30",
  },
  kraken: {
    name: "Kraken Wallet",
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["non_custodial", "hold_nfts", "open_source", "multi_chain"],
    description:
      "Self-custody multi-chain wallet for managing crypto, NFTs, DeFi positions, and Solana dApps",
    website: "https://www.kraken.com/wallet",
    lastVerified: "2026-07-14",
  },
  ledger: {
    name: "Ledger",
    category: "hardware",
    platforms: ["desktop", "ios", "android"],
    features: [
      "non_custodial",
      "te",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "open_source",
      "hardware",
      "multi_chain",
    ],
    description:
      "Hardware wallet with Secure Element chip for offline key storage, staking, and crypto management",
    website: "https://www.ledger.com/",
    icon: ledgerIcon,
    lastVerified: "2026-03-30",
  },
  "magic-eden": {
    name: "Magic Eden Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: ["non_custodial", "hold_nfts", "multi_chain"],
    description:
      "Self-custodial cross-chain wallet for managing crypto portfolios, NFTs, swaps, and app connections across Solana, Bitcoin, Ethereum, and other networks",
    website: "https://wallet.magiceden.io/",
    lastVerified: "2026-07-14",
  },
  metamask: {
    name: "MetaMask",
    aliases: ["meta-mask"],
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox", "edge", "brave"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "multi_chain",
    ],
    description:
      "Non-custodial multi-chain wallet with native Solana support for swaps, staking, and NFTs",
    website: "https://metamask.io/",
    icon: metamaskIcon,
    lastVerified: "2026-03-30",
  },
  nightly: {
    name: "Nightly",
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
    icon: nightlyIcon,
    lastVerified: "2026-07-14",
  },
  now: {
    name: "NOW Wallet",
    aliases: ["changenow"],
    category: "consumer",
    platforms: ["ios", "android", "desktop"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "multi_chain",
    ],
    description:
      "Non-custodial mobile and desktop wallet by ChangeNOW supporting 70+ blockchains",
    website: "https://walletnow.app/",
    icon: nowwalletIcon,
    lastVerified: "2026-03-30",
  },
  okx: {
    name: "OKX Wallet",
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
    icon: okxIcon,
    lastVerified: "2026-07-14",
  },
  onekey: {
    name: "OneKey",
    category: "hardware",
    platforms: ["ios", "android", "chrome", "desktop"],
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
      "Open-source hardware wallet with software apps supporting 5000+ cryptos across multiple chains",
    website: "https://onekey.so/",
    icon: onekeyIcon,
    lastVerified: "2026-03-30",
  },
  openfort: {
    name: "Openfort",
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
    icon: openfortIcon,
    lastVerified: "2026-07-14",
  },
  opensigner: {
    name: "OpenSigner",
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "social_recovery",
      "open_source",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Open-source, self-hostable key management system for Solana and Ethereum",
    website: "https://opensigner.dev/",
    icon: opensignerIcon,
    lastVerified: "2026-03-30",
  },
  para: {
    name: "Para",
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "mpc",
      "gas_abstraction",
      "social_recovery",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "MPC-based embedded wallet infrastructure with gas sponsorship and programmable transaction controls",
    website: "https://www.getpara.com/",
    icon: paraIcon,
    lastVerified: "2026-03-30",
  },
  "particle-network": {
    name: "Particle Network Universal Accounts",
    aliases: ["particle-universal-accounts", "universal-accounts"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "mpc",
      "gas_abstraction",
      "social_recovery",
      "open_source",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Chain abstraction infrastructure with Universal Accounts, account abstraction, gas sponsorship, and social-login wallets for EVM and Solana apps",
    website: "https://particle.network/",
    lastVerified: "2026-07-14",
  },
  "paypal-cryptocurrency-services": {
    name: "PayPal Cryptocurrency Services",
    aliases: ["paypal"],
    category: "payments",
    platforms: ["ios", "web"],
    features: ["custodial", "buy_crypto", "sell_crypto", "multi_chain"],
    description:
      "PayPal crypto wallet services for buying, selling, holding, transferring, and checking out with supported cryptocurrencies",
    website: "https://www.paypal.com/us/digital-wallet/manage-money/crypto",
    lastVerified: "2026-07-14",
  },
  phantom: {
    name: "Phantom",
    companyId: "phantom",
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
    icon: phantomIcon,
    lastVerified: "2026-07-14",
  },
  portal: {
    name: "Portal",
    aliases: ["portal-embedded"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "mpc",
      "social_recovery",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Embedded wallet infrastructure using non-custodial TSS MPC and TEE key management with mobile and web SDK support",
    website: "https://www.portalhq.io/platform/mpc-wallet-as-a-service",
    lastVerified: "2026-07-14",
  },
  privy: {
    name: "Privy",
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
    icon: privyIcon,
    lastVerified: "2026-07-14",
  },
  reown: {
    name: "Reown WalletKit",
    companyId: "walletconnect",
    aliases: ["wallet-connect", "walletconnect", "walletkit"],
    category: "infrastructure",
    platforms: ["sdk"],
    features: ["open_source", "multi_chain"],
    description:
      "WalletConnect SDK for wallet builders to connect web, mobile, browser-extension, hardware, custodial, and self-custody wallets to onchain apps",
    website: "https://walletconnect.network/sdk",
    lastVerified: "2026-07-14",
  },
  robinhood: {
    name: "Robinhood",
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "multi_chain",
    ],
    description:
      "Non-custodial multi-chain wallet with zero-fee swaps, staking, and dApp connectivity",
    website: "https://robinhood.com/us/en/support/articles/robinhood-wallet/",
    icon: robinhoodIcon,
    lastVerified: "2026-03-30",
  },
  ryder: {
    name: "Ryder",
    companyId: "ryder",
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
    icon: ryderIcon,
    lastVerified: "2026-07-14",
  },
  safepal: {
    name: "SafePal",
    companyId: "safepal-wallet",
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
    icon: safepalIcon,
    lastVerified: "2026-07-14",
  },
  samui: {
    name: "Samui",
    category: "consumer",
    platforms: ["chrome"],
    features: ["non_custodial", "hold_nfts", "open_source", "solana_native"],
    description:
      "Open-source Solana wallet and developer toolbox with built-in token creation and airdrop tools",
    website: "https://samui.build/",
    icon: samuiIcon,
    lastVerified: "2026-03-30",
  },
  solflare: {
    name: "Solflare",
    companyId: "solflare",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox", "edge", "brave"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "staking",
      "open_source",
      "hardware",
      "solana_native",
    ],
    description:
      "Solana self-custody wallet for trading, staking SOL, managing tokens and NFTs, and pairing the Solflare Shield hardware card with mobile and browser-extension apps",
    website: "https://www.solflare.com/",
    icon: solflareIcon,
    lastVerified: "2026-07-14",
  },
  squadsx: {
    name: "SquadsX",
    aliases: ["squads"],
    category: "institutional",
    platforms: ["chrome"],
    features: ["non_custodial", "solana_native", "multi_sig"],
    description:
      "Browser extension that lets Squads multisigs connect to Solana dApps while retaining multisig transaction approvals",
    website:
      "https://chromewebstore.google.com/detail/squadsx/jhmfofkpljgmilikdmkglcmekjnlekda",
    lastVerified: "2026-07-14",
  },
  tangem: {
    name: "Tangem",
    aliases: ["tangem-ring"],
    category: "hardware",
    platforms: ["ios", "android", "hardware"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "open_source",
      "hardware",
      "multi_chain",
    ],
    description:
      "Open-source hardware wallet and mobile app for buying, selling, swapping, and managing thousands of assets across 90+ networks",
    website: "https://tangem.com/",
    lastVerified: "2026-07-14",
  },
  tiplink: {
    name: "Tiplink",
    aliases: ["fin"],
    category: "payments",
    platforms: ["web"],
    features: ["non_custodial", "solana_pay", "hold_nfts", "solana_native"],
    description:
      "Solana link wallet for sending SOL, SPL tokens, NFTs, and SFTs through shareable URLs, with Gmail or wallet-based claiming and Solana Pay checkout use cases",
    website: "https://tiplink.io/",
    icon: tiplinkIcon,
    lastVerified: "2026-07-14",
  },
  tokenpocket: {
    name: "TokenPocket",
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
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
      "Multi-chain DeFi wallet with 30M+ users, built-in dApp browser, and KeyPal hardware wallet",
    website: "https://tokenpocket.pro/",
    icon: tokenpocketIcon,
    lastVerified: "2026-03-30",
  },
  trezor: {
    name: "Trezor",
    aliases: ["trezor-safe-5"],
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
    icon: trezorIcon,
    lastVerified: "2026-07-14",
  },
  trust: {
    name: "Trust",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox", "edge", "brave"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "open_source",
      "multi_chain",
    ],
    description:
      "Multi-chain self-custody wallet available as mobile apps and browser extensions, with buying, selling, staking, swaps, and NFT support",
    website: "https://trustwallet.com/download",
    icon: trustwalletcoreIcon,
    lastVerified: "2026-07-14",
  },
  turnkey: {
    name: "Turnkey",
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
      "Non-custodial wallet infrastructure with TEE-based key management and policy engine for developers",
    website: "https://www.turnkey.com/",
    icon: turnkeyIcon,
    lastVerified: "2026-03-30",
  },
  unruggable: {
    name: "Unruggable",
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
    icon: "https://www.unruggable.io/unruggable-icon-v2.png?v=20260517",
    lastVerified: "2026-07-14",
  },
  venly: {
    name: "Venly Wallet-as-a-Service",
    aliases: ["venly-as-a-service"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "custodial",
      "non_custodial",
      "buy_crypto",
      "gas_abstraction",
      "social_recovery",
      "private_key_infrastructure",
      "multi_chain",
      "multi_sig",
    ],
    description:
      "Wallet-as-a-service platform with wallet APIs, social login, fiat onramp support, gasless transactions, and multi-blockchain wallet deployment",
    website: "https://www.venly.io/product/wallet-as-a-service",
    lastVerified: "2026-07-14",
  },
  web3auth: {
    name: "Web3Auth",
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "buy_crypto",
      "mpc",
      "gas_abstraction",
      "social_recovery",
      "spending_limits",
      "open_source",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Open-source MPC key management SDK enabling social login wallets across 20+ chains",
    website: "https://tor.us/",
    icon: web3authIcon,
    lastVerified: "2026-03-30",
  },
  zerion: {
    name: "Zerion Wallet",
    companyId: "zerion",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "web"],
    features: ["non_custodial", "buy_crypto", "hold_nfts", "multi_chain"],
    description:
      "Self-custody wallet for Solana, Ethereum, and major EVM networks with portfolio tracking, swaps, and NFT support",
    website: "https://zerion.io/",
    lastVerified: "2026-07-14",
  },
} satisfies Record<string, WalletRecord>;

export type WalletSlug = keyof typeof walletRecords;

export const walletData: Record<WalletSlug, WalletRecord> = walletRecords;
