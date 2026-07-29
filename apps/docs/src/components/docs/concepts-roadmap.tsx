"use client";

import {
  ArrowLeft,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Code2,
  ExternalLink,
  GitBranch,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  getBrowserStorage,
  safeStorageGetItem,
  safeStorageSetItem,
} from "@solana-com/ui-chrome";
import styles from "./concepts-roadmap.module.scss";

type RoadmapResource = {
  label: string;
  href: string;
  type: "Read" | "Watch" | "Build";
};

type CoreStep = {
  id: string;
  number: string;
  phase: "Get ready" | "Learn" | "Build" | "Ship";
  title: string;
  description: string;
  resources: RoadmapResource[];
  doneWhen: string;
  goals?: RoadmapGoal[];
  focuses?: RoadmapFocus[];
  hideFor?: StartingPoint[];
};

type Branch = {
  id: string;
  label: string;
  title: string;
  description: string;
  resources: RoadmapResource[];
  focuses: RoadmapFocus[];
};

type RoadmapDetail = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  resources: RoadmapResource[];
  doneWhen?: string;
  canComplete: boolean;
};

type TokenTopic = {
  id: string;
  title: string;
  description: string;
  resources: RoadmapResource[];
  featured?: boolean;
};

type EntryRoute = "new" | "ethereum";

type RoadmapGoal = "build" | "developer" | "understand" | "work" | "reference";

type RoadmapFocus =
  | "apps"
  | "programs"
  | "tokens-payments"
  | "defi"
  | "games-performance"
  | "data"
  | "architecture"
  | "transactions"
  | "ecosystem"
  | "product"
  | "finance"
  | "developer-relations"
  | "client-reference"
  | "program-reference"
  | "production-reference";

type StartingPoint = "new" | "web" | "rust" | "ethereum" | "solana";

type LearningStyle = RoadmapResource["type"];

type PersonalizationProfile = {
  goal: RoadmapGoal;
  focus: RoadmapFocus;
  startingPoint: StartingPoint;
  learningStyles: LearningStyle[];
};

type StoredProgress = {
  completedIds: string[];
  entryRoute: EntryRoute;
  assessmentPassed: boolean;
  personalization: PersonalizationProfile | null;
};

type MultipleChoiceQuestion = {
  id: string;
  type: "multiple-choice";
  question: string;
  answers: readonly string[];
  correctAnswer: number;
};

type WrittenQuestion = {
  id: string;
  type: "written";
  question: string;
  hint: string;
};

type IntermediateQuestion = MultipleChoiceQuestion | WrittenQuestion;

const STORAGE_KEY = "solana:docs:concepts-roadmap:v2";

type PersonalizationOption<T extends string> = {
  id: T;
  emoji: string;
  title: string;
  description: string;
};

const TOKEN_TOPICS: TokenTopic[] = [
  {
    id: "tokens-mints",
    title: "Mint accounts",
    description:
      "Learn how a mint identifies a token and stores supply, decimals, and mint and freeze authorities.",
    resources: [
      {
        label: "Mint accounts",
        href: "/docs/tokens#mint-account",
        type: "Read",
      },
      {
        label: "Create a mint",
        href: "/docs/tokens/basics/create-mint",
        type: "Build",
      },
    ],
  },
  {
    id: "tokens-accounts",
    title: "Token accounts",
    description:
      "Understand how token accounts hold balances for one owner and one mint, including associated token accounts.",
    resources: [
      {
        label: "Token accounts",
        href: "/docs/tokens#token-account",
        type: "Read",
      },
      {
        label: "Create a token account",
        href: "/docs/tokens/basics/create-token-account",
        type: "Build",
      },
    ],
  },
  {
    id: "tokens-authorities",
    title: "Authorities and delegates",
    description:
      "Learn mint, freeze, owner, close, and delegate authority boundaries before moving tokens.",
    resources: [
      {
        label: "Set authority",
        href: "/docs/tokens/basics/set-authority",
        type: "Build",
      },
      {
        label: "Approve a delegate",
        href: "/docs/tokens/basics/approve-delegate",
        type: "Build",
      },
    ],
  },
  {
    id: "tokens-kit",
    title: "Build tokens with Kit",
    description:
      "Use the recommended TypeScript SDK to construct token instructions, sign transactions, and inspect resulting state.",
    resources: [
      {
        label: "Solana Kit",
        href: "/docs/clients/official/javascript#solana-kit",
        type: "Read",
      },
      {
        label: "Mint tokens with Kit",
        href: "/docs/tokens/basics/mint-tokens#kit",
        type: "Build",
      },
    ],
  },
  {
    id: "tokens-extensions",
    title: "Token Extensions",
    description:
      "Understand Token-2022, plan extensions before initializing a mint, and check compatibility constraints.",
    resources: [
      {
        label: "Token Extensions overview",
        href: "/docs/tokens/extensions",
        type: "Read",
      },
    ],
    featured: true,
  },
  {
    id: "tokens-transfer-fees",
    title: "Transfer fees",
    description:
      "Configure fees collected on transfers and understand withheld balances and withdrawal authority.",
    resources: [
      {
        label: "Transfer fee extension",
        href: "/docs/tokens/extensions/transfer-fees",
        type: "Build",
      },
    ],
  },
  {
    id: "tokens-transfer-hooks",
    title: "Transfer hooks",
    description:
      "Run custom program logic during token transfers without replacing the Token Extensions Program.",
    resources: [
      {
        label: "Transfer hook extension",
        href: "/docs/tokens/extensions/transfer-hook",
        type: "Build",
      },
    ],
  },
  {
    id: "tokens-metadata",
    title: "Metadata",
    description:
      "Store token name, symbol, URI, and update authority through Token-2022 metadata extensions.",
    resources: [
      {
        label: "Token metadata extension",
        href: "/docs/tokens/extensions/metadata",
        type: "Build",
      },
    ],
  },
  {
    id: "tokens-confidential",
    title: "Confidential transfers",
    description:
      "Learn the account model and operational flow for encrypted token balances and transfers.",
    resources: [
      {
        label: "Confidential transfers",
        href: "/docs/tokens/extensions/confidential-transfer",
        type: "Read",
      },
    ],
  },
];

const TOKEN_TOPIC_IDS = new Set(TOKEN_TOPICS.map((topic) => topic.id));

const GOAL_OPTIONS: readonly PersonalizationOption<RoadmapGoal>[] = [
  {
    id: "build",
    emoji: "🛠️",
    title: "I want to build something",
    description: "I have a project or idea I want to ship",
  },
  {
    id: "developer",
    emoji: "📚",
    title: "I want to learn Solana development",
    description: "Take me from fundamentals toward job-ready",
  },
  {
    id: "understand",
    emoji: "🔍",
    title: "I want to understand how Solana works",
    description: "Concepts and architecture, with less implementation",
  },
  {
    id: "work",
    emoji: "💼",
    title: "I'm here for work, but I don't write code",
    description: "Founder, product, BD, analyst, creator, or finance",
  },
  {
    id: "reference",
    emoji: "⚡",
    title: "I already know what I need",
    description: "Skip broad introductions and get to useful references",
  },
];

const FOCUS_OPTIONS: Record<
  RoadmapGoal,
  readonly PersonalizationOption<RoadmapFocus>[]
> = {
  build: [
    {
      id: "apps",
      emoji: "🖥️",
      title: "A consumer or web app",
      description: "Wallet UX, clients, transactions, and product state",
    },
    {
      id: "programs",
      emoji: "⚙️",
      title: "An onchain program",
      description: "Rust, Anchor, account design, security, and deployment",
    },
    {
      id: "tokens-payments",
      emoji: "💸",
      title: "Tokens or payments",
      description: "SPL tokens, Token Extensions, and payment flows",
    },
    {
      id: "defi",
      emoji: "📈",
      title: "A DeFi protocol",
      description: "Composability, financial state, testing, and security",
    },
    {
      id: "games-performance",
      emoji: "🎮",
      title: "Games or a high-performance app",
      description: "Fast state, compute, clients, and production operations",
    },
  ],
  developer: [
    {
      id: "apps",
      emoji: "🖥️",
      title: "Frontend and app development",
      description: "Wallets, clients, RPC, indexing, and great transaction UX",
    },
    {
      id: "programs",
      emoji: "🦀",
      title: "Onchain program development",
      description: "Rust, Anchor, PDAs, CPIs, testing, and security",
    },
    {
      id: "data",
      emoji: "🗂️",
      title: "Data, RPC, and infrastructure",
      description: "Read paths, subscriptions, indexing, and observability",
    },
    {
      id: "tokens-payments",
      emoji: "🪙",
      title: "Tokens and payments",
      description: "Asset primitives, integrations, and production payment UX",
    },
  ],
  understand: [
    {
      id: "architecture",
      emoji: "🧠",
      title: "The execution model",
      description: "Accounts, programs, runtime behavior, and composability",
    },
    {
      id: "transactions",
      emoji: "🔁",
      title: "Transactions and the network",
      description: "Signing, fees, confirmation, RPC, and data flow",
    },
    {
      id: "ecosystem",
      emoji: "🌐",
      title: "The developer ecosystem",
      description: "Tools, clients, tokens, applications, and production",
    },
  ],
  work: [
    {
      id: "product",
      emoji: "🧭",
      title: "Product or strategy",
      description: "Understand capabilities, constraints, and shipping choices",
    },
    {
      id: "finance",
      emoji: "🏦",
      title: "Finance or institutional assets",
      description: "Tokens, payments, settlement, and controlled assets",
    },
    {
      id: "developer-relations",
      emoji: "🎤",
      title: "Developer relations or ecosystem",
      description: "The core model, tooling journey, and common developer gaps",
    },
  ],
  reference: [
    {
      id: "client-reference",
      emoji: "⌨️",
      title: "Clients, transactions, and RPC",
      description: "Get to integration and data references quickly",
    },
    {
      id: "program-reference",
      emoji: "🧩",
      title: "Programs, PDAs, and CPIs",
      description: "Focus on runtime, account design, testing, and deployment",
    },
    {
      id: "production-reference",
      emoji: "🛡️",
      title: "Security and production",
      description: "Testing, compute, verified builds, and operations",
    },
  ],
};

const STARTING_OPTIONS: readonly PersonalizationOption<StartingPoint>[] = [
  {
    id: "new",
    emoji: "🌱",
    title: "New to blockchain",
    description: "Start with the mental model and build up carefully",
  },
  {
    id: "web",
    emoji: "🌐",
    title: "Web or TypeScript developer",
    description: "Keep client context, but teach me the onchain model",
  },
  {
    id: "rust",
    emoji: "🦀",
    title: "Rust or systems developer",
    description: "Skip language basics and focus on Solana's runtime",
  },
  {
    id: "ethereum",
    emoji: "⟠",
    title: "Coming from Ethereum",
    description: "Translate the EVM model, then merge into the shared path",
  },
  {
    id: "solana",
    emoji: "◎",
    title: "Already building on Solana",
    description: "Favor advanced implementation and production stops",
  },
];

const NON_TECHNICAL_STARTING_OPTIONS: readonly PersonalizationOption<StartingPoint>[] =
  [
    {
      id: "new",
      emoji: "🧭",
      title: "Keep it non-technical",
      description: "Give me concepts and product implications without code",
    },
    {
      id: "web",
      emoji: "🤝",
      title: "Enough to work with developers",
      description:
        "Show the technical boundaries I need to plan and review work",
    },
    {
      id: "rust",
      emoji: "📐",
      title: "I'm comfortable with technical material",
      description:
        "Include architecture and implementation context where useful",
    },
    {
      id: "ethereum",
      emoji: "⟠",
      title: "I know the Ethereum ecosystem",
      description: "Translate the product and execution differences for me",
    },
    {
      id: "solana",
      emoji: "◎",
      title: "I already work in Solana",
      description: "Keep only the specialist and production context",
    },
  ];

const LEARNING_STYLE_OPTIONS: readonly PersonalizationOption<LearningStyle>[] =
  [
    {
      id: "Watch",
      emoji: "▶️",
      title: "Videos",
      description: "Bootcamp and guided walkthroughs",
    },
    {
      id: "Read",
      emoji: "📖",
      title: "Reading",
      description: "Docs and focused conceptual guides",
    },
    {
      id: "Build",
      emoji: "🧪",
      title: "Hands-on",
      description: "Projects, exercises, and challenges",
    },
  ];

const INTERMEDIATE_QUESTIONS = [
  {
    id: "persistent-state",
    type: "multiple-choice",
    question:
      "Where should a Solana program keep persistent application state?",
    answers: [
      "Inside the deployed program binary",
      "In accounts owned by the program",
      "In the transaction's recent blockhash",
    ],
    correctAnswer: 1,
  },
  {
    id: "atomic-transactions",
    type: "multiple-choice",
    question:
      "What happens when the third instruction in a Solana transaction fails?",
    answers: [
      "Only the third instruction is reverted",
      "The first two instructions remain committed",
      "The entire transaction fails atomically",
    ],
    correctAnswer: 2,
  },
  {
    id: "pda-authority",
    type: "multiple-choice",
    question: "How can a program authorize an action for one of its PDAs?",
    answers: [
      "The runtime verifies the program's seeds and bump during signing",
      "The PDA stores and exposes a private key",
      "Any transaction signer can impersonate the PDA",
    ],
    correctAnswer: 0,
  },
  {
    id: "compute-review",
    type: "multiple-choice",
    question: "What should happen before optimizing a program's compute use?",
    answers: [
      "Remove account validation to save units",
      "Measure compute and cover important failure paths",
      "Increase every transaction's priority fee",
    ],
    correctAnswer: 1,
  },
  {
    id: "vault-security-review",
    type: "written",
    question:
      "A vault withdrawal receives a vault account, authority, destination, and amount. In 2–4 sentences, what should the program verify before moving funds?",
    hint: "Think about authority, account relationships, and the requested transfer.",
  },
] as const satisfies readonly IntermediateQuestion[];

const CORE_STEPS: CoreStep[] = [
  {
    id: "mental-model",
    number: "01",
    phase: "Get ready",
    title: "Learn the Solana mental model",
    description:
      "Start with the execution model: accounts hold state, programs process instructions, and transactions group work atomically.",
    resources: [
      {
        label: "Intro to Blockchain",
        href: "/developers/bootcamp/foundations/quick-intro-to-blockchain",
        type: "Watch",
      },
      {
        label: "Solana core concepts",
        href: "/docs/core",
        type: "Read",
      },
      {
        label: "Introduction to Solana",
        href: "https://learn.blueshift.gg/en/courses/introduction-to-blockchain-and-solana/introduction-to-solana",
        type: "Read",
      },
    ],
    doneWhen:
      "You can explain the difference between an account, a program, an instruction, and a transaction.",
    goals: ["build", "developer", "understand", "work"],
    hideFor: ["solana"],
  },
  {
    id: "network-wallets",
    number: "02",
    phase: "Get ready",
    title: "Orient yourself on the network",
    description:
      "Understand clusters, addresses, wallets, commitments, explorers, and the difference between SOL and lamports.",
    resources: [
      {
        label: "Solana terminology",
        href: "/docs/references/terminology",
        type: "Read",
      },
      {
        label: "Clusters and endpoints",
        href: "/docs/references/clusters",
        type: "Read",
      },
      {
        label: "What is a wallet?",
        href: "/learn/what-is-a-wallet",
        type: "Read",
      },
    ],
    doneWhen:
      "You can choose the right cluster, read an address, find a transaction, and explain commitment levels.",
    goals: ["build", "developer", "understand", "work"],
    hideFor: ["solana"],
  },
  {
    id: "local-setup",
    number: "03",
    phase: "Get ready",
    title: "Set up the Solana toolchain",
    description:
      "Install the CLI, Rust, Anchor, and a local validator, then learn the handful of commands you will use every day.",
    resources: [
      {
        label: "Local installation walkthrough",
        href: "/developers/bootcamp/foundations/local-installation",
        type: "Watch",
      },
      {
        label: "Installation guide",
        href: "/docs/intro/installation",
        type: "Build",
      },
      {
        label: "Solana CLI basics",
        href: "/docs/intro/installation/solana-cli-basics",
        type: "Read",
      },
      {
        label: "Anchor CLI basics",
        href: "/docs/intro/installation/anchor-cli-basics",
        type: "Read",
      },
    ],
    doneWhen:
      "The CLI, Rust, Anchor, and your local validator work together and the project checks pass.",
    goals: ["build", "developer"],
    hideFor: ["solana"],
  },
  {
    id: "rust-foundations",
    number: "04",
    phase: "Get ready",
    title: "Learn the Rust you need for programs",
    description:
      "Focus on ownership, borrowing, enums, results, traits, and serialization—the parts that show up constantly in Solana programs.",
    resources: [
      {
        label: "Rust program development",
        href: "/docs/programs/rust",
        type: "Read",
      },
      {
        label: "Program structure",
        href: "/docs/programs/rust/program-structure",
        type: "Read",
      },
      {
        label: "The Rust Book",
        href: "https://doc.rust-lang.org/book/",
        type: "Build",
      },
    ],
    doneWhen:
      "You can read a small Rust program, follow ownership, handle a Result, and model instruction data with structs and enums.",
    goals: ["build", "developer"],
    focuses: ["programs", "defi", "games-performance", "program-reference"],
    hideFor: ["rust", "solana"],
  },
  {
    id: "first-program",
    number: "05",
    phase: "Get ready",
    title: "Build and inspect your first program",
    description:
      "Complete one small end-to-end project early. Deploy it locally, call it from a client, and inspect the resulting transaction.",
    resources: [
      {
        label: "Build your first program",
        href: "/docs/intro/quick-start/build-first-program",
        type: "Build",
      },
      {
        label: "Hello World walkthrough",
        href: "/developers/bootcamp/foundations/hello-world",
        type: "Build",
      },
      {
        label: "Bootcamp project 1",
        href: "https://www.youtube.com/watch?v=amAq-WHAFs8&t=622s",
        type: "Watch",
      },
    ],
    doneWhen:
      "Your client invokes the program successfully and you can find the signature, logs, and changed account state.",
    goals: ["build", "developer"],
    hideFor: ["solana"],
  },
  {
    id: "accounts-programs",
    number: "06",
    phase: "Learn",
    title: "Understand accounts and programs",
    description:
      "Accounts store state while programs remain executable code. Learn ownership, data layout, rent, and the runtime's modification rules.",
    resources: [
      {
        label: "Accounts",
        href: "/docs/core/accounts",
        type: "Read",
      },
      {
        label: "Account structure",
        href: "/docs/core/accounts/account-structure",
        type: "Read",
      },
      {
        label: "Account modification rules",
        href: "/docs/core/accounts/modification-rules",
        type: "Read",
      },
      {
        label: "Programs",
        href: "/docs/core/programs",
        type: "Read",
      },
    ],
    doneWhen:
      "Given an account, you can identify its address, owner, data, lamports, executable flag, and who may modify it.",
    goals: ["build", "developer", "understand", "reference"],
    hideFor: ["solana"],
  },
  {
    id: "transactions",
    number: "07",
    phase: "Learn",
    title: "Follow instructions through a transaction",
    description:
      "Learn how instructions declare accounts and data, how messages combine them atomically, and where execution costs come from.",
    resources: [
      {
        label: "Instructions",
        href: "/docs/core/instructions",
        type: "Read",
      },
      {
        label: "Transactions",
        href: "/docs/core/transactions",
        type: "Read",
      },
      {
        label: "Transaction structure",
        href: "/docs/core/transactions/transaction-structure",
        type: "Read",
      },
      {
        label: "Fees",
        href: "/docs/core/fees",
        type: "Read",
      },
    ],
    doneWhen:
      "You can inspect a transaction and identify its signers, writable accounts, instructions, blockhash, and fee.",
    goals: ["build", "developer", "understand", "work", "reference"],
    hideFor: ["solana"],
  },
  {
    id: "signing-wallets",
    number: "08",
    phase: "Learn",
    title: "Understand signing and wallet authority",
    description:
      "Separate fee payers, transaction signers, program authority, and wallet UX. Learn what may safely be signed in production.",
    resources: [
      {
        label: "Transaction signing in production",
        href: "/docs/core/transactions/signing-in-production",
        type: "Read",
      },
      {
        label: "Durable nonces",
        href: "/docs/core/transactions/durable-nonces",
        type: "Read",
      },
      {
        label: "Transaction simulation",
        href: "/docs/rpc/http/simulatetransaction",
        type: "Build",
      },
    ],
    doneWhen:
      "You can name every required signer, explain what each authorizes, and avoid asking a wallet to sign opaque data.",
    goals: ["build", "developer", "understand", "reference"],
  },
  {
    id: "pda-authority",
    number: "09",
    phase: "Learn",
    title: "Model state and authority with PDAs",
    description:
      "Use deterministic seeds to find program-owned state, represent relationships, and authorize actions without private keys.",
    resources: [
      {
        label: "Program Derived Addresses",
        href: "/docs/core/pda",
        type: "Read",
      },
      {
        label: "PDA derivation",
        href: "/docs/core/pda/pda-derivation",
        type: "Read",
      },
      {
        label: "PDA accounts",
        href: "/docs/core/pda/pda-accounts",
        type: "Read",
      },
    ],
    doneWhen:
      "You can choose stable seeds, derive the address and bump, and explain how a program signs for its PDA.",
    goals: ["build", "developer", "reference"],
    focuses: [
      "programs",
      "defi",
      "games-performance",
      "program-reference",
      "production-reference",
    ],
    hideFor: ["solana"],
  },
  {
    id: "cpi-composability",
    number: "10",
    phase: "Learn",
    title: "Compose programs with CPIs",
    description:
      "Call other programs safely, pass the right account privileges, sign with PDAs, and understand the cost of deep composition.",
    resources: [
      {
        label: "Cross-Program Invocations",
        href: "/docs/core/cpi",
        type: "Read",
      },
      {
        label: "CPI with a PDA signer",
        href: "/docs/core/cpi/cpi-with-pda",
        type: "Build",
      },
      {
        label: "CPI execution",
        href: "/docs/core/cpi/cpi-execution",
        type: "Read",
      },
      {
        label: "CPI cost model",
        href: "/docs/core/cpi/cpi-cost-model",
        type: "Read",
      },
    ],
    doneWhen:
      "You can trace nested invocations, explain privilege extension rules, and make a PDA-authorized CPI.",
    goals: ["build", "developer", "reference"],
    focuses: [
      "programs",
      "defi",
      "games-performance",
      "program-reference",
      "production-reference",
    ],
    hideFor: ["solana"],
  },
  {
    id: "anchor",
    number: "11",
    phase: "Learn",
    title: "Use Anchor without hiding the runtime",
    description:
      "Learn instruction contexts, account constraints, serialization, errors, IDLs, testing, and when to drop to lower-level Rust.",
    resources: [
      {
        label: "Anchor 101",
        href: "https://learn.blueshift.gg/en/courses/anchor-for-dummies/anchor-101",
        type: "Read",
      },
      {
        label: "Anchor accounts",
        href: "https://learn.blueshift.gg/en/courses/anchor-for-dummies/anchor-accounts",
        type: "Read",
      },
      {
        label: "Program IDLs",
        href: "/docs/programs/idls",
        type: "Read",
      },
      {
        label: "Advanced Anchor",
        href: "https://learn.blueshift.gg/en/courses/anchor-for-dummies/advanced-anchor",
        type: "Build",
      },
    ],
    doneWhen:
      "You can read every generated constraint, write a custom one, understand the IDL, and explain what Anchor does for you.",
    goals: ["build", "developer"],
    focuses: ["programs", "defi", "games-performance"],
  },
  {
    id: "tokens",
    number: "12",
    phase: "Learn",
    title: "Learn tokens and Token Extensions",
    description:
      "Understand mint accounts, token accounts, authorities, associated token accounts, Token-2022, and extension tradeoffs.",
    resources: [
      {
        label: "Tokens on Solana",
        href: "/docs/tokens",
        type: "Read",
      },
      {
        label: "Token quickstart",
        href: "/docs/tokens/quickstart",
        type: "Build",
      },
      {
        label: "Token Extensions",
        href: "/docs/tokens/extensions",
        type: "Read",
      },
      {
        label: "Build tokens with Kit",
        href: "/docs/tokens/basics/mint-tokens#kit",
        type: "Build",
      },
    ],
    doneWhen:
      "You can distinguish a mint from a token account, identify its authorities, and choose classic Token or Token-2022.",
    goals: ["build", "developer", "understand", "work"],
    focuses: ["tokens-payments", "defi", "ecosystem", "finance", "product"],
  },
  {
    id: "clients-rpc",
    number: "13",
    phase: "Learn",
    title: "Read and write through clients and RPC",
    description:
      "Build transactions with the official client, fetch accounts in batches, subscribe to changes, simulate, send, and confirm.",
    resources: [
      {
        label: "JavaScript client",
        href: "/docs/clients/official/javascript",
        type: "Read",
      },
      {
        label: "Frontend client",
        href: "/docs/frontend/client",
        type: "Build",
      },
      {
        label: "JSON-RPC methods",
        href: "/docs/rpc",
        type: "Read",
      },
      {
        label: "Read from the network",
        href: "/docs/intro/quick-start/reading-from-network",
        type: "Build",
      },
    ],
    doneWhen:
      "You can fetch typed state, build an instruction, simulate and send it, then confirm the intended account changes.",
    goals: ["build", "developer", "understand", "reference"],
    focuses: [
      "apps",
      "data",
      "transactions",
      "ecosystem",
      "client-reference",
      "tokens-payments",
      "games-performance",
    ],
  },
  {
    id: "stateful-program",
    number: "14",
    phase: "Build",
    title: "Build a stateful program from scratch",
    description:
      "Design a small vault, escrow, or voting program. Define its state machine first, then implement its success and failure paths.",
    resources: [
      {
        label: "Anchor Vault challenge",
        href: "https://learn.blueshift.gg/en/challenges/anchor-vault",
        type: "Build",
      },
      {
        label: "Voting program",
        href: "/developers/bootcamp/program-patterns/voting",
        type: "Build",
      },
      {
        label: "Escrow application",
        href: "/developers/bootcamp/program-patterns/escrow-application",
        type: "Build",
      },
      {
        label: "Bootcamp projects 1–9",
        href: "https://www.youtube.com/watch?v=amAq-WHAFs8",
        type: "Watch",
      },
    ],
    doneWhen:
      "The state machine is explicit, authorities are enforced, transitions are tested, and invalid accounts are rejected.",
    goals: ["build", "developer"],
    focuses: ["programs", "defi", "games-performance", "tokens-payments"],
  },
  {
    id: "transaction-ux",
    number: "15",
    phase: "Build",
    title: "Build production-quality transaction UX",
    description:
      "Connect a real interface, simulate before signing, show useful errors, handle confirmation, and make state changes observable.",
    resources: [
      {
        label: "React hooks",
        href: "/docs/frontend/react-hooks",
        type: "Build",
      },
      {
        label: "Next.js and Solana",
        href: "/docs/frontend/nextjs-solana",
        type: "Build",
      },
      {
        label: "Write to the network",
        href: "/docs/intro/quick-start/writing-to-network",
        type: "Build",
      },
      {
        label: "Transaction pipeline",
        href: "/docs/core/transactions/transaction-pipeline",
        type: "Read",
      },
    ],
    doneWhen:
      "A user can understand what they are signing, recover from expected failures, and verify the final state.",
    goals: ["build", "developer"],
    focuses: [
      "apps",
      "tokens-payments",
      "defi",
      "games-performance",
      "client-reference",
    ],
  },
  {
    id: "program-patterns",
    number: "16",
    phase: "Build",
    title: "Study reusable program patterns",
    description:
      "Implement escrow, voting, token authority, and swap patterns so you can recognize state machines and trust boundaries in real programs.",
    resources: [
      {
        label: "Escrow application",
        href: "/developers/bootcamp/program-patterns/escrow-application",
        type: "Build",
      },
      {
        label: "Stable swap",
        href: "/developers/bootcamp/program-patterns/stable-swap",
        type: "Build",
      },
      {
        label: "Stable coin",
        href: "/developers/bootcamp/program-patterns/stable-coin",
        type: "Build",
      },
      {
        label: "Anchor Escrow challenge",
        href: "https://learn.blueshift.gg/en/challenges/anchor-escrow",
        type: "Build",
      },
    ],
    doneWhen:
      "You can draw each pattern's state transitions, authorities, invariants, and external program calls before reading its code.",
    goals: ["build", "developer"],
    focuses: ["programs", "defi", "tokens-payments", "games-performance"],
  },
  {
    id: "testing-debugging",
    number: "17",
    phase: "Build",
    title: "Test failures and debug execution",
    description:
      "Go past the happy path. Manipulate account state, assert custom errors, inspect logs, and test every authority boundary.",
    resources: [
      {
        label: "Testing with Mollusk",
        href: "/docs/programs/testing/mollusk",
        type: "Build",
      },
      {
        label: "Testing with LiteSVM",
        href: "https://learn.blueshift.gg/en/courses/testing-with-litesvm/litesvm-101",
        type: "Build",
      },
      {
        label: "Transaction introspection",
        href: "/docs/core/transactions/transaction-introspection",
        type: "Read",
      },
      {
        label: "Program examples",
        href: "/docs/programs/examples",
        type: "Read",
      },
    ],
    doneWhen:
      "Tests cover unauthorized signers, wrong owners, invalid seeds, repeated calls, boundary values, and expected custom errors.",
    goals: ["build", "developer", "reference"],
    focuses: [
      "programs",
      "defi",
      "games-performance",
      "program-reference",
      "production-reference",
    ],
  },
  {
    id: "compute-performance",
    number: "18",
    phase: "Build",
    title: "Measure compute and transaction limits",
    description:
      "Profile before optimizing. Learn account, stack, CPI, transaction-size, priority-fee, and compute-budget constraints.",
    resources: [
      {
        label: "Compute budget",
        href: "/docs/core/fees/compute-budget",
        type: "Read",
      },
      {
        label: "Program limitations",
        href: "/docs/programs/limitations",
        type: "Read",
      },
      {
        label: "CPI cost model",
        href: "/docs/core/cpi/cpi-cost-model",
        type: "Read",
      },
      {
        label: "Recent prioritization fees",
        href: "/docs/rpc/http/getrecentprioritizationfees",
        type: "Build",
      },
    ],
    doneWhen:
      "You can measure compute, explain the limiting resource, and make a targeted optimization without removing validation.",
    goals: ["build", "developer", "reference"],
    focuses: [
      "programs",
      "defi",
      "games-performance",
      "program-reference",
      "production-reference",
    ],
  },
  {
    id: "index-data",
    number: "19",
    phase: "Build",
    title: "Index and observe onchain data",
    description:
      "Design the read path instead of treating RPC as a database. Track events, account changes, historical transactions, and failures.",
    resources: [
      {
        label: "Indexing walkthrough",
        href: "/developers/bootcamp/shipping-production/indexing",
        type: "Build",
      },
      {
        label: "WebSocket subscriptions",
        href: "/docs/rpc/websocket",
        type: "Read",
      },
      {
        label: "Get program accounts",
        href: "/docs/rpc/http/getprogramaccounts",
        type: "Build",
      },
      {
        label: "Transaction introspection",
        href: "/docs/core/transactions/transaction-introspection",
        type: "Read",
      },
    ],
    doneWhen:
      "Your application can reconstruct important state, diagnose a failed transaction, and alert on unexpected behavior.",
    goals: ["build", "developer", "understand", "work", "reference"],
    focuses: [
      "apps",
      "data",
      "defi",
      "transactions",
      "product",
      "developer-relations",
      "client-reference",
      "production-reference",
      "games-performance",
    ],
  },
  {
    id: "security-review",
    number: "20",
    phase: "Ship",
    title: "Threat-model and review the program",
    description:
      "Review signer, owner, address, account relationship, arithmetic, reinitialization, remaining-account, and CPI boundaries.",
    resources: [
      {
        label: "Security walkthrough",
        href: "/developers/bootcamp/program-patterns/security",
        type: "Watch",
      },
      {
        label: "Advanced Anchor constraints",
        href: "https://learn.blueshift.gg/en/courses/anchor-for-dummies/advanced-anchor",
        type: "Read",
      },
      {
        label: "Bootcamp: Attacking the Bank",
        href: "https://www.youtube.com/watch?v=HOdYZSe1uhE&t=24025s",
        type: "Watch",
      },
    ],
    doneWhen:
      "Critical instructions have negative tests, trust boundaries are documented, and every unchecked account has explicit validation.",
    goals: ["build", "developer", "work", "reference"],
  },
  {
    id: "deployment-upgrades",
    number: "21",
    phase: "Ship",
    title: "Deploy, verify, and control upgrades",
    description:
      "Practice cluster deployment, program IDs, upgrade authorities, reproducible builds, key custody, and safe release sequencing.",
    resources: [
      {
        label: "Deploying programs",
        href: "/docs/programs/deploying",
        type: "Build",
      },
      {
        label: "Program deployment model",
        href: "/docs/core/programs/program-deployment",
        type: "Read",
      },
      {
        label: "Verified builds",
        href: "/docs/programs/verified-builds",
        type: "Build",
      },
      {
        label: "Anchor program deployment",
        href: "https://learn.blueshift.gg/en/courses/anchor-for-dummies/program-deployment",
        type: "Build",
      },
    ],
    doneWhen:
      "You can reproduce the binary, verify it onchain, name the upgrade authority, and execute a rollback plan.",
    goals: ["build", "developer", "reference"],
    focuses: [
      "programs",
      "defi",
      "games-performance",
      "program-reference",
      "production-reference",
      "tokens-payments",
    ],
  },
  {
    id: "production-operations",
    number: "22",
    phase: "Ship",
    title: "Operate a production Solana application",
    description:
      "Plan RPC resilience, confirmation strategy, priority fees, monitoring, indexing recovery, key management, and incident response.",
    resources: [
      {
        label: "Production readiness",
        href: "/developers/bootcamp/shipping-production/production-readiness",
        type: "Watch",
      },
      {
        label: "Payment production readiness",
        href: "/docs/payments/production-readiness",
        type: "Read",
      },
      {
        label: "Bootcamp: Getting to Production",
        href: "https://www.youtube.com/watch?v=HOdYZSe1uhE&t=25805s",
        type: "Watch",
      },
      {
        label: "RPC health",
        href: "/docs/rpc/http/gethealth",
        type: "Build",
      },
    ],
    doneWhen:
      "You have dashboards, alerts, fallback infrastructure, controlled keys, a release checklist, and an incident plan.",
    goals: ["build", "developer", "work", "reference"],
  },
];

const ETHEREUM_STEP: CoreStep = {
  id: "ethereum-transfer",
  number: "E1",
  phase: "Get ready",
  title: "Translate EVM to SVM",
  description:
    "Use your Ethereum knowledge as the starting point. Translate storage, contract calls, signatures, and program authority into Solana's model.",
  resources: [
    {
      label: "EVM to SVM guide",
      href: "https://solana.com/developers/evm-to-svm/complete-guide",
      type: "Read",
    },
    {
      label: "Eth to Sol",
      href: "https://ethtosol.mcgee.cat",
      type: "Build",
    },
  ],
  doneWhen:
    "You can map contract storage to accounts, contract calls to instructions, and contract-owned state to PDAs.",
};

const PRODUCT_BRANCHES: Branch[] = [
  {
    id: "payments",
    label: "Product branch",
    title: "Payments and token products",
    description:
      "Take this branch for checkout, payouts, subscriptions, stablecoins, or custom token behavior.",
    resources: [
      {
        label: "Payments quickstart",
        href: "/docs/payments/quickstart",
        type: "Build",
      },
      {
        label: "How payments work",
        href: "/docs/payments/how-payments-work",
        type: "Read",
      },
      {
        label: "Token Extensions",
        href: "/docs/tokens/extensions",
        type: "Read",
      },
      {
        label: "x402 application",
        href: "/developers/bootcamp/fullstack-apps/x402",
        type: "Build",
      },
    ],
    focuses: ["tokens-payments", "finance"],
  },
  {
    id: "defi",
    label: "Product branch",
    title: "DeFi and financial programs",
    description:
      "Take this branch for swaps, lending, vaults, markets, or any protocol with financial invariants.",
    resources: [
      {
        label: "DeFi on Solana",
        href: "/docs/defi",
        type: "Read",
      },
      {
        label: "Stable swap",
        href: "/developers/bootcamp/program-patterns/stable-swap",
        type: "Build",
      },
      {
        label: "Prediction market",
        href: "/developers/bootcamp/fullstack-apps/prediction-market",
        type: "Build",
      },
      {
        label: "Bootcamp lending application",
        href: "https://www.youtube.com/watch?v=HOdYZSe1uhE",
        type: "Watch",
      },
    ],
    focuses: ["defi"],
  },
  {
    id: "games",
    label: "Product branch",
    title: "Games and real-time apps",
    description:
      "Take this branch when latency, frequent state changes, game clients, or tight compute budgets shape the architecture.",
    resources: [
      {
        label: "Game SDKs",
        href: "/docs/clients/community/game-sdks",
        type: "Read",
      },
      {
        label: "Compute budget",
        href: "/docs/core/fees/compute-budget",
        type: "Read",
      },
      {
        label: "Versioned transactions",
        href: "/docs/core/transactions/versioned-transactions",
        type: "Build",
      },
    ],
    focuses: ["games-performance"],
  },
  {
    id: "privacy",
    label: "Product branch",
    title: "Privacy",
    description:
      "Take this branch when your application needs private balances or transfers.",
    resources: [
      {
        label: "Private Transfers",
        href: "/developers/bootcamp/fullstack-apps/private-transfers",
        type: "Build",
      },
      {
        label: "Confidential Transfers",
        href: "/docs/tokens/extensions/confidential-transfer",
        type: "Read",
      },
      {
        label: "Confidential transfer integration guide",
        href: "/docs/tokens/extensions/confidential-transfer/integration-guide",
        type: "Build",
      },
    ],
    focuses: ["tokens-payments", "finance"],
  },
  {
    id: "institutional",
    label: "Product branch",
    title: "Institutional assets",
    description:
      "Take this branch for stablecoins, tokenized assets, and issuer-controlled flows.",
    resources: [
      {
        label: "Stable Coin",
        href: "/developers/bootcamp/program-patterns/stable-coin",
        type: "Build",
      },
      {
        label: "Real-World Assets",
        href: "/developers/bootcamp/fullstack-apps/real-world-assets",
        type: "Build",
      },
      {
        label: "Tokenization quickstart",
        href: "/docs/tokenization/quickstart",
        type: "Build",
      },
      {
        label: "Token access control",
        href: "/docs/tokenization/token-acl",
        type: "Read",
      },
    ],
    focuses: ["finance", "tokens-payments"],
  },
];

const INTRO_STEP = CORE_STEPS[0];
const ETHEREUM_SKIPPED_STEP_IDS = new Set([
  "accounts-programs",
  "transactions",
  "signing-wallets",
  "pda-authority",
  "cpi-composability",
]);

function ResourceLink({ resource }: { resource: RoadmapResource }) {
  return (
    <a
      className={styles.resourceLink}
      href={resource.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.resourceType}>{resource.type}</span>
      <span>{resource.label}</span>
      <ExternalLink aria-hidden="true" size={14} />
    </a>
  );
}

function isPersonalizationProfile(
  value: unknown,
): value is PersonalizationProfile {
  if (!value || typeof value !== "object") return false;

  const profile = value as Partial<PersonalizationProfile>;
  const goal = GOAL_OPTIONS.find((option) => option.id === profile.goal)?.id;
  const focus =
    goal &&
    FOCUS_OPTIONS[goal].find((option) => option.id === profile.focus)?.id;
  const startingPoint = STARTING_OPTIONS.find(
    (option) => option.id === profile.startingPoint,
  )?.id;
  const validLearningStyles = new Set(
    LEARNING_STYLE_OPTIONS.map((option) => option.id),
  );

  return (
    goal !== undefined &&
    focus !== undefined &&
    startingPoint !== undefined &&
    Array.isArray(profile.learningStyles) &&
    profile.learningStyles.every(
      (style) =>
        typeof style === "string" &&
        validLearningStyles.has(style as LearningStyle),
    )
  );
}

function stepMatchesProfile(
  step: CoreStep,
  profile: PersonalizationProfile | null,
) {
  if (!profile) return true;
  if (step.hideFor?.includes(profile.startingPoint)) return false;
  if (step.goals && !step.goals.includes(profile.goal)) return false;
  if (step.focuses && !step.focuses.includes(profile.focus)) return false;
  return true;
}

function resourcesForProfile(
  resources: RoadmapResource[],
  profile: PersonalizationProfile | null,
) {
  if (!profile || profile.learningStyles.length === 0) return resources;

  const preferredResources = resources.filter((resource) =>
    profile.learningStyles.includes(resource.type),
  );

  return preferredResources.length > 0
    ? preferredResources
    : resources.slice(0, 1);
}

function stepForProfile(
  step: CoreStep,
  profile: PersonalizationProfile | null,
) {
  return {
    ...step,
    resources: resourcesForProfile(step.resources, profile),
  };
}

function TokenRoadmapGroup({
  step,
  topics,
  completedSet,
  isComplete,
  isNext,
  onToggle,
  onOpen,
  onOpenTopic,
  side,
}: {
  step: CoreStep;
  topics: TokenTopic[];
  completedSet: Set<string>;
  isComplete: boolean;
  isNext: boolean;
  onToggle: (_id: string) => void;
  onOpen: (_step: CoreStep) => void;
  onOpenTopic: (_topic: TokenTopic) => void;
  side: "left" | "right" | "center";
}) {
  return (
    <article
      className={`${styles.mapRow} ${styles.tokenGroupRow} ${
        side === "left"
          ? styles.mapRowLeft
          : side === "right"
            ? styles.mapRowRight
            : styles.mapRowCenter
      } ${isComplete ? styles.stepComplete : ""} ${
        isNext ? styles.stepNext : ""
      }`}
    >
      <section
        className={`${styles.tokenGroup} ${
          isComplete ? styles.tokenGroupComplete : ""
        }`}
        aria-labelledby="tokens-roadmap-title"
      >
        <header className={styles.tokenGroupHeader}>
          <button
            type="button"
            className={styles.tokenGroupTitle}
            onClick={() => onOpen(step)}
          >
            <span className={styles.stepNumber}>
              {step.number} <span>{step.phase}</span>
            </span>
            <h3 id="tokens-roadmap-title">Tokens &amp; Token Extensions</h3>
          </button>
          <div className={styles.nodeControls}>
            {isNext && !isComplete ? (
              <span className={styles.nextLabel}>Next</span>
            ) : null}
            <button
              type="button"
              onClick={() => onToggle(step.id)}
              aria-pressed={isComplete}
              aria-label={`${
                isComplete ? "Mark incomplete" : "Mark complete"
              }: ${step.title}`}
            >
              {isComplete ? (
                <Check aria-hidden="true" size={15} strokeWidth={2.6} />
              ) : (
                <Circle aria-hidden="true" size={9} fill="currentColor" />
              )}
            </button>
          </div>
        </header>

        <div className={styles.tokenTopicGrid}>
          {topics.map((topic) => {
            const topicComplete = completedSet.has(topic.id);

            return (
              <div
                key={topic.id}
                className={`${styles.tokenTopic} ${
                  topic.featured ? styles.tokenTopicFeatured : ""
                } ${topicComplete ? styles.tokenTopicComplete : ""}`}
              >
                <button
                  type="button"
                  className={styles.stepOpenButton}
                  onClick={() => onOpenTopic(topic)}
                  aria-label={`Open resources for ${topic.title}`}
                />
                <span>{topic.title}</span>
                <button
                  type="button"
                  className={styles.tokenTopicCheck}
                  onClick={() => onToggle(topic.id)}
                  aria-pressed={topicComplete}
                  aria-label={`${
                    topicComplete ? "Mark incomplete" : "Mark complete"
                  }: ${topic.title}`}
                >
                  {topicComplete ? (
                    <Check aria-hidden="true" size={13} strokeWidth={2.7} />
                  ) : (
                    <Circle aria-hidden="true" size={8} fill="currentColor" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}

function readProgress(): StoredProgress {
  const emptyProgress: StoredProgress = {
    completedIds: [],
    entryRoute: "new",
    assessmentPassed: false,
    personalization: null,
  };

  if (typeof window === "undefined") return emptyProgress;

  const value = safeStorageGetItem(
    getBrowserStorage("localStorage"),
    STORAGE_KEY,
  );
  if (!value) return emptyProgress;

  try {
    const parsed = JSON.parse(value) as Partial<StoredProgress>;
    const validIds = new Set([
      ...CORE_STEPS.map((step) => step.id),
      ETHEREUM_STEP.id,
      ...PRODUCT_BRANCHES.map((branch) => branch.id),
      ...TOKEN_TOPICS.map((topic) => topic.id),
    ]);

    return {
      completedIds: Array.isArray(parsed.completedIds)
        ? parsed.completedIds.filter(
            (item): item is string =>
              typeof item === "string" && validIds.has(item),
          )
        : [],
      entryRoute: parsed.entryRoute === "ethereum" ? "ethereum" : "new",
      assessmentPassed: parsed.assessmentPassed === true,
      personalization: isPersonalizationProfile(parsed.personalization)
        ? parsed.personalization
        : null,
    };
  } catch {
    return emptyProgress;
  }
}

function RoadmapStep({
  step,
  isComplete,
  isNext,
  onToggle,
  onOpen,
  side,
}: {
  step: CoreStep;
  isComplete: boolean;
  isNext: boolean;
  onToggle: (_id: string) => void;
  onOpen: (_step: CoreStep) => void;
  side: "left" | "right" | "center";
}) {
  return (
    <article
      className={`${styles.mapRow} ${
        side === "left"
          ? styles.mapRowLeft
          : side === "right"
            ? styles.mapRowRight
            : styles.mapRowCenter
      } ${
        isComplete ? styles.stepComplete : ""
      } ${isNext ? styles.stepNext : ""}`}
    >
      <div className={styles.stepCluster}>
        <button
          type="button"
          className={styles.stepOpenButton}
          onClick={() => onOpen(step)}
          aria-label={`Open resources for ${step.title}`}
        />
        <header className={styles.mainNode}>
          <div>
            <span className={styles.stepNumber}>
              {step.number} <span>{step.phase}</span>
            </span>
            <h3>{step.title}</h3>
          </div>
          <div className={styles.nodeControls}>
            {isNext && !isComplete ? (
              <span className={styles.nextLabel}>Next</span>
            ) : null}
            <button
              type="button"
              onClick={() => onToggle(step.id)}
              aria-pressed={isComplete}
              aria-label={`${
                isComplete ? "Mark incomplete" : "Mark complete"
              }: ${step.title}`}
            >
              {isComplete ? (
                <Check aria-hidden="true" size={15} strokeWidth={2.6} />
              ) : (
                <Circle aria-hidden="true" size={9} fill="currentColor" />
              )}
            </button>
          </div>
        </header>
      </div>
    </article>
  );
}

function RoadmapResourceDrawer({
  detail,
  isComplete,
  onOpenChange,
  onToggle,
}: {
  detail: RoadmapDetail | null;
  isComplete: boolean;
  onOpenChange: (_open: boolean) => void;
  onToggle: (_id: string) => void;
}) {
  return (
    <Dialog.Root open={detail !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.drawerOverlay} />
        <Dialog.Content className={styles.resourceDrawer}>
          {detail ? (
            <>
              <header className={styles.drawerTopbar}>
                <span>
                  <BookOpen aria-hidden="true" size={16} />
                  Resources
                </span>
                <div>
                  {detail.canComplete ? (
                    <button
                      type="button"
                      className={`${styles.drawerStatus} ${
                        isComplete ? styles.drawerStatusComplete : ""
                      }`}
                      onClick={() => onToggle(detail.id)}
                      aria-pressed={isComplete}
                    >
                      {isComplete ? (
                        <Check aria-hidden="true" size={14} />
                      ) : (
                        <Circle
                          aria-hidden="true"
                          size={9}
                          fill="currentColor"
                        />
                      )}
                      {isComplete ? "Complete" : "Mark complete"}
                    </button>
                  ) : null}
                  <Dialog.Close
                    className={styles.drawerClose}
                    aria-label="Close resources"
                  >
                    <X aria-hidden="true" size={18} />
                  </Dialog.Close>
                </div>
              </header>

              <div className={styles.drawerBody}>
                <span className={styles.drawerEyebrow}>{detail.eyebrow}</span>
                <Dialog.Title>{detail.title}</Dialog.Title>
                <Dialog.Description>{detail.description}</Dialog.Description>

                {detail.doneWhen ? (
                  <section className={styles.drawerGoal}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    <div>
                      <strong>Done when</strong>
                      <span>{detail.doneWhen}</span>
                    </div>
                  </section>
                ) : null}

                <section className={styles.drawerResourceSection}>
                  <header>
                    <span>Learning resources</span>
                    <small>{detail.resources.length}</small>
                  </header>
                  <div className={styles.drawerResources}>
                    {detail.resources.map((resource) => (
                      <ResourceLink key={resource.href} resource={resource} />
                    ))}
                  </div>
                </section>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PersonalizationDialog({
  open,
  onOpenChange,
  profile,
  onApply,
  onClear,
}: {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  profile: PersonalizationProfile | null;
  onApply: (_profile: PersonalizationProfile) => void;
  onClear: () => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [goal, setGoal] = useState<RoadmapGoal | null>(null);
  const [focus, setFocus] = useState<RoadmapFocus | null>(null);
  const [startingPoint, setStartingPoint] = useState<StartingPoint | null>(
    null,
  );
  const [learningStyles, setLearningStyles] = useState<LearningStyle[]>([]);

  useEffect(() => {
    if (!open) return;
    setQuestionIndex(0);
    setGoal(profile?.goal ?? null);
    setFocus(profile?.focus ?? null);
    setStartingPoint(profile?.startingPoint ?? null);
    setLearningStyles(profile?.learningStyles ?? []);
  }, [open, profile]);

  const focusOptions = goal ? FOCUS_OPTIONS[goal] : [];
  const startingOptions =
    goal === "work" ? NON_TECHNICAL_STARTING_OPTIONS : STARTING_OPTIONS;
  const questionTwoTitle =
    goal === "build"
      ? "What do you want to build?"
      : goal === "developer"
        ? "Which part of development?"
        : goal === "understand"
          ? "What do you want to understand?"
          : goal === "work"
            ? "What kind of work brings you here?"
            : "What do you need right now?";
  const questionThreeTitle =
    goal === "work"
      ? "How technical should your path be?"
      : goal === "reference"
        ? "How much Solana context do you have?"
        : "Where are you starting from?";

  const chooseGoal = (nextGoal: RoadmapGoal) => {
    setGoal(nextGoal);
    if (!FOCUS_OPTIONS[nextGoal].some((option) => option.id === focus)) {
      setFocus(null);
    }
    setQuestionIndex(1);
  };

  const chooseFocus = (nextFocus: RoadmapFocus) => {
    setFocus(nextFocus);
    setQuestionIndex(2);
  };

  const toggleLearningStyle = (style: LearningStyle) => {
    setLearningStyles((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style],
    );
  };

  const applyProfile = () => {
    if (!goal || !focus || !startingPoint) return;
    onApply({ goal, focus, startingPoint, learningStyles });
    onOpenChange(false);
  };

  const renderOption = <T extends string>(
    option: PersonalizationOption<T>,
    selected: boolean,
    onSelect: () => void,
    index: number,
  ) => (
    <button
      key={option.id}
      type="button"
      className={`${styles.personalizeOption} ${
        selected ? styles.personalizeOptionSelected : ""
      }`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className={styles.personalizeEmoji} aria-hidden="true">
        {option.emoji}
      </span>
      <span>
        <strong>{option.title}</strong>
        <small>{option.description}</small>
      </span>
      <kbd>{index + 1}</kbd>
    </button>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.personalizeOverlay} />
        <Dialog.Content className={styles.personalizeDialog}>
          <Dialog.Close
            className={styles.personalizeClose}
            aria-label="Close personalization"
          >
            <X aria-hidden="true" size={18} />
          </Dialog.Close>

          <header className={styles.personalizeProgress}>
            <div aria-hidden="true">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className={
                    index <= questionIndex ? styles.personalizeProgressDone : ""
                  }
                />
              ))}
            </div>
            <span>{questionIndex + 1} of 3</span>
          </header>

          {questionIndex > 0 ? (
            <button
              type="button"
              className={styles.personalizeBack}
              onClick={() => setQuestionIndex((current) => current - 1)}
            >
              <ArrowLeft aria-hidden="true" size={14} />
              Back
            </button>
          ) : null}

          <div className={styles.personalizeHeading}>
            <span>✨ Personalize your roadmap</span>
            <Dialog.Title>
              {questionIndex === 0
                ? "What brings you to Solana?"
                : questionIndex === 1
                  ? questionTwoTitle
                  : questionThreeTitle}
            </Dialog.Title>
            <Dialog.Description>
              {questionIndex === 0
                ? "Under a minute — we'll cut the full roadmap down to your starting path."
                : questionIndex === 1
                  ? "This chooses which specialist stops stay in your roadmap."
                  : "We'll keep the fundamentals you need and remove the ones you already know."}
            </Dialog.Description>
          </div>

          <div className={styles.personalizeOptions}>
            {questionIndex === 0
              ? GOAL_OPTIONS.map((option, index) =>
                  renderOption(
                    option,
                    option.id === goal,
                    () => chooseGoal(option.id),
                    index,
                  ),
                )
              : null}

            {questionIndex === 1
              ? focusOptions.map((option, index) =>
                  renderOption(
                    option,
                    option.id === focus,
                    () => chooseFocus(option.id),
                    index,
                  ),
                )
              : null}

            {questionIndex === 2
              ? startingOptions.map((option, index) =>
                  renderOption(
                    option,
                    option.id === startingPoint,
                    () => setStartingPoint(option.id),
                    index,
                  ),
                )
              : null}
          </div>

          {questionIndex === 2 ? (
            <section className={styles.learningPreference}>
              <header>
                <div>
                  <strong>How do you like to learn?</strong>
                  <span>Optional · choose any that apply</span>
                </div>
              </header>
              <div>
                {LEARNING_STYLE_OPTIONS.map((option) => {
                  const selected = learningStyles.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      className={selected ? styles.learningStyleSelected : ""}
                      onClick={() => toggleLearningStyle(option.id)}
                    >
                      <span aria-hidden="true">{option.emoji}</span>
                      {option.title}
                      {selected ? (
                        <Check aria-hidden="true" size={13} strokeWidth={2.7} />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          <footer className={styles.personalizeFooter}>
            {profile ? (
              <button
                type="button"
                className={styles.clearPersonalization}
                onClick={() => {
                  onClear();
                  onOpenChange(false);
                }}
              >
                Show full roadmap
              </button>
            ) : (
              <span>Personalization only removes irrelevant stops.</span>
            )}
            {questionIndex === 2 ? (
              <button
                type="button"
                className={styles.applyPersonalization}
                disabled={!goal || !focus || !startingPoint}
                onClick={applyProfile}
              >
                Apply my roadmap
                <Sparkles aria-hidden="true" size={15} />
              </button>
            ) : null}
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function IntermediateQuiz({
  open,
  onOpenChange,
  onPass,
}: {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  onPass: () => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingError, setGradingError] = useState("");
  const [graderFeedback, setGraderFeedback] = useState("");

  const resetQuiz = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setWrittenAnswer("");
    setScore(0);
    setIsFinished(false);
    setIsSubmitting(false);
    setGradingError("");
    setGraderFeedback("");
  };

  useEffect(() => {
    if (open) resetQuiz();
  }, [open]);

  const currentQuestion =
    INTERMEDIATE_QUESTIONS[questionIndex] ?? INTERMEDIATE_QUESTIONS[0];
  const passed = isFinished && score === INTERMEDIATE_QUESTIONS.length;
  const canSubmit =
    currentQuestion.type === "multiple-choice"
      ? selectedAnswer !== null
      : writtenAnswer.trim().length >= 20;

  const submitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setGradingError("");
    setGraderFeedback("");
    setIsSubmitting(true);

    let isCorrect = false;
    let feedback = "";

    if (currentQuestion.type === "multiple-choice") {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    } else {
      try {
        const response = await fetch("/api/learn/intermediate-assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: currentQuestion.id,
            answer: writtenAnswer.trim(),
          }),
        });
        const result = (await response.json()) as {
          correct?: boolean;
          feedback?: string;
          error?: string;
        };

        if (!response.ok || typeof result.correct !== "boolean") {
          throw new Error(
            result.error ?? "The written answer could not be graded.",
          );
        }

        isCorrect = result.correct;
        feedback = result.feedback ?? "";
      } catch (error) {
        setGradingError(
          error instanceof Error
            ? error.message
            : "The written answer could not be graded. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }
    }

    const nextScore = score + (isCorrect ? 1 : 0);
    const isLastQuestion = questionIndex === INTERMEDIATE_QUESTIONS.length - 1;

    setScore(nextScore);
    setIsSubmitting(false);

    if (isLastQuestion) {
      setGraderFeedback(isCorrect ? "" : feedback);
      setIsFinished(true);
      if (nextScore === INTERMEDIATE_QUESTIONS.length) onPass();
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
    setWrittenAnswer("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.quizOverlay} />
        <Dialog.Content className={styles.quizDialog}>
          <Dialog.Close className={styles.quizClose} aria-label="Close test">
            <X aria-hidden="true" size={18} />
          </Dialog.Close>

          {!isFinished ? (
            <>
              <header className={styles.quizHeader}>
                <div>
                  <span>Intermediate checkpoint</span>
                  <Dialog.Title>Test your Solana foundations</Dialog.Title>
                </div>
                <strong>
                  {questionIndex + 1}/{INTERMEDIATE_QUESTIONS.length}
                </strong>
              </header>
              <Dialog.Description className={styles.quizDescription}>
                Get all five right to earn the intermediate trophy. The final
                answer is reviewed by AI.
              </Dialog.Description>

              <div className={styles.quizProgress} aria-hidden="true">
                {INTERMEDIATE_QUESTIONS.map((question, index) => (
                  <span
                    key={question.id}
                    className={
                      index < questionIndex
                        ? styles.quizProgressDone
                        : index === questionIndex
                          ? styles.quizProgressCurrent
                          : ""
                    }
                  />
                ))}
              </div>

              <form onSubmit={submitAnswer} className={styles.quizForm}>
                <fieldset>
                  <legend>{currentQuestion.question}</legend>

                  {currentQuestion.type === "multiple-choice" ? (
                    <div
                      className={styles.quizAnswers}
                      role="radiogroup"
                      aria-label="Answer choices"
                    >
                      {currentQuestion.answers.map((answer, index) => (
                        <button
                          key={answer}
                          type="button"
                          role="radio"
                          aria-checked={selectedAnswer === index}
                          className={`${styles.quizAnswer} ${
                            selectedAnswer === index
                              ? styles.quizAnswerSelected
                              : ""
                          }`}
                          onClick={() => setSelectedAnswer(index)}
                        >
                          <span>{String.fromCharCode(65 + index)}</span>
                          {answer}
                          <CheckCircle2 aria-hidden="true" size={18} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.writtenAnswer}>
                      <textarea
                        value={writtenAnswer}
                        onChange={(event) => {
                          setWrittenAnswer(event.target.value);
                          setGradingError("");
                        }}
                        maxLength={700}
                        rows={5}
                        placeholder="Explain the checks you would make…"
                        aria-describedby="written-answer-hint"
                      />
                      <span id="written-answer-hint">
                        {currentQuestion.hint}
                      </span>
                    </div>
                  )}
                </fieldset>

                {gradingError ? (
                  <p className={styles.quizError} role="alert">
                    {gradingError}
                  </p>
                ) : null}

                <footer className={styles.quizFooter}>
                  <span>
                    {currentQuestion.type === "written"
                      ? "AI-graded · one short response"
                      : "Choose one answer"}
                  </span>
                  <button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting
                      ? "Reviewing…"
                      : questionIndex === INTERMEDIATE_QUESTIONS.length - 1
                        ? "Finish test"
                        : "Next question"}
                    {!isSubmitting ? (
                      <ChevronRight aria-hidden="true" size={16} />
                    ) : null}
                  </button>
                </footer>
              </form>
            </>
          ) : (
            <div
              className={`${styles.quizResult} ${
                passed ? styles.quizResultPassed : ""
              }`}
            >
              {passed ? (
                <div className={styles.confetti} aria-hidden="true">
                  {Array.from({ length: 32 }, (_, index) => (
                    <i
                      key={index}
                      style={{
                        left: `${(index * 37) % 100}%`,
                        animationDelay: `${(index % 8) * -0.11}s`,
                        animationDuration: `${1.35 + (index % 5) * 0.16}s`,
                      }}
                    />
                  ))}
                </div>
              ) : null}

              <span className={styles.quizResultIcon}>
                <Trophy aria-hidden="true" size={34} />
                {passed ? (
                  <span>
                    <Check aria-hidden="true" size={13} />
                  </span>
                ) : null}
              </span>
              <small>{passed ? "Checkpoint passed" : "Almost there"}</small>
              <Dialog.Title>
                {passed
                  ? "Intermediate level verified"
                  : `${score} of ${INTERMEDIATE_QUESTIONS.length} correct`}
              </Dialog.Title>
              <Dialog.Description>
                {passed
                  ? "Perfect score. Your intermediate trophy is now lit up on the roadmap."
                  : "Review the path and try again—you need all five answers correct to light the trophy."}
              </Dialog.Description>
              {!passed && graderFeedback ? (
                <p className={styles.graderFeedback}>{graderFeedback}</p>
              ) : null}
              <div className={styles.quizResultActions}>
                {!passed ? (
                  <button type="button" onClick={resetQuiz}>
                    <RotateCcw aria-hidden="true" size={15} />
                    Try again
                  </button>
                ) : null}
                <Dialog.Close>
                  {passed ? "Back to roadmap" : "Review roadmap"}
                </Dialog.Close>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ConceptsRoadmap() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [entryRoute, setEntryRoute] = useState<EntryRoute>("new");
  const [assessmentPassed, setAssessmentPassed] = useState(false);
  const [personalization, setPersonalization] =
    useState<PersonalizationProfile | null>(null);
  const [roadmapView, setRoadmapView] = useState<"original" | "personalized">(
    "original",
  );
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<RoadmapDetail | null>(null);

  useEffect(() => {
    const progress = readProgress();
    setCompletedIds(progress.completedIds);
    setEntryRoute(progress.entryRoute);
    setAssessmentPassed(progress.assessmentPassed);
    setPersonalization(progress.personalization);
    if (progress.personalization) setRoadmapView("personalized");
  }, []);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const activePersonalization =
    roadmapView === "personalized" ? personalization : null;
  const activeEntryRoute = activePersonalization
    ? activePersonalization.startingPoint === "ethereum"
      ? "ethereum"
      : "new"
    : entryRoute;
  const isEthereumPath = activeEntryRoute === "ethereum";
  const matchingCoreSteps = CORE_STEPS.filter((step) =>
    stepMatchesProfile(step, activePersonalization),
  );
  const visibleCoreSteps = matchingCoreSteps
    .filter(
      (step) => !isEthereumPath || !ETHEREUM_SKIPPED_STEP_IDS.has(step.id),
    )
    .map((step) => stepForProfile(step, activePersonalization));
  const visibleIntroStep = visibleCoreSteps.find(
    (step) => step.id === INTRO_STEP.id,
  );
  const phaseOneSteps = visibleCoreSteps.filter(
    (step) => step.phase === "Get ready" && step.id !== INTRO_STEP.id,
  );
  const phaseTwoSteps = visibleCoreSteps.filter(
    (step) => step.phase === "Learn",
  );
  const phaseThreeSteps = visibleCoreSteps.filter(
    (step) => step.phase === "Build",
  );
  const phaseFourSteps = visibleCoreSteps.filter(
    (step) => step.phase === "Ship",
  );
  const personalizedEthereumStep = stepForProfile(
    ETHEREUM_STEP,
    activePersonalization,
  );
  const requiredSteps = isEthereumPath
    ? [
        ...(visibleIntroStep ? [visibleIntroStep] : []),
        personalizedEthereumStep,
        ...visibleCoreSteps.filter((step) => step.id !== INTRO_STEP.id),
      ]
    : visibleCoreSteps;
  const visibleBranches = PRODUCT_BRANCHES.filter(
    (branch) =>
      !activePersonalization ||
      branch.focuses.includes(activePersonalization.focus),
  ).map((branch) => ({
    ...branch,
    resources: resourcesForProfile(branch.resources, activePersonalization),
  }));
  const requiredCompletedCount = requiredSteps.filter((step) =>
    completedSet.has(step.id),
  ).length;
  const nextStepId = requiredSteps.find(
    (step) => !completedSet.has(step.id),
  )?.id;
  const reachedIntermediate = requiredSteps
    .filter((step) => step.phase !== "Ship")
    .every((step) => completedSet.has(step.id));

  const writeProgress = (
    nextIds: string[],
    nextRoute = entryRoute,
    nextAssessmentPassed = assessmentPassed,
    nextPersonalization = personalization,
  ) => {
    safeStorageSetItem(
      getBrowserStorage("localStorage"),
      STORAGE_KEY,
      JSON.stringify({
        completedIds: nextIds,
        entryRoute: nextRoute,
        assessmentPassed: nextAssessmentPassed,
        personalization: nextPersonalization,
      } satisfies StoredProgress),
    );
  };

  const toggleComplete = (id: string) => {
    setCompletedIds((current) => {
      let next: string[];

      if (id === "tokens") {
        const shouldComplete = !current.includes(id);
        next = shouldComplete
          ? Array.from(
              new Set([
                ...current,
                id,
                ...TOKEN_TOPICS.map((topic) => topic.id),
              ]),
            )
          : current.filter((item) => item !== id && !TOKEN_TOPIC_IDS.has(item));
      } else if (TOKEN_TOPIC_IDS.has(id)) {
        next = current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id];

        const allTokenTopicsComplete = TOKEN_TOPICS.every((topic) =>
          next.includes(topic.id),
        );
        next = allTokenTopicsComplete
          ? Array.from(new Set([...next, "tokens"]))
          : next.filter((item) => item !== "tokens");
      } else {
        next = current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id];
      }

      writeProgress(next);
      return next;
    });
  };

  const selectEntryRoute = (nextRoute: EntryRoute) => {
    setEntryRoute(nextRoute);
    writeProgress(completedIds, nextRoute);
  };

  const passAssessment = () => {
    setAssessmentPassed(true);
    writeProgress(completedIds, entryRoute, true);
  };

  const applyPersonalization = (profile: PersonalizationProfile) => {
    setPersonalization(profile);
    setRoadmapView("personalized");
    writeProgress(completedIds, entryRoute, assessmentPassed, profile);
  };

  const clearPersonalization = () => {
    setPersonalization(null);
    setRoadmapView("original");
    setEntryRoute("new");
    writeProgress(completedIds, "new", assessmentPassed, null);
  };

  const openStep = (step: CoreStep) => {
    setActiveDetail({
      id: step.id,
      eyebrow: `Step ${step.number} · ${step.phase}`,
      title: step.title,
      description: step.description,
      resources: step.resources,
      doneWhen: step.doneWhen,
      canComplete: true,
    });
  };

  const openBranch = (branch: Branch) => {
    setActiveDetail({
      id: branch.id,
      eyebrow: branch.label,
      title: branch.title,
      description: branch.description,
      resources: branch.resources,
      canComplete: true,
    });
  };

  const openTokenTopic = (topic: TokenTopic) => {
    setActiveDetail({
      id: topic.id,
      eyebrow: "Tokens & Token Extensions",
      title: topic.title,
      description: topic.description,
      resources: topic.resources,
      canComplete: true,
    });
  };

  const openEthereumShortcut = () => {
    setActiveDetail({
      id: personalizedEthereumStep.id,
      eyebrow: "Optional shortcut · Ethereum",
      title: personalizedEthereumStep.title,
      description: personalizedEthereumStep.description,
      resources: personalizedEthereumStep.resources,
      doneWhen: personalizedEthereumStep.doneWhen,
      canComplete: isEthereumPath,
    });
  };

  const renderStep = (
    step: CoreStep,
    side: "left" | "right" | "center" = "left",
  ) => {
    if (step.id === "tokens") {
      return (
        <TokenRoadmapGroup
          key={step.id}
          step={step}
          topics={TOKEN_TOPICS.map((topic) => ({
            ...topic,
            resources: resourcesForProfile(
              topic.resources,
              activePersonalization,
            ),
          }))}
          completedSet={completedSet}
          isComplete={completedSet.has(step.id)}
          isNext={step.id === nextStepId}
          onToggle={toggleComplete}
          onOpen={openStep}
          onOpenTopic={openTokenTopic}
          side={side}
        />
      );
    }

    return (
      <RoadmapStep
        key={step.id}
        step={step}
        isComplete={completedSet.has(step.id)}
        isNext={step.id === nextStepId}
        onToggle={toggleComplete}
        onOpen={openStep}
        side={side}
      />
    );
  };

  return (
    <div className={`${styles.roadmap} not-prose`} data-learn-roadmap="">
      <div className={styles.roadmapToolbar}>
        {personalization ? (
          <div
            className={styles.roadmapViewTabs}
            role="tablist"
            aria-label="Roadmap view"
          >
            <button
              type="button"
              role="tab"
              aria-selected={roadmapView === "original"}
              className={
                roadmapView === "original" ? styles.roadmapViewTabActive : ""
              }
              onClick={() => setRoadmapView("original")}
            >
              Original
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={roadmapView === "personalized"}
              className={
                roadmapView === "personalized"
                  ? styles.roadmapViewTabActive
                  : ""
              }
              title={
                roadmapView === "personalized"
                  ? "Edit personalization"
                  : "Show personalized roadmap"
              }
              onClick={() => {
                if (roadmapView === "personalized") {
                  setIsPersonalizeOpen(true);
                  return;
                }
                setRoadmapView("personalized");
              }}
            >
              <span aria-hidden="true">✨</span>
              Personalized
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.personalizeTrigger}
            onClick={() => setIsPersonalizeOpen(true)}
          >
            <span aria-hidden="true">✨</span>
            Personalize
          </button>
        )}
      </div>

      <div className={styles.corePath}>
        <div
          className={`${styles.mapRow} ${styles.mapRowRight} ${styles.agentMapRow}`}
        >
          <aside className={styles.agentNote}>
            <span className={styles.agentIcon}>
              <Bot aria-hidden="true" size={19} />
            </span>
            <div>
              <strong>Using a coding agent?</strong>
              <span>
                Use it throughout the path, but verify account constraints and
                authority checks yourself.
              </span>
            </div>
            <div className={styles.agentLinks}>
              <a
                href="/developers/bootcamp/foundations/ai-best-practices"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play aria-hidden="true" size={14} />
                AI best practices
              </a>
              <a href="/skills" target="_blank" rel="noopener noreferrer">
                <Code2 aria-hidden="true" size={14} />
                Solana skills
              </a>
            </div>
          </aside>
        </div>

        {visibleIntroStep ? renderStep(visibleIntroStep, "left") : null}

        {!activePersonalization ||
        activePersonalization.startingPoint === "ethereum" ? (
          <section
            className={`${styles.ethereumFork} ${
              isEthereumPath ? styles.ethereumForkActive : ""
            }`}
            aria-labelledby="ethereum-shortcut-title"
          >
            <article>
              <button
                type="button"
                className={styles.stepOpenButton}
                onClick={openEthereumShortcut}
                aria-label="Open resources for the Ethereum shortcut"
              />
              <header>
                <span>
                  <GitBranch aria-hidden="true" size={14} />
                  Optional shortcut
                </span>
                {isEthereumPath ? (
                  <button
                    type="button"
                    className={styles.shortcutCheck}
                    onClick={() => toggleComplete(ETHEREUM_STEP.id)}
                    aria-pressed={completedSet.has(ETHEREUM_STEP.id)}
                    aria-label={`${
                      completedSet.has(ETHEREUM_STEP.id)
                        ? "Mark incomplete"
                        : "Mark complete"
                    }: ${ETHEREUM_STEP.title}`}
                  >
                    {completedSet.has(ETHEREUM_STEP.id) ? (
                      <Check aria-hidden="true" size={14} />
                    ) : (
                      <Circle aria-hidden="true" size={10} />
                    )}
                  </button>
                ) : null}
              </header>
              <h3 id="ethereum-shortcut-title">
                Already building on Ethereum?
              </h3>
              <p>
                Read this after the Solana mental model. It replaces the
                accounts, transactions, PDA, CPI, and signing stops, then merges
                back into the shared build path.
              </p>
              <div className={styles.stepMeta}>
                <span>
                  <BookOpen aria-hidden="true" size={14} />
                  {personalizedEthereumStep.resources.length} resources
                </span>
                <span>
                  Open
                  <ChevronRight aria-hidden="true" size={14} />
                </span>
              </div>
              <button
                type="button"
                className={styles.shortcutToggle}
                onClick={() =>
                  selectEntryRoute(isEthereumPath ? "new" : "ethereum")
                }
                aria-pressed={isEthereumPath}
              >
                {isEthereumPath ? (
                  <>
                    <Check aria-hidden="true" size={14} />
                    Shortcut active — use full path
                  </>
                ) : (
                  <>
                    <GitBranch aria-hidden="true" size={14} />
                    Take the Ethereum shortcut
                  </>
                )}
              </button>
            </article>
          </section>
        ) : null}

        {phaseOneSteps.length > 0 ? (
          <>
            <div className={styles.phaseLabel}>
              <span>Phase 1 · Tooling and first program</span>
            </div>
            {phaseOneSteps.map((step, index) =>
              renderStep(step, index % 2 === 0 ? "right" : "left"),
            )}
          </>
        ) : null}

        {phaseTwoSteps.length > 0 ? (
          <>
            <div className={styles.phaseLabel}>
              <span>Phase 2 · Runtime and core primitives</span>
            </div>
            {phaseTwoSteps.map((step, index) =>
              renderStep(step, index % 2 === 0 ? "left" : "right"),
            )}
          </>
        ) : null}

        {phaseThreeSteps.length > 0 ? (
          <>
            <div className={styles.phaseLabel}>
              <span>Phase 3 · Build beyond the basics</span>
            </div>
            {phaseThreeSteps.map((step, index) =>
              renderStep(step, index % 2 === 0 ? "right" : "left"),
            )}
          </>
        ) : null}

        <div
          className={`${styles.levelMilestone} ${
            reachedIntermediate ? styles.levelMilestoneReached : ""
          } ${assessmentPassed ? styles.levelMilestonePassed : ""}`}
        >
          <span className={styles.levelIcon}>
            <Trophy aria-hidden="true" size={19} />
            {assessmentPassed ? (
              <span className={styles.trophyCheck}>
                <Check aria-hidden="true" size={11} strokeWidth={3} />
              </span>
            ) : null}
          </span>
          <span className={styles.levelCopy}>
            <small>Milestone</small>
            <strong>You&apos;ve reached intermediate level</strong>
          </span>
          {reachedIntermediate || assessmentPassed ? (
            <button
              type="button"
              className={styles.assessmentButton}
              onClick={() => setIsQuizOpen(true)}
            >
              {assessmentPassed ? "Retake test" : "Test me"}
              <ChevronRight aria-hidden="true" size={14} />
            </button>
          ) : null}
        </div>

        {visibleBranches.length > 0 ? (
          <section
            className={styles.specializationFork}
            aria-labelledby="specializations-title"
          >
            <header>
              <div>
                <p className={styles.kicker}>Optional product branches</p>
                <h3 id="specializations-title">Go deeper for your product</h3>
              </div>
            </header>
            <div className={styles.specializationGrid}>
              {visibleBranches.map((branch) => {
                const isComplete = completedSet.has(branch.id);
                return (
                  <article
                    key={branch.id}
                    className={`${styles.branchCard} ${
                      isComplete ? styles.branchComplete : ""
                    }`}
                  >
                    <button
                      type="button"
                      className={styles.stepOpenButton}
                      onClick={() => openBranch(branch)}
                      aria-label={`Open resources for ${branch.title}`}
                    />
                    <div className={styles.branchHeader}>
                      <span>
                        <GitBranch aria-hidden="true" size={14} />
                        {branch.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleComplete(branch.id)}
                        aria-pressed={isComplete}
                        aria-label={`${
                          isComplete ? "Mark incomplete" : "Mark complete"
                        }: ${branch.title} branch`}
                      >
                        {isComplete ? (
                          <Check aria-hidden="true" size={14} />
                        ) : (
                          <Circle aria-hidden="true" size={10} />
                        )}
                      </button>
                    </div>
                    <h3>{branch.title}</h3>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {phaseFourSteps.length > 0 ? (
          <>
            <div className={styles.phaseLabel}>
              <span>Phase 4 · Secure, deploy, and operate</span>
            </div>
            {phaseFourSteps.map((step, index) =>
              renderStep(step, index % 2 === 0 ? "left" : "right"),
            )}
          </>
        ) : null}

        <div className={styles.coreFinish}>
          <ShieldCheck aria-hidden="true" size={18} />
          {requiredCompletedCount === requiredSteps.length
            ? "Roadmap complete"
            : "Complete the required steps to finish"}
        </div>
      </div>

      <p className={styles.srStatus} aria-live="polite">
        {requiredCompletedCount} of {requiredSteps.length} required steps
        complete on the{" "}
        {activePersonalization
          ? "personalized"
          : isEthereumPath
            ? "Ethereum shortcut"
            : "full"}{" "}
        path.
      </p>

      <PersonalizationDialog
        open={isPersonalizeOpen}
        onOpenChange={setIsPersonalizeOpen}
        profile={personalization}
        onApply={applyPersonalization}
        onClear={clearPersonalization}
      />

      <RoadmapResourceDrawer
        detail={activeDetail}
        isComplete={activeDetail ? completedSet.has(activeDetail.id) : false}
        onOpenChange={(open) => {
          if (!open) setActiveDetail(null);
        }}
        onToggle={toggleComplete}
      />

      <IntermediateQuiz
        open={isQuizOpen}
        onOpenChange={setIsQuizOpen}
        onPass={passAssessment}
      />
    </div>
  );
}
