import type { CompanyRecord } from "../../types";
import loyalLogo from "../../../assets/companies/loyal/logo.svg";

export const loyal = {
  id: "loyal",
  slug: "loyal",
  name: "Loyal",
  legalName: "Loyal DAO LLC",
  profile: {
    tagline: "Financial tools for the agentic era",
    summary:
      "Loyal is a self-custody Solana smart-account wallet. It gives users policy guardrails for AI agents, plus private payments and yield on private assets.",
    description:
      "Loyal lets users set spending caps, token whitelists, and approved protocols for AI agents that handle Solana payments and capital workflows, enforced at the smart-account layer so an agent can act only inside the limits a user sets. It supports both agent-suggests-you-approve and autonomous-within-policy modes. Loyal ships as a web app, Chrome extension, Telegram mini app, and Android app, and is available on Seeker (Solana Mobile). Its code is open source under the loyal-labs GitHub organization. Beyond agent guardrails, Loyal offers private payments and yield on private assets.",
    founded: "2025",
    sector: "Wallet",
    type: "Company",
    links: {
      website: "https://askloyal.com",
      docs: "https://docs.askloyal.com",
    },
    socials: {
      x: "https://x.com/loyal_hq",
      linkedin: "https://www.linkedin.com/company/askloyal",
      github: "https://github.com/loyal-labs",
      discord: "https://discord.gg/tAwXsXwTv6",
      telegram: "https://t.me/loyal_tgchat",
      medium: "https://medium.com/@askloyal",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: loyalLogo,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
