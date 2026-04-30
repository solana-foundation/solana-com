import type { CompanyRecord } from "../../types";
import galaxyLogo from "../../../assets/companies/galaxy/logo.svg";
import galaxyLogoLight from "../../../assets/companies/galaxy/logo-light.svg";
import galaxyLogoDark from "../../../assets/companies/galaxy/logo-dark.svg";
import galaxyMarkLight from "../../../assets/companies/galaxy/mark-light.svg";
import galaxyMarkDark from "../../../assets/companies/galaxy/mark-dark.svg";

export const galaxy = {
  id: "galaxy",
  slug: "galaxy",
  name: "Galaxy",
  profile: {
    tagline: "Global leader in digital assets and data center infrastructure",
    summary:
      "Galaxy is a publicly traded digital asset and blockchain financial services firm that provides institutional-grade trading, asset management, and infrastructure solutions.",
    description:
      "Galaxy (TSX: GLXY) is a digital asset and blockchain leader founded by Michael Novogratz, headquartered in New York. The company operates three complementary businesses: Global Markets, Asset Management, and Digital Infrastructure Solutions, serving institutions, startups, and qualified individuals. Galaxy is a major participant in the Solana ecosystem and a significant SOL holder.",
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
  ],
} satisfies CompanyRecord;
