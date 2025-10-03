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
    src: "/src/img/logos-eco/coinbase.svg",
    key: "cbbtc",
  },
  {
    src: "/src/img/logos-eco/bitgo.svg",
    key: "wbtc",
  },
  {
    src: "/src/img/logos-eco/okx.svg",
    key: "xbtc",
  },
  {
    src: "/src/img/logos-eco/zenrock.svg",
    key: "zenbtc",
  },
  {
    src: "/src/img/logos-eco/zeus.svg",
    key: "zbtc",
  },
  {
    src: "/src/img/logos-eco/fragmetric.webp",
    key: "fragbtc",
  },
  {
    src: "/src/img/logos-eco/lombard.webp",
    key: "lbtc",
  },
  {
    src: "/src/img/logos-eco/yala.svg",
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
    src: "/src/img/logos-eco/coinbase.svg",
    alt: "Сoinbase",
    bg: "bg-white",
  },
  {
    src: "/src/img/logos-eco/bitgo.svg",
    alt: "BitGo",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/okx.svg",
    alt: "OKX",
    bg: "bg-white",
  },
  {
    src: "/src/img/logos-eco/anchorage.webp",
    alt: "Anchorage",
    bg: "bg-white",
  },
  {
    src: "/src/img/logos-eco/drift.svg",
    alt: "Drift",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/kamino.svg",
    alt: "Kamino",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/jupiter.webp",
    alt: "Jupiter",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/raydium.webp",
    alt: "Raydium",
    bg: "bg-white",
  },
  {
    src: "/src/img/logos-eco/orca.svg",
    alt: "Orca",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/phantom.webp",
    alt: "Phantom",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/lombard.webp",
    alt: "Lombard",
    bg: "bg-white",
  },
  {
    src: "/src/img/logos-eco/21shares.svg",
    alt: "21shares",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/thesis.svg",
    alt: "Thesis",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/stacks.webp",
    alt: "Stacks",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/yala.svg",
    alt: "Yala",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/zenrock.svg",
    alt: "Zenrock",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/zeus.svg",
    alt: "Zeus",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/layerzero.svg",
    alt: "LayerZero",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/ratex.svg",
    alt: "RateX",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/loopscale.svg",
    alt: "Loopscale",
    bg: "bg-white",
  },
  {
    src: "/src/img/logos-eco/fragmetric.webp",
    alt: "Fragmetric",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/bitlayer.webp",
    alt: "Bitlayer",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/bullish.webp",
    alt: "Bullish",
    bg: "bg-black",
  },
  {
    src: "/src/img/logos-eco/galaxy.webp",
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
  {
    id: "6",
    title: "Yield-bearing Bitcoin, now available natively on Solana.",
    image: "/src/img/solutions/btcfi/news7.webp",
    alt: "Yield-bearing Bitcoin, now available natively on Solana.",
    link: "https://x.com/Lombard_Finance/status/1961067315958788176",
  },
];
