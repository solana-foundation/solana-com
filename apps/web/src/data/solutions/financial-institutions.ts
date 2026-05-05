import { VideoBadge } from "@/components/solutions/video-grid.v2";
import { getCompanyLogoSrc } from "@workspace/ecosystem-data";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: getCompanyLogoSrc("morgan-stanley") ?? "",
    key: "morganStanley",
    href: "https://www.morganstanley.com/im/en-us/individual-investor/insights/press-release/msim-files-initial-registration-statements-for-two-cryptocurrency-etps.html",
  },
  {
    src: getCompanyLogoSrc("jpmorgan") ?? "",
    key: "jpmorgan",
    href: "https://www.jpmorgan.com/about-us/corporate-news/2025/jpmorgan-commercial-paper-issuance-solana-blockchain",
  },
  {
    src: getCompanyLogoSrc("citi") ?? "",
    key: "citi",
    href: "https://www.citigroup.com/global/insights/supply-chain-financing-2026",
  },
  {
    src: getCompanyLogoSrc("societe-generale") ?? "",
    key: "societeGenerale",
    href: "https://www.sgforge.com/societe-generale-forge-solana-network/",
  },
  {
    src: getCompanyLogoSrc("state-street") ?? "",
    key: "stateStreet",
    href: "https://investors.statestreet.com/investor-news-events/press-releases/news-details/2025/State-Street-Investment-Management-and-Galaxy-Digital-Partner-to-Tokenize-Private-Liquidity-Fund-With-Planned-Seed-Investment-from-Ondo/default.aspx",
  },
];

export const LOGOS = [
  {
    src: getCompanyLogoSrc("visa", { theme: "dark" }) ?? "",
    alt: "Visa",
  },
  {
    src: getCompanyLogoSrc("stripe") ?? "",
    alt: "Stripe",
  },
  {
    src: getCompanyLogoSrc("franklin-templeton") ?? "",
    alt: "Franklin Templeton",
  },
  {
    src: getCompanyLogoSrc("blackrock") ?? "",
    alt: "BlackRock",
  },
  {
    src: getCompanyLogoSrc("galaxy", { theme: "dark" }) ?? "",
    alt: "Galaxy",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "gYOTFfy5n3E",
    thumbnail: "/src/img/solutions/icm/video1.webp",
    title: t("financial-institutions-solution.videoPlayer.videos.0.title"),
    description: t(
      "financial-institutions-solution.videoPlayer.videos.0.description",
    ),
    alt: t("financial-institutions-solution.videoPlayer.videos.0.alt"),
    badge: VideoBadge.Podcast,
  },
  {
    id: "8AGUcNIV5oo",
    thumbnail: "/src/img/solutions/icm/video2.webp",
    title: t("financial-institutions-solution.videoPlayer.videos.1.title"),
    description: t(
      "financial-institutions-solution.videoPlayer.videos.1.description",
    ),
    alt: t("financial-institutions-solution.videoPlayer.videos.1.alt"),
    badge: VideoBadge.Interview,
  },
  {
    id: "PC3N-qQVA3w",
    thumbnail: "/src/img/solutions/icm/video3.webp",
    title: t("financial-institutions-solution.videoPlayer.videos.2.title"),
    description: t(
      "financial-institutions-solution.videoPlayer.videos.2.description",
    ),
    alt: t("financial-institutions-solution.videoPlayer.videos.2.alt"),
    badge: VideoBadge.Originals,
  },
  {
    id: "qLbcvtIAPnI",
    thumbnail: "/src/img/solutions/icm/video4.webp",
    title: t("financial-institutions-solution.videoPlayer.videos.3.title"),
    description: t(
      "financial-institutions-solution.videoPlayer.videos.3.description",
    ),
    alt: t("financial-institutions-solution.videoPlayer.videos.3.alt"),
    badge: VideoBadge.Event,
  },
];

export const LATEST_NEWS_QUERY = {
  categories: ["institutions", "finance", "payments"],
  tags: ["finance", "partner", "stable-coin"],
  limit: 6,
  excludeUrls: ["/news/solana-developer-platform"],
  fallbackImage: "/src/img/solutions/icm/og-image.webp",
  fallbackImageAspectRatio: "1200 / 630",
};

export const META = {
  seoImage:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F42125017ac2e4a3aaff6aa493ce03f19.png",
} as const;

export const HERO_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F84e49afac7964ab0a3c76d4ff3925ab5.png";

export const HERO_RIGHT_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F25036895114c42ccaac892e654deec29.png";

export const HERO_BUTTON = {
  hierarchy: "primary",
  size: "md",
  iconSize: "md",
  url: "https://solanafoundation.typeform.com/to/L2kwha4R",
} as const;

export const TRUSTBAR_LOGOS = [
  {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F5c6fc8c39c58451d98affc20a146b12c.png",
  },
  {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F4cc0f64bb0174fe391cf57f55804b3ed.png",
  },
  {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F42a0a41c209748e3bdf1c9665f74f106.png",
  },
  {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F5481701b94374979847f7eb91ecc5d52.png",
  },
  {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F4e0007131aff4485baba797c8fa292b5.png",
  },
];

export const TOOL_SPOTLIGHT_CARD = {
  type: "gradient",
  backgroundGradient: "purple",
  callToAction: {
    url: "https://solana.com/solutions/token-extensions",
  },
} as const;

export const SLIDER_CARDS = [
  {
    url: "",
    button: {
      hierarchy: "primary",
      size: "md",
      url: "https://solana.com/solutions/solana-permissioned-environments",
    },
  },
  {
    url: "",
    button: {
      hierarchy: "primary",
      size: "md",
      url: "https://solana.com/solutions/real-world-assets",
    },
  },
  {
    url: "",
    button: {
      size: "md",
      url: "https://solana.com/docs/advanced/state-compression",
    },
  },
  {
    url: "",
    button: {
      size: "md",
      url: "https://solana.com/solutions/digital-assets",
    },
  },
] as const;

export const SWITCHBACKS = [
  {
    image:
      "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F1ff168a741464471a4c41a5b4b2db567.png",
    button: {
      hierarchy: "primary",
      size: "md",
      iconSize: "md",
      url: "https://usa.visa.com/solutions/crypto/deep-dive-on-solana.html",
    },
  },
  {
    image:
      "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F8528809756d34e48938b87edd35b48f6.png",
    button: {
      hierarchy: "primary",
      size: "md",
      iconSize: "md",
      url: "https://stripe.com/blog/crypto-onramp",
      endIcon: "none",
    },
  },
  {
    image:
      "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fb91ca8e49b8f4a27b90df64e5195669d.png",
    button: {
      hierarchy: "primary",
      size: "md",
      iconSize: "md",
      url: "https://solana.com/news/case-study-pyth",
    },
  },
] as const;

export const CAROUSEL = {
  autoplay: true,
  autoplaySpeed: 4000,
} as const;

export const CAROUSEL_SLIDES = [
  {
    image: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F089d43086b98400d9ecec26f2ecb0236.png",
    },
    button: {
      hierarchy: "outline",
      size: "md",
      url: "https://solana.com/",
      endIcon: "arrow-up-right",
    },
  },
  {
    image: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fed97c305c7bb4b38b6f43d1a73af1075.png",
    },
    button: {
      hierarchy: "outline",
      size: "md",
      url: "https://solana.com/",
      endIcon: "arrow-up-right",
    },
  },
  {
    image: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F1d400a34fad94f6e9f9f3165e80096c1.png",
    },
    button: {
      hierarchy: "outline",
      size: "md",
      url: "https://solana.com/",
      endIcon: "arrow-up-right",
    },
  },
] as const;
