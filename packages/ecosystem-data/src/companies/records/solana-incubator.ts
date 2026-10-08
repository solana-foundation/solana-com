import type { CompanyRecord } from "../../types";
import solanaIncubatorLogoDark from "../../../assets/companies/solana-incubator/logo-dark.webp";
import solanaIncubatorLogoLight from "../../../assets/companies/solana-incubator/logo-light.webp";

export const solanaIncubator = {
  id: "solana-incubator",
  slug: "solana-incubator",
  name: "Solana Incubator",
  profile: {
    tagline: "A Solana Labs program for early-stage teams.",
    summary:
      "Solana Incubator is a Solana Labs program that helps teams develop products in the Solana ecosystem.",
    description:
      "Solana Incubator brings early-stage teams together with Solana Labs for a three-month in-person program in New York. The program offers support with development, product strategy, fundraising, brand, and ecosystem connections.",
    sector: "Community",
    type: "Community",
    links: {
      website: "https://incubator.solanalabs.com/",
    },
    socials: {
      x: "https://x.com/incubator",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.webp",
      format: "webp",
      source: solanaIncubatorLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.webp",
      format: "webp",
      source: solanaIncubatorLogoLight,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
