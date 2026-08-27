import type { CompanyRecord } from "../../types";
import raikuBreakpoint2026White from "../../../assets/companies/raiku/breakpoint-2026-white.png";
import raikuLogoDark from "../../../assets/companies/raiku/logo-dark.png";
import raikuLogoGreen from "../../../assets/companies/raiku/logo-green.png";

export const raiku = {
  id: "raiku",
  slug: "raiku",
  name: "Raiku",
  profile: {
    tagline: "Land every transaction, when and where you need it",
    summary:
      "Raiku is a Solana infrastructure protocol and validator client for predictable transaction inclusion and low-latency execution.",
    description:
      "Raiku provides a lightweight Solana validator client that supports ahead-of-time compute reservations and just-in-time MEV bundle processing. Its blockspace marketplace helps applications, traders, institutions, and validators coordinate predictable execution during periods of network stress while working with existing Solana validator infrastructure.",
    sector: "Infrastructure",
    type: "Protocol",
    links: {
      website: "https://raiku.com",
      docs: "https://docs.raiku.com/",
    },
    socials: {
      x: "https://x.com/raikucom",
      linkedin: "https://www.linkedin.com/company/raikucom",
      discord: "https://discord.com/invite/raikucom",
      github: "https://github.com/raiku-protocol",
    },
  },
  defaultLogoId: "logo-green",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: raikuBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-green",
      fileName: "logo-green.png",
      format: "png",
      source: raikuLogoGreen,
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: raikuLogoDark,
      theme: "light",
    },
  ],
} satisfies CompanyRecord;
