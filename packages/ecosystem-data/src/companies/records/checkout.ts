import type { CompanyRecord } from "../../types";
import checkoutLogoStackedDark from "../../../assets/companies/checkout/logo-stacked-dark.svg";
import checkoutLogoStackedLight from "../../../assets/companies/checkout/logo-stacked-light.svg";
import checkoutLogoStackedColor from "../../../assets/companies/checkout/logo-stacked-color.svg";
import checkoutMarkDark from "../../../assets/companies/checkout/mark-dark.svg";
import checkoutMarkLight from "../../../assets/companies/checkout/mark-light.svg";
import checkoutMarkColor from "../../../assets/companies/checkout/mark-color.svg";
import checkoutLogoHorizontalLight from "../../../assets/companies/checkout/logo-horizontal-light.svg";
import checkoutLogoStackedBLight from "../../../assets/companies/checkout/logo-stacked-b-light.svg";
import checkoutLogoStackedBColor from "../../../assets/companies/checkout/logo-stacked-b-color.svg";
import checkoutLogoStackedBColorDark from "../../../assets/companies/checkout/logo-stacked-b-color-dark.svg";
import checkoutBreakpoint2026White from "../../../assets/companies/checkout/breakpoint-2026-white.svg";

export const checkout = {
  id: "checkout",
  slug: "checkout",
  name: "Checkout.com",
  profile: {
    tagline: "Payment processing for digital businesses.",
    summary:
      "Checkout.com provides a global payments platform with gateway, acquiring, processing, and fraud prevention services.",
    description:
      "Checkout.com helps businesses accept online payments through cards and local payment methods. Its platform combines payment processing, acquiring, and fraud prevention tools across multiple currencies.",
    sector: "Payments",
    type: "Company",
    links: { website: "https://www.checkout.com/" },
    socials: {
      x: "https://x.com/checkout",
      linkedin: "https://www.linkedin.com/company/checkout",
    },
  },
  defaultLogoId: "logo-stacked-color",
  logos: [
    {
      id: "logo-stacked-dark",
      fileName: "logo-stacked-dark.svg",
      format: "svg",
      source: checkoutLogoStackedDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-stacked-light",
      fileName: "logo-stacked-light.svg",
      format: "svg",
      source: checkoutLogoStackedLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-stacked-color",
      fileName: "logo-stacked-color.svg",
      format: "svg",
      source: checkoutLogoStackedColor,
      theme: "light",
      kind: "logo",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: checkoutMarkDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: checkoutMarkLight,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-color",
      fileName: "mark-color.svg",
      format: "svg",
      source: checkoutMarkColor,
      kind: "mark",
    },
    {
      id: "logo-horizontal-light",
      fileName: "logo-horizontal-light.svg",
      format: "svg",
      source: checkoutLogoHorizontalLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-stacked-b-light",
      fileName: "logo-stacked-b-light.svg",
      format: "svg",
      source: checkoutLogoStackedBLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-stacked-b-color",
      fileName: "logo-stacked-b-color.svg",
      format: "svg",
      source: checkoutLogoStackedBColor,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-stacked-b-color-dark",
      fileName: "logo-stacked-b-color-dark.svg",
      format: "svg",
      source: checkoutLogoStackedBColorDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: checkoutBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
