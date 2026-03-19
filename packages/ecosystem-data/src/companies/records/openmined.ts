import type { CompanyRecord } from "../../types";
import openminedLogo from "../../../assets/companies/openmined/logo.svg";

export const openmined = {
  "id": "openmined",
  "slug": "openmined",
  "name": "OpenMined",
  "profile": {
    "tagline": "The missing layer for collective intelligence",
    "summary": "OpenMined is a nonprofit, open-source organization building technology that enables access to insights from non-public data without requiring direct access to or centralized copies of that data.",
    "description": "OpenMined is a 501(c)(3) nonprofit foundation and global open-source community focused on privacy-enhancing technologies and network infrastructure for non-public information. The organization says its mission is to unlock insights from sensitive data held in places like hospitals, research labs, and local devices while keeping that data where it lives. Its work spans open-source tools and network technology intended to support safer collaboration and collective intelligence across sensitive datasets.",
    "sector": "Developer Tools",
    "type": "Community",
    "links": {
      "website": "https://openmined.org/"
    },
    "socials": {
      "x": "https://x.com/openminedorg",
      "linkedin": "https://www.linkedin.com/company/openmined",
      "github": "https://github.com/OpenMined",
      "youtube": "https://www.youtube.com/c/openminedorg"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": openminedLogo
    }
  ]
} satisfies CompanyRecord;
