import type { CompanyRecord } from "../../types";
import humaFinanceBreakpoint2026White from "../../../assets/companies/huma-finance/breakpoint-2026-white.svg";

export const humaFinance = {
  id: "huma-finance",
  slug: "huma-finance",
  name: "Huma Finance",
  profile: {
    tagline: "The first PayFi network",
    summary:
      "Huma Finance is a PayFi network that uses onchain liquidity to finance global payments.",
    description:
      "Huma Finance provides payment-financing infrastructure for payment institutions, businesses, and liquidity providers. Its network brings real-world payment flows onchain and has deployed on Solana to support stablecoin-based financing and settlement.",
    sector: "Payments",
    type: "Protocol",
    links: {
      website: "https://huma.finance/",
    },
    socials: {
      x: "https://x.com/humafinance",
      discord: "https://discord.com/invite/huma",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: humaFinanceBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
