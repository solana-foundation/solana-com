import type { CompanyRecord } from "../../types";
import trutherLogoColor from "../../../assets/companies/truther/logo-color.svg";
import trutherLogoBlack from "../../../assets/companies/truther/logo-black.svg";
import trutherLogoColorOnDark from "../../../assets/companies/truther/logo-color-on-dark.svg";
import trutherLogoWhite from "../../../assets/companies/truther/logo-white.svg";

export const truther = {
  id: "truther",
  slug: "truther",
  name: "Truther",
  profile: {
    tagline: "Stablecoin payments and self-custody wallets.",
    summary:
      "Truther by RezolvePay provides payment infrastructure that connects stablecoins with local financial and instant payment systems.",
    description:
      "Truther offers a self-custody wallet for holding digital assets and making everyday payments through integrated local payment networks. Its checkout and API products let platforms connect stablecoin transactions with local currency payments through financial partners. Truther is part of the Rezolve AI ecosystem.",
    sector: "Payments",
    type: "Platform",
    links: {
      website: "https://truther.sv/",
    },
    socials: {
      linkedin: "https://www.linkedin.com/company/trutherbyrezolvepay",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      width: 801,
      height: 241,
      kind: "logo",
      theme: "light",
      background: "transparent",
      source: trutherLogoColor,
    },
    {
      id: "logo-black",
      fileName: "logo-black.svg",
      format: "svg",
      width: 800,
      height: 240,
      kind: "logo",
      theme: "light",
      background: "transparent",
      source: trutherLogoBlack,
    },
    {
      id: "logo-color-on-dark",
      fileName: "logo-color-on-dark.svg",
      format: "svg",
      width: 842,
      height: 432,
      kind: "logo",
      theme: "dark",
      background: "dark",
      source: trutherLogoColorOnDark,
    },
    {
      id: "logo-white",
      fileName: "logo-white.svg",
      format: "svg",
      width: 800,
      height: 240,
      kind: "logo",
      theme: "dark",
      background: "transparent",
      treatment: "monotone",
      source: trutherLogoWhite,
    },
    {
      id: "breakpoint-2026-white",
      fileName: "logo-white.svg",
      format: "svg",
      width: 800,
      height: 240,
      kind: "logo",
      theme: "dark",
      background: "transparent",
      treatment: "monotone",
      source: trutherLogoWhite,
    },
  ],
} satisfies CompanyRecord;
