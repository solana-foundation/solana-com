import CoinsAdd from "@@/public/src/img/icons/CoinsAdd.inline.svg";
import CodeInSquare from "@@/public/src/img/icons/CodeInSquare.inline.svg";
import Bezier from "@@/public/src/img/icons/Bezier.inline.svg";
import ShieldCheck from "@@/public/src/img/icons/ShieldCheck.inline.svg";
import WindowCursor from "@@/public/src/img/icons/WindowCursor.inline.svg";

export const LOGOS = [
  {
    src: "/src/img/logos-eco/western-union.svg",
    alt: "Western Union",
  },
  {
    src: "/src/img/logos-eco/visa.svg",
    alt: "Visa",
  },
  {
    src: "/src/img/logos-eco/worldpay.svg",
    alt: "Worldpay",
  },
  {
    src: "/src/img/logos-eco/circle.svg",
    alt: "Circle",
    height: "80%",
  },
  {
    src: "/src/img/logos-eco/paypal.svg",
    alt: "PayPal",
  },
  {
    src: "/src/img/logos-eco/fiserv.svg",
    alt: "Fiserv",
  },
];

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/western-union.svg",
    key: "western-union",
  },
  {
    src: "/src/img/logos-eco/visa.svg",
    key: "visa",
  },
  {
    src: "/src/img/logos-eco/paypal.svg",
    key: "paypal",
  },
  {
    src: "/src/img/logos-eco/franklin-templeton.webp",
    key: "franklinTempleton",
  },
  {
    src: "/src/img/logos-eco/r3.webp",
    key: "r3",
  },
  {
    src: "/src/img/logos-eco/bullish.svg",
    key: "bullish",
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
    href: "https://solana.org/grants-funding",
    Icon: CodeInSquare,
  },
  {
    href: "/solutions/tokenization",
    Icon: CoinsAdd,
  },
];

// TODO: Replace with actual data
export const GET_STARTED_LINKS = {
  institution: [
    { href: "/solutions/tokenization" },
    { href: "/solutions/stablecoins" },
    { href: "/solutions/institutional-payments" },
    { href: "/solutions/enterprise" },
  ],
  developer: [
    { href: "/developers" },
    { href: "/docs/intro/quick-start" },
    { href: "/solutions/real-world-assets" },
    { href: "/events" },
  ],
  user: [
    { href: "#" },
    { href: "/wallets" },
    { href: "#" },
    { href: "https://jobs.solana.com/jobs" },
  ],
};
