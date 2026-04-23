import { VideoBadge } from "@/components/solutions/video-grid.v2";
import { getCompanyLogoSrc } from "@workspace/ecosystem-data";
import { Formats, TranslationValues } from "next-intl";
import {
  ArrowsIcon,
  ClockIcon,
  LedgerIcon,
  MoneyHandIcon,
  TokenIcon,
  UsersIcon,
} from "@solana-com/ui-chrome/icons";

export const PROJECTS = [
  {
    src: getCompanyLogoSrc("morgan-stanley") ?? "",
    key: "morganStanley",
  },
  {
    src: getCompanyLogoSrc("jpmorgan") ?? "",
    key: "jpmorgan",
  },
  {
    src: getCompanyLogoSrc("citi") ?? "",
    key: "citi",
  },
  {
    src: getCompanyLogoSrc("societe-generale") ?? "",
    key: "societeGenerale",
  },
  {
    src: getCompanyLogoSrc("state-street") ?? "",
    key: "stateStreet",
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

export const PRODUCTS = [
  {
    key: "0",
    Icon: TokenIcon,
    href: "/solutions/token-extensions",
  },
  {
    key: "1",
    Icon: UsersIcon,
    href: "/solutions/solana-permissioned-environments",
  },
  {
    key: "2",
    Icon: MoneyHandIcon,
    href: "/solutions/real-world-assets",
  },
  {
    key: "3",
    Icon: ArrowsIcon,
  },
  {
    key: "4",
    Icon: ClockIcon,
  },
  {
    key: "5",
    Icon: LedgerIcon,
  },
];

export const USE_CASES = [
  {
    key: "0",
  },
  {
    key: "1",
  },
  {
    key: "2",
  },
  {
    key: "3",
  },
  {
    key: "4",
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
  limit: 4,
  excludeUrls: ["/news/solana-developer-platform"],
  fallbackImage: "/src/img/solutions/icm/og-image.webp",
};
