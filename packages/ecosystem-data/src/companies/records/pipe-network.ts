import type { CompanyRecord } from "../../types";
import pipeNetworkLogoDark from "../../../assets/companies/pipe-network/logo-dark.svg";
import pipeNetworkLogoLight from "../../../assets/companies/pipe-network/logo-light.svg";

export const pipeNetwork = {
  id: "pipe-network",
  slug: "pipe-network",
  name: "Pipe Network",
  profile: {
    tagline: "The edge cloud anyone can run",
    summary:
      "Pipe Network is a permissionless edge cloud that combines thousands of small Points of Presence with smart multi-network routing to deliver faster, more reliable applications worldwide.",
    description:
      "Pipe Network is a permissionless edge cloud powering CDN, storage, and accelerated transport by delivering data closer to users through hyperlocal Points of Presence. Anyone can operate PoPs and contribute capacity to the network. Its product suite includes Pipe CDN and SolanaCDN, providing full-stack content delivery with edge-first architecture and ultra-low latency.",
    sector: "DePIN",
    type: "Protocol",
    links: {
      website: "https://pipe.network/",
    },
    socials: {
      x: "https://x.com/pipenetwork",
      github: "https://github.com/pipenetwork",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: pipeNetworkLogoLight,
      theme: "light",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: pipeNetworkLogoDark,
      theme: "dark",
    },
  ],
} satisfies CompanyRecord;
