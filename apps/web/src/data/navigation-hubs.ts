import type { HubPageConfig } from "@/components/navigation-migration/hub-page";

interface NavigationHubConfig extends HubPageConfig {
  path: string;
  metaTitle: string;
  metaDescription: string;
}

const indexHero = "/src/img/index/hero-bg.webp";
const projectsBg = "/src/img/index/projects-bg.webp";
const performanceBg = "/src/img/index/performance-bg.webp";
const communityHero = "/src/img/community/hero.png";
const walletImage = "/images/learn/creating_your_first_wallet.webp";
const tokenizationImage = "/src/img/solutions/icm/what-is.webp";
const sdpImage = "/src/img/solutions/sdp/hero-bg.webp";
const depinImage = "/src/img/solutions/depin/globe.webp";

export const navigationHubs = {
  useSolana: {
    path: "/use-solana",
    metaTitle: "Use Solana",
    metaDescription:
      "Find wallets, beginner learning resources, safety guidance, transaction basics, and ways to explore apps on Solana.",
    eyebrow: "Use Solana",
    title: "Start using Solana with confidence",
    description:
      "Choose a wallet, learn how SOL, fees, tokens, and transfers work, build safer signing habits, and discover the apps and communities that make Solana useful day to day.",
    accentColor: "#14F195",
    heroImageSrc: indexHero,
    primaryCta: {
      title: "Compare wallets",
      href: "/solana-wallets",
    },
    secondaryCta: {
      title: "Learn the basics",
      href: "/learn",
    },
    metrics: [
      {
        value: "01",
        label: "Choose a wallet",
        description:
          "Compare wallets by platform, features, and security model so your first account fits how you plan to use Solana.",
      },
      {
        value: "02",
        label: "Learn the first actions",
        description:
          "Work through no-code lessons on wallets, SOL transfers, transaction fees, tokens, staking, DeFi, NFTs, and app discovery.",
      },
      {
        value: "03",
        label: "Build safe habits",
        description:
          "Review safety guidance before connecting to apps, signing transactions, or moving assets across unfamiliar workflows.",
      },
      {
        value: "04",
        label: "Explore apps",
        description:
          "Move from fundamentals into consumer apps, staking education, ecosystem events, and the wider Solana community.",
      },
    ],
    overview: {
      eyebrow: "User journey",
      title: "A guided path from first wallet to first transaction.",
      description:
        "The Learn path already covers Solana basics, wallets, fees, transfers, staking, tokens, applications, and safety. This hub puts those resources in the order most new users need them.",
      imageSrc: walletImage,
      points: [
        {
          title: "Wallet first",
          description:
            "Your wallet is the account layer you use to hold assets, sign transactions, and connect to Solana applications.",
        },
        {
          title: "Then mechanics",
          description:
            "Learn what SOL is used for, why fees are low, how transfers work, and how tokens and staking fit into everyday usage.",
        },
        {
          title: "Safety before scale",
          description:
            "Review seed phrase, link, approval, and app-connection habits before wallet prompts become routine.",
        },
      ],
    },
    pathways: [
      {
        eyebrow: "First wallet",
        title: "Choose a wallet you can use across Solana apps.",
        description:
          "Compare wallets by platform and features, then use the wallet basics guide to understand keys, accounts, and approvals.",
        href: "/solana-wallets",
        cta: "Compare wallets",
        featured: true,
        links: [
          { title: "Wallet finder", href: "/solana-wallets" },
          { title: "What is a wallet?", href: "/learn/what-is-a-wallet" },
          { title: "Wallets", href: "/wallets" },
        ],
      },
      {
        eyebrow: "Core concepts",
        title: "Learn how SOL, fees, tokens, and transfers work.",
        description:
          "Read the introductory chapters on Solana, fees, token basics, and how transfers work before connecting to unfamiliar apps.",
        href: "/learn",
        cta: "Open learn path",
        links: [
          { title: "What is Solana?", href: "/learn/what-is-solana" },
          {
            title: "Transaction fees",
            href: "/learn/understanding-solana-transaction-fees",
          },
          { title: "Tokens", href: "/learn/introduction-to-solana-tokens" },
        ],
      },
      {
        eyebrow: "App exploration",
        title: "Discover apps, staking, and community events.",
        description:
          "Explore consumer apps and staking education once you understand wallet basics, transaction fees, and signing safety.",
        href: "/solutions/consumer",
        cta: "Explore consumer apps",
        links: [
          { title: "Consumer apps", href: "/solutions/consumer" },
          { title: "Staking", href: "/staking" },
          { title: "Events", href: "/events" },
        ],
      },
    ],
    feature: {
      eyebrow: "Safety first",
      title: "Review wallet safety before connecting to apps",
      description:
        "Use the safety guide as a standing checkpoint for approvals, seed phrases, links, and common scam patterns.",
      href: "/learn/staying-safe-on-solana",
      cta: "Read the guide",
    },
    resourceHeading: "Use Solana resources",
    resourceDescription:
      "Wallet setup, no-code learning chapters, safety guidance, and discovery links for new Solana users.",
    sections: [
      {
        title: "Wallets and onboarding",
        description:
          "Start with account setup and the minimum concepts needed for first transactions.",
        links: [
          {
            title: "Wallets",
            href: "/wallets",
            description:
              "Learn how Solana wallets power apps, payments, and key management.",
          },
          {
            title: "Wallet directory",
            href: "/solana-wallets",
            description:
              "Filter wallets by platform, supported features, and security preferences.",
          },
          {
            title: "What is Solana?",
            href: "/learn/what-is-solana",
            description:
              "A beginner chapter on the network and what it enables.",
          },
          {
            title: "Getting started",
            href: "/learn/getting-started",
            description: "A guided entry point into basic Solana usage.",
          },
          {
            title: "What is a wallet?",
            href: "/learn/what-is-a-wallet",
            description: "How wallets hold keys and connect to applications.",
          },
          {
            title: "Sending and receiving SOL",
            href: "/learn/sending-and-receiving-sol",
            description: "The mechanics of a basic transfer.",
          },
        ],
      },
      {
        title: "Safety, fees, and tokens",
        description:
          "The topics that matter once you start signing transactions and moving value.",
        links: [
          {
            title: "Staying safe",
            href: "/learn/staying-safe-on-solana",
            description:
              "Security habits for wallets, links, approvals, and apps.",
          },
          {
            title: "Transaction fees",
            href: "/learn/understanding-solana-transaction-fees",
            description: "How fees fit into regular network usage.",
          },
          {
            title: "Introduction to Solana tokens",
            href: "/learn/introduction-to-solana-tokens",
            description:
              "A user-level explanation of token types and behavior.",
          },
          {
            title: "Staking",
            href: "/staking",
            description:
              "Entry point for staking information and validator context.",
          },
          {
            title: "What is staking?",
            href: "/learn/what-is-staking",
            description: "Educational overview of staking concepts.",
          },
          {
            title: "Consumer apps",
            href: "/solutions/consumer",
            description:
              "Consumer apps, social experiences, games, and communities on Solana.",
          },
        ],
      },
      {
        title: "Keep learning",
        description:
          "Broader ecosystem links for users who want to understand what is happening around Solana.",
        links: [
          {
            title: "Learn",
            href: "/learn",
            description: "The full no-code education path.",
          },
          {
            title: "Exploring Solana applications",
            href: "/learn/exploring-solana-applications",
            description: "How to browse app categories with more context.",
          },
          {
            title: "Events",
            href: "/events",
            description: "Meetups, conferences, and community programming.",
          },
          {
            title: "News",
            href: "/news",
            description: "Updates from the Solana ecosystem and Foundation.",
          },
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
    title: "Evaluate Solana for business-critical use cases",
    description:
      "Assess payments, stablecoin issuance, tokenized assets, financial infrastructure, privacy, network performance, and the implementation paths teams need before building on Solana.",
    accentColor: "#CA9FF5",
    heroImageSrc: tokenizationImage,
    primaryCta: {
      title: "Explore enterprise solutions",
      href: "/solutions/enterprise",
    },
    secondaryCta: {
      title: "View network resources",
      href: "/network",
    },
    metrics: [
      {
        value: "Use cases",
        label: "Payments and settlement",
        description:
          "Review institutional payments, stablecoins, commerce tooling, and the Solana Developer Platform from one business-focused entry point.",
      },
      {
        value: "Assets",
        label: "Tokenization and RWAs",
        description:
          "Explore internet capital markets, real-world assets, token extensions, and digital asset primitives.",
      },
      {
        value: "Proof",
        label: "Reports and research",
        description:
          "Use reports and research to understand network health, performance, energy impact, privacy, and ecosystem activity.",
      },
      {
        value: "Build path",
        label: "Docs and tooling",
        description:
          "Connect technical teams to payment docs, token extensions, RPC resources, and partner infrastructure.",
      },
    ],
    overview: {
      eyebrow: "Evaluation path",
      title: "Move from business case to proof to implementation.",
      description:
        "Start with the outcome you are evaluating, then go deeper into the reports, validator resources, privacy material, developer docs, and product tooling that support technical diligence.",
      imageSrc: projectsBg,
      points: [
        {
          title: "Business cases",
          description:
            "Payments, stablecoins, tokenized assets, and financial infrastructure each have dedicated solution pages with examples, use cases, and supporting tools.",
        },
        {
          title: "Technical proof",
          description:
            "Network, validator, report, research, privacy, and RPC resources give teams more context before committing to an architecture.",
        },
        {
          title: "Implementation path",
          description:
            "Docs for payments, token extensions, Solana Pay, Kora, Commerce Kit, and RPC providers connect strategy to actual integration work.",
        },
      ],
    },
    pathways: [
      {
        eyebrow: "Move money",
        title: "Assess payments, stablecoins, and settlement workflows.",
        description:
          "Start with institutional payments and stablecoin issuance, then continue into payment docs and platform tooling.",
        href: "/solutions/institutional-payments",
        cta: "Open payment solutions",
        featured: true,
        links: [
          {
            title: "Institutional payments",
            href: "/solutions/institutional-payments",
          },
          { title: "Stablecoins", href: "/solutions/stablecoins" },
          { title: "Payments docs", href: "/docs/payments" },
        ],
      },
      {
        eyebrow: "Issue assets",
        title: "Explore tokenization, RWAs, and digital asset primitives.",
        description:
          "Use the tokenization and real-world asset pages for business context, then review token extensions for implementation details.",
        href: "/solutions/tokenization",
        cta: "Open tokenization",
        links: [
          { title: "Tokenization", href: "/solutions/tokenization" },
          { title: "Real-world assets", href: "/solutions/real-world-assets" },
          { title: "Token Extensions", href: "/solutions/token-extensions" },
        ],
      },
      {
        eyebrow: "Validate readiness",
        title: "Review network, privacy, and research material.",
        description:
          "Give diligence teams fast access to reports, validator information, privacy material, and network operations context.",
        href: "/reports",
        cta: "View reports",
        links: [
          { title: "Network hub", href: "/network" },
          { title: "Reports", href: "/reports" },
          { title: "Privacy", href: "/privacy" },
        ],
      },
    ],
    feature: {
      eyebrow: "Network proof",
      title: "Use reports and research for diligence",
      description:
        "Published reports, research, and validator resources help technical and business teams evaluate Solana with more context.",
      href: "/reports",
      cta: "View reports",
    },
    resourceHeading: "Enterprise resources",
    resourceDescription:
      "Solution pages, technical docs, and research materials for teams evaluating Solana in production.",
    sections: [
      {
        title: "Business solutions",
        description:
          "Use-case pages for payments, stablecoins, commerce, tokenization, and real-world assets.",
        links: [
          {
            title: "Enterprise overview",
            href: "/solutions/enterprise",
            description:
              "Partner and enterprise context for organizations evaluating Solana.",
          },
          {
            title: "Institutional payments",
            href: "/solutions/institutional-payments",
            description:
              "Payment rails, stablecoin settlement, and business flows.",
          },
          {
            title: "Commerce tooling",
            href: "/solutions/commerce-tooling",
            description: "Tools for commerce and payment acceptance.",
          },
          {
            title: "Stablecoins",
            href: "/solutions/stablecoins",
            description: "Stablecoin issuance and distribution context.",
          },
          {
            title: "Tokenization",
            href: "/solutions/tokenization",
            description:
              "Internet capital markets, tokenized assets, and market access.",
          },
          {
            title: "Real-world assets",
            href: "/solutions/real-world-assets",
            description: "Asset tokenization use cases and related examples.",
          },
        ],
      },
      {
        title: "Financial infrastructure",
        description:
          "Specialized paths for payments, capital markets, DeFi, institutions, and infrastructure teams.",
        links: [
          {
            title: "Solana Developer Platform",
            href: "/solutions/sdp",
            description: "APIs and infrastructure for financial products.",
          },
          {
            title: "Digital assets",
            href: "/solutions/digital-assets",
            description:
              "Consumer and institutional digital asset building blocks.",
          },
          {
            title: "DeFi",
            href: "/solutions/defi",
            description: "Open financial markets and liquidity context.",
          },
          {
            title: "Financial infrastructure",
            href: "/solutions/financial-infrastructure",
            description: "Infrastructure-oriented financial use cases.",
          },
          {
            title: "Financial institutions",
            href: "/solutions/financial-institutions",
            description: "Institutional examples and ecosystem context.",
          },
          {
            title: "DePIN",
            href: "/solutions/depin",
            description:
              "Networks coordinating physical infrastructure with onchain incentives.",
          },
        ],
      },
      {
        title: "Validation and proof",
        description:
          "Network, validator, report, research, and privacy resources for technical review.",
        links: [
          {
            title: "Network hub",
            href: "/network",
            description:
              "Validators, RPC, status, explorers, reports, and research.",
          },
          {
            title: "Validators",
            href: "/validators",
            description:
              "How validators participate in Solana network operations.",
          },
          {
            title: "Reports",
            href: "/reports",
            description: "Network, ecosystem, and research report archive.",
          },
          {
            title: "Research",
            href: "/research",
            description:
              "Research and analysis on network health and performance.",
          },
          {
            title: "Privacy",
            href: "/privacy",
            description: "Privacy primitives and confidential token context.",
          },
        ],
      },
    ],
  },
  products: {
    path: "/products",
    metaTitle: "Solana Products",
    metaDescription:
      "Find Solana Developer Platform, x402, Agent Registry, Skills, Actions and blinks, Solana Pay, Commerce Kit, Kora, RPC providers, and implementation docs.",
    eyebrow: "Products",
    title: "Find the Solana products and tools that help teams ship",
    description:
      "Explore platform APIs for issuance and payments, agent identity and x402 payments, Actions and blinks, commerce tooling, and the docs that connect product ideas to working integrations.",
    accentColor: "#00C2FF",
    heroImageSrc: sdpImage,
    primaryCta: {
      title: "Solana Developer Platform",
      href: "/solutions/sdp",
    },
    secondaryCta: {
      title: "Explore agent tools",
      href: "/agent-registry",
    },
    metrics: [
      {
        value: "Platform",
        label: "Financial product APIs",
        description:
          "Solana Developer Platform brings issuance, payments, and trading APIs into one financial-product path.",
      },
      {
        value: "Agents",
        label: "Identity and skills",
        description:
          "Agent Registry and Skills help agent builders work with identity, trust, validation, and development context.",
      },
      {
        value: "Payments",
        label: "x402 and Solana Pay",
        description:
          "x402, Solana Pay, Commerce Kit, and Kora support checkout, fee abstraction, and internet-native payment flows.",
      },
      {
        value: "Build",
        label: "Docs and templates",
        description:
          "Developer docs, RPC providers, token docs, and guides turn product discovery into build steps.",
      },
    ],
    overview: {
      eyebrow: "Product map",
      title: "A practical map for platform, agent, and payment products.",
      description:
        "Start with Solana Developer Platform for financial-product APIs, agent tools for identity and trusted workflows, and payment products for checkout, monetization, and shareable transaction flows.",
      imageSrc: performanceBg,
      points: [
        {
          title: "Platform layer",
          description:
            "Solana Developer Platform and RPC resources support teams building financial, payments, and data-heavy products.",
        },
        {
          title: "Agent layer",
          description:
            "x402, Agent Registry, Skills, and AI resources support autonomous agents that need identity, trust, context, and payments.",
        },
        {
          title: "Transaction layer",
          description:
            "Actions, blinks, Solana Pay, Commerce Kit, Kora, and token docs help turn product concepts into user-facing transaction flows.",
        },
      ],
    },
    pathways: [
      {
        eyebrow: "Platform APIs",
        title: "Build financial products with APIs for issuance and payments.",
        description:
          "Start with Solana Developer Platform, then use the payments, token, and RPC docs to shape implementation.",
        href: "/solutions/sdp",
        cta: "Open platform",
        featured: true,
        links: [
          { title: "SDP", href: "/solutions/sdp" },
          { title: "Payments docs", href: "/docs/payments" },
          { title: "RPC providers", href: "/rpc" },
        ],
      },
      {
        eyebrow: "Agent products",
        title: "Build agents with identity, reputation, and payment access.",
        description:
          "Use Agent Registry for verifiable identity and trust, Skills for development context, and x402 for paid APIs and resources.",
        href: "/agent-registry",
        cta: "Open agent tools",
        links: [
          { title: "Agent Registry", href: "/agent-registry" },
          { title: "Skills", href: "/skills" },
          { title: "x402", href: "/x402" },
        ],
      },
      {
        eyebrow: "User actions",
        title:
          "Create transaction links, checkout flows, and sponsored-fee experiences.",
        description:
          "Actions and blinks make transaction flows shareable, while Solana Pay, Commerce Kit, and Kora support checkout and smoother payment UX.",
        href: "/solutions/actions",
        cta: "Explore actions",
        links: [
          { title: "Actions and blinks", href: "/solutions/actions" },
          { title: "Solana Pay", href: "/docs/tools/solana-pay" },
          { title: "Kora", href: "/docs/tools/kora" },
        ],
      },
    ],
    feature: {
      eyebrow: "Featured product",
      title: "Launch x402 payments on Solana",
      description:
        "x402 lets APIs and web services request payment before serving content, with Solana providing fast, low-cost settlement for agent and developer workflows.",
      href: "/x402",
      cta: "Open x402",
    },
    resourceHeading: "Product resources",
    resourceDescription:
      "Platform APIs, agent tools, payment products, and docs for building Solana-powered products.",
    sections: [
      {
        title: "Platforms and tools",
        description:
          "Core products for financial APIs, agents, AI tooling, and transaction links.",
        links: [
          {
            title: "Solana Developer Platform",
            href: "/solutions/sdp",
            description:
              "Enterprise-ready APIs for financial product workflows.",
          },
          {
            title: "x402",
            href: "/x402",
            description:
              "Internet-native payment resources and ecosystem tooling.",
          },
          {
            title: "Agent Registry",
            href: "/agent-registry",
            description:
              "Onchain identity and trust infrastructure for AI agents.",
          },
          {
            title: "Skills",
            href: "/skills",
            description:
              "Pre-built AI-agent context for Solana development workflows.",
          },
          {
            title: "Actions and blinks",
            href: "/solutions/actions",
            description: "Shareable transaction interfaces and app actions.",
          },
          {
            title: "Agents and AI",
            href: "/solutions/ai",
            description: "AI tooling, agent kits, and ecosystem examples.",
          },
        ],
      },
      {
        title: "Developer and payment tools",
        description:
          "Implementation docs and payment tooling for moving from concept to shipped flows.",
        links: [
          {
            title: "Commerce Kit",
            href: "/docs/tools/commerce-kit",
            description: "Commerce tooling documentation.",
          },
          {
            title: "Kora",
            href: "/docs/tools/kora",
            description: "Fee abstraction and payment-processing tooling.",
          },
          {
            title: "Solana Pay",
            href: "/docs/tools/solana-pay",
            description: "Solana Pay documentation and payment flows.",
          },
          {
            title: "RPC providers",
            href: "/rpc",
            description:
              "Provider and infrastructure options for application access.",
          },
          {
            title: "Payments tooling",
            href: "/solutions/payments-tooling",
            description:
              "Payment implementation tools and ecosystem resources.",
          },
          {
            title: "Token Extensions",
            href: "/solutions/token-extensions",
            description: "Optional token features for mints and accounts.",
          },
          {
            title: "Digital assets",
            href: "/solutions/digital-assets",
            description: "Digital asset product and tooling context.",
          },
        ],
      },
      {
        title: "Build with products",
        description:
          "Implementation entry points for developers moving from product discovery into code.",
        links: [
          {
            title: "Docs",
            href: "/docs",
            description: "Official Solana developer documentation.",
          },
          {
            title: "Payments docs",
            href: "/docs/payments",
            description:
              "Payment system guides and production readiness material.",
          },
          {
            title: "Tokens docs",
            href: "/docs/tokens",
            description:
              "Token programs, extensions, and token account concepts.",
          },
          {
            title: "RPC providers",
            href: "/rpc",
            description: "Public and private RPC infrastructure overview.",
          },
          {
            title: "Developer guides",
            href: "/developers/guides",
            description: "Guides for product and application implementation.",
          },
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
    title: "Explore the builders, events, and categories shaping Solana",
    description:
      "Explore network resources, community events, media, research, and category pages for areas like DePIN, DeSci, BTCFi, gaming, creators, and startup ideas.",
    accentColor: "#9945FF",
    heroImageSrc: communityHero,
    primaryCta: {
      title: "Explore events",
      href: "/events",
    },
    secondaryCta: {
      title: "View network hub",
      href: "/network",
    },
    metrics: [
      {
        value: "Network",
        label: "Validators, RPC, and status",
        description:
          "Find validator, RPC, status, explorer, report, and research resources for understanding Solana operations.",
      },
      {
        value: "Community",
        label: "Events and media",
        description:
          "Follow events, news, podcasts, Breakpoint, Accelerate, and community channels.",
      },
      {
        value: "Categories",
        label: "Use-case landscapes",
        description:
          "Explore DePIN, DeSci, BTCFi, gaming, creators, and founder programs.",
      },
      {
        value: "Proof",
        label: "Reports and research",
        description:
          "Research and reports help users move from discovery into a deeper understanding of the ecosystem.",
      },
    ],
    overview: {
      eyebrow: "Discovery model",
      title:
        "Ecosystem brings network, community, media, and categories together.",
      description:
        "Solana ecosystem content spans network operations, community events, media, research, and use-case categories. This hub groups those paths so visitors can move from discovery into the right resource.",
      imageSrc: depinImage,
      points: [
        {
          title: "Network context",
          description:
            "Validators, RPC providers, explorers, status, reports, and research explain how the network is operated and observed.",
        },
        {
          title: "Community motion",
          description:
            "Events, Breakpoint, Accelerate, news, podcasts, and community pages capture the places people gather and publish.",
        },
        {
          title: "Category discovery",
          description:
            "Follow pages for DePIN, DeSci, BTCFi, gaming, creators, and founder ideas to see where builders are focusing.",
        },
      ],
    },
    pathways: [
      {
        eyebrow: "Network resources",
        title: "Inspect the network and find operational context.",
        description:
          "Start with the Network hub, then continue into validators, RPC providers, status, reports, and research.",
        href: "/network",
        cta: "Open network hub",
        featured: true,
        links: [
          { title: "Network", href: "/network" },
          { title: "Validators", href: "/validators" },
          { title: "Reports", href: "/reports" },
        ],
      },
      {
        eyebrow: "Community programs",
        title: "Find events, updates, and people in the ecosystem.",
        description:
          "Use events, news, and podcasts for current programming, recorded conversations, and ecosystem announcements.",
        href: "/events",
        cta: "Open events",
        links: [
          { title: "Events", href: "/events" },
          { title: "News", href: "/news" },
          { title: "Podcasts", href: "/podcasts" },
        ],
      },
      {
        eyebrow: "Category discovery",
        title: "Browse ecosystem categories and startup ideas.",
        description:
          "Explore use-case pages for physical infrastructure, science, Bitcoin, games, creators, and founder opportunities.",
        href: "/solutions",
        cta: "Browse categories",
        links: [
          { title: "DePIN", href: "/solutions/depin" },
          { title: "Gaming", href: "/solutions/gaming-and-entertainment" },
          { title: "Creators", href: "/solutions/artists-creators" },
        ],
      },
    ],
    feature: {
      eyebrow: "Event",
      title: "Breakpoint",
      description:
        "Follow Solana's major ecosystem event and related community programming.",
      href: "/breakpoint",
      cta: "Open Breakpoint",
    },
    resourceHeading: "Ecosystem resources",
    resourceDescription:
      "Network operations, events, community channels, media, and category pages for exploring the Solana ecosystem.",
    sections: [
      {
        title: "Network",
        description:
          "Operational resources for understanding and inspecting Solana.",
        links: [
          {
            title: "Network hub",
            href: "/network",
            description:
              "Validators, RPC providers, status, reports, and research in one place.",
          },
          {
            title: "Validators",
            href: "/validators",
            description:
              "Validator resources and network participation context.",
          },
          {
            title: "RPC providers",
            href: "/rpc",
            description: "Public and private RPC infrastructure overview.",
          },
          {
            title: "Reports",
            href: "/reports",
            description: "Research and report archive.",
          },
          {
            title: "Research",
            href: "/research",
            description: "Research-oriented analysis and network material.",
          },
          {
            title: "Status",
            href: "https://status.solana.com/",
            description: "Live network status information.",
            external: true,
          },
        ],
      },
      {
        title: "Events and community",
        description:
          "Places to follow announcements, gather with builders, and discover ecosystem stories.",
        links: [
          {
            title: "Events",
            href: "/events",
            description: "Upcoming ecosystem events and community programming.",
          },
          {
            title: "Event archive",
            href: "/events/archive",
            description: "Past events and historical programming.",
          },
          {
            title: "Accelerate",
            href: "/accelerate",
            description:
              "Conference and programming for founders, builders, and ecosystem teams.",
          },
          {
            title: "Breakpoint",
            href: "/breakpoint",
            description: "Solana's flagship ecosystem gathering.",
          },
          {
            title: "Community",
            href: "/community",
            description:
              "Community channels, resources, and participation paths.",
          },
          {
            title: "News",
            href: "/news",
            description: "Ecosystem news and announcements.",
          },
          {
            title: "Podcasts",
            href: "/podcasts",
            description:
              "Conversations with builders and ecosystem contributors.",
          },
        ],
      },
      {
        title: "Categories and programs",
        description:
          "Use-case areas, founder ideas, and communities building on Solana.",
        links: [
          {
            title: "DePIN",
            href: "/solutions/depin",
            description: "Decentralized physical infrastructure networks.",
          },
          {
            title: "DeSci",
            href: "/solutions/desci",
            description:
              "Science funding, coordination, and knowledge-sharing onchain.",
          },
          {
            title: "BTCFi",
            href: "/solutions/btcfi",
            description: "Bitcoin-related finance and wrapped BTC on Solana.",
          },
          {
            title: "Gaming and entertainment",
            href: "/solutions/gaming-and-entertainment",
            description:
              "Games, entertainment, and interactive consumer experiences.",
          },
          {
            title: "Artists and creators",
            href: "/solutions/artists-creators",
            description:
              "Creator tools, digital art, communities, and ownership models.",
          },
          {
            title: "Request for Startups",
            href: "/solutions/request-for-startups",
            description:
              "Startup ideas and ecosystem opportunities for builders.",
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
    title: "Inspect, operate, and understand the Solana network",
    description:
      "Find validator resources, RPC infrastructure, explorers, live status, reports, and research for operating, connecting to, and evaluating Solana.",
    accentColor: "#14F195",
    heroImageSrc: performanceBg,
    primaryCta: {
      title: "Become a validator",
      href: "/validators",
    },
    secondaryCta: {
      title: "View status",
      href: "https://status.solana.com/",
      external: true,
    },
    metrics: [
      {
        value: "Operate",
        label: "Validators",
        description:
          "Learn how validators process transactions, participate in consensus, and help secure the network.",
      },
      {
        value: "Connect",
        label: "RPC infrastructure",
        description:
          "Understand public endpoints, private RPC services, and provider options for production apps.",
      },
      {
        value: "Inspect",
        label: "Explorers and status",
        description:
          "Use explorers and live status resources to observe network activity and availability.",
      },
      {
        value: "Evaluate",
        label: "Reports and research",
        description:
          "Read reports and research on network health, performance, energy, privacy, and ecosystem context.",
      },
    ],
    overview: {
      eyebrow: "Network operations",
      title: "Find the right network resource for the job.",
      description:
        "Use validator pages to understand participation, RPC resources to connect apps, status and explorers to inspect activity, and reports and research for broader network context.",
      imageSrc: performanceBg,
      points: [
        {
          title: "Run or support",
          description:
            "Validator pages and delegation resources explain how independent operators participate in securing and running Solana.",
        },
        {
          title: "Connect apps",
          description:
            "RPC content explains why public-facing apps often need production-grade RPC infrastructure and provider choices.",
        },
        {
          title: "Observe and evaluate",
          description:
            "Status, explorers, reports, and research give users multiple levels of visibility into network behavior.",
        },
      ],
    },
    pathways: [
      {
        eyebrow: "Operators",
        title: "Run or evaluate validator participation.",
        description:
          "Learn what validators do, what resources are available, and where to continue into docs and education material.",
        href: "/validators",
        cta: "Open validators",
        featured: true,
        links: [
          { title: "Validators", href: "/validators" },
          { title: "Docs", href: "/docs" },
          { title: "Research", href: "/research" },
        ],
      },
      {
        eyebrow: "Developers",
        title: "Connect applications through the right RPC path.",
        description:
          "Use the RPC overview to understand public endpoints, provider options, private services, and app-level performance tradeoffs.",
        href: "/rpc",
        cta: "Open RPC resources",
        links: [
          { title: "RPC providers", href: "/rpc" },
          { title: "RPC docs", href: "/docs/rpc" },
          { title: "Developer docs", href: "/docs" },
        ],
      },
      {
        eyebrow: "Evaluators",
        title: "Review status, reports, and research before going deeper.",
        description:
          "Check current status and read published reports for a fuller view of network health and operational context.",
        href: "/reports",
        cta: "View reports",
        links: [
          {
            title: "Status",
            href: "https://status.solana.com/",
            external: true,
          },
          { title: "Reports", href: "/reports" },
          { title: "Research", href: "/research" },
        ],
      },
    ],
    feature: {
      eyebrow: "Resources",
      title: "Review network reports",
      description:
        "Reports and research cover network health, performance, energy use, privacy, and ecosystem activity.",
      href: "/reports",
      cta: "View reports",
    },
    resourceHeading: "Network resources",
    resourceDescription:
      "Validator, RPC, explorer, status, report, and research resources for operating and evaluating Solana.",
    sections: [
      {
        title: "Operate and build",
        description:
          "Infrastructure and docs for validators and application teams.",
        links: [
          {
            title: "Validators",
            href: "/validators",
            description:
              "Validator participation, education, and support resources.",
          },
          {
            title: "RPC providers",
            href: "/rpc",
            description: "Public and private RPC provider overview.",
          },
          {
            title: "Docs",
            href: "/docs",
            description: "Official developer documentation.",
          },
          {
            title: "RPC docs",
            href: "/docs/rpc",
            description: "RPC methods, structures, and API references.",
          },
        ],
      },
      {
        title: "Inspect",
        description:
          "Explorers and status pages for watching cluster activity, transactions, accounts, and availability.",
        links: [
          {
            title: "Solscan",
            href: "https://solscan.io/",
            description: "External Solana block explorer.",
            external: true,
          },
          {
            title: "Solana Explorer",
            href: "https://explorer.solana.com/",
            description:
              "Explorer for transactions, accounts, tokens, and clusters.",
            external: true,
          },
          {
            title: "Status",
            href: "https://status.solana.com/",
            description: "Current network status and incident information.",
            external: true,
          },
        ],
      },
      {
        title: "Learn and evaluate",
        description:
          "Reports and research for network health, performance, privacy, and ecosystem context.",
        links: [
          {
            title: "Reports",
            href: "/reports",
            description: "Published network, ecosystem, and research reports.",
          },
          {
            title: "Research",
            href: "/research",
            description:
              "Research-oriented material on performance and network context.",
          },
          {
            title: "Privacy",
            href: "/privacy",
            description: "Confidential token and privacy resources.",
          },
          {
            title: "Ecosystem",
            href: "/ecosystem",
            description:
              "Broader ecosystem context around network, media, and events.",
          },
        ],
      },
    ],
  },
} satisfies Record<string, NavigationHubConfig>;
