import type { CompanyRecord } from "../../types";
import wyomingLogoLight from "../../../assets/companies/wyoming/logo-light.svg";

export const wyoming = {
  id: "wyoming",
  slug: "wyoming",
  name: "Wyoming",
  profile: null,
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: wyomingLogoLight,
      theme: "light",
    },
  ],
} satisfies CompanyRecord;
