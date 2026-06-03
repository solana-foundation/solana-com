import type { CompanyRecord } from "../../types";
import blockzeroBreakpoint2026White from "../../../assets/companies/blockzero/breakpoint-2026-white.svg";
import blockzeroBreakpoint2026WhitePng from "../../../assets/companies/blockzero/breakpoint-2026-white.png";
import blockzeroLogoBlack from "../../../assets/companies/blockzero/logo-black.svg";
import blockzeroLogoBlackPng from "../../../assets/companies/blockzero/logo-black.png";

export const blockzero = {
  id: "blockzero",
  slug: "blockzero",
  name: "BlockZero",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: blockzeroBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "breakpoint-2026-white-png",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: blockzeroBreakpoint2026WhitePng,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-black",
      fileName: "logo-black.svg",
      format: "svg",
      source: blockzeroLogoBlack,
      theme: "light",
      treatment: "monotone",
    },
    {
      id: "logo-black-png",
      fileName: "logo-black.png",
      format: "png",
      source: blockzeroLogoBlackPng,
      theme: "light",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
