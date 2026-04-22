import type { CompanyRecord } from "../../types";
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
      id: "logo-monotone",
      fileName: "logo-monotone.svg",
      format: "svg",
      source: rampLogoMonotone,
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
