import { Smartphone, Sparkles, Wallet } from "lucide-react";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/solutions/depin/helium.png",
    key: "helium",
    bg: "#181F24",
  },
  {
    src: "/src/img/solutions/depin/render.png",
    key: "render",
    bg: "#FF2D2E",
  },
  {
    src: "/src/img/solutions/depin/hivemapper.png",
    key: "hivemapper",
    bg: "#4B6FFF",
  },
  {
    src: "/src/img/solutions/depin/grass.png",
    key: "grass",
    bg: "#B6FF3A",
  },
  {
    src: "/src/img/solutions/depin/geodnet.png",
    key: "geodnet",
    bg: "#000000",
  },
];

export const LOGOS = [
  {
    src: "/src/img/solutions/depin/ecosystem/375ai.png",
    alt: "375AI",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/blockcast.png",
    alt: "Blockcast",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/cudis.png",
    alt: "Cudis",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/dawn.png",
    alt: "Dawn",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/decharge.png",
    alt: "Decharge",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/dephy.png",
    alt: "Dephy",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/geodnet.png",
    alt: "Geodnet",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/hivemapper.png",
    alt: "Hivemapper",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/inference.png",
    alt: "Inference",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/jambo.png",
    alt: "Jambo",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/onocoy.png",
    alt: "Onocoy",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/pipenetwork.png",
    alt: "Pipenetwork",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/roam.png",
    alt: "Roam",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/shaga.png",
    alt: "Shaga",
    bg: "bg-[#f1ff61]",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/wayru.png",
    alt: "Wayru",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/wingbits-seo.png",
    alt: "Wingbits",
    bg: "bg-[#201c1c]",
  },
  {
    src: "/src/img/solutions/depin/ecosystem/xnet.png",
    alt: "Xnet",
    bg: "bg-white",
  },
];

export const PRODUCTS = [
  {
    key: "wallets",
    Icon: Wallet,
    color: "text-emerald-400 bg-emerald-900/30",
    href: "/wallets",
  },
  {
    key: "mobile",
    Icon: Smartphone,
    color: "text-indigo-400 bg-indigo-900/30",
    href: "https://docs.solanamobile.com/",
  },
  {
    key: "tokenization",
    Icon: Sparkles,
    color: "text-cyan-400 bg-cyan-900/30",
    href: "/solutions/real-world-assets",
  },
];

export const VIDEOS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "IpWVxL4V4Oc",
    thumbnail: "/src/img/solutions/depin/video1.png",
    title: t("depin.videos.0.title"),
    description: t("depin.videos.0.description"),
    alt: t("depin.videos.0.alt"),
  },
  {
    id: "PzNXP0w4xqU",
    thumbnail: "/src/img/solutions/depin/video2.png",
    title: t("depin.videos.1.title"),
    description: t("depin.videos.1.description"),
    alt: t("depin.videos.1.alt"),
  },
  {
    id: "VaBJu3dXpKk",
    thumbnail: "/src/img/solutions/depin/video3.png",
    title: t("depin.videos.2.title"),
    description: t("depin.videos.2.description"),
    alt: t("depin.videos.2.alt"),
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
