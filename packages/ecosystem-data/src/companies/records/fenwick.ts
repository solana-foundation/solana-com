import type { CompanyRecord } from "../../types";
import fenwickBreakpoint2026White from "../../../assets/companies/fenwick/breakpoint-2026-white.svg";

export const fenwick = {
  id: "fenwick",
  slug: "fenwick",
  name: "Fenwick",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: fenwickBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
