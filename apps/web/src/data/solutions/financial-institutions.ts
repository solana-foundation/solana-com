import { VideoBadge } from "@/components/solutions/video-grid.v2";
import { getCompanyLogoSrc } from "@workspace/ecosystem-data";
import { Formats, TranslationValues } from "next-intl";

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
    href: "/solutions/token-extensions",
  },
  {
    key: "1",
    href: "/solutions/solana-permissioned-environments",
  },
  {
    key: "2",
    href: "/solutions/real-world-assets",
  },
  {
    key: "3",
  },
  {
    key: "4",
  },
  {
    key: "5",
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

export const LATEST_NEWS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "0",
    title: t("financial-institutions-solution.news.items.0.title"),
    image:
      "/uploads/posts/webinar-recap-corporate-treasury-onchain/heroImage.webp",
    link: "/news/webinar-recap-corporate-treasury-onchain",
    date: "2026-03-17",
  },
  {
    id: "1",
    title: t("financial-institutions-solution.news.items.1.title"),
    image: "/uploads/posts/wisdomtree-tokenization-solana/wisdom-tree.webp",
    link: "/news/wisdomtree-tokenization-solana",
    date: "2026-01-28",
  },
  {
    id: "2",
    title: t("financial-institutions-solution.news.items.2.title"),
    image:
      "/uploads/builder/solana-fireblocks-institutional-treasury-infrastructure/solana-fireblocks.webp",
    link: "/news/solana-fireblocks-institutional-treasury-infrastructure",
    date: "2026-01-20",
  },
  {
    id: "3",
    title: t("financial-institutions-solution.news.items.3.title"),
    image:
      "/uploads/posts/blog-internet-capital-markets/8003844394cc4a50831868eb49830ec2.webp",
    link: "/news/blog-internet-capital-markets",
    date: "2025-08-21",
  },
];
