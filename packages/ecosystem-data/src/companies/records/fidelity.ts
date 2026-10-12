import type { CompanyRecord } from "../../types";
import fidelityFcatLogoDark from "../../../assets/companies/fidelity/fcat-logo-dark.svg";

export const fidelity = {
  id: "fidelity",
  slug: "fidelity",
  name: "Fidelity Center for Applied Technology",
  profile: {
    tagline: "Technology research and product development at Fidelity.",
    summary:
      "The Fidelity Center for Applied Technology researches and develops technology for Fidelity Investments, including blockchain work and a Solana validator.",
    description:
      "The Fidelity Center for Applied Technology is Fidelity Investments’ research and product development group. Its blockchain work includes a Solana validator and research into digital asset infrastructure.",
    sector: "Staking",
    type: "Company",
    links: {
      website: "https://www.fcatalyst.com/",
    },
    socials: {
      x: "https://twitter.com/FCATalyst",
    },
  },
  defaultLogoId: "fcat-logo-dark",
  logos: [
    {
      id: "fcat-logo-dark",
      fileName: "fcat-logo-dark.svg",
      format: "svg",
      source: fidelityFcatLogoDark,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
