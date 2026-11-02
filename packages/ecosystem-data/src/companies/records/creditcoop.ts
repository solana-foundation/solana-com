import type { CompanyRecord } from "../../types";
import creditcoopLogoOutlinePurple from "../../../assets/companies/creditcoop/logo-outline-purple.svg";
import creditcoopLogoColorOnWhite from "../../../assets/companies/creditcoop/logo-color-on-white.svg";
import creditcoopLogoNavyOnWhite from "../../../assets/companies/creditcoop/logo-navy-on-white.svg";
import creditcoopMarkColorOnDark from "../../../assets/companies/creditcoop/mark-color-on-dark.svg";
import creditcoopLogoColorOnDark from "../../../assets/companies/creditcoop/logo-color-on-dark.svg";
import creditcoopMarkColorOnWhite from "../../../assets/companies/creditcoop/mark-color-on-white.svg";
import creditcoopMarkOutlinePurple from "../../../assets/companies/creditcoop/mark-outline-purple.svg";
import creditcoopMarkOutlineOnDark from "../../../assets/companies/creditcoop/mark-outline-on-dark.svg";
import creditcoopLogoColorWhiteTransparent from "../../../assets/companies/creditcoop/logo-color-white-transparent.png";
import creditcoopLogoColorNavyTransparent from "../../../assets/companies/creditcoop/logo-color-navy-transparent.png";
import creditcoopMarkColorTransparent from "../../../assets/companies/creditcoop/mark-color-transparent.png";
import creditcoopBreakpoint2026White from "../../../assets/companies/creditcoop/breakpoint-2026-white.svg";

export const creditcoop = {
  id: "creditcoop",
  slug: "creditcoop",
  name: "Credit Coop",
  profile: {
    tagline: "Onchain credit infrastructure for payment settlement.",
    summary:
      "Credit Coop provides revolving credit secured by payment settlement flows, connecting businesses that need working capital with lenders.",
    description:
      "Credit Coop uses smart contracts to turn business cash flows into security for credit facilities. Its protocol provides onchain loan servicing and transparency for borrowers and lenders, with lending vaults that supply capital to credit lines.",
    sector: "DeFi",
    type: "Protocol",
    links: {
      website: "https://www.creditcoop.xyz/",
      docs: "https://docs.creditcoop.xyz/",
    },
    socials: {
      x: "https://x.com/creditcoop_xyz",
      linkedin: "https://www.linkedin.com/company/credit-coop/",
    },
  },
  defaultLogoId: "logo-color-navy-transparent",
  logos: [
    {
      id: "logo-outline-purple",
      fileName: "logo-outline-purple.svg",
      format: "svg",
      source: creditcoopLogoOutlinePurple,
      kind: "logo",
      theme: "light",
    },
    {
      id: "logo-color-on-white",
      fileName: "logo-color-on-white.svg",
      format: "svg",
      source: creditcoopLogoColorOnWhite,
      kind: "logo",
      theme: "light",
      background: "light",
    },
    {
      id: "logo-navy-on-white",
      fileName: "logo-navy-on-white.svg",
      format: "svg",
      source: creditcoopLogoNavyOnWhite,
      kind: "logo",
      theme: "light",
      background: "light",
    },
    {
      id: "mark-color-on-dark",
      fileName: "mark-color-on-dark.svg",
      format: "svg",
      source: creditcoopMarkColorOnDark,
      kind: "mark",
      theme: "dark",
      background: "dark",
    },
    {
      id: "logo-color-on-dark",
      fileName: "logo-color-on-dark.svg",
      format: "svg",
      source: creditcoopLogoColorOnDark,
      kind: "logo",
      theme: "dark",
      background: "dark",
    },
    {
      id: "mark-color-on-white",
      fileName: "mark-color-on-white.svg",
      format: "svg",
      source: creditcoopMarkColorOnWhite,
      kind: "mark",
      theme: "light",
      background: "light",
    },
    {
      id: "mark-outline-purple",
      fileName: "mark-outline-purple.svg",
      format: "svg",
      source: creditcoopMarkOutlinePurple,
      kind: "mark",
      background: "transparent",
    },
    {
      id: "mark-outline-on-dark",
      fileName: "mark-outline-on-dark.svg",
      format: "svg",
      source: creditcoopMarkOutlineOnDark,
      kind: "mark",
      theme: "dark",
      background: "dark",
    },
    {
      id: "logo-color-white-transparent",
      fileName: "logo-color-white-transparent.png",
      format: "png",
      source: creditcoopLogoColorWhiteTransparent,
      kind: "logo",
      theme: "dark",
      background: "transparent",
    },
    {
      id: "logo-color-navy-transparent",
      fileName: "logo-color-navy-transparent.png",
      format: "png",
      source: creditcoopLogoColorNavyTransparent,
      kind: "logo",
      theme: "light",
      background: "transparent",
    },
    {
      id: "mark-color-transparent",
      fileName: "mark-color-transparent.png",
      format: "png",
      source: creditcoopMarkColorTransparent,
      kind: "mark",
      background: "transparent",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: creditcoopBreakpoint2026White,
      kind: "logo",
      theme: "dark",
      background: "transparent",
      treatment: "monotone",
      width: 680,
      height: 254,
    },
  ],
} satisfies CompanyRecord;
