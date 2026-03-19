import type { CompanyRecord } from "../../types";
import galaxyLogo from "../../../assets/companies/galaxy/logo.svg";

export const galaxy = {
  "id": "galaxy",
  "slug": "galaxy",
  "name": "Galaxy",
  "profile": {
    "tagline": "Global leader in digital assets and data center infrastructure",
    "summary": "Galaxy is a publicly traded digital asset and blockchain financial services firm that provides institutional-grade trading, asset management, and infrastructure solutions.",
    "description": "Galaxy (TSX: GLXY) is a digital asset and blockchain leader founded by Michael Novogratz, headquartered in New York. The company operates three complementary businesses: Global Markets, Asset Management, and Digital Infrastructure Solutions, serving institutions, startups, and qualified individuals. Galaxy is a major participant in the Solana ecosystem and a significant SOL holder.",
    "sector": "Infrastructure",
    "type": "Company",
    "links": {
      "website": "https://www.galaxy.com/"
    },
    "socials": {
      "x": "https://x.com/galaxyhq",
      "linkedin": "https://www.linkedin.com/company/galaxyhq",
      "github": "https://github.com/galaxy-digital"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": galaxyLogo
    }
  ]
} satisfies CompanyRecord;
