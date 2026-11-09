import type { CompanyRecord } from "../../types";
import bitwiseLogoDark from "../../../assets/companies/bitwise/logo-dark.svg";

export const bitwise = {
  id: "bitwise",
  slug: "bitwise",
  name: "Bitwise",
  profile: {
    tagline: "Crypto asset management for investors.",
    summary:
      "Bitwise is a crypto asset manager offering exchange traded funds and other investment products, including exposure to Solana.",
    description:
      "Bitwise offers crypto investment products for investors and institutions. Its product range includes exchange traded funds, separately managed accounts, and staking strategies.",
    sector: "Staking",
    type: "Company",
    links: {
      website: "https://bitwiseinvestments.com/",
    },
    socials: {
      x: "https://x.com/Bitwise",
      linkedin: "https://www.linkedin.com/company/bitwise-asset-management/",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: bitwiseLogoDark,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
