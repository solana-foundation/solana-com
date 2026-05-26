import type { CompanyRecord } from "../../types";
import dabbaLogo from "../../../assets/companies/dabba/logo.svg";
import dabbaWordmarkColor from "../../../assets/companies/dabba/wordmark-color.svg";

export const dabba = {
  id: "dabba",
  slug: "dabba",
  name: "Dabba",
  profile: {
    tagline: "Web3 powered WiFi networks, built for emerging markets",
    summary:
      "Dabba Network is a DePIN project on Solana that deploys decentralized WiFi hotspots across India to provide affordable high-speed internet access to underserved communities.",
    description:
      "Dabba Network operates a decentralized physical infrastructure network (DePIN) on Solana, deploying WiFi hotspots across India through local cable operators. The network is live in over 11,000 locations, with a mission to bring internet access to a billion Indians over the next decade. The platform uses the DBT utility token to reward hotspot owners and network participants, with tokens burned as data is consumed.",
    sector: "DePIN",
    type: "Company",
    links: {
      website: "https://dabba.com",
    },
    socials: {
      x: "https://x.com/DabbaNetwork",
      linkedin: "https://www.linkedin.com/company/wifidabba",
      discord: "https://discord.gg/dabbanetwork",
      telegram: "https://t.me/DabbaHQ",
      github: "https://github.com/wifidabba",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: dabbaLogo,
    },
    {
      id: "wordmark-color",
      fileName: "wordmark-color.svg",
      format: "svg",
      source: dabbaWordmarkColor,
      kind: "wordmark",
    },
  ],
} satisfies CompanyRecord;
