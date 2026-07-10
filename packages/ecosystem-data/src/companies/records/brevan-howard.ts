import type { CompanyRecord } from "../../types";
import brevanHowardLogoLight from "../../../assets/companies/brevan-howard/logo-light.png";

export const brevanHoward = {
  id: "brevan-howard",
  slug: "brevan-howard",
  name: "Brevan Howard",
  profile: {
    tagline: "Global alternative investment management platform",
    summary:
      "Brevan Howard is a global alternative investment manager specializing in global macro and digital assets.",
    description:
      "Brevan Howard is a global alternative investment management platform founded in 2002. The firm manages assets for institutional investors across macro and digital asset strategies, with BH Digital serving as its dedicated digital asset management division. Brevan Howard Digital funds have been represented in Solana's tokenized fund ecosystem through Libre.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.brevanhoward.com/",
    },
    socials: {
      linkedin: "https://www.linkedin.com/company/brevan-howard",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: brevanHowardLogoLight,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
