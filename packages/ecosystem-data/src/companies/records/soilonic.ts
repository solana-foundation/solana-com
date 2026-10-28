import type { CompanyRecord } from "../../types";
import soilonicBreakpoint2026Logo from "../../../assets/companies/soilonic/breakpoint-2026-logo.png";

export const soilonic = {
  id: "soilonic",
  slug: "soilonic",
  name: "Soilonic",
  profile: {
    tagline: "The world's first tradeable token backed by healthy fertile soil",
    summary:
      "Soilonic is a Solana-based platform that tokenizes certified fertile soil to create economic value for regenerative farmers.",
    description:
      "Soilonic connects regenerative agriculture with onchain ownership through its soil-backed token, Soilo. The platform is designed to direct value to farmers maintaining healthy soil while making verified regenerative soil accessible as a digital asset.",
    sector: "Tokenization",
    type: "Platform",
    links: {
      website: "https://soilonic.com/",
    },
    socials: {
      linkedin: "https://www.linkedin.com/company/soilonic",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-logo.png",
      format: "png",
      source: soilonicBreakpoint2026Logo,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
