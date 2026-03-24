import type { CompanyRecord } from "../../types";
import gradientLogo from "../../../assets/companies/gradient/logo.png";

export const gradient = {
  id: "gradient",
  slug: "gradient",
  name: "Gradient Network",
  profile: {
    tagline: "Building open intelligence collectively",
    summary:
      "Gradient Network is a decentralized AI infrastructure platform on Solana that enables distributed training, serving, and agentic systems through its Open Intelligence Stack.",
    description:
      "Gradient is an AI R&D lab building the Open Intelligence Stack (OIS), a fully decentralized infrastructure on Solana for distributed AI workloads. The network transforms idle devices into compute nodes via a lightweight Chrome extension called Sentry Node, with over 1.6 million active nodes deployed across 190+ countries. Its core protocols enable AI models to run across distributed devices at scale.",
    sector: "DePIN",
    type: "Protocol",
    links: {
      website: "https://gradient.network/",
    },
    socials: {
      x: "https://x.com/Gradient_HQ",
      linkedin: "https://www.linkedin.com/company/gradient-network",
      discord: "https://discord.com/invite/gradientnetwork",
      telegram: "https://t.me/Gradient_HQ",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.png",
      format: "png",
      source: gradientLogo,
    },
  ],
} satisfies CompanyRecord;
