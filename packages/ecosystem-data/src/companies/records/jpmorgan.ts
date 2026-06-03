import type { CompanyRecord } from "../../types";
import jpmorganLogoLight from "../../../assets/companies/jpmorgan/logo-light.svg";
import jpmorganLogoDark from "../../../assets/companies/jpmorgan/logo-dark.svg";

export const jpmorgan = {
  id: "jpmorgan",
  slug: "jpmorgan",
  name: "JPMorgan",
  profile: {
    tagline: "Global investment bank and financial services",
    summary:
      "J.P. Morgan arranged a landmark U.S. commercial paper issuance on the Solana public blockchain for Galaxy Digital Holdings.",
    description:
      "JPMorgan Chase is a multinational investment bank and financial services holding company. J.P. Morgan arranged one of the first debt issuances ever executed on a public blockchain, completing a commercial paper issuance on Solana for Galaxy Digital with Coinbase as lead investor alongside Franklin Templeton.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.jpmorgan.com",
    },
    socials: {
      x: "https://x.com/jpmorgan",
      linkedin: "https://www.linkedin.com/company/j-p-morgan",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: jpmorganLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: jpmorganLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
