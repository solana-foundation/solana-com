import type { CompanyRecord } from "../../types";
import walrusBreakpoint2026White from "../../../assets/companies/walrus/breakpoint-2026-white.svg";

export const walrus = {
  id: "walrus",
  slug: "walrus",
  name: "Walrus",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: walrusBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
