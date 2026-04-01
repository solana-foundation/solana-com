const CONTENT_BLOCK_STYLE_KEYS = {
  spacing: "spacing",
  spacingWithMargins: "spacingWithMargins",
  spacingNoBottom: "spacingNoBottom",
  smallOnly: "smallOnly",
  cardDeckWrapper: "cardDeckWrapper",
  tableWrapper: "tableWrapper",
};

/** @type {Record<string, import("@/component-library/responsive-box").ResponsiveStyles>} */
export const BLOCK_STYLES = {
  [CONTENT_BLOCK_STYLE_KEYS.spacing]: {
    large: { paddingTop: "20px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacingWithMargins]: {
    large: { paddingTop: "20px", marginTop: "auto", marginBottom: "auto" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacingNoBottom]: {
    large: { paddingTop: "20px", paddingBottom: "0px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.smallOnly]: {
    large: { display: "none" },
    medium: { display: "none" },
    small: { display: "flex" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.cardDeckWrapper]: {
    large: { paddingTop: "0px", marginTop: "-3px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.tableWrapper]: {
    large: { paddingTop: "20px", overflowX: "auto" },
  },
};

export const META = {
  seoImage:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fc49d029e85c04eed926bbee89b868317.png",
};

export const CONTENT_EDITOR_CTA = {
  button: {
    url: "/developers/migrate-to-solana",
  },
};

export const NAV_BUTTONS = [
  {
    label: "",
    hierarchy: "outline",
    size: "md",
    iconSize: "md",
    startIcon: "none",
    endIcon: "none",
    url: "/developers/migrate-to-solana",
  },
];

export const RESOURCE_CARD_DECK = {
  numCols: 3,
  featured: true,
  cards: [
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://realms.today",
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
        url: "https://docs.cosmos.network/main/learn/advanced/genesis",
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
        url: "https://www.solana-program.com/docs/token",
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
        url: "https://www.helius.dev/blog/solana-airdrop",
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
        url: "https://github.com/jito-foundation/distributor",
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
        url: "https://github.com/solana-developers/developer-bootcamp-2024/tree/main/project-8-token-vesting",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
  ],
};
