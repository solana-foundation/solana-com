import type { CompanyRecord } from "../../types";
import paxosBreakpoint2026White from "../../../assets/companies/paxos/breakpoint-2026-white.png";
import paxosGlobalDollarNetworkDark from "../../../assets/companies/paxos/global-dollar-network-dark.png";
import paxosGlobalDollarNetworkDarkSvg from "../../../assets/companies/paxos/global-dollar-network-dark.svg";
import paxosGlobalDollarNetworkLight from "../../../assets/companies/paxos/global-dollar-network-light.png";
import paxosGlobalDollarNetworkLightSvg from "../../../assets/companies/paxos/global-dollar-network-light.svg";
import paxosUsdgBrandmarkDark from "../../../assets/companies/paxos/usdg-brandmark-dark.png";
import paxosUsdgBrandmarkDarkSvg from "../../../assets/companies/paxos/usdg-brandmark-dark.svg";
import paxosUsdgBrandmarkLight from "../../../assets/companies/paxos/usdg-brandmark-light.png";
import paxosUsdgBrandmarkLightSvg from "../../../assets/companies/paxos/usdg-brandmark-light.svg";
import paxosUsdgBrandmarkReversed from "../../../assets/companies/paxos/usdg-brandmark-reversed.png";
import paxosUsdgBrandmarkReversedSvg from "../../../assets/companies/paxos/usdg-brandmark-reversed.svg";

export const paxos = {
  id: "paxos",
  slug: "paxos",
  name: "Paxos",
  profile: {
    summary:
      "Paxos provides regulated blockchain infrastructure and issues stablecoins for institutional and consumer use cases.",
    description:
      "Paxos provides infrastructure for digital assets, stablecoins, custody, and settlement. Its issued stablecoins, including Global Dollar (USDG), are supported on Solana.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://www.paxos.com/",
      docs: "https://docs.paxos.com/guides/developer/blockchains",
    },
    socials: {
      x: "https://x.com/Paxos",
      linkedin: "https://www.linkedin.com/company/paxos/",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: paxosBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "global-dollar-network-light",
      fileName: "global-dollar-network-light.svg",
      format: "svg",
      source: paxosGlobalDollarNetworkLightSvg,
      theme: "light",
    },
    {
      id: "global-dollar-network-dark",
      fileName: "global-dollar-network-dark.svg",
      format: "svg",
      source: paxosGlobalDollarNetworkDarkSvg,
      theme: "dark",
    },
    {
      id: "global-dollar-network-light-png",
      fileName: "global-dollar-network-light.png",
      format: "png",
      source: paxosGlobalDollarNetworkLight,
      theme: "light",
    },
    {
      id: "global-dollar-network-dark-png",
      fileName: "global-dollar-network-dark.png",
      format: "png",
      source: paxosGlobalDollarNetworkDark,
      theme: "dark",
    },
    {
      id: "usdg-brandmark-dark",
      fileName: "usdg-brandmark-dark.svg",
      format: "svg",
      source: paxosUsdgBrandmarkDarkSvg,
      theme: "light",
      kind: "mark",
    },
    {
      id: "usdg-brandmark-light",
      fileName: "usdg-brandmark-light.svg",
      format: "svg",
      source: paxosUsdgBrandmarkLightSvg,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "usdg-brandmark-reversed",
      fileName: "usdg-brandmark-reversed.svg",
      format: "svg",
      source: paxosUsdgBrandmarkReversedSvg,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "usdg-brandmark-dark-png",
      fileName: "usdg-brandmark-dark.png",
      format: "png",
      source: paxosUsdgBrandmarkDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "usdg-brandmark-light-png",
      fileName: "usdg-brandmark-light.png",
      format: "png",
      source: paxosUsdgBrandmarkLight,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "usdg-brandmark-reversed-png",
      fileName: "usdg-brandmark-reversed.png",
      format: "png",
      source: paxosUsdgBrandmarkReversed,
      theme: "dark",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
