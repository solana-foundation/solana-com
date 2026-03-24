import type { CompanyRecord } from "../../types";
import visaLogo from "../../../assets/companies/visa/logo.png";
import visaLogoLight from "../../../assets/companies/visa/logo-light.svg";
import visaLogoDark from "../../../assets/companies/visa/logo-dark.svg";

export const visa = {
  id: "visa",
  slug: "visa",
  name: "Visa",
  profile: {
    tagline: "A world leader in digital payments",
    summary:
      "Visa has expanded its stablecoin settlement capabilities to the Solana blockchain, using USDC for cross-border payments between participating banks.",
    description:
      "Visa is a global payments network facilitating transactions across more than 200 countries and territories. The company expanded its stablecoin settlement pilot to Solana, leveraging the blockchain's high throughput and low transaction fees for USDC-based cross-border bank settlements. Visa chose Solana for its sub-cent transaction fees, 400ms slot times, and global validator network.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://visa.com",
    },
    socials: {
      x: "https://x.com/Visa",
      linkedin: "https://www.linkedin.com/company/visa",
      github: "https://github.com/visa",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo",
      fileName: "logo.png",
      format: "png",
      source: visaLogo,
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: visaLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: visaLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
