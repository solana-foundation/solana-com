import type { CompanyRecord } from "../../types";
import darkresearchLogo from "../../../assets/companies/darkresearch/logo.png";

export const darkresearch = {
  "id": "darkresearch",
  "slug": "darkresearch",
  "name": "Dark Research",
  "profile": {
    "tagline": "An AI lab for the new internet",
    "summary": "Dark Research is an applied AI lab building production applications at the intersection of blockchain infrastructure and artificial intelligence, with tools for Solana.",
    "description": "Dark Research is a technology company focused on closing the gap between frontier technology and human cognition through production applications. The company operates at the intersection of blockchain infrastructure and artificial intelligence, building tools including Model Context Protocol servers for interacting with the Solana blockchain powered by the Solana Agent Kit.",
    "sector": "Developer Tools",
    "type": "Company",
    "links": {
      "website": "https://www.darkresearch.ai"
    },
    "socials": {
      "x": "https://x.com/darkresearchai",
      "linkedin": "https://www.linkedin.com/company/dark-ai",
      "github": "https://github.com/darkresearch"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.png",
      "format": "png",
      "source": darkresearchLogo
    }
  ]
} satisfies CompanyRecord;
