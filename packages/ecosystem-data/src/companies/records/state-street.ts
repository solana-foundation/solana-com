import type { CompanyRecord } from "../../types";
import stateStreetLogoLight from "../../../assets/companies/state-street/logo-light.svg";
import stateStreetLogoDark from "../../../assets/companies/state-street/logo-dark.svg";
import stateStreetMarkLight from "../../../assets/companies/state-street/mark-light.svg";
import stateStreetMarkDark from "../../../assets/companies/state-street/mark-dark.svg";

export const stateStreet = {
  id: "state-street",
  slug: "state-street",
  name: "State Street",
  profile: {
    tagline: "Global financial services and bank holding company",
    summary:
      "State Street and Galaxy Asset Management are launching a tokenized money market fund on Solana, making it the first GSIB to issue assets on a public blockchain.",
    description:
      "State Street Corporation is a financial services and bank holding company with over $50 trillion in custodied assets. State Street and Galaxy Asset Management are launching a tokenized money market fund on Solana using PYUSD for 24/7 subscriptions and redemptions, making it the first Global Systemically Important Bank to issue assets on a public blockchain.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.statestreet.com",
    },
    socials: {
      x: "https://x.com/StateStreet",
      linkedin: "https://www.linkedin.com/company/state-street",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: stateStreetLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: stateStreetLogoDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: stateStreetMarkLight,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: stateStreetMarkDark,
      theme: "dark",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
