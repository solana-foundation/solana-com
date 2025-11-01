import { VideoBadge } from "@/components/solutions/video-grid.v2";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/western-union.svg",
    key: "western-union",
  },
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
    href: "/solutions/tokenization",
  },
  {
    key: "3",
  },
  {
    key: "1",
    href: "/solutions/token-extensions",
  },
  {
    key: "4",
  },
  {
    key: "2",
    href: "/solutions/stablecoins",
  },
  {
    key: "5",
    href: "/wallets",
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
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "-QI61R2OavU",
    thumbnail: "/src/img/solutions/institutional-payments/videos/video1.webp",
    title: t("institutional-payments.videoPlayer.videos.0.title"),
    description: t("institutional-payments.videoPlayer.videos.0.description"),
    alt: t("institutional-payments.videoPlayer.videos.0.alt"),
    badge: VideoBadge.Podcast,
  },
  {
    id: "Yx6O8WEF8kQ",
    thumbnail: "/src/img/solutions/institutional-payments/videos/video2.webp",
    title: t("institutional-payments.videoPlayer.videos.1.title"),
    description: t("institutional-payments.videoPlayer.videos.1.description"),
    alt: t("institutional-payments.videoPlayer.videos.1.alt"),
    badge: VideoBadge.Interview,
  },
  {
    id: "VQDvDpj2pvs",
    thumbnail: "/src/img/solutions/institutional-payments/videos/video3.webp",
    title: t("institutional-payments.videoPlayer.videos.2.title"),
    description: t("institutional-payments.videoPlayer.videos.2.description"),
    alt: t("institutional-payments.videoPlayer.videos.2.alt"),
    badge: VideoBadge.Originals,
  },
];
