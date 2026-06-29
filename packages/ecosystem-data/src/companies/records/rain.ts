import type { CompanyRecord } from "../../types";
import rainBreakpoint2026White from "../../../assets/companies/rain/breakpoint-2026-white.svg";
import rainLogoPink from "../../../assets/companies/rain/logo-pink.svg";

export const rain = {
  id: "rain",
  slug: "rain",
  name: "Rain",
  profile: {
    tagline: "Stablecoin payments for the tokenized future",
    summary:
      "Rain is a stablecoin payments platform that helps companies launch card programs, digital dollar accounts, and global money movement through one API.",
    description:
      "Rain provides stablecoin payment infrastructure for platforms, fintechs, and institutions. Its product suite includes card issuing, digital dollar accounts, wallets, onramps, offramps, and global payments so partners can build familiar financial products around tokenized money.",
    sector: "Payments",
    type: "Platform",
    links: {
      website: "https://www.rain.xyz/",
    },
    socials: {
      x: "https://x.com/raincards",
      linkedin: "https://www.linkedin.com/company/rainxyz",
    },
  },
  defaultLogoId: "logo-pink",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: rainBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-pink",
      fileName: "logo-pink.svg",
      format: "svg",
      source: rainLogoPink,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
