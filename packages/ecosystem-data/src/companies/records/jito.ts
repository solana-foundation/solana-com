import type { CompanyRecord } from "../../types";
import jitoBreakpoint2026White from "../../../assets/companies/jito/breakpoint-2026-white.svg";
import jitoLogo from "../../../assets/companies/jito/logo.svg";
import jitoLogoBlack from "../../../assets/companies/jito/logo-black.svg";
import jitoLogoBlackJpg from "../../../assets/companies/jito/logo-black.jpg";
import jitoLogoBlackPng from "../../../assets/companies/jito/logo-black.png";
import jitoLogoBlack2x from "../../../assets/companies/jito/logo-black@2x.png";
import jitoLogoBlack3x from "../../../assets/companies/jito/logo-black@3x.png";
import jitoLogoGreen from "../../../assets/companies/jito/logo-green.svg";
import jitoLogoGreenJpg from "../../../assets/companies/jito/logo-green.jpg";
import jitoLogoGreenPng from "../../../assets/companies/jito/logo-green.png";
import jitoLogoGreen2x from "../../../assets/companies/jito/logo-green@2x.png";
import jitoLogoGreen3x from "../../../assets/companies/jito/logo-green@3x.png";
import jitoLogoWhitePng from "../../../assets/companies/jito/logo-white.png";
import jitoLogoWhite2x from "../../../assets/companies/jito/logo-white@2x.png";
import jitoLogoWhite3x from "../../../assets/companies/jito/logo-white@3x.png";

export const jito = {
  id: "jito",
  slug: "jito",
  name: "Jito",
  profile: {
    tagline: "Non-custodial liquid staking on Solana",
    summary:
      "Jito is the largest DeFi protocol on Solana, providing non-custodial liquid staking with MEV rewards and MEV-optimized validator infrastructure.",
    description:
      "Jito operates two core products on Solana: a liquid staking protocol that lets users stake any amount of SOL and receive JitoSOL with auto-compounded rewards amplified by MEV extraction, and a MEV infrastructure suite including an open-source validator client and transaction relayer. The Jito Foundation governs the protocol through JTO token holders who shape its development.",
    sector: "Staking",
    type: "Protocol",
    links: {
      website: "https://www.jito.network/",
    },
    socials: {
      x: "https://x.com/jito_sol",
      linkedin: "https://www.linkedin.com/company/jito-labs",
      discord: "https://discord.gg/jito",
      github: "https://github.com/jito-foundation",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: jitoBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: jitoLogo,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-white-png",
      fileName: "logo-white.png",
      format: "png",
      source: jitoLogoWhitePng,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-white-2x",
      fileName: "logo-white@2x.png",
      format: "png",
      source: jitoLogoWhite2x,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-white-3x",
      fileName: "logo-white@3x.png",
      format: "png",
      source: jitoLogoWhite3x,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-black",
      fileName: "logo-black.svg",
      format: "svg",
      source: jitoLogoBlack,
      theme: "light",
      treatment: "monotone",
    },
    {
      id: "logo-black-png",
      fileName: "logo-black.png",
      format: "png",
      source: jitoLogoBlackPng,
      theme: "light",
      treatment: "monotone",
    },
    {
      id: "logo-black-jpg",
      fileName: "logo-black.jpg",
      format: "jpg",
      source: jitoLogoBlackJpg,
      theme: "light",
      treatment: "monotone",
    },
    {
      id: "logo-black-2x",
      fileName: "logo-black@2x.png",
      format: "png",
      source: jitoLogoBlack2x,
      theme: "light",
      treatment: "monotone",
    },
    {
      id: "logo-black-3x",
      fileName: "logo-black@3x.png",
      format: "png",
      source: jitoLogoBlack3x,
      theme: "light",
      treatment: "monotone",
    },
    {
      id: "logo-green",
      fileName: "logo-green.svg",
      format: "svg",
      source: jitoLogoGreen,
    },
    {
      id: "logo-green-png",
      fileName: "logo-green.png",
      format: "png",
      source: jitoLogoGreenPng,
    },
    {
      id: "logo-green-jpg",
      fileName: "logo-green.jpg",
      format: "jpg",
      source: jitoLogoGreenJpg,
    },
    {
      id: "logo-green-2x",
      fileName: "logo-green@2x.png",
      format: "png",
      source: jitoLogoGreen2x,
    },
    {
      id: "logo-green-3x",
      fileName: "logo-green@3x.png",
      format: "png",
      source: jitoLogoGreen3x,
    },
  ],
} satisfies CompanyRecord;
