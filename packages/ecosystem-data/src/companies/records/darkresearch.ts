import type { CompanyRecord } from "../../types";
import darkresearchLogoLight from "../../../assets/companies/darkresearch/logo-light.svg";
import darkresearchLogoDark from "../../../assets/companies/darkresearch/logo-dark.png";
import darkresearchMarkLight from "../../../assets/companies/darkresearch/mark-light.png";

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
  "defaultLogoId": "logo-light",
  "logos": [
    {
      "id": "logo-light",
      "fileName": "logo-light.svg",
      "format": "svg",
      "source": darkresearchLogoLight,
      "theme": "light"
    },
    {
      "id": "logo-dark",
      "fileName": "logo-dark.png",
      "format": "png",
      "source": darkresearchLogoDark,
      "theme": "dark"
    },
    {
      "id": "mark-light",
      "fileName": "mark-light.png",
      "format": "png",
      "source": darkresearchMarkLight,
      "theme": "light",
      "kind": "mark"
    }
  ]
} satisfies CompanyRecord;
