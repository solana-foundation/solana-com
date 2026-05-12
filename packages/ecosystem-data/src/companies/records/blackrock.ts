import type { CompanyRecord } from "../../types";
import blackrockLogoLight from "../../../assets/companies/blackrock/logo-light.png";

export const blackrock = {
  id: "blackrock",
  slug: "blackrock",
  name: "BlackRock",
  profile: {
    tagline: "World's largest asset manager",
    summary:
      "BlackRock is expanding its tokenized fund offerings and digital asset infrastructure with exposure to the Solana ecosystem.",
    description:
      "BlackRock is the world's largest asset manager with over $10 trillion in assets under management. The firm has been expanding into digital assets through tokenized fund offerings and blockchain infrastructure investments, signaling institutional confidence in onchain finance including the Solana ecosystem.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.blackrock.com",
    },
    socials: {
      x: "https://x.com/BlackRock",
      linkedin: "https://www.linkedin.com/company/blackrock",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: blackrockLogoLight,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
