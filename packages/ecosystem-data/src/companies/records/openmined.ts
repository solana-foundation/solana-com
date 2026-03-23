import type { CompanyRecord } from "../../types";
import openminedMark from "../../../assets/companies/openmined/logo.svg";
import openminedLogoLight from "../../../assets/companies/openmined/logo-light.svg";
import openminedLogoDark from "../../../assets/companies/openmined/logo-dark.svg";
import openminedMarkIcon from "../../../assets/companies/openmined/mark.svg";

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
  "defaultLogoId": "logo-light",
  "logos": [
    {
      "id": "mark",
      "fileName": "logo.svg",
      "format": "svg",
      "source": openminedMark,
      "kind": "mark"
    },
    {
      "id": "logo-light",
      "fileName": "logo-light.svg",
      "format": "svg",
      "source": openminedLogoLight,
      "theme": "light"
    },
    {
      "id": "logo-dark",
      "fileName": "logo-dark.svg",
      "format": "svg",
      "source": openminedLogoDark,
      "theme": "dark"
    },
    {
      "id": "mark-icon",
      "fileName": "mark.svg",
      "format": "svg",
      "source": openminedMarkIcon,
      "kind": "mark"
    }
  ]
} satisfies CompanyRecord;
