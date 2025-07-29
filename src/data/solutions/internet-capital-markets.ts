import { Blocks, Coins, HandCoins } from "lucide-react";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/solutions/depin/helium.png",
    key: "helium",
    bg: "#181F24",
  },
  {
    src: "/src/img/solutions/depin/render.png",
    key: "render",
    bg: "#FF2D2E",
  },
  {
    src: "/src/img/solutions/depin/hivemapper.png",
    key: "hivemapper",
    bg: "#4B6FFF",
  },
  {
    src: "/src/img/solutions/depin/grass.png",
    key: "grass",
    bg: "#B6FF3A",
  },
  {
    src: "/src/img/solutions/depin/geodnet.png",
    key: "geodnet",
    bg: "#000000",
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
];

export const PRODUCTS = [
  {
    key: "0",
    Icon: Coins,
    color: "text-emerald-400 bg-emerald-900/30",
    href: "#",
  },
  {
    key: "1",
    Icon: Blocks,
    color: "text-indigo-400 bg-indigo-900/30",
    href: "#",
  },
  {
    key: "2",
    Icon: HandCoins,
    color: "text-cyan-400 bg-cyan-900/30",
    href: "#",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "IpWVxL4V4Oc",
    thumbnail: "/src/img/solutions/icm/video1.webp",
    title: t("icm.videoPlayer.videos.0.title"),
    description: t("icm.videoPlayer.videos.0.description"),
    alt: t("icm.videoPlayer.videos.0.alt"),
  },
  {
    id: "PzNXP0w4xqU",
    thumbnail: "/src/img/solutions/icm/video2.webp",
    title: t("icm.videoPlayer.videos.1.title"),
    description: t("icm.videoPlayer.videos.1.description"),
    alt: t("icm.videoPlayer.videos.1.alt"),
  },
  {
    id: "VaBJu3dXpKk",
    thumbnail: "/src/img/solutions/icm/video3.webp",
    title: t("icm.videoPlayer.videos.2.title"),
    description: t("icm.videoPlayer.videos.2.description"),
    alt: t("icm.videoPlayer.videos.2.alt"),
  },
];
