import type { ImportedAssetModule } from "../types";
import type { WalletCategory, WalletFeature, WalletPlatform } from "./taxonomy";
import defaultWalletIcon from "../../assets/wallets/wallet-placeholder-icon.webp";
import atomicwalletIcon from "../../assets/wallets/icons/atomicwallet.webp";
import backpackIcon from "../../assets/wallets/icons/backpack.webp";
import binanceIcon from "../../assets/wallets/icons/binance.webp";
import bitgetIcon from "../../assets/wallets/icons/bitget.webp";
import bitgoIcon from "../../assets/wallets/icons/bitgo.webp";
import bitnovoIcon from "../../assets/wallets/icons/bitnovo.webp";
import bitpandaVisionIcon from "../../assets/wallets/icons/bitpanda-vision.webp";
import bitpayIcon from "../../assets/wallets/icons/bitpay.webp";
import blockchainComIcon from "../../assets/wallets/icons/blockchain-com.webp";
import blockradarIcon from "../../assets/wallets/icons/blockradar.webp";
import braveIcon from "../../assets/wallets/icons/brave.webp";
import bronIcon from "../../assets/wallets/icons/bron.webp";
import cactusCustodyIcon from "../../assets/wallets/icons/cactus-custody.webp";
import cakewalletIcon from "../../assets/wallets/icons/cakewallet.webp";
import cdpIcon from "../../assets/wallets/icons/cdp.webp";
import cfxIcon from "../../assets/wallets/icons/cfx.webp";
import circleIcon from "../../assets/wallets/icons/circle.webp";
import coboIcon from "../../assets/wallets/icons/cobo.webp";
import cocaIcon from "../../assets/wallets/icons/coca.webp";
import coin98Icon from "../../assets/wallets/icons/coin98.webp";
import coinbaseIcon from "../../assets/wallets/icons/coinbase.webp";
import coinexWalletIcon from "../../assets/wallets/icons/coinex-wallet.webp";
import coinflipIcon from "../../assets/wallets/icons/coinflip.webp";
import coinpaymentsIcon from "../../assets/wallets/icons/coinpayments.webp";
import coinwalletIcon from "../../assets/wallets/icons/coinwallet.webp";
import coolwalletIcon from "../../assets/wallets/icons/coolwallet.webp";
import cregisIcon from "../../assets/wallets/icons/cregis.webp";
import croptyIcon from "../../assets/wallets/icons/cropty.webp";
import crossmintIcon from "../../assets/wallets/icons/crossmint.webp";
import cryptomusIcon from "../../assets/wallets/icons/cryptomus.webp";
import cwalletIcon from "../../assets/wallets/icons/cwallet.webp";
import cypherockIcon from "../../assets/wallets/icons/cypherock.webp";
import decafIcon from "../../assets/wallets/icons/decaf.webp";
import dfnsIcon from "../../assets/wallets/icons/dfns.webp";
import dynamicIcon from "../../assets/wallets/icons/dynamic.webp";
import edgeIcon from "../../assets/wallets/icons/edge.webp";
import ellipalIcon from "../../assets/wallets/icons/ellipal.webp";
import emcdIcon from "../../assets/wallets/icons/emcd.webp";
import enkryptIcon from "../../assets/wallets/icons/enkrypt.webp";
import ethosIcon from "../../assets/wallets/icons/ethos.webp";
import exodusIcon from "../../assets/wallets/icons/exodus.webp";
import fireblocksEmbeddedIcon from "../../assets/wallets/icons/fireblocks-embedded.webp";
import foxwalletIcon from "../../assets/wallets/icons/foxwallet.webp";
import fuseIcon from "../../assets/wallets/icons/fuse.webp";
import fxwalletIcon from "../../assets/wallets/icons/fxwallet.webp";
import gateIcon from "../../assets/wallets/icons/gate.webp";
import gemIcon from "../../assets/wallets/icons/gem.webp";
import glowIcon from "../../assets/wallets/icons/glow.webp";
import guardaIcon from "../../assets/wallets/icons/guarda.webp";
import heliumIcon from "../../assets/wallets/icons/helium.webp";
import hotWalletIcon from "../../assets/wallets/icons/hot-wallet.webp";
import hotcoinIcon from "../../assets/wallets/icons/hotcoin.webp";
import infinexIcon from "../../assets/wallets/icons/infinex.webp";
import iopayIcon from "../../assets/wallets/icons/iopay.webp";
import jupiterIcon from "../../assets/wallets/icons/jupiter.webp";
import keepkeyIcon from "../../assets/wallets/icons/keepkey.webp";
import keystoneIcon from "../../assets/wallets/icons/keystone.webp";
import krakenIcon from "../../assets/wallets/icons/kraken.webp";
import kryptogoIcon from "../../assets/wallets/icons/kryptogo.webp";
import ledgerIcon from "../../assets/wallets/icons/ledger.webp";
import lemonIcon from "../../assets/wallets/icons/lemon.webp";
import liminalIcon from "../../assets/wallets/icons/liminal.webp";
import magicIcon from "../../assets/wallets/icons/magic.webp";
import mathwalletIcon from "../../assets/wallets/icons/mathwallet.webp";
import metamaskIcon from "../../assets/wallets/icons/metamask.webp";
import moongateIcon from "../../assets/wallets/icons/moongate.webp";
import moonshotIcon from "../../assets/wallets/icons/moonshot.webp";
import mpcvaultIcon from "../../assets/wallets/icons/mpcvault.webp";
import naboxIcon from "../../assets/wallets/icons/nabox.webp";
import ngraveIcon from "../../assets/wallets/icons/ngrave.webp";
import nightlyIcon from "../../assets/wallets/icons/nightly.webp";
import nowwalletIcon from "../../assets/wallets/icons/nowwallet.webp";
import nufiIcon from "../../assets/wallets/icons/nufi.webp";
import okxIcon from "../../assets/wallets/icons/okx.webp";
import omniIcon from "../../assets/wallets/icons/omni.webp";
import onekeyIcon from "../../assets/wallets/icons/onekey.webp";
import openfortIcon from "../../assets/wallets/icons/openfort.webp";
import opensignerIcon from "../../assets/wallets/icons/opensigner.webp";
import owalletIcon from "../../assets/wallets/icons/owallet.webp";
import ownbitIcon from "../../assets/wallets/icons/ownbit.webp";
import oxapayIcon from "../../assets/wallets/icons/oxapay.webp";
import paraIcon from "../../assets/wallets/icons/para.webp";
import particleNetworkIcon from "../../assets/wallets/icons/particle-network.webp";
import passimpayIcon from "../../assets/wallets/icons/passimpay.webp";
import passkeysWalletIcon from "../../assets/wallets/icons/passkeys-wallet.webp";
import paybisWalletIcon from "../../assets/wallets/icons/paybis-wallet.webp";
import paypalCryptocurrencyServicesIcon from "../../assets/wallets/icons/paypal-cryptocurrency-services.webp";
import phantomIcon from "../../assets/wallets/icons/phantom.webp";
import pontemIcon from "../../assets/wallets/icons/pontem.webp";
import portalIcon from "../../assets/wallets/icons/portal.webp";
import privyIcon from "../../assets/wallets/icons/privy.webp";
import redotpayIcon from "../../assets/wallets/icons/redotpay.webp";
import reownIcon from "../../assets/wallets/icons/reown.webp";
import republicWalletIcon from "../../assets/wallets/icons/republic-wallet.webp";
import robinhoodIcon from "../../assets/wallets/icons/robinhood.webp";
import ryderIcon from "../../assets/wallets/icons/ryder.webp";
import safeheronIcon from "../../assets/wallets/icons/safeheron.webp";
import safepalIcon from "../../assets/wallets/icons/safepal.webp";
import samuiIcon from "../../assets/wallets/icons/samui.webp";
import secuxIcon from "../../assets/wallets/icons/secux.webp";
import solflareIcon from "../../assets/wallets/icons/solflare.webp";
import speedIcon from "../../assets/wallets/icons/speed.webp";
import squadsxIcon from "../../assets/wallets/icons/squadsx.webp";
import starkeyIcon from "../../assets/wallets/icons/starkey.webp";
import talismanIcon from "../../assets/wallets/icons/talisman.webp";
import tangemIcon from "../../assets/wallets/icons/tangem.webp";
import tiplinkIcon from "../../assets/wallets/icons/tiplink.webp";
import tokenpocketIcon from "../../assets/wallets/icons/tokenpocket.webp";
import tomoIcon from "../../assets/wallets/icons/tomo.webp";
import totalsigIcon from "../../assets/wallets/icons/totalsig.webp";
import trezorIcon from "../../assets/wallets/icons/trezor.webp";
import triaIcon from "../../assets/wallets/icons/tria.webp";
import trueMarketsIcon from "../../assets/wallets/icons/true-markets.webp";
import trusteeWalletIcon from "../../assets/wallets/icons/trustee-wallet.webp";
import trustwalletcoreIcon from "../../assets/wallets/icons/trustwalletcore.webp";
import turnkeyIcon from "../../assets/wallets/icons/turnkey.webp";
import unhostedIcon from "../../assets/wallets/icons/unhosted.webp";
import unitywalletIcon from "../../assets/wallets/icons/unitywallet.webp";
import unruggableIcon from "../../assets/wallets/icons/unruggable.webp";
import venlyIcon from "../../assets/wallets/icons/venly.webp";
import walletverseIcon from "../../assets/wallets/icons/walletverse.webp";
import web3authIcon from "../../assets/wallets/icons/web3auth.webp";
import wisdomtreePrimeIcon from "../../assets/wallets/icons/wisdomtree-prime.webp";
import xrocketIcon from "../../assets/wallets/icons/xrocket.webp";
import zarIcon from "../../assets/wallets/icons/zar.webp";
import zendwalletIcon from "../../assets/wallets/icons/zendwallet.webp";
import zengoIcon from "../../assets/wallets/icons/zengo.webp";
import zerionIcon from "../../assets/wallets/icons/zerion.webp";
import zyptoIcon from "../../assets/wallets/icons/zypto.webp";

export type WalletRecord = {
  /** Display name for the wallet product. */
  name: string;
  /** Slug of the owning company in `src/companies`, when one exists. */
  companyId?: string;
  /** Alternate, historical, or normalized product names that map to this record. */
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
    platforms: ["ios", "android", "chrome", "desktop"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "staking",
      "multi_chain",
    ],
    description:
      "Non-custodial wallet for desktop, mobile, and Chrome covering 1000+ assets, with bank-card purchases, built-in swaps, NFT storage, and SOL staking",
    website: "https://atomicwallet.io/",
    icon: atomicwalletIcon,
    lastVerified: "2026-07-15",
  },
  backpack: {
    name: "Backpack",
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
      "Self-custody wallet with integrated exchange for Solana, Ethereum, and BTC offering native and bpSOL liquid staking, NFT listing and locking, USD wire on/off-ramps, and 3-of-3 multisig via Ledger, Trezor, and Keystone",
    website: "https://backpack.app/",
    icon: backpackIcon,
    lastVerified: "2026-07-15",
  },
  binance: {
    name: "Binance Wallet",
    aliases: ["binance-web3-wallet"],
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: ["non_custodial", "buy_crypto", "mpc", "staking", "multi_chain"],
    description:
      "Self-custody MPC wallet built into the Binance app with a Chrome extension, covering EVM, Solana, and TRON networks with cross-chain swaps and in-wallet SOL staking via BNSOL",
    website: "https://web3.binance.com/",
    icon: binanceIcon,
    lastVerified: "2026-07-15",
  },
  bitget: {
    name: "Bitget Wallet",
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
      "Self-custody wallet spanning 130+ blockchains with MPC security, gas-free Solana transfers via GetGas, Solana Pay QR payments, native SOL staking, and card-based fiat on/off-ramps",
    website: "https://web3.bitget.com/en/",
    icon: bitgetIcon,
    lastVerified: "2026-07-15",
  },
  bitgo: {
    name: "BitGo Wallet as a Service",
    aliases: ["bitgo-as-a-service"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "custodial",
      "non_custodial",
      "mpc",
      "staking",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
      "multi_sig",
    ],
    description:
      "Wallet-as-a-service APIs and SDKs for 1700+ assets with custodial and client-key wallet options, TSS signing for Solana, velocity controls and whitelisting, and in-platform SOL staking",
    website: "https://www.bitgo.com/products/wallet-as-a-service",
    icon: bitgoIcon,
    lastVerified: "2026-07-15",
  },
  bitnovo: {
    name: "Bitnovo Wallet",
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "multi_chain",
    ],
    description:
      "Self-custodial mobile wallet from Spanish platform Bitnovo supporting SOL among 15 assets, with card, SEPA, and cash-voucher purchases, euro cash-out, and NFT management",
    website: "https://www.bitnovo.com/en/wallet",
    icon: bitnovoIcon,
    lastVerified: "2026-07-15",
  },
  "bitpanda-vision": {
    name: "Bitpanda Vision Wallet",
    aliases: ["bitpanda", "bitpanda-defi-wallet", "vision-wallet"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "gas_abstraction",
      "social_recovery",
      "multi_chain",
    ],
    description:
      "Non-custodial mobile wallet from Bitpanda for one-click swaps across 5,000+ tokens on Solana, Ethereum, and six other chains, with sponsored gas on eligible transactions and optional encrypted two-shard backup",
    website: "https://www.bitpanda.com/en/web3/defi-wallet",
    icon: bitpandaVisionIcon,
    lastVerified: "2026-07-15",
  },
  bitpay: {
    name: "BitPay Wallet",
    category: "payments",
    platforms: ["ios", "android", "desktop"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "open_source",
      "multi_chain",
      "multi_sig",
    ],
    description:
      "Open-source self-custody wallet from payments processor BitPay supporting SOL, SPL tokens, and Solana stablecoins for merchant payments, gift cards, and bill pay, with partner on-ramps, swaps, cash-out to bank or PayPal, and optional multisig",
    website: "https://www.bitpay.com/wallet",
    icon: bitpayIcon,
    lastVerified: "2026-07-15",
  },
  "blockchain-com": {
    name: "Blockchain.com",
    aliases: ["blockchain", "blockchain-dot-com"],
    category: "consumer",
    platforms: ["ios", "android", "web"],
    features: [
      "custodial",
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "multi_chain",
    ],
    description:
      "Wallet app pairing a custodial trading account with a non-custodial DeFi Wallet, supporting SOL and Solana tokens, card and bank purchases, fiat withdrawals, and in-wallet swaps",
    website: "https://www.blockchain.com/crypto-wallet",
    icon: blockchainComIcon,
    lastVerified: "2026-07-15",
  },
  blockradar: {
    name: "Blockradar",
    category: "infrastructure",
    platforms: ["api"],
    features: [
      "non_custodial",
      "gas_abstraction",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Stablecoin wallet infrastructure API for fintechs that provisions non-custodial deposit addresses on Solana, Ethereum, Tron, Base, and other chains, with auto-sweeping to master wallets, sponsored gas fees, and built-in AML screening",
    website: "https://www.blockradar.co/",
    icon: blockradarIcon,
    lastVerified: "2026-07-15",
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
      "hardware",
      "multi_chain",
    ],
    description:
      "Self-custody wallet built into the Brave browser with Solana and EVM chains, DEX-aggregated swaps, an NFT gallery, Ramp and Transak fiat on/off-ramps, and desktop Ledger and Trezor support",
    website: "https://brave.com/wallet/",
    icon: braveIcon,
    lastVerified: "2026-07-15",
  },
  bron: {
    name: "Bron Wallet",
    aliases: ["bron-wallet"],
    category: "institutional",
    platforms: ["ios", "android", "web", "api"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "mpc",
      "social_recovery",
      "staking",
      "spending_limits",
      "multi_chain",
      "multi_sig",
    ],
    description:
      "Self-custodial MPC treasury wallet for teams and family offices with 2-of-3 key shards, guardian recovery, approval policies, SOL staking, and fiat ramps across 15 networks",
    website: "https://bron.org/",
    icon: bronIcon,
    lastVerified: "2026-07-15",
  },
  "cactus-custody": {
    name: "Cactus Custody",
    aliases: ["cactus", "cactus-link", "matrixport-cactus-custody"],
    category: "institutional",
    platforms: ["chrome", "web", "api"],
    features: [
      "custodial",
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "mpc",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
      "multi_sig",
    ],
    description:
      "Matrixport's Hong Kong-licensed institutional custodian with HSM cold storage, a self-custody MPC-TSS option, approval workflows, and Cactus Link DeFi access spanning Solana, Bitcoin, and 25+ EVM chains",
    website: "https://www.mycactus.com/",
    icon: cactusCustodyIcon,
    lastVerified: "2026-07-15",
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
      "hardware",
      "multi_chain",
    ],
    description:
      "Open-source, MIT-licensed non-custodial wallet for Monero, Bitcoin, Ethereum, and Solana with built-in swaps, buy and sell flows, and hardware wallet support",
    website: "https://cakewallet.com/",
    icon: cakewalletIcon,
    lastVerified: "2026-07-15",
  },
  cdp: {
    name: "CDP Wallets",
    companyId: "coinbase",
    aliases: [
      "cdp-coinbase",
      "cdp-embedded-wallets",
      "cdp-server-wallets",
      "coinbase-developer-platform",
    ],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "social_recovery",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Coinbase's wallet infrastructure with TEE-secured server wallets and email or social login embedded wallets, policy-enforced spending limits, and full Solana mainnet support",
    website: "https://www.coinbase.com/developer-platform/products/wallets",
    icon: cdpIcon,
    lastVerified: "2026-07-15",
  },
  cfx: {
    name: "CFX",
    aliases: ["cfx-labs", "movemoney"],
    category: "payments",
    platforms: ["web", "api"],
    features: ["non_custodial", "private_key_infrastructure", "solana_native"],
    description:
      "Digital-dollar payments platform built natively on Solana, offering a whitelabel self-custodial wallet-as-a-service, the MoveUSD stablecoin, USDC and USDT settlement, and REST APIs for payouts across 220+ markets",
    website: "https://cfx.to/",
    icon: cfxIcon,
    lastVerified: "2026-07-15",
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
      "Wallet-as-a-service APIs with MPC key management, user- or developer-controlled custody, Gas Station fee sponsorship for Solana accounts, and wallet-layer spending policies",
    website: "https://www.circle.com/programmable-wallets",
    icon: circleIcon,
    lastVerified: "2026-07-15",
  },
  cobo: {
    name: "Cobo Portal",
    aliases: ["cobo-portal"],
    category: "institutional",
    platforms: ["ios", "android", "web", "api"],
    features: [
      "custodial",
      "mpc",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Institutional platform combining custodial, MPC, smart contract, and exchange wallets across 80+ chains including Solana, with role-based transaction policies and approval workflows",
    website: "https://www.cobo.com/products/portal",
    icon: coboIcon,
    lastVerified: "2026-07-15",
  },
  coca: {
    name: "COCA",
    aliases: ["coca-wallet"],
    category: "payments",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "buy_crypto",
      "mpc",
      "social_recovery",
      "multi_chain",
    ],
    description:
      "Non-custodial MPC wallet and self-banking app with a Visa debit card for spending stablecoins, seedless biometric recovery, and Solana among 15 supported blockchains",
    website: "https://www.coca.xyz/",
    icon: cocaIcon,
    lastVerified: "2026-07-15",
  },
  coin: {
    name: "Coin Wallet",
    category: "consumer",
    platforms: ["ios", "android", "desktop", "web"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "open_source",
      "multi_chain",
    ],
    description:
      "Self-custodial, MIT-licensed open-source wallet dating to 2015 with mobile, desktop, and web apps plus in-app buy, sell, and swaps across Solana and 20+ other chains",
    website: "https://coin.space/",
    icon: coinwalletIcon,
    lastVerified: "2026-07-15",
  },
  coin98: {
    name: "Coin98",
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: ["non_custodial", "hold_nfts", "hardware", "multi_chain"],
    description:
      "Non-custodial multi-chain wallet with mobile apps and a Chrome extension covering 140+ blockchains including Solana, with NFT management, cross-chain swaps via its SpaceGate bridge, and Ledger and Trezor support",
    website: "https://coin98.com/",
    icon: coin98Icon,
    lastVerified: "2026-07-15",
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
      "Coinbase's self-custody everything app, formerly Coinbase Wallet, trading Bitcoin, Ethereum, and Solana with card and bank purchases, gasless USDC sends, and passkey cloud backups",
    website: "https://base.app/",
    icon: coinbaseIcon,
    lastVerified: "2026-07-15",
  },
  "coinex-wallet": {
    name: "CoinEx Wallet",
    aliases: ["coinex", "viawallet"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["non_custodial", "hold_nfts", "multi_chain"],
    description:
      "Self-custody mobile wallet from CoinEx Group, formerly ViaWallet, managing 50+ chains including Solana with NFT send and receive, cross-chain swaps, and a dApp browser",
    website: "https://wallet.coinex.com/",
    icon: coinexWalletIcon,
    lastVerified: "2026-07-15",
  },
  coinflip: {
    name: "CoinFlip Crypto Wallet",
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["non_custodial", "buy_crypto", "sell_crypto", "multi_chain"],
    description:
      "Self-custody mobile wallet from Bitcoin ATM operator CoinFlip for holding SOL, BTC, ETH, and 20+ assets, with cash buy and sell at 5,500+ CoinFlip ATMs",
    website: "https://coinflip.tech/wallet",
    icon: coinflipIcon,
    lastVerified: "2026-07-15",
  },
  coinpayments: {
    name: "CoinPayments",
    category: "payments",
    platforms: ["web"],
    features: ["custodial", "multi_chain"],
    description:
      "Crypto payment gateway with a hosted custodial Personal Wallet for storing, sending, and receiving SOL, USDC, and USDT on Solana alongside Bitcoin, Ethereum, and stablecoins",
    website: "https://www.coinpayments.net/",
    icon: coinpaymentsIcon,
    lastVerified: "2026-07-15",
  },
  coolwallet: {
    name: "CoolWallet",
    aliases: ["coolwallet-app", "coolwallet-go", "coolwallet-pro"],
    category: "hardware",
    platforms: ["ios", "android", "hardware"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "staking",
      "hardware",
      "multi_chain",
    ],
    description:
      "Card-shaped hardware wallet family (Pro, Go, S) with a companion app for SOL staking via Everstake or Figment, NFTs, fiat purchases, and 10+ blockchains including Solana",
    website: "https://www.coolwallet.io/pages/coolwallet-app",
    icon: coolwalletIcon,
    lastVerified: "2026-07-15",
  },
  cregis: {
    name: "Cregis",
    category: "institutional",
    platforms: ["ios", "android", "api"],
    features: [
      "non_custodial",
      "mpc",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Enterprise self-custody MPC wallet and wallet-as-a-service API with multi-level approval rules, a crypto payment engine, and SOL, USDT, and USDC support on Solana",
    website: "https://www.cregis.com/",
    icon: cregisIcon,
    lastVerified: "2026-07-15",
  },
  cropty: {
    name: "Cropty",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "web"],
    features: ["custodial", "buy_crypto", "multi_chain"],
    description:
      "Custodial multi-chain wallet with iOS, Android, web, and Chrome extension apps, card and Apple Pay purchases, crypto-backed loans, and Solana among nine supported networks",
    website: "https://cropty.io/",
    icon: croptyIcon,
    lastVerified: "2026-07-15",
  },
  "crossmint-custodial": {
    name: "Crossmint Custodial",
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "custodial",
      "buy_crypto",
      "hold_nfts",
      "gas_abstraction",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
      "multi_sig",
    ],
    description:
      "Custodial mode of Crossmint's embedded wallet API for 50+ chains including Solana, with sponsored gas billed in fiat, 2FA, multisig and spending-limit controls, AML screening, and built-in onramps",
    website: "https://www.crossmint.com/products/custodial-wallet-as-a-service",
    icon: crossmintIcon,
    lastVerified: "2026-07-15",
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
      "gas_abstraction",
      "social_recovery",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
      "multi_sig",
    ],
    description:
      "Embedded smart wallet API and SDK with passkey, device, email, and phone signers, TEE-secured keys, sponsored gas, and spending-limit controls across 50+ chains including Solana",
    website:
      "https://www.crossmint.com/products/non-custodial-wallets-as-a-service",
    icon: crossmintIcon,
    lastVerified: "2026-07-15",
  },
  cryptomus: {
    name: "Cryptomus",
    category: "consumer",
    platforms: ["ios", "android", "web"],
    features: ["custodial", "buy_crypto", "multi_chain"],
    description:
      "Custodial hot wallet inside the Cryptomus payments and trading platform, with web, iOS, and Android apps, SOL storage and conversion, fee-free internal transfers, and card or bank crypto purchases",
    website: "https://cryptomus.com/",
    icon: cryptomusIcon,
    lastVerified: "2026-07-15",
  },
  cwallet: {
    name: "Cwallet",
    aliases: ["cozywallet"],
    category: "consumer",
    platforms: ["ios", "android", "web"],
    features: [
      "custodial",
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "mpc",
      "multi_chain",
    ],
    description:
      "Hybrid wallet app combining custodial and non-custodial accounts across 60+ chains including Solana, with fiat buy and sell ramps, swaps, NFT support, a Telegram wallet bot, and virtual card spending",
    website: "https://cwallet.com",
    icon: cwalletIcon,
    lastVerified: "2026-07-15",
  },
  cypherock: {
    name: "Cypherock",
    category: "hardware",
    platforms: ["ios", "android", "desktop", "hardware"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "open_source",
      "hardware",
      "multi_chain",
    ],
    description:
      "Seedless hardware wallet splitting keys across an X1 Vault and four NFC cards via Shamir Secret Sharing, with open-source cySync desktop and mobile apps covering Solana among 9,000+ assets",
    website: "https://www.cypherock.com/",
    icon: cypherockIcon,
    lastVerified: "2026-07-15",
  },
  decaf: {
    name: "Decaf",
    category: "payments",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "gas_abstraction",
      "multi_chain",
      "solana_native",
    ],
    description:
      "Non-custodial payments wallet on Solana and Stellar for USDC and USDT, with gasless transfers, payment links, bank withdrawals, and MoneyGram cash-out in 184 currencies",
    website: "https://www.decaf.so/",
    icon: decafIcon,
    lastVerified: "2026-07-15",
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
      "multi_sig",
    ],
    description:
      "Wallet-as-a-service API with MPC key shares distributed across enclaved nodes, org- or user-controlled custody, and a policy engine for velocity limits and M-of-N quorums across 100+ networks including Solana",
    website: "https://www.dfns.co/wallet-as-a-service",
    icon: dfnsIcon,
    lastVerified: "2026-07-15",
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
      "Non-custodial embedded wallet infrastructure with TSS-MPC signing, passkey and social login, onramp funding, and sponsored Solana transaction fees across EVM, Solana, Bitcoin, and Sui",
    website: "https://www.dynamic.xyz/",
    icon: dynamicIcon,
    lastVerified: "2026-07-15",
  },
  edge: {
    name: "Edge",
    aliases: ["edge-wallet"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "open_source",
      "multi_chain",
    ],
    description:
      "Open-source self-custody mobile wallet with client-side encryption, supporting Solana with custom SPL tokens among 14+ chains, plus in-app buy and sell through partners like MoonPay and Simplex",
    website: "https://edge.app/",
    icon: edgeIcon,
    lastVerified: "2026-07-15",
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
      "Air-gapped cold wallet family (Titan 2.0, Titan Mini, X Card) with a non-custodial mobile app for card and Apple Pay buys, sells, swaps, and NFTs across 45+ blockchains including Solana",
    website: "https://www.ellipal.com/",
    icon: ellipalIcon,
    lastVerified: "2026-07-15",
  },
  emcd: {
    name: "EMCD Wallet",
    category: "consumer",
    platforms: ["ios", "android", "web"],
    features: [
      "custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "multi_chain",
    ],
    description:
      "Custodial multi-asset wallet from mining-pool company EMCD holding SOL among 50+ coins, with card purchases, zero-fee P2P buy and sell, NFT storage, and Coinhold yield",
    website: "https://emcd.io/crypto-wallet",
    icon: emcdIcon,
    lastVerified: "2026-07-15",
  },
  enkrypt: {
    name: "Enkrypt",
    category: "consumer",
    platforms: ["chrome", "firefox", "brave", "edge"],
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
      "Open-source self-custody browser extension by MyEtherWallet spanning 70+ chains, with in-wallet SOL staking, MoonPay buy and sell, NFT management, and Ledger support",
    website: "https://www.enkrypt.com/",
    icon: enkryptIcon,
    lastVerified: "2026-07-15",
  },
  ethos: {
    name: "Ethos",
    aliases: ["ethos-defi"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "gas_abstraction",
      "social_recovery",
      "multi_chain",
    ],
    description:
      "Self-custody mobile trading wallet with cross-chain swaps over nine blockchains, gasless Solana trades paid in the token being sold, and seedless Magic Key recovery from three words",
    website: "https://www.ethosdefi.com/",
    icon: ethosIcon,
    lastVerified: "2026-07-15",
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
      "hardware",
      "multi_chain",
    ],
    description:
      "Self-custody wallet for desktop, mobile, and browser with card and Apple Pay buys and sells, swaps, SOL staking via Everstake, an NFT gallery, and Trezor integration",
    website: "https://www.exodus.com/",
    icon: exodusIcon,
    lastVerified: "2026-07-15",
  },
  "fireblocks-embedded": {
    name: "Fireblocks Embedded Wallets",
    companyId: "fireblocks",
    aliases: ["fireblocks"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "mpc",
      "gas_abstraction",
      "social_recovery",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Non-custodial embedded wallet infrastructure with MPC key management, web, iOS, and Android SDKs, seedless cloud-backup recovery, and gas sponsorship across Solana, Bitcoin, and EVM chains",
    website: "https://www.fireblocks.com/platforms/embedded-wallets",
    icon: fireblocksEmbeddedIcon,
    lastVerified: "2026-07-15",
  },
  foxwallet: {
    name: "FoxWallet",
    aliases: ["fox-wallet"],
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: ["non_custodial", "hold_nfts", "multi_chain"],
    description:
      "Self-custody mobile wallet covering 100+ chains including Solana, Bitcoin, and Aleo, with locally encrypted keys, NFT support, phishing-site blocking, and a companion Chrome extension",
    website: "https://foxwallet.com/",
    icon: foxwalletIcon,
    lastVerified: "2026-07-15",
  },
  fuse: {
    name: "Fuse Wallet",
    companyId: "squads",
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
      "hardware",
      "solana_native",
      "multi_sig",
    ],
    description:
      "Solana smart wallet on Squads Protocol with 2-of-3 multisig approvals, spending limits, email recovery, sponsored network fees, SOL staking, and a virtual Visa card for stablecoins",
    website: "https://www.fusewallet.com/",
    icon: fuseIcon,
    lastVerified: "2026-07-15",
  },
  fxwallet: {
    name: "FxWallet",
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["non_custodial", "hold_nfts", "hardware", "multi_chain"],
    description:
      "Decentralized mobile wallet covering 80+ blockchains including Solana, with hardware wallet integration, an offline cold-wallet signing mode, curated dApps, and cross-chain swaps with MEV protection",
    website: "https://www.fxwallet.com/",
    icon: fxwalletIcon,
    lastVerified: "2026-07-15",
  },
  gate: {
    name: "Gate Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "web"],
    features: ["non_custodial", "multi_chain"],
    description:
      "Self-custodial wallet from the Gate exchange spanning mobile, web, and a Chrome extension, with swaps, bridging, and dApp access across 100+ chains including Solana",
    website: "https://web3.gate.com/",
    icon: gateIcon,
    lastVerified: "2026-07-15",
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
      "Fully open-source self-custodial mobile wallet for 100+ chains including Solana, with built-in swaps, fiat on-ramp in 170+ countries, NFTs, and SOL staking via validator delegation",
    website: "https://gemwallet.com/",
    icon: gemIcon,
    lastVerified: "2026-07-15",
  },
  glow: {
    name: "Glow",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox", "brave", "edge"],
    features: [
      "non_custodial",
      "hold_nfts",
      "staking",
      "hardware",
      "solana_native",
    ],
    description:
      "Solana-native wallet for mobile and desktop browsers with zero-fee swaps, SOL staking, an NFT gallery, spam-token burning that earns SOL, and Ledger Nano X signing",
    website: "https://glow.app/",
    icon: glowIcon,
    lastVerified: "2026-07-15",
  },
  guarda: {
    name: "Guarda Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "brave", "desktop", "web"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "hardware",
      "multi_chain",
      "multi_sig",
    ],
    description:
      "Non-custodial wallet for 70+ blockchains across web, desktop, mobile, and a browser extension, with in-app SOL staking, card-based buy and sell, multisig protection, and Ledger integration",
    website: "https://guarda.com/",
    icon: guardaIcon,
    lastVerified: "2026-07-15",
  },
  helium: {
    name: "Helium",
    aliases: ["helium-network"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["non_custodial", "hold_nfts", "open_source", "solana_native"],
    description:
      "Open-source mobile wallet for the Solana-based Helium network, managing HNT, MOBILE, IOT, SOL, and USDC with Hotspot NFT transfers, reward claims, and governance voting",
    website: "https://docs.helium.com/wallets/helium-wallet-app/",
    icon: heliumIcon,
    lastVerified: "2026-07-15",
  },
  "hot-wallet": {
    name: "HOT Wallet",
    aliases: ["here-wallet", "hot-labs"],
    category: "consumer",
    platforms: ["ios", "android", "chrome", "web"],
    features: [
      "non_custodial",
      "hold_nfts",
      "mpc",
      "gas_abstraction",
      "staking",
      "multi_chain",
    ],
    description:
      "Non-custodial MPC wallet spanning mobile, Chrome extension, and Telegram, with in-app SOL staking, Jupiter-powered Solana swaps, and gas paid in any token across 140+ chains",
    website: "https://hot-labs.org/wallet/",
    icon: hotWalletIcon,
    lastVerified: "2026-07-15",
  },
  hotcoin: {
    name: "Hotcoin Web3 Wallet",
    aliases: ["hotcoin-global", "hotcoin-web3-wallet"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["non_custodial", "hold_nfts", "multi_chain"],
    description:
      "Web3 wallet built into the Hotcoin exchange mobile apps, adding Solana chain assets alongside swaps, DApp access, and NFT management under user-controlled asset custody",
    website: "https://www.hotcoin.com/en_US/web3",
    icon: hotcoinIcon,
    lastVerified: "2026-07-15",
  },
  infinex: {
    name: "Infinex",
    category: "consumer",
    platforms: ["chrome", "web"],
    features: [
      "non_custodial",
      "hold_nfts",
      "gas_abstraction",
      "social_recovery",
      "staking",
      "multi_chain",
    ],
    description:
      "Passkey-secured non-custodial account app spanning 26 networks including Solana, with gasless cross-chain swaps, jupSOL liquid staking yield, select NFT support, and email-based recovery",
    website: "https://infinex.xyz/?ref=solwf",
    icon: infinexIcon,
    lastVerified: "2026-07-15",
  },
  iopay: {
    name: "ioPay",
    aliases: ["iotex"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["non_custodial", "multi_chain"],
    description:
      "Self-custody mobile wallet from the IoTeX team covering Solana, Bitcoin, Ethereum, and other default networks, with in-wallet trading, a dApp browser, and native Polymarket prediction access",
    website: "https://iopay.me/",
    icon: iopayIcon,
    lastVerified: "2026-07-15",
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
      "gas_abstraction",
      "hardware",
      "solana_native",
    ],
    description:
      "Non-custodial Solana-only wallet from Jupiter with mobile apps and a browser extension, gasless swaps and sends, Apple Pay fiat on-ramp, bank cash-out, and Ledger, Keystone, and Trezor support",
    website: "https://jup.ag/wallet",
    icon: jupiterIcon,
    lastVerified: "2026-07-15",
  },
  keepkey: {
    name: "KeepKey",
    aliases: ["keepkey-vault-desktop"],
    category: "hardware",
    platforms: ["chrome", "desktop", "hardware"],
    features: ["non_custodial", "open_source", "hardware", "multi_chain"],
    description:
      "Hardware wallet with open-source firmware and the KeepKey Vault desktop app for send, receive, and no-KYC cross-chain swaps across Solana, Bitcoin, Ethereum, and 11 native chains",
    website: "https://keepkey.com/",
    icon: keepkeyIcon,
    lastVerified: "2026-07-15",
  },
  keystone: {
    name: "Keystone",
    aliases: ["keystone-nexus"],
    category: "hardware",
    platforms: ["ios", "android", "hardware"],
    features: [
      "non_custodial",
      "hold_nfts",
      "staking",
      "open_source",
      "hardware",
      "multi_chain",
    ],
    description:
      "Air-gapped hardware wallet family signing via QR codes, with open-source firmware, the Keystone Nexus companion app, Solflare integration covering SOL staking, and 5,500+ assets across 45+ chains",
    website: "https://keyst.one/",
    icon: keystoneIcon,
    lastVerified: "2026-07-15",
  },
  kraken: {
    name: "Kraken Wallet",
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "te",
      "hold_nfts",
      "open_source",
      "multi_chain",
    ],
    description:
      "Self-custody mobile wallet from Kraken with open-source code, NFT management, cross-chain swaps between EVM networks and Solana, and support for sending Solana Token-2022 assets",
    website: "https://www.kraken.com/wallet",
    icon: krakenIcon,
    lastVerified: "2026-07-15",
  },
  kryptogo: {
    name: "KryptoGO",
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "hold_nfts",
      "mpc",
      "social_recovery",
      "multi_chain",
    ],
    description:
      "Self-custodial mobile wallet with MPC keyless sign-in via phone, email, or Google, covering Solana among 10 blockchains with NFT management, swaps, and stablecoin payments",
    website: "https://www.kryptogo.com/products/wallet",
    icon: kryptogoIcon,
    lastVerified: "2026-07-15",
  },
  ledger: {
    name: "Ledger",
    aliases: ["ledger-live", "ledger-wallet"],
    category: "hardware",
    platforms: ["ios", "android", "desktop", "hardware"],
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
      "Secure Element hardware signer family with the Ledger Wallet app for buying SOL by card, off-ramp selling, validator staking, SPL and Token-2022 assets, and thousands of coins",
    website: "https://www.ledger.com/",
    icon: ledgerIcon,
    lastVerified: "2026-07-15",
  },
  lemon: {
    name: "Lemon",
    aliases: ["lemon-cash"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["custodial", "buy_crypto", "sell_crypto", "multi_chain"],
    description:
      "Custodial crypto app for Argentina, Brazil, and Latin America with SOL buying and selling in local currency, withdrawals over the native Solana network, and a Visa card with cashback",
    website: "https://lemon.me/",
    icon: lemonIcon,
    lastVerified: "2026-07-15",
  },
  liminal: {
    name: "Liminal",
    aliases: ["liminal-custody"],
    category: "institutional",
    platforms: ["ios", "android", "web", "api"],
    features: [
      "custodial",
      "mpc",
      "staking",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
      "multi_sig",
    ],
    description:
      "Institutional custody and wallet infrastructure with MPC and multisig hot or cold vaults, a Firewall policy engine with spending limits, REST APIs, and SOL staking through Figment validators",
    website: "https://www.liminalcustody.com/",
    icon: liminalIcon,
    lastVerified: "2026-07-15",
  },
  magic: {
    name: "Magic",
    aliases: ["magic-labs", "magic-link"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "social_recovery",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Embedded wallet infrastructure provisioning non-custodial wallets behind email, social, or passkey login, with TEE-based key management, over 53M wallets created, and a dedicated Solana SDK extension",
    website: "https://magic.link/",
    icon: magicIcon,
    lastVerified: "2026-07-15",
  },
  mathwallet: {
    name: "MathWallet",
    aliases: ["math-wallet"],
    category: "consumer",
    platforms: ["ios", "android", "chrome", "brave", "edge", "web", "hardware"],
    features: ["non_custodial", "hold_nfts", "hardware", "multi_chain"],
    description:
      "Multichain wallet covering 228+ networks including Solana, with mobile apps, Chrome, Brave, and Edge extensions, a web wallet, NFT support, and Ledger and WOOKONG hardware integration",
    website: "https://mathwallet.org/",
    icon: mathwalletIcon,
    lastVerified: "2026-07-15",
  },
  metamask: {
    name: "MetaMask",
    aliases: ["meta-mask"],
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox", "brave", "edge"],
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
      "Consensys self-custody wallet with native Solana accounts across its extension and mobile apps, offering SOL and SPL swaps, SOL staking via Figment, and fiat on- and off-ramps",
    website: "https://metamask.io/",
    icon: metamaskIcon,
    lastVerified: "2026-07-15",
  },
  moongate: {
    name: "Moongate",
    aliases: ["moongate-labs"],
    category: "consumer",
    platforms: ["ios", "android", "web", "sdk"],
    features: [
      "buy_crypto",
      "gas_abstraction",
      "social_recovery",
      "multi_chain",
      "solana_native",
    ],
    description:
      "Solana wallet and trading app that creates a wallet instantly via Google, Apple, X, or Ethereum sign-in, with card purchases, cross-chain swaps, and a Wallet Standard adapter SDK for dApps",
    website: "https://moongate.one/",
    icon: moongateIcon,
    lastVerified: "2026-07-15",
  },
  moonshot: {
    name: "Moonshot",
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["non_custodial", "buy_crypto", "sell_crypto", "solana_native"],
    description:
      "Self-custodial Solana wallet app for discovering and trading memecoins, with Apple Pay, card, and bank deposits, USDC cash balances, bank cash-outs, and exportable wallet keys",
    website: "https://moonshot.com/",
    icon: moonshotIcon,
    lastVerified: "2026-07-15",
  },
  mpcvault: {
    name: "MPCVault",
    category: "institutional",
    platforms: ["ios", "android", "chrome", "web", "api", "sdk"],
    features: [
      "non_custodial",
      "hold_nfts",
      "mpc",
      "spending_limits",
      "multi_chain",
      "multi_sig",
    ],
    description:
      "Non-custodial MPC wallet for Web3 teams that splits keys across three shares, with multi-approval policies by amount and destination, batch transfers, Solana support alongside Bitcoin, Ethereum, TON, and TRON, and REST/gRPC APIs",
    website: "https://mpcvault.com/",
    icon: mpcvaultIcon,
    lastVerified: "2026-07-15",
  },
  nabox: {
    name: "Nabox",
    aliases: ["nabox-wallet"],
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: ["non_custodial", "hold_nfts", "multi_chain"],
    description:
      "Non-custodial cross-chain wallet with mobile apps and a Chrome extension, SwapBox DEX-aggregated cross-chain swaps, NFT management, and supported coins including SOL across 50+ blockchains",
    website: "https://nabox.io/",
    icon: naboxIcon,
    lastVerified: "2026-07-15",
  },
  ngrave: {
    name: "NGRAVE",
    category: "hardware",
    platforms: ["ios", "android", "hardware"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "hardware",
      "multi_chain",
    ],
    description:
      "Fully air-gapped, EAL7-certified ZERO hardware wallet with QR-code signing, the LIQUID companion mobile app, and GRAPHENE steel backup, supporting SOL since firmware v1.2 alongside BTC, ETH, and 15+ networks",
    website: "https://ngrave.io/",
    icon: ngraveIcon,
    lastVerified: "2026-07-15",
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
      "Self-custody extension and mobile wallet for Solana, Sui, Aptos, Near, and Movement with SOL staking, Token-2022 support, an NFT gallery, social login, and Ledger integration",
    website: "https://nightly.app/",
    icon: nightlyIcon,
    lastVerified: "2026-07-15",
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
      "Non-custodial mobile and desktop wallet by ChangeNOW covering 70+ coins, with SOL staking, Ethereum and Solana NFT storage, and card or bank buy and sell flows",
    website: "https://walletnow.app/",
    icon: nowwalletIcon,
    lastVerified: "2026-07-15",
  },
  nufi: {
    name: "NuFi",
    category: "consumer",
    platforms: ["chrome", "web"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "social_recovery",
      "staking",
      "hardware",
      "multi_chain",
    ],
    description:
      "Non-custodial web wallet and Chrome extension with SOL, ADA, and FLOW staking, bank-card buy and sell via MoonPay, an NFT gallery, social-login onboarding, and support for six hardware wallet brands",
    website: "https://nu.fi/",
    icon: nufiIcon,
    lastVerified: "2026-07-15",
  },
  okx: {
    name: "OKX Wallet",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "brave", "edge", "web"],
    features: [
      "non_custodial",
      "hold_nfts",
      "gas_abstraction",
      "staking",
      "multi_chain",
    ],
    description:
      "Self-custodial OKX wallet spanning 130+ chains including Solana, with DEX swaps, SOL staking through DeFi Earn, a multi-chain NFT marketplace, and account-abstraction smart accounts",
    website: "https://web3.okx.com/",
    icon: okxIcon,
    lastVerified: "2026-07-15",
  },
  omni: {
    name: "Omni",
    aliases: ["omni-web3-wallet", "steakwallet"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "hold_nfts",
      "staking",
      "hardware",
      "multi_chain",
    ],
    description:
      "Non-custodial mobile wallet formerly known as Steakwallet, covering 25+ networks including Solana, with a three-tap SOL staking flow, Solana NFT support, swaps and bridging, and Ledger cold-storage sync",
    website: "https://omni.app/",
    icon: omniIcon,
    lastVerified: "2026-07-15",
  },
  onekey: {
    name: "OneKey",
    category: "hardware",
    platforms: ["ios", "android", "chrome", "desktop", "web", "hardware"],
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
      "Open-source hardware wallet family with companion apps on mobile, desktop, web, and Chrome, offering SOL staking, NFT storage, and fiat on- and off-ramps across 60+ chains",
    website: "https://onekey.so/",
    icon: onekeyIcon,
    lastVerified: "2026-07-15",
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
      "Open-source embedded wallet and key-management infrastructure for Solana and EVM chains, with self-hostable signing, email and social login, Solana paymaster gas sponsorship, and policy controls",
    website: "https://www.openfort.io/",
    icon: openfortIcon,
    lastVerified: "2026-07-15",
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
      "Open-source, self-hostable key management system from Openfort issuing non-custodial user keys via 2-of-3 Shamir secret sharing, with passkey and OTP recovery, for Ethereum and Solana",
    website: "https://opensigner.dev/",
    icon: opensignerIcon,
    lastVerified: "2026-07-15",
  },
  owallet: {
    name: "OWallet",
    aliases: ["oraichain", "oraichain-owallet"],
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: ["non_custodial", "open_source", "multi_chain"],
    description:
      "Oraichain's open-source self-custody wallet for Oraichain, Bitcoin, Ethereum, BNB Chain, and Solana, with SOL and SPL token transfers and transaction signing on Raydium and Pump.fun",
    website: "https://owallet.io/",
    icon: owalletIcon,
    lastVerified: "2026-07-15",
  },
  ownbit: {
    name: "Ownbit",
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["non_custodial", "spending_limits", "multi_chain", "multi_sig"],
    description:
      "Self-custody mobile multisig and cold wallet supporting SOL and SPL tokens, with QR offline signing on an air-gapped spare phone and threshold approvals for family and team treasuries",
    website: "https://ownbit.io/",
    icon: ownbitIcon,
    lastVerified: "2026-07-15",
  },
  oxapay: {
    name: "OxaPay",
    category: "payments",
    platforms: ["chrome", "web"],
    features: ["custodial", "multi_chain"],
    description:
      "Custodial wallet from the OxaPay crypto payment gateway with web, Telegram, and Chrome extension access, zero-fee internal transfers, built-in swaps, and SOL among 15+ coins",
    website: "https://oxapay.com/wallet",
    icon: oxapayIcon,
    lastVerified: "2026-07-15",
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
      "Embedded wallet and authentication suite with MPC distributed key generation, passkey login, gas sponsorship, a permissions engine with spending limits, and on/off-ramp APIs across Solana and 15+ chains",
    website: "https://www.getpara.com/",
    icon: paraIcon,
    lastVerified: "2026-07-15",
  },
  "particle-network": {
    name: "Particle Network Universal Accounts",
    aliases: ["particle-universal-accounts", "universal-accounts"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "mpc",
      "gas_abstraction",
      "social_recovery",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Chain abstraction infrastructure giving users one Universal Account and balance across EVM chains and Solana, with 2/2 MPC-TSS social-login wallets, gas sponsorship, and master-password recovery",
    website: "https://particle.network/",
    icon: particleNetworkIcon,
    lastVerified: "2026-07-15",
  },
  passimpay: {
    name: "PassimPay",
    category: "payments",
    platforms: ["web"],
    features: ["custodial", "multi_chain"],
    description:
      "Account-based e-wallet from the PassimPay crypto payment gateway, used via web, PWA shortcut, or Telegram mini app, with built-in exchange and SOL among 70+ supported coins",
    website: "https://passimpay.io/",
    icon: passimpayIcon,
    lastVerified: "2026-07-15",
  },
  "passkeys-wallet": {
    name: "Passkeys Wallet",
    aliases: ["passkeys", "passkeys-foundation"],
    category: "infrastructure",
    platforms: ["web", "api", "sdk"],
    features: [
      "non_custodial",
      "mpc",
      "social_recovery",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Embedded wallet SDK using passkeys and MPC self-custody instead of seed phrases, auto-discovered by Solana Wallet Adapter via Wallet Standard, spanning Bitcoin, Ethereum, Solana, and major L2s",
    website: "https://passkeys.foundation/",
    icon: passkeysWalletIcon,
    lastVerified: "2026-07-15",
  },
  "paybis-wallet": {
    name: "Paybis Wallet",
    aliases: ["paybis"],
    category: "consumer",
    platforms: ["ios", "android", "web"],
    features: ["custodial", "buy_crypto", "sell_crypto", "mpc", "multi_chain"],
    description:
      "Custodial multi-chain wallet built into the Paybis fiat gateway with MPC-fragmented key storage, dedicated per-user on-chain addresses, in-account swaps, and card, PayPal, and bank rails to buy and sell SOL",
    website: "https://paybis.com/crypto-wallet",
    icon: paybisWalletIcon,
    lastVerified: "2026-07-15",
  },
  "paypal-cryptocurrency-services": {
    name: "PayPal Cryptocurrency Services",
    aliases: ["paypal"],
    category: "payments",
    platforms: ["ios", "android", "web"],
    features: ["custodial", "buy_crypto", "sell_crypto", "multi_chain"],
    description:
      "Custodial crypto service in the PayPal app and website for buying, selling, holding, transferring, and checking out with SOL, PYUSD, Bitcoin, Ethereum, and other supported tokens",
    website: "https://www.paypal.com/us/digital-wallet/manage-money/crypto",
    icon: paypalCryptocurrencyServicesIcon,
    lastVerified: "2026-07-15",
  },
  phantom: {
    name: "Phantom",
    companyId: "phantom",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox", "brave", "edge"],
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
      "Self-custody wallet for Solana, Ethereum, and more with mobile apps and browser extensions, in-app buy and cash-out, native and liquid SOL staking, NFT instant sell, and Ledger support",
    website: "https://phantom.com/",
    icon: phantomIcon,
    lastVerified: "2026-07-15",
  },
  pontem: {
    name: "Pontem Wallet",
    aliases: ["pontem-network", "pontem-wallet"],
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox"],
    features: ["non_custodial", "hold_nfts", "hardware", "multi_chain"],
    description:
      "Non-custodial mobile and browser-extension wallet for Ethereum, Solana, Movement, and Aptos with NFT viewing and trading, built-in swaps, and native Ledger support",
    website: "https://pontem.network/pontem-wallet",
    icon: pontemIcon,
    lastVerified: "2026-07-15",
  },
  portal: {
    name: "Portal",
    aliases: ["portal-embedded"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "mpc",
      "gas_abstraction",
      "social_recovery",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Embedded wallet infrastructure with non-custodial TSS MPC signing in AWS Nitro enclaves, Solana gas sponsorship, and passkey or cloud-drive backup across Solana, EVM chains, and Bitcoin",
    website: "https://www.portalhq.io/platform/mpc-wallet-as-a-service",
    icon: portalIcon,
    lastVerified: "2026-07-15",
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
      "Embedded wallet infrastructure with TEE-secured key management, server-controlled wallets via API, Solana gas sponsorship, programmable transaction policies, and built-in fiat onramps",
    website: "https://www.privy.io/",
    icon: privyIcon,
    lastVerified: "2026-07-15",
  },
  redotpay: {
    name: "RedotPay",
    category: "payments",
    platforms: ["ios", "android"],
    features: ["custodial", "buy_crypto", "sell_crypto", "multi_chain"],
    description:
      "Custodial payment wallet and stablecoin Visa card app for spending SOL and Solana stablecoins at 130M+ merchants, with bank on-ramps, ATM withdrawals, and payouts to local currency",
    website: "https://www.redotpay.com/",
    icon: redotpayIcon,
    lastVerified: "2026-07-15",
  },
  reown: {
    name: "WalletConnect Wallet SDK",
    companyId: "walletconnect",
    aliases: [
      "reown-walletkit",
      "wallet-connect",
      "walletconnect",
      "walletkit",
    ],
    category: "infrastructure",
    platforms: ["sdk"],
    features: ["open_source", "multi_chain"],
    description:
      "Open-source WalletConnect SDK for wallet builders, connecting wallets to 80,000+ onchain apps with Solana transaction and message signing across Web, iOS, Android, Flutter, React Native, and .NET",
    website: "https://walletconnect.network/sdk",
    icon: reownIcon,
    lastVerified: "2026-07-15",
  },
  "republic-wallet": {
    name: "Republic Wallet",
    aliases: ["republic"],
    category: "consumer",
    platforms: ["web"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "social_recovery",
      "multi_chain",
    ],
    description:
      "Self-custody wallet built into the Republic investing platform, holding tokenized equity, funds, and crypto across Solana, Ethereum, and other chains with passkey and Face ID login instead of seed phrases",
    website: "https://republic.com/wallet",
    icon: republicWalletIcon,
    lastVerified: "2026-07-15",
  },
  robinhood: {
    name: "Robinhood Wallet",
    category: "consumer",
    platforms: ["ios", "android"],
    features: ["non_custodial", "buy_crypto", "hold_nfts", "multi_chain"],
    description:
      "Self-custody mobile wallet from Robinhood for Solana, Ethereum, Bitcoin, and other networks, with in-app swaps, NFTs, dApp connections, and card or bank crypto purchases",
    website: "https://robinhood.com/us/en/wallet/",
    icon: robinhoodIcon,
    lastVerified: "2026-07-15",
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
      "Seed-phrase-free hardware wallet with an EAL6+ secure element, Shamir-based TapSafe recovery, and a companion app for SPL tokens, swaps, and in-app Solana staking",
    website: "https://ryder.id/",
    icon: ryderIcon,
    lastVerified: "2026-07-15",
  },
  safeheron: {
    name: "Safeheron",
    category: "institutional",
    platforms: ["ios", "web", "api", "sdk"],
    features: [
      "non_custodial",
      "mpc",
      "spending_limits",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Enterprise MPC self-custody platform with TEE-hardened key sharding, a policy engine for approval workflows, wallet-as-a-service APIs, and Solana access alongside EVM, TRON, and TON",
    website: "https://safeheron.com/",
    icon: safeheronIcon,
    lastVerified: "2026-07-15",
  },
  safepal: {
    name: "SafePal",
    companyId: "safepal-wallet",
    category: "hardware",
    platforms: ["ios", "android", "chrome", "edge", "hardware"],
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
      "Hardware wallet family (S1, S1 Pro, X1) with a companion mobile app and browser extension covering 100+ blockchains, SOL staking via Kiln, NFTs, and MoonPay fiat on- and off-ramps",
    website: "https://www.safepal.com/",
    icon: safepalIcon,
    lastVerified: "2026-07-15",
  },
  samui: {
    name: "Samui",
    category: "consumer",
    platforms: ["web"],
    features: ["non_custodial", "hold_nfts", "open_source", "solana_native"],
    description:
      "Open-source MIT-licensed Solana wallet and toolbox for builders, with SOL airdrops, token creation, NFT management, devnet and localnet switching, and a hosted web app",
    website: "https://samui.build/",
    icon: samuiIcon,
    lastVerified: "2026-07-15",
  },
  secux: {
    name: "SecuX",
    aliases: ["secux-technology", "secux-technology-inc"],
    category: "hardware",
    platforms: ["ios", "android", "web", "hardware"],
    features: [
      "non_custodial",
      "te",
      "buy_crypto",
      "hold_nfts",
      "hardware",
      "multi_chain",
    ],
    description:
      "Hardware wallet family (V20, W20, Nifty) with a companion app for SOL and SPL tokens, Solana Token-2022 assets, on-device Solana NFT display, and in-app fiat purchases",
    website: "https://secuxtech.com/",
    icon: secuxIcon,
    lastVerified: "2026-07-15",
  },
  solflare: {
    name: "Solflare",
    companyId: "solflare",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox", "brave", "edge", "web"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "staking",
      "hardware",
      "solana_native",
    ],
    description:
      "Solana self-custody wallet with mobile, web, and browser-extension apps for SOL staking, swaps, and NFTs, plus the NFC Solflare Shield hardware card and a USDC Mastercard debit card",
    website: "https://www.solflare.com/",
    icon: solflareIcon,
    lastVerified: "2026-07-15",
  },
  speed: {
    name: "Speed Wallet",
    aliases: ["speed-wallet"],
    category: "payments",
    platforms: ["ios", "android", "chrome", "web"],
    features: ["custodial", "buy_crypto", "multi_chain"],
    description:
      "Custodial Bitcoin Lightning wallet for everyday payments with card and Apple Pay purchases, gift cards with BTC cashback, and USDT and USDC transfers on Solana, Ethereum, and Tron",
    website: "https://www.speed.app/",
    icon: speedIcon,
    lastVerified: "2026-07-15",
  },
  squadsx: {
    name: "SquadsX",
    companyId: "squads",
    aliases: ["squads"],
    category: "institutional",
    platforms: ["chrome"],
    features: ["non_custodial", "solana_native", "multi_sig"],
    description:
      "Browser extension from Squads that connects Squads multisigs to Solana dApps, turning dApp transactions into proposals that execute only after member approvals",
    website:
      "https://chromewebstore.google.com/detail/squadsx/jhmfofkpljgmilikdmkglcmekjnlekda",
    icon: squadsxIcon,
    lastVerified: "2026-07-15",
  },
  starkey: {
    name: "StarKey",
    aliases: ["starkey-wallet", "supra"],
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "social_recovery",
      "multi_chain",
    ],
    description:
      "Supra's official self-custodial wallet for Supra, Ethereum, Aptos, Sui, and Solana, with a Chrome extension, mobile apps, Banxa fiat purchases, and Split Key Recovery across cloud, device, and a guardian",
    website: "https://starkey.app/",
    icon: starkeyIcon,
    lastVerified: "2026-07-15",
  },
  talisman: {
    name: "Talisman",
    category: "consumer",
    platforms: ["chrome", "firefox", "brave", "edge"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "open_source",
      "hardware",
      "multi_chain",
    ],
    description:
      "Open-source self-custody browser extension for the Solana, EVM, and Polkadot ecosystems with multi-chain NFT viewing, fiat on and off-ramps, and Ledger account import",
    website: "https://talisman.xyz/",
    icon: talismanIcon,
    lastVerified: "2026-07-15",
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
      "hold_nfts",
      "staking",
      "open_source",
      "hardware",
      "multi_chain",
    ],
    description:
      "NFC card and ring hardware wallets with an open-source non-custodial mobile app for 14,000+ tokens on 90 blockchains, including SOL staking, Solana NFTs, and buy, sell, and swap flows",
    website: "https://tangem.com/",
    icon: tangemIcon,
    lastVerified: "2026-07-15",
  },
  tiplink: {
    name: "Tiplink",
    aliases: ["fin"],
    category: "payments",
    platforms: ["web", "sdk"],
    features: [
      "non_custodial",
      "solana_pay",
      "hold_nfts",
      "social_recovery",
      "solana_native",
    ],
    description:
      "Non-custodial Solana link wallet for sending SOL, SPL tokens, NFTs, and SFTs as shareable URLs, with Google-login claiming, Solana Pay checkout flows, and a wallet adapter for dApp sign-in",
    website: "https://tiplink.io/",
    icon: tiplinkIcon,
    lastVerified: "2026-07-15",
  },
  tokenpocket: {
    name: "TokenPocket",
    category: "consumer",
    platforms: ["ios", "android", "chrome"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "gas_abstraction",
      "staking",
      "hardware",
      "multi_chain",
    ],
    description:
      "Multi-chain self-custody wallet with 30M+ users, a dApp browser, credit-card crypto buys, SOL staking, three daily gas-free Solana transfers, and the KeyPal hardware wallet",
    website: "https://tokenpocket.pro/",
    icon: tokenpocketIcon,
    lastVerified: "2026-07-15",
  },
  tomo: {
    name: "Tomo",
    aliases: ["tomo-inc", "tomo-wallet"],
    category: "consumer",
    platforms: ["ios", "android", "chrome", "web"],
    features: ["non_custodial", "mpc", "social_recovery", "multi_chain"],
    description:
      "Social wallet with Google and email login, MPC-sharded key storage, and a mobile app, Chrome extension, and Telegram bot covering Solana, Bitcoin, Ethereum, and 20+ chains",
    website: "https://tomo.inc/",
    icon: tomoIcon,
    lastVerified: "2026-07-15",
  },
  totalsig: {
    name: "TotalSig",
    category: "consumer",
    platforms: ["chrome"],
    features: ["non_custodial", "hold_nfts", "mpc", "multi_chain", "multi_sig"],
    description:
      "Non-custodial multisig wallet delivered as a Chrome extension, using MPC signing with up to 32 co-signers and NFT support across Solana, Bitcoin, Ethereum, and 13 blockchains",
    website: "https://www.totalsig.com",
    icon: totalsigIcon,
    lastVerified: "2026-07-15",
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
      "Open-source hardware wallets (Safe family and Model T) with the Trezor Suite desktop and web app supporting SOL and SPL tokens, Everstake-delegated SOL staking, and fiat buy and sell flows",
    website: "https://trezor.io/",
    icon: trezorIcon,
    lastVerified: "2026-07-15",
  },
  tria: {
    name: "Tria",
    category: "consumer",
    platforms: ["ios", "android", "web", "sdk"],
    features: [
      "non_custodial",
      "mpc",
      "gas_abstraction",
      "social_recovery",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Self-custodial trading and spending app with Visa cards, cross-chain swaps, and on-chain yield across Solana and 15+ networks, plus TSS-based embedded wallet SDKs with gasless transactions",
    website: "https://tria.so",
    icon: triaIcon,
    lastVerified: "2026-07-15",
  },
  "true-markets": {
    name: "True Markets",
    category: "consumer",
    platforms: ["ios"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "gas_abstraction",
      "multi_chain",
      "solana_native",
    ],
    description:
      "Stablecoin-native iOS trading app with an embedded non-custodial wallet, gasless execution for 120+ Solana and 30+ Base tokens, and PayPal deposits and withdrawals",
    website: "https://www.truemarkets.co/",
    icon: trueMarketsIcon,
    lastVerified: "2026-07-15",
  },
  trust: {
    name: "Trust",
    aliases: ["trust-wallet"],
    category: "consumer",
    platforms: ["ios", "android", "chrome", "brave", "edge"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "staking",
      "multi_chain",
    ],
    description:
      "Self-custody wallet for 100+ blockchains with iOS and Android apps and a Chrome, Brave, and Edge extension, offering SOL staking, fiat buy and sell, swaps, and NFT management",
    website: "https://trustwallet.com/download",
    icon: trustwalletcoreIcon,
    lastVerified: "2026-07-15",
  },
  "trustee-wallet": {
    name: "Trustee Wallet",
    aliases: ["trustee", "trustee-global"],
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
      "Open-source non-custodial mobile wallet for 30+ blockchains including Solana and SPL tokens, with Visa card buy and card withdrawal flows, NFT support, and validator-delegated SOL staking",
    website: "https://trusteeglobal.eu/",
    icon: trusteeWalletIcon,
    lastVerified: "2026-07-15",
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
      "Non-custodial embedded wallet and key management infrastructure running signing inside TEEs, with a policy engine, passkey and social login, and Solana fee and rent sponsorship",
    website: "https://www.turnkey.com/",
    icon: turnkeyIcon,
    lastVerified: "2026-07-15",
  },
  unhosted: {
    name: "Unhosted",
    aliases: ["unhosted-wallet"],
    category: "consumer",
    platforms: ["chrome"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "social_recovery",
      "spending_limits",
      "multi_chain",
    ],
    description:
      "Self-custodial smart-account wallet in beta with a Chrome extension, Apple, Google, or email sign-in with passkey recovery, an account-abstraction module marketplace, and buy, sell, and swap coverage listing Solana",
    website: "https://unhosted.com/",
    icon: unhostedIcon,
    lastVerified: "2026-07-15",
  },
  unitywallet: {
    name: "UnityWallet",
    aliases: ["savl", "unity-wallet"],
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
      "Self-custodial mobile wallet for 250+ assets including SOL and SPL tokens, with card and bank on and off-ramps in 110+ fiat currencies, Solana staking rewards, NFT storage, and an encrypted messenger",
    website: "https://www.unitywallet.com/",
    icon: unitywalletIcon,
    lastVerified: "2026-07-15",
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
      "Hardware wallet engineered specifically for Solana with open-source hardware, firmware, and a companion app for macOS, Windows, Linux, and Android, including validator staking",
    website: "https://www.unruggable.io/",
    icon: unruggableIcon,
    lastVerified: "2026-07-15",
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
    ],
    description:
      "Wallet-as-a-service platform offering custodial or non-custodial wallets across 14+ blockchains including Solana, with social login, integrated fiat onramps, and gasless meta transactions",
    website: "https://www.venly.io/product/wallet-as-a-service",
    icon: venlyIcon,
    lastVerified: "2026-07-15",
  },
  walletverse: {
    name: "Walletverse",
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
      "Self-custody mobile wallet for 700+ cryptocurrencies with SOL staking, card and bank purchases, DEX-aggregator swaps, NFT support, and WalletConnect integration",
    website: "https://walletverse.io",
    icon: walletverseIcon,
    lastVerified: "2026-07-15",
  },
  web3auth: {
    name: "Web3Auth",
    aliases: ["metamask-embedded-wallets"],
    category: "infrastructure",
    platforms: ["api", "sdk"],
    features: [
      "non_custodial",
      "buy_crypto",
      "mpc",
      "gas_abstraction",
      "social_recovery",
      "open_source",
      "private_key_infrastructure",
      "multi_chain",
    ],
    description:
      "Embedded wallet and MPC key management infrastructure, now MetaMask Embedded Wallets under Consensys, with social login, a fiat onramp aggregator, and Solana SDK support alongside EVM, Bitcoin, and more",
    website: "https://web3auth.io/",
    icon: web3authIcon,
    lastVerified: "2026-07-15",
  },
  "wisdomtree-prime": {
    name: "WisdomTree Prime",
    aliases: ["wisdomtree"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "custodial",
      "non_custodial",
      "buy_crypto",
      "gas_abstraction",
      "multi_chain",
    ],
    description:
      "Regulated digital wallet app from asset manager WisdomTree for Bitcoin, Ether, and tokenized funds, with USDC on-ramps, self-custody, and gas-free transfers across Solana and seven other chains",
    website: "https://www.wisdomtreeprime.com",
    icon: wisdomtreePrimeIcon,
    lastVerified: "2026-07-15",
  },
  xrocket: {
    name: "xRocket",
    category: "consumer",
    platforms: ["web"],
    features: ["custodial", "buy_crypto", "sell_crypto", "multi_chain"],
    description:
      "Custodial Telegram wallet and exchange with bot, mini app, and web versions, bank-card P2P buying and selling, crypto cheques and invoices, and SOL, USDC, and SPL tokens among six networks",
    website: "https://xrocket.exchange/",
    icon: xrocketIcon,
    lastVerified: "2026-07-15",
  },
  zar: {
    name: "ZAR",
    category: "payments",
    platforms: ["ios", "android"],
    features: ["non_custodial", "buy_crypto", "sell_crypto", "solana_native"],
    description:
      "Self-custody dollar wallet for emerging markets holding USDC on Solana, with cash-to-stablecoin exchange at local merchant agents, a Visa card, and cash-out to banks in 70+ countries",
    website: "https://www.zar.app/",
    icon: zarIcon,
    lastVerified: "2026-07-15",
  },
  zendwallet: {
    name: "ZendWallet",
    aliases: ["zend-wallet"],
    category: "payments",
    platforms: ["ios", "android"],
    features: ["custodial", "buy_crypto", "sell_crypto", "multi_chain"],
    description:
      "Custodial mobile wallet for Africa handling USDT and USDC on networks including Solana, with instant stablecoin-to-local-currency swaps in NGN, KES, ZAR, and GHS and global business payments",
    website: "https://zendwallet.com/",
    icon: zendwalletIcon,
    lastVerified: "2026-07-15",
  },
  zengo: {
    name: "Zengo",
    aliases: ["zengo-wallet"],
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hold_nfts",
      "mpc",
      "social_recovery",
      "multi_chain",
    ],
    description:
      "Seedless mobile wallet using two-share MPC threshold signing instead of a private key, with SOL and Solana token support among 14 networks, in-app buy and sell, and email plus 3D FaceLock recovery",
    website: "https://zengo.com/",
    icon: zengoIcon,
    lastVerified: "2026-07-15",
  },
  zerion: {
    name: "Zerion Wallet",
    companyId: "zerion",
    category: "consumer",
    platforms: ["ios", "android", "chrome", "firefox", "web"],
    features: [
      "non_custodial",
      "buy_crypto",
      "hold_nfts",
      "open_source",
      "multi_chain",
    ],
    description:
      "Non-custodial wallet for Ethereum, Solana, and 50+ EVM networks with mobile apps, a GPL-licensed open-source Chrome and Firefox extension, card purchases, DEX swaps, and NFT tracking",
    website: "https://zerion.io/",
    icon: zerionIcon,
    lastVerified: "2026-07-15",
  },
  zypto: {
    name: "Zypto",
    category: "consumer",
    platforms: ["ios", "android"],
    features: [
      "non_custodial",
      "buy_crypto",
      "sell_crypto",
      "hardware",
      "multi_chain",
    ],
    description:
      "Self-custody mobile wallet and payments super-app covering Solana among 70+ blockchains, with crypto cards, bill pay, fiat on/off-ramps, and an optional NFC Vault Key Card for cold storage",
    website: "https://zypto.com/",
    icon: zyptoIcon,
    lastVerified: "2026-07-15",
  },
} satisfies Record<string, WalletRecord>;

export type WalletSlug = keyof typeof walletRecords;

export const walletData: Record<WalletSlug, WalletRecord> = walletRecords;
