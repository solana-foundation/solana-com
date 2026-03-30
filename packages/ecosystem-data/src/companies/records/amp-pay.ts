import type { CompanyRecord } from "../../types";
import ampPayLogoLight from "../../../assets/companies/amp-pay/logo-light.svg";

export const ampPay = {
  id: "amp-pay",
  slug: "amp-pay",
  name: "Amp Pay",
  profile: null,
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: ampPayLogoLight,
      theme: "light",
    },
  ],
} satisfies CompanyRecord;
