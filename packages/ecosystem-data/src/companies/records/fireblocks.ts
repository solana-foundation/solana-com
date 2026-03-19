import type { CompanyRecord } from "../../types";
import fireblocksLogo from "../../../assets/companies/fireblocks/logo.png";

export const fireblocks = {
  "id": "fireblocks",
  "slug": "fireblocks",
  "name": "Fireblocks",
  "profile": {
    "tagline": "Digital asset and stablecoin infrastructure",
    "summary": "Fireblocks provides enterprise-grade digital asset infrastructure for securely storing, transferring, and issuing assets on Solana and other blockchains.",
    "description": "Fireblocks is an enterprise digital asset infrastructure platform that enables institutions to build blockchain-based products and manage digital asset operations securely. The platform supports native Solana integration including SOL and SPL token custody, decoded program calls, gasless transactions, and tokenization capabilities. Fireblocks processes Solana transactions with sub-50ms broadcast times and sub-$0.01 fees.",
    "sector": "Infrastructure",
    "type": "Platform",
    "links": {
      "website": "https://www.fireblocks.com"
    },
    "socials": {
      "x": "https://x.com/FireblocksHQ",
      "linkedin": "https://www.linkedin.com/company/fireblocks",
      "github": "https://github.com/fireblocks"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.png",
      "format": "png",
      "source": fireblocksLogo
    }
  ]
} satisfies CompanyRecord;
