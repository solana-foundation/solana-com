import type { CompanyRecord } from "../../types";
import metaplexBreakpoint2026White from "../../../assets/companies/metaplex/breakpoint-2026-white.svg";
import metaplexBreakpoint2026WhitePng from "../../../assets/companies/metaplex/breakpoint-2026-white.png";
import metaplexLogoBlack from "../../../assets/companies/metaplex/logo-black.svg";
import metaplexLogoBlackPng from "../../../assets/companies/metaplex/logo-black.png";
import metaplexMarkBlack from "../../../assets/companies/metaplex/mark-black.svg";
import metaplexMarkWhite from "../../../assets/companies/metaplex/mark-white.svg";
import metaplexWordmarkBlack from "../../../assets/companies/metaplex/wordmark-black.svg";
import metaplexWordmarkWhite from "../../../assets/companies/metaplex/wordmark-white.svg";

export const metaplex = {
  id: "metaplex",
  slug: "metaplex",
  name: "Metaplex",
  profile: {
    tagline: "The digital asset standard on Solana",
    summary:
      "Metaplex is an onchain protocol for creating and managing tokens and NFTs on Solana. Its programs define the digital asset standards used across the Solana ecosystem.",
    description:
      "Metaplex provides the core programs and standards for digital assets on Solana, including Token Metadata, Core, Bubblegum for compressed NFTs, Candy Machine for NFT launches, and Genesis for token generation events. It also maintains developer tooling such as the Umi JavaScript client and the DAS API for indexing and reading asset data. The protocol is stewarded by the Metaplex Foundation and governed with the MPLX token.",
    sector: "Infrastructure",
    type: "Protocol",
    links: {
      website: "https://www.metaplex.com/",
    },
    socials: {
      x: "https://x.com/metaplex",
      linkedin: "https://www.linkedin.com/company/metaplex-foundation",
      discord: "https://discord.com/invite/metaplex",
      github: "https://github.com/metaplex-foundation",
    },
  },
  defaultLogoId: "logo-black",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: metaplexBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "breakpoint-2026-white-png",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: metaplexBreakpoint2026WhitePng,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-black",
      fileName: "logo-black.svg",
      format: "svg",
      source: metaplexLogoBlack,
      theme: "light",
      treatment: "monotone",
    },
    {
      id: "logo-black-png",
      fileName: "logo-black.png",
      format: "png",
      source: metaplexLogoBlackPng,
      theme: "light",
      treatment: "monotone",
    },
    {
      id: "mark-black",
      fileName: "mark-black.svg",
      format: "svg",
      source: metaplexMarkBlack,
      theme: "light",
      kind: "mark",
      treatment: "monotone",
    },
    {
      id: "mark-white",
      fileName: "mark-white.svg",
      format: "svg",
      source: metaplexMarkWhite,
      theme: "dark",
      kind: "mark",
      treatment: "monotone",
    },
    {
      id: "wordmark-black",
      fileName: "wordmark-black.svg",
      format: "svg",
      source: metaplexWordmarkBlack,
      theme: "light",
      kind: "wordmark",
      treatment: "monotone",
    },
    {
      id: "wordmark-white",
      fileName: "wordmark-white.svg",
      format: "svg",
      source: metaplexWordmarkWhite,
      theme: "dark",
      kind: "wordmark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
