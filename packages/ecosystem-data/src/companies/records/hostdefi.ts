import type { CompanyRecord } from "../../types";
import hostdefiLogo from "../../../assets/companies/hostdefi/logo.png";

export const hostdefi = {
  id: "hostdefi",
  slug: "hostdefi",
  name: "HostDeFi",
  profile: {
    tagline: "Token safety grades and non-custodial trading",
    summary:
      "HostDeFi is a non-custodial multi-chain decentralized exchange and token safety scanner covering Solana and EVM networks.",
    description:
      "HostDeFi grades tokens on on-chain safety signals — mint and freeze authority, liquidity depth, and holder distribution — and pairs the read with non-custodial swaps on Solana and EVM chains. The platform publishes a graded markets tracker, per-token risk pages, and a free risk-check API and Telegram bot for integrations and community tools.",
    sector: "DeFi",
    type: "Platform",
    links: {
      website: "https://hostdefi.com/",
      docs: "https://hostdefi.com/docs/api/",
    },
    socials: {
      telegram: "https://t.me/HostDeFiBot",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.png",
      format: "png",
      source: hostdefiLogo,
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
