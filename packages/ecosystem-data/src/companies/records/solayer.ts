import type { CompanyRecord } from "../../types";
import solayerLogo from "../../../assets/companies/solayer/logo.svg";

export const solayer = {
  "id": "solayer",
  "slug": "solayer",
  "name": "Solayer",
  "profile": {
    "tagline": "Hardware-accelerated SVM",
    "summary": "Solayer is Solana's native restaking protocol, enabling SOL holders to extend the utility of their staked assets to secure additional services and protocols within the ecosystem.",
    "description": "Solayer is the first native restaking and liquid restaking protocol on Solana, allowing SOL holders to restake their assets to secure Actively Validated Services (AVSs) such as oracles and bridges. Users receive sSOL in exchange for their staked SOL, earning additional yield while improving the security and reliability of ecosystem services. Solayer also offers sUSD, a yield-bearing stablecoin backed by US Treasury Bonds, and is building InfiniSVM, a hardware-accelerated SVM blockchain.",
    "sector": "Restaking",
    "type": "Protocol",
    "links": {
      "website": "https://solayer.org/"
    },
    "socials": {
      "x": "https://x.com/solayer_labs",
      "linkedin": "https://www.linkedin.com/company/solayer-labs",
      "discord": "https://discord.com/invite/solayerlabs",
      "telegram": "https://t.me/solayer_discussion",
      "github": "https://github.com/solayer-labs"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": solayerLogo
    }
  ]
} satisfies CompanyRecord;
