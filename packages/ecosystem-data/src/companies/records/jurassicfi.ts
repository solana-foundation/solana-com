import type { CompanyRecord } from "../../types";
import jurassicfiLogoWhiteOnBlack from "../../../assets/companies/jurassicfi/logo-white-on-black.svg";
import jurassicfiBreakpoint2026White from "../../../assets/companies/jurassicfi/breakpoint-2026-white.svg";

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
  defaultLogoId: "logo-white-on-black",
  logos: [
    {
      id: "logo-white-on-black",
      fileName: "logo-white-on-black.svg",
      format: "svg",
      source: jurassicfiLogoWhiteOnBlack,
      kind: "mark",
      background: "dark",
      width: 2491,
      height: 2491,
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: jurassicfiBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
      kind: "mark",
      background: "transparent",
      width: 2009,
      height: 1470,
    },
  ],
} satisfies CompanyRecord;
