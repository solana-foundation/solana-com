import type { CompanyRecord } from "../../types";
import orbisLogo from "../../../assets/companies/orbis/logo.svg";

export const orbis = {
  id: "orbis",
  slug: "orbis",
  name: "Orbis",
  profile: {
    tagline: "Pay-per-call APIs for AI agents.",
    summary:
      "Orbis is an x402 API marketplace with 2,000+ endpoints for AI agents, accepting Solana USDC and Base USDC micropayments with no API keys or subscriptions.",
    description:
      "Orbis is a pay-per-call API marketplace built on the x402 protocol, providing AI agents with access to 2,000+ endpoints across crypto data, web search, social data, geolocation, and utilities. Agents pay in USDC on Solana mainnet or Base with no API keys or subscriptions required. The platform natively supports both eip155:8453 (Base) and solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp (Solana mainnet) payment networks.",
    sector: "Developer Tools",
    type: "Platform",
    links: {
      website: "https://orbisapi.com",
    },
    socials: {
      x: "https://x.com/orbisapi",
      github: "https://github.com/orbisapi",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: orbisLogo,
    },
  ],
} satisfies CompanyRecord;
