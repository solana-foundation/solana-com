import type { CompanyRecord } from "../../types";
import orbitflareBreakpoint2026White from "../../../assets/companies/orbitflare/breakpoint-2026-white.svg";

export const orbitflare = {
  id: "orbitflare",
  slug: "orbitflare",
  name: "OrbitFlare",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: orbitflareBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
