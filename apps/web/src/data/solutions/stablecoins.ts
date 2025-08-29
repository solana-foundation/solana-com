import { Blocks, Coins, Fingerprint, Landmark } from "lucide-react";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/paxos.svg",
    key: "paxos",
  },
  {
    src: "/src/img/logos-eco/circle.svg",
    key: "circle",
  },
  {
    src: "/src/img/logos-eco/fiserv.svg",
    key: "fiserv",
  },
  {
    src: "/src/img/logos-eco/paypal.svg",
    key: "paypal",
  },
];

export const LOGOS = [];

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
    Icon: Fingerprint,
    color: "text-cyan-400 bg-cyan-900/30",
  },
  {
    key: "3",
    Icon: Landmark,
    color: "text-rose-400 bg-rose-900/30",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "otCLNXJWFp4",
    thumbnail: "/src/img/solutions/stablecoins/video1.webp",
    title: t("stablecoins.videoPlayer.videos.0.title"),
    description: t("stablecoins.videoPlayer.videos.0.description"),
    alt: t("stablecoins.videoPlayer.videos.0.alt"),
  },
  {
    id: "-PEwb6bMawY",
    thumbnail: "/src/img/solutions/stablecoins/video2.webp",
    title: t("stablecoins.videoPlayer.videos.1.title"),
    description: t("stablecoins.videoPlayer.videos.1.description"),
    alt: t("stablecoins.videoPlayer.videos.1.alt"),
  },
  {
    id: "Cm5QALTvl9s",
    thumbnail: "/src/img/solutions/stablecoins/video3.webp",
    title: t("stablecoins.videoPlayer.videos.2.title"),
    description: t("stablecoins.videoPlayer.videos.2.description"),
    alt: t("stablecoins.videoPlayer.videos.2.alt"),
  },
  {
    id: "wiuwMma79zI",
    thumbnail: "/src/img/solutions/stablecoins/video4.webp",
    title: t("stablecoins.videoPlayer.videos.3.title"),
    description: t("stablecoins.videoPlayer.videos.3.description"),
    alt: t("stablecoins.videoPlayer.videos.3.alt"),
  },
];
