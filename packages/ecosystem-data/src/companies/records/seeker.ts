import type { CompanyRecord } from "../../types";
import seekerBreakpoint2026White from "../../../assets/companies/seeker/breakpoint-2026-white.svg";

export const seeker = {
  id: "seeker",
  slug: "seeker",
  name: "Seeker",
  profile: {
    tagline: "The definitive Web3 mobile device",
    summary:
      "Seeker is Solana Mobile's crypto-native Android device, built around a hardware-protected Seed Vault and the Solana dApp Store.",
    description:
      "Seeker combines an Android smartphone with Solana Mobile's Seed Vault Wallet, which keeps signing keys in a hardware-protected environment. The device also gives users access to the Solana dApp Store, Seeker ID, and ecosystem rewards through its Genesis Token.",
    sector: "Wallet",
    type: "Platform",
    links: {
      website: "https://solanamobile.com/seeker",
    },
    socials: {
      x: "https://x.com/solanamobile",
      linkedin: "https://www.linkedin.com/company/solanamobile",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: seekerBreakpoint2026White,
      theme: "dark",
      kind: "wordmark",
    },
  ],
} satisfies CompanyRecord;
