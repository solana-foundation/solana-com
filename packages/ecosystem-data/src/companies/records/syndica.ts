import type { CompanyRecord } from "../../types";
import syndicaBreakpoint2026White from "../../../assets/companies/syndica/breakpoint-2026-white.svg";

export const syndica = {
  id: "syndica",
  slug: "syndica",
  name: "Syndica",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: syndicaBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
