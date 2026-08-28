import type { CompanyRecord } from "../../types";
import redotpayBreakpoint2026White from "../../../assets/companies/redotpay/breakpoint-2026-white.svg";
import redotpayLogoBlack from "../../../assets/companies/redotpay/logo-black.svg";
import redotpayLogoRed from "../../../assets/companies/redotpay/logo-red.svg";
import redotpayLogoWhite from "../../../assets/companies/redotpay/logo-white.svg";

export const redotpay = {
  id: "redotpay",
  slug: "redotpay",
  name: "RedotPay",
  profile: {
    tagline: "Where crypto meets real life.",
    summary:
      "RedotPay is a fintech platform providing stablecoin-based cards, transfers, and multi-currency wallet services.",
    description:
      "RedotPay enables users to spend stablecoins through virtual and physical cards, send money globally, and manage stablecoins and local currencies in one app. Its payment products support a range of digital assets, including SOL.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://www.redotpay.com/",
    },
  },
  defaultLogoId: "logo-black",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: redotpayBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-black",
      fileName: "logo-black.svg",
      format: "svg",
      source: redotpayLogoBlack,
      theme: "light",
    },
    {
      id: "logo-red",
      fileName: "logo-red.svg",
      format: "svg",
      source: redotpayLogoRed,
    },
    {
      id: "logo-white",
      fileName: "logo-white.svg",
      format: "svg",
      source: redotpayLogoWhite,
      theme: "dark",
    },
  ],
} satisfies CompanyRecord;
