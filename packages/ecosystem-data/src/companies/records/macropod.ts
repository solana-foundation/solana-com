import type { CompanyRecord } from "../../types";
import macropodLogo from "../../../assets/companies/macropod/logo.jpg";
import macropodMark from "../../../assets/companies/macropod/mark.svg";

export const macropod = {
  id: "macropod",
  slug: "macropod",
  name: "Macropod",
  profile: {
    tagline: "Value that moves with you.",
    summary:
      "Australian licensed stablecoin issuer of AUDM, a tokenised Australian dollar backed 1:1 by AUD held in trust with a Big 4 bank.",
    description:
      "Macropod is an Australian financial services provider that issues AUDM, a tokenised Australian dollar pegged 1:1 to AUD held in trust with a Big 4 bank, with reserves published daily for transparency. The company operates under an Australian Financial Services Licence (AFSL 566313) and is registered with ASIC and AUSTRAC, providing APIs for real-world payments, instant settlement, and 24/7 stablecoin trading. AUDM is issued on Solana at mint address CiYXBwHPrdNkMtxR8YEWKv78K6bQjFoEWhPQrZqEmubi.",
    sector: "Tokenization",
    type: "Company",
    links: {
      website: "https://www.macropod.com/",
      app: "https://app.macropod.com/",
      docs: "https://docs.macropod.com/",
    },
    socials: {
      x: "https://twitter.com/Macropod_AU",
      linkedin: "https://www.linkedin.com/company/macropod-global",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.jpg",
      format: "jpg",
      source: macropodLogo,
      kind: "logo",
      theme: "light",
    },
    {
      id: "mark",
      fileName: "mark.svg",
      format: "svg",
      source: macropodMark,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
