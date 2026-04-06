export const PATH_CARD_DECK = {
  numCols: 3,
  featured: false,
  cards: [
    {
      type: "image",
      headingAs: "h2",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Ff1d4c0384bf94fd4bd51807305310e9e.png",
      },
      backgroundGradient: "aqua",
      callToAction: {
        url: "/developers/migrate-to-solana/cosmos/cosmwasm",
        size: "md",
        hierarchy: "primary",
      },
      mobileBackgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
    },
    {
      type: "image",
      headingAs: "h2",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Ff1d4c0384bf94fd4bd51807305310e9e.png",
      },
      backgroundGradient: "purple",
      callToAction: {
        url: "/developers/migrate-to-solana/cosmos/app-chain",
        size: "md",
        hierarchy: "primary",
      },
      mobileBackgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
    },
  ],
};

export const RESOURCE_CARD_DECK = {
  numCols: 3,
  featured: false,
  cards: [
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "/developers/migrate-to-solana",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "/docs/core/accounts",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "/developers/guides/getstarted/hello-world-in-your-browser",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
  ],
};

export const COSMOS_PATHS = [
  { key: "0", href: "/developers/migrate-to-solana/cosmos/cosmwasm" },
  { key: "1", href: "/developers/migrate-to-solana/cosmos/app-chain" },
];

export const COSMOS_RESOURCES = [
  { key: "0", href: "/developers/migrate-to-solana" },
  { key: "1", href: "/docs/core/accounts" },
  {
    key: "2",
    href: "/developers/guides/getstarted/hello-world-in-your-browser",
  },
];
