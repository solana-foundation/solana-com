import type { CompanyRecord } from "../../types";
import xashBreakpoint2026White from "../../../assets/companies/xash/breakpoint-2026-white.svg";
import xashLogoDark from "../../../assets/companies/xash/logo-dark.svg";
import xashLogoGold from "../../../assets/companies/xash/logo-gold.svg";

export const xash = {
  id: "xash",
  slug: "xash",
  name: "Xash",
  profile: {
    tagline: "Stablecoin activity rewarded in gold.",
    summary:
      "Xash is a rewards program for eligible stablecoin activity, with rewards measured in gold.",
    description:
      "Xash provides a wallet connected application where participants can review eligible stablecoin activities, such as providing liquidity or lending, and approve transactions from their own wallet. Rewards are measured in gold.",
    sector: "DeFi",
    type: "Platform",
    links: {
      website: "https://xash.com/",
    },
  },
  defaultLogoId: "logo-gold",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: xashBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: xashLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-gold",
      fileName: "logo-gold.svg",
      format: "svg",
      source: xashLogoGold,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
