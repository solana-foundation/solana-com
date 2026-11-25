import type { CompanyRecord } from "../../types";
import doublezeroPixelLogoWhite from "../../../assets/companies/doublezero/breakpoint-2026-white.svg";
import doublezeroWordmarkWhite from "../../../assets/companies/doublezero/wordmark-white.svg";
import doublezeroWordmarkBlack from "../../../assets/companies/doublezero/wordmark-black.svg";
import doublezeroLogoColor from "../../../assets/companies/doublezero/logo-color.svg";
import doublezeroEdgeLogoWhite from "../../../assets/companies/doublezero/edge-logo-white.svg";
import doublezeroEdgeLogoBlack from "../../../assets/companies/doublezero/edge-logo-black.svg";
import doublezeroEdgeStackedWhite from "../../../assets/companies/doublezero/edge-stacked-white.svg";
import doublezeroEdgeStackedBlack from "../../../assets/companies/doublezero/edge-stacked-black.svg";
import doublezeroEdgeLogoWideBlack from "../../../assets/companies/doublezero/edge-logo-wide-black.svg";
import doublezeroLogo from "../../../assets/companies/doublezero/logo.svg";

export const doublezero = {
  id: "doublezero",
  slug: "doublezero",
  name: "DoubleZero",
  profile: {
    tagline: "Dedicated connectivity for distributed systems.",
    summary:
      "DoubleZero is a decentralized fiber network providing low-latency connectivity for distributed systems like blockchain networks.",
    description:
      "DoubleZero connects validators, trading firms, and other distributed systems through dedicated fiber links contributed by independent operators. Its network supports multicast delivery and market data distribution, with access control and payment settlement coordinated onchain.",
    sector: "Infrastructure",
    type: "Company",
    links: {
      website: "https://doublezero.xyz/",
    },
    socials: {
      x: "https://x.com/doublezero",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo-pixel-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: doublezeroPixelLogoWhite,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "wordmark-white",
      fileName: "wordmark-white.svg",
      format: "svg",
      width: 659,
      height: 105,
      theme: "dark",
      kind: "wordmark",
      background: "transparent",
      source: doublezeroWordmarkWhite,
    },
    {
      id: "wordmark-black",
      fileName: "wordmark-black.svg",
      format: "svg",
      width: 659,
      height: 105,
      theme: "light",
      kind: "wordmark",
      background: "transparent",
      source: doublezeroWordmarkBlack,
    },
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      width: 445,
      height: 72,
      theme: "light",
      kind: "logo",
      background: "transparent",
      source: doublezeroLogoColor,
    },
    {
      id: "edge-logo-white",
      fileName: "edge-logo-white.svg",
      format: "svg",
      width: 816,
      height: 85,
      theme: "dark",
      kind: "logo",
      background: "transparent",
      source: doublezeroEdgeLogoWhite,
    },
    {
      id: "edge-logo-black",
      fileName: "edge-logo-black.svg",
      format: "svg",
      width: 816,
      height: 85,
      theme: "light",
      kind: "logo",
      background: "transparent",
      source: doublezeroEdgeLogoBlack,
    },
    {
      id: "edge-stacked-white",
      fileName: "edge-stacked-white.svg",
      format: "svg",
      width: 233,
      height: 112,
      theme: "dark",
      kind: "logo",
      background: "transparent",
      source: doublezeroEdgeStackedWhite,
    },
    {
      id: "edge-stacked-black",
      fileName: "edge-stacked-black.svg",
      format: "svg",
      width: 233,
      height: 112,
      theme: "light",
      kind: "logo",
      background: "transparent",
      source: doublezeroEdgeStackedBlack,
    },
    {
      id: "edge-logo-wide-black",
      fileName: "edge-logo-wide-black.svg",
      format: "svg",
      width: 1491,
      height: 158,
      theme: "light",
      kind: "logo",
      background: "transparent",
      source: doublezeroEdgeLogoWideBlack,
    },
    {
      id: "breakpoint-2026-white",
      fileName: "wordmark-white.svg",
      format: "svg",
      width: 659,
      height: 105,
      theme: "dark",
      kind: "wordmark",
      background: "transparent",
      treatment: "monotone",
      source: doublezeroWordmarkWhite,
    },
    { id: "logo", fileName: "logo.svg", format: "svg", source: doublezeroLogo },
  ],
} satisfies CompanyRecord;
