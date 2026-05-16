import type { CompanyRecord } from "../../types";
import kazakhstanLogoLight from "../../../assets/companies/kazakhstan/logo-light.svg";

export const kazakhstan = {
  id: "kazakhstan",
  slug: "kazakhstan",
  name: "Kazakhstan",
  profile: null,
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: kazakhstanLogoLight,
      theme: "light",
    },
  ],
} satisfies CompanyRecord;
