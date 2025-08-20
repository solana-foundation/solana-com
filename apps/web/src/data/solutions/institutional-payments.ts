import { Blocks, Coins, HandCoins } from "lucide-react";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/solutions/institutional-payments/ecosystem/100x100.svg",
    key: "worldpay",
  },
  {
    src: "/src/img/solutions/institutional-payments/ecosystem/100x100.svg",
    key: "visa",
  },
  {
    src: "/src/img/solutions/institutional-payments/ecosystem/100x100.svg",
    key: "fiserv",
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
    Icon: HandCoins,
    color: "text-cyan-400 bg-cyan-900/30",
  },
  {
    key: "3",
    Icon: HandCoins,
    color: "text-rose-400 bg-rose-900/30",
  },
  {
    key: "4",
    Icon: HandCoins,
    color: "text-orange-400 bg-orange-900/30",
  },
  {
    key: "5",
    Icon: HandCoins,
    color: "text-amber-400 bg-amber-900/30",
    href: "/wallets",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "QI61R2OavU",
    thumbnail: "/src/img/solutions/institutional-payments/video1.webp",
    title: t("institutional-payments.videoPlayer.videos.0.title"),
    description: t("institutional-payments.videoPlayer.videos.0.description"),
    alt: t("institutional-payments.videoPlayer.videos.0.alt"),
  },
  {
    id: "Yx6O8WEF8kQ",
    thumbnail: "/src/img/solutions/institutional-payments/video2.webp",
    title: t("institutional-payments.videoPlayer.videos.1.title"),
    description: t("institutional-payments.videoPlayer.videos.1.description"),
    alt: t("institutional-payments.videoPlayer.videos.1.alt"),
  },
  {
    id: "VQDvDpj2pvs",
    thumbnail: "/src/img/solutions/institutional-payments/video3.webp",
    title: t("institutional-payments.videoPlayer.videos.2.title"),
    description: t("institutional-payments.videoPlayer.videos.2.description"),
    alt: t("institutional-payments.videoPlayer.videos.2.alt"),
  },
];
