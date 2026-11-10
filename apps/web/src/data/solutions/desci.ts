import { VideoBadge } from "@/components/solutions/video-grid.v2";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/bio-protocol.svg",
    key: "bioprotocol",
    metric: "desci.bio-protocol.raised",
  },
  {
    src: "/src/img/logos-eco/molecule.svg",
    key: "molecule",
    metric: "desci.molecule.ecosystem-value",
  },
  {
    src: "/src/img/logos-eco/curetopia.svg",
    key: "curetopia",
  },
  {
    src: "/src/img/logos-eco/pump-science.svg",
    key: "pumpscience",
    metric: "desci.pump-science.volume",
  },
  {
    src: "/src/img/logos-eco/spinedao.svg",
    key: "spinedao",
    metric: "desci.spinedao.records-labelled",
  },
  {
    src: "/src/img/logos-eco/genpulse.webp",
    key: "genpulse",
    metric: "desci.genpulse.revenue",
  },
] as const;

export const LOGOS = [
  {
    src: "/src/img/logos-eco/mycodao.svg",
    alt: "MycoDAO",
  },
  {
    src: "/src/img/logos-eco/vitadao.svg",
    alt: "VitaDAO",
  },
  {
    src: "/src/img/logos-eco/cerebrumdao.svg",
    alt: "CerebrumDAO",
  },
  {
    src: "/src/img/logos-eco/starpower.webp",
    alt: "StarPower",
  },
  {
    src: "/src/img/logos-eco/cudis.webp",
    alt: "Cudis",
  },
];

export const PRODUCTS = [
  {
    key: "0",
    href: "https://app.bio.xyz/launchpad",
  },
  {
    key: "2",
    href: "https://github.com/sendaifun/solana-agent-kit",
  },
  {
    key: "1",
    href: "https://www.molecule.to",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "",
    thumbnail: "/src/img/solutions/desci/videos/video1.webp",
    title: t("desci.videoPlayer.videos.0.title"),
    description: t("desci.videoPlayer.videos.0.description"),
    alt: t("desci.videoPlayer.videos.0.alt"),
    badge: VideoBadge.Podcast,
  },
  {
    id: "",
    thumbnail: "/src/img/solutions/desci/videos/video2.webp",
    title: t("desci.videoPlayer.videos.1.title"),
    description: t("desci.videoPlayer.videos.1.description"),
    alt: t("desci.videoPlayer.videos.1.alt"),
    badge: VideoBadge.Podcast,
  },
  {
    id: "",
    thumbnail: "/src/img/solutions/desci/videos/video3.webp",
    title: t("desci.videoPlayer.videos.2.title"),
    description: t("desci.videoPlayer.videos.2.description"),
    alt: t("desci.videoPlayer.videos.2.alt"),
    badge: VideoBadge.Podcast,
  },
];
