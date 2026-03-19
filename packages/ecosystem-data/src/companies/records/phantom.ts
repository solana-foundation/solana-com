import type { CompanyRecord } from "../../types";
import phantomLogo from "../../../assets/companies/phantom/logo.svg";

export const phantom = {
  "id": "phantom",
  "slug": "phantom",
  "name": "Phantom",
  "profile": {
    "tagline": "The crypto app for everyone",
    "summary": "Phantom is a self-custodial multi-chain crypto wallet originally built for Solana, supporting token management, swaps, NFTs, and dApp interactions.",
    "description": "Phantom is a leading self-custodial crypto wallet that originated on Solana and has expanded to support Ethereum, Bitcoin, Base, and Sui. It provides a unified interface for buying, storing, sending, swapping tokens, and managing NFTs across supported chains. Phantom is available as a browser extension for Chrome, Brave, and Firefox, as well as native mobile apps on iOS and Android.",
    "sector": "Wallet",
    "type": "Company",
    "links": {
      "website": "https://phantom.com"
    },
    "socials": {
      "x": "https://x.com/phantom",
      "linkedin": "https://www.linkedin.com/company/phantomwallet",
      "discord": "https://discord.gg/phantom",
      "github": "https://github.com/phantom"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": phantomLogo
    }
  ]
} satisfies CompanyRecord;
