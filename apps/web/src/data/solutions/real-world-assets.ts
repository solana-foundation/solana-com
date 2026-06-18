import { VideoBadge } from "@/components/solutions/video-grid.v2";
import type { SolutionNewsQuery } from "@/lib/media/solution-news";
import {
  ActivityIcon,
  ChartIcon,
  CoinsIcon,
  GlobeIcon,
  LedgerIcon,
  TokenIcon,
  UsersIcon,
} from "@solana-com/ui-chrome/icons";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/franklin-templeton.webp",
    key: "franklinTempleton",
    href: "https://www.tokens.xyz/benji",
  },
  {
    src: "/src/img/logos-eco/vaneck.png",
    key: "vaneck",
    href: "https://www.tokens.xyz/vbill",
  },
  {
    src: "/src/img/logos-eco/blackrock.png",
    key: "blackrock",
    href: "https://www.tokens.xyz/ishares-core-us-aggregate-bond-etf",
  },
  {
    src: "/src/img/logos-eco/apollo.webp",
    key: "apollo",
    href: "https://securitize.io/",
  },
  {
    src: "/src/img/logos-eco/hamilton-lane.webp",
    key: "hamiltonLane",
    href: "https://securitize.io/",
  },
  {
    src: "/src/img/logos-eco/jupiter.svg",
    key: "jupiter",
    href: "https://jup.ag",
  },
  {
    src: "/src/img/logos-eco/kamino.svg",
    key: "kamino",
    href: "https://app.kamino.finance",
  },
];

export const LOGOS = [
  {
    src: "/src/img/logos-eco/franklin-templeton.webp",
    alt: "Franklin Templeton",
  },
  {
    src: "/src/img/logos-eco/vaneck.png",
    alt: "VanEck",
  },
  {
    src: "/src/img/logos-eco/blackrock.png",
    alt: "BlackRock",
  },
  {
    src: "/src/img/logos-eco/apollo.webp",
    alt: "Apollo",
  },
  {
    src: "/src/img/logos-eco/hamilton-lane.webp",
    alt: "Hamilton Lane",
  },
  {
    src: "/src/img/logos-eco/brevan-howard.png",
    alt: "Brevan Howard",
  },
  {
    src: "/src/img/logos-eco/jupiter.svg",
    alt: "Jupiter",
  },
  {
    src: "/src/img/logos-eco/kamino.svg",
    alt: "Kamino",
  },
];

export const PRODUCTS = [
  {
    key: "treasuries",
    Icon: LedgerIcon,
    href: "https://www.tokens.xyz/?category=rwas",
  },
  {
    key: "etfs",
    Icon: ChartIcon,
    href: "https://www.tokens.xyz/?category=etfs",
  },
  {
    key: "metals",
    Icon: CoinsIcon,
    href: "https://www.tokens.xyz/?category=metals",
  },
  {
    key: "stocks",
    Icon: ChartIcon,
    href: "https://www.tokens.xyz/?category=stocks",
  },
  {
    key: "api",
    Icon: TokenIcon,
    href: "https://www.tokens.xyz/assets-api",
  },
];

export const COMPLIANCE = [
  {
    key: "tokenExtensions",
    Icon: LedgerIcon,
    href: "/solutions/token-extensions",
  },
  {
    key: "permissioned",
    Icon: GlobeIcon,
    href: "/solutions/solana-permissioned-environments",
  },
  {
    key: "identity",
    Icon: UsersIcon,
    href: "/solutions/token-extensions",
  },
  {
    key: "confidential",
    Icon: ActivityIcon,
    href: "/solutions/token-extensions",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "PC3N-qQVA3w",
    thumbnail: "/src/img/solutions/icm/video3.webp",
    title: t("real-world-assets-solution.videoPlayer.videos.0.title"),
    description: t(
      "real-world-assets-solution.videoPlayer.videos.0.description",
    ),
    alt: t("real-world-assets-solution.videoPlayer.videos.0.alt"),
    badge: VideoBadge.Originals,
  },
  {
    id: "gYOTFfy5n3E",
    thumbnail: "/src/img/solutions/icm/video1.webp",
    title: t("real-world-assets-solution.videoPlayer.videos.1.title"),
    description: t(
      "real-world-assets-solution.videoPlayer.videos.1.description",
    ),
    alt: t("real-world-assets-solution.videoPlayer.videos.1.alt"),
    badge: VideoBadge.Podcast,
  },
  {
    id: "qLbcvtIAPnI",
    thumbnail: "/src/img/solutions/icm/video4.webp",
    title: t("real-world-assets-solution.videoPlayer.videos.2.title"),
    description: t(
      "real-world-assets-solution.videoPlayer.videos.2.description",
    ),
    alt: t("real-world-assets-solution.videoPlayer.videos.2.alt"),
    badge: VideoBadge.Event,
  },
  {
    id: "8AGUcNIV5oo",
    thumbnail: "/src/img/solutions/icm/video2.webp",
    title: t("real-world-assets-solution.videoPlayer.videos.3.title"),
    description: t(
      "real-world-assets-solution.videoPlayer.videos.3.description",
    ),
    alt: t("real-world-assets-solution.videoPlayer.videos.3.alt"),
    badge: VideoBadge.Interview,
  },
];

export const LATEST_NEWS_QUERY: SolutionNewsQuery = {
  categories: ["institutions"],
  limit: 6,
  includePosts: true,
  includeLinks: true,
  fallbackImage: "/src/img/solutions/icm/og-image.webp",
  fallbackImageAspectRatio: "1200 / 630",
};
