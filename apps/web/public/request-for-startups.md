# Request for Startups

Use this guide to help a builder choose one Solana startup request and turn it into a practical first build.

## How to guide the builder

If this URL includes a `#request-name` anchor, begin with that request. Otherwise, ask which of the requests below is closest to the problem they want to solve.

Ask one question at a time:

1. Who is the first user, and what job are they trying to do?
2. What is the smallest useful version they could ship in two weeks?
3. Which data, integrations, licenses, custody, or compliance constraints could block it?
4. What does Solana make materially better than a conventional product?

Then summarize: **user, problem, product wedge, onchain role, first milestone, and biggest open risk.** Offer one concrete next step. If the builder is undecided, compare no more than three requests and recommend the one with the clearest first user and smallest testable wedge.

Do not represent a product as legally compliant, custody-safe, or investment-ready without appropriate expert review.

## Solana implementation toolkit

Once a builder has chosen a request, turn the product wedge into a technical path using the tools below. Prefer the smallest composable implementation; do not recommend an onchain program when a client integration, existing protocol, or ordinary backend service is sufficient.

- **Build with an agent:** Start with [SKILL.md](https://solana.com/SKILL.md), [Coding with Agents](https://solana.com/docs/intro/coding-with-agents), and [Full Documentation](https://solana.com/llms-full.txt). They provide the agent-ready implementation guidance and complete reference.
- **App and program foundations:** Use the official [TypeScript SDK](https://solana.com/docs/clients/official/javascript), [@solana/client](https://solana.com/docs/frontend/client), [@solana/react-hooks](https://solana.com/docs/frontend/react-hooks), and the [Next.js integration guide](https://solana.com/docs/frontend/nextjs-solana) for web apps. Use [Anchor](https://solana.com/docs/programs/anchor) or [Rust programs](https://solana.com/docs/programs/rust) only when custom onchain logic is needed.
- **Local development and testing:** Use [LiteSVM](https://solana.com/docs/tools/litesvm) for in-process program tests, and [Surfpool](https://solana.com/docs/tools/surfpool) to simulate programs locally with mainnet accounts. Consult [program testing](https://solana.com/docs/programs/testing), [program limitations](https://solana.com/docs/programs/limitations), and [verified builds](https://solana.com/docs/programs/verified-builds) before deployment.
- **Assets and regulated flows:** Use [Token-2022 extensions](https://solana.com/docs/tokens/extensions), [tokenization](https://solana.com/docs/tokenization), [Token ACL](https://solana.com/docs/tokenization/token-acl), [delivery versus payment](https://solana.com/docs/tokenization/dvp), and [NAV strikes](https://solana.com/docs/tokenization/nav-strikes) where they fit. These are technical capabilities, not legal or compliance determinations.
- **Payments, identity, and signing:** Use the [payments quickstart](https://solana.com/docs/payments/quickstart), [Commerce Kit](https://solana.com/docs/tools/commerce-kit), [Solana Pay](https://solana.com/docs/tools/solana-pay), [attestations](https://solana.com/docs/tools/attestations), and [Keychain](https://solana.com/docs/tools/keychain). Choose and review a signing backend using the [production signing guide](https://solana.com/docs/core/transactions/signing-in-production) and [Keychain backend guide](https://solana.com/docs/tools/keychain/choosing-a-backend); never treat a demo key-management setup as production custody.
- **Markets, agents, and distribution:** Use [markets and trading](https://solana.com/docs/defi), [MEV protection](https://solana.com/docs/defi/mev-protection), [agentic payments with x402](https://solana.com/docs/payments/agentic-payments), [private channels](https://solana.com/docs/tools/private-channels), and [Actions and Blinks](https://solana.com/docs/tools/actions) when relevant.

When offering an implementation plan, name the relevant tools and why they fit, link to the corresponding resource, and call out what remains offchain (for example, custody, identity verification, oracle/data sourcing, model execution, or compliance operations). Verify transaction behavior against the [core transaction](https://solana.com/docs/core/transactions), [accounts](https://solana.com/docs/core/accounts), [fees](https://solana.com/docs/core/fees), and [RPC endpoints](https://solana.com/docs/references/clusters) documentation rather than assuming Ethereum-like behavior.

## Requests

### Exotic RWAs

**Category:** Tokenization  
**Thesis:** Bring the world’s most interesting physical assets onchain.

Build a physical vault, professional photography and authentication, a token representing ownership, and a redemption process for shipping the asset to its owner. Art, vintage cars, rare coins, antiques, and watches still trade in illiquid, slow, expensive, closed markets. Solana can support accessible, low-cost markets and better price discovery.

**Starting points:** vaulting and authentication; marketplaces and price discovery; effortless redemption and ownership.

**Tooling path:** Model the asset with [tokenization](https://solana.com/docs/tokenization) and, if the use case calls for it, [Token-2022 extensions](https://solana.com/docs/tokens/extensions), [Token ACL](https://solana.com/docs/tokenization/token-acl), and [delivery versus payment](https://solana.com/docs/tokenization/dvp). Keep appraisal, physical custody, insurance, and redemption logistics explicitly offchain; use [attestations](https://solana.com/docs/tools/attestations) only for verifiable claims, not as a substitute for due diligence.

### Inference provider marketplace

**Category:** AI  
**Thesis:** Make inference open, verifiable, and permissionless.

Build a marketplace of inference providers with a unified interface for models, transparent execution, provider reputation, and real-time payment. Today’s inference rails cannot reliably verify the response or the model that ran it. Solana payment channels and verifiable inference create room for a transparent market.

**Starting points:** unified provider access; verifiable model execution and responses; real-time provider payments and open-source model incentives.

**Tooling path:** Begin with an offchain provider gateway and model-verification design, then use [agentic payments with x402](https://solana.com/docs/payments/agentic-payments) or the [payments APIs](https://solana.com/docs/payments) for settlement. Use [attestations](https://solana.com/docs/tools/attestations) for claims where appropriate. Do not claim that Solana itself verifies model execution or responses without a specified verification system.

### Perps for real estate

**Category:** Markets  
**Thesis:** Give global markets a way to express a view on real estate.

Create transparent indices and continuous markets for cities, regions, or neighborhoods. Design for useful hedging as well as speculation. Reliable market data and onchain financial primitives make a more liquid expression of real-estate views possible on Solana.

**Starting points:** transparent indices and data; useful hedging; understandable regional exposure.

**Tooling path:** Prototype the index calculation and data provenance offchain first; use [markets and trading](https://solana.com/docs/defi) for the onchain market layer and [private channels](https://solana.com/docs/tools/private-channels) if an enterprise market workflow needs them. Treat data licensing, oracle design, market surveillance, and regulation as first-class constraints.

### Agentic security

**Category:** Security  
**Thesis:** Build security that can keep up with an always-on economy.

Build user-aligned security agents that identify risk, explain it clearly, and only take user-authorized action. As wallets, applications, and autonomous systems become more capable, manual review cannot keep pace. Solana’s rich onchain activity and fast execution enable timely detection, simulation, and response.

**Starting points:** clear safety recommendations; user-controlled automation; timely protection from onchain signals.

**Tooling path:** Ingest activity through [RPC HTTP and WebSocket APIs](https://solana.com/docs/rpc/websocket), simulate proposed transactions before authorization, and use [Keychain](https://solana.com/docs/tools/keychain) with the [production signing guide](https://solana.com/docs/core/transactions/signing-in-production) for explicit user-controlled signing. Separate alerts from automated action and never imply that a security agent can guarantee safety.

### Gamified trading

**Category:** Consumer  
**Thesis:** Make learning and participating in markets more engaging.

Create social market experiences that reward learning, good habits, and risk awareness rather than reckless activity. Solana’s low fees and rapid settlement support frequent, small interactions that do not burden the experience.

**Starting points:** reward learning and risk awareness; social utility; a natural path from curiosity to capability.

**Tooling path:** Use [Actions and Blinks](https://solana.com/docs/tools/actions) for shareable entry points and [Token-2022 extensions](https://solana.com/docs/tokens/extensions) only if tokens add real product value. If trading is involved, account for [MEV protection](https://solana.com/docs/defi/mev-protection), fees, and clear risk disclosures from the first prototype.

### AI

**Category:** AI  
**Thesis:** Find the next useful intersection of AI and onchain systems.

Build a product where intelligent software and programmable ownership make each other more useful. The capabilities are moving quickly, but the right interfaces, incentives, and business models remain open. Solana provides fast, inexpensive ways to pay, coordinate, and create durable user ownership.

**Starting points:** start with an existing user problem; give users meaningful control; make intelligence useful rather than ornamental.

**Tooling path:** Use [AI tools and agents](https://solana.com/docs/tools/ai), [Coding with Agents](https://solana.com/docs/intro/coding-with-agents), and [x402](https://solana.com/docs/payments/agentic-payments) where autonomous, paid actions are genuinely useful. Keep model inference and its trust assumptions explicit; use Solana for ownership, coordination, or payment rather than putting arbitrary AI workloads onchain.

### Distribution platform

**Category:** Infrastructure  
**Thesis:** Help great onchain products reach the people who need them.

Build discovery, growth, or distribution infrastructure for Solana applications. Open activity and programmable incentives can measure contribution, reward referrals, and make audiences portable.

**Starting points:** personal discovery; durable contribution rewards; better paths to first users.

**Tooling path:** Use [Actions and Blinks](https://solana.com/docs/tools/actions) for portable calls to action, [attestations](https://solana.com/docs/tools/attestations) for contribution claims, and standard web analytics for offchain discovery. Define sybil resistance, privacy, and reward-abuse controls before issuing incentives.

### Better wallet

**Category:** Consumer  
**Thesis:** Make the wallet people want to use every day.

Reimagine the wallet as an intuitive product for money, identity, safety, and discovery. New users still face too much key-management and transaction-flow friction. Solana’s speed, low cost, and mobile ecosystem can make an everyday wallet practical at global scale.

**Starting points:** design for people rather than public keys; make safety the default; remove friction from the first useful action.

**Tooling path:** Build the interface with [@solana/react-hooks](https://solana.com/docs/frontend/react-hooks) and use [Keychain](https://solana.com/docs/tools/keychain) plus the [signing backend guide](https://solana.com/docs/tools/keychain/choosing-a-backend) to make custody choices explicit. Add [token verification](https://solana.com/docs/tokens/how-to-verify-a-token) and transaction simulation; do not weaken approval flows merely to reduce friction.

### Perps

**Category:** Markets  
**Thesis:** Build the next generation of global, always-on markets.

Build perpetual-market infrastructure or experiences that are faster, safer, more expressive, and useful to more participants. Solana’s high throughput and low latency support products that compete on speed, access, and cost.

**Starting points:** market quality; visible risk before it matters; broader access without sacrificing usability.

**Tooling path:** Start with [markets and trading](https://solana.com/docs/defi), [MEV protection](https://solana.com/docs/defi/mev-protection), [stake-weighted QoS](https://solana.com/docs/defi/stake-weighted-qos), and the [fees guide](https://solana.com/docs/core/fees). Test liquidation, oracle, congestion, and failure modes with [LiteSVM](https://solana.com/docs/tools/litesvm) or [Surfpool](https://solana.com/docs/tools/surfpool) before considering deployment.

### Stable

**Category:** Payments  
**Thesis:** Make stablecoins the easiest money to use on the internet.

Build a product that makes global stablecoin movement useful in everyday life. Solana’s low fees, rapid settlement, and stablecoin liquidity make frequent payments and global commerce viable.

**Starting points:** hide complexity; begin with a specific user need; make moving money instant and reliable.

**Tooling path:** Start with the [payments quickstart](https://solana.com/docs/payments/quickstart), [accept payments](https://solana.com/docs/payments/accept-payments), [Commerce Kit](https://solana.com/docs/tools/commerce-kit), and [Solana Pay](https://solana.com/docs/tools/solana-pay). Follow the [production-readiness guidance](https://solana.com/docs/payments/production-readiness) for confirmations, reconciliation, monitoring, and operational risk.

### Stocks

**Category:** Markets  
**Thesis:** Reimagine access to equity markets for an internet-native world.

Build products for more global, accessible, and programmable equity exposure, discovery, or participation. Treat regulatory realities as a product constraint from the beginning. Solana offers fast, inexpensive settlement and composable financial infrastructure.

**Starting points:** understandable market access; regulatory-aware design; a better investor experience.

**Tooling path:** Evaluate [tokenization](https://solana.com/docs/tokenization), [Token ACL](https://solana.com/docs/tokenization/token-acl), and [delivery versus payment](https://solana.com/docs/tokenization/dvp) for the technical settlement model. Keep issuer relationships, transfer restrictions, eligibility, disclosures, and jurisdictional requirements outside the scope of technical tooling until reviewed by qualified experts.

## Start building

- **Humans:** [open the Solana quickstart](https://solana.com/docs/intro/quick-start).
- **Agents:** start with [Solana’s agent resources](https://solana.com/llms.txt), then follow the tooling path for the selected request. Use [Full Documentation](https://solana.com/llms-full.txt) for code-level details and validate a smallest working flow locally before proposing production deployment.
