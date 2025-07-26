import {
  Box,
  Fullscreen,
  GalleryVerticalEnd,
  Smartphone,
  Sparkles,
  Wallet,
} from "lucide-react";

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
  {
    key: "cnfts",
    Icon: GalleryVerticalEnd,
    color: "text-violet-400 bg-violet-900/30",
    href: "/developers/courses/state-compression/compressed-nfts",
  },
  {
    key: "zkcompression",
    Icon: Fullscreen,
    color: "text-blue-400 bg-blue-900/30",
    href: "https://www.zkcompression.com/",
  },
  {
    key: "tokenExtensions",
    Icon: Box,
    color: "text-emerald-400 bg-emerald-900/30",
    href: "/solutions/token-extensions",
  },
];
