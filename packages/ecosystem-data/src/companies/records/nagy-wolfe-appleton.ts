import type { CompanyRecord } from "../../types";
import nagyWolfeAppletonLogoColor from "../../../assets/companies/nagy-wolfe-appleton/logo-color.png";
import nagyWolfeAppletonLogoWhiteTransparent from "../../../assets/companies/nagy-wolfe-appleton/logo-white-transparent.png";

export const nagyWolfeAppleton = {
  id: "nagy-wolfe-appleton",
  slug: "nagy-wolfe-appleton",
  name: "Nagy Wolfe Appleton LLP",
  profile: {
    tagline: "Trial lawyers for complex commercial disputes.",
    summary:
      "Nagy Wolfe Appleton LLP represents plaintiffs and defendants in commercial litigation, including disputes involving blockchain and digital assets.",
    description:
      "Nagy Wolfe Appleton LLP is a New York law firm handling trials, arbitrations, and appeals for businesses and individuals. Its lawyers work on matters involving securities, corporate governance, contracts, and digital assets, including litigation for Solana Labs and Solana Foundation.",
    sector: "Policy",
    type: "Company",
    links: {
      website: "https://www.nagylaw.com/",
    },
    socials: {
      linkedin: "https://www.linkedin.com/company/nagy-wolfe-appleton-llp",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "logo-color",
      fileName: "logo-color.png",
      format: "png",
      source: nagyWolfeAppletonLogoColor,
      kind: "logo",
      theme: "light",
      background: "transparent",
    },
    {
      id: "logo-white-transparent",
      fileName: "logo-white-transparent.png",
      format: "png",
      source: nagyWolfeAppletonLogoWhiteTransparent,
      kind: "logo",
      theme: "dark",
      background: "transparent",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "logo-white-transparent.png",
      format: "png",
      source: nagyWolfeAppletonLogoWhiteTransparent,
      kind: "logo",
      theme: "dark",
      background: "transparent",
      treatment: "monotone",
      width: 5132,
      height: 2561,
    },
  ],
} satisfies CompanyRecord;
