// Enterprise FAQ content for /solutions/enterprise/faq — sourced from the
// "Solana Institutional FAQ" content sheet. Answers are structured paragraphs
// of plain-text segments; { term } segments render as glossary tooltips.

export type FaqRef = {
  type: string;
  label: string;
  href?: string;
};

// A paragraph is a list of segments: plain text, or a glossary term
// (display preserves the casing/plural form used in the sentence).
export type FaqSegment = string | { term: string; display?: string };

export type FaqItem = {
  q: string;
  tldr: string;
  a: FaqSegment[][];
  refs?: FaqRef[];
};

export type FaqTopic = {
  topic: string;
  icon: string;
  items: FaqItem[];
};

export const GLOSSARY: Record<string, string> = {
  "Token Extensions":
    "Built-in, issuer-configurable features on Solana tokens (transfer restrictions, account freezing, confidential amounts, and more) enforced at the token level without custom smart contracts.",
  "Confidential Balances":
    "A Solana token feature that encrypts transfer amounts and balances while the transaction itself stays visible on the public network.",
  "Private Channels":
    "A privacy capability being developed by Solana Foundation that limits full transaction visibility to the participants, while still settling to Solana's public network.",
  CCTP: "Circle's Cross-Chain Transfer Protocol. It burns USDC on one network and mints it natively on another, avoiding wrapped assets and bridge custody.",
  DvP: "Delivery-versus-Payment: both legs of a trade (asset and payment) settle together, or not at all.",
  "Token ACL":
    "An access-control layer where new or unverified accounts are blocked by default until cleared, enabling automatic blacklist enforcement.",
  "RPC providers":
    "Infrastructure companies that run the nodes and APIs your applications use to read from and send transactions to the network.",
  "Transfer Hook":
    "A Token Extension that runs custom program logic on every transfer of a token, so checks like compliance rules execute at transfer time.",
  "Permanent Delegate":
    "A Token Extension that gives the issuer standing authority over every account holding the token, enabling regulatory recovery, freezes, and clawback where legally required.",
  "default-frozen":
    "A Token Extensions configuration where new token accounts start frozen and must be explicitly approved (for example after KYC) before they can hold or transfer the token.",
  "durable nonce":
    "A Solana mechanism that keeps a signed transaction valid indefinitely until it is submitted, instead of expiring after about a minute — useful for multi-party approval workflows.",
  "auditor key":
    "A designated decryption key, set when a token is issued, that lets a regulator or compliance team view encrypted transfer amounts without exposing them to the network.",
  allowlist:
    "A pre-approved list of accounts or protocols permitted to hold or interact with a token; everything not on the list is blocked.",
  multisig:
    "An account setup that requires signatures from multiple parties before a transaction can execute.",
  "priority fee":
    "An optional fee that prioritizes a transaction. Priority fees are local: congestion around one application raises fees only for transactions touching it.",
  "liquid staking":
    "Staking through a token that represents the staked position, so the holder keeps a tradable asset while earning validator yield.",
  Mosaic:
    "An open-source toolkit from Solana Foundation with pre-configured templates for issuing stablecoins and tokenized funds on Solana.",
  Alpenglow:
    "Solana's next consensus upgrade, targeting roughly 150ms finality by replacing vote transactions with direct validator votes and aggregate certificates.",
  "Travel Rule":
    "The FATF requirement for financial institutions and VASPs to exchange originator and beneficiary information alongside transfers.",
  VASP: "Virtual Asset Service Provider — a business that custodies or exchanges digital assets on behalf of customers, subject to AML regulation.",
  MEV: "Maximal extractable value — profit extracted by reordering, inserting, or censoring transactions during block production.",
};

export const FAQ_TOPICS: FaqTopic[] = [
  {
    topic: "Fundamentals & Network",
    icon: "◎",
    items: [
      {
        q: "How is Solana different from other blockchains?",
        tldr: "Solana is a single, high-performance global network: transactions confirm in under a second, fees stay at a fraction of a cent even during peak usage, and all activity settles on one shared layer rather than being split across separate layer-2 networks.",
        refs: [
          {
            type: "Web",
            label: "Financial institutions on Solana",
            href: "/solutions/financial-institutions",
          },
        ],
        a: [
          [
            "Solana is a single, high-performance global network: transactions confirm in under a second, fees stay at a fraction of a cent even during peak usage, and all activity settles on one shared layer rather than being split across separate layer-2 networks. For institutions, that combination means one venue for liquidity, predictable costs, and settlement speed comparable to modern payment infrastructure.",
          ],
        ],
      },
      {
        q: "Do fees spike sharply during congestion?",
        tldr: "The base transaction fee is fixed and does not rise with network load.",
        refs: [
          { type: "Docs", label: "Transaction fees", href: "/docs/core/fees" },
        ],
        a: [
          [
            "The base transaction fee is fixed and does not rise with network load. During periods of high demand, users can add an optional ",
            { term: "priority fee" },
            ", but these operate as local fee markets: congestion around one popular application raises priority fees only for transactions touching that application, not for the rest of the network. This keeps costs predictable for payments and settlement flows even when other parts of the network are busy.",
          ],
        ],
      },
    ],
  },
  {
    topic: "Chain Migration",
    icon: "⇄",
    items: [
      {
        q: "We're used to the smart-contract model from EVM-based systems. Solana uses a fundamentally different account-based architecture - what does that difference actually mean for how we should think about our technology strategy?",
        tldr: "Solana separates the logic that runs (programs) from the data it operates on (accounts), and each transaction specifies upfront exactly which accounts it needs to touch.",
        refs: [
          {
            type: "Docs",
            label: "Solana account model",
            href: "/docs/core/accounts",
          },
          {
            type: "Guide",
            label: "EVM to SVM: account model",
            href: "/developers/migrate-to-solana/accounts",
          },
          {
            type: "Guide",
            label: "EVM to SVM: smart contracts",
            href: "/developers/migrate-to-solana/smart-contracts",
          },
        ],
        a: [
          [
            "Solana separates the logic that runs (programs) from the data it operates on (accounts), and each transaction specifies upfront exactly which accounts it needs to touch. Because unrelated transactions don't have to queue behind one another the way they would if everything ran through a single shared pipeline, Solana can process far more transactions per second at a much lower cost.",
          ],
          [
            "For your technology strategy, the practical shift is that your team designs how data is organized and accessed as a first step, rather than building that logic entirely inside a single contract the way a typical Ethereum developer would.",
          ],
        ],
      },
      {
        q: "We already run an EVM-based system or a permissioned ledger. What does Solana offer that would justify adding or switching to it?",
        tldr: "The case for adding Solana is throughput, cost, and unified liquidity at the L1 level: a single network where transactions settle in about a second, with fixed and predictable fees, instead of fragmenting activity across multiple layer-2 networks or maintaining a permissioned system with a limited counterparty pool.",
        refs: [
          {
            type: "Web",
            label: "Financial institutions on Solana",
            href: "/solutions/financial-institutions",
          },
          {
            type: "Guide",
            label: "Chain migration hub",
            href: "/developers/migrate-to-solana",
          },
          {
            type: "Guide",
            label: "Ethereum to Solana migration",
            href: "/developers/migrate-to-solana/ethereum",
          },
        ],
        a: [
          [
            "The case for adding Solana is throughput, cost, and unified liquidity at the L1 level: a single network where transactions settle in about a second, with fixed and predictable fees, instead of fragmenting activity across multiple layer-2 networks or maintaining a permissioned system with a limited counterparty pool.",
          ],
          [
            "This typically works as an addition rather than a replacement - Solana becomes the settlement or distribution layer for a specific product line, running alongside your existing systems rather than instead of them.",
          ],
        ],
      },
      {
        q: "On our current permissioned ledger we use 'privacy groups' (e.g. Hyperledger Besu) so only members of a group can see transaction details. What's the equivalent capability on Solana?",
        tldr: "On Solana, this is handled through Confidential Balances, a built-in compliance-friendly feature that lets a token's transfer amounts and balances be encrypted while the transaction itself stays visible on the public network.",
        refs: [
          {
            type: "Docs",
            label: "Confidential Transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            type: "Docs",
            label: "Private Channels",
            href: "/docs/tools/private-channels",
          },
        ],
        a: [
          [
            "On Solana, this is handled through ",
            { term: "Confidential Balances" },
            ", a built-in compliance-friendly feature that lets a token's transfer amounts and balances be encrypted while the transaction itself stays visible on the public network. That means the right parties can decrypt the details without making those amounts visible to everyone else.",
          ],
          [
            "For privacy needs that go beyond amounts - hiding the transaction from non-participants entirely - Solana Foundation is building ",
            { term: "Private Channels" },
            ", which limit transaction visibility to the participants while still settling back to Solana's public network.",
          ],
        ],
      },
      {
        q: "We rely on established infrastructure partners and managed service providers to operate on EVM today. Would we need to bring on new partners for Solana?",
        tldr: "In most cases you keep your existing relationships - Fireblocks, Copper, Anchorage Digital, and BitGo already support Solana custody, and RPC providers such as Helius, Triton, and QuickNode play the same role your node and data providers do today.",
        refs: [
          {
            type: "Web",
            label: "Financial institutions on Solana",
            href: "/solutions/financial-institutions",
          },
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
          {
            type: "Guide",
            label: "EVM to SVM: client differences",
            href: "/developers/migrate-to-solana/client-differences",
          },
        ],
        a: [
          [
            "In most cases you keep your existing relationships - Fireblocks, Copper, Anchorage Digital, and BitGo already support Solana custody, and ",
            { term: "RPC providers" },
            " such as Helius, Triton, and QuickNode play the same role your node and data providers do today.",
          ],
          [
            "The one thing worth confirming case by case is whether your specific custodian supports the compliance and structuring features your token design requires. Support varies by provider, especially for newer ",
            { term: "Token Extensions" },
            ", and coverage is evolving quickly.",
          ],
        ],
      },
      {
        q: "What are our options for moving assets from Ethereum to Solana, and how do the risks compare across the different approaches?",
        tldr: "There are two broad approaches. Native issuance mechanisms (such as Circle's Cross-Chain Transfer Protocol for USDC) let a stablecoin be redeemed on Ethereum and reissued directly on Solana, so no intermediary holds the funds during the transfer.",
        refs: [
          {
            type: "Web",
            label: "Circle Cross-Chain Transfer Protocol",
            href: "https://www.circle.com/cross-chain-transfer-protocol",
          },
          {
            type: "Guide",
            label: "Ethereum to Solana migration",
            href: "/developers/migrate-to-solana/ethereum",
          },
        ],
        a: [
          [
            "There are two broad approaches. Native issuance mechanisms (such as Circle's Cross-Chain Transfer Protocol for USDC) let a stablecoin be redeemed on Ethereum and reissued directly on Solana, so no intermediary holds the funds during the transfer. General-purpose bridges (such as Wormhole, LayerZero, or deBridge) instead lock the asset on one network and issue a representative version on the other, which introduces its own counterparty and security considerations that vary by provider.",
          ],
          [
            "Where a native issuance path is available, it is generally preferred because it removes a layer of intermediary risk; for assets that require a bridge, the decision comes down to the specific provider's security model, track record, and whether that risk profile fits the use case.",
          ],
        ],
      },
    ],
  },
  {
    topic: "Tokens & Stablecoins",
    icon: "◉",
    items: [
      {
        q: "What is the difference between the original SPL Token standard and Token Extensions (Token-2022)?",
        tldr: "SPL Token is Solana's original token standard - simple, widely supported, and used by most existing assets.",
        refs: [
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
          { type: "Docs", label: "Tokens on Solana", href: "/docs/tokens" },
          {
            type: "News",
            label: "Token Extensions on Solana",
            href: "/news/token-extensions-on-solana",
          },
        ],
        a: [
          [
            "SPL Token is Solana's original token standard - simple, widely supported, and used by most existing assets. ",
            { term: "Token Extensions" },
            " (also called Token-2022) is a newer, backward-compatible standard built in collaboration with large regulated institutions.",
          ],
          [
            "It adds configurable, native features at the token level: transfer restrictions, freeze-by-default accounts, confidential transfer amounts, issuer recovery authority, metadata, and more. For institutional issuance - stablecoins, tokenized funds, regulated assets - Token Extensions is the standard to build on.",
          ],
        ],
      },
      {
        q: "Are Token Extensions tokens supported by all exchanges and wallets?",
        tldr: "Major wallets, exchanges, and custodians support Token Extensions, and production stablecoins such as PayPal's PYUSD already use them at scale.",
        refs: [
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
        ],
        a: [
          [
            "Major wallets, exchanges, and custodians support ",
            { term: "Token Extensions" },
            ", and production stablecoins such as PayPal's PYUSD already use them at scale. Support for individual extensions still varies by provider, however - especially newer ones like confidential transfers. The practical guidance is to confirm support for the specific extensions in your token design with your target custodians, exchanges, and wallet providers early in planning.",
          ],
        ],
      },
      {
        q: "Can extensions be added to an existing token later?",
        tldr: "Generally no - token-level extensions must be configured when the token is first issued, which is why designing the full feature set upfront matters.",
        refs: [
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
          { type: "Docs", label: "Tokens on Solana", href: "/docs/tokens" },
        ],
        a: [
          [
            "Generally no - token-level extensions must be configured when the token is first issued, which is why designing the full feature set upfront matters. If an existing token needs new extensions, the usual path is issuing a new token and migrating holders. This is a key reason institutions plan compliance requirements (freeze authority, transfer restrictions, confidentiality, recovery) before launch rather than retrofitting them.",
          ],
        ],
      },
      {
        q: "Should we issue our own stablecoin or use an existing one like USDC?",
        tldr: "Using an established stablecoin (USDC, USDT, PYUSD, EURC) is the fastest path for payments and settlement - the liquidity, integrations, and regulatory footprint already exist.",
        refs: [
          {
            type: "Web",
            label: "Stablecoins on Solana",
            href: "/solutions/stablecoins",
          },
          {
            type: "GitHub",
            label: "Mosaic toolkit",
            href: "https://github.com/solana-foundation/mosaic",
          },
        ],
        a: [
          [
            "Using an established stablecoin (USDC, USDT, PYUSD, EURC) is the fastest path for payments and settlement - the liquidity, integrations, and regulatory footprint already exist. Issuing your own makes sense when you want control over the reserve economics, branding, and distribution, and are prepared for the regulatory and operational obligations of being an issuer.",
          ],
          [
            "Institutions including Paxos, Fiserv, and the USDG consortium have issued regulated stablecoins on Solana using ",
            { term: "Token Extensions" },
            ", and open-source tooling like ",
            { term: "Mosaic" },
            " significantly reduces the build effort.",
          ],
        ],
      },
      {
        q: "Can a regulated stablecoin be issued on Solana?",
        tldr: "Yes - Solana is already the issuance venue for several regulated stablecoins.",
        refs: [
          {
            type: "Web",
            label: "Stablecoins on Solana",
            href: "/solutions/stablecoins",
          },
          {
            type: "News",
            label: "Token Extensions on Solana",
            href: "/news/token-extensions-on-solana",
          },
        ],
        a: [
          [
            "Yes - Solana is already the issuance venue for several regulated stablecoins. PayPal's PYUSD (issued by Paxos under NYDFS oversight), Fiserv's FIUSD, and the USDG consortium stablecoin all use ",
            { term: "Token Extensions" },
            " for the compliance controls regulators expect: freeze-and-seize authority, transfer restrictions, and issuer-level recovery.",
          ],
          [
            "These controls are native to the token standard rather than custom-built, which shortens both the engineering and the regulatory review path.",
          ],
        ],
      },
    ],
  },
  {
    topic: "Compliance & Regulated Tokens",
    icon: "⬡",
    items: [
      {
        q: "We restrict certain assets to KYC-approved investors only. Can we enforce that same restriction for a regulated token on Solana?",
        tldr: "Yes, Token Extensions let you set accounts to frozen by default, so only holders explicitly approved by your compliance process can hold or transact the token, with additional custom transfer-level checks available on top for more complex eligibility rules.",
        refs: [
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
        ],
        a: [
          [
            "Yes, ",
            { term: "Token Extensions" },
            " let you set accounts to frozen by default, so only holders explicitly approved by your compliance process can hold or transact the token, with additional custom transfer-level checks available on top for more complex eligibility rules.",
          ],
        ],
      },
      {
        q: "We need to freeze funds reactively if a sanctioned or blacklisted address shows up in our flows. Is that possible on Solana?",
        tldr: "Yes, Token Extensions give issuers built-in controls to freeze a specific account and, where legally required, recover tokens from that account - without pausing the broader token or disrupting the rest of the network.",
        refs: [
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
          {
            type: "GitHub",
            label: "Mosaic toolkit",
            href: "https://github.com/solana-foundation/mosaic",
          },
        ],
        a: [
          [
            "Yes, ",
            { term: "Token Extensions" },
            " give issuers built-in controls to freeze a specific account and, where legally required, recover tokens from that account - without pausing the broader token or disrupting the rest of the network.",
          ],
          [
            "If the goal is continuous blacklist enforcement rather than a manual action each time, ",
            { term: "Token ACL" },
            " blocks new or unverified accounts by default until they've been cleared, so an address that matches a blacklist stays blocked automatically rather than the issuer having to spot and freeze it by hand.",
          ],
        ],
      },
      {
        q: "Can transfer logic be fully customized - for example, running our own compliance checks on every transfer?",
        tldr: "Yes, the Transfer Hook extension routes every transfer of a token through custom logic the issuer defines before it can complete.",
        refs: [
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
        ],
        a: [
          [
            "Yes, the ",
            { term: "Transfer Hook" },
            " extension routes every transfer of a token through custom logic the issuer defines before it can complete. That logic can check KYC status, jurisdiction rules, holding limits, or any other eligibility condition, and reject transfers that don't pass. Combined with ",
            { term: "default-frozen" },
            " accounts and ",
            { term: "allowlist", display: "allowlists" },
            ", this gives issuers effectively full control over who can hold and move a regulated token.",
          ],
        ],
      },
      {
        q: "When should we use Token ACL, and when should we use a Transfer Hook?",
        tldr: "Use Token ACL when your requirement is list-based access control: defining who can hold or receive the token through an allowlist (e.g. KYC-approved accounts only) or a blocklist (e.g. sanctioned addresses blocked by default).",
        refs: [
          {
            type: "GitHub",
            label: "Mosaic toolkit",
            href: "https://github.com/solana-foundation/mosaic",
          },
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
        ],
        a: [
          [
            "Use ",
            { term: "Token ACL" },
            " when your requirement is list-based access control: defining who can hold or receive the token through an ",
            { term: "allowlist" },
            " (e.g. KYC-approved accounts only) or a blocklist (e.g. sanctioned addresses blocked by default). It's a standardized mechanism, so it requires no custom code, is simpler to audit and operate, and is easier for custodians and wallets to support.",
          ],
          [
            "Use a ",
            { term: "Transfer Hook" },
            " when the rules go beyond list membership and depend on the conditions of each transfer - jurisdiction checks, holding limits, transfer windows, or logic that references external state. That flexibility comes with more engineering, its own audit scope, and the need to confirm support with your integration partners. The two are complementary: many regulated token designs use Token ACL as the baseline access gate and add a Transfer Hook only when genuinely conditional logic is required.",
          ],
        ],
      },
      {
        q: "How do we build ERC-3643-style regulated tokens on Solana?",
        tldr: "The same permissioned-token model maps directly onto Token Extensions: default-frozen accounts provide the identity-gated allowlist, Transfer Hooks run eligibility and compliance logic on every transfer, Permanent Delegate provides the recovery and enforcement authority, and on-chain metadata carries the asset information.",
        refs: [
          {
            type: "GitHub",
            label: "Mosaic toolkit",
            href: "https://github.com/solana-foundation/mosaic",
          },
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
        ],
        a: [
          [
            "The same permissioned-token model maps directly onto ",
            { term: "Token Extensions" },
            ": ",
            { term: "default-frozen" },
            " accounts provide the identity-gated ",
            { term: "allowlist" },
            ", ",
            { term: "Transfer Hook", display: "Transfer Hooks" },
            " run eligibility and compliance logic on every transfer, ",
            { term: "Permanent Delegate" },
            " provides the recovery and enforcement authority, and on-chain metadata carries the asset information.",
          ],
          [
            "Solana Foundation's open-source ",
            { term: "Mosaic" },
            " toolkit packages these into ready-made templates for regulated assets, so teams start from a working configuration rather than assembling the pieces from scratch.",
          ],
        ],
      },
      {
        q: "We operate across multiple jurisdictions under separate legal frameworks. Can a single structure on Solana satisfy multiple regulatory frameworks?",
        tldr: "Technically, a single token can support eligibility rules for multiple jurisdictions within the same on-chain structure.",
        a: [
          [
            "Technically, a single token can support eligibility rules for multiple jurisdictions within the same on-chain structure. Whether that is enough to avoid separate legal wrappers in each jurisdiction is a legal structuring question, not a technical limitation.",
          ],
        ],
      },
    ],
  },
  {
    topic: "Privacy & Confidentiality",
    icon: "◐",
    items: [
      {
        q: "What are Solana's Confidential Balances, how do they compare to Private Channels, and when would we use one versus the other?",
        tldr: "Confidential Balances are designed for cases where you want to keep amounts and balances private while still using Solana's public ledger.",
        refs: [
          {
            type: "Docs",
            label: "Confidential Transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            type: "Docs",
            label: "Private Channels",
            href: "/docs/tools/private-channels",
          },
        ],
        a: [
          [
            { term: "Confidential Balances" },
            " are designed for cases where you want to keep amounts and balances private while still using Solana's public ledger. The addresses remain visible, but the amounts are encrypted, and an ",
            { term: "auditor key" },
            " provides a regulator or compliance team with decryption access when needed.",
          ],
          [
            { term: "Private Channels" },
            " are intended for situations where the transaction details - including the logic and counterparties - need to be visible only to the participants, such as bespoke bilateral arrangements. In general: use Confidential Balances when amount privacy is enough and you still want access to the broader public network; use Private Channels when the transaction itself needs to stay private between the parties involved.",
          ],
        ],
      },
      {
        q: "Does using Solana's privacy features create compliance issues - specifically around Travel Rule obligations and blockchain analytics?",
        tldr: "No - Confidential Balances hide amounts, not addresses, so the transaction stays fully visible to the blockchain analytics tools (such as Chainalysis or TRM, among others) that compliance teams already use.",
        refs: [
          {
            type: "Docs",
            label: "Confidential Transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
        ],
        a: [
          [
            "No - ",
            { term: "Confidential Balances" },
            " hide amounts, not addresses, so the transaction stays fully visible to the blockchain analytics tools (such as Chainalysis or TRM, among others) that compliance teams already use.",
          ],
          [
            { term: "Travel Rule" },
            " obligations are handled through your existing ",
            { term: "VASP" },
            " messaging providers independent of what's encrypted on-chain, so that workflow doesn't change. The built-in ",
            { term: "auditor key" },
            " lets your compliance team decrypt transaction amounts when required, without making those amounts visible to the broader network.",
          ],
        ],
      },
      {
        q: "We're currently using Canton, but our permissioned instance keeps liquidity limited to a small pool of counterparties. How is this solved on Solana?",
        tldr: "Solana operates as a single global network, rather than a collection of separate permissioned instances, so liquidity is not fragmented by design as it is on Canton.",
        refs: [
          {
            type: "Docs",
            label: "Confidential Transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            type: "Web",
            label: "Financial institutions on Solana",
            href: "/solutions/financial-institutions",
          },
        ],
        a: [
          [
            "Solana operates as a single global network, rather than a collection of separate permissioned instances, so liquidity is not fragmented by design as it is on Canton. ",
            { term: "Confidential Balances" },
            " give you the amount-privacy benefit you're used to from Canton's privacy groups without needing to isolate the asset in a separate environment. The asset can stay confidential while still being reachable by the network's broader liquidity.",
          ],
        ],
      },
      {
        q: "We need privacy that goes beyond hiding transaction amounts - we need to hide the existence of the asset itself. Can Solana support that?",
        tldr: "Confidential Balances hide transfer amounts, while the token itself remains visible on-chain and the owner's identity remains pseudonymous.",
        refs: [
          {
            type: "Docs",
            label: "Confidential Transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
        ],
        a: [
          [
            { term: "Confidential Balances" },
            " hide transfer amounts, while the token itself remains visible on-chain and the owner's identity remains pseudonymous. For use cases that require privacy around the existence of the asset itself, confidential computing layers are being developed to support deeper privacy models over time.",
          ],
        ],
      },
      {
        q: "When a private asset changes hands, we need the new owner to automatically gain visibility into it while everyone else stays excluded. Can Solana handle that automatically?",
        tldr: "Yes, this is inherent to how the encryption works. Confidential transfers are encrypted directly to the recipient's own key, so once the asset is transferred, the new owner can decrypt it automatically using keys they already hold.",
        refs: [
          {
            type: "Docs",
            label: "Confidential Transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            type: "GitHub",
            label: "Confidential Balances sample",
            href: "https://github.com/solana-developers/Confidential-Balances-Sample",
          },
        ],
        a: [
          [
            "Yes, this is inherent to how the encryption works. Confidential transfers are encrypted directly to the recipient's own key, so once the asset is transferred, the new owner can decrypt it automatically using keys they already hold. There is no separate handoff step required. Everyone else on the network can see that a transfer occurred but not the amount.",
          ],
        ],
      },
      {
        q: "We need a way for regulators or auditors to inspect private transactions when required, without exposing them to everyone else. Is there a mechanism for that?",
        tldr: "Yes, the Confidential Transfer extension supports a designated auditor key, set at the moment the token is issued.",
        refs: [
          {
            type: "Docs",
            label: "Confidential Transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            type: "Docs",
            label: "Confidential Balances (SPL)",
            href: "https://www.solana-program.com/docs/confidential-balances",
          },
        ],
        a: [
          [
            "Yes, the Confidential Transfer extension supports a designated ",
            { term: "auditor key" },
            ", set at the moment the token is issued. That key can be held by a regulator, auditor, or internal compliance function, giving them access to decrypt transfer amounts when required, without making those amounts visible to the broader network. This applies automatically to every subsequent transfer of that token.",
          ],
        ],
      },
      {
        q: "We're used to Canton splitting a transaction so each counterparty only sees the parts they're actually party to. Can we get that same visibility model on Solana?",
        tldr: "Instead of automatically splitting a single transaction into separate views for each counterparty, Solana gives you either public visibility or visibility encrypted to specific parties.",
        refs: [
          {
            type: "Docs",
            label: "Confidential Transfer",
            href: "/docs/tokens/extensions/confidential-transfer",
          },
          {
            type: "Docs",
            label: "Private Channels",
            href: "/docs/tools/private-channels",
          },
        ],
        a: [
          [
            "Instead of automatically splitting a single transaction into separate views for each counterparty, Solana gives you either public visibility or visibility encrypted to specific parties. In practice, combining ",
            { term: "Confidential Balances" },
            " and ",
            { term: "Private Channels" },
            " provides a similar outcome: transaction amounts can be encrypted, and broader transaction visibility can be limited to the participants.",
          ],
          [
            "The mechanism is different from Canton's native view-splitting, but it supports the same core requirement - keeping sensitive transaction details visible only to the parties authorized to access them.",
          ],
        ],
      },
    ],
  },
  {
    topic: "Tokenized Funds & RWA",
    icon: "◈",
    items: [
      {
        q: "We want to tokenize a money market fund (or a bond) on Solana. Is there existing infrastructure to build on, or would this need to be custom-built?",
        tldr: "Solana Foundation maintains Mosaic, an open-source toolkit with pre-configured templates for stablecoins and tokenized funds, and Token Extensions provide compliance primitives natively at the token level.",
        refs: [
          {
            type: "GitHub",
            label: "Mosaic toolkit",
            href: "https://github.com/solana-foundation/mosaic",
          },
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
          {
            type: "News",
            label: "Institutional real-world assets on Solana",
            href: "/news/overview-of-institutional-real-world-assets-on-solana",
          },
        ],
        a: [
          [
            "Solana Foundation maintains ",
            { term: "Mosaic" },
            ", an open-source toolkit with pre-configured templates for stablecoins and tokenized funds, and ",
            { term: "Token Extensions" },
            " provide compliance primitives natively at the token level.",
          ],
          [
            "Issuers such as Franklin Templeton, Superstate, and Ondo have already built and operated tokenized fund structures on Solana. What usually needs to be customized is the specific fund mechanics; the underlying compliance and settlement infrastructure is already in place.",
          ],
        ],
      },
      {
        q: "We run our transfer agent function today - subscriptions, redemptions, investor recordkeeping. Can we move that function on-chain?",
        tldr: "Yes, Token Extensions support many of the controls a transfer agent would normally manage - including allowlists, freezing non-compliant accounts, and routing transfers through custom compliance logic.",
        refs: [
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
        ],
        a: [
          [
            "Yes, ",
            { term: "Token Extensions" },
            " support many of the controls a transfer agent would normally manage - including ",
            { term: "allowlist", display: "allowlists" },
            ", freezing non-compliant accounts, and routing transfers through custom compliance logic. This model allows core transfer agent functions to live directly in the token, while the holder registry is maintained on-chain and updated automatically as transfers settle.",
          ],
        ],
      },
      {
        q: "If we tokenize a fund, can investors still subscribe and redeem through existing distribution networks?",
        tldr: "Yes, you can keep the existing subscription and redemption experience in place.",
        a: [
          [
            "Yes, you can keep the existing subscription and redemption experience in place. Investors can continue working through the distributors they already use, while the token settlement happens on-chain in the background through API integrations. That avoids creating a separate process investors need to learn or adopt.",
          ],
        ],
      },
      {
        q: "We need vault structures that support DeFi-style composability (e.g. using assets as collateral) while still meeting the compliance controls our regulator requires. How do we build that?",
        tldr: "This is achievable by combining Token Extensions' compliance controls with a permissioned allowlist of approved protocol accounts.",
        refs: [
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
          {
            type: "News",
            label: "Institutional real-world assets on Solana",
            href: "/news/overview-of-institutional-real-world-assets-on-solana",
          },
        ],
        a: [
          [
            "This is achievable by combining ",
            { term: "Token Extensions" },
            "' compliance controls with a permissioned ",
            { term: "allowlist" },
            " of approved protocol accounts. Instead of making the asset available across fully permissionless DeFi, you define which protocols are allowed to interact with it.",
          ],
          [
            "Fund shares can still be used as collateral in vetted protocols, while remaining restricted everywhere else. Rather than building the vault logic from scratch, reference vault implementations in the ecosystem demonstrate the pattern in practice.",
          ],
        ],
      },
      {
        q: "Our fund structures need things like open- vs. closed-end structures, yield distribution vs. NAV accrual, and transfer restrictions on who can hold shares. Can a vault on Solana support these mechanics?",
        tldr: "Yes, these mechanics are program logic layered on top of Token Extensions.",
        refs: [
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
        ],
        a: [
          [
            "Yes, these mechanics are program logic layered on top of ",
            { term: "Token Extensions" },
            ". Open- vs. closed-end behavior, accrual vs. distribution schedules, and holder eligibility are all supported through vault program logic combined with the transfer and freeze primitives Token Extensions already provide.",
          ],
        ],
      },
      {
        q: "If we pledge tokenized fund shares as collateral in a Solana protocol and that protocol goes bankrupt, how do we get the same protection we'd have in traditional collateral arrangements?",
        tldr: "On-chain vaults can provide strong asset segregation by holding collateral in a program-controlled account, rather than pooling it with the protocol's own assets.",
        a: [
          [
            "On-chain vaults can provide strong asset segregation by holding collateral in a program-controlled account, rather than pooling it with the protocol's own assets. Whether that segregation also gives you bankruptcy-remote legal protection depends on how the arrangement is structured under the relevant insolvency regime.",
          ],
        ],
      },
      {
        q: "We currently rely on sub-custody arrangements: a licensed custodian pre-approves a sub-account, and the law treats assets held in it as being in escrow. How can this be done on Solana?",
        tldr: "The core technical pattern is a program-controlled account where movement of the assets requires authorization from your licensed custodian.",
        a: [
          [
            "The core technical pattern is a program-controlled account where movement of the assets requires authorization from your licensed custodian. That gives you similar pre-approval and segregation mechanics to the sub-custody setup you use today. Whether that structure receives the same legal treatment as escrow depends on how it is documented and treated under the relevant legal framework.",
          ],
        ],
      },
      {
        q: "Can tokenized assets on Solana be used as collateral in other protocols, and what determines whether an asset is composable versus isolated?",
        tldr: "Yes - Whether a tokenized asset is composable depends on two things: whether it uses standard token interfaces that other protocols can integrate with, and whether those protocols are whitelisted.",
        refs: [
          {
            type: "News",
            label: "Institutional real-world assets on Solana",
            href: "/news/overview-of-institutional-real-world-assets-on-solana",
          },
        ],
        a: [
          [
            "Yes - Whether a tokenized asset is composable depends on two things: whether it uses standard token interfaces that other protocols can integrate with, and whether those protocols are whitelisted. A regulated asset doesn't have to choose between compliance and composability - you can keep the asset restricted to a curated set of approved protocols, while still allowing it to be used as collateral within that controlled environment.",
          ],
        ],
      },
      {
        q: "We already have distribution and liquidity for our fund through traditional channels. How do we get that same liquidity on-chain?",
        tldr: "On-chain liquidity is built in parallel with your existing distribution, not as a replacement.",
        refs: [
          {
            type: "News",
            label: "Institutional real-world assets on Solana",
            href: "/news/overview-of-institutional-real-world-assets-on-solana",
          },
        ],
        a: [
          [
            "On-chain liquidity is built in parallel with your existing distribution, not as a replacement. Your existing distribution continues to serve investors already using it, while the on-chain venues create an additional path for liquidity.",
          ],
          [
            "That can include DEX or AMM listings, RWA-focused liquidity venues, and relationships with market makers active in tokenized assets. Over time, this gives the fund access to a broader pool of on-chain counterparties without disrupting the traditional distribution model.",
          ],
        ],
      },
    ],
  },
  {
    topic: "Payments & Settlement",
    icon: "⚡",
    items: [
      {
        q: "We rely on DvP settlement to eliminate settlement risk. Can both legs of a trade settle atomically on Solana?",
        tldr: "Yes, this is native to how Solana transactions work. Both legs of a trade can be bundled together as steps within one transaction, and that transaction either completes in full or does not execute at all.",
        refs: [
          {
            type: "Web",
            label: "Financial institutions on Solana",
            href: "/solutions/financial-institutions",
          },
        ],
        a: [
          [
            "Yes, this is native to how Solana transactions work. Both legs of a trade can be bundled together as steps within one transaction, and that transaction either completes in full or does not execute at all. That means there is no interim state where one side of the trade has settled and the other has not.",
          ],
        ],
      },
      {
        q: "We handle cross-border payments with FX conversion through our existing rails. Can we do the same with stablecoins on Solana, and what would that look like in practice?",
        tldr: "Yes, fiat converts to a stablecoin on the sending side, moves across Solana in seconds, and converts to the destination currency on the receiving side.",
        refs: [
          {
            type: "Web",
            label: "Stablecoins on Solana",
            href: "/solutions/stablecoins",
          },
          {
            type: "Web",
            label: "Financial institutions on Solana",
            href: "/solutions/financial-institutions",
          },
        ],
        a: [
          [
            "Yes, fiat converts to a stablecoin on the sending side, moves across Solana in seconds, and converts to the destination currency on the receiving side. This replaces a multi-day correspondent banking process with same-day (or same-minute) settlement.",
          ],
        ],
      },
      {
        q: "What stablecoin rails are available on Solana for institutional use?",
        tldr: "USDC, USDT, PYUSD, and EURC are all available as institutional stablecoin rails on Solana, each issued by a different provider.",
        refs: [
          {
            type: "Web",
            label: "Stablecoins on Solana",
            href: "/solutions/stablecoins",
          },
          {
            type: "Web",
            label: "Circle Cross-Chain Transfer Protocol",
            href: "https://www.circle.com/cross-chain-transfer-protocol",
          },
        ],
        a: [
          [
            "USDC, USDT, PYUSD, and EURC are all available as institutional stablecoin rails on Solana, each issued by a different provider. For USDC specifically, Circle's ",
            { term: "CCTP" },
            " allows native cross-chain movement without relying on wrapped assets. A growing set of regional and yield-bearing stablecoins are also live on the network, expanding the options available for specific currency exposures.",
          ],
        ],
      },
      {
        q: "We need our back-office systems to be notified automatically once settlement is complete. How can that be done?",
        tldr: "You can connect to a real-time feed of account or transaction activity, or use a webhook-based indexing service (providers such as Helius or Triton) to push settlement events into your back-office systems the moment they're confirmed, giving you the same automated reconciliation trigger you'd expect from a modern payments rail.",
        a: [
          [
            "You can connect to a real-time feed of account or transaction activity, or use a webhook-based indexing service (providers such as Helius or Triton) to push settlement events into your back-office systems the moment they're confirmed, giving you the same automated reconciliation trigger you'd expect from a modern payments rail.",
          ],
        ],
      },
      {
        q: "Does Solana support recurring payments and subscriptions, letting a merchant collect from many customers in bulk?",
        tldr: "Yes, Solana can support recurring payments through delegated authority.",
        a: [
          [
            "Yes, Solana can support recurring payments through delegated authority. The customer gives the merchant a scoped, revocable approval to collect a defined amount on a set schedule, and payment providers can package that flow into subscription tooling for merchants.",
          ],
        ],
      },
      {
        q: "Can our end users transact using only stablecoins, without needing to separately hold SOL to cover transaction fees?",
        tldr: "Yes, a merchant or app can run a fee-payer service that covers the small transaction cost on the user's behalf.",
        a: [
          [
            "Yes, a merchant or app can run a fee-payer service that covers the small transaction cost on the user's behalf. Several providers offer this as a managed service, so end users can transact with the stablecoin directly without needing to acquire or manage SOL separately.",
          ],
        ],
      },
      {
        q: "We rely on clear finality timing to manage settlement risk. When is a transaction on Solana considered final?",
        tldr: "A Solana transaction typically reaches 'confirmed' status in about a second and full, irreversible finality within roughly 12-13 seconds, compared to legacy settlement windows measured in days.",
        refs: [
          {
            type: "Web",
            label: "Financial institutions on Solana",
            href: "/solutions/financial-institutions",
          },
        ],
        a: [
          [
            "A Solana transaction typically reaches 'confirmed' status in about a second and full, irreversible finality within roughly 12-13 seconds, compared to legacy settlement windows measured in days. Solana's ",
            { term: "Alpenglow" },
            " upgrade is designed to bring full finality down closer to sub-second once it activates on mainnet.",
          ],
        ],
      },
      {
        q: "Can a mistakenly sent payment or token be reversed?",
        tldr: "Base-layer transfers on Solana are final once confirmed - there is no network-level reversal, which is the same property that makes settlement trustworthy.",
        refs: [
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
        ],
        a: [
          [
            "Base-layer transfers on Solana are final once confirmed - there is no network-level reversal, which is the same property that makes settlement trustworthy.",
          ],
          [
            "For issuer-controlled tokens, extensions like ",
            { term: "Permanent Delegate" },
            " allow the issuer to recover funds in defined situations (for example, court orders or transfers to frozen accounts). In practice, institutions manage this risk operationally: address ",
            { term: "allowlist", display: "allowlists" },
            ", test transfers, and confirmation workflows before large movements.",
          ],
        ],
      },
    ],
  },
  {
    topic: "Custody & Wallets",
    icon: "▣",
    items: [
      {
        q: "Which custody providers support Solana and Token Extensions today?",
        tldr: "Fireblocks, Copper, Anchorage Digital, BitGo, and other major providers all support Solana custody.",
        refs: [
          {
            type: "Web",
            label: "Financial institutions on Solana",
            href: "/solutions/financial-institutions",
          },
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
        ],
        a: [
          [
            "Fireblocks, Copper, Anchorage Digital, BitGo, and other major providers all support Solana custody. Broadly supported extensions include ",
            { term: "default-frozen" },
            " accounts for compliance gating and issuer override/clawback authority. Newer extensions such as encrypted balance transfers are supported more selectively and are often evaluated case by case, so it's worth confirming coverage for your specific token design with each provider.",
          ],
        ],
      },
      {
        q: "Our custody providers require multi-party approval to sign a transaction, which can take several minutes. Solana transactions must be signed within a short window. How do we reconcile the two?",
        tldr: "A specific Solana transaction feature - durable nonces - solves this directly: instead of tying your transaction to a reference that expires within about a minute, the transaction stays valid indefinitely until it's actually submitted, decoupling your signing timeline from the network's default expiry window.",
        refs: [
          {
            type: "Docs",
            label: "Durable nonces",
            href: "/docs/core/transactions/durable-nonces",
          },
          {
            type: "Guide",
            label: "Introduction to durable nonces",
            href: "/developers/guides/advanced/introduction-to-durable-nonces",
          },
        ],
        a: [
          [
            "A specific Solana transaction feature - ",
            { term: "durable nonce", display: "durable nonces" },
            " - solves this directly: instead of tying your transaction to a reference that expires within about a minute, the transaction stays valid indefinitely until it's actually submitted, decoupling your signing timeline from the network's default expiry window. This is the standard pattern for cold storage, air-gapped signing, and multi-party approval workflows.",
          ],
        ],
      },
      {
        q: "Can multisig be used on Solana?",
        tldr: "Yes - both native multisig on token accounts and full-featured multisig programs (Squads being the most widely used) are available.",
        refs: [
          {
            type: "Guide",
            label: "Introduction to durable nonces",
            href: "/developers/guides/advanced/introduction-to-durable-nonces",
          },
        ],
        a: [
          [
            "Yes - both native ",
            { term: "multisig" },
            " on token accounts and full-featured multisig programs (Squads being the most widely used) are available. Institutional setups typically combine role-based approval policies, spending limits, and time locks, and pair multisig with ",
            { term: "durable nonce", display: "durable nonces" },
            " so approval workflows aren't constrained by transaction expiry windows.",
          ],
        ],
      },
    ],
  },
  {
    topic: "Bridging & Interoperability",
    icon: "⇌",
    items: [
      {
        q: "How do we move USDC between Solana and other chains?",
        tldr: "Circle's Cross-Chain Transfer Protocol (CCTP) is the native path: USDC is burned on the source chain and reissued on the destination chain by Circle itself, so there's no wrapped version and no bridge holding the funds in between.",
        refs: [
          {
            type: "Web",
            label: "Circle Cross-Chain Transfer Protocol",
            href: "https://www.circle.com/cross-chain-transfer-protocol",
          },
          {
            type: "Docs",
            label: "Circle CCTP documentation",
            href: "https://developers.circle.com/cctp",
          },
        ],
        a: [
          [
            "Circle's Cross-Chain Transfer Protocol (",
            { term: "CCTP" },
            ") is the native path: USDC is burned on the source chain and reissued on the destination chain by Circle itself, so there's no wrapped version and no bridge holding the funds in between.",
          ],
          [
            "Transfers settle in seconds to minutes depending on the mode. Because it's issuer-native, this is the standard institutional route for USDC, with general-purpose bridges reserved for assets that don't have a native issuance path.",
          ],
        ],
      },
      {
        q: "How should an institution evaluate and choose a bridge?",
        tldr: "First check whether a native issuance path exists for the asset - if so, use it and avoid bridge risk entirely.",
        refs: [
          {
            type: "Web",
            label: "Circle Cross-Chain Transfer Protocol",
            href: "https://www.circle.com/cross-chain-transfer-protocol",
          },
        ],
        a: [
          [
            "First check whether a native issuance path exists for the asset - if so, use it and avoid bridge risk entirely. Where a bridge is unavoidable, evaluate the provider's security model (who validates transfers and what it would take to compromise them), audit history and track record, the depth of liquidity in the bridged asset, and whether the provider's risk profile fits the size and duration of your exposure.",
          ],
          [
            "Bridges have historically been a major source of losses in the industry, so this diligence is worth treating like counterparty risk assessment.",
          ],
        ],
      },
    ],
  },
  {
    topic: "Staking & Yield",
    icon: "✦",
    items: [
      {
        q: "How does staking work on Solana, and what should institutions look at?",
        tldr: "Solana is a proof-of-stake network (SOL is not mined), so holders earn yield by delegating SOL to validators who secure the network, with rewards paid from network issuance and fees.",
        refs: [{ type: "Web", label: "Staking on Solana", href: "/staking" }],
        a: [
          [
            "Solana is a proof-of-stake network (SOL is not mined), so holders earn yield by delegating SOL to validators who secure the network, with rewards paid from network issuance and fees. Delegated SOL stays under the holder's control (the validator never takes custody), and unstaking takes a short waiting period of roughly two to three days.",
          ],
          [
            "Institutions typically look at custodian support for staking, validator selection and performance, and whether to use ",
            { term: "liquid staking" },
            " tokens that keep the position transferable while it earns.",
          ],
        ],
      },
      {
        q: "What yield-generating mechanisms exist on Solana and how do their risk profiles differ?",
        tldr: "The main yield opportunities fall into three broad categories.",
        refs: [
          { type: "Web", label: "Staking on Solana", href: "/staking" },
          {
            type: "News",
            label: "Institutional real-world assets on Solana",
            href: "/news/overview-of-institutional-real-world-assets-on-solana",
          },
        ],
        a: [
          [
            "The main yield opportunities fall into three broad categories. ",
            { term: "liquid staking", display: "Liquid staking" },
            ", where yield comes from network validation - the main consideration is liquidity, i.e. how easily you can enter or exit the position. On-chain lending markets, where yield comes from borrower demand - the key risks are smart-contract risk and liquidation risk.",
          ],
          [
            "And tokenized RWA yield, such as short-duration treasuries, where yield comes from the underlying real-world asset - the main risks are issuer and counterparty risk. Each option has a different risk profile, so the right approach depends on the exposure you're comfortable taking.",
          ],
        ],
      },
    ],
  },
  {
    topic: "Infrastructure & Operations",
    icon: "⚙",
    items: [
      {
        q: "How do we get a Solana program audited before deploying to mainnet, and which audit teams specialize in Solana?",
        tldr: "The audit process is broadly similar to what you use for EVM programs: define the scope, run static analysis, do a manual review, and use fuzzing where appropriate.",
        a: [
          [
            "The audit process is broadly similar to what you use for EVM programs: define the scope, run static analysis, do a manual review, and use fuzzing where appropriate. Teams such as OtterSec, Cantina, Sec3, Zellic, and Sherlock have strong Solana experience and have worked on production-grade programs in the ecosystem.",
          ],
        ],
      },
      {
        q: "Do we need to run our own nodes, or how do we choose an RPC provider?",
        tldr: "Most institutions start with managed RPC providers - Helius, Triton, and QuickNode are the established options - which handle node operations, real-time data feeds, webhooks, and historical queries as a service.",
        a: [
          [
            "Most institutions start with managed ",
            { term: "RPC providers" },
            " - Helius, Triton, and QuickNode are the established options - which handle node operations, real-time data feeds, webhooks, and historical queries as a service.",
          ],
          [
            "Evaluate providers on latency in your regions, data and indexing capabilities, SLA terms, and support. Running your own infrastructure only becomes worth considering at significant scale or under specific regulatory requirements, and even then usually alongside managed providers rather than instead of them.",
          ],
        ],
      },
      {
        q: "Can a program be upgraded after deployment, and what does that mean for governance?",
        tldr: "Yes - Solana programs are upgradeable by default through a designated upgrade authority, and upgrading does not erase existing data.",
        a: [
          [
            "Yes - Solana programs are upgradeable by default through a designated upgrade authority, and upgrading does not erase existing data. For institutional deployments, that authority is typically held by a ",
            { term: "multisig" },
            " with defined approval processes, giving you a controlled change-management path. When immutability is the requirement, the upgrade authority can be permanently removed, making the program unchangeable.",
          ],
        ],
      },
      {
        q: "Can a pause or circuit-breaker capability be built into our token or program?",
        tldr: "Yes - At the token level, Token Extensions include a pausable configuration that lets the issuer halt transfers of the token when needed.",
        refs: [
          {
            type: "Web",
            label: "Token Extensions",
            href: "/solutions/token-extensions",
          },
        ],
        a: [
          [
            "Yes - At the token level, ",
            { term: "Token Extensions" },
            " include a pausable configuration that lets the issuer halt transfers of the token when needed. At the application level, programs commonly implement their own pause switches controlled by a ",
            { term: "multisig" },
            ", so operations can be suspended during an incident and resumed after review - the same circuit-breaker pattern used in traditional systems.",
          ],
        ],
      },
      {
        q: "Does MEV affect our application or users?",
        tldr: "MEV (maximal extractable value) refers to profits extracted by reordering or inserting transactions - mainly affecting price-sensitive activity like DEX trading, where users can experience slightly worse execution.",
        a: [
          [
            { term: "MEV" },
            " (maximal extractable value) refers to profits extracted by reordering or inserting transactions - mainly affecting price-sensitive activity like DEX trading, where users can experience slightly worse execution.",
          ],
          [
            "For payments, transfers, and settlement flows, the impact is minimal since there's no price to trade against. Where it matters, established mitigations exist: protected transaction submission services and execution venues designed to prevent front-running.",
          ],
        ],
      },
      {
        q: "How should we prepare for RPC outages operationally?",
        tldr: "Treat RPC access like any critical infrastructure dependency: use two or more RPC providers with automatic failover, build retry and resubmission logic into transaction handling, and monitor each provider's latency and health so degradation is detected before it affects your flows.",
        refs: [
          {
            type: "Docs",
            label: "Durable nonces",
            href: "/docs/core/transactions/durable-nonces",
          },
        ],
        a: [
          [
            "Treat RPC access like any critical infrastructure dependency: use two or more ",
            { term: "RPC providers" },
            " with automatic failover, build retry and resubmission logic into transaction handling, and monitor each provider's latency and health so degradation is detected before it affects your flows.",
          ],
          [
            "Define a playbook for degraded conditions - for example, pausing outbound transactions until failover completes. ",
            { term: "durable nonce", display: "Durable nonces" },
            " help here too: pre-signed transactions remain valid and can be submitted once your RPC connection is restored.",
          ],
        ],
      },
      {
        q: "What about quantum readiness?",
        tldr: "This is an industry-wide question rather than a Solana-specific one - the signature schemes used across major blockchains (and much of traditional finance) would all be affected by cryptographically relevant quantum computers, which remain years away by current estimates.",
        a: [
          [
            "This is an industry-wide question rather than a Solana-specific one - the signature schemes used across major blockchains (and much of traditional finance) would all be affected by cryptographically relevant quantum computers, which remain years away by current estimates.",
          ],
          [
            "The Solana research community has already published post-quantum approaches (such as quantum-resistant vault designs), and migration to post-quantum cryptography is expected to happen industry-wide as standards mature.",
          ],
        ],
      },
    ],
  },
  {
    topic: "Private & Permissioned Environments",
    icon: "◧",
    items: [
      {
        q: "Can a separate permissioned network be built with Solana technology?",
        tldr: "Yes - Solana Permissioned Environments (SPEs) let an institution run the Solana stack as its own private network, with full control over validators and participants.",
        refs: [
          {
            type: "Web",
            label: "Financial institutions on Solana",
            href: "/solutions/financial-institutions",
          },
          {
            type: "Docs",
            label: "Private Channels",
            href: "/docs/tools/private-channels",
          },
        ],
        a: [
          [
            "Yes - Solana Permissioned Environments (SPEs) let an institution run the Solana stack as its own private network, with full control over validators and participants. The trade-off is the same one you face with any permissioned system: the environment is isolated from mainnet liquidity.",
          ],
          [
            "For many use cases, ",
            { term: "Private Channels" },
            " or ",
            { term: "Token Extensions" },
            " on the public network deliver the control and privacy institutions actually need without giving up access to the broader network.",
          ],
        ],
      },
      {
        q: "Can a private or permissioned setup still access mainnet liquidity?",
        tldr: "This is exactly what Private Channels are designed for: a private transaction environment with direct access to Solana mainnet liquidity.",
        refs: [
          {
            type: "Docs",
            label: "Private Channels",
            href: "/docs/tools/private-channels",
          },
          {
            type: "GitHub",
            label: "Solana Private Channels",
            href: "https://github.com/solana-foundation/solana-private-channels",
          },
        ],
        a: [
          [
            "This is exactly what ",
            { term: "Private Channels" },
            " are designed for: a private transaction environment with direct access to Solana mainnet liquidity. Assets move into the channel from mainnet, transact privately among the permissioned participants at high speed, and settle back to the public network - so you get privacy and control without the liquidity isolation of a fully separate network.",
          ],
        ],
      },
    ],
  },
];

export const FAQ_TOTAL = FAQ_TOPICS.reduce(
  (total, topic) => total + topic.items.length,
  0,
);
