import type { CompanyRecord } from "../../types";
import moneygramBreakpoint2026White from "../../../assets/companies/moneygram/breakpoint-2026-white.png";
import moneygramLogoDark from "../../../assets/companies/moneygram/logo-dark.png";
import moneygramLogoLight from "../../../assets/companies/moneygram/logo-light.png";

export const moneygram = {
  id: "moneygram",
  slug: "moneygram",
  name: "MoneyGram",
  profile: {
    tagline: "Global money movement.",
    summary:
      "MoneyGram is a global payments company that enables cross-border money transfers and cash-to-digital asset services.",
    description:
      "MoneyGram operates a global network for moving money across borders through digital and retail channels. Its MoneyGram Ramps product lets wallets and exchanges integrate USDC cash-in and cash-out services on Solana.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://www.moneygram.com/",
      docs: "https://developer.moneygram.com/moneygram-developer/docs/integrate-moneygram-ramps",
    },
    socials: {
      x: "https://twitter.com/MoneyGram",
      linkedin: "https://www.linkedin.com/company/moneygram-international/",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: moneygramBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: moneygramLogoLight,
      theme: "light",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: moneygramLogoDark,
      theme: "dark",
    },
  ],
} satisfies CompanyRecord;
