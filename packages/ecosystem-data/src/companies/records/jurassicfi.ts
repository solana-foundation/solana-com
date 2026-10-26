import type { CompanyRecord } from "../../types";
import jurassicfiBreakpoint2026White from "../../../assets/companies/jurassicfi/breakpoint-2026-white.png";

export const jurassicfi = {
  id: "jurassicfi",
  slug: "jurassicfi",
  name: "JurassicFi",
  profile: {
    tagline: "Tokenized dinosaur fossils on Solana.",
    summary:
      "Jurassic Finance structures ownership of authenticated dinosaur fossils through asset-specific entities and Solana tokens.",
    description:
      "Jurassic Finance Labs sources and acquires authenticated dinosaur fossils. Each specimen is held through a dedicated legal entity, with related ownership interests represented by transferable SPL tokens on Solana.",
    sector: "Tokenization",
    type: "Platform",
    links: { website: "https://jurassic.finance/" },
    socials: {
      x: "https://x.com/JurassicFi",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: jurassicfiBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
