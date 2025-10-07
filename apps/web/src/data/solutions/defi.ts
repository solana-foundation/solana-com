import { VideoBadge } from "@/components/solutions/video-grid.v2";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/jupiter.svg",
    key: "jupiter",
  },
  {
    src: "/src/img/logos-eco/kamino.svg",
    key: "kamino",
  },
  {
    src: "/src/img/logos-eco/drift.svg",
    key: "drift",
  },
  {
    src: "/src/img/logos-eco/raydium.svg",
    key: "raydium",
  },
  {
    src: "/src/img/logos-eco/exponent.svg",
    key: "exponent",
  },
];

export const LOGOS = [
  {
    src: "/src/img/logos-eco/hamilton-lane.webp",
    alt: "Hamilton Lane",
  },
  {
    src: "/src/img/logos-eco/blackrock.png",
    alt: "Blackrock",
  },
  {
    src: "/src/img/logos-eco/brevan-howard.png",
    alt: "Brevan Howard",
  },
  {
    src: "/src/img/logos-eco/societe-generale.png",
    alt: "Societe Generale",
  },
  {
    src: "/src/img/logos-eco/vaneck.png",
    alt: "Vaneck",
  },
];

export const PRODUCTS = [
  {
    key: "0",
    href: "/solutions/real-world-assets",
  },
  {
    key: "1",
    href: "/solutions/token-extensions",
  },
  {
    key: "2",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "-yoNJow6WjI",
    thumbnail: "/src/img/solutions/defi/videos/video1.webp",
    title: t("defi.videoPlayer.videos.0.title"),
    description: t("defi.videoPlayer.videos.0.description"),
    alt: t("defi.videoPlayer.videos.0.alt"),
    badge: VideoBadge.Podcast,
  },
  {
    id: "KBOenkEkesU",
    thumbnail: "/src/img/solutions/defi/videos/video2.webp",
    title: t("defi.videoPlayer.videos.1.title"),
    description: t("defi.videoPlayer.videos.1.description"),
    alt: t("defi.videoPlayer.videos.1.alt"),
    badge: VideoBadge.Interview,
  },
  {
    id: "avj0SCFL5nI",
    thumbnail: "/src/img/solutions/defi/videos/video3.webp",
    title: t("defi.videoPlayer.videos.2.title"),
    description: t("defi.videoPlayer.videos.2.description"),
    alt: t("defi.videoPlayer.videos.2.alt"),
    badge: VideoBadge.Originals,
  },
  {
    id: "QXAshrNDBVY",
    thumbnail: "/src/img/solutions/defi/videos/video4.webp",
    title: t("defi.videoPlayer.videos.3.title"),
    description: t("defi.videoPlayer.videos.3.description"),
    alt: t("defi.videoPlayer.videos.3.alt"),
    badge: VideoBadge.Event,
  },
];
