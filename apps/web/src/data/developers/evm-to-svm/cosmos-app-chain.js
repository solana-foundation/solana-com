const CONTENT_BLOCK_STYLE_KEYS = {
  spacing: "spacing",
  spacingWithMargins: "spacingWithMargins",
  spacingLastBlock: "spacingLastBlock",
  cardDeckWrapper: "cardDeckWrapper",
};

/** @type {Record<string, import("@/component-library/responsive-box").ResponsiveStyles>} */
export const BLOCK_STYLES = {
  [CONTENT_BLOCK_STYLE_KEYS.spacing]: {
    large: { paddingTop: "20px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacingWithMargins]: {
    large: { paddingTop: "20px", marginTop: "auto", marginBottom: "auto" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacingLastBlock]: {
    large: { paddingTop: "20px", paddingBottom: "48px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.cardDeckWrapper]: {
    large: { paddingTop: "0px", marginTop: "-3px" },
  },
};

export const CONTENT_EDITOR_CTA = {
  button: {
    url: "/developers/migrate-to-solana/cosmos",
  },
};

export const NAV_BUTTONS = [
  {
    label: "",
    hierarchy: "outline",
    size: "md",
    iconSize: "md",
    startIcon: "none",
    endIcon: "none",
    url: "/developers/migrate-to-solana/cosmos",
  },
  {
    label: "",
    hierarchy: "outline",
    size: "md",
    iconSize: "md",
    startIcon: "none",
    endIcon: "none",
    url: "/developers/migrate-to-solana/cosmos/cosmwasm",
  },
];

export const RUNBOOK_HIGHLIGHTS = {
  banner: {
    eyebrow: "Migration framing",
    title: "Treat this as a coordinated shutdown and relaunch.",
    body: "A Cosmos app-chain migration is not a routine chain upgrade. You are retiring a live Layer 1, preserving the obligations it held, and relaunching the product, token, governance, and operations on Solana.",
  },
  cards: [
    {
      number: "01",
      title: "Plan the shutdown before the rewrite",
      body: "Governance, validator coordination, IBC cutoffs, exchange notice, and archival strategy need to be locked before destination programs are final.",
    },
    {
      number: "02",
      title: "Separate token migration from product migration",
      body: "Snapshot rules, claim flows, bridge mechanics, and unclaimed-token policy should be explicit projects with their own owners, operators, and support playbooks.",
    },
    {
      number: "03",
      title: "Launch on Solana like a production cutover",
      body: "The token mint, metadata, vault authorities, claim program, liquidity, governance, and user comms all need to go live in a sequence you can rehearse and defend.",
    },
  ],
};

export const RUNBOOK_SECTIONS = [
  {
    id: "why-teams-leave",
    navLabel: "1. Learn from other teams",
    tone: "note",
    html: `
      <h2>1. Learn from other teams</h2>
      <h4>What worked in prior migrations</h4>
      <ul>
        <li>One-way migration windows with a public deadline and exchange coordination created urgency and high completion rates.</li>
        <li>Public request-for-proposal or evaluation processes gave the community a real decision framework instead of a hand-wavy announcement.</li>
        <li>Long notice periods of 60 to 90 days reduced stranded balances and support chaos.</li>
        <li>Archiving chain state preserved auditability and historical support data.</li>
      </ul>
      <h4>What failed</h4>
      <ul>
        <li>Short notice windows stranded meaningful supply.</li>
        <li>Skipping exchange coordination left custodial users behind.</li>
        <li>Teams that failed to archive state lost an authoritative record of balances and protocol history.</li>
      </ul>
    `,
  },
  {
    id: "decision-framework",
    navLabel: "2. Decision Framework",
    tone: "default",
    html: `
      <h2>2. Decision Framework: Is Solana the Right Destination?</h2>
      <p>Do not start a migration because another team did. Validate that Solana fits your product better than continuing on Cosmos or moving to another environment.</p>
      <p>On Solana, a <a href="/docs/core/programs">program</a> is executable onchain code, an <a href="/docs/core/accounts">account</a> is the durable state that programs read and write, and a <a href="/docs/core/transactions">transaction</a> is the signed bundle of instructions that asks programs to do work. If that model fits your product and operations, the migration has a stronger foundation.</p>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Criterion</th>
              <th>Questions to ask</th>
              <th>Solana fit</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Security</td><td>How much economic security does the destination chain have, and is it proportionate to your product?</td><td>Strong for teams that want deep shared security instead of their own validator set.</td></tr>
            <tr><td>Liquidity</td><td>Can your token find real liquidity on major venues?</td><td>Strong DEX aggregation and active market structure.</td></tr>
            <tr><td>Developer ecosystem</td><td>Are the tools mature enough for your roadmap?</td><td>Strong developer tooling, program frameworks, testing resources, <a href="/docs/rpc">RPC</a> providers, indexers, wallets, and payment rails.</td></tr>
            <tr><td>User base</td><td>Do your target users already live here?</td><td>Often strong for consumer, trading, payments, and NFT-adjacent products.</td></tr>
            <tr><td>IBC compatibility</td><td>Do you still need native Cosmos interoperability after migration?</td><td>Limited. You need bridge or custom interoperability design.</td></tr>
            <tr><td>Smart contract model</td><td>Can the product survive a rewrite to the account model?</td><td>Good if you can re-architect around explicit accounts; poor if you need CosmWasm patterns unchanged.</td></tr>
            <tr><td>Transaction fees</td><td>Can your users afford frequent activity?</td><td>Very low nominal fees.</td></tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: "planning-announcement",
    navLabel: "3. Planning & Announcement",
    tone: "phase",
    html: `
      <h2>3. Phase 0: Planning &amp; Announcement</h2>
      <h3>Internal alignment</h3>
      <p>Do this before any public message goes out.</p>
      <ul>
        <li>Agree on a target halt window internally. Ninety days from public announcement is a sensible minimum.</li>
        <li>Inventory every user-held asset: liquid balances, staked balances, unbondings, LP positions, NFTs, vesting, escrow, and contract balances.</li>
        <li>Map every contract and module to one of three outcomes: migrate, replace, or deprecate.</li>
        <li>Audit every active IBC channel and identify external relayer operators and counterparty teams.</li>
        <li>Contact major validator operators privately before the public announcement.</li>
        <li>Give listed exchanges meaningful notice before the public migration window begins.</li>
        <li>Draft the governance proposal and the technical shutdown runbook in parallel.</li>
        <li>Decide what the migration portal will need to do for identity linking and claims.</li>
      </ul>
      <h3>Community governance</h3>
      <p>Even if the team can coordinate a validator halt without formal governance, skipping governance usually destroys trust. The operationally clean approach is to publish a temperature-check discussion first and a binding governance action later.</p>
      <p>The proposal should explain the new Solana asset clearly. Most migrated fungible tokens become <a href="/docs/tokens">SPL tokens</a>: tokens managed by Solana token programs rather than by your retired Cosmos chain.</p>
      <pre><code class="language-text">Title: [Deprecation Proposal] Shut Down CHAIN_NAME and Migrate to Solana

Summary:
The team proposes to sunset CHAIN_NAME on DATE, migrate TOKEN to Solana as an SPL token,
and redirect development resources to the Solana ecosystem.

Rationale:
- Security, liquidity, ecosystem, or product fit reasons
- Data supporting the decision

Migration plan:
- Token migration architecture
- Smart contract migration path
- Timeline and exchange coordination
- Unclaimed token policy</code></pre>
      <h3>Recommended timeline</h3>
      <pre><code class="language-text">Day 0:   Public announcement and forum proposal
Day 14:  On-chain governance vote opens
Day 21:  Governance vote closes
Day 28:  Migration portal opens and exchange work begins
Day 90:  Chain halts at the pre-announced block height
Day 180: Optional migration-claim deadline</code></pre>
      <p>Large communities should bias toward longer windows, not shorter ones.</p>
    `,
  },
  {
    id: "cosmos-shutdown",
    navLabel: "4. Cosmos Shutdown",
    tone: "phase",
    html: `
      <h2>4. Phase 1: Cosmos Chain Shutdown (Technical)</h2>
      <h3>Set the halt block height</h3>
      <p>Choose a height far enough in the future that validators, exchanges, relayers, and users can act. Every validator should configure the same halt height.</p>
      <pre><code class="language-toml"># ~/.chain/config/app.toml
halt-height = 12345678</code></pre>
      <pre><code class="language-bash">chaind start --halt-height=12345678</code></pre>
      <p>The halt block is committed. Nodes stop before processing the next block. If the chain is on an older Cosmos SDK version, insist on exact binary consistency across validators before the halt.</p>
      <h3>Export final state</h3>
      <pre><code class="language-bash">chaind export --height=12345678 --for-zero-height &gt; final_state.json</code></pre>
      <p>Use the resulting state as the canonical record for balance extraction and later audit work.</p>
      <pre><code class="language-bash">cat final_state.json | jq '.app_state.bank.balances' &gt; final_balances.json
cat final_state.json | jq '.app_state.staking.delegations' &gt; final_delegations.json
cat final_state.json | jq '.app_state.staking.unbonding_delegations' &gt; final_unbonding.json</code></pre>
      <h3>Compute the canonical snapshot</h3>
      <p>For a 1:1 token migration, merge bank balances, delegations, unbondings, module balances you intend to honor, and any contract-side token balances you promise to preserve.</p>
      <pre><code class="language-python"># snapshot_merge.py - pseudocode
snapshot = {}

for entry in balances:
    addr = entry["address"]
    amount = sum(c["amount"] for c in entry["coins"] if c["denom"] == "utoken")
    snapshot[addr] = snapshot.get(addr, 0) + int(amount)

for delegation in delegations:
    addr = delegation["delegator_address"]
    tokens = shares_to_tokens(delegation["shares"], delegation["validator_address"])
    snapshot[addr] = snapshot.get(addr, 0) + int(tokens)

for entry in unbonding:
    addr = entry["delegator_address"]
    for ubd in entry["entries"]:
        snapshot[addr] = snapshot.get(addr, 0) + int(ubd["balance"])</code></pre>
      <p>Do not trust the pipeline until totals reconcile to the supply you intend to preserve.</p>
      <h3>Handle IBC channels</h3>
      <ul>
        <li>Pause relayers before the halt so no new packets enter the queue.</li>
        <li>Drain or timeout in-flight packets intentionally.</li>
        <li>Notify counterparty chains and relayer operators with real dates, not vague warnings.</li>
        <li>If you can cleanly close routes through governance, do it before the halt.</li>
      </ul>
      <pre><code class="language-bash">chaind tx ibc channel close-init \
  --port-id transfer \
  --channel-id channel-0 \
  --from gov_addr \
  --chain-id your-chain-id</code></pre>
      <h3>Validator offboarding</h3>
      <ul>
        <li>Ask validators to archive their final node state and signing-state files.</li>
        <li>Pay or reconcile any final commission or support obligations before they disappear.</li>
        <li>Publish a formal validator offboarding memo with the halt height, export steps, and archive expectations.</li>
      </ul>
      <pre><code class="language-text">Subject: Validator Offboarding - Action Required

The chain will halt at block HEIGHT on DATE.
1. Configure halt-height=HEIGHT
2. Export final state after halt
3. Archive your node data to cold storage
4. Confirm your final commission destination</code></pre>
    `,
  },
  {
    id: "token-migration-architecture",
    navLabel: "5. Token Migration",
    tone: "phase",
    html: `
      <h2>5. Phase 2: Token Migration Architecture</h2>
      <p>For most chain shutdowns, the cleanest design is a snapshot-driven Merkle tree claimer on Solana. Instead of keeping a bridge alive after the Cosmos chain halts, you finalize balances off-chain, commit one Merkle root on Solana, fund a claim vault, and let each user prove their entitlement once.</p>
      <p>A Merkle root is a compact cryptographic commitment to the full claims file. A claim vault is a <a href="/docs/tokens/basics/create-token-account#what-is-an-associated-token-account">token account</a> funded with the migration supply. The <a href="/docs/core/programs">claim program</a> verifies each proof, releases the right <a href="/docs/tokens">SPL token</a> amount, and records that the claim is complete. A working reference is available in the <a href="https://github.com/brimigs/cosmos-migration-guide/tree/main/example-merkle-token-claimer" target="_blank" rel="noreferrer">example Merkle token claimer</a>.</p>
      <h3>Recommended architecture: Merkle tree claimer</h3>
      <ul>
        <li>Take a final Cosmos snapshot and normalize the balance dataset you intend to honor.</li>
        <li>Convert each claim into a deterministic leaf such as <code>{index, cosmos_address, solana_address, amount}</code> or <code>{index, recipient, amount}</code>.</li>
        <li>Build the Merkle tree off-chain and publish the root plus the full snapshot artifact for community review.</li>
        <li>Deploy a Solana claim program that stores the Merkle root, vault <a href="/docs/references/terminology#authority">authority</a>, <a href="/docs/references/terminology#token-mint">token mint</a> or token-vault accounts, and claim window.</li>
        <li>Require each claimant to submit their amount, leaf index, and Merkle proof, then mark that leaf as claimed in onchain state.</li>
      </ul>
      <pre><code class="language-text">Cosmos final snapshot
  -> normalized claims file
  -> Merkle tree build
  -> published root + claim JSON
  -> Solana claimer program initialized with root
  -> token vault funded
  -> users submit proof and receive SPL tokens</code></pre>
      <h3>What the Solana claimer should own</h3>
      <p>In the Rust-style structs below, <code>Pubkey</code> means a Solana <a href="/docs/references/terminology#public-key-pubkey">public key</a>: the address of an account, program, mint, vault, or wallet.</p>
      <pre><code class="language-rust">pub struct Distributor {
    pub merkle_root: [u8; 32],
    pub mint: Pubkey,
    pub vault: Pubkey,
    pub vault_authority_bump: u8,
    pub claim_window_end_ts: i64,
}

pub struct ClaimStatus {
    pub index: u64,
    pub claimed: bool,
}</code></pre>
      <p>A simple implementation uses one <a href="/docs/core/pda">Program Derived Address (PDA)</a> or bitmap entry per leaf index to prevent double claims. A PDA is a deterministic address controlled by a program instead of a user's private key. The claim <a href="/docs/core/instructions">instruction</a> recomputes the leaf hash, verifies the Merkle proof against the stored root, transfers or mints the exact SPL amount, and then records the claim status before returning.</p>
      <pre><code class="language-rust">pub fn claim(
    ctx: Context&lt;Claim&gt;,
    index: u64,
    amount: u64,
    proof: Vec&lt;[u8; 32]&gt;,
) -&gt; Result&lt;()&gt; {
    require!(!ctx.accounts.claim_status.claimed, ClaimError::AlreadyClaimed);
    require!(
        verify_proof(
            ctx.accounts.distributor.merkle_root,
            hash_leaf(index, ctx.accounts.recipient.key(), amount),
            &amp;proof,
        ),
        ClaimError::InvalidProof
    );

    transfer_from_vault(&amp;ctx, amount)?;
    ctx.accounts.claim_status.claimed = true;
    Ok(())
}</code></pre>
      <h3>Why this architecture is usually better</h3>
      <ul>
        <li>You only need one canonical balance export, not a live cross-chain relay after shutdown.</li>
        <li>Anyone can audit the published claims file and recompute the Merkle root before launch.</li>
        <li>The on-chain program stays small: proof verification, token release, and replay protection.</li>
        <li>Support operations get simpler because each failed claim is tied to a specific leaf, proof, and recipient address.</li>
      </ul>
      <h3>Unclaimed token policy</h3>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Policy</th>
              <th>Description</th>
              <th>Tradeoff</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Burn</td><td>Unclaimed balances disappear after the window.</td><td>Simple but punitive.</td></tr>
            <tr><td>Community treasury</td><td>Unclaimed balances move to multisig or DAO control.</td><td>Flexible but politically sensitive.</td></tr>
            <tr><td>Extended claim escrow</td><td>Hold balances for a longer claim period under a governed escrow.</td><td>User-friendly but more operational work.</td></tr>
          </tbody>
        </table>
      </div>
      <p>A long escrow-based claim window is usually the least hostile choice for real users.</p>
    `,
  },
  {
    id: "launching-on-solana",
    navLabel: "6. Launching on Solana",
    tone: "phase",
    html: `
      <h2>6. Phase 3: Launching on Solana</h2>
      <h3>Create the SPL token</h3>
      <p>An <a href="/docs/tokens">SPL token</a> has a <a href="/docs/tokens#mint-account">mint account</a> that defines the token's decimals, supply controls, and authorities. Match the migrated token's precision deliberately, and decide whether you need the standard <a href="/docs/references/terminology#token-program">Token Program</a> or <a href="/docs/tokens/extensions">Token Extensions</a> for features such as transfer fees, metadata, or compliance controls.</p>
      <pre><code class="language-bash">solana-keygen new --outfile migration-authority.json
solana config set --keypair migration-authority.json
solana config set --url mainnet-beta

spl-token create-token --decimals 6 &gt; token_address.txt</code></pre>
      <p><a href="/docs/references/terminology#cluster">mainnet-beta</a> is Solana's production cluster. Rehearse the full launch on a local validator or devnet before you run these commands for real.</p>
      <h3>Add metadata</h3>
      <p>Without <a href="/docs/tokens/metaplex">token metadata</a>, wallets and aggregators will show an opaque mint address. Fix this before you send users to the new chain.</p>
      <pre><code class="language-typescript">await createFungible(umi, {
  mint: publicKey(MINT_ADDRESS),
  name: "Your Token Name",
  symbol: "TKN",
  uri: "https://your-metadata-server.com/token.json",
  sellerFeeBasisPoints: { basisPoints: 0n, identifier: "%", decimals: 2 },
  decimals: 6,
  isMutable: true,
}).sendAndConfirm(umi);</code></pre>
      <pre><code class="language-json">{
  "name": "Your Token Name",
  "symbol": "TKN",
  "description": "Migrated from CHAIN_NAME Cosmos chain to Solana.",
  "image": "https://your-metadata-server.com/logo.png",
  "external_url": "https://yourproject.com"
}</code></pre>
      <h3>Mint supply and lock authorities deliberately</h3>
      <pre><code class="language-bash">spl-token create-account MINT_ADDRESS
spl-token mint MINT_ADDRESS 1000000000
spl-token authorize MINT_ADDRESS mint --disable
spl-token authorize MINT_ADDRESS freeze --disable</code></pre>
      <p>A mint authority can create more tokens, and a freeze authority can freeze token accounts. Only revoke these <a href="/docs/references/terminology#authority">authorities</a> after you verify supply, vault custody, and operational signers. Disabling them is a one-way action.</p>
      <h3>Multisig, token lists, and liquidity</h3>
      <ul>
        <li>Move treasury and migration vault control to a multisig such as <a href="https://squads.xyz" target="_blank" rel="noreferrer">Squads</a>.</li>
        <li>Submit token metadata to the venues and registries your users will rely on.</li>
        <li>Seed at least one meaningful liquidity venue before the migration rush begins.</li>
      </ul>
    `,
  },
  {
    id: "program-migration",
    navLabel: "7. Programs",
    tone: "phase",
    html: `
      <h2>7. Phase 4: Smart Contract / Program Migration</h2>
      <p>The contract rewrite itself is covered in the <a href="/developers/migrate-to-solana/cosmos/cosmwasm">CosmWasm migration guide</a>. Operationally, this phase is about deciding which live chain state must survive and how it will be represented as Solana accounts.</p>
      <h3>Categorize every contract and module</h3>
      <pre><code class="language-text">Category A - Migrate with state
Category B - Migrate logic only
Category C - Deprecate
Category D - Replace with native Solana equivalents</code></pre>
      <p>For anything in Category A, design the target <a href="/docs/core/accounts">account layout</a> before writing migration jobs. Solana programs are stateless executables, so durable balances, positions, schedules, and configuration must live in accounts owned by the relevant program.</p>
      <h3>Vesting migration</h3>
      <p>Financial obligations such as vesting schedules need exact treatment. Export them explicitly and initialize equivalent Solana state, not ad-hoc spreadsheets. In <a href="/docs/references/terminology#anchor">Anchor</a>, a Rust framework for Solana programs, <code>#[account]</code> marks a struct that will be serialized into a Solana account.</p>
      <pre><code class="language-bash">cat final_state.json | jq '.app_state.wasm.contracts' | \
  python3 extract_vesting.py &gt; vesting_positions.json</code></pre>
      <pre><code class="language-rust">#[account]
pub struct VestingSchedule {
    pub recipient: Pubkey,
    pub total_amount: u64,
    pub start_timestamp: i64,
    pub end_timestamp: i64,
    pub claimed_amount: u64,
    pub bump: u8,
}</code></pre>
      <h3>NFT migration</h3>
      <ul>
        <li>Export token ownership and metadata dependencies.</li>
        <li>Pick the <a href="/docs/tokens/metaplex">Solana NFT or digital-asset standard</a> before writing claim logic.</li>
        <li>Preserve provenance and identifiers intentionally where external integrations depend on them.</li>
      </ul>
    `,
  },
  {
    id: "governance-migration",
    navLabel: "8. Governance",
    tone: "phase",
    html: `
      <h2>8. Phase 5: Governance Migration</h2>
      <p><a href="https://realms.today" target="_blank" rel="noreferrer">Realms</a> is the main DAO and treasury-management interface for Solana. It sits on top of <a href="https://github.com/solana-labs/solana-program-library/tree/master/governance" target="_blank" rel="noreferrer">SPL Governance</a>, the Solana governance program, and gives you proposal workflows, voting configuration, DAO treasuries, and governed execution for actions such as treasury transfers and <a href="/docs/core/programs/program-deployment">program upgrades</a>.</p>
      <p>If your Cosmos chain used on-chain governance for signaling, treasury control, or upgrade approval, the closest Solana-native destination is usually a Realm plus one or more governed treasuries. The migration is not one-to-one: Cosmos governance controls chain state, while Solana governance usually controls assets, program authorities, and operational workflows.</p>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Cosmos model</th>
              <th>Solana destination</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Text proposals</td><td>Snapshot or other off-chain governance process</td></tr>
            <tr><td>Parameter changes</td><td>Governed admin program or multisig-controlled program authority</td></tr>
            <tr><td>Upgrade proposals</td><td>Squads or similar controlled upgrade-authority flow</td></tr>
            <tr><td>Community pool</td><td>Realms or treasury multisig</td></tr>
          </tbody>
        </table>
      </div>
      <h3>How to migrate governance cleanly</h3>
      <ul>
        <li>Create the new DAO in Realms before or alongside token launch so treasury control and program authority do not live on a temporary signer longer than necessary.</li>
        <li>Decide whether governance power comes from the migrated community token, a council token, or a dual structure where a smaller council handles urgent operations.</li>
        <li>Move treasury assets, mint authority, freeze authority, and upgrade authority into governed accounts intentionally instead of leaving them on deployer wallets.</li>
        <li>Rewrite recurring Cosmos proposal types as explicit Solana actions: treasury transfers, parameter updates through admin programs, and program upgrades through governed execution.</li>
      </ul>
      <h3>Practical mapping</h3>
      <p>An upgrade authority is the signer allowed to replace an upgradeable Solana program's executable code. A Cosmos software-upgrade proposal usually becomes a Solana program-upgrade proposal after that authority is transferred into governance. Treasury and community-pool decisions usually become Realms treasury proposals executed by governed wallets.</p>
      <p>The main design choice is who can propose and who can veto. Many migrations start with a council-controlled Realm for safety, then expand toward broader token voting once the token, treasury, and program authorities are settled on Solana.</p>
    `,
  },
  {
    id: "user-migration",
    navLabel: "9. User Migration",
    tone: "phase",
    html: `
      <h2>9. Phase 6: User Migration &amp; Communication</h2>
      <h3>Communication plan</h3>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Channel</th>
              <th>Timing</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Blog post</td><td>Day 0</td><td>Full rationale, timeline, and migration mechanics</td></tr>
            <tr><td>Discord, Telegram, X</td><td>Day 0</td><td>Short-form announcement and reminder cadence</td></tr>
            <tr><td>Email</td><td>Day 0</td><td>Direct notice to known users and partners</td></tr>
            <tr><td>In-app banner</td><td>Day 0 to halt</td><td>Persistent countdown and migration CTA</td></tr>
            <tr><td>Validator and exchange outreach</td><td>Before public launch</td><td>Operational heads-up and cutover coordination</td></tr>
          </tbody>
        </table>
      </div>
      <h3>Migration portal requirements</h3>
      <ul>
        <li>Connect Cosmos and Solana wallets in the same flow.</li>
        <li>Show eligibility and claimable amount from the canonical snapshot.</li>
        <li>Support your chosen architecture: mapping-only, one-way bridge, or post-snapshot claim.</li>
        <li>Provide status tracking, transaction signatures, and a user-visible audit trail.</li>
      </ul>
      <p>The Rust example below is an Anchor-style claim instruction. It uses a <a href="/docs/core/cpi">Cross Program Invocation (CPI)</a>, which is how one Solana program calls another, to ask the SPL Token program to transfer tokens from the vault into the user's token account. The vault authority is a <a href="/docs/core/pda">PDA</a>, so the claim program can sign for the vault without holding a private key.</p>
      <pre><code class="language-rust">#[program]
pub mod migration_claim {
    use super::*;

    pub fn claim(ctx: Context&lt;Claim&gt;) -&gt; Result&lt;()&gt; {
        let claim_record = &amp;mut ctx.accounts.claim_record;
        require!(!claim_record.claimed, ClaimError::AlreadyClaimed);

        let amount = claim_record.amount;
        claim_record.claimed = true;

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.recipient_token_account.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                &[&amp;[b"vault_authority", &[ctx.bumps.vault_authority]]],
            ),
            amount,
        )?;

        Ok(())
    }
}</code></pre>
      <pre><code class="language-typescript">for (const [cosmosAddr, { solanaAddr, amount }] of Object.entries(snapshot)) {
  const recipientPubkey = new PublicKey(solanaAddr);
  const [claimPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("claim"), recipientPubkey.toBuffer()],
    CLAIM_PROGRAM_ID
  );

  await program.methods
    .initializeClaim(new anchor.BN(amount))
    .accounts({
      payer: teamWallet.publicKey,
      claimRecord: claimPda,
      recipient: recipientPubkey,
    })
    .rpc();
}</code></pre>
      <h3>Exchange coordination</h3>
      <p>Custodial platforms need the new mint address, conversion ratio, cutover date, test transaction, and a real technical contact. Large exchanges usually need more notice than your community does.</p>
    `,
  },
  {
    id: "decommissioning",
    navLabel: "10. Decommissioning",
    tone: "phase",
    html: `
      <h2>10. Phase 7: Decommissioning Cosmos Infrastructure</h2>
      <h3>Inventory everything first</h3>
      <p>On Solana, <a href="/docs/rpc">RPC</a> services expose account and transaction data to wallets, indexers, dashboards, and support tools. Keep enough Cosmos RPC, LCD, gRPC, and explorer infrastructure online for users to verify history while the Solana-side product becomes the source of truth.</p>
      <pre><code class="language-text">Validators:
  - primary validator
  - sentry nodes
  - seed nodes

API and RPC:
  - public RPC
  - LCD or REST
  - gRPC
  - websocket

Indexers and explorers:
  - Mintscan, Big Dipper, internal explorer

Relayers:
  - Hermes or Go Relayer instances

Storage and DNS:
  - databases
  - snapshots
  - subdomains</code></pre>
      <h3>Archive before shutdown</h3>
      <pre><code class="language-bash">tar -czf chain-archive-final-$(date +%Y%m%d).tar.gz ~/.chain/
aws s3 cp chain-archive-final-*.tar.gz s3://your-archive-bucket/

chaind export --height=HALT_HEIGHT &gt; final_state_archive.json
gzip final_state_archive.json
aws s3 cp final_state_archive.json.gz s3://your-archive-bucket/</code></pre>
      <p>These archives matter for legal support, user disputes, treasury auditability, and historical verification.</p>
      <h3>Decommissioning sequence</h3>
      <ol>
        <li>Stop relayers.</li>
        <li>Halt validators and export final state.</li>
        <li>Keep read-only RPC or LCD services alive long enough for users and explorers to query history.</li>
        <li>Redirect old application domains to the new Solana product.</li>
        <li>Move old infrastructure to an explicit archive or retirement state instead of silently killing it.</li>
      </ol>
      <h3>Registry and DNS cleanup</h3>
      <ul>
        <li>Update chain-registry and public docs to mark the chain as retired.</li>
        <li>Notify relayer operators and counterparties.</li>
        <li>Redirect or retire old RPC, LCD, and application domains on a known schedule.</li>
        <li>Mark old token identifiers as deprecated in market-data surfaces where possible.</li>
      </ul>
    `,
  },
  {
    id: "full-migration-checklist",
    navLabel: "11. Checklist",
    tone: "success",
    html: `
      <h2>11. Full Migration Checklist</h2>
      <h3>Decision and planning</h3>
      <ul>
        <li>Align internally on destination chain, migration scope, and halt window.</li>
        <li>Complete legal review and asset inventory.</li>
        <li>Classify contracts and modules as migrate, replace, or deprecate.</li>
        <li>Audit IBC channels, relayers, counterparties, validators, and exchange dependencies.</li>
      </ul>
      <h3>Community and communication</h3>
      <ul>
        <li>Publish a forum rationale before the binding governance action.</li>
        <li>Coordinate exchanges, validators, relayers, and counterparties before the public rush.</li>
        <li>Publish a repeated reminder schedule with exact dates and heights.</li>
      </ul>
      <h3>Cosmos shutdown</h3>
      <ul>
        <li>Set and verify the halt height across validators.</li>
        <li>Pause relayers and unwind IBC where needed.</li>
        <li>Export final state and derive the canonical balance and entitlement ledgers.</li>
        <li>Archive node data and state artifacts to durable storage.</li>
      </ul>
      <h3>SPL launch and migration mechanics</h3>
      <ul>
        <li>Create the token mint, metadata, treasury accounts, and multisig control plane.</li>
        <li>Choose the migration architecture: snapshot plus airdrop, one-way bridge, or supported third-party bridge.</li>
        <li>Define the unclaimed-token policy before launch.</li>
        <li>Deploy and rehearse the claim or bridge programs.</li>
      </ul>
      <h3>Governance migration</h3>
      <ul>
        <li>Create the new Realm, council, and governed treasury accounts before handing over critical authorities.</li>
        <li>Move mint authority, freeze authority, treasury control, and program upgrade authority into the chosen governance system.</li>
        <li>Decide which actions require token voting, council approval, or multisig execution during the transition period.</li>
      </ul>
      <h3>Programs and product migration</h3>
      <ul>
        <li>Recreate stateful obligations such as vesting, escrow, and rewards intentionally.</li>
        <li>Rewrite the frontend and support tooling for Solana wallets and transaction semantics.</li>
      </ul>
      <h3>Post-migration operations</h3>
      <ul>
        <li>Monitor claim completion rate and support queues.</li>
        <li>Publish a post-migration report with totals, deadlines, and leftover policy.</li>
        <li>Retire or archive remaining Cosmos infrastructure on a public schedule.</li>
      </ul>
    `,
  },
];

export const RESOURCE_CARD_DECK = {
  numCols: 3,
  featured: true,
  cards: [
    {
      type: "image",
      headingAs: "h3",
      heading: "Merkle Tree Token Claimer",
      body: "Reference implementation for a snapshot-driven token migration using a Merkle root, funded claim vault, and onchain proof verification.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://github.com/brimigs/cosmos-migration-guide/tree/main/example-merkle-token-claimer",
        label: "Open example",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Realms Governance",
      body: "Use this when deciding how token voting, treasury control, and proposal flow should live on Solana.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://realms.today",
        label: "Visit Realms",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Squads Protocol",
      body: "Use a multisig instead of a hot single signer for migration vaults, treasury control, and program upgrade authority.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://squads.xyz",
        label: "Open Squads",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
  ],
};
