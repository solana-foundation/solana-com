import type { CompanyRecord } from "../../types";
import morganStanleyLogoLight from "../../../assets/companies/morgan-stanley/logo-light.svg";
import morganStanleyLogoDark from "../../../assets/companies/morgan-stanley/logo-dark.svg";

export const morganStanley = {
  id: "morgan-stanley",
  slug: "morgan-stanley",
  name: "Morgan Stanley",
  profile: {
    tagline: "Global financial services firm",
    summary:
      "Morgan Stanley Investment Management filed initial registration statements for two Solana cryptocurrency ETPs, expanding institutional access to SOL.",
    description:
      "Morgan Stanley is a global financial services firm providing investment banking, securities, wealth management, and investment management services. The firm is expanding access to Solana for retail and institutional clients through the Morgan Stanley Solana Trust, designed to track the price of SOL with a staking component.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.morganstanley.com",
    },
    socials: {
      x: "https://x.com/MorganStanley",
      linkedin: "https://www.linkedin.com/company/morgan-stanley",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: morganStanleyLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: morganStanleyLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
