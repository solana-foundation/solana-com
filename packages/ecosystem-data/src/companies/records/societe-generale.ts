import type { CompanyRecord } from "../../types";
import societeGeneraleLogoLight from "../../../assets/companies/societe-generale/logo-light.svg";
import societeGeneraleLogoDark from "../../../assets/companies/societe-generale/logo-dark.svg";
import societeGeneraleMarkLight from "../../../assets/companies/societe-generale/mark-light.svg";
import societeGeneraleMarkDark from "../../../assets/companies/societe-generale/mark-dark.svg";

export const societeGenerale = {
  id: "societe-generale",
  slug: "societe-generale",
  name: "Societe Generale",
  profile: {
    tagline: "European banking and financial services group",
    summary:
      "Societe Generale, via SG Forge, deployed the EUR CoinVertible (EURCV) MiCA-compliant stablecoin on the Solana network.",
    description:
      "Societe Generale is a major European financial services group. Through its digital asset arm SG Forge, it issued EUR CoinVertible (EURCV) on Solana, a regulated euro-denominated stablecoin enabling programmable payments, instant settlement, and DeFi-native financial products for institutional clients. The stablecoin is 1:1 backed by cash reserves.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.societegenerale.com",
    },
    socials: {
      x: "https://x.com/SocieteGenerale",
      linkedin: "https://www.linkedin.com/company/societe-generale",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: societeGeneraleLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: societeGeneraleLogoDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: societeGeneraleMarkLight,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: societeGeneraleMarkDark,
      theme: "dark",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
