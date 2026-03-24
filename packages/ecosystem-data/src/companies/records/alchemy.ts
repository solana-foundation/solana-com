import type { CompanyRecord } from "../../types";
import alchemyLogoBlack from "../../../assets/companies/alchemy/logo-black.svg";
import alchemyLogoColor from "../../../assets/companies/alchemy/logo-color.svg";
import alchemyLogoWhiteBlue from "../../../assets/companies/alchemy/logo-white-blue.svg";
import alchemyLogoWhite from "../../../assets/companies/alchemy/logo-white.svg";
import alchemyLogomarkWhite from "../../../assets/companies/alchemy/logomark-white.svg";
import alchemyLogomark from "../../../assets/companies/alchemy/logomark.svg";

export const alchemy = {
  id: "alchemy",
  slug: "alchemy",
  name: "Alchemy",
  profile: {
    tagline: "Infrastructure that moves billions at scale.",
    summary:
      "Web3 development platform providing blockchain infrastructure, APIs, and developer tools across multiple chains including Solana.",
    description:
      "Alchemy is a web3 development platform providing blockchain infrastructure, APIs, SDKs, and developer tools. Its Solana offering includes archive data retrieval, gRPC streaming, enhanced RPC endpoints, and staked transaction connections purpose-built for Solana's architecture. The platform also provides embedded wallets, gasless transactions, webhooks, and portfolio APIs across over 100 supported chains.",
    sector: "Infrastructure",
    type: "Platform",
    links: {
      website: "https://www.alchemy.com/",
    },
    socials: {
      x: "https://x.com/Alchemy",
      linkedin: "https://www.linkedin.com/company/alchemyinc/",
      discord: "https://discord.gg/9GnAcXQYZ6",
      github: "https://github.com/alchemyplatform",
    },
  },
  defaultLogoId: "logo-white",
  logos: [
    {
      id: "logo-black",
      fileName: "logo-black.svg",
      format: "svg",
      source: alchemyLogoBlack,
    },
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      source: alchemyLogoColor,
    },
    {
      id: "logo-white-blue",
      fileName: "logo-white-blue.svg",
      format: "svg",
      source: alchemyLogoWhiteBlue,
    },
    {
      id: "logo-white",
      fileName: "logo-white.svg",
      format: "svg",
      source: alchemyLogoWhite,
    },
    {
      id: "logomark-white",
      fileName: "logomark-white.svg",
      format: "svg",
      source: alchemyLogomarkWhite,
      kind: "mark",
    },
    {
      id: "logomark",
      fileName: "logomark.svg",
      format: "svg",
      source: alchemyLogomark,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
