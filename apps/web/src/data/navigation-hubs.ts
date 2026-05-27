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
      "Set up a wallet, learn Solana basics, stay safe, and find apps to try.",
    eyebrow: "Use Solana",
    title: "Start using Solana with confidence",
    description:
      "Choose a wallet, learn how SOL and fees work, build safer signing habits, and find apps and communities to try.",
    accentColor: "#14F195",
    heroImageSrc: indexHero,
    bgJsonFilePath: "/src/img/navigation-hubs/use-solana-bg.json",
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
          "Compare wallets by platform, features, and security needs.",
      },
      {
        value: "02",
        label: "Learn the first actions",
        description:
          "Follow beginner lessons on wallets, transfers, fees, tokens, staking, DeFi, NFTs, and apps.",
      },
      {
        value: "03",
        label: "Build safe habits",
        description:
          "Read the safety basics before you connect to apps, sign transactions, or move assets.",
      },
      {
        value: "04",
        label: "Explore apps",
        description:
          "Use what you learned to explore apps, staking, events, and the Solana community.",
      },
    ],
    overview: {
      eyebrow: "User journey",
      title: "Go from your first wallet to your first transaction.",
      description:
        "This hub puts beginner resources in a clear order: wallet setup, SOL and fees, transfers, staking, tokens, apps, and safety.",
      imageSrc: walletImage,
      points: [
        {
          title: "Wallet first",
          description:
            "Your wallet holds assets, signs transactions, and connects you to Solana apps.",
        },
        {
          title: "Then the basics",
          description:
            "Learn what SOL is for, how fees and transfers work, and where tokens and staking fit in.",
        },
        {
          title: "Safety before more activity",
          description:
            "Review seed phrases, links, approvals, and app connections before signing often.",
        },
      ],
    },
    pathwaysEyebrow: "Start here",
    pathwaysHeading: "Choose your first step on Solana.",
    directoryEyebrow: "Resources",
    pathways: [
      {
        eyebrow: "First wallet",
        title: "Pick a wallet for Solana apps.",
        description:
          "Compare wallets, then learn how keys, accounts, and approvals work.",
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
          "Start with Solana basics, fees, tokens, and transfers before using new apps.",
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
        title: "Find apps, staking, and events.",
        description:
          "Explore consumer apps and staking after you understand wallets, fees, and signing safety.",
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
        "Use the safety guide to check approvals, seed phrases, links, and common scams.",
      href: "/learn/staying-safe-on-solana",
      cta: "Read the guide",
    },
    resourceHeading: "Use Solana resources",
    resourceDescription:
      "Wallet setup, beginner lessons, safety guides, and links for new Solana users.",
    sections: [
      {
        title: "Wallets and onboarding",
        description:
          "Start with account setup and the basics for your first transactions.",
        links: [
          {
            title: "Wallets",
            href: "/wallets",
            description:
              "Learn how Solana wallets work with apps, payments, and keys.",
          },
          {
            title: "Wallet directory",
            href: "/solana-wallets",
            description:
              "Filter wallets by platform, features, and security options.",
          },
          {
            title: "What is Solana?",
            href: "/learn/what-is-solana",
            description: "A beginner guide to the network and what it enables.",
          },
          {
            title: "Getting started",
            href: "/learn/getting-started",
            description: "A guided entry point into basic Solana usage.",
          },
          {
            title: "What is a wallet?",
            href: "/learn/what-is-a-wallet",
            description: "How wallets hold keys and connect to apps.",
          },
          {
            title: "Sending and receiving SOL",
            href: "/learn/sending-and-receiving-sol",
            description: "How a basic transfer works.",
          },
        ],
      },
      {
        title: "Safety, fees, and tokens",
        description: "Key topics for signing transactions and moving value.",
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
            description: "How fees work when you use the network.",
          },
          {
            title: "Introduction to Solana tokens",
            href: "/learn/introduction-to-solana-tokens",
            description: "A simple guide to token types and behavior.",
          },
          {
            title: "Staking",
            href: "/staking",
            description: "Start learning about staking and validators.",
          },
          {
            title: "What is staking?",
            href: "/learn/what-is-staking",
            description: "A beginner overview of staking.",
          },
          {
            title: "Consumer apps",
            href: "/solutions/consumer",
            description:
              "Apps, social experiences, games, and communities on Solana.",
          },
        ],
      },
      {
        title: "Keep learning",
        description: "More links for learning what is happening around Solana.",
        links: [
          {
            title: "Learn",
            href: "/learn",
            description: "The full beginner learning path.",
          },
          {
            title: "Exploring Solana applications",
            href: "/learn/exploring-solana-applications",
            description: "How to browse app categories.",
          },
          {
            title: "Events",
            href: "/events",
            description: "Meetups, conferences, and community events.",
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
      "Explore Solana for payments, stablecoins, tokenization, network proof, and enterprise use cases.",
    eyebrow: "Enterprise",
    title: "Evaluate Solana for business use",
    description:
      "Review payments, stablecoins, tokenized assets, financial infrastructure, privacy, network performance, and the docs teams need to build.",
    accentColor: "#CA9FF5",
    heroImageSrc: tokenizationImage,
    bgJsonFilePath: "/src/img/navigation-hubs/enterprise-bg.json",
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
          "Review payments, stablecoins, commerce tools, and the Solana Developer Platform.",
      },
      {
        value: "Assets",
        label: "Tokenization and real-world assets",
        description:
          "Explore tokenized assets, real-world assets, token extensions, and digital asset tools.",
      },
      {
        value: "Research",
        label: "Reports and research",
        description:
          "Read reports on network health, performance, energy use, privacy, and ecosystem activity.",
      },
      {
        value: "Build",
        label: "Docs and tools",
        description:
          "Find payment docs, token extensions, RPC resources, and partner tools.",
      },
    ],
    overview: {
      eyebrow: "Evaluation path",
      title: "Go from business case to proof to build plan.",
      description:
        "Start with the use case, then review reports, validators, privacy, docs, and tools.",
      imageSrc: projectsBg,
      points: [
        {
          title: "Business cases",
          description:
            "Payments, stablecoins, tokenized assets, and financial infrastructure each have pages with examples and tools.",
        },
        {
          title: "Technical evidence",
          description:
            "Network, validator, report, research, privacy, and RPC resources help teams assess fit.",
        },
        {
          title: "Build plan",
          description:
            "Docs for payments, tokens, Solana Pay, Kora, Commerce Kit, and RPC providers help teams start building.",
        },
      ],
    },
    pathwaysEyebrow: "Evaluation paths",
    pathwaysHeading: "Choose the business path to evaluate first.",
    directoryEyebrow: "Resource directory",
    pathways: [
      {
        eyebrow: "Move money",
        title: "Review payments, stablecoins, and settlement.",
        description:
          "Start with institutional payments and stablecoins, then open the payment docs and tools.",
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
        title: "Explore tokenization and digital assets.",
        description:
          "Use the tokenization and real-world asset pages for context, then review token extensions.",
        href: "/solutions/tokenization",
        cta: "Open tokenization",
        links: [
          { title: "Tokenization", href: "/solutions/tokenization" },
          { title: "Real-world assets", href: "/solutions/real-world-assets" },
          { title: "Token Extensions", href: "/solutions/token-extensions" },
        ],
      },
      {
        eyebrow: "Check readiness",
        title: "Review network, privacy, and research.",
        description:
          "Find reports, validator information, privacy resources, and network resources.",
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
      title: "Use reports and research to evaluate Solana",
      description:
        "Published reports, research, and validator resources help teams understand the network.",
      href: "/reports",
      cta: "View reports",
    },
    resourceHeading: "Enterprise resources",
    resourceDescription:
      "Solution pages, docs, and research for teams evaluating Solana.",
    sections: [
      {
        title: "Business solutions",
        description:
          "Pages for payments, stablecoins, commerce, tokenization, and real-world assets.",
        links: [
          {
            title: "Enterprise overview",
            href: "/solutions/enterprise",
            description:
              "A starting point for organizations evaluating Solana.",
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
            description: "Stablecoin issuance and distribution.",
          },
          {
            title: "Tokenization",
            href: "/solutions/tokenization",
            description:
              "Tokenized assets, capital markets, and market access.",
          },
          {
            title: "Real-world assets",
            href: "/solutions/real-world-assets",
            description: "Asset tokenization use cases and examples.",
          },
        ],
      },
      {
        title: "Financial infrastructure",
        description:
          "Paths for payments, capital markets, DeFi, institutions, and infrastructure teams.",
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
              "Digital asset tools for consumer and business products.",
          },
          {
            title: "DeFi",
            href: "/solutions/defi",
            description: "Open financial markets and liquidity.",
          },
          {
            title: "Financial infrastructure",
            href: "/solutions/financial-infrastructure",
            description: "Financial use cases for infrastructure teams.",
          },
          {
            title: "Financial institutions",
            href: "/solutions/financial-institutions",
            description: "Examples and resources for financial institutions.",
          },
          {
            title: "DePIN",
            href: "/solutions/depin",
            description:
              "Networks that connect physical infrastructure with token rewards.",
          },
        ],
      },
      {
        title: "Research and proof",
        description:
          "Network, validator, report, research, and privacy resources for review.",
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
            description: "How validators help run the Solana network.",
          },
          {
            title: "Reports",
            href: "/reports",
            description: "Network, ecosystem, and research reports.",
          },
          {
            title: "Research",
            href: "/research",
            description: "Research on network health and performance.",
          },
          {
            title: "Privacy",
            href: "/privacy",
            description: "Privacy tools and confidential token resources.",
          },
        ],
      },
    ],
  },
  products: {
    path: "/products",
    metaTitle: "Solana Products",
    metaDescription:
      "Find Solana Developer Platform, x402, Agent Registry, Skills, Actions and blinks, Solana Pay, Commerce Kit, Kora, RPC providers, and docs.",
    eyebrow: "Products",
    title: "Find Solana products and tools for building",
    description:
      "Explore APIs, agent tools, payments, transaction links, commerce tools, and docs for building on Solana.",
    accentColor: "#00C2FF",
    heroImageSrc: sdpImage,
    bgJsonFilePath: "/src/img/navigation-hubs/products-bg.json",
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
          "Solana Developer Platform includes APIs for issuance, payments, and trading.",
      },
      {
        value: "Agents",
        label: "Identity and skills",
        description:
          "Agent Registry and Skills help builders add identity, trust, and context.",
      },
      {
        value: "Payments",
        label: "x402 and Solana Pay",
        description:
          "x402, Solana Pay, Commerce Kit, and Kora support checkout and web payments.",
      },
      {
        value: "Build",
        label: "Docs and templates",
        description:
          "Developer docs, RPC providers, token docs, and guides help teams start building.",
      },
    ],
    overview: {
      eyebrow: "Product map",
      title: "A simple map of platform, agent, and payment tools.",
      description:
        "Start with platform APIs, agent tools, or payment products, then use the docs to build.",
      imageSrc: performanceBg,
      points: [
        {
          title: "Platform layer",
          description:
            "Solana Developer Platform and RPC resources support financial, payment, and data-heavy products.",
        },
        {
          title: "Agent layer",
          description:
            "x402, Agent Registry, Skills, and AI resources help agents use identity, trust, context, and payments.",
        },
        {
          title: "Transaction layer",
          description:
            "Actions, blinks, Solana Pay, Commerce Kit, Kora, and token docs help create user-facing transaction flows.",
        },
      ],
    },
    pathwaysEyebrow: "Product paths",
    pathwaysHeading: "Choose the toolset your team needs.",
    directoryEyebrow: "Product directory",
    pathways: [
      {
        eyebrow: "Platform APIs",
        title: "Build financial products with issuance and payment APIs.",
        description:
          "Start with Solana Developer Platform, then use the payment, token, and RPC docs.",
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
        title: "Build agents with identity, trust, and payments.",
        description:
          "Use Agent Registry for identity, Skills for context, and x402 for paid APIs and resources.",
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
        title: "Create transaction links and checkout flows.",
        description:
          "Actions and blinks make transactions shareable. Solana Pay, Commerce Kit, and Kora support checkout.",
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
        "x402 lets APIs and websites ask for payment before serving content. Solana handles fast, low-cost settlement.",
      href: "/x402",
      cta: "Open x402",
    },
    resourceHeading: "Product resources",
    resourceDescription:
      "Platform APIs, agent tools, payment products, and docs for building on Solana.",
    sections: [
      {
        title: "Platforms and tools",
        description:
          "Products for financial APIs, agents, AI tools, and transaction links.",
        links: [
          {
            title: "Solana Developer Platform",
            href: "/solutions/sdp",
            description: "APIs for financial products.",
          },
          {
            title: "x402",
            href: "/x402",
            description: "Payment resources and ecosystem tools for the web.",
          },
          {
            title: "Agent Registry",
            href: "/agent-registry",
            description: "Onchain identity and trust tools for AI agents.",
          },
          {
            title: "Skills",
            href: "/skills",
            description:
              "Ready-to-use information for AI agents building on Solana.",
          },
          {
            title: "Actions and blinks",
            href: "/solutions/actions",
            description: "Shareable transactions and app actions.",
          },
          {
            title: "Agents and AI",
            href: "/solutions/ai",
            description: "AI tools, agent kits, and examples.",
          },
        ],
      },
      {
        title: "Developer and payment tools",
        description: "Docs and payment tools for building real product flows.",
        links: [
          {
            title: "Commerce Kit",
            href: "/docs/tools/commerce-kit",
            description: "Commerce tooling documentation.",
          },
          {
            title: "Kora",
            href: "/docs/tools/kora",
            description: "Tools for fee support and payment processing.",
          },
          {
            title: "Solana Pay",
            href: "/docs/tools/solana-pay",
            description: "Docs for Solana Pay and payment flows.",
          },
          {
            title: "RPC providers",
            href: "/rpc",
            description: "RPC provider options for apps.",
          },
          {
            title: "Payments tooling",
            href: "/solutions/payments-tooling",
            description: "Payment tools and ecosystem resources.",
          },
          {
            title: "Token Extensions",
            href: "/solutions/token-extensions",
            description: "Extra token features for mints and accounts.",
          },
          {
            title: "Digital assets",
            href: "/solutions/digital-assets",
            description: "Digital asset product and tool resources.",
          },
        ],
      },
      {
        title: "Build with products",
        description: "Starting points for developers ready to write code.",
        links: [
          {
            title: "Docs",
            href: "/docs",
            description: "Official Solana developer documentation.",
          },
          {
            title: "Payments docs",
            href: "/docs/payments",
            description: "Payment guides and production guidance.",
          },
          {
            title: "Tokens docs",
            href: "/docs/tokens",
            description: "Token programs, extensions, and account basics.",
          },
          {
            title: "RPC providers",
            href: "/rpc",
            description: "Public and private RPC provider options.",
          },
          {
            title: "Developer guides",
            href: "/developers/guides",
            description: "Guides for building products and apps.",
          },
        ],
      },
    ],
  },
  ecosystem: {
    path: "/ecosystem",
    metaTitle: "Solana Ecosystem",
    metaDescription:
      "Explore Solana network resources, events, community, news, podcasts, reports, research, and ecosystem categories.",
    eyebrow: "Ecosystem",
    title: "Explore Solana builders, events, and categories",
    description:
      "Find network resources, events, media, research, and pages for areas like DePIN, DeSci, BTCFi, gaming, creators, and startup ideas.",
    accentColor: "#9945FF",
    heroImageSrc: communityHero,
    bgJsonFilePath: "/src/img/navigation-hubs/ecosystem-bg.json",
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
          "Find validators, RPC providers, status pages, explorers, reports, and research.",
      },
      {
        value: "Community",
        label: "Events and media",
        description:
          "Follow events, news, podcasts, Breakpoint, Accelerate, and community channels.",
      },
      {
        value: "Categories",
        label: "Use-case areas",
        description:
          "Explore DePIN, DeSci, BTCFi, gaming, creators, and startup programs.",
      },
      {
        value: "Research",
        label: "Reports and research",
        description:
          "Use reports and research to better understand the ecosystem.",
      },
    ],
    overview: {
      eyebrow: "Discovery",
      title: "Find the right ecosystem resource.",
      description:
        "This hub groups network, events, media, research, and category pages so visitors can get to the right place faster.",
      imageSrc: depinImage,
      points: [
        {
          title: "Network context",
          description:
            "Validators, RPC providers, explorers, status, reports, and research show how the network runs.",
        },
        {
          title: "Community activity",
          description:
            "Events, Breakpoint, Accelerate, news, podcasts, and community pages show where people gather and publish.",
        },
        {
          title: "Category discovery",
          description:
            "Browse pages for DePIN, DeSci, BTCFi, gaming, creators, and startup ideas.",
        },
      ],
    },
    pathwaysEyebrow: "Explore",
    pathwaysHeading: "Choose how you want to explore the ecosystem.",
    directoryEyebrow: "Ecosystem directory",
    pathways: [
      {
        eyebrow: "Network resources",
        title: "Inspect the network.",
        description:
          "Start with the Network hub, then explore validators, RPC providers, status, reports, and research.",
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
        title: "Find events, updates, and people.",
        description:
          "Use events, news, and podcasts for programs, conversations, and announcements.",
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
          "Explore pages for physical infrastructure, science, Bitcoin, games, creators, and founder opportunities.",
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
        "Follow Solana's major ecosystem event and related community programs.",
      href: "/breakpoint",
      cta: "Open Breakpoint",
    },
    resourceHeading: "Ecosystem resources",
    resourceDescription:
      "Network resources, events, community channels, media, and category pages for exploring Solana.",
    sections: [
      {
        title: "Network",
        description: "Resources for understanding and inspecting Solana.",
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
            description: "Validator resources and participation information.",
          },
          {
            title: "RPC providers",
            href: "/rpc",
            description: "Public and private RPC provider options.",
          },
          {
            title: "Reports",
            href: "/reports",
            description: "Research and reports.",
          },
          {
            title: "Research",
            href: "/research",
            description: "Analysis and network research.",
          },
          {
            title: "Status",
            href: "https://status.solana.com/",
            description: "Live network status.",
            external: true,
          },
        ],
      },
      {
        title: "Events and community",
        description:
          "Places to follow announcements, meet builders, and find ecosystem stories.",
        links: [
          {
            title: "Events",
            href: "/events",
            description: "Upcoming ecosystem and community events.",
          },
          {
            title: "Event archive",
            href: "/events/archive",
            description: "Past events and programs.",
          },
          {
            title: "Accelerate",
            href: "/accelerate",
            description:
              "Conference programs for founders, builders, and ecosystem teams.",
          },
          {
            title: "Breakpoint",
            href: "/breakpoint",
            description: "Solana's flagship ecosystem gathering.",
          },
          {
            title: "Community",
            href: "/community",
            description: "Community channels, resources, and ways to join.",
          },
          {
            title: "News",
            href: "/news",
            description: "Ecosystem news and announcements.",
          },
          {
            title: "Podcasts",
            href: "/podcasts",
            description: "Conversations with builders and contributors.",
          },
        ],
      },
      {
        title: "Categories and programs",
        description:
          "Use cases, startup ideas, and communities building on Solana.",
        links: [
          {
            title: "DePIN",
            href: "/solutions/depin",
            description: "Physical infrastructure networks on Solana.",
          },
          {
            title: "DeSci",
            href: "/solutions/desci",
            description:
              "Science funding, coordination, and knowledge sharing.",
          },
          {
            title: "BTCFi",
            href: "/solutions/btcfi",
            description: "Bitcoin finance and wrapped BTC on Solana.",
          },
          {
            title: "Gaming and entertainment",
            href: "/solutions/gaming-and-entertainment",
            description: "Games, entertainment, and interactive experiences.",
          },
          {
            title: "Artists and creators",
            href: "/solutions/artists-creators",
            description:
              "Creator tools, digital art, communities, and ownership.",
          },
        ],
      },
    ],
  },
  network: {
    path: "/network",
    metaTitle: "Solana Network",
    metaDescription:
      "Find Solana validators, RPC providers, status pages, reports, and research.",
    eyebrow: "Network",
    title: "Understand the Solana network",
    description:
      "Find validators, RPC providers, explorers, live status, reports, and research for operating or evaluating Solana.",
    accentColor: "#14F195",
    heroImageSrc: performanceBg,
    bgJsonFilePath: "/src/img/navigation-hubs/network-bg.json",
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
          "Learn how validators process transactions and help secure the network.",
      },
      {
        value: "Connect",
        label: "RPC providers",
        description:
          "Compare public endpoints, private services, and provider options for apps.",
      },
      {
        value: "Inspect",
        label: "Explorers and status",
        description:
          "Use explorers and status pages to watch activity and availability.",
      },
      {
        value: "Evaluate",
        label: "Reports and research",
        description:
          "Read about network health, performance, energy use, privacy, and ecosystem activity.",
      },
    ],
    overview: {
      eyebrow: "Network operations",
      title: "Find the right network resource for the job.",
      description:
        "Use validator pages to learn how to take part, RPC resources to connect apps, status pages to inspect activity, and reports for more background.",
      imageSrc: performanceBg,
      points: [
        {
          title: "Run or support",
          description:
            "Validator and delegation resources explain how operators help run the network.",
        },
        {
          title: "Connect apps",
          description:
            "RPC resources explain provider options for apps that need reliable access.",
        },
        {
          title: "Observe and evaluate",
          description:
            "Status, explorers, reports, and research show what is happening on the network.",
        },
      ],
    },
    pathwaysEyebrow: "Network paths",
    pathwaysHeading: "Choose the network resource you need.",
    directoryEyebrow: "Network directory",
    pathways: [
      {
        eyebrow: "Operators",
        title: "Run or review a validator.",
        description:
          "Learn what validators do, what resources are available, and where to find docs.",
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
        title: "Connect apps through the right RPC provider.",
        description:
          "Use the RPC overview to compare public endpoints, provider options, private services, and performance tradeoffs.",
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
        title: "Review status, reports, and research.",
        description:
          "Check current status and read reports for a clearer view of network health.",
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
      "Validator, RPC, explorer, status, report, and research links for Solana.",
    sections: [
      {
        title: "Operate and build",
        description: "Tools and docs for validators and app teams.",
        links: [
          {
            title: "Validators",
            href: "/validators",
            description: "Validator participation, education, and support.",
          },
          {
            title: "RPC providers",
            href: "/rpc",
            description: "Public and private RPC provider options.",
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
          "Explorers and status pages for watching activity, transactions, accounts, and availability.",
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
            description: "Current network status and incidents.",
            external: true,
          },
        ],
      },
      {
        title: "Learn and evaluate",
        description:
          "Reports and research on network health, performance, privacy, and the ecosystem.",
        links: [
          {
            title: "Reports",
            href: "/reports",
            description: "Published network, ecosystem, and research reports.",
          },
          {
            title: "Research",
            href: "/research",
            description: "Research on performance and network background.",
          },
          {
            title: "Privacy",
            href: "/privacy",
            description: "Confidential token and privacy resources.",
          },
          {
            title: "Ecosystem",
            href: "/ecosystem",
            description: "Ecosystem links for network, media, and events.",
          },
        ],
      },
    ],
  },
} satisfies Record<string, NavigationHubConfig>;
