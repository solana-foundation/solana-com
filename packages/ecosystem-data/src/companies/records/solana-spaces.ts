import type { CompanyRecord } from "../../types";
import solanaSpacesLogoLight from "../../../assets/companies/solana-spaces/logo-light.svg";
import solanaSpacesLogoDark from "../../../assets/companies/solana-spaces/logo-dark.svg";

export const solanaSpaces = {
  id: "solana-spaces",
  slug: "solana-spaces",
  name: "Solana Spaces",
  profile: {
    tagline:
      "Activating e-commerce and global IRL stores for Solana and its ecosystem",
    summary:
      "Solana Spaces provides end-to-end events, merchandise, and community activations for the Solana ecosystem, operating pop-up retail stores at crypto conferences.",
    description:
      "Solana Spaces operates physical retail experiences and pop-up stores for the Solana ecosystem, offering branded apparel, hardware wallets, phones, gaming gear, and DePIN devices. Originally launched in 2022 with a flagship store in New York's Hudson Yards, the venture was revived as a pop-up model at crypto conferences. Solana Spaces partners with ecosystem teams to sell merchandise, turning community relationships into real-world cultural moments.",
    sector: "Community",
    type: "Company",
    links: {
      website: "https://solanaspaces.com/",
    },
    socials: {
      x: "https://x.com/solanaspaces",
      linkedin: "https://www.linkedin.com/company/solana-spaces",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: solanaSpacesLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: solanaSpacesLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
