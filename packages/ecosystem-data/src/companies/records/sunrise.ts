import type { CompanyRecord } from "../../types";
import sunriseLogo from "../../../assets/companies/sunrise/logo.svg";

export const sunrise = {
  "id": "sunrise",
  "slug": "sunrise",
  "name": "Sunrise",
  "profile": {
    "tagline": "Any onchain asset, from any chain, live on Solana on day one",
    "summary": "Sunrise is an asset tokenization layer for Solana that brings newly launched onchain assets from other ecosystems into Solana with day-one liquidity and immediate DeFi utility.",
    "description": "Sunrise provides a gateway for external onchain assets to arrive on Solana with trading liquidity from launch. The platform is designed to let users access newly listed crypto assets from other chains without leaving the Solana ecosystem, while enabling issuers and liquidity providers to seed markets for day-one trading. Sunrise is made by Wormhole Labs and is positioned for crypto assets, tokenized stocks, commodities, and other real-world assets.",
    "sector": "Tokenization",
    "type": "Platform",
    "links": {
      "website": "https://www.sunrisedefi.com/"
    },
    "socials": {
      "x": "https://x.com/Sunrise_DeFi"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": sunriseLogo
    }
  ]
} satisfies CompanyRecord;
