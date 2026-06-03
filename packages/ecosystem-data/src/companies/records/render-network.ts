import type { CompanyRecord } from "../../types";
import renderNetworkBreakpoint2026White from "../../../assets/companies/render-network/breakpoint-2026-white.png";

export const renderNetwork = {
  id: "render-network",
  slug: "render-network",
  name: "The Render Network",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: renderNetworkBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
