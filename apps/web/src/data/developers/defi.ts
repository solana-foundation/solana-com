export const META = {
  // seoImage: "",
} as const;

export const HERO_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fcaab781a01724a068276fdd3446f4cbe.png";

export const HERO_BUTTONS = [
  {
    id: "startBuilding",
    hierarchy: "purpleGradient",
    size: "md",
    url: "https://solana.com/developers",
  },
  {
    id: "readDocs",
    hierarchy: "outline",
    size: "md",
    url: "https://docs.solana.com",
  },
] as const;

export const SWITCHBACK_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F873bf74d6e4a43d8a6f83d99f0d0288f.png";

export const SWITCHBACK_BUTTONS = [
  {
    id: "readGuide",
    hierarchy: "outline",
    size: "md",
    url: "https://www.anchor-lang.com/docs/quickstart",
  },
] as const;

export const CARD_DECK_COLUMNS = 3;

export const CARD_DECK_CARDS = [
  {
    id: "walletAdapter",
    type: "standard",
    headingAs: "h3",
    callToAction: {
      hierarchy: "link",
      size: "md",
      endIcon: "arrow-up-right",
      url: "https://github.com/solana-labs/wallet-adapter",
    },
  },
  {
    id: "lending",
    type: "standard",
    headingAs: "h3",
    callToAction: {
      hierarchy: "link",
      size: "md",
      endIcon: "arrow-up-right",
      url: "https://sinoglobalcap.medium.com/how-to-solana-chapter-1-solana-lending-borrowing-5ba14905e2fd",
    },
  },
  {
    id: "oracles",
    type: "standard",
    headingAs: "h3",
    callToAction: {
      hierarchy: "link",
      size: "md",
      endIcon: "arrow-up-right",
      url: "https://pyth.network/",
    },
  },
  {
    id: "derivatives",
    type: "standard",
    headingAs: "h3",
    callToAction: {
      hierarchy: "link",
      size: "md",
      endIcon: "arrow-up-right",
      url: "https://solana.com/ecosystem/explore?categories=defi",
    },
  },
  {
    id: "staking",
    type: "standard",
    headingAs: "h3",
    callToAction: {
      hierarchy: "link",
      size: "md",
      endIcon: "arrow-up-right",
      url: "https://solana.com/ecosystem/explore",
    },
  },
  {
    id: "bridges",
    type: "standard",
    headingAs: "h3",
    callToAction: {
      hierarchy: "link",
      size: "md",
      endIcon: "arrow-up-right",
      url: "https://solana.com/ecosystem/explore",
    },
  },
] as const;

export const CONVERSION_PANEL_PRIMARY = {
  variant: "centered",
  buttons: [
    {
      id: "documentation",
      hierarchy: "outline",
      size: "md",
      endIcon: "arrow-up-right",
      url: "https://solana.com/rpc",
    },
  ],
} as const;

export const COMMUNITY_GALLERY_CONFIG = {
  square: false,
} as const;

export const COMMUNITY_GALLERY_CARDS = [
  {
    id: "jupiter",
    cardType: "image",
    size: "large",
    image: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F0026766e071a4931aa525fd374f933f7.png",
    },
    button: {
      hierarchy: "link",
      size: "sm",
      url: "https://solana.com/ecosystem/jupiteraggregator",
      endIcon: "arrow-up-right",
    },
  },
  {
    id: "projectCount",
    cardType: "stat",
    button: {
      hierarchy: "link",
      endIcon: "arrow-up-right",
      url: "https://solana.com/ecosystem/explore?categories=defi",
    },
  },
  {
    id: "allbridge",
    cardType: "image",
    size: "small",
    image: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F7df6ae2cbab24f40b48bd817a984f191.png",
    },
    button: {
      hierarchy: "link",
      url: "https://solana.com/ecosystem/allbridge",
      endIcon: "arrow-up-right",
    },
  },
  {
    id: "orca",
    cardType: "image",
    size: "small",
    image: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fd6efa46593864c18bf0f984279f7be51.png",
    },
    button: {
      hierarchy: "link",
      url: "https://solana.com/ecosystem/orca",
      endIcon: "arrow-up-right",
    },
  },
  {
    id: "marinade",
    cardType: "image",
    size: "small",
    image: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F5cc13b1280d143a0af086f1e7a32094e.png",
    },
    button: {
      hierarchy: "link",
      url: "https://solana.com/ecosystem/marinade",
      endIcon: "arrow-right",
    },
  },
  {
    id: "hubble",
    cardType: "image",
    size: "small",
    image: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fd0024af366664e10b9303f963e63f829.png",
    },
    button: {
      hierarchy: "link",
      size: "sm",
      url: "https://solana.com/ecosystem/hubbleprotocol",
      endIcon: "arrow-up-right",
    },
  },
] as const;

export const CONVERSION_PANEL_COMMUNITY = {
  variant: "inline-centered",
  showLogos: false,
  listItems: [
    {
      id: "discord",
      hierarchy: "link",
      size: "md",
      endIcon: "arrow-up-right",
      url: "https://solana.com/discord",
    },
    {
      id: "forums",
      hierarchy: "link",
      size: "md",
      endIcon: "arrow-up-right",
      url: "https://forums.solana.com",
    },
  ],
} as const;
