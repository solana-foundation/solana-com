// Every link and stat source on /developers/defi lives here so
// `pnpm validate:content` can check it. Copy lives in the
// `developers-defi` messages, keyed by the ids below.

export const HERO_COMMAND =
  "npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/nextjs-anchor";

export const HERO_BUTTONS = [
  { id: "quickstart", variant: "primary", href: "/docs/intro/quick-start" },
  { id: "defiDocs", variant: "secondary", href: "/docs/defi" },
] as const;

// Values and labels are dated in the English messages and recorded in
// content-audit/claims.json; `statSource` must match the claim's source.
export const STATS = [
  {
    id: "dexVolume",
    statSource: "https://defillama.com/dexs/chain/solana",
  },
  {
    id: "stablecoins",
    statSource: "https://defillama.com/stablecoins/Solana",
  },
  {
    id: "computeUnits",
    statSource: "https://solana.com/upgrades/100m-cu-blocks",
  },
  {
    id: "txSize",
    statSource: "https://solana.com/upgrades",
  },
] as const;

export const STATS_LIVE_LINK = { id: "liveData", href: "/data" } as const;

export const NETWORK_PROPERTIES = [
  {
    id: "composability",
    links: [{ id: "cpi", href: "/docs/core/cpi" }],
  },
  {
    id: "parallel",
    links: [{ id: "transactions", href: "/docs/core/transactions" }],
  },
  {
    id: "fees",
    links: [{ id: "fees", href: "/docs/core/fees/fee-structure" }],
  },
  {
    id: "speed",
    links: [
      { id: "slotTimes", href: "/200ms" },
      { id: "alpenglow", href: "/alpenglow" },
    ],
  },
] as const;

export const STACK_STEPS = [
  {
    id: "program",
    links: [
      { id: "anchor", href: "https://www.anchor-lang.com/docs" },
      { id: "pinocchio", href: "https://github.com/anza-xyz/pinocchio" },
    ],
  },
  {
    id: "test",
    links: [
      { id: "litesvm", href: "/docs/tools/litesvm" },
      { id: "mollusk", href: "/docs/programs/testing/mollusk" },
      { id: "surfpool", href: "/docs/tools/surfpool" },
    ],
  },
  {
    id: "clients",
    links: [{ id: "codama", href: "/docs/programs/codama/clients" }],
  },
  {
    id: "app",
    links: [
      { id: "frontend", href: "/docs/frontend" },
      { id: "migrate", href: "/docs/frontend/web3-compat" },
    ],
  },
] as const;

export const TEMPLATES = [
  { id: "nextjsAnchor", href: "/developers/templates/nextjs-anchor" },
  { id: "reactViteAnchor", href: "/developers/templates/react-vite-anchor" },
  { id: "pinocchioCounter", href: "/developers/templates/pinocchio-counter" },
] as const;

export const TEMPLATES_LINK = {
  id: "allTemplates",
  href: "/developers/templates",
} as const;

export const PRIMITIVES = [
  {
    id: "swaps",
    links: [{ id: "jupiter", href: "https://developers.jup.ag/docs" }],
  },
  {
    id: "liquidity",
    links: [
      { id: "orca", href: "https://docs.orca.so" },
      { id: "raydium", href: "https://docs.raydium.io" },
      { id: "meteora", href: "https://docs.meteora.ag" },
    ],
  },
  {
    id: "lending",
    links: [
      { id: "kamino", href: "https://kamino.com/docs" },
      { id: "jupiterLend", href: "https://developers.jup.ag/docs/lend" },
      { id: "save", href: "https://docs.save.finance" },
    ],
  },
  {
    id: "perps",
    links: [
      { id: "jupiterPerps", href: "https://developers.jup.ag/docs/perps" },
      { id: "perpsGuide", href: "/news/build-onchain-perps" },
    ],
  },
  {
    id: "oracles",
    links: [
      { id: "pyth", href: "https://docs.pyth.network/price-feeds" },
      { id: "switchboard", href: "https://docs.switchboard.xyz" },
    ],
  },
  {
    id: "staking",
    links: [
      { id: "sanctum", href: "https://learn.sanctum.so" },
      { id: "jito", href: "https://docs.jito.wtf" },
      { id: "marinade", href: "https://docs.marinade.finance" },
    ],
  },
  {
    id: "stablecoins",
    links: [
      {
        id: "usdc",
        href: "https://developers.circle.com/stablecoins/usdc-contract-addresses",
      },
      { id: "pyusd", href: "https://www.paxos.com/pyusd" },
      { id: "overview", href: "/solutions/stablecoins" },
    ],
  },
  {
    id: "crossChain",
    links: [
      { id: "cctp", href: "https://developers.circle.com/cctp" },
      { id: "wormhole", href: "https://wormhole.com/docs" },
      { id: "debridge", href: "https://docs.debridge.com" },
      { id: "layerzero", href: "https://docs.layerzero.network/v2" },
    ],
  },
  {
    id: "tokenExtensions",
    links: [
      {
        id: "transferHook",
        href: "/docs/tokens/extensions/transfer-hook",
      },
      {
        id: "interestBearing",
        href: "/docs/tokens/extensions/interest-bearing-tokens",
      },
      {
        id: "scaledUiAmount",
        href: "/docs/tokens/extensions/scaled-ui-amount",
      },
      {
        id: "confidential",
        href: "/docs/tokens/extensions/confidential-transfer",
      },
    ],
  },
] as const;

export const LANDING_STEPS = [
  {
    id: "computeBudget",
    links: [
      {
        id: "priorityFees",
        href: "/developers/cookbook/transactions/add-priority-fees",
      },
      {
        id: "optimizeCompute",
        href: "/developers/cookbook/transactions/optimize-compute",
      },
    ],
  },
  {
    id: "txFormat",
    links: [
      { id: "v1", href: "/news/transaction-v1-and-the-alt-trade-off" },
      {
        id: "lookupTables",
        href: "/developers/cookbook/transactions/lookup-tables",
      },
    ],
  },
  {
    id: "delivery",
    links: [
      { id: "swqos", href: "/docs/defi/stake-weighted-qos" },
      { id: "providers", href: "/docs/rpc/providers" },
      { id: "rpc", href: "/rpc" },
    ],
  },
  {
    id: "mev",
    links: [{ id: "mevProtection", href: "/docs/defi/mev-protection" }],
  },
  {
    id: "confirm",
    links: [
      {
        id: "confirmation",
        href: "/developers/cookbook/transactions/confirmation",
      },
      { id: "retry", href: "/developers/cookbook/transactions/retry" },
    ],
  },
] as const;

export const SECURITY_ITEMS = [
  {
    id: "multisig",
    links: [{ id: "squads", href: "https://docs.squads.so" }],
  },
  {
    id: "verify",
    links: [{ id: "verifiedBuilds", href: "/docs/programs/verified-builds" }],
  },
  {
    id: "audit",
    links: [{ id: "security", href: "/news/solana-ecosystem-security" }],
  },
  {
    id: "monitor",
    links: [{ id: "microscope", href: "/microscope" }],
  },
] as const;

export const SECURITY_CHECKLIST_LINK = {
  id: "productionReadiness",
  href: "/docs/tools/production-readiness",
} as const;

export const READING = [
  { id: "perps", href: "/news/build-onchain-perps" },
  { id: "propAmms", href: "/news/understanding-proprietary-amms" },
  { id: "v1Transactions", href: "/news/transaction-v1-and-the-alt-trade-off" },
  { id: "slotTimes", href: "/news/slot-time-reduction-effects" },
] as const;

export const COMMUNITY_LINKS = [
  { id: "stackExchange", href: "https://solana.stackexchange.com" },
  { id: "discord", href: "https://solana.com/discord" },
  { id: "forum", href: "https://forum.solana.com" },
  { id: "hackathons", href: "/hackathons" },
] as const;
