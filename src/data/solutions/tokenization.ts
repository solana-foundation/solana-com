import { Blocks, Coins, HandCoins } from "lucide-react";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/solutions/icm/projects/franklin-templeton.webp",
    key: "franklinTempleton",
  },
  {
    src: "/src/img/solutions/icm/projects/r3.svg",
    key: "r3",
  },
  {
    src: "/src/img/solutions/icm/projects/bullish.svg",
    key: "bullish",
  },
  {
    src: "/src/img/solutions/icm/projects/apollo.svg",
    key: "apollo",
  },
];

export const LOGOS = [
  {
    src: "/src/img/solutions/icm/ecosystem/bullish.svg",
    alt: "Bullish",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/icm/ecosystem/r3-logo-vector.svg",
    alt: "R3",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/icm/ecosystem/Brevan_Howard_Logo.svg",
    alt: "Brevan Howard",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/icm/ecosystem/Apollo_Global_Management_logo.svg",
    alt: "Apollo Global Management",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/icm/ecosystem/Vaneck.svg",
    alt: "Vaneck",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/icm/ecosystem/franklin-templeton.webp",
    alt: "Franklin Templeton",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/icm/ecosystem/hamilton-lane.webp",
    alt: "Hamilton Lane",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/icm/ecosystem/societe-general.webp",
    alt: "Societe Generale",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/icm/ecosystem/BlackRock.webp",
    alt: "Blackrock",
    bg: "bg-white",
  },
];

export const PRODUCTS = [
  {
    key: "0",
    Icon: Coins,
    color: "text-emerald-400 bg-emerald-900/30",
    href: "/solutions/real-world-assets",
  },
  {
    key: "1",
    Icon: Blocks,
    color: "text-indigo-400 bg-indigo-900/30",
    href: "/solutions/token-extensions",
  },
  {
    key: "2",
    Icon: HandCoins,
    color: "text-cyan-400 bg-cyan-900/30",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "gYOTFfy5n3E",
    thumbnail: "/src/img/solutions/icm/video1.webp",
    title: t("icm.videoPlayer.videos.0.title"),
    description: t("icm.videoPlayer.videos.0.description"),
    alt: t("icm.videoPlayer.videos.0.alt"),
  },
  {
    id: "8AGUcNIV5oo",
    thumbnail: "/src/img/solutions/icm/video2.webp",
    title: t("icm.videoPlayer.videos.1.title"),
    description: t("icm.videoPlayer.videos.1.description"),
    alt: t("icm.videoPlayer.videos.1.alt"),
  },
  {
    id: "PC3N-qQVA3w",
    thumbnail: "/src/img/solutions/icm/video3.webp",
    title: t("icm.videoPlayer.videos.2.title"),
    description: t("icm.videoPlayer.videos.2.description"),
    alt: t("icm.videoPlayer.videos.2.alt"),
  },
  {
    id: "qLbcvtIAPnI",
    thumbnail: "/src/img/solutions/icm/video4.webp",
    title: t("icm.videoPlayer.videos.3.title"),
    description: t("icm.videoPlayer.videos.3.description"),
    alt: t("icm.videoPlayer.videos.3.alt"),
  },
  {
    id: "s5NThuOmkbA",
    thumbnail: "/src/img/solutions/icm/video5.webp",
    title: t("icm.videoPlayer.videos.4.title"),
    description: t("icm.videoPlayer.videos.4.description"),
    alt: t("icm.videoPlayer.videos.4.alt"),
  },
  {
    id: "yC6nJdsDb6s",
    thumbnail: "/src/img/solutions/icm/video6.webp",
    title: t("icm.videoPlayer.videos.5.title"),
    description: t("icm.videoPlayer.videos.5.description"),
    alt: t("icm.videoPlayer.videos.5.alt"),
  },
];
