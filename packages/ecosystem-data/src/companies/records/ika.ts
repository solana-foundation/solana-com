import type { CompanyRecord } from "../../types";
import ikaMarkPink from "../../../assets/companies/ika/mark-pink.svg";
import ikaWordmarkLight from "../../../assets/companies/ika/wordmark-light.svg";
import ikaWordmarkPink from "../../../assets/companies/ika/wordmark-pink.svg";

export const ika = {
  id: "ika",
  slug: "ika",
  name: "Ika",
  profile: {
    tagline: "Programmable cross-chain signing with dWallets.",
    summary:
      "Ika is a decentralized MPC signing network that lets Solana programs control assets on other blockchains through programmable dWallets.",
    description:
      "Ika provides a decentralized signing network for applications that need to control assets across blockchains. Its programmable dWallets let Solana programs authorize transactions on other networks without a wrapped asset or traditional bridge.",
    sector: "Infrastructure",
    type: "Protocol",
    links: {
      website: "https://ika.xyz/",
      docs: "https://docs.ika.xyz/",
    },
    socials: {
      x: "https://x.com/ikadotxyz",
      linkedin: "https://www.linkedin.com/company/ikadotxyz/",
      github: "https://github.com/dwallet-labs/ika",
    },
  },
  defaultLogoId: "wordmark-pink",
  logos: [
    {
      id: "wordmark-light",
      fileName: "wordmark-light.svg",
      format: "svg",
      source: ikaWordmarkLight,
      theme: "dark",
      kind: "wordmark",
    },
    {
      id: "wordmark-pink",
      fileName: "wordmark-pink.svg",
      format: "svg",
      source: ikaWordmarkPink,
      kind: "wordmark",
    },
    {
      id: "mark-pink",
      fileName: "mark-pink.svg",
      format: "svg",
      source: ikaMarkPink,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
