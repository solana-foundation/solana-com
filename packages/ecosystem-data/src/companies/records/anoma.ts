import type { CompanyRecord } from "../../types";
import anomaLogoLight from "../../../assets/companies/anoma/logo-light.svg";
import anomaLogoDark from "../../../assets/companies/anoma/logo-dark.svg";
import anomaMark from "../../../assets/companies/anoma/mark.svg";
import anomaWordmarkLight from "../../../assets/companies/anoma/wordmark-light.svg";
import anomaWordmarkDark from "../../../assets/companies/anoma/wordmark-dark.svg";

export const anoma = {
  id: "anoma",
  slug: "anoma",
  name: "Anoma",
  profile: {
    tagline: "Web3's intent-centric OS",
    summary:
      "Anoma is an intent-centric, privacy-preserving protocol for decentralized counterparty discovery, solving, and multi-chain atomic settlement.",
    description:
      "Anoma is a distributed operating system for intent-centric applications that unifies underlying blockchains into a single development environment. Users express desired end states as intents, and a peer-to-peer network of solvers handles discovery, matchmaking, and settlement across connected chains. The architecture spans an application layer (Desktop), a P2P intent network (Intentnet), and a hardware abstraction layer (Motherboard) that treats blockchains and decentralized services as a consistent set of resources.",
    sector: "Infrastructure",
    type: "Protocol",
    links: {
      website: "https://anoma.net/",
    },
    socials: {
      x: "https://x.com/anoma",
      github: "https://github.com/anoma",
      discord: "https://discord.com/invite/anoma",
      youtube: "https://www.youtube.com/@anoma",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: anomaLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: anomaLogoDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "mark",
      fileName: "mark.svg",
      format: "svg",
      source: anomaMark,
      kind: "mark",
    },
    {
      id: "wordmark-light",
      fileName: "wordmark-light.svg",
      format: "svg",
      source: anomaWordmarkLight,
      theme: "light",
      kind: "wordmark",
    },
    {
      id: "wordmark-dark",
      fileName: "wordmark-dark.svg",
      format: "svg",
      source: anomaWordmarkDark,
      theme: "dark",
      kind: "wordmark",
    },
  ],
} satisfies CompanyRecord;
