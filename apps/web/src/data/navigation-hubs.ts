import type { HubPageConfig } from "@/components/navigation-migration/hub-page";

interface NavigationHubConfig extends HubPageConfig {
  path: string;
  metaTitle: string;
  metaDescription: string;
}

export const navigationHubs = {
  useSolana: {
    path: "/use-solana",
    metaTitle: "Use Solana",
    metaDescription:
      "Find wallets, beginner learning resources, safety guidance, and ways to explore apps on Solana.",
    eyebrow: "Use Solana",
    title: "Start using Solana",
    description:
      "Find the routes that help you set up a wallet, learn the basics, stay safe, and explore consumer apps on Solana.",
    primaryCta: {
      title: "Find a wallet",
      href: "/wallets",
    },
    secondaryCta: {
      title: "Learn the basics",
      href: "/learn",
    },
    feature: {
      eyebrow: "Safety first",
      title: "Learn how to stay safe on Solana",
      description:
        "Review practical wallet safety guidance before connecting to apps or moving assets.",
      href: "/learn/staying-safe-on-solana",
      cta: "Read the guide",
    },
    sections: [
      {
        title: "Wallets and onboarding",
        description:
          "Start with the basics and choose the wallet path you need.",
        links: [
          { title: "Wallets", href: "/wallets" },
          { title: "Wallet directory", href: "/solana-wallets" },
          { title: "What is Solana?", href: "/learn/what-is-solana" },
          { title: "Getting started", href: "/learn/getting-started" },
          { title: "What is a wallet?", href: "/learn/what-is-a-wallet" },
          {
            title: "Sending and receiving SOL",
            href: "/learn/sending-and-receiving-sol",
          },
        ],
      },
      {
        title: "Safety, tokens, and apps",
        description:
          "Use existing educational and consumer resources without adding new legal-sensitive claims.",
        links: [
          { title: "Staying safe", href: "/learn/staying-safe-on-solana" },
          {
            title: "Introduction to Solana tokens",
            href: "/learn/introduction-to-solana-tokens",
          },
          { title: "Staking", href: "/staking" },
          { title: "What is staking?", href: "/learn/what-is-staking" },
          { title: "Consumer apps", href: "/solutions/consumer" },
        ],
      },
      {
        title: "Keep learning",
        description: "Follow the existing learning paths for more context.",
        links: [
          { title: "Learn", href: "/learn" },
          {
            title: "Transaction fees",
            href: "/learn/understanding-solana-transaction-fees",
          },
          { title: "Events", href: "/events" },
          { title: "News", href: "/news" },
        ],
      },
    ],
  },
  enterprise: {
    path: "/enterprise",
    metaTitle: "Solana for Enterprise",
    metaDescription:
      "Evaluate Solana for payments, tokenization, stablecoins, network proof, and enterprise use cases.",
    eyebrow: "Enterprise",
    title: "Evaluate Solana for business use cases",
    description:
      "Explore canonical solution pages, network resources, reports, and research for teams assessing Solana infrastructure.",
    primaryCta: {
      title: "Explore enterprise solutions",
      href: "/solutions/enterprise",
    },
    secondaryCta: {
      title: "View network resources",
      href: "/network",
    },
    feature: {
      eyebrow: "Network proof",
      title: "Review reports and research",
      description:
        "Use published reports, research, and validator resources to support technical and business evaluation.",
      href: "/reports",
      cta: "View reports",
    },
    sections: [
      {
        title: "Business solutions",
        description:
          "These pages remain canonical under the long-tail solutions namespace.",
        links: [
          { title: "Enterprise overview", href: "/solutions/enterprise" },
          {
            title: "Institutional payments",
            href: "/solutions/institutional-payments",
          },
          { title: "Commerce tooling", href: "/solutions/commerce-tooling" },
          { title: "Stablecoins", href: "/solutions/stablecoins" },
          { title: "Tokenization", href: "/solutions/tokenization" },
          { title: "Real-world assets", href: "/solutions/real-world-assets" },
        ],
      },
      {
        title: "Financial infrastructure",
        links: [
          { title: "Digital assets", href: "/solutions/digital-assets" },
          { title: "DeFi", href: "/solutions/defi" },
          {
            title: "Financial infrastructure",
            href: "/solutions/financial-infrastructure",
          },
          {
            title: "Financial institutions",
            href: "/solutions/financial-institutions",
          },
          { title: "DePIN", href: "/solutions/depin" },
        ],
      },
      {
        title: "Validation and proof",
        links: [
          { title: "Network hub", href: "/network" },
          { title: "Validators", href: "/validators" },
          { title: "Reports", href: "/reports" },
          { title: "Research", href: "/research" },
          { title: "Privacy", href: "/privacy" },
        ],
      },
    ],
  },
  products: {
    path: "/products",
    metaTitle: "Solana Products",
    metaDescription:
      "Find Solana product surfaces, developer platform resources, AI tools, x402, Agent Registry, Skills, Commerce Kit, Kora, Solana Pay, RPC providers, and product tooling.",
    eyebrow: "Products",
    title: "Find Solana product surfaces",
    description:
      "Use this hub for product-team and Foundation product surfaces while keeping current canonical routes intact.",
    primaryCta: {
      title: "Solana Developer Platform",
      href: "/solutions/sdp",
    },
    secondaryCta: {
      title: "Explore agent tools",
      href: "/agent-registry",
    },
    feature: {
      eyebrow: "Product surface",
      title: "Build with x402 on Solana",
      description:
        "Review the current x402 product route and related resources without moving canonical URLs.",
      href: "/x402",
      cta: "Open x402",
    },
    sections: [
      {
        title: "Platforms and product surfaces",
        links: [
          { title: "Solana Developer Platform", href: "/solutions/sdp" },
          { title: "x402", href: "/x402" },
          { title: "Agent Registry", href: "/agent-registry" },
          { title: "Skills", href: "/skills" },
          { title: "Actions and blinks", href: "/solutions/actions" },
          { title: "Agents and AI", href: "/solutions/ai" },
        ],
      },
      {
        title: "Developer and payment tools",
        links: [
          { title: "Commerce Kit", href: "/docs/tools/commerce-kit" },
          { title: "Kora", href: "/docs/tools/kora" },
          { title: "Solana Pay", href: "/docs/tools/solana-pay" },
          { title: "RPC providers", href: "/rpc" },
          { title: "Payments tooling", href: "/solutions/payments-tooling" },
          { title: "Token Extensions", href: "/solutions/token-extensions" },
          { title: "Digital assets", href: "/solutions/digital-assets" },
        ],
      },
      {
        title: "Build with products",
        links: [
          { title: "Docs", href: "/docs" },
          { title: "Tokens docs", href: "/docs/tokens" },
          { title: "RPC providers", href: "/rpc" },
          { title: "Developer guides", href: "/developers/guides" },
        ],
      },
    ],
  },
  ecosystem: {
    path: "/ecosystem",
    metaTitle: "Solana Ecosystem",
    metaDescription:
      "Explore Solana network resources, events, community, ecosystem categories, news, podcasts, reports, and research.",
    eyebrow: "Ecosystem",
    title: "Explore the Solana ecosystem",
    description:
      "Find network resources, events, community programs, ecosystem categories, news, podcasts, reports, and research.",
    primaryCta: {
      title: "Explore events",
      href: "/events",
    },
    secondaryCta: {
      title: "View network hub",
      href: "/network",
    },
    feature: {
      eyebrow: "Event",
      title: "Breakpoint",
      description:
        "Follow Solana's major ecosystem event and related community programming.",
      href: "/breakpoint",
      cta: "Open Breakpoint",
    },
    sections: [
      {
        title: "Network",
        links: [
          { title: "Network hub", href: "/network" },
          { title: "Validators", href: "/validators" },
          { title: "RPC providers", href: "/rpc" },
          { title: "Reports", href: "/reports" },
          { title: "Research", href: "/research" },
          {
            title: "Status",
            href: "https://status.solana.com/",
            external: true,
          },
        ],
      },
      {
        title: "Events and community",
        links: [
          { title: "Events", href: "/events" },
          { title: "Event archive", href: "/events/archive" },
          { title: "Accelerate", href: "/accelerate" },
          { title: "Breakpoint", href: "/breakpoint" },
          { title: "Community", href: "/community" },
          { title: "News", href: "/news" },
          { title: "Podcasts", href: "/podcasts" },
        ],
      },
      {
        title: "Categories and programs",
        links: [
          { title: "DePIN", href: "/solutions/depin" },
          { title: "DeSci", href: "/solutions/desci" },
          { title: "BTCFi", href: "/solutions/btcfi" },
          {
            title: "Gaming and entertainment",
            href: "/solutions/gaming-and-entertainment",
          },
          {
            title: "Artists and creators",
            href: "/solutions/artists-creators",
          },
          {
            title: "Request for Startups",
            href: "/solutions/request-for-startups",
          },
        ],
      },
    ],
  },
  network: {
    path: "/network",
    metaTitle: "Solana Network",
    metaDescription:
      "Find Solana network resources, validator information, RPC providers, status, reports, and research.",
    eyebrow: "Network",
    title: "Inspect and understand the Solana network",
    description:
      "Use this hub for validator resources, RPC providers, network status, reports, research, and network-related proof points.",
    primaryCta: {
      title: "Become a validator",
      href: "/validators",
    },
    secondaryCta: {
      title: "View status",
      href: "https://status.solana.com/",
      external: true,
    },
    feature: {
      eyebrow: "Resources",
      title: "Review network reports",
      description:
        "Use reports and research to understand current network context and ecosystem activity.",
      href: "/reports",
      cta: "View reports",
    },
    sections: [
      {
        title: "Operate and build",
        links: [
          { title: "Validators", href: "/validators" },
          { title: "RPC providers", href: "/rpc" },
          { title: "Docs", href: "/docs" },
          { title: "RPC docs", href: "/docs/rpc" },
        ],
      },
      {
        title: "Inspect",
        links: [
          {
            title: "Solscan",
            href: "https://solscan.io/",
            external: true,
          },
          {
            title: "Solana Explorer",
            href: "https://explorer.solana.com/",
            external: true,
          },
          {
            title: "Status",
            href: "https://status.solana.com/",
            external: true,
          },
        ],
      },
      {
        title: "Learn and evaluate",
        links: [
          { title: "Reports", href: "/reports" },
          { title: "Research", href: "/research" },
          { title: "Privacy", href: "/privacy" },
          { title: "Ecosystem", href: "/ecosystem" },
        ],
      },
    ],
  },
} satisfies Record<string, NavigationHubConfig>;
