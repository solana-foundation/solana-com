import type { CompanyRecord } from "../../types";
import sofiLogo from "../../../assets/companies/sofi/logo.svg";
import sofiLogoMonotone from "../../../assets/companies/sofi/logo-monotone.svg";

export const sofi = {
  id: "sofi",
  slug: "sofi",
  name: "SoFi",
  profile: {
    tagline: "Get your money right",
    summary:
      "SoFi is a digital personal finance company and nationally chartered bank offering banking, lending, investing, and crypto services through a single mobile app.",
    description:
      "SoFi Technologies (NASDAQ: SOFI) is a member-centric fintech platform providing a full suite of financial products including checking, savings, loans, credit cards, investing, and cryptocurrency trading. SoFi supports direct Solana network deposits and launched Big Business Banking, an enterprise platform built on Solana that enables companies to manage fiat and crypto assets on a single regulated platform using SoFiUSD, the bank's own digital dollar.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://www.sofi.com",
    },
    socials: {
      x: "https://x.com/SoFi",
      linkedin: "https://www.linkedin.com/company/sofi",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: sofiLogo,
    },
    {
      id: "logo-monotone",
      fileName: "logo-monotone.svg",
      format: "svg",
      source: sofiLogoMonotone,
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
