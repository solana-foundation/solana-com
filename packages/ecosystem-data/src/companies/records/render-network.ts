import type { CompanyRecord } from "../../types";
import renderNetworkBreakpoint2026White from "../../../assets/companies/render-network/breakpoint-2026-white.svg";
import renderNetworkLogoDark from "../../../assets/companies/render-network/logo-dark.svg";
import renderNetworkLogoDarkVertical from "../../../assets/companies/render-network/logo-dark-vertical.png";

export const renderNetwork = {
  id: "render-network",
  slug: "render-network",
  name: "The Render Network",
  profile: {
    tagline: "Powering the Future of Creativity",
    summary:
      "The Render Network is a decentralized GPU rendering and compute platform for creators, studios, and applications.",
    description:
      "The Render Network connects creative and compute workloads with distributed GPU resources. It supports 3D rendering, generative imaging, and related high-performance workflows while the Render Network Foundation helps maintain the core protocol and grow the community.",
    sector: "DePIN",
    type: "Protocol",
    links: {
      website: "https://rendernetwork.com/",
    },
    socials: {
      x: "https://x.com/RenderNetwork",
      linkedin: "https://www.linkedin.com/company/render-network-foundation/",
      telegram: "https://t.me/rendernetwork",
      github: "https://github.com/rendernetwork",
      medium: "https://rendernetwork.medium.com/",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: renderNetworkBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: renderNetworkLogoDark,
      theme: "light",
    },
    {
      id: "logo-dark-vertical",
      fileName: "logo-dark-vertical.png",
      format: "png",
      source: renderNetworkLogoDarkVertical,
      theme: "light",
    },
  ],
} satisfies CompanyRecord;
