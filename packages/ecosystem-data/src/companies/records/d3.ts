import type { CompanyRecord } from "../../types";
import d3Breakpoint2026White from "../../../assets/companies/d3/breakpoint-2026-white.svg";

export const d3 = {
  id: "d3",
  slug: "d3",
  name: "D3",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: d3Breakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
