import type { CompanyRecord } from "../../types";
import trojanBreakpoint2026White from "../../../assets/companies/trojan/breakpoint-2026-white.svg";

export const trojan = {
  id: "trojan",
  slug: "trojan",
  name: "Trojan",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: trojanBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
