import type { CompanyRecord } from "../../types";
import asymmetricResearchBreakpoint2026White from "../../../assets/companies/asymmetric-research/breakpoint-2026-white.svg";
import asymmetricResearchLogoLight from "../../../assets/companies/asymmetric-research/logo-light.svg";

export const asymmetricResearch = {
  id: "asymmetric-research",
  slug: "asymmetric-research",
  name: "Asymmetric Research",
  profile: {
    tagline: "Enabling Secure Innovation",
    summary:
      "Asymmetric Research is a web3 security and infrastructure firm providing research, incident response, security engineering, and blockchain validation.",
    description:
      "Asymmetric Research works through long-term, embedded partnerships with L1/L2 networks and DeFi protocols. Its services span security research, incident response, engineering, validation, and infrastructure. In the Solana ecosystem, the company runs validator infrastructure and contributes security expertise to Firedancer, Jito, Pyth, and Wormhole.",
    sector: "Infrastructure",
    type: "Company",
    links: {
      website: "https://www.asymmetric.re/",
      blog: "https://blog.asymmetric.re/",
      careers: "https://www.asymmetric.re/careers",
    },
    socials: {
      x: "https://x.com/asymmetric_re",
      linkedin: "https://www.linkedin.com/company/asymmetric-research",
      github: "https://github.com/asymmetric-research",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: asymmetricResearchBreakpoint2026White,
      theme: "dark",
      kind: "logo",
      treatment: "monotone",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: asymmetricResearchLogoLight,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
