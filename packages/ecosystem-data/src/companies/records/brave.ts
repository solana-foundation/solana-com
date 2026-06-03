import type { CompanyRecord } from "../../types";
import braveBreakpoint2026White from "../../../assets/companies/brave/breakpoint-2026-white.png";
import braveLogoBlack from "../../../assets/companies/brave/logo-black.png";
import braveLogoColorDarkBackground from "../../../assets/companies/brave/logo-color-dark-background.png";
import braveLogoColorLightBackground from "../../../assets/companies/brave/logo-color-light-background.png";

export const brave = {
  id: "brave",
  slug: "brave",
  name: "Brave",
  profile: {
    tagline: "The browser that puts users first.",
    summary:
      "Brave is a privacy-first browser, search, and wallet company with built-in web3 support.",
    description:
      "Brave builds privacy-preserving browser, search, advertising, and wallet products for users and developers. Its browser includes native web3 capabilities through Brave Wallet and supports Solana alongside other networks.",
    sector: "Developer Tools",
    type: "Company",
    links: {
      website: "https://brave.com/",
    },
    socials: {
      x: "https://x.com/brave",
      linkedin: "https://www.linkedin.com/company/brave-software",
      github: "https://github.com/brave",
      youtube: "https://www.youtube.com/bravesoftware",
    },
  },
  defaultLogoId: "logo-color-light-background",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: braveBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-black",
      fileName: "logo-black.png",
      format: "png",
      source: braveLogoBlack,
      theme: "light",
    },
    {
      id: "logo-color-dark-background",
      fileName: "logo-color-dark-background.png",
      format: "png",
      source: braveLogoColorDarkBackground,
      theme: "dark",
    },
    {
      id: "logo-color-light-background",
      fileName: "logo-color-light-background.png",
      format: "png",
      source: braveLogoColorLightBackground,
      theme: "light",
    },
  ],
} satisfies CompanyRecord;
