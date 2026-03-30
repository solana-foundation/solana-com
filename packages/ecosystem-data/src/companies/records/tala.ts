import type { CompanyRecord } from "../../types";
import talaLogoLight from "../../../assets/companies/tala/logo-light.svg";

export const tala = {
  id: "tala",
  slug: "tala",
  name: "Tala",
  profile: null,
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: talaLogoLight,
      theme: "light",
    },
  ],
} satisfies CompanyRecord;
