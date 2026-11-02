import type { CompanyRecord } from "../../types";
import tetherLogoLight from "../../../assets/companies/tether/logo-light.svg";
import tetherLogoDark from "../../../assets/companies/tether/logo-dark.svg";
import tetherBreakpoint2026White from "../../../assets/companies/tether/breakpoint-2026-white.svg";

export const tether = {
  id: "tether",
  slug: "tether",
  name: "Tether",
  profile: {
    tagline: "Fiat-pegged digital tokens across blockchains.",
    summary:
      "Tether issues fiat-pegged digital tokens, including USD₮, on Solana and other blockchain networks.",
    description:
      "Tether develops and issues digital tokens designed to track the value of fiat currencies. USD₮ is available on Solana and other supported networks, enabling transfers between compatible wallets and services.",
    sector: "Payments",
    type: "Company",
    links: { website: "https://tether.to/" },
    socials: {
      x: "https://x.com/tether",
      linkedin: "https://www.linkedin.com/company/tether",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: tetherLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: tetherLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: tetherBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
