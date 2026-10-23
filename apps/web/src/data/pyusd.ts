// Every link and stat source on /pyusd lives here so `pnpm validate:content`
// can check it. Copy lives in the `pyusd` messages, keyed by the ids below.

export const MINTS = {
  mainnet: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
  devnet: "CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM",
} as const;

export const MINT_DETAILS = [
  { id: "program", value: "Token-2022" },
  { id: "decimals", value: "6" },
  { id: "devnet", value: "CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM" },
] as const;

export const MINT_EXPLORER_LINK = {
  id: "explorer",
  href: "https://explorer.solana.com/address/2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
} as const;

export const HERO_BUTTONS = [
  { id: "payments", variant: "primary", href: "/docs/payments" },
  {
    id: "reserves",
    variant: "secondary",
    href: "https://www.paxos.com/pyusd-transparency",
  },
] as const;

// Values and labels are dated in the English messages and recorded in
// content-audit/claims.json; `statSource` must match the claim's source.
export const STATS = [
  {
    id: "solanaSupply",
    statSource: "https://defillama.com/stablecoin/paypal-usd",
  },
  {
    id: "reserves",
    statSource: "https://www.paxos.com/pyusd-transparency",
  },
  {
    id: "solanaShare",
    statSource: "https://www.paxos.com/pyusd-transparency",
  },
  {
    id: "backing",
    statSource: "https://www.paxos.com/pyusd",
  },
] as const;

export const STATS_LIVE_LINK = {
  id: "liveData",
  href: "/data?tab=stablecoins",
} as const;

export const TRUST_ITEMS = [
  {
    id: "issuer",
    links: [
      {
        id: "charter",
        href: "https://www.paxos.com/blog/occ-charter-stablecoins",
      },
    ],
  },
  {
    id: "reserves",
    links: [
      { id: "attestations", href: "https://www.paxos.com/pyusd-transparency" },
    ],
  },
  {
    id: "access",
    links: [
      {
        id: "paypal",
        href: "https://www.paypal.com/us/digital-wallet/manage-money/crypto/pyusd",
      },
    ],
  },
] as const;

// Mint state as read from mainnet on the date in `pyusd.mint.checked`.
export const MINT_EXTENSIONS = [
  {
    id: "permanentDelegate",
    status: "active",
    href: "/docs/tokens/extensions/permanent-delegate",
  },
  {
    id: "metadata",
    status: "active",
    href: "/docs/tokens/extensions/metadata",
  },
  {
    id: "transferFee",
    status: "dormant",
    href: "/docs/tokens/extensions/transfer-fees",
  },
  {
    id: "transferHook",
    status: "dormant",
    href: "/docs/tokens/extensions/transfer-hook",
  },
  {
    id: "confidential",
    status: "dormant",
    href: "/docs/tokens/extensions/confidential-transfer",
  },
] as const;

export const MINT_CODE = `import { address } from "@solana/kit";
import { findAssociatedTokenPda } from "@solana-program/token";
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";

const PYUSD_MINT = address("${MINTS.mainnet}");

// PYUSD is a Token-2022 mint, so derive its accounts with that program.
const [pyusdAta] = await findAssociatedTokenPda({
  mint: PYUSD_MINT,
  owner: walletAddress,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});`;

export const MINT_LINKS = [
  { id: "howPaymentsWork", href: "/docs/payments/how-payments-work" },
  { id: "extensions", href: "/docs/tokens/extensions" },
] as const;

export const BUILD_STEPS = [
  {
    id: "test",
    links: [
      { id: "faucet", href: "https://faucet.paxos.com/" },
      {
        id: "testnet",
        href: "https://docs.paxos.com/guides/stablecoin/pyusd/testnet",
      },
    ],
  },
  {
    id: "accept",
    links: [
      { id: "quickstart", href: "/docs/payments/quickstart" },
      { id: "solanaPay", href: "/docs/payments/accept-payments/solana-pay" },
      { id: "commerceKit", href: "/docs/tools/commerce-kit" },
    ],
  },
  {
    id: "send",
    links: [
      {
        id: "verifyAddress",
        href: "/docs/payments/send-payments/verify-address",
      },
      {
        id: "feeAbstraction",
        href: "/docs/payments/send-payments/payment-processing/fee-abstraction",
      },
    ],
  },
  {
    id: "agents",
    links: [{ id: "x402", href: "/docs/payments/agentic-payments/x402" }],
  },
] as const;

export const RESOURCES = [
  { id: "paxosDocs", href: "https://docs.paxos.com/guides/stablecoin/pyusd" },
  { id: "contract", href: "https://github.com/paxosglobal/pyusd-contract" },
  { id: "productionReadiness", href: "/docs/tools/production-readiness" },
  { id: "deepDive", href: "/news/pyusd-paypal-solana-developer" },
  { id: "launch", href: "/news/paypal-pyusd-on-solana" },
  {
    id: "whitePaper",
    href: "https://www.paypalobjects.com/devdoc/community/PYUSD-Solana-White-Paper.pdf",
  },
] as const;

export const RELATED_LINKS = [
  { id: "stablecoins", href: "/solutions/stablecoins" },
  { id: "payments", href: "/developers/payments" },
  { id: "tokenExtensions", href: "/solutions/token-extensions" },
  { id: "paymentsTooling", href: "/solutions/payments-tooling" },
] as const;
