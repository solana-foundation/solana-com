import type { CompanyRecord } from "../../types";
import mantleLogo from "../../../assets/companies/mantle/logo.svg";

export const mantle = {
  id: "mantle",
  slug: "mantle",
  name: "Mantle",
  profile: {
    tagline: "Building the Liquidity Chain of the Future",
    summary:
      "Mantle Network is an Ethereum Layer 2 network focused on capital efficiency through modular architecture, data availability, and zero-knowledge proofs.",
    description:
      "Mantle Network is an Ethereum L2 blockchain designed to improve capital efficiency in the on-chain economy through modular architecture, data availability solutions, and zero-knowledge proofs.",
    sector: "Infrastructure",
    type: "Platform",
    links: {
      website: "https://www.mantle.xyz/",
    },
    socials: {
      x: "https://x.com/Mantle_Official",
      discord: "https://discord.com/invite/0xMantle",
      telegram: "https://t.me/mantlenetwork",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: mantleLogo,
      theme: "dark",
      kind: "wordmark",
    },
  ],
} satisfies CompanyRecord;
