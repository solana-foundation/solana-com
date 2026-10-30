import type { DashboardTab } from "./data-config";

/** Providers shown in the per-tab link table, in display order. */
export const providerLinkNames = [
  "Allium",
  "Blockworks",
  "DeFiLlama",
  "Dune",
  "RWA",
  "Top Ledger",
] as const;

export type ProviderLinkName = (typeof providerLinkNames)[number];
type WarehouseTab = Exclude<DashboardTab, "rpc" | "senders">;

// Base URLs shared by several links below.
const alliumSolanaDocs =
  "https://docs.allium.so/historical-data/supported-blockchains/solana/solana";
const duneDocs = "https://docs.dune.com/data-catalog";
const topLedgerResearch = "https://research.topledger.xyz";
const blockworksSolana = "https://app.blockworks.com/projects/solana/analytics";

/**
 * Where each provider's Solana data for a tab lives: a public page for that
 * topic, else the provider's Solana docs. A provider left out has neither,
 * so it isn't shown on that tab.
 */
export const providerLinks: Record<
  WarehouseTab,
  Partial<Record<ProviderLinkName, string>>
> = {
  overview: {
    Allium: `${alliumSolanaDocs}/metrics/overview`,
    Blockworks: `${blockworksSolana}/solana-overview`,
    DeFiLlama: "https://defillama.com/chain/solana",
    Dune: `${duneDocs}/solana/overview`,
    "Top Ledger": `${topLedgerResearch}/rev/cost_and_capacity`,
  },
  network: {
    Allium: `${alliumSolanaDocs}/staking`,
    Blockworks: `${blockworksSolana}/solana-supply-staking-and-validators`,
  },
  stablecoins: {
    Allium: `${alliumSolanaDocs}/stablecoins`,
    Blockworks: `${blockworksSolana}/solana-stablecoins-new`,
    DeFiLlama: "https://defillama.com/stablecoins/solana",
    Dune: `${duneDocs}/curated/stablecoins/activity-enriched/stablecoins-solana-activity-enriched`,
    RWA: "https://app.rwa.xyz/networks/solana",
    "Top Ledger": `${topLedgerResearch}/rwas/stablecoins`,
  },
  defi: {
    Allium: `${alliumSolanaDocs}/dex`,
    Blockworks: `${blockworksSolana}/solana-spot-dexs`,
    DeFiLlama: "https://defillama.com/chain/solana?dexsVolume=true&tvl=false",
    Dune: `${duneDocs}/curated/dex-trades/solana/overview`,
    "Top Ledger": `${topLedgerResearch}/dex/volume`,
  },
  lending: {
    Allium: `${alliumSolanaDocs}/lending`,
    Blockworks: `${blockworksSolana}/solana-lending`,
    DeFiLlama: "https://defillama.com/protocols/lending/solana",
  },
  perps: {
    Allium: `${alliumSolanaDocs}/perpetuals`,
    Blockworks: `${blockworksSolana}/perp-dexs-solana`,
    DeFiLlama: "https://defillama.com/perps/chain/solana",
  },
};

/** The providers to link for a tab, in display order; RPC and Tx Senders have none. */
export function getProviderLinks(tab: DashboardTab) {
  if (tab === "rpc" || tab === "senders") {
    return [];
  }

  const links = providerLinks[tab];

  return providerLinkNames.flatMap((name) => {
    const href = links[name];

    return href ? [{ href, name }] : [];
  });
}
