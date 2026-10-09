import type { CompanyRecord } from "../../types";
import birdeyeLogoDark from "../../../assets/companies/birdeye/logo-dark.svg";
import birdeyeLogoHorizontalDark from "../../../assets/companies/birdeye/logo-horizontal-dark.svg";
import birdeyeLogoHorizontalLight from "../../../assets/companies/birdeye/logo-horizontal-light.svg";
import birdeyeLogoLight from "../../../assets/companies/birdeye/logo-light.svg";

export const birdeye = {
  id: "birdeye",
  slug: "birdeye",
  name: "Birdeye",
  profile: {
    tagline: "Onchain market data for traders and builders.",
    summary:
      "Birdeye provides token, wallet, trade, and liquidity data for Solana and other blockchains.",
    description:
      "Birdeye offers market analytics for traders and data APIs for developers. Its Solana data covers token prices, trades, wallets, and liquidity, with tools for research and application development.",
    sector: "Infrastructure",
    type: "Platform",
    links: {
      website: "https://birdeye.so/",
    },
    socials: {
      x: "https://x.com/birdeye_data",
      telegram: "https://t.me/bds_ann",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: birdeyeLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-horizontal-dark",
      fileName: "logo-horizontal-dark.svg",
      format: "svg",
      source: birdeyeLogoHorizontalDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-horizontal-light",
      fileName: "logo-horizontal-light.svg",
      format: "svg",
      source: birdeyeLogoHorizontalLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: birdeyeLogoLight,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
