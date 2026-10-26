import type { CompanyRecord } from "../../types";
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
    links: { website: "https://www.zellepay.com/" },
    socials: {
      x: "https://x.com/zelle",
      linkedin: "https://www.linkedin.com/company/zellepay",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
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
