import type { CompanyRecord } from "../../types";
import fireblocksLogoDark from "../../../assets/companies/fireblocks/logo-dark.svg";
import fireblocksLogoLight from "../../../assets/companies/fireblocks/logo-light.svg";
import fireblocksMarkDark from "../../../assets/companies/fireblocks/mark-dark.svg";
import fireblocksMarkLight from "../../../assets/companies/fireblocks/mark-light.svg";
import fireblocksWordmarkDark from "../../../assets/companies/fireblocks/wordmark-dark.svg";
import fireblocksWordmarkLight from "../../../assets/companies/fireblocks/wordmark-light.svg";

export const fireblocks = {
  id: "fireblocks",
  slug: "fireblocks",
  name: "Fireblocks",
  profile: {
    tagline: "Digital asset and stablecoin infrastructure",
    summary:
      "Fireblocks provides enterprise-grade digital asset infrastructure for securely storing, transferring, and issuing assets on Solana and other blockchains.",
    description:
      "Fireblocks is an enterprise digital asset infrastructure platform that enables institutions to build blockchain-based products and manage digital asset operations securely. The platform supports native Solana integration including SOL and SPL token custody, decoded program calls, gasless transactions, and tokenization capabilities. Fireblocks processes Solana transactions with sub-50ms broadcast times and sub-$0.01 fees.",
    sector: "Infrastructure",
    type: "Platform",
    links: {
      website: "https://www.fireblocks.com",
    },
    socials: {
      x: "https://x.com/FireblocksHQ",
      linkedin: "https://www.linkedin.com/company/fireblocks",
      github: "https://github.com/fireblocks",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: fireblocksLogoDark,
      theme: "light",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: fireblocksLogoLight,
      theme: "dark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: fireblocksMarkDark,
      kind: "mark",
      theme: "light",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: fireblocksMarkLight,
      kind: "mark",
      theme: "dark",
    },
    {
      id: "wordmark-dark",
      fileName: "wordmark-dark.svg",
      format: "svg",
      source: fireblocksWordmarkDark,
      kind: "wordmark",
      theme: "light",
    },
    {
      id: "wordmark-light",
      fileName: "wordmark-light.svg",
      format: "svg",
      source: fireblocksWordmarkLight,
      kind: "wordmark",
      theme: "dark",
    },
  ],
} satisfies CompanyRecord;
