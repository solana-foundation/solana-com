import type { CompanyRecord } from "../../types";
import openminedLogo from "../../../assets/companies/openmined/logo.png";

export const openmined = {
  "id": "openmined",
  "slug": "openmined",
  "name": "OpenMined",
  "profile": null,
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.png",
      "format": "png",
      "source": openminedLogo
    }
  ]
} satisfies CompanyRecord;
