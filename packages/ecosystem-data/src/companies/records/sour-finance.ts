import type { CompanyRecord } from "../../types";
import sourFinanceLogo from "../../../assets/companies/sour-finance/logo.svg";

export const sourFinance = {
  id: "sour-finance",
  slug: "sour-finance",
  name: "Sour",
  legalName: "Sour Finance",
  profile: {
    tagline: "The perp DEX that bites back.",
    summary:
      "Solana perpetuals DEX with batch clearing every 1.8 seconds, flat 3 bps fees, and formally verified settlement.",
    description:
      "Sour is a non-custodial perpetual futures DEX on Solana. Every order in a 1.8-second batch settles at one uniform clearing price, removing the front-run / back-run lanes that continuous orderbook perp DEXes leave open. Funding is computed inside every batch — no off-chain cron, no liquidation keeper. Trading fee is a flat 3 basis points per fill, regardless of size, taker/maker, or volume tier; 100% of fees route to the SOUR LP vault. Settlement and aggregate-budget math are formally verified with 18 Kani proofs, a Lean specification, and 15 property tests at github.com/GageBachik/sour-verification.",
    founded: "2026",
    sector: "DeFi",
    type: "Protocol",
    links: {
      website: "https://sour.finance",
      app: "https://app.sour.finance",
      docs: "https://sour.finance/docs",
    },
    socials: {
      x: "https://x.com/sourfinance",
      github: "https://github.com/GageBachik/sour",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: sourFinanceLogo,
    },
  ],
} satisfies CompanyRecord;
