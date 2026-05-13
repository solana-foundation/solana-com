import type { CompanyRecord } from "../../types";
import metaLogoLight from "../../../assets/companies/meta/logo-light.svg";
import metaLogoDark from "../../../assets/companies/meta/logo-dark.svg";
import metaLogoMonotone from "../../../assets/companies/meta/logo-monotone.svg";

export const meta = {
  id: "meta",
  slug: "meta",
  name: "Meta",
  legalName: "Meta Platforms, Inc.",
  profile: {
    tagline: "Building the future of human connection",
    summary:
      "Meta develops social technology platforms and consumer hardware spanning virtual reality, mixed reality, and AI-enabled smart glasses.",
    description:
      "Meta Platforms operates Facebook, Instagram, WhatsApp, Messenger, and Threads alongside its Reality Labs division, which builds the Quest mixed reality headsets and Ray-Ban Meta AI glasses. The company also leads large-scale research in artificial intelligence and immersive computing through AI at Meta.",
    type: "Company",
    links: {
      website: "https://www.meta.com/",
    },
    socials: {
      x: "https://x.com/Meta",
      linkedin: "https://www.linkedin.com/company/meta",
      github: "https://github.com/facebook",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: metaLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: metaLogoDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-monotone",
      fileName: "logo-monotone.svg",
      format: "svg",
      source: metaLogoMonotone,
      treatment: "monotone",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
