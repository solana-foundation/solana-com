import type { CompanyRecord } from "../../types";
import dynamicLogoLight from "../../../assets/companies/dynamic/logo-light.svg";

export const dynamic = {
  id: "dynamic",
  slug: "dynamic",
  name: "Dynamic",
  profile: null,
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: dynamicLogoLight,
      theme: "light",
    },
  ],
} satisfies CompanyRecord;
