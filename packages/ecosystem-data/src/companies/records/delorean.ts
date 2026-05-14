import type { CompanyRecord } from "../../types";
import deloreanLogoLight from "../../../assets/companies/delorean/logo-light.png";
import deloreanLogoDark from "../../../assets/companies/delorean/logo-dark.png";

export const delorean = {
  id: "delorean",
  slug: "delorean",
  name: "DeLorean Labs",
  profile: {
    tagline: "DeLorean Web3 ecosystem",
    summary:
      "DeLorean Labs is the Web3 arm of DeLorean Motor Company, building tokenized vehicle reservations, digital collectibles, and onchain commerce experiences around the DeLorean brand.",
    description:
      "DeLorean Labs develops digital products and community experiences for the DeLorean ecosystem, including the $DMC token, collectible drops, and a marketplace for vehicle reservations and brand activations. The platform is built around the company's FLUX Protocol, which is designed to support digitally purchased, traded, authenticated, and tracked vehicle reservations. DeLorean Labs also operates community programs and ecosystem partnerships tied to its broader automotive and consumer brand strategy.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://deloreanlabs.com/",
    },
    socials: {
      x: "https://x.com/DeLoreanlabs",
      linkedin: "https://www.linkedin.com/company/delorean-labs",
      telegram: "https://t.me/deloreanlabs",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: deloreanLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: deloreanLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
