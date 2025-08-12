import { Bitcoin, DollarSign, Landmark, Layers, Timer } from "lucide-react";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/solutions/btcfi/ecosystem/100x100.svg",
    key: "cbbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/100x100.svg",
    key: "wbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/100x100.svg",
    key: "xbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/100x100.svg",
    key: "zenbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/100x100.svg",
    key: "zbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/100x100.svg",
    key: "fragbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/100x100.svg",
    key: "lbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/100x100.svg",
    key: "yalabtc",
  },
];

export const PERFORMANCE = [
  {
    key: "0",
    Icon: DollarSign,
    color: "bg-violet-500 text-black",
  },
  {
    key: "1",
    Icon: Timer,
    color: "bg-green-400 text-black",
  },
  {
    key: "2",
    Icon: Bitcoin,
    color: "bg-orange-400 text-black",
  },
  {
    Icon: Bitcoin,
    color: "bg-orange-400 text-orange-100",
  },
  {
    key: "3",
    Icon: Landmark,
    color: "bg-cyan-400 text-black",
  },
  {
    key: "4",
    Icon: Layers,
    color: "bg-violet-500 text-black",
  },
];

export const LOGOS = [];

export const LATEST_NEWS = (
  t: (_key: string, _values?: TranslationValues, _formats?: Formats) => string,
) => [
  {
    id: "0",
    title: t("btcfi.news.items.0.title"),
    image: "/src/img/solutions/btcfi/news1.webp",
    alt: t("btcfi.news.items.0.alt"),
    link: "https://x.com/wallet/status/1936000835068346392",
  },
  {
    id: "1",
    title: t("btcfi.news.items.1.title"),
    image: "/src/img/solutions/btcfi/news2.webp",
    alt: t("btcfi.news.items.1.alt"),
    link: "https://x.com/solana/status/1919416059695603920",
  },
  {
    id: "2",
    title: t("btcfi.news.items.2.title"),
    image: "/src/img/solutions/btcfi/news3.webp",
    alt: t("btcfi.news.items.2.alt"),
    link: "https://x.com/solana/status/1854573991442194754",
  },
  {
    id: "3",
    title: t("btcfi.news.items.3.title"),
    image: "/src/img/solutions/btcfi/news4.webp",
    alt: t("btcfi.news.items.3.alt"),
    link: "https://x.com/KaminoFinance/status/1950939721049272786",
  },
  {
    id: "4",
    title: t("btcfi.news.items.4.title"),
    image: "/src/img/solutions/btcfi/news5.webp",
    alt: t("btcfi.news.items.4.alt"),
    link: "https://x.com/ZeusNetworkHQ/status/1947315859917255112",
  },
  {
    id: "5",
    title: t("btcfi.news.items.5.title"),
    image: "/src/img/solutions/btcfi/news6.webp",
    alt: t("btcfi.news.items.5.alt"),
    link: "https://x.com/yalaorg/status/1929192719408071081",
  },
];
