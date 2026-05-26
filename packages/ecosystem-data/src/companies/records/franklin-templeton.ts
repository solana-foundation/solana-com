import type { CompanyRecord } from "../../types";
import franklinTempletonLogoLight from "../../../assets/companies/franklin-templeton/logo-light.webp";

export const franklinTempleton = {
  id: "franklin-templeton",
  slug: "franklin-templeton",
  name: "Franklin Templeton",
  profile: {
    tagline: "Global investment management organization",
    summary:
      "Franklin Templeton launched BENJI, the world's first U.S.-registered money market fund onchain with Solana.",
    description:
      "Franklin Templeton is a global investment management organization managing over $1.5 trillion in assets. The firm launched BENJI on Solana, the world's first U.S.-registered money market fund onchain, lowering the barrier to investing in private money market funds. Franklin Templeton has been a pioneer in bringing traditional financial products to blockchain infrastructure.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.franklintempleton.com",
    },
    socials: {
      x: "https://x.com/FTI_US",
      linkedin: "https://www.linkedin.com/company/franklin-templeton",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.webp",
      format: "webp",
      source: franklinTempletonLogoLight,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
