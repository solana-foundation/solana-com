import type { CompanyRecord } from "../../types";
import citiLogoLight from "../../../assets/companies/citi/logo-light.svg";
import citiLogoDark from "../../../assets/companies/citi/logo-dark.svg";

export const citi = {
  id: "citi",
  slug: "citi",
  name: "Citi",
  profile: {
    tagline: "Global banking and financial services",
    summary:
      "Citi is exploring tokenized trade finance on Solana, digitizing bills of exchange with programmable smart contracts.",
    description:
      "Citigroup is a multinational investment bank and financial services corporation. Citi is digitizing trade finance on Solana by exploring a proof of concept replacing paper-based letters of credit and invoice reconciliation with programmable smart contracts for faster working capital release and frictionless cross-border settlement.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.citigroup.com",
    },
    socials: {
      x: "https://x.com/Citi",
      linkedin: "https://www.linkedin.com/company/citi",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: citiLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: citiLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
