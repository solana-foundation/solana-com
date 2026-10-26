import type { CompanyRecord } from "../../types";
import agantBreakpoint2026White from "../../../assets/companies/agant/breakpoint-2026-white.svg";

export const agant = {
  id: "agant",
  slug: "agant",
  name: "Agant",
  profile: {
    tagline: "Sterling stablecoin infrastructure for businesses.",
    summary:
      "Agant is a UK-based issuer of GBPA, a pound sterling stablecoin available on Solana and other networks.",
    description:
      "Agant issues GBPA, a digital representation of the pound sterling designed for business payments and settlement. Its infrastructure supports conversion between fiat and stablecoins and operates across Solana and several other blockchains.",
    sector: "Payments",
    type: "Company",
    links: { website: "https://www.agant.io/" },
    socials: {
      x: "https://x.com/AgantFinance",
      linkedin: "https://www.linkedin.com/company/agant-finance",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: agantBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
