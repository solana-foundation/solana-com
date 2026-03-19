import type { CompanyRecord } from "../../types";
import spiLogo from "../../../assets/companies/spi/logo.svg";

export const spi = {
  "id": "spi",
  "slug": "spi",
  "name": "Solana Policy Institute",
  "profile": {
    "tagline": "Educating policymakers on how decentralized networks are the future of the digital economy",
    "summary": "The Solana Policy Institute is a non-partisan, not-for-profit organization that educates policymakers on decentralized networks and advocates for legal clarity for the Solana ecosystem.",
    "description": "The Solana Policy Institute is a non-partisan, not-for-profit organization focused on educating policymakers about how decentralized networks like Solana are transforming the digital economy. The institute serves as a liaison between policymakers and the Solana ecosystem, advocating for legislation and regulation that supports industry growth in the United States.",
    "sector": "Policy",
    "type": "Community",
    "links": {
      "website": "https://www.solanapolicyinstitute.org/"
    },
    "socials": {
      "x": "https://x.com/SolanaInstitute",
      "linkedin": "https://www.linkedin.com/company/solana-policy-institute"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": spiLogo
    }
  ]
} satisfies CompanyRecord;
