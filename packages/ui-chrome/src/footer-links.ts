export type FooterLink = {
  labelKey: string;
  href: string;
  preserveHref?: boolean;
  searchTerms?: string[];
};

export type FooterColumnConfig = {
  headingKey: string;
  links: FooterLink[];
};

export const FOOTER_COLUMNS: FooterColumnConfig[] = [
  {
    headingKey: "footer.useSolana.heading",
    links: [
      { labelKey: "footer.useSolana.hub", href: "/use-solana" },
      { labelKey: "footer.useSolana.wallets", href: "/wallets" },
      { labelKey: "footer.useSolana.learn", href: "/learn" },
      { labelKey: "footer.useSolana.staking", href: "/staking" },
    ],
  },
  {
    headingKey: "footer.build.heading",
    links: [
      { labelKey: "footer.build.developers", href: "/developers" },
      { labelKey: "footer.build.docs", href: "/docs" },
      { labelKey: "footer.build.templates", href: "/developers/templates" },
    ],
  },
  {
    headingKey: "footer.enterprise.heading",
    links: [
      { labelKey: "footer.enterprise.hub", href: "/enterprise" },
      {
        labelKey: "footer.enterprise.payments",
        href: "/solutions/institutional-payments",
      },
      {
        labelKey: "footer.enterprise.tokenization",
        href: "/solutions/tokenization",
      },
      { labelKey: "footer.enterprise.reports", href: "/reports" },
    ],
  },
  {
    headingKey: "footer.products.heading",
    links: [
      { labelKey: "footer.products.hub", href: "/products" },
      { labelKey: "footer.products.sdp", href: "/solutions/sdp" },
      { labelKey: "footer.products.x402", href: "/x402" },
      { labelKey: "footer.products.agentRegistry", href: "/agent-registry" },
      { labelKey: "footer.products.skills", href: "/skills" },
    ],
  },
  {
    headingKey: "footer.ecosystem.heading",
    links: [
      { labelKey: "footer.ecosystem.hub", href: "/ecosystem" },
      { labelKey: "footer.ecosystem.network", href: "/network" },
      { labelKey: "footer.ecosystem.events", href: "/events" },
      { labelKey: "footer.ecosystem.community", href: "/community" },
      { labelKey: "footer.ecosystem.news", href: "/news" },
      { labelKey: "footer.ecosystem.newsletter", href: "/newsletter" },
    ],
  },
  {
    headingKey: "footer.agents.heading",
    links: [
      { labelKey: "footer.agents.llms", href: "/llms.txt", preserveHref: true },
      {
        labelKey: "footer.agents.fullDocs",
        href: "/llms-full.txt",
        preserveHref: true,
      },
      {
        labelKey: "footer.agents.skill",
        href: "/SKILL.md",
        preserveHref: true,
      },
      { labelKey: "footer.agents.skills", href: "/skills" },
    ],
  },
];

export const META_LINKS: FooterLink[] = [
  { labelKey: "footer.solana.grants", href: "https://solana.org/grants" },
  {
    labelKey: "footer.solana.media",
    href: "/branding",
    searchTerms: ["logos", "brand", "assets", "guidelines"],
  },
  { labelKey: "footer.solana.careers", href: "https://jobs.solana.com/" },
  { labelKey: "footer.solana.disclaimer", href: "/tos" },
  { labelKey: "footer.solana.privacy-policy", href: "/privacy-policy" },
];
