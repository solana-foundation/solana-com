import type { CompanyRecord } from "../../types";
import monkeDaoBreakpoint2026White from "../../../assets/companies/monke-dao/breakpoint-2026-white.svg";

export const monkeDao = {
  id: "monke-dao",
  slug: "monke-dao",
  name: "MonkeDAO",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: monkeDaoBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
