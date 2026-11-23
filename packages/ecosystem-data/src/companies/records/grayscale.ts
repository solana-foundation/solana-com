import type { CompanyRecord } from "../../types";
import grayscaleLogoDark from "../../../assets/companies/grayscale/logo-dark.png";
import grayscaleLogoLight from "../../../assets/companies/grayscale/logo-light.png";

export const grayscale = {
  id: "grayscale",
  slug: "grayscale",
  name: "Grayscale",
  profile: {
    tagline: "Digital asset investment products.",
    summary:
      "Grayscale offers digital asset investment products, including a Solana product that gives investors exposure to SOL.",
    description:
      "Grayscale is an asset manager focused on crypto investment products for investors, advisors, and institutions. Its products include single-asset, diversified, and thematic strategies. Its Solana product holds SOL and is designed to reflect its market price, less fees and expenses.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.grayscale.com/",
    },
    socials: {
      x: "https://x.com/Grayscale",
      linkedin: "https://www.linkedin.com/company/grayscale-investments/",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: grayscaleLogoDark,
      theme: "light",
      kind: "logo",
      width: 1050,
      height: 170,
    },
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: grayscaleLogoLight,
      theme: "dark",
      kind: "logo",
      width: 1050,
      height: 170,
    },
  ],
} satisfies CompanyRecord;
