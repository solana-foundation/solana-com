import type { CompanyRecord } from "../../types";
import galaxyBreakpoint2026White from "../../../assets/companies/galaxy/breakpoint-2026-white.png";
import galaxyLogo from "../../../assets/companies/galaxy/logo.svg";
import galaxyLogoLight from "../../../assets/companies/galaxy/logo-light.svg";
import galaxyLogoDark from "../../../assets/companies/galaxy/logo-dark.svg";
import galaxyMarkLight from "../../../assets/companies/galaxy/mark-light.svg";
import galaxyMarkDark from "../../../assets/companies/galaxy/mark-dark.svg";
import galaxyLogoGalaxyOne from "../../../assets/companies/galaxy/logo-galaxy-one.svg";

export const galaxy = {
  id: "galaxy",
  slug: "galaxy",
  name: "Galaxy",
  profile: {
    tagline: "Digital assets and data center leader",
    summary:
      "Galaxy provides institutional digital-asset markets, asset management, staking, custody technology, and digital infrastructure services.",
    description:
      "Galaxy serves institutions and investors through trading, lending, derivatives, asset management, staking, and custody technology. It also operates digital infrastructure and data center businesses while participating in digital-asset networks including Solana.",
    sector: "Infrastructure",
    type: "Company",
    links: {
      website: "https://www.galaxy.com/",
    },
    socials: {
      x: "https://x.com/galaxyhq",
      linkedin: "https://www.linkedin.com/company/galaxyhq",
      github: "https://github.com/galaxy-digital",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: galaxyBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: galaxyLogo,
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: galaxyLogoLight,
      theme: "light",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: galaxyLogoDark,
      theme: "dark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: galaxyMarkLight,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: galaxyMarkDark,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "logo-galaxy-one",
      fileName: "logo-galaxy-one.svg",
      format: "svg",
      source: galaxyLogoGalaxyOne,
    },
  ],
} satisfies CompanyRecord;
