import type { CompanyRecord } from "../../types";
import rampLogoDark from "../../../assets/companies/ramp/logo-dark.svg";
import rampLogoLight from "../../../assets/companies/ramp/logo-light.svg";
import rampLogoSquareDark from "../../../assets/companies/ramp/logo-square-dark.png";
import rampBreakpoint2026White from "../../../assets/companies/ramp/breakpoint-2026-white.png";
import rampLogoMonotone from "../../../assets/companies/ramp/logo-monotone.svg";

export const ramp = {
  id: "ramp",
  slug: "ramp",
  name: "Ramp",
  profile: {
    tagline:
      "The all-in-one financial operations platform designed to save businesses time and money",
    summary:
      "Ramp is a financial operations platform combining corporate cards, expense management, bill pay, procurement, and accounting automation for businesses.",
    description:
      "Ramp provides an integrated finance platform that helps businesses control spend, automate accounting, and close their books faster. Its product suite includes corporate cards, expense management, bill pay, procurement, travel, and treasury tools. Headquartered in New York, Ramp is used by more than 50,000 teams to streamline financial operations.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://ramp.com/",
    },
    socials: {
      x: "https://x.com/tryramp",
      linkedin: "https://www.linkedin.com/company/ramp",
    },
  },
  defaultLogoId: "logo-monotone",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: rampLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: rampLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-square-dark",
      fileName: "logo-square-dark.png",
      format: "png",
      source: rampLogoSquareDark,
      theme: "light",
      kind: "logo",
      background: "light",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: rampBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-monotone",
      fileName: "logo-monotone.svg",
      format: "svg",
      source: rampLogoMonotone,
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
