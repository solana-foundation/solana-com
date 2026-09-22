import type { CompanyRecord } from "../../types";
import reflectMoneyBreakpoint2026White from "../../../assets/companies/reflect-money/breakpoint-2026-white.png";

export const reflectMoney = {
  id: "reflect-money",
  slug: "reflect-money",
  name: "Reflect.money",
  profile: {
    tagline: "The platform that makes building with stablecoins easy.",
    summary:
      "Reflect provides a stablecoin API for adding yield-bearing balances and savings products to applications.",
    description:
      "Reflect lets teams launch branded yield-bearing stablecoins or integrate stablecoin savings accounts. Its API supports yield routing, liquidity, and configurable risk protection for onchain products.",
    sector: "DeFi",
    type: "Platform",
    links: {
      website: "https://reflect.money/",
      docs: "https://docs.reflect.money/",
    },
    socials: {
      linkedin: "https://www.linkedin.com/company/reflectmoney",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: reflectMoneyBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
