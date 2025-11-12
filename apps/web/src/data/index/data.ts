import CoinsAdd from "@@/public/src/img/icons/CoinsAdd.inline.svg";
import CodeInSquear from "@@/public/src/img/icons/CodeInSquear.inline.svg";
import Bezier from "@@/public/src/img/icons/Bezier.inline.svg";
import ShieldCheck from "@@/public/src/img/icons/ShieldCheck.inline.svg";
import WindowCursor from "@@/public/src/img/icons/WindowCursor.inline.svg";

export const LOGOS = [
  {
    src: "/src/img/logos-eco/circle.svg",
    alt: "Circle",
    height: "80%",
  },
  { src: "/src/img/logos-eco/discord.svg", alt: "Discord" },
  {
    src: "/src/img/logos-eco/google.svg",
    alt: "Google",
    height: "80%",
  },
  { src: "/src/img/logos-eco/jump.svg", alt: "Jump", height: "80%" },
  {
    src: "/src/img/logos-eco/magic-eden.svg",
    alt: "Magic Eden",
    height: "75%",
  },
  { src: "/src/img/logos-eco/shopify.svg", alt: "Shopify" },
  {
    src: "/src/img/logos-eco/meta.svg",
    alt: "Meta",
    height: "62.9%",
  },
  {
    src: "/src/img/logos-eco/stripe.svg",
    alt: "Stripe",
    height: "80%",
  },
];

// TODO: Replace with actual projects
export const PROJECTS = [
  {
    src: "/src/img/logos-eco/bio-protocol.svg",
    key: "bioprotocol",
    colSpan: 2,
  },
  {
    src: "/src/img/logos-eco/molecule.svg",
    key: "molecule",
  },
  {
    src: "/src/img/logos-eco/curetopia.svg",
    key: "curetopia",
  },
  {
    src: "/src/img/logos-eco/pump-science.svg",
    key: "pumpscience",
    colSpan: 4,
  },
];

export const PROJECTS_LOGOS = [
  {
    src: "/src/img/logos-eco/hamilton-lane.webp",
    alt: "Hamilton Lane",
  },
  {
    src: "/src/img/logos-eco/blackrock.png",
    alt: "Blackrock",
    height: "80%",
  },
  {
    src: "/src/img/logos-eco/brevan-howard.png",
    alt: "Brevan Howard",
    height: "80%",
  },
  {
    src: "/src/img/logos-eco/societe-generale.png",
    alt: "Societe Generale",
    height: "96%",
  },
  {
    src: "/src/img/logos-eco/vaneck.png",
    alt: "Vaneck",
    height: "80%",
  },
];

export const LINKS = [
  {
    href: "/validators",
    Icon: Bezier,
  },
  {
    href: "/staking",
    Icon: ShieldCheck,
  },
  {
    href: "/docs/intro/quick-start",
    Icon: WindowCursor,
  },
  {
    href: "/grants-funding",
    Icon: CodeInSquear,
  },
  {
    href: "/solutions/tokenization",
    Icon: CoinsAdd,
  },
];
