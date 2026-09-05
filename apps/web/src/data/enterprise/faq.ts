// Structure of the enterprise FAQ at /solutions/enterprise/faq. All copy
// (questions, answers, topics, glossary) lives in the "enterpriseFaq"
// namespace of packages/i18n/messages/*/common.json. Answers reference
// glossary tooltips via numbered rich-text tags mapped in `terms`.

export type FaqRef = {
  typeKey: string;
  labelKey: string;
  href: string;
};

export type FaqItemMeta = {
  key: string;
  refs?: FaqRef[];
  // rich-text tag name (t0, t1, …) -> glossary key in enterpriseFaq.glossary
  terms?: Record<string, string>;
};

export type FaqTopicMeta = {
  key: string;
  icon: string;
  items: FaqItemMeta[];
};

export const FAQ_TOPICS: FaqTopicMeta[] = [
  {
    key: "fundamentals-network",
    icon: "◎",
    items: [
      {
        key: "q0",
        refs: [
          {
            typeKey: "web",
            labelKey: "financial-institutions-on-solana",
            href: "/solutions/financial-institutions",
          },
        ],
      },
      {
        key: "q1",
        refs: [
          {
            typeKey: "docs",
            labelKey: "transaction-fees",
            href: "/docs/core/fees",
          },
        ],
        terms: { t0: "priority-fee" },
      },
    ],
  },
  {
    key: "chain-migration",
    icon: "⇄",
    items: [
      {
        key: "q0",
        refs: [
          {
            typeKey: "docs",
            labelKey: "solana-account-model",
            href: "/docs/core/accounts",
          },
          {
            typeKey: "guide",
            labelKey: "evm-to-svm-account-model",
            href: "/developers/migrate-to-solana/accounts",
          },
          {
            typeKey: "guide",
            labelKey: "evm-to-svm-smart-contracts",
            href: "/developers/migrate-to-solana/smart-contracts",
          },
        ],
      },
      {
        key: "q1",
        refs: [
          {
            typeKey: "web",
            labelKey: "financial-institutions-on-solana",
            href: "/solutions/financial-institutions",
          },
          {
            typeKey: "guide",
            labelKey: "chain-migration-hub",
            href: "/developers/migrate-to-solana",
          },
          {
            typeKey: "guide",
            labelKey: "ethereum-to-solana-migration",
            href: "/developers/migrate-to-solana/ethereum",
          },
        ],
      },
      {
        key: "q2",
        refs: [
          {
            typeKey: "docs",
            labelKey: "confidential-transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            typeKey: "docs",
            labelKey: "private-channels",
            href: "/docs/tools/private-channels",
          },
        ],
        terms: { t0: "confidential-balances", t1: "private-channels" },
      },
      {
        key: "q3",
        refs: [
          {
            typeKey: "web",
            labelKey: "financial-institutions-on-solana",
            href: "/solutions/financial-institutions",
          },
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
          {
            typeKey: "guide",
            labelKey: "evm-to-svm-client-differences",
            href: "/developers/migrate-to-solana/client-differences",
          },
        ],
        terms: { t0: "rpc-providers", t1: "token-extensions" },
      },
      {
        key: "q4",
        refs: [
          {
            typeKey: "web",
            labelKey: "circle-cross-chain-transfer-protocol",
            href: "https://www.circle.com/cross-chain-transfer-protocol",
          },
          {
            typeKey: "guide",
            labelKey: "ethereum-to-solana-migration",
            href: "/developers/migrate-to-solana/ethereum",
          },
        ],
      },
    ],
  },
  {
    key: "tokens-stablecoins",
    icon: "◉",
    items: [
      {
        key: "q0",
        refs: [
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
          {
            typeKey: "docs",
            labelKey: "tokens-on-solana",
            href: "/docs/tokens",
          },
          {
            typeKey: "news",
            labelKey: "token-extensions-on-solana",
            href: "/news/token-extensions-on-solana",
          },
        ],
        terms: { t0: "token-extensions" },
      },
      {
        key: "q1",
        refs: [
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
        ],
        terms: { t0: "token-extensions" },
      },
      {
        key: "q2",
        refs: [
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
          {
            typeKey: "docs",
            labelKey: "tokens-on-solana",
            href: "/docs/tokens",
          },
        ],
      },
      {
        key: "q3",
        refs: [
          {
            typeKey: "web",
            labelKey: "stablecoins-on-solana",
            href: "/solutions/stablecoins",
          },
          {
            typeKey: "github",
            labelKey: "mosaic-toolkit",
            href: "https://github.com/solana-foundation/mosaic",
          },
        ],
        terms: { t0: "token-extensions", t1: "mosaic" },
      },
      {
        key: "q4",
        refs: [
          {
            typeKey: "web",
            labelKey: "stablecoins-on-solana",
            href: "/solutions/stablecoins",
          },
          {
            typeKey: "news",
            labelKey: "token-extensions-on-solana",
            href: "/news/token-extensions-on-solana",
          },
        ],
        terms: { t0: "token-extensions" },
      },
    ],
  },
  {
    key: "compliance-regulated-tokens",
    icon: "⬡",
    items: [
      {
        key: "q0",
        refs: [
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
        ],
        terms: { t0: "token-extensions" },
      },
      {
        key: "q1",
        refs: [
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
          {
            typeKey: "github",
            labelKey: "mosaic-toolkit",
            href: "https://github.com/solana-foundation/mosaic",
          },
          {
            typeKey: "docs",
            labelKey: "token-acl",
            href: "/docs/tokenization/token-acl",
          },
        ],
        terms: { t0: "token-extensions", t1: "token-acl" },
      },
      {
        key: "q2",
        refs: [
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
        ],
        terms: { t0: "transfer-hook", t1: "default-frozen", t2: "allowlist" },
      },
      {
        key: "q3",
        refs: [
          {
            typeKey: "github",
            labelKey: "mosaic-toolkit",
            href: "https://github.com/solana-foundation/mosaic",
          },
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
          {
            typeKey: "docs",
            labelKey: "token-acl",
            href: "/docs/tokenization/token-acl",
          },
        ],
        terms: { t0: "token-acl", t1: "allowlist", t2: "transfer-hook" },
      },
      {
        key: "q4",
        refs: [
          {
            typeKey: "github",
            labelKey: "mosaic-toolkit",
            href: "https://github.com/solana-foundation/mosaic",
          },
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
        ],
        terms: {
          t0: "token-extensions",
          t1: "default-frozen",
          t2: "allowlist",
          t3: "transfer-hook",
          t4: "permanent-delegate",
          t5: "mosaic",
        },
      },
      { key: "q5" },
    ],
  },
  {
    key: "privacy-confidentiality",
    icon: "◐",
    items: [
      {
        key: "q0",
        refs: [
          {
            typeKey: "docs",
            labelKey: "confidential-transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            typeKey: "docs",
            labelKey: "private-channels",
            href: "/docs/tools/private-channels",
          },
        ],
        terms: {
          t0: "confidential-balances",
          t1: "auditor-key",
          t2: "private-channels",
        },
      },
      {
        key: "q1",
        refs: [
          {
            typeKey: "docs",
            labelKey: "confidential-transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
        ],
        terms: {
          t0: "confidential-balances",
          t1: "travel-rule",
          t2: "vasp",
          t3: "auditor-key",
        },
      },
      {
        key: "q2",
        refs: [
          {
            typeKey: "docs",
            labelKey: "confidential-transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            typeKey: "web",
            labelKey: "financial-institutions-on-solana",
            href: "/solutions/financial-institutions",
          },
        ],
        terms: { t0: "confidential-balances" },
      },
      {
        key: "q3",
        refs: [
          {
            typeKey: "docs",
            labelKey: "confidential-transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          { typeKey: "web", labelKey: "privacy-on-solana", href: "/privacy" },
        ],
        terms: { t0: "confidential-balances" },
      },
      {
        key: "q4",
        refs: [
          {
            typeKey: "docs",
            labelKey: "confidential-transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            typeKey: "github",
            labelKey: "confidential-balances-sample",
            href: "https://github.com/solana-developers/Confidential-Balances-Sample",
          },
        ],
      },
      {
        key: "q5",
        refs: [
          {
            typeKey: "docs",
            labelKey: "confidential-transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            typeKey: "docs",
            labelKey: "confidential-balances-spl",
            href: "https://www.solana-program.com/docs/confidential-balances",
          },
        ],
        terms: { t0: "auditor-key" },
      },
      {
        key: "q6",
        refs: [
          {
            typeKey: "docs",
            labelKey: "confidential-transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            typeKey: "docs",
            labelKey: "private-channels",
            href: "/docs/tools/private-channels",
          },
        ],
        terms: { t0: "confidential-balances", t1: "private-channels" },
      },
    ],
  },
  {
    key: "tokenized-funds-rwa",
    icon: "◈",
    items: [
      {
        key: "q0",
        refs: [
          {
            typeKey: "github",
            labelKey: "mosaic-toolkit",
            href: "https://github.com/solana-foundation/mosaic",
          },
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
          {
            typeKey: "news",
            labelKey: "institutional-real-world-assets-on-solana",
            href: "/news/overview-of-institutional-real-world-assets-on-solana",
          },
        ],
        terms: { t0: "mosaic", t1: "token-extensions" },
      },
      {
        key: "q1",
        refs: [
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
        ],
        terms: { t0: "token-extensions", t1: "allowlist" },
      },
      { key: "q2" },
      {
        key: "q3",
        refs: [
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
          {
            typeKey: "news",
            labelKey: "institutional-real-world-assets-on-solana",
            href: "/news/overview-of-institutional-real-world-assets-on-solana",
          },
          {
            typeKey: "github",
            labelKey: "reference-vault-implementation",
            href: "https://github.com/solana-foundation/vault",
          },
        ],
        terms: { t0: "token-extensions", t1: "allowlist" },
      },
      {
        key: "q4",
        refs: [
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
        ],
        terms: { t0: "token-extensions" },
      },
      { key: "q5" },
      { key: "q6" },
      {
        key: "q7",
        refs: [
          {
            typeKey: "news",
            labelKey: "institutional-real-world-assets-on-solana",
            href: "/news/overview-of-institutional-real-world-assets-on-solana",
          },
        ],
      },
      {
        key: "q8",
        refs: [
          {
            typeKey: "news",
            labelKey: "institutional-real-world-assets-on-solana",
            href: "/news/overview-of-institutional-real-world-assets-on-solana",
          },
        ],
      },
    ],
  },
  {
    key: "payments-settlement",
    icon: "⚡",
    items: [
      {
        key: "q0",
        refs: [
          {
            typeKey: "web",
            labelKey: "financial-institutions-on-solana",
            href: "/solutions/financial-institutions",
          },
        ],
      },
      {
        key: "q1",
        refs: [
          {
            typeKey: "web",
            labelKey: "stablecoins-on-solana",
            href: "/solutions/stablecoins",
          },
          {
            typeKey: "web",
            labelKey: "financial-institutions-on-solana",
            href: "/solutions/financial-institutions",
          },
        ],
      },
      {
        key: "q2",
        refs: [
          {
            typeKey: "web",
            labelKey: "stablecoins-on-solana",
            href: "/solutions/stablecoins",
          },
          {
            typeKey: "web",
            labelKey: "circle-cross-chain-transfer-protocol",
            href: "https://www.circle.com/cross-chain-transfer-protocol",
          },
        ],
        terms: { t0: "cctp" },
      },
      {
        key: "q3",
        refs: [
          {
            typeKey: "docs",
            labelKey: "payment-indexing-and-webhooks",
            href: "/docs/payments/accept-payments/indexing",
          },
        ],
      },
      {
        key: "q4",
        refs: [
          {
            typeKey: "docs",
            labelKey: "subscription-payments",
            href: "/docs/payments/subscriptions/overview",
          },
        ],
      },
      { key: "q5" },
      {
        key: "q6",
        refs: [
          {
            typeKey: "web",
            labelKey: "financial-institutions-on-solana",
            href: "/solutions/financial-institutions",
          },
          {
            typeKey: "upgrade",
            labelKey: "alpenglow",
            href: "/upgrades/alpenglow",
          },
        ],
        terms: { t0: "alpenglow" },
      },
      {
        key: "q7",
        refs: [
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
        ],
        terms: { t0: "permanent-delegate", t1: "allowlist" },
      },
    ],
  },
  {
    key: "custody-wallets",
    icon: "▣",
    items: [
      {
        key: "q0",
        refs: [
          {
            typeKey: "web",
            labelKey: "financial-institutions-on-solana",
            href: "/solutions/financial-institutions",
          },
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
        ],
        terms: { t0: "default-frozen" },
      },
      {
        key: "q1",
        refs: [
          {
            typeKey: "docs",
            labelKey: "durable-nonces",
            href: "/docs/core/transactions/durable-nonces",
          },
          {
            typeKey: "guide",
            labelKey: "introduction-to-durable-nonces",
            href: "/developers/guides/advanced/introduction-to-durable-nonces",
          },
        ],
        terms: { t0: "durable-nonce" },
      },
      {
        key: "q2",
        refs: [
          {
            typeKey: "guide",
            labelKey: "introduction-to-durable-nonces",
            href: "/developers/guides/advanced/introduction-to-durable-nonces",
          },
        ],
        terms: { t0: "multisig", t1: "durable-nonce" },
      },
    ],
  },
  {
    key: "bridging-interoperability",
    icon: "⇌",
    items: [
      {
        key: "q0",
        refs: [
          {
            typeKey: "web",
            labelKey: "circle-cross-chain-transfer-protocol",
            href: "https://www.circle.com/cross-chain-transfer-protocol",
          },
          {
            typeKey: "docs",
            labelKey: "circle-cctp-documentation",
            href: "https://developers.circle.com/cctp",
          },
        ],
        terms: { t0: "cctp" },
      },
      {
        key: "q1",
        refs: [
          {
            typeKey: "web",
            labelKey: "circle-cross-chain-transfer-protocol",
            href: "https://www.circle.com/cross-chain-transfer-protocol",
          },
        ],
      },
    ],
  },
  {
    key: "staking-yield",
    icon: "✦",
    items: [
      {
        key: "q0",
        refs: [
          { typeKey: "web", labelKey: "staking-on-solana", href: "/staking" },
        ],
        terms: { t0: "liquid-staking" },
      },
      {
        key: "q1",
        refs: [
          { typeKey: "web", labelKey: "staking-on-solana", href: "/staking" },
          {
            typeKey: "news",
            labelKey: "institutional-real-world-assets-on-solana",
            href: "/news/overview-of-institutional-real-world-assets-on-solana",
          },
        ],
        terms: { t0: "liquid-staking" },
      },
    ],
  },
  {
    key: "infrastructure-operations",
    icon: "⚙",
    items: [
      {
        key: "q0",
        refs: [
          { typeKey: "audit", labelKey: "ottersec", href: "https://osec.io" },
          {
            typeKey: "audit",
            labelKey: "cantina",
            href: "https://cantina.xyz/welcome",
          },
          { typeKey: "audit", labelKey: "sec3", href: "https://sec3.dev" },
          {
            typeKey: "audit",
            labelKey: "zellic",
            href: "https://www.zellic.io",
          },
          {
            typeKey: "audit",
            labelKey: "sherlock",
            href: "https://sherlock.xyz",
          },
        ],
      },
      {
        key: "q1",
        refs: [
          { typeKey: "web", labelKey: "rpc-providers-on-solana", href: "/rpc" },
        ],
        terms: { t0: "rpc-providers" },
      },
      { key: "q2", terms: { t0: "multisig" } },
      {
        key: "q3",
        refs: [
          {
            typeKey: "web",
            labelKey: "token-extensions",
            href: "/solutions/token-extensions",
          },
        ],
        terms: { t0: "token-extensions", t1: "multisig" },
      },
      { key: "q4", terms: { t0: "mev" } },
      {
        key: "q5",
        refs: [
          {
            typeKey: "docs",
            labelKey: "durable-nonces",
            href: "/docs/core/transactions/durable-nonces",
          },
        ],
        terms: { t0: "rpc-providers", t1: "durable-nonce" },
      },
      { key: "q6" },
    ],
  },
  {
    key: "private-permissioned-environments",
    icon: "◧",
    items: [
      {
        key: "q0",
        refs: [
          {
            typeKey: "web",
            labelKey: "financial-institutions-on-solana",
            href: "/solutions/financial-institutions",
          },
          {
            typeKey: "docs",
            labelKey: "private-channels",
            href: "/docs/tools/private-channels",
          },
        ],
        terms: { t0: "private-channels", t1: "token-extensions" },
      },
      {
        key: "q1",
        refs: [
          {
            typeKey: "docs",
            labelKey: "private-channels",
            href: "/docs/tools/private-channels",
          },
          {
            typeKey: "github",
            labelKey: "solana-private-channels",
            href: "https://github.com/solana-foundation/solana-private-channels",
          },
        ],
        terms: { t0: "private-channels" },
      },
    ],
  },
];

export const FAQ_TOTAL = FAQ_TOPICS.reduce(
  (total, topic) => total + topic.items.length,
  0,
);
