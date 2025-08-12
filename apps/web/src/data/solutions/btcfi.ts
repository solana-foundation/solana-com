import {
  Bitcoin,
  CircleDollarSign,
  Landmark,
  Layers,
  Timer,
} from "lucide-react";
import { Formats, TranslationValues } from "next-intl";

export const PROJECTS = [
  {
    src: "/src/img/solutions/btcfi/ecosystem/coinbase.svg",
    key: "cbbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/bitgo.svg",
    key: "wbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/okx.svg",
    key: "xbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/zenrock.svg",
    key: "zenbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/zeus.svg",
    key: "zbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/fragmetric.webp",
    key: "fragbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/lombard.webp",
    key: "lbtc",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/yala.svg",
    key: "yalabtc",
  },
];

export const PERFORMANCE = [
  {
    key: "0",
    Icon: CircleDollarSign,
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

export const LOGOS = [
  {
    src: "/src/img/solutions/btcfi/ecosystem/coinbase.svg",
    alt: "Сoinbase",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/bitgo.svg",
    alt: "BitGo",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/okx.svg",
    alt: "OKX",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/anchorage.webp",
    alt: "Anchorage",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/drift.svg",
    alt: "Drift",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/kamino.svg",
    alt: "Kamino",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/jupiter.webp",
    alt: "Jupiter",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/raydium.webp",
    alt: "Raydium",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/orca.svg",
    alt: "Orca",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/phantom.webp",
    alt: "Phantom",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/lombard.webp",
    alt: "Lombard",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/21shares.svg",
    alt: "21shares",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/thesis.svg",
    alt: "Thesis",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/stacks.webp",
    alt: "Stacks",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/yala.svg",
    alt: "Yala",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/zenrock.svg",
    alt: "Zenrock",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/zeus.svg",
    alt: "Zeus",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/layerzero.svg",
    alt: "LayerZero",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/ratex.svg",
    alt: "RateX",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/loopscale.svg",
    alt: "Loopscale",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/fragmetric.webp",
    alt: "Fragmetric",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/bitlayer.webp",
    alt: "Bitlayer",
    bg: "bg-black",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/bullish.svg",
    alt: "Bullish",
    bg: "bg-white",
  },
  {
    src: "/src/img/solutions/btcfi/ecosystem/galaxy.webp",
    alt: "Galaxy",
    bg: "bg-white",
  },
];

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
