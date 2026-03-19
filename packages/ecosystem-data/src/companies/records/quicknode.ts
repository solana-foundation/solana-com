import type { CompanyRecord } from "../../types";
import quicknodeLogo from "../../../assets/companies/quicknode/logo.svg";

export const quicknode = {
  "id": "quicknode",
  "slug": "quicknode",
  "name": "Quicknode",
  "profile": {
    "tagline": "Build, scale, and ship without compromise",
    "summary": "QuickNode provides high-performance RPC endpoints and developer tooling for building and scaling applications on Solana and other blockchains.",
    "description": "QuickNode is a multi-chain blockchain infrastructure platform that provides dedicated RPC endpoints, WebSocket subscriptions, and developer tools for production applications. On Solana, QuickNode serves over 50% of Solana projects with sub-100ms response times and 99.99% uptime. The platform offers Solana-specific add-ons including Jito bundles, Metaplex DAS for NFT data, Priority Fee API, and Jupiter swap routing.",
    "sector": "Infrastructure",
    "type": "Company",
    "links": {
      "website": "https://www.quicknode.com"
    },
    "socials": {
      "x": "https://x.com/QuickNode",
      "linkedin": "https://www.linkedin.com/company/quicknode",
      "discord": "https://discord.com/invite/quicknode",
      "github": "https://github.com/quiknode-labs"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": quicknodeLogo
    }
  ]
} satisfies CompanyRecord;
