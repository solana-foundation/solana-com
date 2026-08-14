import type { CompanyRecord } from "../../types";
import sec3Breakpoint2026White from "../../../assets/companies/sec3/breakpoint-2026-white.png";
import sec3LogoLight from "../../../assets/companies/sec3/logo-light.png";
import sec3LogoDark from "../../../assets/companies/sec3/logo-dark.png";

export const sec3 = {
  id: "sec3",
  slug: "sec3",
  name: "Sec3",
  profile: {
    tagline: "Security for Solana protocols",
    summary:
      "Sec3 provides security audits, formal verification, and monitoring for Solana protocols.",
    description:
      "Sec3 combines academic program-analysis research with adversarial security expertise to review Solana programs. Its services include manual security audits, formal verification, and post-deployment monitoring, alongside open-source static analysis and IDL tooling.",
    sector: "Developer Tools",
    type: "Company",
    links: {
      website: "https://sec3.dev/",
    },
    socials: {
      x: "https://x.com/sec3dev",
      github: "https://github.com/sec3-product",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: sec3Breakpoint2026White,
      theme: "dark",
      kind: "logo",
      treatment: "monotone",
    },
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: sec3LogoLight,
      theme: "light",
      kind: "logo",
      background: "light",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: sec3LogoDark,
      theme: "dark",
      kind: "logo",
      background: "transparent",
    },
  ],
} satisfies CompanyRecord;
