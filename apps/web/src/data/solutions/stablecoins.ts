import { VideoBadge } from "@/components/solutions/video-grid.v2";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/worldpay.svg",
    key: "worldpay",
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
    href: "/solutions/tokenization",
  },
  {
    key: "2",
  },
  {
    key: "1",
    href: "/solutions/token-extensions",
  },
  {
    key: "3",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "otCLNXJWFp4",
    thumbnail: "/src/img/solutions/stablecoins/videos/video1.webp",
    title: t("stablecoins.videoPlayer.videos.0.title"),
    description: t("stablecoins.videoPlayer.videos.0.description"),
    alt: t("stablecoins.videoPlayer.videos.0.alt"),
    badge: VideoBadge.Interview,
  },
  {
    id: "-PEwb6bMawY",
    thumbnail: "/src/img/solutions/stablecoins/videos/video2.webp",
    title: t("stablecoins.videoPlayer.videos.1.title"),
    description: t("stablecoins.videoPlayer.videos.1.description"),
    alt: t("stablecoins.videoPlayer.videos.1.alt"),
    badge: VideoBadge.Originals,
  },
  {
    id: "Cm5QALTvl9s",
    thumbnail: "/src/img/solutions/stablecoins/videos/video3.webp",
    title: t("stablecoins.videoPlayer.videos.2.title"),
    description: t("stablecoins.videoPlayer.videos.2.description"),
    alt: t("stablecoins.videoPlayer.videos.2.alt"),
    badge: VideoBadge.Event,
  },
  {
    id: "wiuwMma79zI",
    thumbnail: "/src/img/solutions/stablecoins/videos/video4.webp",
    title: t("stablecoins.videoPlayer.videos.3.title"),
    description: t("stablecoins.videoPlayer.videos.3.description"),
    alt: t("stablecoins.videoPlayer.videos.3.alt"),
    badge: VideoBadge.Event,
  },
];
