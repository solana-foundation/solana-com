import type { CompanyRecord } from "../../types";
import atxpLogo from "../../../assets/companies/atxp/logo.svg";

export const atxp = {
  "id": "atxp",
  "slug": "atxp",
  "name": "ATXP",
  "profile": {
    "tagline": "A web-wide protocol for agentic payments",
    "summary": "ATXP is a protocol built by Circuit & Chisel that enables AI agents to autonomously handle commerce from discovery to payment, with support for Solana-based micropayments.",
    "description": "ATXP (developed by Circuit & Chisel) is a web-wide protocol enabling AI agents to manage the full commerce lifecycle — discovery, negotiation, and payment — without human oversight. The protocol supports instant, nested, delegated micropayments between AI agents. Circuit & Chisel raised $19.2 million in seed funding led by Primary Venture Partners and ParaFi Capital, with participation from Stripe, Coinbase Ventures, Solana Ventures, and Samsung Next.",
    "sector": "Payments",
    "type": "Protocol",
    "links": {
      "website": "https://circuitandchisel.com"
    },
    "socials": {
      "x": "https://x.com/atxp_ai",
      "linkedin": "https://www.linkedin.com/company/circuit-chisel",
      "github": "https://github.com/atxp-dev"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": atxpLogo
    }
  ]
} satisfies CompanyRecord;
