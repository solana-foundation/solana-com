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
    url: "/developers/migrate-to-solana/cosmos/app-chain",
  },
];

export const GUIDE_HIGHLIGHTS = {
  banner: {
    eyebrow: "Contract migration framing",
    title: "Treat this as a model rewrite, not a syntax conversion.",
    body: "CosmWasm contracts bundle stateful instances, contract-local storage, and asynchronous message passing. Solana programs separate logic from state, require explicit account graphs, and use synchronous CPI plus binary layouts. Porting goes well when you redesign around those rules instead of forcing CosmWasm patterns to survive unchanged.",
  },
  cards: [
    {
      number: "01",
      title: "Anchor around accounts and PDAs",
      body: "A contract instance does not become another deployed program. It becomes one program plus a set of program-owned accounts whose addresses encode the state keys you used to store in Maps and Items.",
    },
    {
      number: "02",
      title: "Translate execution flow deliberately",
      body: "CosmWasm async messages, replies, and JSON entry points turn into instruction handlers, explicit account validation, and synchronous CPI. That affects architecture, not just implementation details.",
    },
    {
      number: "03",
      title: "Plan state, tests, and upgrades up front",
      body: "Rent, account sizing, CPI account plumbing, local-validator tests, and upgrade authority policy are all part of the program surface on Solana. They are not cleanup tasks after the port.",
    },
  ],
};

export const GUIDE_SECTIONS = [
  {
    id: "philosophy-scaling",
    navLabel: "1. Design Overview",
    tone: "note",
    html: `
      <h2>1. Design Overview</h2>
      <p>This guide is for Rust smart contract developers who already know CosmWasm and want to make sound Solana architecture decisions instead of trying to preserve patterns that do not translate cleanly.</p>
      <p>Before touching code, internalize the two chains' core bets:</p>
      <div class="tw-overflow-x-auto">
        <table class="tw-w-full tw-border-collapse tw-border tw-border-white/10">
          <thead>
            <tr class="tw-bg-white/8">
              <th class="tw-border tw-border-white/10 tw-px-4 tw-py-3 tw-text-left">Dimension</th>
              <th class="tw-border tw-border-white/10 tw-px-4 tw-py-3 tw-text-left">CosmWasm</th>
              <th class="tw-border tw-border-white/10 tw-px-4 tw-py-3 tw-text-left">Solana / Anchor</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Scaling strategy</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Horizontal app-chain ecosystem connected by IBC</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">One high-throughput chain with parallel execution</td></tr>
            <tr><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Typical block cadence</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Seconds</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Sub-second slots</td></tr>
            <tr><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Execution VM</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">WASM bytecode</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">eBPF bytecode</td></tr>
            <tr><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Nondeterminism</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Disallowed</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Disallowed</td></tr>
            <tr><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Contract instances</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Many instances per uploaded code</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">One deployed program; many state accounts</td></tr>
            <tr><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Scaling consequence</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Application isolation by chain</td><td class="tw-border tw-border-white/10 tw-px-4 tw-py-3">Sealevel parallelism via explicit account locking</td></tr>
          </tbody>
        </table>
      </div>
      <p>The biggest practical consequence is Solana's parallel runtime. Transactions declare every account they will touch up front, so the runtime can execute non-conflicting transactions simultaneously. That requirement shapes the rest of the programming model.</p>
    `,
  },
  {
    id: "account-model",
    navLabel: "2. Account Model",
    tone: "default",
    html: `
      <h2>2. The Fundamental Shift: The Account Model</h2>
      <p>This is the hardest concept to internalize and the one that explains almost every other difference.</p>
      <h3>CosmWasm mental model</h3>
      <pre><code class="language-bash">Code Upload (code_id: 42)
      |
      |-- instantiate() -&gt; Contract Address A  [owns its own key-value store]
      |-- instantiate() -&gt; Contract Address B  [owns its own key-value store]
      '-- instantiate() -&gt; Contract Address C  [owns its own key-value store]</code></pre>
      <p>Each contract instance is self-contained. Logic and state live together at the same address, and <code>deps.storage</code> is the contract's private namespace.</p>
      <h3>Solana mental model</h3>
      <pre><code class="language-bash">Deployed Program (address: Program111...)
      |
      |-- Pool Account A   (PDA)
      |-- Pool Account B   (PDA)
      '-- User Account C   (PDA)</code></pre>
      <p>A Solana program is stateless logic. State lives in separate accounts owned by the program, and the client or calling program must pass every required account into each instruction explicitly.</p>
      <h3>Why this matters in practice</h3>
      <ul>
        <li>A CosmWasm factory often stores deployed child addresses. A Solana program usually derives addresses deterministically instead of storing them.</li>
        <li>A CosmWasm contract owns one isolated KV store. A Solana program looks more like a database engine that defines schemas and rules for many rows stored as separate accounts.</li>
        <li>Transactions declare all accounts they will read or write. That declaration is what unlocks parallelism.</li>
      </ul>
      <h3>Program Derived Addresses</h3>
      <p>PDAs are the cornerstone of Solana state management. They are off-curve addresses derived from seeds plus the program ID. They encode the lookup key in the address itself.</p>
      <pre><code class="language-rust">#[derive(Accounts)]
pub struct Increment&lt;'info&gt; {
    pub user: Signer&lt;'info&gt;,

    #[account(
        mut,
        seeds = [b"counter", user.key().as_ref()],
        bump,
    )]
    pub counter: Account&lt;'info, Counter&gt;,
}</code></pre>
      <pre><code class="language-rust">pub const USER_COUNTERS: Map&lt;&amp;Addr, u64&gt; = Map::new("user_counters");
let count = USER_COUNTERS.load(deps.storage, &amp;info.sender)?;</code></pre>
      <p>That CosmWasm map lookup becomes PDA derivation plus account deserialization on Solana. The key is the address.</p>
    `,
  },
  {
    id: "project-structure",
    navLabel: "3. Toolchain",
    tone: "default",
    html: `
      <h2>3. Project Structure &amp; Toolchain</h2>
      <p>CosmWasm and Solana are both Rust ecosystems, but the build pipeline, deployment model, and testing workflow differ substantially.</p>
      <h3>CosmWasm toolchain</h3>
      <pre><code class="language-bash">rustup target add wasm32-unknown-unknown
cargo generate --git https://github.com/CosmWasm/cw-template
cargo build --target wasm32-unknown-unknown --release</code></pre>
      <p>Key crates: <code>cosmwasm-std</code>, <code>cw-storage-plus</code>, <code>cw-multi-test</code>, and <code>thiserror</code>.</p>
      <h3>Solana / Anchor toolchain</h3>
      <pre><code class="language-bash">sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
cargo install --git https://github.com/solana-foundation/anchor anchor-cli

anchor init my_program
cd my_program
anchor build
anchor test</code></pre>
      <p>Key crates: <code>solana-program</code>, <code>anchor-lang</code>, <code>anchor-spl</code>, and SPL program libraries such as <code>spl-token</code>.</p>
      <h3>Directory layout comparison</h3>
      <pre><code class="language-bash"># CosmWasm                          # Anchor
src/                                programs/my_program/src/
  contract.rs                         lib.rs
  msg.rs                              state.rs
  state.rs                            error.rs
  error.rs                          tests/
tests/                                integration.ts</code></pre>
      <p>One important workflow difference: Anchor integration tests are often written in TypeScript using the generated IDL client, even when the on-chain code is Rust.</p>
    `,
  },
  {
    id: "entry-points",
    navLabel: "4. Entry Points",
    tone: "phase",
    html: `
      <h2>4. Entry Points: Messages vs Instructions</h2>
      <p>CosmWasm exposes distinct entry points for different classes of work. Native Solana exposes one instruction processor that you dispatch yourself, and Anchor rebuilds a multi-handler abstraction on top.</p>
      <h3>CosmWasm entry points</h3>
      <pre><code class="language-rust">#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -&gt; Result&lt;Response, ContractError&gt; { ... }

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -&gt; Result&lt;Response, ContractError&gt; { ... }

#[entry_point]
pub fn query(
    deps: Deps,
    env: Env,
    msg: QueryMsg,
) -&gt; StdResult&lt;Binary&gt; { ... }</code></pre>
      <h3>Native Solana dispatcher</h3>
      <pre><code class="language-rust">pub fn process_instruction(
    program_id: &amp;Pubkey,
    accounts: &amp;[AccountInfo],
    instruction_data: &amp;[u8],
) -&gt; ProgramResult {
    let instruction = CounterInstruction::try_from_slice(instruction_data)?;

    match instruction {
        CounterInstruction::Initialize =&gt; process_initialize(program_id, accounts),
        CounterInstruction::Increment =&gt; process_increment(program_id, accounts),
        CounterInstruction::Reset { value } =&gt; process_reset(program_id, accounts, value),
    }
}</code></pre>
      <h3>Anchor handler model</h3>
      <pre><code class="language-rust">#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context&lt;Initialize&gt;, start_value: i64) -&gt; Result&lt;()&gt; {
        ctx.accounts.counter.count = start_value;
        ctx.accounts.counter.authority = ctx.accounts.user.key();
        ctx.accounts.counter.bump = ctx.bumps.counter;
        Ok(())
    }

    pub fn increment(ctx: Context&lt;Increment&gt;) -&gt; Result&lt;()&gt; {
        ctx.accounts.counter.count = ctx.accounts.counter.count
            .checked_add(1)
            .ok_or(CounterError::Overflow)?;
        Ok(())
    }
}</code></pre>
      <p>There is no separate instantiate step on Solana. Initialization is just another instruction, usually one that creates and seeds state accounts. Queries are off-chain RPC reads, not on-chain handlers.</p>
    `,
  },
  {
    id: "state-management",
    navLabel: "5. State",
    tone: "phase",
    html: `
      <h2>5. State Management: Contract Storage vs PDAs</h2>
      <p>Every <code>Item</code> or <code>Map</code> you used in CosmWasm needs an explicit account model on Solana. In practice, each logical entry often becomes its own program-owned account.</p>
      <h3>CosmWasm storage</h3>
      <pre><code class="language-rust">use cw_storage_plus::{Item, Map};

pub const CONFIG: Item&lt;Config&gt; = Item::new("config");
pub const BALANCES: Map&lt;&amp;Addr, Uint128&gt; = Map::new("balances");
pub const ALLOWANCES: Map&lt;(&amp;Addr, &amp;Addr), Uint128&gt; = Map::new("allowances");</code></pre>
      <h3>Solana account model</h3>
      <pre><code class="language-rust">#[account]
#[derive(InitSpace)]
pub struct UserBalance {
    pub owner: Pubkey,
    pub amount: u64,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct TransferTokens&lt;'info&gt; {
    pub sender: Signer&lt;'info&gt;,

    #[account(
        mut,
        seeds = [b"balance", sender.key().as_ref()],
        bump = sender_balance.bump,
    )]
    pub sender_balance: Account&lt;'info, UserBalance&gt;,
}</code></pre>
      <h3>Rent and space allocation</h3>
      <p>Solana storage is not abstracted away. Accounts must carry enough lamports to remain rent-exempt, and you must allocate enough space up front for the data layout you intend to store.</p>
      <pre><code class="language-rust">#[account(
    init,
    payer = user,
    space = 8 + UserBalance::INIT_SPACE,
)]
pub user_balance: Account&lt;'info, UserBalance&gt;</code></pre>
      <p>The leading 8 bytes are the Anchor discriminator. Variable-length fields such as strings and vectors require explicit sizing discipline.</p>
      <pre><code class="language-rust">#[account]
#[derive(InitSpace)]
pub struct Metadata {
    #[max_len(32)]
    pub name: String,
    #[max_len(200)]
    pub uri: String,
}</code></pre>
      <p>If you may add fields later, either pre-allocate spare space up front or plan a <code>realloc</code> or migration path. Existing Solana accounts do not automatically grow the way contract-local storage feels like it does in CosmWasm.</p>
    `,
  },
  {
    id: "token-handling",
    navLabel: "6. Tokens",
    tone: "phase",
    html: `
      <h2>6. Token Handling: Bank Module / CW20 vs SPL Tokens</h2>
      <p>CosmWasm splits native-denom flows and CW20 flows. Solana standardizes fungible tokens around the SPL Token program, while SOL itself moves through the System Program.</p>
      <h3>CosmWasm native and CW20 patterns</h3>
      <pre><code class="language-rust">let payment = info.funds.iter()
    .find(|c| c.denom == "uatom")
    .ok_or(ContractError::NoFundsProvided {})?;

let transfer_msg = Cw20ExecuteMsg::TransferFrom {
    owner: info.sender.to_string(),
    recipient: env.contract.address.to_string(),
    amount,
};</code></pre>
      <h3>Solana native lamports and SPL tokens</h3>
      <pre><code class="language-rust">system_program::transfer(
    CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.sender.to_account_info(),
            to: ctx.accounts.recipient.to_account_info(),
        },
    ),
    lamport_amount,
)?;</code></pre>
      <pre><code class="language-rust">token::transfer(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.sender_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.sender.to_account_info(),
        },
    ),
    amount,
)?;</code></pre>
      <pre><code class="language-rust">token::transfer(
    CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        },
        &amp;[&amp;[b"vault_authority", &amp;[ctx.bumps.vault_authority]]],
    ),
    amount,
)?;</code></pre>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Concern</th>
              <th>CosmWasm</th>
              <th>Solana</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Receiving tokens</td><td><code>info.funds</code> or CW20 receive hook</td><td>User token account or ATA is passed explicitly</td></tr>
            <tr><td>Sending tokens</td><td><code>BankMsg::Send</code> or CW20 execute</td><td>System Program CPI or SPL Token CPI</td></tr>
            <tr><td>Token standard</td><td>CW20 contract per token</td><td>Shared token program plus mint accounts</td></tr>
            <tr><td>Program escrow</td><td>Contract balance or tracked allowances</td><td>PDA-controlled vault token accounts</td></tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: "cross-program",
    navLabel: "7. CPIs",
    tone: "phase",
    html: `
      <h2>7. Cross-Contract Communication: Sub-Messages vs CPIs</h2>
      <p>CosmWasm composes contracts through asynchronous messages. Solana composes programs through synchronous cross-program invocations.</p>
      <h3>CosmWasm sub-message flow</h3>
      <pre><code class="language-rust">let exec = WasmMsg::Execute {
    contract_addr: pool_contract.to_string(),
    msg: to_json_binary(&amp;PoolExecuteMsg::Swap { amount_in, min_amount_out })?,
    funds: coins(amount_in.u128(), "uatom"),
};

let sub_msg = SubMsg::reply_on_success(exec, SWAP_REPLY_ID);
Ok(Response::new().add_submessage(sub_msg))</code></pre>
      <h3>Solana CPI flow</h3>
      <pre><code class="language-rust">let cpi_ctx = CpiContext::new(
    ctx.accounts.pool_program.to_account_info(),
    pool_program::cpi::accounts::Swap {
        pool: ctx.accounts.pool.to_account_info(),
        user_src: ctx.accounts.user_src.to_account_info(),
        user_dst: ctx.accounts.user_dst.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    },
);

pool_program::cpi::swap(cpi_ctx, amount_in, min_amount_out)?;</code></pre>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>CosmWasm</th>
              <th>Solana</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Execution</td><td>Asynchronous message queue</td><td>Synchronous call stack</td></tr>
            <tr><td>Return values</td><td>Observed through <code>reply</code></td><td>Available immediately</td></tr>
            <tr><td>Accounts known up front</td><td>No</td><td>Yes, across the whole call chain</td></tr>
            <tr><td>Nesting limit</td><td>Flexible application-level design</td><td>CPI depth is limited</td></tr>
          </tbody>
        </table>
      </div>
      <p>Practical consequence: on Solana, the caller must gather every account the entire CPI chain will need and include them in the transaction. The reward is a more predictable execution surface.</p>
    `,
  },
  {
    id: "serialization",
    navLabel: "8. Serialization",
    tone: "default",
    html: `
      <h2>8. Serialization: JSON / serde vs Borsh</h2>
      <p>CosmWasm messages are JSON-first and CLI-friendly. Solana instructions and account data are binary-first.</p>
      <pre><code class="language-rust">#[cw_serde]
pub enum ExecuteMsg {
    Transfer { recipient: String, amount: Uint128 },
    Burn { amount: Uint128 },
}</code></pre>
      <pre><code class="language-rust">#[derive(BorshSerialize, BorshDeserialize)]
pub enum CounterInstruction {
    Initialize { start_value: i64 },
    Increment,
    Reset { value: i64 },
}</code></pre>
      <p>Anchor prepends an 8-byte discriminator to each instruction and each account type so it can route handlers and validate layouts automatically. One practical upside over JSON is that integers stay integers. You do not need the string-encoded <code>Uint128</code> convention that exists to protect precision in JSON tooling.</p>
      <p>The tradeoff is debuggability: instruction bytes are not naturally human-readable at the CLI layer, so your client and tests matter more.</p>
    `,
  },
  {
    id: "error-handling",
    navLabel: "9. Errors",
    tone: "default",
    html: `
      <h2>9. Error Handling</h2>
      <p>Both ecosystems lean on Rust error types, but Solana makes it more important to avoid panics because a panic often collapses into an unhelpful runtime failure.</p>
      <pre><code class="language-rust">#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("Unauthorized")]
    Unauthorized {},
}</code></pre>
      <pre><code class="language-rust">#[error_code]
pub enum CounterError {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    #[msg("Arithmetic overflow")]
    Overflow,
}</code></pre>
      <pre><code class="language-rust">require!(
    ctx.accounts.counter.authority == ctx.accounts.user.key(),
    CounterError::Unauthorized
);</code></pre>
      <p>Use <code>?</code>, <code>require!</code>, <code>require_eq!</code>, and <code>require_keys_eq!</code> to fail predictably. Do not use <code>unwrap()</code> or <code>panic!()</code> in production handlers.</p>
    `,
  },
  {
    id: "time-block",
    navLabel: "10. Time",
    tone: "default",
    html: `
      <h2>10. Time &amp; Block Information</h2>
      <p>CosmWasm gives you consensus time and block height in <code>env</code>. Solana exposes time and slot data through sysvars such as <code>Clock</code>.</p>
      <pre><code class="language-rust">let now_secs = env.block.time.seconds();
let height = env.block.height;</code></pre>
      <pre><code class="language-rust">let clock = Clock::get()?;

require!(
    clock.unix_timestamp &gt;= unlock_time,
    LockError::NotYetUnlockable
);</code></pre>
      <p>Use <code>clock.slot</code> for ordering and sequencing. Use <code>clock.unix_timestamp</code> for approximate wall-clock checks such as unlock windows or expiries. Treat the timestamp as good enough for time-based UX, not as a perfect monotonic clock.</p>
    `,
  },
  {
    id: "testing",
    navLabel: "11. Testing",
    tone: "phase",
    html: `
      <h2>11. Testing</h2>
      <p>On Solana, transaction assembly is part of the product surface. Good tests exercise accounts, signers, PDA derivation, token accounts, and CPI behavior in addition to pure business logic.</p>
      <h3>CosmWasm testing</h3>
      <pre><code class="language-rust">let mut app = App::default();
let code = ContractWrapper::new(execute, instantiate, query);
let code_id = app.store_code(Box::new(code));</code></pre>
      <h3>Anchor integration tests</h3>
      <pre><code class="language-typescript">const [counterPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("counter"), provider.wallet.publicKey.toBuffer()],
  program.programId
);

await program.methods
  .initialize(new anchor.BN(0))
  .accounts({ counter: counterPda })
  .rpc();

const counter = await program.account.counter.fetch(counterPda);</code></pre>
      <h3>Fast Rust-side execution with LiteSVM</h3>
      <pre><code class="language-rust">let mut svm = LiteSVM::new();
svm.add_program_from_file(PROGRAM_ID, "target/deploy/counter.so")?;</code></pre>
      <p>Port your old contract tests conceptually, then add Solana-specific cases for signer spoofing, account substitution, stale reads after CPI, rent-funded account creation, and account closure behavior.</p>
    `,
  },
  {
    id: "deployment-upgrades",
    navLabel: "12. Upgrades",
    tone: "phase",
    html: `
      <h2>12. Deployment &amp; Upgrades</h2>
      <p>CosmWasm separates code upload from instantiation and supports explicit migrate handlers. Solana deploys one program address and upgrades it in place under an upgrade authority.</p>
      <pre><code class="language-bash"># CosmWasm
cargo build --target wasm32-unknown-unknown --release
wasmd tx wasm store counter_opt.wasm --from wallet
wasmd tx wasm instantiate CODE_ID '{"count":0}' --from wallet</code></pre>
      <pre><code class="language-bash"># Solana / Anchor
anchor build
anchor deploy

solana program show PROGRAM_ID
solana program set-upgrade-authority PROGRAM_ID --final</code></pre>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Concern</th>
              <th>CosmWasm</th>
              <th>Solana</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Upload vs instantiate</td><td>Separate steps</td><td>One deployed program, many state accounts</td></tr>
            <tr><td>Upgrade mechanism</td><td><code>migrate</code> entry point</td><td>Replace program bytecode in place</td></tr>
            <tr><td>Upgrade authority</td><td>Admin address on instance</td><td>Program upgrade authority key</td></tr>
            <tr><td>Immutability</td><td>Unset admin</td><td>Finalize upgrade authority</td></tr>
          </tbody>
        </table>
      </div>
      <p>State migration on Solana is your responsibility. If old accounts need a new layout, either pre-allocate space for forward compatibility or add a protected one-time migration instruction.</p>
    `,
  },
  {
    id: "counter-example",
    navLabel: "13. Counter",
    tone: "phase",
    html: `
      <h2>13. Full Side-by-Side Example: Counter Contract</h2>
      <p>A counter contract is a useful migration seed because it forces you to model state layout, authority, initialization, and off-chain reads without too much noise.</p>
      <h3>CosmWasm implementation</h3>
      <pre><code class="language-rust">pub const COUNTS: Map&lt;&amp;Addr, i32&gt; = Map::new("counts");

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -&gt; Result&lt;Response, ContractError&gt; {
    match msg {
        ExecuteMsg::Increment {} =&gt; {
            let count = COUNTS
                .may_load(deps.storage, &amp;info.sender)?
                .unwrap_or(0)
                .checked_add(1)
                .ok_or(ContractError::Overflow {})?;
            COUNTS.save(deps.storage, &amp;info.sender, &amp;count)?;
            Ok(Response::new())
        }
        ExecuteMsg::Reset { count } =&gt; {
            COUNTS.save(deps.storage, &amp;info.sender, &amp;count)?;
            Ok(Response::new())
        }
    }
}</code></pre>
      <h3>Anchor implementation</h3>
      <pre><code class="language-rust">#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub count: i64,
    pub authority: Pubkey,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct ModifyCounter&lt;'info&gt; {
    #[account(mut)]
    pub user: Signer&lt;'info&gt;,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + Counter::INIT_SPACE,
        seeds = [b"counter", user.key().as_ref()],
        bump,
    )]
    pub counter: Account&lt;'info, Counter&gt;,

    pub system_program: Program&lt;'info, System&gt;,
}</code></pre>
      <pre><code class="language-rust">pub fn increment(ctx: Context&lt;ModifyCounter&gt;) -&gt; Result&lt;()&gt; {
    let counter = &amp;mut ctx.accounts.counter;
    if counter.authority == Pubkey::default() {
        counter.authority = ctx.accounts.user.key();
        counter.bump = ctx.bumps.counter;
    }
    counter.count = counter.count
        .checked_add(1)
        .ok_or(CounterError::Overflow)?;
    Ok(())
}</code></pre>
      <p>The important translation is not the arithmetic. It is that the per-user map entry in CosmWasm becomes a per-user PDA account on Solana, and reads happen by deriving that PDA off-chain and fetching the account.</p>
    `,
  },
  {
    id: "dex-lessons",
    navLabel: "14. DEX Lessons",
    tone: "phase",
    html: `
      <h2>14. Porting a DEX: Lessons from the Real World</h2>
      <p>DEX ports expose the biggest architectural differences quickly because they touch factories, pools, vaults, LP tokens, pricing state, and multi-hop account graphs.</p>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Pattern</th>
              <th>CosmWasm</th>
              <th>Solana</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Factory</td><td>Stores child contract addresses</td><td>Derives pool PDAs from mint seeds</td></tr>
            <tr><td>Pool creation</td><td>Instantiate one contract per pool</td><td>Create one pool account plus vault accounts</td></tr>
            <tr><td>LP token</td><td>Instantiate a CW20 contract</td><td>Create an SPL mint, often PDA-controlled</td></tr>
            <tr><td>Pool discovery</td><td>Read factory state</td><td>Filter program accounts off-chain</td></tr>
          </tbody>
        </table>
      </div>
      <p>The client-side complexity shifts noticeably. On Solana, the client must derive PDAs, create ATAs when needed, and assemble all accounts for the whole transaction. The payoff is explicitness and parallel-friendly execution.</p>
      <p>This is why a factory port is not just a contract rewrite. It is also a client rewrite and a state-discovery rewrite.</p>
    `,
  },
  {
    id: "pitfalls",
    navLabel: "15. Pitfalls",
    tone: "warning",
    html: `
      <h2>15. Common Pitfalls &amp; Mental Traps</h2>
      <ol>
        <li>Do not forget to include every required account in the transaction. If an account is not passed in, the program cannot touch it.</li>
        <li>Do not try to deploy a new program per user or per pool. One program usually serves many accounts.</li>
        <li>Treat <code>init_if_needed</code> as a sharp tool. Pair it with clear authority, seed, and state-version validation so it cannot silently reuse an account in an invalid state.</li>
        <li>Store bump seeds you will need later for PDA signing instead of recomputing them everywhere.</li>
        <li>Always include the 8-byte Anchor discriminator in space calculations.</li>
        <li>Do not use floating-point arithmetic. Use integers and scaled units such as basis points.</li>
        <li>Translate auth checks into account constraints, not just inline handler code.</li>
        <li>Remember that CPI nesting is limited. Very deep call graphs may need to be flattened or split across transactions.</li>
        <li>Account size is fixed unless you explicitly reallocate it.</li>
        <li>Use <code>clock.slot</code> for sequencing and <code>clock.unix_timestamp</code> for approximate wall-clock logic.</li>
      </ol>
      <pre><code class="language-rust">#[account]
pub struct Pool {
    pub bump: u8,
    pub authority: Pubkey,
}

ctx.accounts.pool.bump = ctx.bumps.pool;</code></pre>
    `,
  },
  {
    id: "migration-checklist",
    navLabel: "16. Checklist",
    tone: "success",
    html: `
      <h2>16. Migration Checklist</h2>
      <p>Use this checklist when porting a CosmWasm contract to Solana with Anchor.</p>
      <h3>Architecture</h3>
      <ul>
        <li>Identify every <code>Item</code> and <code>Map</code> and decide which PDA or account type will replace it.</li>
        <li>Replace <code>instantiate</code> with one or more initialization instructions.</li>
        <li>Remove on-chain query assumptions. Reads happen through RPC.</li>
        <li>Map each <code>ExecuteMsg</code> variant to an instruction handler and an account graph.</li>
      </ul>
      <h3>State</h3>
      <ul>
        <li>Define <code>#[account]</code> structs with explicit sizing.</li>
        <li>Add bump fields where PDA signing or validation will need them.</li>
        <li>Budget for rent and for variable-length data.</li>
        <li>Plan reallocation or forward-compatible spare space if layouts may evolve.</li>
      </ul>
      <h3>Tokens</h3>
      <ul>
        <li>Replace bank sends with System Program transfers where the asset is SOL.</li>
        <li>Replace CW20 flows with SPL Token CPIs and token-account modeling.</li>
        <li>Add ATA creation for holders that need token accounts.</li>
        <li>Replace LP-token contracts with SPL mint accounts plus mint authority policy.</li>
      </ul>
      <h3>Security, testing, and deployment</h3>
      <ul>
        <li>Move <code>info.sender</code> checks into signer and account constraints where possible.</li>
        <li>Test PDA derivation, account substitution resistance, stale reads after CPI, and account initialization paths.</li>
        <li>Define a state-migration strategy before the first production upgrade.</li>
        <li>Decide whether upgrade authority will remain active, move to multisig, or be finalized away.</li>
      </ul>
    `,
  },
  {
    id: "quick-reference",
    navLabel: "Quick Reference",
    tone: "success",
    html: `
      <h2>Quick Reference Table</h2>
      <p>Use this as a fast translation map when you are porting familiar CosmWasm primitives into Solana-native account and instruction patterns.</p>
    `,
  },
];

export const QUICK_REFERENCE_ROWS = [
  ["Item<T>", "Singleton PDA account"],
  ["Map<K, V>", "PDA per key with deterministic seeds"],
  ["IndexedMap", "PDAs plus off-chain filtering or secondary index accounts"],
  ["SnapshotMap", "Versioned accounts or custom history model"],
  ["instantiate", "initialize instruction with init or init_if_needed"],
  ["execute", "Instruction handlers in #[program]"],
  ["query", "RPC account reads and client-side decoding"],
  ["migrate", "Program upgrade plus explicit migration instruction"],
  ["reply", "Usually unnecessary because CPI is synchronous"],
  ["BankMsg::Send", "System Program transfer CPI or SPL token CPI"],
  ["WasmMsg::Execute", "Anchor CPI or raw invoke"],
  ["ContractError", "Anchor #[error_code] enum or ProgramError"],
  ["env.block.time", "Clock::get()?.unix_timestamp"],
  ["env.block.height", "Clock::get()?.slot"],
  ["info.sender", "Signer plus account constraints"],
  ["CW20", "SPL mint plus token accounts or ATAs"],
  ["CW721", "SPL mint plus Metaplex metadata or Core"],
  ["cw-multi-test", "anchor test, local validator, LiteSVM"],
  ["Contract instance", "Program plus one or more owned accounts"],
  ["Contract admin", "Stored authority plus upgrade authority policy"],
  [
    "IBC contract assumptions",
    "Bridge or interoperability project; no native IBC equivalent",
  ],
];

export const RESOURCE_CARD_DECK = {
  numCols: 3,
  featured: false,
  cards: [
    {
      type: "image",
      headingAs: "h3",
      heading: "Official Migration Guide",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        label: "Read the guide",
        url: "https://solana.com/developers/guides/getstarted/cosmwasm-to-solana",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Anchor Documentation",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        label: "Open Anchor docs",
        url: "https://www.anchor-lang.com/docs",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "PDAs on Solana",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        label: "Read the docs",
        url: "https://solana.com/docs/core/pda",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Cross-Program Invocation",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        label: "Read the docs",
        url: "https://solana.com/docs/core/cpi",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Dopple DEX Case Study",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        label: "Read the article",
        url: "https://rustopian.dev/article/dopple-dex-in-cosmwasm-and-solana",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Counter Reference Repo",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        label: "Open GitHub repo",
        url: "https://github.com/brimigs/cosmwasm-counter",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
  ],
};
