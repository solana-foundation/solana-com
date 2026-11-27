/**
 * External and Solana.com resources for teams planning a migration, shown in
 * the hub's "Migration resources" section. Titles are the publishers' own
 * article titles, so they stay in English; group and project labels live in
 * the `developers-migrate-hub.resources` catalog keys.
 *
 * Every link was opened and checked on 2026-11-27. Re-check before adding
 * more: only link pages that explain how a migration works, not live token
 * portals or bridging how-tos.
 */

export type MigrationResource = {
  title: string;
  publisher: string;
  url: string;
};

export const RESOURCE_GROUPS: {
  key: "guides" | "tokens";
  items: MigrationResource[];
}[] = [
  {
    key: "guides",
    items: [
      {
        title: "Moving from Ethereum Development to Solana",
        publisher: "Solana",
        url: "/news/evm-to-svm",
      },
      {
        title: "How to Migrate From Ethereum to Solana: A Guide for Devs",
        publisher: "Helius",
        url: "https://www.helius.dev/blog/how-to-migrate-from-ethereum-to-solana",
      },
      {
        title: "Solana Development for EVM Developers",
        publisher: "QuickNode",
        url: "https://www.quicknode.com/guides/solana-development/getting-started/solana-development-for-evm-developers",
      },
      {
        title: "60 Days of Solana",
        publisher: "RareSkills",
        url: "https://rareskills.io/solana-tutorial",
      },
      {
        title: "DePIN Quickstart Guide",
        publisher: "Solana",
        url: "/developers/cookbook/depin",
      },
    ],
  },
  {
    key: "tokens",
    items: [
      {
        title: "Get Started with NTT",
        publisher: "Wormhole",
        url: "https://wormhole.com/docs/products/token-transfers/native-token-transfers/get-started/",
      },
      {
        title: "Deploy NTT to SVM Chains",
        publisher: "Wormhole",
        url: "https://wormhole.com/docs/products/token-transfers/native-token-transfers/guides/deploy-to-solana/",
      },
    ],
  },
];

/** Projects that moved to Solana; `key` maps to resources.examples.<key>. */
export const MIGRATION_EXAMPLES: {
  key: "helium" | "render" | "geodnet";
  items: MigrationResource[];
}[] = [
  {
    key: "helium",
    items: [
      {
        title: "HIP-70: Scaling the Helium Network",
        publisher: "Helium",
        url: "https://github.com/helium/HIP/blob/main/0070-scaling-helium.md",
      },
      {
        title: "Helium upgrades to Solana",
        publisher: "Solana",
        url: "/news/helium-upgrades-to-solana",
      },
      {
        title: "Migration service source code",
        publisher: "Helium",
        url: "https://github.com/helium/helium-program-library/tree/master/packages/migration-service",
      },
      {
        title: "Helium Program Library",
        publisher: "Helium",
        url: "https://docs.helium.com/network-data/solana/helium-program-library/",
      },
    ],
  },
  {
    key: "render",
    items: [
      {
        title: "RNDR to RENDER: What you need to know",
        publisher: "Render Network",
        url: "https://know.rendernetwork.com/general-render-network/rndr-to-render-what-you-need-to-know",
      },
      {
        title: "Using the Solana Upgrade Assistance Tool",
        publisher: "Render Network",
        url: "https://know.rendernetwork.com/general-render-network/rndr-to-render-what-you-need-to-know/using-the-solana-upgrade-assistance-tool",
      },
      {
        title: "Render Network Upgrade Portal FAQ",
        publisher: "Render Network",
        url: "https://know.rendernetwork.com/general-render-network/rndr-to-render-what-you-need-to-know/render-network-upgrade-portal-faq",
      },
    ],
  },
  {
    key: "geodnet",
    items: [
      {
        title: "Crosschain between Polygon and Solana",
        publisher: "GEODNET",
        url: "https://docs.geodnet.com/geod-token/bridge-from-polygon-to-solana",
      },
    ],
  },
];
