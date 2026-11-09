import type { CompanyRecord } from "../../types";
import coindeskLogoDark from "../../../assets/companies/coindesk/logo-dark.svg";
import coindeskLogoWhite from "../../../assets/companies/coindesk/logo-white.svg";

export const coindesk = {
  id: "coindesk",
  slug: "coindesk",
  name: "CoinDesk",
  profile: {
    tagline: "News and analysis on digital assets.",
    summary:
      "CoinDesk reports on cryptocurrency, blockchain technology, and digital asset markets.",
    description:
      "CoinDesk is a media company covering digital assets and the technologies and businesses behind them. It publishes news and analysis and produces podcasts, videos, and industry events.",
    type: "Company",
    links: {
      website: "https://www.coindesk.com/",
    },
    socials: {
      x: "https://x.com/CoinDesk",
      linkedin: "https://www.linkedin.com/company/coindesk/",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: coindeskLogoDark,
      theme: "dark",
      kind: "logo",
      treatment: "brand",
      background: "transparent",
      width: 913,
      height: 172,
    },
    {
      id: "logo-white",
      fileName: "logo-white.svg",
      format: "svg",
      source: coindeskLogoWhite,
      theme: "dark",
      kind: "logo",
      treatment: "monotone",
      background: "transparent",
      width: 913,
      height: 172,
    },
    {
      id: "breakpoint-2026-white",
      fileName: "logo-white.svg",
      format: "svg",
      source: coindeskLogoWhite,
      theme: "dark",
      kind: "logo",
      treatment: "monotone",
      background: "transparent",
      width: 913,
      height: 172,
    },
  ],
} satisfies CompanyRecord;
