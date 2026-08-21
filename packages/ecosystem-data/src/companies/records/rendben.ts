import type { CompanyRecord } from "../../types";
import rendbenLogo from "../../../assets/companies/rendben/logo.svg";

export const rendben = {
  id: "rendben",
  slug: "rendben",
  name: "Rendben",
  profile: {
    tagline: "The payment layer for AI agents and internet businesses",
    summary:
      "Rendben is a non-custodial checkout that settles USDC payments on Solana directly into a merchant's own wallet.",
    description:
      "Rendben provides hosted checkout pages, a payments API and a Model Context Protocol server for accepting USDC on Solana. The customer signs a single atomic transaction that transfers the merchant's share to a wallet Rendben holds no key for and the fee to Rendben, so both transfers settle or neither does. The Solana transaction is built server-side from a frozen payment intent and verified against on-chain data before a payment is treated as complete.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://rendben.com",
      docs: "https://rendben.com/docs/api",
    },
    socials: {
      x: "https://x.com/joelsstafford",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: rendbenLogo,
    },
  ],
} satisfies CompanyRecord;
