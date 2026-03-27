import type { CompanyRecord } from "../../types";
import bhutanLogoLight from "../../../assets/companies/bhutan/logo-light.svg";

export const bhutan = {
  id: "bhutan",
  slug: "bhutan",
  name: "Bhutan",
  profile: null,
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: bhutanLogoLight,
      theme: "light",
    },
  ],
} satisfies CompanyRecord;
