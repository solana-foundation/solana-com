import {
  ArrowRightLeft,
  Blocks,
  Coins,
  HandCoins,
  Landmark,
  CreditCard,
  PiggyBank,
  Globe,
  Banknote,
  Wallet,
  Fuel,
  Radar,
} from "lucide-react";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/worldpay.svg",
    key: "worldpay",
  },
  {
    src: "/src/img/logos-eco/visa.svg",
    key: "visa",
  },
  {
    src: "/src/img/logos-eco/fiserv.svg",
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
    href: "/solutions/stablecoins",
  },
  {
    key: "3",
    Icon: Radar,
    color: "text-indigo-400 bg-indigo-900/30",
  },
  {
    key: "4",
    Icon: Fuel,
    color: "text-cyan-400 bg-cyan-900/30",
  },
  {
    key: "5",
    Icon: Wallet,
    color: "text-emerald-400 bg-emerald-900/30",
    href: "/wallets",
  },
];

export const USE_CASES = [
  {
    key: "0",
    Icon: ArrowRightLeft,
    color: "bg-violet-500 text-black",
  },
  {
    key: "1",
    Icon: CreditCard,
    color: "bg-cyan-400 text-black",
  },
  {
    Icon: Landmark,
    color: "bg-green-400 text-green-100",
  },
  {
    key: "2",
    Icon: PiggyBank,
    color: "bg-green-400 text-black",
  },
  {
    Icon: Banknote,
    color: "bg-cyan-400 text-orange-100",
  },
  {
    key: "3",
    Icon: Globe,
    color: "bg-violet-500 text-black",
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
