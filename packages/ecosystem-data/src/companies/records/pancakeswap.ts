import type { CompanyRecord } from "../../types";
import pancakeswapBreakpoint2026White from "../../../assets/companies/pancakeswap/breakpoint-2026-white.svg";

export const pancakeswap = {
  id: "pancakeswap",
  slug: "pancakeswap",
  name: "PancakeSwap",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: pancakeswapBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
