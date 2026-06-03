import type { CompanyRecord } from "../../types";
import dawnBreakpoint2026White from "../../../assets/companies/dawn/breakpoint-2026-white.svg";

export const dawn = {
  id: "dawn",
  slug: "dawn",
  name: "DAWN",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: dawnBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
