import { VideoBadge } from "@/components/solutions/video-grid.v2";
import { getCompanyLogoSrc } from "@workspace/ecosystem-data";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: getCompanyLogoSrc("morgan-stanley") ?? "",
    key: "morganStanley",
    href: "https://www.morganstanley.com/im/en-us/individual-investor/insights/press-release/msim-files-initial-registration-statements-for-two-cryptocurrency-etps.html",
    statValue: "$1.9T",
    statSource:
      "https://www.morganstanley.com/content/dam/msdotcom/en/about-us-2026ams/2026_Shareholder_Letter.pdf",
    statSourceNote: "Dec 2025",
  },
  {
    src: getCompanyLogoSrc("jpmorgan") ?? "",
    key: "jpmorgan",
    href: "https://www.jpmorgan.com/about-us/corporate-news/2025/jpmorgan-commercial-paper-issuance-solana-blockchain",
    statValue: "$50M",
    statSource:
      "https://news.bloomberglaw.com/crypto/jpmorgan-uses-solana-blockchain-for-galaxys-dollar-note-deal",
    statSourceNote: "Dec 2025",
  },
  {
    src: getCompanyLogoSrc("citi") ?? "",
    key: "citi",
    href: "https://www.citigroup.com/global/insights/supply-chain-financing-2026",
    statValue: "~24/7",
    statSource:
      "https://www.citigroup.com/global/news/press-release/2026/print/citi-supply-chain-financing-report-durable-global-trade-in-the-age-of-ai",
    statSourceNote: "Pilot potential · Feb 2026",
  },
  {
    src: getCompanyLogoSrc("societe-generale") ?? "",
    key: "societeGenerale",
    href: "https://www.sgforge.com/societe-generale-forge-solana-network/",
    statValue: "1:1",
    statSource: "https://www.sgforge.com/product/coinvertible/",
  },
  {
    src: getCompanyLogoSrc("state-street") ?? "",
    key: "stateStreet",
    href: "https://investors.statestreet.com/investor-news-events/press-releases/news-details/2025/State-Street-Investment-Management-and-Galaxy-Digital-Partner-to-Tokenize-Private-Liquidity-Fund-With-Planned-Seed-Investment-from-Ondo/default.aspx",
    statValue: "$50T+",
    statSource:
      "https://www.statestreet.com/web/about/our-story/annual-report/documents/2026-proxy-statement.pdf",
    statSourceNote: "2025 year end",
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
