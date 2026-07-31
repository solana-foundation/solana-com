import { VideoBadge } from "@/components/solutions/video-grid.v2";
import type { SolutionNewsQuery } from "@/lib/media/solution-news";
import { getCompanyLogoSrc } from "@workspace/ecosystem-data";
import {
  BadgeCheck,
  CandlestickChart,
  DatabaseZap,
  Gem,
  Landmark,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: getCompanyLogoSrc("jupiter", { theme: "dark" }) ?? "",
    key: "jupiter",
    href: "/news/solana-ecosystem-roundup-april-2026",
  },
  {
    src: getCompanyLogoSrc("kamino", { theme: "dark" }) ?? "",
    key: "kamino",
    href: "/news/state-of-solana-february-2026",
  },
  {
    src: getCompanyLogoSrc("raydium", { theme: "dark" }) ?? "",
    key: "raydium",
    href: "/news/case-study-xstocks",
  },
  {
    src: getCompanyLogoSrc("loopscale", { theme: "dark" }) ?? "",
    key: "loopscale",
    href: "/news/solana-ecosystem-roundup-march-2026",
  },
  {
    src: getCompanyLogoSrc("franklin-templeton") ?? "",
    key: "franklinTempleton",
    href: "/news/state-of-solana-breakpoint-2024",
  },
  {
    src: getCompanyLogoSrc("blackrock") ?? "",
    key: "blackrock",
    href: "/news/state-of-solana-february-2026",
  },
  {
    src: getCompanyLogoSrc("apollo") ?? "",
    key: "apollo",
    href: "/news/solana-ecosystem-roundup-march-2026",
  },
];

export const LOGOS = [
  {
    src: getCompanyLogoSrc("jupiter", { theme: "dark" }) ?? "",
    alt: "Jupiter",
  },
  {
    src: getCompanyLogoSrc("kamino", { theme: "dark" }) ?? "",
    alt: "Kamino",
  },
  {
    src: getCompanyLogoSrc("raydium", { theme: "dark" }) ?? "",
    alt: "Raydium",
  },
  {
    src: getCompanyLogoSrc("loopscale", { theme: "dark" }) ?? "",
    alt: "Loopscale",
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
    src: getCompanyLogoSrc("apollo") ?? "",
    alt: "Apollo",
  },
  {
    src: getCompanyLogoSrc("hamilton-lane") ?? "",
    alt: "Hamilton Lane",
  },
  {
    src: getCompanyLogoSrc("brevan-howard") ?? "",
    alt: "Brevan Howard",
  },
];

export const PRODUCTS = [
  {
    key: "equities",
    Icon: CandlestickChart,
    href: "/news/case-study-xstocks",
  },
  {
    key: "etfs",
    Icon: Layers3,
    href: "/news/ondo-global-markets-tokenized-stocks-etfs-solana",
  },
  {
    key: "metals",
    Icon: Gem,
    href: "/news/matrixdock-xaum-launch",
  },
  {
    key: "treasuries",
    Icon: Landmark,
    href: "/news/wisdomtree-tokenization-solana",
  },
  {
    key: "marketData",
    Icon: DatabaseZap,
    href: "/news/inside-tokens-xyz",
  },
];

export const COMPLIANCE = [
  {
    key: "tokenExtensions",
    Icon: BadgeCheck,
    href: "/solutions/token-extensions",
  },
  {
    key: "permissioned",
    Icon: ShieldCheck,
    href: "/solutions/solana-permissioned-environments",
  },
  {
    key: "identity",
    Icon: UserCheck,
    href: "/solutions/token-extensions",
  },
  {
    key: "confidential",
    Icon: LockKeyhole,
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
