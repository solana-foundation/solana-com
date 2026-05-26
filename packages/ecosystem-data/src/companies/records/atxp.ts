import type { CompanyRecord } from "../../types";
import atxpLogo from "../../../assets/companies/atxp/logo.svg";
import atxpMarkDark from "../../../assets/companies/atxp/mark-dark.svg";
import atxpMarkLight from "../../../assets/companies/atxp/mark-light.svg";
import atxpWordmarkDark from "../../../assets/companies/atxp/wordmark-dark.svg";
import atxpWordmarkLight from "../../../assets/companies/atxp/wordmark-light.svg";

export const atxp = {
  id: "atxp",
  slug: "atxp",
  name: "ATXP",
  profile: {
    tagline: "The Account for AI Agents",
    summary:
      "ATXP provides AI agents with accounts, payments, email, and tool access through a unified platform for autonomous transactions.",
    description:
      "ATXP, the Agent Transaction Protocol, gives AI agents the infrastructure they need to register accounts, fund usage, and pay for inference and tools without relying on operator-managed API keys. Its platform includes an OpenAI-compatible LLM gateway, paid tool access, agent email, and account management flows for self-registering agents. The product is positioned as an economic layer for agents that need identity, payments, and service access in one place.",
    sector: "Developer Tools",
    type: "Platform",
    links: {
      website: "https://atxp.ai/",
      app: "https://accounts.atxp.ai/",
      docs: "https://docs.atxp.ai/",
      blog: "https://atxp.ai/blog/",
    },
    socials: {
      x: "https://x.com/atxp_ai",
      github: "https://github.com/atxp-dev",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: atxpLogo,
    },
    {
      id: "wordmark-dark",
      fileName: "wordmark-dark.svg",
      format: "svg",
      source: atxpWordmarkDark,
      kind: "wordmark",
      theme: "light",
    },
    {
      id: "wordmark-light",
      fileName: "wordmark-light.svg",
      format: "svg",
      source: atxpWordmarkLight,
      kind: "wordmark",
      theme: "dark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: atxpMarkDark,
      kind: "mark",
      theme: "light",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: atxpMarkLight,
      kind: "mark",
      theme: "dark",
    },
  ],
} satisfies CompanyRecord;
