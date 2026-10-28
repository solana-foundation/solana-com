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

These eleven briefs follow the video playlist order, with one request per video.

<a id="housing-futures"></a>
<a id="perps-for-real-estate"></a>

### Onchain housing futures

**Category:** Markets

**Speaker:** Matty Taylor, Founder, Colosseum

**Video:** [Watch the request](https://www.youtube.com/watch?v=ZxIzUBOnrtQ)

**Thesis:** Give homeowners and future buyers a market for housing risk.

Build a perpetual market tied to a metropolitan housing index. A homeowner could hedge a fall in local prices, while someone saving for a home could take exposure to a market they cannot yet afford to enter. The product starts with a trustworthy index and a market liquid enough to serve both sides.

**Why now:** Matty Taylor points to an idea that earlier housing futures struggled to deliver: a liquid way to manage the risk concentrated in a home. Crypto market infrastructure creates another chance to make it useful.

**Why Solana:** Use onchain market infrastructure to connect participants around housing indices, with transparent positions and programmable settlement.

**Starting points:**

- Choose one city and define an index with reliable, licensed data.
- Design the market for both homeowners and people saving to buy.
- Prototype liquidity, collateral, and oracle behavior before expanding.

**Tooling path:** Prototype the index calculation and data provenance offchain first; use [markets and trading](https://solana.com/docs/defi) for the onchain market layer and [private channels](https://solana.com/docs/tools/private-channels) if an enterprise market workflow needs them. Treat data licensing, oracle design, market surveillance, and regulation as first-class constraints.

<a id="ai-inference-marketplace"></a>
<a id="inference-provider-marketplace"></a>

### An open marketplace for AI inference

**Category:** AI

**Speaker:** Jacob Creech, VP Technology, Solana Foundation

**Video:** [Watch the request](https://www.youtube.com/watch?v=tGH2lOT_mno)

**Thesis:** Let developers choose, verify, and pay inference providers through one interface.

Build a shared gateway to AI models where providers can join without a central listing process. Alongside access and pricing, make it possible to check which model actually handled a request. Track provider performance and model usage so useful services can earn a reputation.

**Why now:** Jacob Creech sees an opening where unified model access meets verifiable inference and payment channels. Usage could also give open-source model developers a route to funding their next release.

**Why Solana:** Payment channels can settle frequent inference usage while the marketplace handles provider identity, reputation, and a separate verification system.

**Starting points:**

- Build a common request interface across independent providers.
- Show the evidence behind model identity and response verification.
- Connect usage payments and reputation to model development.

**Tooling path:** Begin with an offchain provider gateway and model-verification design, then use [agentic payments with x402](https://solana.com/docs/payments/agentic-payments) or the [payments APIs](https://solana.com/docs/payments) for settlement. Use [attestations](https://solana.com/docs/tools/attestations) for claims where appropriate. Do not claim that Solana itself verifies model execution or responses without a specified verification system.

<a id="entertainment-finance"></a>
<a id="gamified-trading"></a>

### Entertainment finance for everyone

**Category:** Consumer

**Speaker:** Pedro Miranda, Head of Consumer, Solana Foundation

**Video:** [Watch the request](https://www.youtube.com/watch?v=8CUSptfIW_U)

**Thesis:** Bring everyday spending and traditional asset investing into one engaging experience.

Create a consumer product that connects spending patterns, daily habits, and portfolio decisions. Pedro Miranda imagines the accessibility of everyday savings apps combined with the energy of social trading, helping people participate in asset markets through an experience they want to return to.

**Why now:** Financial participation and attention compete for the same place in daily life. The request is to make traditional asset investing engaging as more kinds of assets become available onchain.

**Why Solana:** Tokenized financial and collectible assets give builders a shared foundation for bringing different kinds of ownership into one consumer product.

**Starting points:**

- Connect everyday spending to a clear savings or investing journey.
- Make portfolio decisions understandable in a playful interface.
- Design engagement around informed participation and user control.

**Tooling path:** Use [Actions and Blinks](https://solana.com/docs/tools/actions) for shareable entry points and [Token-2022 extensions](https://solana.com/docs/tokens/extensions) only if tokens add real product value. If trading is involved, account for [MEV protection](https://solana.com/docs/defi/mev-protection), fees, and clear risk disclosures from the first prototype.

<a id="agentic-security"></a>

### Security for the agentic age

**Category:** Security

**Speaker:** Robert Chen, Founder, OtterSec

**Video:** [Watch the request](https://www.youtube.com/watch?v=15ecsUCXN1E)

**Thesis:** Help defenders protect the whole business as AI changes how attacks happen.

Build tools for security teams facing threats across their systems, beyond smart contract code alone. Robert Chen calls for continuous transaction monitoring, stronger onchain firewalls, and ways to trace stolen funds. Pick a concrete defensive workflow and make it faster to detect, investigate, or contain a threat.

**Why now:** Attackers are gaining new capabilities from AI. Security teams need tools that help them adapt across the full stack rather than relying on a one-time contract review.

**Why Solana:** Observable onchain transactions give defenders a source of signals for monitoring, investigation, and protective controls around Solana applications.

**Starting points:**

- Help teams investigate suspicious transaction patterns continuously.
- Build a firewall with explicit, reviewable intervention policies.
- Trace fund movements and make incident response easier to coordinate.

**Tooling path:** Ingest activity through [RPC HTTP and WebSocket APIs](https://solana.com/docs/rpc/websocket), simulate proposed transactions before authorization, and use [Keychain](https://solana.com/docs/tools/keychain) with the [production signing guide](https://solana.com/docs/core/transactions/signing-in-production) for explicit user-controlled signing. Separate alerts from automated action and never imply that a security agent can guarantee safety.

<a id="exotic-collectibles"></a>
<a id="exotic-rwas"></a>

### Bring exotic collectibles onchain

**Category:** Tokenization

**Speaker:** Vibhu Norby, CPO, Solana Foundation

**Video:** [Watch the request](https://www.youtube.com/watch?v=OdhqVLfXPxQ)

**Thesis:** Build markets for the long tail of physical assets that collectors value.

Start with authenticated physical custody, high-quality asset records, a token representing ownership, and a reliable redemption process. Vibhu Norby wants builders to extend that model into more collectible categories, including art, cars, coins, antiques, and watches. The opportunity includes the vault, the marketplace, and the pricing tools around it.

**Why now:** Tokenized collectibles have shown how physical custody and onchain trading can work together. Many other categories still depend on slow transactions and limited access to buyers.

**Why Solana:** Transferable tokens and shared markets can connect collectible ownership to broader trading infrastructure while custody and redemption stay tied to the physical item.

**Starting points:**

- Choose one collectible category and solve authentication and vaulting.
- Create asset records that buyers can inspect and compare.
- Make pricing, secondary trading, and physical redemption dependable.

**Tooling path:** Model the asset with [tokenization](https://solana.com/docs/tokenization) and, if the use case calls for it, [Token-2022 extensions](https://solana.com/docs/tokens/extensions), [Token ACL](https://solana.com/docs/tokenization/token-acl), and [delivery versus payment](https://solana.com/docs/tokenization/dvp). Keep appraisal, physical custody, insurance, and redemption logistics explicitly offchain; use [attestations](https://solana.com/docs/tools/attestations) only for verifiable claims, not as a substitute for due diligence.

<a id="attention-tokens"></a>
<a id="distribution-platform"></a>

### Attention tokens for startup distribution

**Category:** Distribution

**Speaker:** Farhaj Mayan, Founder, Forma

**Video:** [Watch the request](https://www.youtube.com/watch?v=U4DIr3l9A_0)

**Thesis:** Turn community attention into a marketing budget for a startup.

Farhaj Mayan proposes a token tied to attention rather than company ownership. Trading revenue would enter a wallet restricted to marketing spending. A marketplace of vetted creators could then compete to run campaigns, directing that budget toward reaching customers rather than paying it out to founders.

**Why now:** As building and iterating gets cheaper, winning distribution becomes a larger constraint. This request connects startup growth, creator work, and community participation in one product.

**Why Solana:** Programmable tokens and spending controls could connect trading activity to a dedicated marketing treasury, with visible campaign payments and outcomes.

**Starting points:**

- Define the token and make its lack of equity ownership clear.
- Restrict treasury spending to approved marketing activity.
- Build creator discovery, campaign bidding, and attribution together.

**Tooling path:** Use [Token-2022 extensions](https://solana.com/docs/tokens/extensions) where the token design requires them, [attestations](https://solana.com/docs/tools/attestations) for creator and campaign claims, and [payments](https://solana.com/docs/payments) for campaign payouts. Define and test the marketing treasury’s spending restrictions explicitly. Keep creator vetting and attribution offchain, and review the token’s legal structure before a launch.

<a id="perps-and-onchain-trading"></a>
<a id="perps"></a>

### Perps and onchain trading

**Category:** Markets

**Speaker:** Toly

**Video:** [Watch the request](https://www.youtube.com/watch?v=r9ZQuh3ShV8)

**Thesis:** Build products that bring a growing share of trading onto Solana.

Toly’s request is deliberately broad: grow Solana’s share of perpetual trading and keep expanding across other markets. Build a venue, a trading product, or infrastructure that earns real usage. The goal is sustained growth in trading activity, with room for different teams to choose the specific market or user they serve.

**Why now:** The request sets a continuing product goal: win a larger share of trading over time. Builders can choose the gaps in market access, execution, or experience where they can make a difference.

**Why Solana:** Solana is the shared execution environment for the trading venues, products, and supporting infrastructure this request seeks to grow.

**Starting points:**

- Pick a trader segment or market that existing products underserve.
- Build a venue, interface, or infrastructure component for that need.
- Measure repeat usage and market share over time.

**Tooling path:** Start with [markets and trading](https://solana.com/docs/defi), [MEV protection](https://solana.com/docs/defi/mev-protection), [stake-weighted QoS](https://solana.com/docs/defi/stake-weighted-qos), and the [fees guide](https://solana.com/docs/core/fees). Test liquidation, oracle, congestion, and failure modes with [LiteSVM](https://solana.com/docs/tools/litesvm) or [Surfpool](https://solana.com/docs/tools/surfpool) before considering deployment.

<a id="ai-financial-advisor"></a>
<a id="ai"></a>
<a id="better-wallet"></a>

### An AI financial advisor in your wallet

**Category:** AI

**Speaker:** Rishin Sharma, Head of AI, Solana Foundation

**Video:** [Watch the request](https://www.youtube.com/watch?v=YEO8Gh0PxV4)

**Thesis:** Give people a wallet that helps them understand and manage their money proactively.

Build an advisor that understands a user’s holdings, goals, and previous decisions, then watches for relevant market changes. It should explain portfolio moves, explore options, and help the user carry out a chosen action. Rishin Sharma’s request goes beyond a chatbot that simply reports a balance.

**Why now:** Financial interfaces have moved from brokers to apps and APIs, yet users still do most of the monitoring and interpretation themselves. AI creates room for a more proactive interface.

**Why Solana:** Open markets, programmable assets, and composable applications let an advisor connect information and actions across a user’s onchain financial life.

**Starting points:**

- Explain portfolio changes using the user’s actual positions.
- Compare options against the user’s goals and risk preferences.
- Move from explanation to execution with explicit user approval.

**Tooling path:** Use [AI tools and agents](https://solana.com/docs/tools/ai) and [@solana/react-hooks](https://solana.com/docs/frontend/react-hooks) for a wallet interface connected to portfolio data. Use [Keychain](https://solana.com/docs/tools/keychain) and the [production signing guide](https://solana.com/docs/core/transactions/signing-in-production) for explicit user-controlled execution. Keep inference and financial interpretation offchain, simulate transactions, and require approval before moving funds.

<a id="stablecoins"></a>
<a id="stable"></a>

### Build the future of stablecoins

**Category:** Payments

**Speaker:** Nemil Dalal, Visiting Partner, Y Combinator

**Video:** [Watch the request](https://www.youtube.com/watch?v=5jJX-IjTVMw)

**Thesis:** Make stablecoins practical money for businesses, consumers, and agents.

Nemil Dalal identifies several opportunities: new stablecoin designs, tools for business adoption, neobanks with a distribution advantage, agent payments, and privacy. Choose a specific customer and remove an obstacle they face, whether that is liquidity, operational security, compliance workflows, or a difficult interface.

**Why now:** Stablecoins are becoming a common way to move money online, but the supporting products still leave work for users and businesses. The request favors solving those practical problems.

**Why Solana:** Low transaction costs and global onchain transfers provide a foundation for payment products serving people, companies, and software agents.

**Starting points:**

- Choose a business or consumer workflow that stablecoins could improve.
- Solve liquidity, security, and operational needs before scaling.
- Explore agent access or privacy where existing tools fall short.

**Tooling path:** Start with the [payments quickstart](https://solana.com/docs/payments/quickstart), [accept payments](https://solana.com/docs/payments/accept-payments), [Commerce Kit](https://solana.com/docs/tools/commerce-kit), and [Solana Pay](https://solana.com/docs/tools/solana-pay). Follow the [production-readiness guidance](https://solana.com/docs/payments/production-readiness) for confirmations, reconciliation, monitoring, and operational risk.

<a id="startup-fundraising"></a>
<a id="stocks"></a>

### Discovery and trading for onchain startup fundraising

**Category:** Markets

**Speaker:** Adam Bergeman, Founder, Star.fun

**Video:** [Watch the request](https://www.youtube.com/watch?v=D1C95ROUuSo)

**Thesis:** Help investors evaluate the teams behind early-stage startup tokens.

Build discovery and trading tools that surface more than a social feed. Adam Bergeman wants investors to understand founder history, shipped work, repository activity, and other evidence about a startup. AI could organize those signals into a useful research workflow, starting with crypto utility projects.

**Why now:** As more startups explore raising onchain, their investors need information that current social trading interfaces do not organize well. The initial opportunity is a focused product for that underserved audience.

**Why Solana:** Onchain issuance and trading give builders a market layer to pair with better company discovery and evidence about the team doing the work.

**Starting points:**

- Combine founder history and development activity with traceable sources.
- Use AI to organize evidence without presenting speculation as fact.
- Start with utility projects and build a focused investor experience.

**Tooling path:** Start with an offchain research index that links claims to founder records and repository activity. Use [markets and trading](https://solana.com/docs/defi) for market integrations, and evaluate [tokenization](https://solana.com/docs/tokenization) and [Token ACL](https://solana.com/docs/tokenization/token-acl) only when implementing issuance or transfer restrictions. Treat eligibility, issuer obligations, and regulatory review as separate requirements; do not infer legal permission from a video.

<a id="prediction-markets"></a>

### Game-day mode for prediction markets

**Category:** Consumer

**Speaker:** Kyle Samani, Chairman, Forward Industries

**Video:** [Watch the request](https://www.youtube.com/watch?v=ZVyQVSQ9s6U)

**Thesis:** Build a live game-day experience around the positions a fan already holds.

Kyle Samani describes a fan following several football games with multiple predictions open. Build a single view of those positions alongside the action, plus discovery that relates new markets to the fan’s existing interests. The opportunity is a polished experience built on top of trading and resolution infrastructure.

**Why now:** Prediction market primitives let teams concentrate on the experience around live events. Fans managing many positions have a specific workflow that a general trading screen does not fully serve.

**Why Solana:** Use existing onchain trading and resolution layers as the foundation, then focus the product on organizing positions and following live games.

**Starting points:**

- Show open positions across games in one readable live view.
- Connect market discovery to the games and positions a fan follows.
- Keep position status, outcomes, and exposure easy to understand.

**Tooling path:** Integrate an existing market’s trading and resolution APIs first, with [RPC subscriptions](https://solana.com/docs/rpc/websocket) where onchain position updates are useful. Build the interface with [@solana/react-hooks](https://solana.com/docs/frontend/react-hooks), simulate proposed trades, and consult [MEV protection](https://solana.com/docs/defi/mev-protection). Keep live sports data, licensing, user eligibility, and jurisdictional requirements explicit.

## Start building

- **Humans:** [open the Solana quickstart](https://solana.com/docs/intro/quick-start).
- **Agents:** start with [Solana’s agent resources](https://solana.com/llms.txt), then follow the tooling path for the selected request. Use [Full Documentation](https://solana.com/llms-full.txt) for code-level details and validate a smallest working flow locally before proposing production deployment.
