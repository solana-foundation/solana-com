// Shared fixture data for all design lab variants

export const HERO = {
  eyebrow: "Chain Migration Guide",
  headline: "Migrate to Solana",
  body: "Comprehensive guides for migrating your product from Ethereum, Cosmos, or other blockchains to Solana.",
};

export const CHAIN_SELECTOR = {
  eyebrow: "Choose Your Chain",
  headline: "Where are you migrating from?",
  body: "Select your source chain to jump directly to the relevant migration guides.",
};

export const CHAINS = [
  {
    eyebrow: "Ethereum",
    title: "EVM / Ethereum",
    body: "11 guides covering ERC standards, accounts, smart contracts, and key differences between EVM and SVM.",
    cta: "View EVM Guides",
    url: "/developers/migrate-to-solana/ethereum",
  },
  {
    eyebrow: "Cosmos",
    title: "CosmWasm / Cosmos",
    body: "1 complete walkthrough for migrating a Cosmos app chain to Solana — from chain wind-down to token claims and governance.",
    cta: "View Cosmos Guide",
    url: "/developers/cosmos-to-svm",
  },
];

export const RESOURCES_HEADING = {
  eyebrow: "Resources",
  headline: "Next steps for Solana developers.",
  body: "Core resources to get you building on Solana after your migration.",
};

export const RESOURCE_CARDS = [
  {
    type: "image" as const,
    headingAs: "h3" as const,
    eyebrow: "",
    heading: "Intro to Solana Development",
    body: "",
    backgroundImage: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
    },
    callToAction: {
      url: "/developers/guides/getstarted/hello-world-in-your-browser",
      endIcon: "arrow-right",
      hierarchy: "outline",
    },
  },
  {
    type: "image" as const,
    headingAs: "h3" as const,
    eyebrow: "",
    heading: "Solana Development Core Concepts",
    body: "",
    backgroundImage: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
    },
    callToAction: {
      url: "https://solana.com/docs/core",
      endIcon: "arrow-right",
      hierarchy: "outline",
    },
  },
  {
    type: "image" as const,
    headingAs: "h3" as const,
    eyebrow: "",
    heading: "Solana Bootcamp",
    body: "",
    backgroundImage: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
    },
    callToAction: {
      url: "https://www.youtube.com/watch?v=amAq-WHAFs8&list=PLilwLeBwGuK7HN8ZnXpGAD9q6i4syhnVc",
      endIcon: "arrow-right",
      hierarchy: "outline",
    },
  },
  {
    type: "image" as const,
    headingAs: "h3" as const,
    eyebrow: "",
    heading: "More Solana Developer Tools",
    body: "",
    backgroundImage: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
    },
    callToAction: {
      url: "/developers",
      endIcon: "arrow-right",
      hierarchy: "outline",
    },
  },
];
