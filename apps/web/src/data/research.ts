export const META = {
  seoImage:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F66f93ae5c46847c8b874d425856fba62.png",
} as const;

export const HERO_SWITCHBACK = {
  assetSide: "right",
  image: {
    alt: "",
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F1ae4d0b307214be8a48af7e0ee1caab1.png",
  },
  buttons: [
    {
      id: "validatorHealth",
      hierarchy: "secondary",
      size: "md",
      url: "#validator",
    },
    {
      id: "energyImpact",
      hierarchy: "secondary",
      size: "md",
      url: "#energy",
    },
    {
      id: "networkPerformance",
      hierarchy: "secondary",
      size: "md",
      url: "#performance",
    },
  ],
  placeholder: "",
  emailError: "",
  submitError: "",
  successMessage: "",
} as const;

export const VALIDATOR_CARD_DECK = {
  featured: false,
  numCols: 3,
  cards: [
    {
      id: "firedancer",
      type: "gradient",
      headingAs: "h3",
      backgroundGradient: "pink",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "arrow-up-right",
        url: "https://www.youtube.com/watch?v=YF-7duYCK54",
      },
    },
    {
      id: "jitoLabs",
      type: "gradient",
      headingAs: "h3",
      backgroundGradient: "pink",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "arrow-up-right",
        url: "https://jito.retool.com/embedded/public/3557dd68-f772-4f4f-8a7b-f479941dba02",
      },
    },
    {
      id: "blockZero",
      type: "gradient",
      headingAs: "h3",
      backgroundGradient: "pink",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "arrow-up-right",
        url: "https://lu.ma/0k9m99s1",
      },
    },
  ],
} as const;

export const ENERGY_CARD_DECK = {
  featured: false,
  numCols: 3,
  cards: [
    {
      id: "climateData",
      type: "gradient",
      headingAs: "h3",
      backgroundGradient: "pink",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "arrow-up-right",
        url: "https://climate.solana.com/",
      },
    },
    {
      id: "gainForest",
      type: "gradient",
      headingAs: "h3",
      backgroundGradient: "pink",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "none",
        url: "https://solana.com/news/case-study-gainforest",
      },
    },
    {
      id: "climateLeadership",
      type: "gradient",
      headingAs: "h3",
      backgroundGradient: "pink",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "arrow-up-right",
        url: "https://finance.yahoo.com/news/solana-foundation-ripple-gbbc-others-153000870.html?guccounter=1&guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&guce_referrer_sig=AQAAAEAC14OO4ME-lsk2Ok_n51P4FVpPWO-z3htwaVkHaQftKjXbHyAn0eRfANQGQ2e4s9tZGvENhsPWWFCrH5ijvpUs8tC8TOGhUDQpgxyrUY6-1cOP4ngL2Zm0XXthOTWuo7U8UBhKh3roTNXMdElCWxzc1U86p_EM60YDVGeyUXFH",
      },
    },
  ],
} as const;

export const PERFORMANCE_CARD_DECK = {
  featured: false,
  numCols: 3,
  cards: [
    {
      id: "networkHealth",
      type: "gradient",
      headingAs: "h3",
      backgroundGradient: "pink",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "arrow-up-right",
        url: "https://dune.com/dsaber/solana-network-health-report",
      },
    },
    {
      id: "changelog",
      type: "gradient",
      headingAs: "h3",
      backgroundGradient: "pink",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "arrow-up-right",
        url: "https://youtube.com/playlist?list=PLilwLeBwGuK5-Qri7Pg9zd-Vvhz9kX2-R&feature=shared",
      },
    },
    {
      id: "outageReport",
      type: "gradient",
      headingAs: "h3",
      backgroundGradient: "pink",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "none",
        url: "https://solana.com/news/02-25-23-solana-mainnet-beta-outage-report",
      },
    },
  ],
} as const;

export const ADDITIONAL_CARD_DECK = {
  numCols: 3,
  cards: [
    {
      id: "validatorUpdate",
      type: "cta",
      headingAs: "h4",
      backgroundGradient: "none",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "none",
        url: "https://solana.com/news/solana-validators-v1-16-update",
      },
    },
    {
      id: "developerReport",
      type: "cta",
      headingAs: "h4",
      backgroundGradient: "none",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "arrow-up-right",
        url: "https://www.developerreport.com/developer-report",
      },
    },
    {
      id: "messariReport",
      type: "cta",
      headingAs: "h4",
      backgroundGradient: "none",
      callToAction: {
        hierarchy: "outline",
        size: "sm",
        endIcon: "arrow-up-right",
        url: "https://messari.io/project/solana/quarterly-reports/q2-2023",
      },
    },
  ],
} as const;

export const CONVERSION_PANEL = {
  variant: "centered",
  buttons: [
    {
      id: "reachOut",
      hierarchy: "secondary",
      size: "lg",
      url: "mailto:product@solana.org",
    },
    {
      id: "developerMaterials",
      hierarchy: "outline",
      size: "lg",
      url: "https://solana.com/developers",
    },
  ],
} as const;
