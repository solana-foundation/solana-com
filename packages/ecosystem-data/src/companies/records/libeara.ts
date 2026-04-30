import type { CompanyRecord } from "../../types";
import libearaLogo from "../../../assets/companies/libeara/logo.svg";
import libearaLogoDark from "../../../assets/companies/libeara/logo-dark.png";

export const libeara = {
  id: "libeara",
  slug: "libeara",
  name: "Libeara",
  profile: {
    tagline:
      "Investing is more accessible and equitable with tokenised assets.",
    summary:
      "SC Ventures incubated tokenisation platform helping organizations create, issue, and manage real-world assets on-chain.",
    description:
      "Libeara is a road-tested asset tokenisation platform focused on making markets more accessible, transparent, and secure, with solutions for regulated funds, tokenised government bonds, and other real-world assets.",
    sector: "Tokenization",
    type: "Platform",
    links: {
      website: "https://libeara.com/",
    },
    socials: {
      x: "https://x.com/libeara_",
      linkedin: "https://www.linkedin.com/company/libeara/",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: libearaLogo,
      theme: "dark",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: libearaLogoDark,
      theme: "light",
    },
  ],
} satisfies CompanyRecord;
