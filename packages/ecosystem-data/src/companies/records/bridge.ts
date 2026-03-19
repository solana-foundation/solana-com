import type { CompanyRecord } from "../../types";
import bridgeLogo from "../../../assets/companies/bridge/logo.svg";

export const bridge = {
  "id": "bridge",
  "slug": "bridge",
  "name": "Bridge",
  "profile": {
    "tagline": "Make money move",
    "summary": "An entirely new payments platform built with stablecoins to simplify global money movement.",
    "description": "Bridge provides a fully integrated stablecoin infrastructure platform enabling businesses to receive, store, convert, issue, and spend stablecoins. The platform offers APIs for orchestration, issuance, card programs, wallets, and cross-border payments. By handling regulatory, compliance, and technical complexities, Bridge allows companies to expand globally and move funds faster and cheaper.",
    "sector": "Payments",
    "type": "Company",
    "links": {
      "website": "https://www.bridge.xyz/"
    },
    "socials": {
      "x": "https://x.com/StableCoin",
      "linkedin": "https://www.linkedin.com/company/bridge-apis/"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": bridgeLogo
    }
  ]
} satisfies CompanyRecord;
