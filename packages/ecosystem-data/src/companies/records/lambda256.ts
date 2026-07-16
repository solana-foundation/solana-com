import type { CompanyRecord } from "../../types";
import lambda256Breakpoint2026White from "../../../assets/companies/lambda256/breakpoint-2026-white.svg";
import lambda256LogoLight from "../../../assets/companies/lambda256/logo-light.svg";
import lambda256LogoDark from "../../../assets/companies/lambda256/logo-dark.svg";

export const lambda256 = {
  id: "lambda256",
  slug: "lambda256",
  name: "Lambda256",
  profile: {
    tagline: "Blockchain infrastructure for institutions and developers",
    summary:
      "Lambda256 builds blockchain infrastructure and data products for institutions and developers, including its multi-chain Nodit platform.",
    description:
      "Lambda256 provides node operations, data APIs, stablecoin management, and digital-asset risk tooling. Its Nodit platform supplies node infrastructure, indexed onchain data, webhooks, staking infrastructure, and Solana support for institutional workflows.",
    sector: "Infrastructure",
    type: "Company",
    links: {
      website: "https://www.lambda256.io/",
      app: "https://www.nodit.io/",
    },
    socials: {
      x: "https://x.com/Lambda256",
      linkedin: "https://www.linkedin.com/company/lambda256",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: lambda256Breakpoint2026White,
      theme: "dark",
      kind: "logo",
      treatment: "monotone",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: lambda256LogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: lambda256LogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
