import type { CompanyRecord } from "../../types";
import cherryServersBreakpoint2026White from "../../../assets/companies/cherry-servers/breakpoint-2026-white.svg";
import cherryServersBreakpoint2026WhitePng from "../../../assets/companies/cherry-servers/breakpoint-2026-white.png";
import cherryServersLogoColor from "../../../assets/companies/cherry-servers/logo-color.svg";
import cherryServersLogoColorJpg from "../../../assets/companies/cherry-servers/logo-color.jpg";
import cherryServersLogoColorPng from "../../../assets/companies/cherry-servers/logo-color.png";
import cherryServersMarkColor from "../../../assets/companies/cherry-servers/mark-color.svg";
import cherryServersMarkColorPng from "../../../assets/companies/cherry-servers/mark-color.png";
import cherryServersMarkWhite from "../../../assets/companies/cherry-servers/mark-white.svg";
import cherryServersMarkWhitePng from "../../../assets/companies/cherry-servers/mark-white.png";

export const cherryServers = {
  id: "cherry-servers",
  slug: "cherry-servers",
  name: "Cherry Servers",
  profile: {
    tagline: "Bare metal cloud built for developers.",
    summary:
      "Cherry Servers provides dedicated servers, cloud infrastructure, and GPU hosting for technical teams.",
    description:
      "Cherry Servers is an infrastructure provider offering bare metal servers, cloud instances, GPU servers, storage, and networking services. The platform serves teams that need high-performance, developer-friendly compute infrastructure.",
    sector: "Infrastructure",
    type: "Company",
    links: {
      website: "https://www.cherryservers.com/",
    },
    socials: {
      x: "https://x.com/CherryServers",
      linkedin: "https://www.linkedin.com/company/cherry-servers/",
      github: "https://github.com/cherryservers",
      youtube: "https://www.youtube.com/@cherryservers",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: cherryServersBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "breakpoint-2026-white-png",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: cherryServersBreakpoint2026WhitePng,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      source: cherryServersLogoColor,
    },
    {
      id: "logo-color-png",
      fileName: "logo-color.png",
      format: "png",
      source: cherryServersLogoColorPng,
    },
    {
      id: "logo-color-jpg",
      fileName: "logo-color.jpg",
      format: "jpg",
      source: cherryServersLogoColorJpg,
    },
    {
      id: "mark-color",
      fileName: "mark-color.svg",
      format: "svg",
      source: cherryServersMarkColor,
      kind: "mark",
    },
    {
      id: "mark-color-png",
      fileName: "mark-color.png",
      format: "png",
      source: cherryServersMarkColorPng,
      kind: "mark",
    },
    {
      id: "mark-white",
      fileName: "mark-white.svg",
      format: "svg",
      source: cherryServersMarkWhite,
      theme: "dark",
      kind: "mark",
      treatment: "monotone",
    },
    {
      id: "mark-white-png",
      fileName: "mark-white.png",
      format: "png",
      source: cherryServersMarkWhitePng,
      theme: "dark",
      kind: "mark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
