import type { CompanyRecord } from "../../types";
import oslLogo from "../../../assets/companies/osl/logo.svg";

export const osl = {
  "id": "osl",
  "slug": "osl",
  "name": "OSL",
  "profile": {
    "tagline": "Built for simple crypto trading.",
    "summary": "Licensed digital asset exchange providing secure trading, fiat deposits, and custody services.",
    "description": "OSL offers regulated trading, OTC services, custody, trading APIs, tokenization, and payment infrastructure for individuals and institutions, backed by global compliance coverage.",
    "sector": "Exchange",
    "type": "Platform",
    "links": {
      "website": "https://www.osl.com/"
    },
    "socials": {
      "x": "https://twitter.com/OSLdotcom",
      "linkedin": "https://hk.linkedin.com/company/osldotcom/",
      "discord": "https://discord.com/invite/oslglobal",
      "telegram": "https://t.me/osl_community"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": oslLogo
    }
  ]
} satisfies CompanyRecord;
