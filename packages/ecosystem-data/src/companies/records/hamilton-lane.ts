import type { CompanyRecord } from "../../types";
import hamiltonLaneLogoLight from "../../../assets/companies/hamilton-lane/logo-light.webp";

export const hamiltonLane = {
  id: "hamilton-lane",
  slug: "hamilton-lane",
  name: "Hamilton Lane",
  profile: {
    tagline: "Private markets solutions provider",
    summary:
      "Hamilton Lane is a global investment manager focused on private markets strategies, data, and technology.",
    description:
      "Hamilton Lane is a global private markets investment manager offering asset management, private wealth, customized managed solutions, digital assets, and technology solutions. The firm uses proprietary market data and technology to support private market investment programs. Hamilton Lane funds have appeared in Solana's tokenized fund ecosystem through Libre and related private markets access products.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.hamiltonlane.com/",
    },
    socials: {
      x: "https://twitter.com/Hamilton_Lane",
      linkedin: "https://www.linkedin.com/company/hamilton-lane/",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.webp",
      format: "webp",
      source: hamiltonLaneLogoLight,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
