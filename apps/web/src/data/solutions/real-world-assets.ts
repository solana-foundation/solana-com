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
    src: "/src/img/logos-eco/jupiter.svg",
    key: "jupiter",
    href: "/news/solana-ecosystem-roundup-april-2026",
  },
  {
    src: "/src/img/logos-eco/kamino.svg",
    key: "kamino",
    href: "/news/state-of-solana-february-2026",
  },
  {
    src: "/src/img/logos-eco/raydium.svg",
    key: "raydium",
    href: "/news/case-study-xstocks",
  },
  {
    src: "/src/img/logos-eco/loopscale.svg",
    key: "loopscale",
    href: "/news/solana-ecosystem-roundup-march-2026",
  },
  {
    src: "/src/img/logos-eco/franklin-templeton.webp",
    key: "franklinTempleton",
    href: "/news/state-of-solana-breakpoint-2024",
  },
  {
    src: "/src/img/logos-eco/blackrock.png",
    key: "blackrock",
    href: "/news/state-of-solana-february-2026",
  },
  {
    src: "/src/img/logos-eco/apollo.webp",
    key: "apollo",
    href: "/news/solana-ecosystem-roundup-march-2026",
  },
  {
    src: "/src/img/logos-eco/hamilton-lane.webp",
    key: "hamiltonLane",
    href: "/news/rwas-libre-on-solana",
  },
];

export const LOGOS = [
  {
    src: "/src/img/logos-eco/jupiter.svg",
    alt: "Jupiter",
  },
  {
    src: "/src/img/logos-eco/kamino.svg",
    alt: "Kamino",
  },
  {
    src: "/src/img/logos-eco/raydium.svg",
    alt: "Raydium",
  },
  {
    src: "/src/img/logos-eco/loopscale.svg",
    alt: "Loopscale",
  },
  {
    src: "/src/img/logos-eco/franklin-templeton.webp",
    alt: "Franklin Templeton",
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
];

export const PRODUCTS = [
  {
    key: "equities",
    Icon: ChartIcon,
    href: "/news/case-study-xstocks",
  },
  {
    key: "etfs",
    Icon: ChartIcon,
    href: "/news/ondo-global-markets-tokenized-stocks-etfs-solana",
  },
  {
    key: "metals",
    Icon: CoinsIcon,
    href: "/news/matrixdock-xaum-launch",
  },
  {
    key: "treasuries",
    Icon: LedgerIcon,
    href: "/news/wisdomtree-tokenization-solana",
  },
  {
    key: "marketData",
    Icon: TokenIcon,
    href: "/news/inside-tokens-xyz",
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
