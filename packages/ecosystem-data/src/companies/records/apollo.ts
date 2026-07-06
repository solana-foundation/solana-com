import type { CompanyRecord } from "../../types";
import apolloLogoLight from "../../../assets/companies/apollo/logo-light.webp";

export const apollo = {
  id: "apollo",
  slug: "apollo",
  name: "Apollo",
  profile: {
    tagline: "Global asset management and retirement solutions",
    summary:
      "Apollo is a global alternative asset manager with strategies spanning credit, equity, real assets, capital solutions, and financial services.",
    description:
      "Apollo is a global asset manager and retirement solutions provider. Its asset management platform covers credit, equity, real assets, capital solutions, and financial services, with institutional and wealth products across public and private markets. Apollo's ACRED strategy is part of the tokenized private-credit activity represented in the Solana RWA ecosystem.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.apollo.com/",
    },
    socials: {
      linkedin: "https://www.linkedin.com/company/apollo-global-management-inc",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.webp",
      format: "webp",
      source: apolloLogoLight,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
