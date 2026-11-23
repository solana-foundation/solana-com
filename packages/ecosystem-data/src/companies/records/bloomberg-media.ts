import type { CompanyRecord } from "../../types";
import bloombergMediaLogoHorizontalDark from "../../../assets/companies/bloomberg-media/logo-horizontal-dark.webp";
import bloombergMediaLogoHorizontalLight from "../../../assets/companies/bloomberg-media/logo-horizontal-light.svg";
import bloombergMediaLogoStackedDark from "../../../assets/companies/bloomberg-media/logo-stacked-dark.svg";
import bloombergMediaLogoStackedLight from "../../../assets/companies/bloomberg-media/logo-stacked-light.webp";

export const bloombergMedia = {
  id: "bloomberg-media",
  slug: "bloomberg-media",
  name: "Bloomberg Media",
  profile: {
    tagline: "Business and financial journalism across platforms.",
    summary:
      "Bloomberg Media reports business and financial news through digital publications, television, audio, and live events.",
    description:
      "Bloomberg Media is Bloomberg's news and media business. It publishes reporting and analysis on markets, business, technology, and policy across digital, video, audio, and event platforms.",
    type: "Company",
    links: {
      website: "https://www.bloombergmedia.com/",
    },
    socials: {
      x: "https://twitter.com/BBGMedia",
      linkedin: "https://www.linkedin.com/company/6918/",
    },
  },
  defaultLogoId: "logo-horizontal-dark",
  logos: [
    {
      id: "logo-horizontal-dark",
      fileName: "logo-horizontal-dark.webp",
      format: "webp",
      source: bloombergMediaLogoHorizontalDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-horizontal-light",
      fileName: "logo-horizontal-light.svg",
      format: "svg",
      source: bloombergMediaLogoHorizontalLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-stacked-dark",
      fileName: "logo-stacked-dark.svg",
      format: "svg",
      source: bloombergMediaLogoStackedDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-stacked-light",
      fileName: "logo-stacked-light.webp",
      format: "webp",
      source: bloombergMediaLogoStackedLight,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
