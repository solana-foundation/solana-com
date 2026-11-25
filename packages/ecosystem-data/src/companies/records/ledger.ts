import type { CompanyRecord } from "../../types";
import ledgerMarkBlack from "../../../assets/companies/ledger/mark-black.svg";
import ledgerWordmarkBlack from "../../../assets/companies/ledger/wordmark-black.svg";
import ledgerWordmarkWhite from "../../../assets/companies/ledger/wordmark-white.svg";

export const ledger = {
  id: "ledger",
  slug: "ledger",
  name: "Ledger",
  profile: {
    tagline: "Hardware wallets for digital asset self-custody.",
    summary:
      "Ledger develops hardware wallets and software for managing digital assets, including SOL and Solana tokens.",
    description:
      "Ledger builds hardware signing devices that keep private keys offline and let users review and approve transactions. Its wallet app supports sending, receiving, swapping, and staking supported assets, while Ledger Enterprise provides digital asset infrastructure for institutions.",
    sector: "Wallet",
    type: "Company",
    links: { website: "https://www.ledger.com/" },
    socials: {
      x: "https://x.com/Ledger",
      linkedin: "https://www.linkedin.com/company/ledgerhq/",
      github: "https://github.com/LedgerHQ",
      discord: "https://discord.com/invite/ledger",
      youtube: "https://www.youtube.com/LEDGER",
    },
  },
  defaultLogoId: "wordmark-black",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "wordmark-white.svg",
      format: "svg",
      source: ledgerWordmarkWhite,
      theme: "dark",
      kind: "logo",
      background: "transparent",
      treatment: "monotone",
      width: 568,
      height: 190,
    },
    {
      id: "mark-black",
      fileName: "mark-black.svg",
      format: "svg",
      source: ledgerMarkBlack,
      theme: "light",
      kind: "mark",
      background: "transparent",
      width: 768.91,
      height: 669.35,
    },
    {
      id: "wordmark-black",
      fileName: "wordmark-black.svg",
      format: "svg",
      source: ledgerWordmarkBlack,
      theme: "light",
      kind: "wordmark",
      background: "transparent",
      width: 2000.58,
      height: 669.35,
    },
    {
      id: "wordmark-white",
      fileName: "wordmark-white.svg",
      format: "svg",
      source: ledgerWordmarkWhite,
      theme: "dark",
      kind: "wordmark",
      background: "transparent",
      width: 568,
      height: 190,
    },
  ],
} satisfies CompanyRecord;
