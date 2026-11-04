import { VideoBadge } from "@/components/solutions/video-grid.v2";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/bonk.svg",
    key: "bonk",
    metric: "consumer.bonk.holders",
  },
  {
    src: "/src/img/logos-eco/pudgy-penguins.webp",
    key: "pudgyPenguins",
    metric: "consumer.pudgy-penguins.views",
  },
  {
    src: "/src/img/logos-eco/pump.webp",
    key: "pump",
    metric: "consumer.pump.token-sale-raise",
  },
  {
    src: "/src/img/logos-eco/magic-eden.svg",
    key: "magicEden",
    metric: "consumer.magic-eden.collectibles-volume",
  },
  {
    src: "/src/img/logos-eco/axiom.svg",
    key: "axiom",
    metric: "consumer.axiom.revenue-first-4-months",
  },
] as const;

/** Registry keys for the hero stats, in display order. */
export const HERO_METRICS = [
  "consumer.quarterly-active-wallets",
  "consumer.fee-volatility-ratio",
  "apps.revenue-12m",
  "consumer.launchpad-tokens-2025",
] as const;

export const LOGOS = [
  {
    src: "/src/img/logos-eco/moonshot.webp",
    alt: "Moonshot",
  },
  {
    src: "/src/img/logos-eco/timefun.svg",
    alt: "Timefun",
  },
  {
    src: "/src/img/logos-eco/believe.svg",
    alt: "Believe",
  },
  {
    src: "/src/img/logos-eco/photon.webp",
    alt: "Photon",
  },
  {
    src: "/src/img/logos-eco/trojan.svg",
    alt: "Trojan",
  },
  {
    src: "/src/img/logos-eco/tapestry.svg",
    alt: "Tapestry",
  },
  {
    src: "/src/img/logos-eco/tensor.svg",
    alt: "Tensor",
  },
  {
    src: "/src/img/logos-eco/mallow.svg",
    alt: "Mallow",
  },
  {
    src: "/src/img/logos-eco/audius.svg",
    alt: "Audius",
  },
  {
    src: "/src/img/logos-eco/exchangeart.svg",
    alt: "Exchange art",
  },
  {
    src: "/src/img/logos-eco/drip.svg",
    alt: "Drip",
  },
  {
    src: "/src/img/logos-eco/claynosaurz.svg",
    alt: "Claynosaurz",
  },
];

export const PRODUCTS = [
  {
    key: "0",
  },
  {
    key: "3",
  },
  {
    key: "1",
  },
  {
    key: "4",
    href: "https://docs.dialect.to",
  },
  {
    key: "2",
  },
  {
    key: "5",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "wIkhSLDVejc",
    thumbnail: "/src/img/solutions/consumer/videos/video1.webp",
    title: t("consumer.videoPlayer.videos.0.title"),
    description: t("consumer.videoPlayer.videos.0.description"),
    alt: t("consumer.videoPlayer.videos.0.alt"),
    badge: VideoBadge.Podcast,
  },
  {
    id: "_x0BAhUd4qI",
    thumbnail: "/src/img/solutions/consumer/videos/video2.webp",
    title: t("consumer.videoPlayer.videos.1.title"),
    description: t("consumer.videoPlayer.videos.1.description"),
    alt: t("consumer.videoPlayer.videos.1.alt"),
    badge: VideoBadge.Interview,
  },
  {
    id: "4zK8ZI8lJIs",
    thumbnail: "/src/img/solutions/consumer/videos/video3.webp",
    title: t("consumer.videoPlayer.videos.2.title"),
    description: t("consumer.videoPlayer.videos.2.description"),
    alt: t("consumer.videoPlayer.videos.2.alt"),
    badge: VideoBadge.Originals,
  },
  {
    id: "VaBJu3dXpKk",
    thumbnail: "/src/img/solutions/consumer/videos/video4.webp",
    title: t("consumer.videoPlayer.videos.3.title"),
    description: t("consumer.videoPlayer.videos.3.description"),
    alt: t("consumer.videoPlayer.videos.3.alt"),
    badge: VideoBadge.Event,
  },
];
