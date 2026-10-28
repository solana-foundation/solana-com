import type { CompanyRecord } from "../../types";
import zelleLogoLight from "../../../assets/companies/zelle/logo-light.png";
import zelleLogoDark from "../../../assets/companies/zelle/logo-dark.png";
import zelleLogoColor from "../../../assets/companies/zelle/logo-color.png";
import zelleMarkLight from "../../../assets/companies/zelle/mark-light.png";
import zelleMarkDark from "../../../assets/companies/zelle/mark-dark.svg";
import zelleBreakpoint2026White from "../../../assets/companies/zelle/breakpoint-2026-white.png";

export const zelle = {
  id: "zelle",
  slug: "zelle",
  name: "Zelle",
  profile: {
    tagline: "Send money through participating U.S. banks and credit unions.",
    summary:
      "Zelle is a U.S. payment network for sending money between eligible bank and credit union accounts using an email address or mobile number.",
    description:
      "Zelle lets enrolled consumers send and receive money through their participating bank or credit union's app or online banking. Transfers between enrolled users typically become available within minutes, and account details are not shared with the recipient.",
    sector: "Payments",
    type: "Platform",
    links: { website: "https://www.zelle.com/" },
    socials: {
      x: "https://x.com/zelle",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: zelleLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: zelleLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-color",
      fileName: "logo-color.png",
      format: "png",
      source: zelleLogoColor,
      kind: "logo",
    },
    {
      id: "mark-light",
      fileName: "mark-light.png",
      format: "png",
      source: zelleMarkLight,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: zelleMarkDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: zelleBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
