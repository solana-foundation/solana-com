const CONTENT_BLOCK_STYLE_KEYS = {
  spacing: "spacing",
  spacingWithMargins: "spacingWithMargins",
  spacingNoBottom: "spacingNoBottom",
  spacingLastBlock: "spacingLastBlock",
  smallOnly: "smallOnly",
  cardDeckWrapper: "cardDeckWrapper",
  tableWrapper: "tableWrapper",
};

/** @type {Record<string, import("@/component-library/responsive-box").ResponsiveStyles>} */
export const BLOCK_STYLES = {
  [CONTENT_BLOCK_STYLE_KEYS.spacing]: {
    large: { paddingTop: "20px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacingWithMargins]: {
    large: { paddingTop: "20px", marginTop: "auto", marginBottom: "auto" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacingNoBottom]: {
    large: { paddingTop: "20px", paddingBottom: "0px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacingLastBlock]: {
    large: { paddingTop: "20px", paddingBottom: "48px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.smallOnly]: {
    large: { display: "none" },
    medium: { display: "none" },
    small: { display: "flex" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.cardDeckWrapper]: {
    large: { paddingTop: "0px", marginTop: "-3px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.tableWrapper]: {
    large: { paddingTop: "20px", overflowX: "auto" },
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
    eyebrow: "Runbook framing",
    title: "This is a product migration, not a chain upgrade.",
    body: "You are retiring a Cosmos app-chain and moving users, assets, and application state into Solana programs. There is no one-step path, so the shutdown plan, state transformation pipeline, and Solana launch plan have to ship together.",
  },
  cards: [
    {
      number: "01",
      title: "Shut down the Cosmos chain safely",
      body: "Freeze inflows, coordinate governance, halt at an exact height, and produce signed export artifacts you can defend later.",
    },
    {
      number: "02",
      title: "Transform Cosmos state into Solana manifests",
      body: "Normalize balances, vesting, identity links, and protocol state into explicit migration artifacts before anything touches Solana.",
    },
    {
      number: "03",
      title: "Launch the Solana product and move users over",
      body: "Deploy programs, initialize mints and PDAs, open claims or wallet-linked allocations, and monitor cutover like a product launch.",
    },
  ],
};

export const RUNBOOK_SECTIONS = [
  {
    id: "overview",
    navLabel: "Overview",
    tone: "overview",
    html: `
      <h2>Overview</h2>
      <p>This runbook assumes you want to preserve product continuity, not preserve the Cosmos chain itself. Treat the migration as a coordinated retirement-and-relaunch process with exact dates, exact heights, explicit asset policies, and reproducible export artifacts.</p>
      <p>There are three workstreams you cannot split apart:</p>
      <ol>
        <li>Shut down the Cosmos chain safely.</li>
        <li>Transform exported Cosmos state into a Solana-native data model.</li>
        <li>Launch the Solana product and migrate users, balances, and application state.</li>
      </ol>
    `,
  },
  {
    id: "how-to-use-the-examples",
    navLabel: "How to Use the Examples",
    tone: "note",
    html: `
      <h2>How to Use the Examples</h2>
      <p>The examples on this page are templates, not drop-in commands for every Cosmos chain.</p>
      <ul>
        <li>Replace <code>&lt;daemon&gt;</code>, <code>&lt;chain-id&gt;</code>, <code>&lt;halt-height&gt;</code>, <code>&lt;mint&gt;</code>, and <code>&lt;program-id&gt;</code> with your real values.</li>
        <li>Verify your chain's actual CLI in <code>cmd/&lt;daemon&gt;/root.go</code> and with <code>&lt;daemon&gt; --help</code> before you run anything.</li>
        <li>Expect to adapt export-parsing examples if your chain added custom modules or changed SDK defaults.</li>
        <li>Treat Solana program examples as reference implementations for migration patterns such as claim receipts, PDA-owned state, batched writes, and token distribution.</li>
      </ul>
    `,
  },
  {
    id: "execution-model-differences",
    navLabel: "Execution Model Differences",
    tone: "default",
    html: `
      <h2>Execution Model Differences</h2>
      <p>Treat this migration as an execution-model rewrite, not a deployment target change.</p>
      <ul>
        <li>A Cosmos SDK app chain is an application behind ABCI. CometBFT handles networking and consensus; the application owns state transitions.</li>
        <li>In Cosmos SDK v0.50+, ABCI 2.0 adds <code>FinalizeBlock</code>, and the SDK's execution flow runs begin-block logic, transactions, and end-block logic inside that finalization path.</li>
        <li>Cosmos state is module-scoped key/value state committed into the chain's <code>AppHash</code>. Do not build migration tooling around a store backend assumption unless you verified the chain version and store implementation.</li>
        <li>Solana separates executable program accounts from mutable data accounts. Programs are deployed once and manage many owned data accounts.</li>
        <li>Solana parallelizes execution when transactions do not contend on writable accounts. Hot writable accounts and oversized one-shot migration transactions become bottlenecks quickly.</li>
      </ul>
      <p>Inference from the platform models: because Cosmos apps are module-based state machines with lifecycle hooks, and Solana changes state only through transactions and instructions, any automatic per-block product logic on Cosmos must become explicit Solana instructions or off-chain automation.</p>
    `,
  },
  {
    id: "what-changes-architecturally",
    navLabel: "Architecture Changes",
    tone: "default",
    html: `
      <h2>What Changes Architecturally</h2>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Cosmos app-chain</th>
              <th>Solana</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Your app is its own blockchain, validator set, and fee market. Cosmos SDK applications are deterministic state machines wired in <code>app.go</code>, with modules and lifecycle hooks like <code>BeginBlock</code> and <code>EndBlock</code>.</td>
              <td>Your app becomes one or more programs on a shared L1. State lives in accounts, each account has an owner program, and transactions execute atomically.</td>
            </tr>
            <tr>
              <td>User-facing addresses are Bech32. Validator operator and consensus addresses are separate address types.</td>
              <td>Addresses are 32-byte public keys or PDAs. Wallets use Ed25519 keypairs; PDAs are deterministic off-curve addresses controlled by programs.</td>
            </tr>
            <tr>
              <td>Assets may exist as native staking denoms, bank balances, vesting positions, IBC vouchers, and module-owned state.</td>
              <td>Assets are SPL tokens. A mint defines the token, and each owner needs a token account or ATA for that mint.</td>
            </tr>
            <tr>
              <td>IBC gives you channels, clients, and packet state.</td>
              <td>There is no IBC-equivalent built into Solana. Any cross-chain connectivity becomes a separate bridge or interoperability project.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: "non-negotiable-facts",
    navLabel: "Non-Negotiable Facts",
    tone: "warning",
    html: `
      <h2>Non-Negotiable Facts Before You Start</h2>
      <ul>
        <li>You cannot translate Cosmos wallet addresses directly into Solana wallet addresses. Plan a wallet-linking or claim flow.</li>
        <li>You cannot close ICS-20 transfer channels as your main shutdown mechanism. The transfer module does not support channel closure; you have to drain and disable flows before halt.</li>
        <li>If IBC vouchers remain outstanding on other chains, users may lose the ability to unwind them back to origin if you let the relevant route die.</li>
        <li>Your Cosmos validator set does not migrate as app-level security on Solana. Any validator-set-controlled permissions, staking security, or governance model has to be redesigned explicitly.</li>
        <li>Your existing Cosmos module logic does not port directly. A Solana program manages explicit accounts and instruction flows.</li>
        <li>Solana imposes hard state and transaction constraints you must design around: account rent, account size, transaction size, account count, and compute budget.</li>
      </ul>
    `,
  },
  {
    id: "phase-1-freeze-the-migration-scope",
    navLabel: "Phase 1: Freeze Scope",
    tone: "phase",
    html: `
      <h2>Phase 1: Freeze the Migration Scope</h2>
      <p>Do this before you write Solana code.</p>
      <ul>
        <li>Freeze the feature set you are migrating. Do not combine a chain migration with a large product redesign unless you are willing to run both risks at once.</li>
        <li>Pick the migration date, final snapshot height policy, and post-snapshot support policy.</li>
        <li>Decide what continuity means: same token economics and new chain, same users and balances with a different token model, same app state with a new execution environment, or governance reset.</li>
        <li>Decide whether the Cosmos chain will halt permanently, halt after a claim period, or remain online in read-only or archive mode.</li>
      </ul>
      <h3>Produce these artifacts now</h3>
      <ul>
        <li>A module inventory</li>
        <li>A state inventory</li>
        <li>A user-impact matrix</li>
        <li>A token migration policy</li>
        <li>A cutover calendar with absolute dates and heights</li>
      </ul>
      <h3>Decision checklist</h3>
      <ul>
        <li>Will users link Solana wallets before shutdown, claim after shutdown, or both?</li>
        <li>Will you migrate liquid balances only, or liquid plus staked plus pending rewards?</li>
        <li>Will vesting be preserved exactly, partially, or collapsed into liquid balances?</li>
        <li>Will governance rights, DAO balances, or protocol permissions carry over?</li>
        <li>Will any CosmWasm contracts or custom modules be ported, or are they being sunset?</li>
        <li>What happens to unclaimed allocations at the end of the claim window?</li>
      </ul>
    `,
  },
  {
    id: "phase-2-inventory-the-cosmos-side",
    navLabel: "Phase 2: Inventory Cosmos",
    tone: "phase",
    html: `
      <h2>Phase 2: Inventory Everything on the Cosmos Side</h2>
      <p>Start from the chain source, not from UI assumptions.</p>
      <h3>Chain and module inventory</h3>
      <p>Inspect these files first:</p>
      <ul>
        <li><code>app/app.go</code>: every module you actually run</li>
        <li><code>app/export.go</code>: how the chain exports state and validators</li>
        <li><code>app/upgrades.go</code>: any prior migration or halt logic</li>
        <li><code>cmd/&lt;daemon&gt;/root.go</code>: the real CLI subcommands your binary exposes</li>
        <li><code>x/*</code>: all custom module state and message paths</li>
      </ul>
      <pre><code class="language-sh">DAEMON=mychaind

"$DAEMON" --help
"$DAEMON" query --help
"$DAEMON" tx --help
"$DAEMON" export --help

rg -n "ExportAppStateAndValidators|SetUpgradeHandler|MsgSoftwareUpgrade" app/ cmd/ x/</code></pre>
      <pre><code class="language-sh">rg -n "module.NewManager\\(|NewAppModule\\(" app/
rg -n "StoreKey|KVStoreKey|MemoryStoreKey" app/
rg -n "BeginBlock|EndBlock|PreBlock|InitGenesis" x/ app/</code></pre>
      <h3>State inventory</h3>
      <p>Capture every state domain you need to preserve, unwind, or explicitly discard:</p>
      <ul>
        <li>User balances</li>
        <li>Staking positions, rewards, commissions, and unbondings</li>
        <li>Vesting accounts and lockups</li>
        <li>Governance proposals, votes, deposits, and authorities</li>
        <li>Authz and fee grants</li>
        <li>IBC clients, connections, channels, packet commitments, and voucher supplies</li>
        <li>Denom metadata and IBC traces</li>
        <li>NFTs</li>
        <li>Module accounts and protocol-owned balances</li>
        <li>Oracle, AMM, lending, perp, or app-specific custom module state</li>
        <li>CosmWasm code IDs, contract instances, and contract state if your chain uses CosmWasm</li>
      </ul>
      <p>Do not rely on one export artifact alone. Pull a final state export, full node data and snapshots for audit recovery, indexer data if your product depends on derived views, a separate balance ledger for human verification, and a separate entitlement ledger for claims, vesting, and rewards.</p>
      <pre><code class="language-sh">DENOM=umy

jq -r '
  .app_state.bank.balances[]
  | .address as $address
  | .coins[]?
  | select(.denom == env.DENOM)
  | [$address, .denom, .amount]
  | @csv
' export.json &gt; balances.csv</code></pre>
      <pre><code class="language-sh">jq '
  .app_state.auth.accounts[]
  | select(."@type" | test("VestingAccount"))
' export.json &gt; vesting_accounts.json</code></pre>
    `,
  },
  {
    id: "phase-3-migrate-identities",
    navLabel: "Phase 3: Identity Migration",
    tone: "phase",
    html: `
      <h2>Phase 3: Decide How Users Will Migrate Identities</h2>
      <p>This is the first product decision that can invalidate the rest of the plan.</p>
      <h3>Identity facts</h3>
      <ul>
        <li>There is no direct key conversion from Cosmos user keys to Solana user keys.</li>
        <li>Even if a wallet app supports both ecosystems, the user's Cosmos and Solana addresses are still different.</li>
        <li>If you want deterministic user allocations at launch, collect Solana addresses before the Cosmos halt.</li>
      </ul>
      <h3>Three practical migration models</h3>
      <ol>
        <li><strong>Fresh-wallet claims:</strong> users connect a Solana wallet after launch and claim what they are owed from a snapshot.</li>
        <li><strong>Wallet linking before shutdown:</strong> users link a Solana address while the Cosmos chain is still live.</li>
        <li><strong>Custodial remapping:</strong> your backend migrates identities because the product already uses app accounts, email login, or custodial wallets.</li>
      </ol>
      <p>If your chain already runs CosmWasm or a custom module, pre-shutdown wallet linking is usually the cleanest path. Record <code>cosmos_address -&gt; solana_pubkey</code> while users can still authenticate with the old wallet, then import that mapping into your Solana claim manifest.</p>
      <pre><code class="language-json">[
  {
    "cosmos_address": "cosmos1abc...",
    "solana_address": "8Yh9kQ6dW8oY6yYJ4Y3T5g7uLwM8cR8bN3xj7v8w2iQm",
    "link_height": 1234567,
    "link_tx_hash": "4C7D...A1",
    "linked_at": "2026-03-15T18:22:03Z"
  }
]</code></pre>
      <h3>Advanced path: post-halt secp256k1 claims</h3>
      <p>This is possible, but it is higher risk than pre-halt registration.</p>
      <ul>
        <li>Solana has a native secp256k1 verification precompile.</li>
        <li>Your claim system has to define a canonical message, verify the secp256k1 proof, and map the recovered key material to the snapshot identity you exported from Cosmos.</li>
        <li>Replay protection matters. Include domain separation, the recipient Solana address, and the claim context in the signed message.</li>
      </ul>
    `,
  },
  {
    id: "phase-4-design-the-solana-state-model",
    navLabel: "Phase 4: Solana State Model",
    tone: "phase",
    html: `
      <h2>Phase 4: Design the Solana State Model Before You Export Anything</h2>
      <p>Do not export Cosmos data into JSON and then ask later where it goes on Solana. Define the destination first.</p>
      <h3>Solana model constraints you must design around</h3>
      <ul>
        <li>All persistent state lives in accounts.</li>
        <li>Only the owning program can mutate an account's data or debit lamports from it.</li>
        <li>Every account must hold enough lamports to remain rent-exempt.</li>
        <li>Account data is capped at 10 MiB.</li>
        <li>Transactions are atomic, capped at 1,232 bytes, and usually limited to 64 accounts unless you use v0 transactions and Address Lookup Tables.</li>
        <li>Default compute is 200,000 CUs per non-builtin instruction and 1.4 million CUs max per transaction.</li>
      </ul>
      <h3>Solana modeling decisions</h3>
      <ul>
        <li>Which data becomes a PDA</li>
        <li>Which data becomes a token mint</li>
        <li>Which data becomes a token account or ATA</li>
        <li>Which data stays off-chain and is only proven on-chain when needed</li>
        <li>Which state is immutable at migration time versus mutable after launch</li>
        <li>Which authorities control upgrades, minting, freezing, and admin actions</li>
      </ul>
      <pre><code class="language-rust">pub const MIGRATION_CONFIG_SEED: &amp;[u8] = b"migration-config";
pub const CLAIM_RECEIPT_SEED: &amp;[u8] = b"claim-receipt";

#[repr(C)]
pub struct MigrationConfig {
    pub admin: Pubkey,
    pub mint: Pubkey,
    pub treasury: Pubkey,
    pub merkle_root: [u8; 32],
    pub snapshot_height: u64,
    pub claims_open: bool,
    pub bump: u8,
}

#[repr(C)]
pub struct ClaimReceipt {
    pub claimant: Pubkey,
    pub snapshot_index: u64,
    pub amount: u64,
    pub claimed_at_slot: u64,
    pub bump: u8,
}</code></pre>
      <pre><code class="language-text">MigrationConfig PDA: ["migration-config"]
Treasury PDA:        ["treasury", mint_pubkey]
ClaimReceipt PDA:    ["claim-receipt", claimant_pubkey, snapshot_index_le_bytes]
UserState PDA:       ["user-state", claimant_pubkey]</code></pre>
      <h3>Common Cosmos-to-Solana mapping patterns</h3>
      <table>
        <thead>
          <tr>
            <th>Cosmos concept</th>
            <th>Typical Solana replacement</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Native chain denom</td><td>SPL mint</td></tr>
          <tr><td>Bank balance</td><td>Token account balance or PDA-held balance</td></tr>
          <tr><td>Module account</td><td>Program-owned PDA</td></tr>
          <tr><td>Validator-set-controlled app behavior</td><td>Program authority, multisig, DAO, or off-chain ops flow</td></tr>
          <tr><td>BeginBlock / EndBlock logic</td><td>Explicit instructions, lazy settlement, or off-chain cranks</td></tr>
          <tr><td>IBC vouchers and traces</td><td>Usually unwind before migration; otherwise explicit redemption policy</td></tr>
          <tr><td>CosmWasm contract state</td><td>Custom program accounts</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    id: "phase-5-design-token-migration",
    navLabel: "Phase 5: Token Migration",
    tone: "phase",
    html: `
      <h2>Phase 5: Design Token Migration Separately From Product State Migration</h2>
      <p>Treat token migration as its own project.</p>
      <h3>Decide the token standard</h3>
      <p>Use the original Token Program unless you need a Token-2022 extension. Choose Token-2022 only for a specific feature-driven reason, not because it sounds newer.</p>
      <h3>Decide the token migration policy</h3>
      <ul>
        <li>Is the Cosmos native token becoming one SPL mint?</li>
        <li>Are staking derivatives, LP shares, escrow receipts, or vouchers becoming separate mints?</li>
        <li>Are decimals preserved?</li>
        <li>Are balances migrated 1:1, scaled, or partially redeemed?</li>
        <li>Is there a claim period after which unclaimed balances are burned, escrowed, or reassigned?</li>
        <li>Who pays to create ATAs for recipients?</li>
      </ul>
      <pre><code class="language-sh">mkdir -p ./keys
solana config set --url https://api.devnet.solana.com
solana-keygen new --outfile ./keys/migration-authority.json

spl-token create-token --decimals 6
# save the mint address from the output

spl-token create-account &lt;MINT_ADDRESS&gt;
spl-token mint &lt;MINT_ADDRESS&gt; 1000</code></pre>
      <pre><code class="language-sh">spl-token create-account &lt;MINT_ADDRESS&gt; --owner &lt;RECIPIENT_SOLANA_ADDRESS&gt;
spl-token mint &lt;MINT_ADDRESS&gt; &lt;AMOUNT_IN_BASE_UNITS&gt; -- &lt;RECIPIENT_TOKEN_ACCOUNT&gt;</code></pre>
      <h3>Treat IBC assets as a shutdown problem first</h3>
      <ul>
        <li>Stop new IBC deposits into your app chain.</li>
        <li>Stop new outbound IBC sends from your app chain at a declared cutoff.</li>
        <li>Drain outstanding routes while the chain is live.</li>
        <li>Publish the exact denom traces and redemption policy for any assets you will not support on Solana.</li>
      </ul>
      <pre><code class="language-sh">DAEMON=mychaind

"$DAEMON" query ibc channel channels --output json
"$DAEMON" query ibc-transfer denom-traces --output json
"$DAEMON" query ibc channel packet-commitments transfer channel-0 --output json
"$DAEMON" query ibc channel unreceived-packets transfer channel-0 --sequences 1,2,3 --output json</code></pre>
    `,
  },
  {
    id: "phase-6-build-the-cosmos-shutdown-plan",
    navLabel: "Phase 6: Shutdown Plan",
    tone: "phase",
    html: `
      <h2>Phase 6: Build the Cosmos Shutdown Plan</h2>
      <p>Shutting down a chain is operational work, governance work, and user communication work.</p>
      <h3>1. Publish the freeze schedule</h3>
      <p>Publish, at minimum, the final deposit date, final withdrawal date, final IBC send date, final governance action date, snapshot height or snapshot date, halt height, and Solana claim start date. Use exact calendar dates and exact block heights.</p>
      <p>Recommended governance sequence:</p>
      <ol>
        <li>Publish a non-binding signal proposal or governance discussion with the full migration plan.</li>
        <li>Publish the IBC cutoff schedule and all affected channel and asset policies.</li>
        <li>Submit the binding halt proposal with the exact <code>x/upgrade</code> plan name and halt height.</li>
      </ol>
      <pre><code class="language-sh">DAEMON=mychaind
"$DAEMON" query gov params --output json</code></pre>
      <h3>2. Disable inflows before halt</h3>
      <ul>
        <li>Disable front-end actions that create new long-lived state.</li>
        <li>Disable bridges and relayers you control.</li>
        <li>Disable market makers or bots that keep opening positions.</li>
        <li>Stop any cron or automation that creates protocol liabilities after the snapshot window.</li>
      </ul>
      <h3>3. Pass the halt proposal</h3>
      <p>For Cosmos SDK chains, the normal coordinated halt mechanism is <code>x/upgrade</code>.</p>
      <pre><code class="language-json">{
  "messages": [
    {
      "@type": "/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade",
      "authority": "&lt;GOV_MODULE_ADDRESS&gt;",
      "plan": {
        "name": "final-migration-halt",
        "height": "5000000",
        "info": "Permanent halt for Solana migration. See the public migration runbook for details."
      }
    }
  ],
  "metadata": "ipfs://&lt;MIGRATION_PLAN_CID&gt;",
  "deposit": "10000000utoken",
  "title": "Halt Chain for Solana Migration",
  "summary": "Halts the chain at the declared height so final state can be exported for migration."
}</code></pre>
      <p>Fallback if governance fails: a coordinated validator halt can still stop the chain if enough stake opts in, but treat this as contingency only.</p>
      <pre><code class="language-toml"># Common example only. Verify your chain and app version.
halt-height = 5000000
halt-time = 0</code></pre>
      <pre><code class="language-sh">mychaind start --halt-height=5000000</code></pre>
      <pre><code class="language-sh">mkdir -p release
cp ./build/mychaind ./release/
shasum -a 256 ./release/mychaind &gt; ./release/mychaind.sha256</code></pre>
      <h3>4. Export the final state</h3>
      <p>Use the export mechanism as your migration source of truth.</p>
      <pre><code class="language-sh">DAEMON=mychaind
HOME_DIR="$HOME/.mychain"
HALT_HEIGHT=1234567

"$DAEMON" status | jq '.sync_info.latest_block_height'
"$DAEMON" query upgrade current-plan
"$DAEMON" export --help

"$DAEMON" export --home "$HOME_DIR" --height "$HALT_HEIGHT" &gt; artifacts/export.json
cp "$HOME_DIR/config/genesis.json" artifacts/genesis.json
cp -R "$HOME_DIR/data" artifacts/data</code></pre>
      <pre><code class="language-sh">"$DAEMON" validate-genesis artifacts/export.json</code></pre>
      <pre><code class="language-sh">cd artifacts
shasum -a 256 export.json genesis.json &gt; SHA256SUMS

cat &gt; migration-manifest.json &lt;&lt;'EOF'
{
  "source_chain_id": "mychain-1",
  "snapshot_height": 1234567,
  "generated_at": "2026-04-02T18:30:00Z",
  "artifacts": [
    "export.json",
    "genesis.json",
    "SHA256SUMS"
  ]
}
EOF

gpg --detach-sign --armor migration-manifest.json</code></pre>
      <h3>5. Decide the old chain's final disposition</h3>
      <ul>
        <li>Fully off</li>
        <li>Archive RPC only</li>
        <li>Internal forensic archive only</li>
      </ul>
      <p>If you leave any public RPC up, label it clearly as retired and read-only.</p>
    `,
  },
  {
    id: "phase-7-transform-exported-state",
    navLabel: "Phase 7: Build Manifests",
    tone: "phase",
    html: `
      <h2>Phase 7: Transform Exported Cosmos State Into Solana Manifests</h2>
      <p>Do not feed the raw Cosmos export directly into Solana programs. Create explicit migration artifacts.</p>
      <h3>Minimum artifacts</h3>
      <ul>
        <li><code>balances.csv</code> or equivalent canonical ledger</li>
        <li><code>claims.json</code> or equivalent entitlement manifest</li>
        <li><code>wallet_links.json</code> if you collected mappings before shutdown</li>
        <li><code>vesting.json</code></li>
        <li><code>nft_owners.json</code></li>
        <li><code>protocol_positions.json</code></li>
        <li><code>migration_report.md</code> with totals and reconciliation notes</li>
      </ul>
      <p>Each artifact should include source height, source chain ID, generation timestamp, input hashes, output hashes, and a reproducible generator version.</p>
      <pre><code class="language-json">[
  {
    "snapshot_index": 0,
    "cosmos_address": "cosmos1abc...",
    "solana_address": "8Yh9kQ6dW8oY6yYJ4Y3T5g7uLwM8cR8bN3xj7v8w2iQm",
    "amount": "1500000",
    "denom": "umy",
    "proof": [
      "0x9d59f3...",
      "0x441e27..."
    ]
  }
]</code></pre>
      <pre><code class="language-typescript">import { readFileSync, writeFileSync } from "node:fs";

type Coin = { denom: string; amount: string };
type BankBalance = { address: string; coins: Coin[] };
type WalletLink = { cosmos_address: string; solana_address: string };

const exportState = JSON.parse(readFileSync("export.json", "utf8"));
const walletLinks: WalletLink[] = JSON.parse(readFileSync("wallet_links.json", "utf8"));
const linkMap = new Map(walletLinks.map((x) =&gt; [x.cosmos_address, x.solana_address]));

const balances: BankBalance[] = exportState.app_state.bank.balances;
const claims = balances.flatMap((balance, snapshotIndex) =&gt; {
  const coin = balance.coins.find((c) =&gt; c.denom === "umy");
  if (!coin) return [];

  return [{
    snapshot_index: snapshotIndex,
    cosmos_address: balance.address,
    solana_address: linkMap.get(balance.address) ?? null,
    amount: coin.amount,
    denom: coin.denom,
  }];
});

writeFileSync("claims.json", JSON.stringify(claims, null, 2));</code></pre>
      <h3>Reconciliation rules</h3>
      <p>Reconcile at least these totals:</p>
      <ul>
        <li>Total token supply before and after migration</li>
        <li>Treasury balances</li>
        <li>Sum of user liquid balances</li>
        <li>Sum of locked or vested balances</li>
        <li>Sum of staking principal plus pending rewards if you are honoring them</li>
        <li>Sum of LP or synthetic liabilities</li>
      </ul>
      <pre><code class="language-sh">jq '[.app_state.bank.balances[].coins[] | select(.denom=="umy") | .amount | tonumber] | add' export.json
jq '.app_state.bank.supply[] | select(.denom=="umy") | .amount' export.json
jq '.app_state.auth.accounts | length' export.json
jq '.app_state.bank.balances | length' export.json</code></pre>
    `,
  },
  {
    id: "phase-8-build-solana-programs-and-clients",
    navLabel: "Phase 8: Solana Programs",
    tone: "phase",
    html: `
      <h2>Phase 8: Build the Solana Programs and Clients</h2>
      <h3>Program design</h3>
      <p>Implement only what the migrated product still needs. For each Cosmos module or contract you preserve, define program responsibilities, account schemas, PDA seeds, authority model, upgrade model, failure modes, and event strategy.</p>
      <pre><code class="language-rust">pub fn claim(
    ctx: Context&lt;Claim&gt;,
    snapshot_index: u64,
    amount: u64,
    proof: Vec&lt;[u8; 32]&gt;,
) -&gt; Result&lt;()&gt; {
    let config = &amp;ctx.accounts.migration_config;
    let claimant = ctx.accounts.claimant.key();

    require!(config.claims_open, MigrationError::ClaimsClosed);

    let leaf = hashv(&amp;[
        &amp;snapshot_index.to_le_bytes(),
        claimant.as_ref(),
        &amp;amount.to_le_bytes(),
    ]);

    require!(
        verify_merkle_proof(leaf.to_bytes(), &amp;proof, config.merkle_root),
        MigrationError::InvalidProof
    );

    let receipt = &amp;mut ctx.accounts.claim_receipt;
    require!(receipt.claimed_at_slot == 0, MigrationError::AlreadyClaimed);

    mint_to_user(ctx.accounts.into_mint_to_context(), amount)?;

    receipt.claimant = claimant;
    receipt.snapshot_index = snapshot_index;
    receipt.amount = amount;
    receipt.claimed_at_slot = Clock::get()?.slot;

    Ok(())
}</code></pre>
      <h3>Account sizing and upgrade control</h3>
      <p>Cosmos module stores grow over time; Solana accounts are created with an explicit size. Reallocation later costs compute and operational risk.</p>
      <pre><code class="language-rust">#[account]
pub struct UserState {
    pub owner: Pubkey,
    pub migrated_amount: u64,
    pub claim_count: u32,
    pub created_at: i64,
    pub reserved: [u8; 32],
}</code></pre>
      <pre><code class="language-sh">solana program show &lt;PROGRAM_ID&gt;
solana program set-upgrade-authority &lt;PROGRAM_ID&gt; --new-upgrade-authority &lt;MULTISIG_KEYPAIR_OR_ADDRESS&gt;</code></pre>
      <pre><code class="language-sh">solana program set-upgrade-authority &lt;PROGRAM_ID&gt; --final</code></pre>
      <h3>Transaction design</h3>
      <ul>
        <li>Split large migrations into batches.</li>
        <li>Use v0 transactions with ALTs when account lists get large.</li>
        <li>Simulate transactions to size compute and add a margin.</li>
        <li>Avoid single-shot "migrate the whole protocol" transactions.</li>
      </ul>
      <pre><code class="language-text">Batch 1: create config PDA, treasury PDA, mint authority PDA
Batch 2: create 1,000 user receipt PDAs
Batch 3: mint protocol treasury balances
Batch 4+: process user claims in batches of 100-500 users, depending on compute and account count</code></pre>
      <pre><code class="language-rust">// Good: one receipt account per user claim
["claim-receipt", claimant_pubkey, snapshot_index]

// Bad: a single global "processed claims" bitmap you rewrite for every user</code></pre>
      <h3>Frontend rewrite</h3>
      <p>Replace all Cosmos assumptions around wallet connection, signing flow, address validation, explorer links, confirmation UX, token account discovery, and error handling.</p>
      <pre><code class="language-typescript">type ClaimRecord = {
  snapshot_index: number;
  amount: string;
  proof: string[];
};

async function claimMigration(
  walletAddress: string,
  claimRecord: ClaimRecord
) {
  const response = await fetch("/api/migration/claim?wallet=" + walletAddress);
  const entitlement = await response.json();

  if (!entitlement) {
    throw new Error("No migration entitlement found");
  }

  // Build the onchain claim instruction with:
  // - snapshot_index
  // - amount
  // - merkle proof
  // - recipient wallet
  // Then send and confirm it with the connected wallet.
}</code></pre>
      <h3>RPC and indexing</h3>
      <p>Plan for RPC failover, historical indexing, transaction parsing, program log ingestion, and token-account indexing.</p>
      <pre><code class="language-sh">curl https://api.devnet.solana.com -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"getProgramAccounts",
    "params":["&lt;PROGRAM_ID&gt;",{"encoding":"base64"}]
  }'</code></pre>
      <pre><code class="language-json">{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "programSubscribe",
  "params": [
    "&lt;PROGRAM_ID&gt;",
    { "encoding": "base64" }
  ]
}</code></pre>
      <pre><code class="language-json">{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "logsSubscribe",
  "params": [
    { "mentions": ["&lt;PROGRAM_ID_OR_ACCOUNT&gt;"] },
    { "commitment": "finalized" }
  ]
}</code></pre>
    `,
  },
  {
    id: "phase-9-rehearse-the-migration",
    navLabel: "Phase 9: Rehearsals",
    tone: "phase",
    html: `
      <h2>Phase 9: Test the Full Migration More Than Once</h2>
      <p>Run at least three rehearsals from export to Solana launch.</p>
      <h3>Rehearsal checklist</h3>
      <ul>
        <li>Export a representative Cosmos snapshot.</li>
        <li>Generate all migration artifacts.</li>
        <li>Deploy Solana programs to a staging cluster.</li>
        <li>Create the mint or mints.</li>
        <li>Load protocol-owned PDAs.</li>
        <li>Execute sample claims.</li>
        <li>Verify balances and state.</li>
        <li>Test support flows for linked users, unlinked users, and lost-wallet users.</li>
        <li>Test failure recovery for partial batches.</li>
      </ul>
      <h3>Edge cases to test</h3>
      <ul>
        <li>Dust balances</li>
        <li>Zero-balance but still entitled accounts</li>
        <li>Delegators with unbondings in progress</li>
        <li>Slashed or jailed validators if you are honoring staking-derived balances</li>
        <li>Vested accounts</li>
        <li>Multisigs</li>
        <li>Module-owned accounts</li>
        <li>IBC voucher holders</li>
        <li>NFT owners with metadata dependencies</li>
        <li>Users whose first Solana interaction requires ATA creation</li>
      </ul>
    `,
  },
  {
    id: "phase-10-launch-and-cut-over",
    navLabel: "Phase 10: Launch",
    tone: "phase",
    html: `
      <h2>Phase 10: Launch and Cut Over</h2>
      <h3>Cutover day sequence</h3>
      <ol>
        <li>Confirm the Cosmos halt height was reached and no new state is being produced.</li>
        <li>Produce the final signed export and migration manifests.</li>
        <li>Re-run reconciliation on the final data set.</li>
        <li>Deploy or upgrade the Solana programs you already tested.</li>
        <li>Initialize mints, treasury accounts, PDAs, and claim state.</li>
        <li>Turn on the Solana frontend and APIs.</li>
        <li>Open the claim or migration flow.</li>
        <li>Monitor failed claims, RPC errors, and reconciliation drift.</li>
      </ol>
      <pre><code class="language-sh">curl -s https://your-api.example.com/healthz
curl -s https://your-api.example.com/migration/status | jq

solana program show &lt;PROGRAM_ID&gt;
spl-token supply &lt;MINT_ADDRESS&gt;
spl-token accounts --owner &lt;TREASURY_OWNER&gt;</code></pre>
      <h3>Launch-day communication</h3>
      <p>Publish the final Cosmos snapshot height, final Cosmos chain ID, Solana program IDs, Solana mint addresses, claim instructions, known unsupported assets or positions, and the support path for broken claims.</p>
    `,
  },
  {
    id: "phase-11-post-migration-cleanup",
    navLabel: "Phase 11: Cleanup",
    tone: "phase",
    html: `
      <h2>Phase 11: Post-Migration Cleanup</h2>
      <ul>
        <li>Keep the Cosmos export, manifests, and reconciliation reports indefinitely.</li>
        <li>Keep at least one internal archive node or archive data set until all claims and audits are complete.</li>
        <li>Publish a final migration report with supply totals and claim policy.</li>
        <li>Remove or clearly label old Cosmos frontends, RPCs, explorers, relayers, and docs.</li>
        <li>Revoke or rotate obsolete keys, relayer secrets, and validator ops credentials.</li>
      </ul>
    `,
  },
  {
    id: "what-usually-breaks",
    navLabel: "What Usually Breaks",
    tone: "warning",
    html: `
      <h2>What Usually Breaks</h2>
      <ul>
        <li>Treating the migration as a token swap instead of a full product rewrite</li>
        <li>Forgetting module-owned balances and protocol liabilities</li>
        <li>Leaving IBC vouchers unresolved</li>
        <li>Assuming wallet addresses can be mapped automatically</li>
        <li>Preserving balances but not permissions, vesting, or governance rights</li>
        <li>Designing Solana accounts after exporting Cosmos state instead of before</li>
        <li>Trying to migrate too much state in one transaction</li>
        <li>Shipping a new frontend that still assumes Cosmos transaction semantics</li>
      </ul>
    `,
  },
  {
    id: "risk-checklist",
    navLabel: "Risk Checklist",
    tone: "warning",
    html: `
      <h2>Risk Checklist</h2>
      <ul>
        <li>Governance quorum, threshold, or timing assumptions do not match the live chain parameters.</li>
        <li>In-flight IBC packets are still unresolved at the planned halt height.</li>
        <li>Multiple halted nodes export different state artifacts.</li>
        <li>Supply reconciliation excludes staked, vested, escrowed, or module-owned balances you intended to preserve.</li>
        <li>The claim flow lacks replay protection or allows duplicate claims.</li>
        <li>The distribution process depends on a single RPC provider or a single signer.</li>
        <li>Program upgrade authority remains on a hot deployer key longer than intended.</li>
        <li>Token choice creates avoidable ecosystem friction, especially if you choose Token-2022 without a feature-driven reason.</li>
        <li>User support paths do not cover unregistered users, lost-wallet users, or first-time Solana wallet setup.</li>
      </ul>
    `,
  },
  {
    id: "minimum-deliverables",
    navLabel: "Minimum Deliverables",
    tone: "success",
    html: `
      <h2>Minimum Deliverables Before Mainnet Launch</h2>
      <ul>
        <li>Final Cosmos halt proposal and runbook</li>
        <li>Final export and archive artifacts</li>
        <li>Signed migration manifests with hashes</li>
        <li>Reconciled entitlement ledgers</li>
        <li>Solana program audit or internal review</li>
        <li>Staging rehearsal evidence</li>
        <li>Claim-support playbook</li>
        <li>Public migration announcement with exact dates, heights, and addresses</li>
      </ul>
    `,
  },
  {
    id: "source-links",
    navLabel: "Source Links",
    tone: "sources",
    html: `
      <h2>Source Links</h2>
      <ul>
        <li><a href="https://docs.cosmos.network/sdk/next/learn/concepts/sdk-structure" target="_blank" rel="noreferrer">Cosmos SDK application structure</a></li>
        <li><a href="https://docs.cosmos.network/sdk/v0.50/build/abci/introduction" target="_blank" rel="noreferrer">Cosmos ABCI introduction</a></li>
        <li><a href="https://docs.cosmos.network/v0.50/build/architecture/adr-064-abci-2.0" target="_blank" rel="noreferrer">Cosmos ADR 64: ABCI 2.0</a></li>
        <li><a href="https://docs.cosmos.network/sdk/v0.50/learn/advanced/upgrade" target="_blank" rel="noreferrer">Cosmos SDK in-place upgrades and export flow</a></li>
        <li><a href="https://docs.cosmos.network/sdk/v0.53/build/modules/upgrade" target="_blank" rel="noreferrer">Cosmos x/upgrade</a></li>
        <li><a href="https://docs.cosmos.network/sdk/v0.53/build/spec/addresses/bech32" target="_blank" rel="noreferrer">Cosmos Bech32 address encoding</a></li>
        <li><a href="https://docs.cosmos.network/sdk/next/learn/concepts/store" target="_blank" rel="noreferrer">Cosmos state and storage</a></li>
        <li><a href="https://docs.cosmos.network/ibc/v8.5.x/ibc/overview" target="_blank" rel="noreferrer">IBC overview</a></li>
        <li><a href="https://docs.cosmos.network/ibc/v8.5.x/ibc/apps/ibcmodule" target="_blank" rel="noreferrer">IBCModule interface and callbacks</a></li>
        <li><a href="https://docs.cosmos.network/docs/ibc/v8.5.x/apps/transfer/overview" target="_blank" rel="noreferrer">IBC transfer overview</a></li>
        <li><a href="https://solana.com/docs/core/accounts" target="_blank" rel="noreferrer">Solana accounts</a></li>
        <li><a href="https://solana.com/docs/core/accounts/account-structure" target="_blank" rel="noreferrer">Solana account structure</a></li>
        <li><a href="https://solana.com/docs/core/transactions" target="_blank" rel="noreferrer">Solana transactions</a></li>
        <li><a href="https://solana.com/docs/core/transactions/versioned-transactions" target="_blank" rel="noreferrer">Solana versioned transactions</a></li>
        <li><a href="https://solana.com/docs/core/fees/compute-budget" target="_blank" rel="noreferrer">Solana compute budget</a></li>
        <li><a href="https://solana.com/docs/core/pda" target="_blank" rel="noreferrer">Solana PDAs</a></li>
        <li><a href="https://solana.com/docs/core/programs" target="_blank" rel="noreferrer">Solana programs</a></li>
        <li><a href="https://solana.com/docs/core/programs/precompiles" target="_blank" rel="noreferrer">Solana precompiled programs</a></li>
        <li><a href="https://solana.com/docs/core/programs/program-deployment" target="_blank" rel="noreferrer">Solana program deployment</a></li>
        <li><a href="https://solana.com/docs/tokens" target="_blank" rel="noreferrer">Tokens on Solana</a></li>
        <li><a href="https://solana.com/docs/frontend" target="_blank" rel="noreferrer">Solana frontend docs</a></li>
        <li><a href="https://solana.com/docs/rpc/http/getprogramaccounts" target="_blank" rel="noreferrer">getProgramAccounts</a></li>
        <li><a href="https://solana.com/docs/rpc/websocket/programsubscribe" target="_blank" rel="noreferrer">programSubscribe</a></li>
        <li><a href="https://solana.com/docs/rpc/websocket/logssubscribe" target="_blank" rel="noreferrer">logsSubscribe</a></li>
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
      heading: "Cosmos App Structure",
      body: "Inspect how real Cosmos chains wire modules, stores, and export paths before you freeze scope.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://docs.cosmos.network/sdk/next/learn/concepts/sdk-structure",
        label: "Read docs",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Cosmos x/upgrade",
      body: "Use the supported governance and halt path instead of inventing a custom stop-the-chain flow.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://docs.cosmos.network/sdk/v0.53/build/modules/upgrade",
        label: "Read module docs",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "IBC Transfer Overview",
      body: "Plan IBC shutdown operationally: stop new flows, drain routes, and publish voucher end-state policy.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://docs.cosmos.network/docs/ibc/v8.5.x/apps/transfer/overview",
        label: "Read transfer guide",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Solana Accounts and PDAs",
      body: "Model your destination state before export so you know what becomes a PDA, token account, or off-chain manifest.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://solana.com/docs/core/pda",
        label: "Read PDA docs",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Tokens on Solana",
      body: "Choose Token Program versus Token-2022 for explicit reasons, not by default.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://solana.com/docs/tokens",
        label: "Read token docs",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Solana Frontend Docs",
      body: "Budget for a frontend rewrite that understands Solana wallets, token accounts, and transaction confirmation.",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://solana.com/docs/frontend",
        label: "Read frontend docs",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
  ],
};
