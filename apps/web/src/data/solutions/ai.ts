import { VideoBadge } from "@/components/solutions/video-grid.v2";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/inference.svg",
    key: "inference",
  },
  {
    src: "/src/img/logos-eco/nous-research.webp",
    key: "nousResearch",
  },
  {
    src: "/src/img/logos-eco/grass.webp",
    key: "grass",
  },
  {
    src: "/src/img/logos-eco/gradient.svg",
    key: "gradient",
  },
  {
    src: "/src/img/logos-eco/elizaos.svg",
    key: "eliza",
  },
];

export const LOGOS = [
  {
    src: "/src/img/logos-eco/nosana.svg",
    alt: "Nosana",
  },
  {
    src: "/src/img/logos-eco/ionet.svg",
    alt: "IO Net",
  },
  {
    src: "/src/img/logos-eco/render.webp",
    alt: "Render Network",
  },
  {
    src: "/src/img/logos-eco/synesis.svg",
    alt: "Synesis",
  },
  {
    src: "/src/img/logos-eco/crossmint.svg",
    alt: "Crossmint",
  },
  {
    src: "/src/img/logos-eco/publicai.svg",
    alt: "Public AI",
  },
  {
    src: "/src/img/logos-eco/unifai.svg",
    alt: "Unif AI",
  },
  {
    src: "/src/img/logos-eco/poof.webp",
    alt: "Poof",
  },
  {
    src: "/src/img/logos-eco/cambrian.webp",
    alt: "Cambrian",
  },
  {
    src: "/src/img/logos-eco/yupp.webp",
    alt: "Yupp",
  },
  {
    src: "/src/img/logos-eco/coral-protocol.webp",
    alt: "Coral Protocol",
  },
  {
    src: "/src/img/logos-eco/pinai.webp",
    alt: "Pin AI",
  },
];

export const PRODUCTS = [
  {
    key: "0",
    href: "https://mcp.solana.com",
  },
  {
    key: "2",
    href: "https://github.com/sendaifun/solana-agent-kit",
  },
  {
    key: "1",
    href: "https://www.crossmint.com/solutions/ai-agents",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "CfilmOMAd0Q",
    thumbnail: "/src/img/solutions/ai/videos/video1.webp",
    title: t("ai-solution.videoPlayer.videos.0.title"),
    description: t("ai-solution.videoPlayer.videos.0.description"),
    alt: t("ai-solution.videoPlayer.videos.0.alt"),
    badge: VideoBadge.Podcast,
  },
  {
    id: "IpWVxL4V4Oc",
    thumbnail: "/src/img/solutions/ai/videos/video2.webp",
    title: t("ai-solution.videoPlayer.videos.1.title"),
    description: t("ai-solution.videoPlayer.videos.1.description"),
    alt: t("ai-solution.videoPlayer.videos.1.alt"),
    badge: VideoBadge.Podcast,
  },
];
