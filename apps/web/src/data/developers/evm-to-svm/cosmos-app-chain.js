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
    body: "A Cosmos app-chain migration is not a chain upgrade. You are decommissioning an L1, exporting the obligations it held, then relaunching the product, token, and operational model on Solana with new security, liquidity, and user-experience assumptions.",
  },
  cards: [
    {
      number: "01",
      title: "Plan the shutdown before the rewrite",
      body: "Governance, validator coordination, IBC cutoffs, exchange notice, and archival strategy need to be locked before the destination programs are final.",
    },
    {
      number: "02",
      title: "Separate token migration from product migration",
      body: "Snapshot rules, claim flows, bridge mechanics, and unclaimed-token policy should be explicit projects with their own operators and support playbooks.",
    },
    {
      number: "03",
      title: "Launch on Solana like a production cutover",
      body: "The mint, metadata, vault authorities, claim programs, liquidity, governance, and user comms all need to go live in a sequence you can rehearse and defend.",
    },
  ],
};

export const RUNBOOK_SECTIONS = [
  {
    id: "why-teams-leave",
    navLabel: "1. Why Teams Leave",
    tone: "note",
    html: `
      <h2>1. Why Teams Leave Cosmos: Patterns &amp; Lessons</h2>
      <p>Understanding why other teams migrated or evaluated migration helps you frame your own decision honestly. Most successful moves start with a clear articulation of why the old chain no longer serves the product.</p>
      <h3>Common reasons cited</h3>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Reason</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Weak economic security or small validator set</td><td>Akash framed Cosmos app-chain security as insufficient for its target workloads.</td></tr>
            <tr><td>Infrastructure maintenance overhead</td><td>Teams conclude that running an independent chain pulls focus away from the product.</td></tr>
            <tr><td>Liquidity fragmentation</td><td>Standalone chains struggle to sustain deep token liquidity and composability.</td></tr>
            <tr><td>Developer ecosystem size</td><td>Solana attracts more tooling, client libraries, managed infra, and wallet integrations.</td></tr>
            <tr><td>User experience</td><td>Wallet onboarding and transaction UX are often easier on Solana for mainstream users.</td></tr>
            <tr><td>Enterprise or B2B demands</td><td>Some teams need stronger settlement guarantees and deeper infra support.</td></tr>
            <tr><td>Token liquidity</td><td>Thin order books and fewer venues constrain distribution and treasury strategy.</td></tr>
          </tbody>
        </table>
      </div>
      <h3>What worked in prior migrations</h3>
      <ul>
        <li>One-way migration windows with a public deadline and exchange coordination created urgency and high completion rates.</li>
        <li>Public request-for-proposal or evaluation processes gave the community a real decision framework instead of a hand-wavy announcement.</li>
        <li>Long notice periods of 60 to 90 days reduced stranded balances and support chaos.</li>
        <li>Archiving chain state preserved auditability and historical support data.</li>
      </ul>
      <h3>What failed</h3>
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
            <tr><td>Developer ecosystem</td><td>Are the tools mature enough for your roadmap?</td><td>Strong around Anchor, RPC providers, indexers, wallets, and payment rails.</td></tr>
            <tr><td>User base</td><td>Do your target users already live here?</td><td>Often strong for consumer, trading, payments, and NFT-adjacent products.</td></tr>
            <tr><td>IBC compatibility</td><td>Do you still need native Cosmos interoperability after migration?</td><td>Limited. You need bridge or custom interoperability design.</td></tr>
            <tr><td>Smart contract model</td><td>Can the product survive a rewrite to the account model?</td><td>Good if you can re-architect; poor if you need CosmWasm patterns unchanged.</td></tr>
            <tr><td>Transaction fees</td><td>Can your users afford frequent activity?</td><td>Very low nominal fees.</td></tr>
            <tr><td>Community fit</td><td>Will your community actually follow you?</td><td>Depends on vertical, wallet habits, and token-holder expectations.</td></tr>
          </tbody>
        </table>
      </div>
      <h3>When Solana is not the right choice</h3>
      <ul>
        <li>Your product depends heavily on native IBC interoperability with multiple Cosmos chains.</li>
        <li>You need Cosmos governance modules or staking semantics without redesign.</li>
        <li>Your user base is committed to Cosmos tooling and unlikely to bridge ecosystems.</li>
        <li>Your team cannot afford the account-model rewrite and client rewrite the move requires.</li>
      </ul>
      <p>If your main goal is SVM execution without a full retreat from Cosmos-adjacent ideas, evaluate SVM-based chains or rollups before committing to a full chain shutdown.</p>
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
      <p>Choose the migration architecture deliberately. The right answer depends on community size, address mapping strategy, and whether you want a pre-halt migration window.</p>
      <h3>Architecture A: Snapshot plus airdrop</h3>
      <p>Take a final snapshot, map Cosmos addresses to Solana addresses, then distribute SPL balances 1:1. This is the simplest operationally, but it requires a clean address-mapping process.</p>
      <pre><code class="language-bash">spl-token create-token --decimals 6

# Bulk transfer once wallet mapping is complete
spl-token transfer MINT_ADDRESS AMOUNT RECIPIENT_SOLANA_ADDRESS \
  --fund-recipient \
  --allow-unfunded-recipient</code></pre>
      <h3>Architecture B: One-way bridge</h3>
      <p>Open a pre-halt migration window where users lock or burn Cosmos tokens and receive equivalent SPL balances on Solana. This is heavier operationally but better for large distributions.</p>
      <pre><code class="language-rust">ExecuteMsg::MigrateTokens { solana_address } =&gt; {
    ensure!(env.block.height &lt; MIGRATION_CLOSE_HEIGHT, ContractError::MigrationClosed {});

    let sol_addr_bytes = bs58::decode(&solana_address)
        .into_vec()
        .map_err(|_| ContractError::InvalidSolanaAddress {})?;
    ensure!(sol_addr_bytes.len() == 32, ContractError::InvalidSolanaAddress {});

    let token_amount = info.funds.iter()
        .find(|c| c.denom == NATIVE_DENOM)
        .ok_or(ContractError::NoFundsProvided {})?
        .amount;

    Ok(Response::new()
        .add_attribute("action", "migrate_tokens")
        .add_attribute("solana_recipient", solana_address)
        .add_attribute("amount", token_amount))}</code></pre>
      <pre><code class="language-typescript">for (const event of events) {
  const recipientPubkey = new PublicKey(event.solana_recipient);
  await transferSPLTokens(recipientPubkey, BigInt(event.amount), event.event_id);
  await cosmosClient.execute(BRIDGE_CONTRACT, {
    mark_processed: { event_id: event.event_id }
  }, "auto");
}</code></pre>
      <h3>Architecture C: Third-party bridge</h3>
      <p>Bridge infrastructure such as Wormhole can reduce custom relayer work, but only while the source chain is alive and only if your chain is supported. Treat this as a pre-halt path, not a permanent fallback after shutdown.</p>
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
      <pre><code class="language-bash">solana-keygen new --outfile migration-authority.json
solana config set --keypair migration-authority.json
solana config set --url mainnet-beta

spl-token create-token --decimals 6 &gt; token_address.txt</code></pre>
      <h3>Add metadata</h3>
      <p>Without token metadata, wallets and aggregators will show an opaque mint address. Fix this before you send users to the new chain.</p>
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
      <p>Only revoke mint and freeze authorities after you verify supply, vault custody, and operational signers. These are one-way actions.</p>
      <h3>Multisig, token lists, and liquidity</h3>
      <ul>
        <li>Move treasury and migration vault control to a multisig such as Squads.</li>
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
      <p>The contract rewrite itself is a separate guide. Operationally, this phase is about deciding which live chain state must survive and how it will be represented on Solana.</p>
      <h3>Categorize every contract and module</h3>
      <pre><code class="language-text">Category A - Migrate with state
Category B - Migrate logic only
Category C - Deprecate
Category D - Replace with native Solana equivalents</code></pre>
      <h3>Vesting migration</h3>
      <p>Financial obligations such as vesting schedules need exact treatment. Export them explicitly and initialize equivalent Solana state, not ad-hoc spreadsheets.</p>
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
      <h3>Governance migration</h3>
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
            <tr><td>Upgrade proposals</td><td>Squads or similar controlled authority flow</td></tr>
            <tr><td>Community pool</td><td>Realms or treasury multisig</td></tr>
          </tbody>
        </table>
      </div>
      <h3>NFT migration</h3>
      <ul>
        <li>Export token ownership and metadata dependencies.</li>
        <li>Pick the Solana NFT or digital-asset standard before writing claim logic.</li>
        <li>Preserve provenance and identifiers intentionally where external integrations depend on them.</li>
      </ul>
    `,
  },
  {
    id: "user-migration",
    navLabel: "8. User Migration",
    tone: "phase",
    html: `
      <h2>8. Phase 5: User Migration &amp; Communication</h2>
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
        <li>Provide status tracking and a user-visible audit trail.</li>
      </ul>
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
      <p>Custodial platforms need the new mint address, the conversion ratio, the cutover date, a test transaction, and a real technical contact. Large exchanges usually need more notice than your community does.</p>
    `,
  },
  {
    id: "decommissioning",
    navLabel: "9. Decommissioning",
    tone: "phase",
    html: `
      <h2>9. Phase 6: Decommissioning Cosmos Infrastructure</h2>
      <h3>Inventory everything first</h3>
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
    id: "case-studies",
    navLabel: "10. Case Studies",
    tone: "default",
    html: `
      <h2>10. Case Studies</h2>
      <h3>Nillion</h3>
      <p>Nillion used a one-way migration window with a public deadline and exchange coordination. The lesson is that hard deadlines can work when the UX is clear and custodial platforms are aligned.</p>
      <h3>Akash</h3>
      <p>Akash's public evaluation process made the security and ecosystem tradeoffs visible. The lesson is that chain selection criteria should be explicit, especially if staking and governance models change materially.</p>
      <h3>Broader 2025 pattern</h3>
      <p>Multiple smaller app chains discovered that sovereign-chain overhead was too expensive relative to their activity and liquidity. The recurring lesson is that app-chain maintenance is a strategic choice, not a free default.</p>
      <h3>Operational takeaways</h3>
      <ul>
        <li>Large migrations need exchange coordination and a public migration window.</li>
        <li>Hard deadlines are effective only if the user journey is obvious and well-supported.</li>
        <li>Security and liquidity arguments resonate best when backed by concrete comparisons.</li>
        <li>Teams that archive state and publish auditable artifacts preserve trust.</li>
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
        <li>Create the mint, metadata, treasury accounts, and multisig control plane.</li>
        <li>Choose the migration architecture: snapshot plus airdrop, one-way bridge, or supported third-party bridge.</li>
        <li>Define the unclaimed-token policy before launch.</li>
        <li>Deploy and rehearse the claim or bridge programs.</li>
      </ul>
      <h3>Programs and product migration</h3>
      <ul>
        <li>Recreate stateful obligations such as vesting, escrow, and rewards intentionally.</li>
        <li>Move governance to Realms, a multisig, or another explicit Solana governance model.</li>
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
      heading: "Nillion Sunset Coverage",
      body: "Useful reference for a public shutdown narrative and one-way token migration framing.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://thedefiant.io/news/blockchains/nillion-nilchain-leaves-cosmos-for-ethereum",
        label: "Read article",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Akash Migration Context",
      body: "Reference point for public chain-selection criteria, security arguments, and migration caution.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://www.theblock.co/post/374318/akash-network-to-deprecate-its-cosmos-chain-begin-search-for-new-network",
        label: "Read article",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Cosmos Halt Configuration",
      body: "Keep the official halt-height and shutdown configuration docs open while coordinating validators.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://docs.cosmos.network/main/learn/advanced/config",
        label: "Read docs",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Portal Bridge",
      body: "Review third-party bridge assumptions before choosing it as part of the pre-halt migration path.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://portalbridge.com/",
        label: "Open bridge site",
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
      body: "Use a multisig instead of a hot single signer for migration vaults, treasury control, and upgrade authority.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://squads.so",
        label: "Open Squads",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
  ],
};
