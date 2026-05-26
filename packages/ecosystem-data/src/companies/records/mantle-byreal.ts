import type { CompanyRecord } from "../../types";
import mantleByrealLogoBrand from "../../../assets/companies/mantle-byreal/logo-brand.svg";
import mantleByrealLogoDark from "../../../assets/companies/mantle-byreal/logo-dark.svg";
import mantleByrealLogoLight from "../../../assets/companies/mantle-byreal/logo-light.svg";
import mantleByrealLogoWhite from "../../../assets/companies/mantle-byreal/logo-white.svg";
import mantleByrealMarkDark from "../../../assets/companies/mantle-byreal/mark-dark.svg";

export const mantleByreal = {
  id: "mantle-byreal",
  slug: "mantle-byreal",
  name: "Mantle / Byreal",
  profile: {
    tagline: "Building the Liquidity Chain of the Future",
    summary:
      "Mantle is an Ethereum Layer 2 network that has expanded to Solana via the Mantle Super Portal and Byreal, a Solana-native decentralized exchange incubated by Bybit.",
    description:
      "Mantle Network is an Ethereum L2 blockchain focused on capital efficiency through modular architecture and zero-knowledge proofs. In partnership with Bybit and Byreal, Mantle launched the Super Portal, a native cross-chain infrastructure that bridges $MNT tokens between Ethereum and Solana. This integration positions $MNT as a cross-ecosystem asset connecting Ethereum L2 liquidity, Solana DeFi, and centralized exchange infrastructure.",
    sector: "DeFi",
    type: "Platform",
    links: {
      website: "https://www.mantle.xyz/",
    },
    socials: {
      x: "https://x.com/0xMantle",
      linkedin: "https://www.linkedin.com/company/0xmantle",
      discord: "https://discord.com/invite/0xMantle",
      telegram: "https://t.me/mantlenetwork",
      github: "https://github.com/mantlenetworkio",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: mantleByrealLogoDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: mantleByrealLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-white",
      fileName: "logo-white.svg",
      format: "svg",
      source: mantleByrealLogoWhite,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-brand",
      fileName: "logo-brand.svg",
      format: "svg",
      source: mantleByrealLogoBrand,
      treatment: "brand",
      kind: "logo",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: mantleByrealMarkDark,
      theme: "dark",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
