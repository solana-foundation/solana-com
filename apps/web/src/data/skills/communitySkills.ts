import {
  Category,
  DEFI,
  INFRASTRUCTURE,
  TOOLING,
  TESTING,
  PROGRAMS,
} from "@/components/skills/skillCategories";

export type CommunitySkill = {
  slug: string;
  title: string;
  description: string;
  url: string;
  category: Category;
};

export const COMMUNITY_SKILLS: CommunitySkill[] = [
  // ── AI Coding Skills – General ──────────────────────────────────────
  {
    slug: "solana-anchor-claude-skill",
    title: "Solana Anchor Claude Skill",
    description:
      "End-to-end Solana development for Anchor and Solana Kit with modern code patterns and LiteSVM testing.",
    url: "https://github.com/quiknode-labs/solana-anchor-claude-skill",
    category: TESTING,
  },
  {
    slug: "solana-skills-plugin",
    title: "Solana Skills Plugin",
    description:
      "Solana skills covering program development, security auditing with vulnerability detection, and ZK compression.",
    url: "https://github.com/tenequm/skills/tree/main/skills/solana-development",
    category: PROGRAMS,
  },

  // ── AI Coding Skills – DeFi ─────────────────────────────────────────
  {
    slug: "clawpump-skill",
    title: "ClawPump Skill",
    description:
      "AI agent skill for gasless and self-funded token launches on pump.fun with dynamic dev buys and trading fee revenue sharing.",
    url: "https://www.clawpump.tech/skill.md",
    category: DEFI,
  },
  {
    slug: "clawpump-arbitrage-skill",
    title: "ClawPump Arbitrage Skill",
    description:
      "AI agent skill for multi-DEX arbitrage on Solana with quote aggregation and transaction bundle generation.",
    url: "https://clawpump.tech/arbitrage.md",
    category: DEFI,
  },
  {
    slug: "dflow-phantom-connect-skill",
    title: "DFlow Phantom Connect Skill",
    description:
      "Official DFlow + Phantom Connect skill for wallet-connected Solana apps with swaps and prediction market trading.",
    url: "https://github.com/DFlowProtocol/dflow_phantom-connect-skill",
    category: DEFI,
  },
  {
    slug: "dflow-skill",
    title: "DFlow Skill",
    description:
      "AI coding skill for DFlow trading protocol covering spot trading, prediction markets, and WebSocket streaming.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/dflow",
    category: DEFI,
  },
  {
    slug: "drift-skill",
    title: "Drift Skill",
    description:
      "AI coding skill for Drift Protocol SDK covering perpetual futures and spot trading on Solana.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/drift",
    category: DEFI,
  },
  {
    slug: "jupiter-skill",
    title: "Jupiter Skill",
    description:
      "AI coding skill for Jupiter covering Ultra swaps, limit orders, DCA, perpetuals, and lending.",
    url: "https://github.com/jup-ag/agent-skills/tree/main/skills/integrating-jupiter",
    category: DEFI,
  },
  {
    slug: "kamino-skill",
    title: "Kamino Skill",
    description:
      "AI coding skill for Kamino Finance covering lending, borrowing, liquidity management, and leverage trading.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/kamino",
    category: DEFI,
  },
  {
    slug: "lulo-skill",
    title: "Lulo Skill",
    description:
      "AI coding skill for Lulo, Solana's lending aggregator routing deposits to highest-yielding protocols.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/lulo",
    category: DEFI,
  },
  {
    slug: "meteora-skill",
    title: "Meteora Skill",
    description:
      "AI coding skill for Meteora DeFi SDK covering liquidity pools, AMMs, bonding curves, and token launches.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/meteora",
    category: DEFI,
  },
  {
    slug: "octav-api-skill",
    title: "Octav API Skill",
    description:
      "AI coding skill for Octav API covering wallet portfolio tracking, transaction history, and DeFi positions.",
    url: "https://github.com/Octav-Labs/octav-api-skill",
    category: DEFI,
  },
  {
    slug: "orca-skill",
    title: "Orca Skill",
    description:
      "AI coding skill for Orca Whirlpools concentrated liquidity AMM covering swaps and position management.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/orca",
    category: DEFI,
  },
  {
    slug: "pumpfun-skill",
    title: "PumpFun Skill",
    description:
      "AI coding skill for PumpFun Protocol covering token launches, bonding curves, and PumpSwap integrations.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/pumpfun",
    category: DEFI,
  },
  {
    slug: "ranger-finance-skill",
    title: "Ranger Finance Skill",
    description:
      "AI coding skill for Ranger Finance, a Solana perps aggregator across Drift, Flash, and Jupiter.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/ranger-finance",
    category: DEFI,
  },
  {
    slug: "raydium-skill",
    title: "Raydium Skill",
    description:
      "AI coding skill for Raydium Protocol covering CLMM, CPMM, AMM pools, farming, and Trade API.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/raydium",
    category: DEFI,
  },
  {
    slug: "sanctum-skill",
    title: "Sanctum Skill",
    description:
      "AI coding skill for Sanctum covering liquid staking, LST swaps, and Infinity pool operations.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/sanctum",
    category: DEFI,
  },
  {
    slug: "pnp-markets-skill",
    title: "PNP Markets Skill",
    description:
      "AI coding skill for PNP Protocol covering permissionless prediction markets with P2P betting and custom oracles.",
    url: "https://github.com/pnp-protocol/solana-skill",
    category: DEFI,
  },

  // ── AI Coding Skills – Infrastructure ───────────────────────────────
  {
    slug: "magicblock-dev-skill",
    title: "MagicBlock Dev Skill",
    description:
      "End-to-end MagicBlock development skill for Claude Code covering latency/privacy solutions and VRFs on Solana.",
    url: "https://github.com/magicblock-labs/magicblock-dev-skill",
    category: INFRASTRUCTURE,
  },
  {
    slug: "metaplex-skill",
    title: "Metaplex Skill",
    description:
      "Official Metaplex development skill covering Core NFTs, Token Metadata, Bubblegum, and Candy Machine.",
    url: "https://github.com/metaplex-foundation/skill",
    category: INFRASTRUCTURE,
  },
  {
    slug: "solana-game-skill",
    title: "Solana Game Skill",
    description:
      "Claude Code skills for developing games on Solana using C#, React Native, and Magicblock's Unity SDK.",
    url: "https://github.com/solanabr/solana-game-skill",
    category: INFRASTRUCTURE,
  },
  {
    slug: "coingecko-skill",
    title: "CoinGecko Skill",
    description:
      "AI coding skill for CoinGecko Solana API covering token prices, DEX pool data, and market analytics.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/coingecko",
    category: INFRASTRUCTURE,
  },
  {
    slug: "debridge-skill",
    title: "deBridge Skill",
    description:
      "AI coding skill for deBridge Protocol covering cross-chain bridges and token transfers between chains.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/debridge",
    category: INFRASTRUCTURE,
  },
  {
    slug: "helius-skill",
    title: "Helius Skill",
    description:
      "AI coding skill for Helius RPC infrastructure covering DAS API, Enhanced Transactions, and webhooks.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/helius",
    category: INFRASTRUCTURE,
  },
  {
    slug: "light-protocol-skill",
    title: "Light Protocol Skill",
    description:
      "AI coding skill for Light Protocol's ZK Compression covering rent-free compressed tokens and PDAs.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/light-protocol",
    category: INFRASTRUCTURE,
  },
  {
    slug: "metaplex-community-skill",
    title: "Metaplex Community Skill",
    description:
      "Community AI coding skill for Metaplex Protocol covering Core NFTs, Token Metadata, and Umi framework.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/metaplex",
    category: INFRASTRUCTURE,
  },
  {
    slug: "pyth-skill",
    title: "Pyth Skill",
    description:
      "AI coding skill for Pyth Network oracle covering real-time price feeds with confidence intervals.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/pyth",
    category: INFRASTRUCTURE,
  },
  {
    slug: "quicknode-blockchain-skills",
    title: "QuickNode Blockchain Skills",
    description:
      "AI coding skill for QuickNode infrastructure covering Solana RPC, Jupiter Swap API, and Yellowstone gRPC.",
    url: "https://github.com/quiknode-labs/blockchain-skills",
    category: INFRASTRUCTURE,
  },
  {
    slug: "solana-dev-skill-rent-free",
    title: "Solana Dev Skill (Rent-Free)",
    description:
      "Solana development agent skills for Claude Code covering ZK programs and rent-free development.",
    url: "https://github.com/Lightprotocol/skills",
    category: INFRASTRUCTURE,
  },
  {
    slug: "squads-skill",
    title: "Squads Skill",
    description:
      "AI coding skill for Squads Protocol covering multisig wallets and account abstraction on Solana.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/squads",
    category: INFRASTRUCTURE,
  },
  {
    slug: "switchboard-skill",
    title: "Switchboard Skill",
    description:
      "AI coding skill for Switchboard Oracle covering permissionless price feeds, VRF randomness, and streaming.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/switchboard",
    category: INFRASTRUCTURE,
  },

  // ── Developer Tools ─────────────────────────────────────────────────
  {
    slug: "solana-kit-skill",
    title: "Solana Kit Skill",
    description:
      "AI coding skill for @solana/kit, the modern zero-dependency JavaScript SDK from Anza.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/solana-kit",
    category: TOOLING,
  },
  {
    slug: "solana-kit-migration-skill",
    title: "Solana Kit Migration Skill",
    description:
      "AI coding skill for migrating from @solana/web3.js v1.x to @solana/kit with API mappings.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/solana-kit-migration",
    category: TOOLING,
  },
  {
    slug: "pinocchio-skill",
    title: "Pinocchio Skill",
    description:
      "AI coding skill for Pinocchio, a zero-dependency framework for high-performance Solana programs.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/pinocchio-development",
    category: TOOLING,
  },
  {
    slug: "vulnhunter-skill",
    title: "VulnHunter Skill",
    description:
      "AI coding skill for security vulnerability detection and dangerous API hunting across Solana codebases.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/vulnhunter",
    category: TOOLING,
  },
  {
    slug: "code-recon-skill",
    title: "Code Recon Skill",
    description:
      "AI coding skill for deep architectural analysis and security audits mapping trust boundaries.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/zz-code-recon",
    category: TOOLING,
  },
  {
    slug: "surfpool-skill",
    title: "Surfpool Skill",
    description:
      "AI coding skill for Surfpool, a Solana development environment with mainnet forking and cheatcodes.",
    url: "https://github.com/sendaifun/skills/tree/main/skills/surfpool",
    category: TOOLING,
  },
];
