import { VideoBadge } from "@/components/solutions/video-grid.v2";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/helium.webp",
    key: "helium",
  },
  {
    src: "/src/img/logos-eco/hivemapper.webp",
    key: "hivemapper",
  },
  {
    src: "/src/img/logos-eco/render.webp",
    key: "render",
  },
  {
    src: "/src/img/logos-eco/grass.webp",
    key: "grass",
  },
  {
    src: "/src/img/logos-eco/geodnet.webp",
    key: "geodnet",
  },
];

export const LOGOS = [
  {
    src: "/src/img/logos-eco/375ai.png",
    alt: "375AI",
  },
  {
    src: "/src/img/logos-eco/blockcast.png",
    alt: "Blockcast",
    height: "22px",
  },
  {
    src: "/src/img/logos-eco/cudis.png",
    alt: "Cudis",
    height: "21px",
  },
  {
    src: "/src/img/logos-eco/dabba.png",
    alt: "Dabba",
    height: "22px",
  },
  {
    src: "/src/img/logos-eco/dawn.png",
    alt: "Dawn",
    height: "28px",
  },
  {
    src: "/src/img/logos-eco/decharge.png",
    alt: "Decharge",
    height: "22px",
  },
  {
    src: "/src/img/logos-eco/dephy.png",
    alt: "Dephy",
  },
  {
    src: "/src/img/logos-eco/8.png",
    alt: "",
  },
  {
    src: "/src/img/logos-eco/inference.svg",
    alt: "Inference",
    height: "28px",
  },
  {
    src: "/src/img/logos-eco/jambo.png",
    alt: "Jambo",
    height: "32px",
  },
  {
    src: "/src/img/logos-eco/onocoy.png",
    alt: "Onocoy",
  },
  {
    src: "/src/img/logos-eco/pipenetwork.png",
    alt: "Pipenetwork",
    height: "32px",
  },
  {
    src: "/src/img/logos-eco/powerledger.png",
    alt: "Powerledger",
  },
  {
    src: "/src/img/logos-eco/roam.png",
    alt: "Roam",
    height: "30px",
  },
  {
    src: "/src/img/logos-eco/2.png",
    alt: "",
  },
  {
    src: "/src/img/logos-eco/p.png",
    alt: "",
  },
  {
    src: "/src/img/logos-eco/wayru.png",
    alt: "Wayru",
  },
  {
    src: "/src/img/logos-eco/wingbits-seo.png",
    alt: "Wingbits",
    height: "30px",
  },
  {
    src: "/src/img/logos-eco/xnet.png",
    alt: "Xnet",
  },
];

export const PRODUCTS = [
  {
    key: "wallets",
    href: "/wallets",
  },
  {
    key: "cnfts",
  },
  {
    key: "tokenization",
    href: "/solutions/real-world-assets",
  },
  {
    key: "zkcompression",
  },
  {
    key: "mobile",
    href: "https://docs.solanamobile.com/",
  },
  {
    key: "tokenExtensions",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "IpWVxL4V4Oc",
    thumbnail: "/src/img/solutions/depin/video1.webp",
    title: t("depin.videos.0.title"),
    description: t("depin.videos.0.description"),
    alt: t("depin.videos.0.alt"),
    badge: VideoBadge.Podcast,
  },
  {
    id: "PzNXP0w4xqU",
    thumbnail: "/src/img/solutions/depin/video2.webp",
    title: t("depin.videos.1.title"),
    description: t("depin.videos.1.description"),
    alt: t("depin.videos.1.alt"),
    badge: VideoBadge.Interview,
  },
  {
    id: "VaBJu3dXpKk",
    thumbnail: "/src/img/solutions/depin/video3.webp",
    title: t("depin.videos.2.title"),
    description: t("depin.videos.2.description"),
    alt: t("depin.videos.2.alt"),
    badge: VideoBadge.Originals,
  },
];

export const LATEST_NEWS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "0",
    title: t("depin.news.items.0.title"),
    alt: t("depin.news.items.0.alt"),
    date: t("depin.news.items.0.date"),
    image: "/src/img/solutions/depin/news/vw.webp",
    link: "https://www.coindesk.com/tech/2025/07/08/volkswagen-admt-taps-solana-based-hivemapper-bee-maps-for-driverless-data",
  },
  {
    id: "1",
    title: t("depin.news.items.1.title"),
    alt: t("depin.news.items.1.alt"),
    date: t("depin.news.items.1.date"),
    image: "/src/img/solutions/depin/news/natix-grab.avif",
    large: true,
    link: "https://www.coindesk.com/tech/2025/05/06/solanas-natix-and-grab-team-up-to-expand-depin-mapping-into-us-europe",
  },
  {
    id: "2",
    title: t("depin.news.items.2.title"),
    alt: t("depin.news.items.2.alt"),
    date: t("depin.news.items.2.date"),
    image: "/src/img/solutions/depin/news/helium.webp",
    link: "https://www.theblock.co/post/351856/att-subscribers-will-now-automatically-connect-to-nearby-helium-hotspots-through-new-commercial-agreement",
  },
  {
    id: "3",
    title: t("depin.news.items.3.title"),
    alt: t("depin.news.items.3.alt"),
    date: t("depin.news.items.3.date"),
    image: "/src/img/solutions/depin/news/mike-horton.webp",
    link: "https://x.com/geodnet_/status/1913329186317779239",
  },
];
