import type { SolutionNewsQuery } from "@/lib/media/solution-news";

export const PROJECTS = [
  {
    src: "/src/img/logos-eco/coinbase.svg",
    key: "cbbtc",
    statIcon: "/src/img/solutions/btcfi/ecosystem/icon-1.webp",
  },
  {
    src: "/src/img/logos-eco/bitgo.svg",
    key: "wbtc",
    statIcon: "/src/img/solutions/btcfi/ecosystem/icon-2.webp",
  },
  {
    src: "/src/img/logos-eco/okx.svg",
    key: "xbtc",
    statIcon: "/src/img/solutions/btcfi/ecosystem/icon-3.webp",
  },
  {
    src: "/src/img/logos-eco/zenrock.svg",
    key: "zenbtc",
    statIcon: "/src/img/solutions/btcfi/ecosystem/icon-4.webp",
  },
  {
    src: "/src/img/logos-eco/zeus.svg",
    key: "zbtc",
    statIcon: "/src/img/solutions/btcfi/ecosystem/icon-5.webp",
  },
  {
    src: "/src/img/logos-eco/fragmetric.svg",
    key: "fragbtc",
    statIcon: "/src/img/solutions/btcfi/ecosystem/icon-6.webp",
  },
  {
    src: "/src/img/logos-eco/lombard.svg",
    key: "lbtc",
    statIcon: "/src/img/solutions/btcfi/ecosystem/icon-7.webp",
  },
  {
    src: "/src/img/logos-eco/yala.svg",
    key: "yalabtc",
    statIcon: "/src/img/solutions/btcfi/ecosystem/icon-8.webp",
  },
];

export const PERFORMANCE = [
  {
    key: "0",
  },
  {
    key: "1",
  },
  {
    key: "2",
  },
  {
    key: "3",
  },
  {
    key: "4",
  },
];

export const LOGOS = [
  {
    src: "/src/img/logos-eco/anchorage-digital.svg",
    alt: "Anchorage",
  },
  {
    src: "/src/img/logos-eco/raydium.svg",
    alt: "Raydium",
  },
  {
    src: "/src/img/logos-eco/jupiter.svg",
    alt: "Jupiter",
  },
  {
    src: "/src/img/logos-eco/kamino.svg",
    alt: "Kamino",
  },
  {
    src: "/src/img/logos-eco/drift.svg",
    alt: "Drift",
  },
  {
    src: "/src/img/logos-eco/orca.svg",
    alt: "Orca",
  },
  {
    src: "/src/img/logos-eco/phantom.webp",
    alt: "Phantom",
  },
  {
    src: "/src/img/logos-eco/21shares.svg",
    alt: "21shares",
  },
  {
    src: "/src/img/logos-eco/thesis.svg",
    alt: "Thesis",
  },
  {
    src: "/src/img/logos-eco/stacks.svg",
    alt: "Stacks",
  },
  {
    src: "/src/img/logos-eco/layerzero.svg",
    alt: "LayerZero",
  },
  {
    src: "/src/img/logos-eco/ratex.svg",
    alt: "Rate X",
  },
  {
    src: "/src/img/logos-eco/loopscale.svg",
    alt: "Loopscale",
  },
  {
    src: "/src/img/logos-eco/bitlayer.svg",
    alt: "Bitlayer",
  },
  {
    src: "/src/img/logos-eco/bullish.svg",
    alt: "Bullish",
  },
  {
    src: "/src/img/logos-eco/galaxy.svg",
    alt: "Galaxy",
  },
];

export const LATEST_NEWS_QUERY: SolutionNewsQuery = {
  categories: ["defi", "finance"],
  tags: ["bitcoin"],
  limit: 6,
  includePosts: false,
  includeLinks: true,
  fallbackImage: "/src/img/solutions/btcfi/og-image.webp",
  fallbackImagesByUrl: {
    "https://x.com/wallet/status/1936000835068346392":
      "/src/img/solutions/btcfi/news/news1.webp",
    "https://x.com/solana/status/1919416059695603920":
      "/src/img/solutions/btcfi/news/news2.webp",
    "https://x.com/solana/status/1854573991442194754":
      "/src/img/solutions/btcfi/news/news3.webp",
    "https://x.com/KaminoFinance/status/1950939721049272786":
      "/src/img/solutions/btcfi/news/news4.webp",
    "https://x.com/ZeusNetworkHQ/status/1947315859917255112":
      "/src/img/solutions/btcfi/news/news5.webp",
    "https://x.com/yalaorg/status/1929192719408071081":
      "/src/img/solutions/btcfi/news/news6.webp",
    "https://x.com/Lombard_Finance/status/1961067315958788176":
      "/src/img/solutions/btcfi/news/news7.webp",
  },
  fallbackImageFitByUrl: {
    "https://x.com/Lombard_Finance/status/1961067315958788176": "contain",
  },
};
