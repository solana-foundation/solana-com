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
    title: "This is a contract rewrite, not a chain-porting exercise.",
    body: "CosmWasm contracts assume stateful contract instances, async submessages, and JSON-first interfaces. Solana and Anchor assume stateless programs, explicit account graphs, synchronous CPI, and binary account layouts. The migration succeeds when you redesign around those rules instead of transliterating syntax.",
  },
  cards: [
    {
      number: "01",
      title: "Rebuild the mental model first",
      body: "A CosmWasm contract instance becomes a Solana program plus one or more owned accounts or PDAs. If that shift is fuzzy, every downstream design decision will wobble.",
    },
    {
      number: "02",
      title: "Map storage and authority deliberately",
      body: "Each Item, Map, and admin check turns into account schemas, seeds, signer validation, and sometimes token accounts or PDAs.",
    },
    {
      number: "03",
      title: "Treat testing and upgrades as product work",
      body: "Client assembly, account sizing, CPI reloads, and upgrade authority handling are part of the contract surface on Solana, not secondary concerns.",
    },
  ],
};

export const GUIDE_SECTIONS = [
  {
    id: "overview",
    navLabel: "Overview",
    tone: "overview",
    html: `
      <h2>Overview</h2>
      <p>This page is a developer reference for rewriting CosmWasm smart contracts as Solana programs using Anchor. It is optimized for teams whose main question is <em>How do I translate contract architecture, state, and execution patterns?</em> rather than <em>How do I retire an entire Cosmos app chain?</em></p>
      <p>Use the guide in this order:</p>
      <ol>
        <li>Internalize the execution-model shift.</li>
        <li>Map each CosmWasm primitive to an account or instruction pattern.</li>
        <li>Rewrite one contract end-to-end with tests before touching the rest of the product.</li>
      </ol>
      <p>The examples are reference templates, not universal drop-ins. Replace placeholder program IDs, seeds, token mints, and authorities with your actual values, and validate any account graph against your production threat model before shipping.</p>
    `,
  },
  {
    id: "mental-model-shift",
    navLabel: "Mental Model Shift",
    tone: "note",
    html: `
      <h2>The Fundamental Mental Model Shift</h2>
      <p>This is the most important section on the page. Every line of Anchor code will fight you until this shift becomes automatic.</p>
      <h3>CosmWasm: contract as stateful actor</h3>
      <p>Each deployed contract instance owns its own isolated key-value store, its own address, and its own balance. One code ID can back many independent instances. Cross-contract calls are asynchronous message passing through <code>Response</code>, and optional callbacks arrive through <code>reply</code>.</p>
      <pre><code class="language-text">User TX -> Contract A -> Response { msgs: [WasmMsg::Execute -> Contract B] }
                                   ↓
                         Contract B executes
                                   ↓
                 Contract A reply(id, result) [optional]</code></pre>
      <h3>Solana: program as stateless logic plus explicit accounts</h3>
      <p>A Solana program holds no persistent state. State lives in separate accounts owned by the program, and the client must discover and pass those accounts into every instruction. Cross-program calls are synchronous CPI: the callee runs inline and returns before your instruction continues.</p>
      <pre><code class="language-text">User TX -> Program A (receives: [state, vault_pda, token_program]) -> CPI -> Token Program</code></pre>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Concept</th>
              <th>CosmWasm</th>
              <th>Solana / Anchor</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>State location</td><td>Contract KV store</td><td>Separate owned accounts</td></tr>
            <tr><td>Multiple instances</td><td>Multiple contract instantiations</td><td>Multiple PDAs with different seeds</td></tr>
            <tr><td>Cross-contract calls</td><td>Async messages through <code>Response</code></td><td>Sync CPI via <code>invoke</code> or Anchor CPI helpers</td></tr>
            <tr><td>Callback pattern</td><td><code>reply</code></td><td>Usually not needed</td></tr>
            <tr><td>Token model</td><td>CW20 or CW721 contracts</td><td>SPL Token, Token-2022, and Metaplex</td></tr>
            <tr><td>Serialization</td><td>JSON via serde</td><td>Borsh and account discriminators</td></tr>
            <tr><td>Constructor</td><td><code>instantiate</code></td><td><code>initialize</code> with <code>init</code> constraints</td></tr>
            <tr><td>Admin control</td><td><code>info.sender</code> checks</td><td><code>Signer</code>, <code>has_one</code>, PDA authority, upgrade authority</td></tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: "cosmwasm-reference",
    navLabel: "CosmWasm Reference",
    tone: "default",
    html: `
      <h2>CosmWasm Deep Reference</h2>
      <p>Before you rewrite anything, inventory the exact contract surface you are porting: entrypoints, storage shapes, message formats, token hooks, and any async <code>reply</code> flow.</p>
      <h3>Typical contract structure</h3>
      <pre><code class="language-text">src/
  lib.rs
  contract.rs
  state.rs
  msg.rs
  error.rs
Cargo.toml</code></pre>
      <h3>Core entrypoints</h3>
      <pre><code class="language-rust">#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result&lt;Response, ContractError&gt; { ... }

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result&lt;Response, ContractError&gt; { ... }

#[entry_point]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult&lt;Binary&gt; { ... }

#[entry_point]
pub fn migrate(deps: DepsMut, env: Env, msg: MigrateMsg) -> Result&lt;Response, ContractError&gt; { ... }

#[entry_point]
pub fn reply(deps: DepsMut, env: Env, msg: Reply) -> Result&lt;Response, ContractError&gt; { ... }</code></pre>
      <h3>Storage with <code>cw-storage-plus</code></h3>
      <pre><code class="language-rust">use cw_storage_plus::{IndexedMap, Item, Map, MultiIndex, SnapshotMap, Strategy};

pub const CONFIG: Item&lt;Config&gt; = Item::new("config");
pub const BALANCES: Map&lt;&amp;Addr, Uint128&gt; = Map::new("balance");
pub const ALLOWANCES: Map&lt;(&amp;Addr, &amp;Addr), Uint128&gt; = Map::new("allowance");

pub const STAKED: SnapshotMap&lt;&amp;Addr, Uint128&gt; = SnapshotMap::new(
    "staked",
    "staked__checkpoints",
    "staked__changelog",
    Strategy::EveryBlock,
);</code></pre>
      <h3>Messages and JSON serialization</h3>
      <pre><code class="language-rust">#[cw_serde]
pub struct InstantiateMsg {
    pub owner: String,
    pub initial_count: u64,
}

#[cw_serde]
pub enum ExecuteMsg {
    Increment {},
    Reset { count: u64 },
    Transfer { recipient: String, amount: Uint128 },
    Receive(cw20::Cw20ReceiveMsg),
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(CountResponse)]
    GetCount {},
}</code></pre>
      <h3>Cross-contract calls and replies</h3>
      <pre><code class="language-rust">let sub_msg = SubMsg {
    id: INSTANTIATE_REPLY_ID,
    msg: CosmosMsg::Wasm(WasmMsg::Instantiate {
        admin: Some(env.contract.address.to_string()),
        code_id,
        msg: to_json_binary(&amp;ChildMsg {})?,
        funds: vec![],
        label: "child".to_string(),
    }),
    gas_limit: None,
    reply_on: ReplyOn::Success,
    payload: Binary::default(),
};

Ok(Response::new().add_submessage(sub_msg))</code></pre>
      <p>Migration implication: if your contract relies heavily on <code>reply</code>, child contract instantiation, CW20 receive hooks, or SnapshotMap queries, capture those flows explicitly before you start translating handlers one by one.</p>
    `,
  },
  {
    id: "anchor-reference",
    navLabel: "Anchor Reference",
    tone: "default",
    html: `
      <h2>Solana / Anchor Deep Reference</h2>
      <p>Anchor gives you a safer and more ergonomic way to express account validation, PDAs, and CPI, but it does not change Solana's core rule: state is externalized into accounts and every instruction must declare the graph it touches.</p>
      <h3>Typical project structure</h3>
      <pre><code class="language-text">my-program/
├── Anchor.toml
├── programs/
│   └── my-program/
│       └── src/lib.rs
├── tests/
│   └── my-program.ts
└── target/
    ├── deploy/
    └── idl/</code></pre>
      <h3>Program, accounts, events, and errors</h3>
      <pre><code class="language-rust">use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context&lt;Initialize&gt;, initial_count: u64) -> Result&lt;()&gt; {
        let counter = &amp;mut ctx.accounts.counter;
        counter.authority = ctx.accounts.authority.key();
        counter.count = initial_count;
        counter.bump = ctx.bumps.counter;
        emit!(CounterInitialized {
            authority: ctx.accounts.authority.key(),
            initial_count,
        });
        Ok(())
    }
}

#[account]
pub struct Counter {
    pub authority: Pubkey,
    pub count: u64,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct Initialize&lt;'info&gt; {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 1,
        seeds = [b"counter", authority.key().as_ref()],
        bump,
    )]
    pub counter: Account&lt;'info, Counter&gt;,
    #[account(mut)]
    pub authority: Signer&lt;'info&gt;,
    pub system_program: Program&lt;'info, System&gt;,
}

#[event]
pub struct CounterInitialized {
    pub authority: Pubkey,
    pub initial_count: u64,
}</code></pre>
      <h3>Account types and constraints</h3>
      <pre><code class="language-rust">#[derive(Accounts)]
pub struct AllConstraintPatterns&lt;'info&gt; {
    #[account(init, payer = payer, space = 8 + 128)]
    pub new_account: Account&lt;'info, MyData&gt;,

    #[account(init_if_needed, payer = payer, space = 8 + 128)]
    pub maybe_new: Account&lt;'info, MyData&gt;,

    #[account(mut, close = payer)]
    pub closing_account: Account&lt;'info, MyData&gt;,

    #[account(has_one = authority @ ErrorCode::Unauthorized)]
    pub config: Account&lt;'info, Config&gt;,

    #[account(seeds = [b"vault", authority.key().as_ref()], bump = vault.bump)]
    pub vault: Account&lt;'info, VaultState&gt;,

    pub authority: Signer&lt;'info&gt;,
    #[account(mut)]
    pub payer: Signer&lt;'info&gt;,
    pub system_program: Program&lt;'info, System&gt;,
}</code></pre>
      <h3>PDA and CPI patterns</h3>
      <pre><code class="language-rust">pub fn transfer_from_vault(ctx: Context&lt;TransferFromVault&gt;, amount: u64) -> Result&lt;()&gt; {
    let signer_seeds: &amp;[&amp;[&amp;[u8]]] = &amp;[&amp;[
        b"vault",
        ctx.accounts.authority.key().as_ref(),
        &amp;[ctx.accounts.vault.bump],
    ]];

    anchor_spl::token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;
    Ok(())
}</code></pre>
      <h3>Modeling implications</h3>
      <ul>
        <li>Use singleton PDAs for global config and per-user PDAs for what used to be <code>Map&lt;&amp;Addr, V&gt;</code> state.</li>
        <li>Use typed accounts whenever possible. <code>UncheckedAccount</code> should be rare and justified.</li>
        <li>Design account size, upgrade control, and CPI boundaries up front. These are not cleanup tasks later.</li>
        <li>If you need Token-2022 extensions, choose them for a concrete feature reason, not because they are newer.</li>
      </ul>
    `,
  },
  {
    id: "migration-patterns",
    navLabel: "1:1 Mapping",
    tone: "phase",
    html: `
      <h2>Migration Patterns: 1-to-1 Mapping</h2>
      <p>The fastest way to make a contract-porting plan is to translate primitives, not just syntax.</p>
      <h3><code>Item&lt;T&gt;</code> to singleton PDA</h3>
      <pre><code class="language-rust">// CosmWasm
pub const CONFIG: Item&lt;Config&gt; = Item::new("config");

// Anchor
#[account]
pub struct Config {
    pub owner: Pubkey,
    pub fee_bps: u16,
    pub bump: u8,
}

#[account(
    init,
    payer = owner,
    space = 8 + 32 + 2 + 1,
    seeds = [b"config"],
    bump,
)]
pub config: Account&lt;'info, Config&gt;,</code></pre>
      <h3><code>Map&lt;K, V&gt;</code> to per-key PDA</h3>
      <pre><code class="language-rust">// CosmWasm
pub const BALANCES: Map&lt;&amp;Addr, Uint128&gt; = Map::new("balance");

// Anchor
#[account]
pub struct Balance {
    pub owner: Pubkey,
    pub amount: u64,
    pub bump: u8,
}

#[account(
    init_if_needed,
    payer = payer,
    space = 8 + 32 + 8 + 1,
    seeds = [b"balance", user.key().as_ref()],
    bump,
)]
pub balance: Account&lt;'info, Balance&gt;,</code></pre>
      <h3><code>WasmMsg::Execute</code> to CPI</h3>
      <pre><code class="language-rust">// CosmWasm
CosmosMsg::Wasm(WasmMsg::Execute {
    contract_addr: other.to_string(),
    msg: to_json_binary(&amp;OtherMsg::DoThing { param: 42 })?,
    funds: vec![],
})

// Anchor
declare_program!(other_program);

other_program::cpi::do_thing(
    CpiContext::new(
        ctx.accounts.other_program.to_account_info(),
        other_program::cpi::accounts::DoThing {
            authority: ctx.accounts.authority.to_account_info(),
            data: ctx.accounts.other_data.to_account_info(),
        },
    ),
)?;</code></pre>
      <h3><code>reply</code> usually disappears</h3>
      <p>In CosmWasm, child addresses and callback results often land later through <code>reply</code>. In Anchor, PDA addresses are usually deterministic before creation, and CPI returns inline. When a CPI mutates an account you want to read afterward, call <code>.reload()</code> before using the updated data.</p>
      <pre><code class="language-rust">dex_program::cpi::swap(cpi_ctx, amount_in)?;
ctx.accounts.user_position.reload()?;
let amount_out = ctx.accounts.user_position.last_swap_out;</code></pre>
      <h3>CW20 and CW721 equivalents</h3>
      <ul>
        <li><strong>CW20 token contract</strong> becomes an SPL mint plus token accounts or ATAs.</li>
        <li><strong>CW20 allowances</strong> become delegate approvals or explicit allowance PDAs depending on product needs.</li>
        <li><strong>CW721 ownership and metadata</strong> usually map to SPL + Metaplex metadata or Metaplex Core.</li>
        <li><strong><code>migrate</code></strong> becomes a program upgrade plus an explicit migration instruction that transforms state.</li>
      </ul>
    `,
  },
  {
    id: "full-examples",
    navLabel: "Side-by-Side Examples",
    tone: "phase",
    html: `
      <h2>Full Contract Examples Side by Side</h2>
      <p>Start with one contract that is small enough to finish and representative enough to flush out the execution-model rewrite. These examples cover the common patterns that usually shape the rest of the migration.</p>
      <h3>Counter: contract state to PDA-owned account</h3>
      <pre><code class="language-rust">// CosmWasm
pub const STATE: Item&lt;State&gt; = Item::new("state");

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result&lt;Response, ContractError&gt; {
    match msg {
        ExecuteMsg::Increment {} =&gt; {
            STATE.update(deps.storage, |mut s| { s.count += 1; Ok(s) })?;
            Ok(Response::new().add_attribute("action", "increment"))
        }
        ExecuteMsg::Reset { count } =&gt; {
            let state = STATE.load(deps.storage)?;
            if info.sender != state.owner {
                return Err(ContractError::Unauthorized {});
            }
            STATE.update(deps.storage, |mut s| { s.count = count; Ok(s) })?;
            Ok(Response::new().add_attribute("action", "reset"))
        }
    }
}</code></pre>
      <pre><code class="language-rust">// Anchor
#[account]
pub struct Counter {
    pub owner: Pubkey,
    pub count: i64,
    pub bump: u8,
}

pub fn increment(ctx: Context&lt;Update&gt;) -> Result&lt;()&gt; {
    ctx.accounts.counter.count = ctx.accounts.counter.count
        .checked_add(1)
        .ok_or(ErrorCode::Overflow)?;
    Ok(())
}

#[derive(Accounts)]
pub struct Update&lt;'info&gt; {
    #[account(
        mut,
        seeds = [b"counter", owner.key().as_ref()],
        bump = counter.bump,
        has_one = owner @ ErrorCode::Unauthorized,
    )]
    pub counter: Account&lt;'info, Counter&gt;,
    pub owner: Signer&lt;'info&gt;,
}</code></pre>
      <h3>Escrow: bank sends to vault plus token CPIs</h3>
      <pre><code class="language-rust">// CosmWasm
Ok(Response::new()
    .add_message(BankMsg::Send {
        to_address: escrow.maker.into(),
        amount: vec![Coin {
            denom: escrow.ask_denom,
            amount: escrow.ask_amount,
        }],
    })
    .add_message(BankMsg::Send {
        to_address: info.sender.into(),
        amount: vec![Coin {
            denom: escrow.offer_denom,
            amount: escrow.offer_amount,
        }],
    }))</code></pre>
      <pre><code class="language-rust">// Anchor
token::transfer(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.taker_token_b.to_account_info(),
            to: ctx.accounts.maker_token_b.to_account_info(),
            authority: ctx.accounts.taker.to_account_info(),
        },
    ),
    esc.ask_amount,
)?;

token::transfer(
    CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.taker_token_a.to_account_info(),
            authority: ctx.accounts.escrow_state.to_account_info(),
        },
        signer_seeds,
    ),
    esc.offer_amount,
)?;</code></pre>
      <h3>AMM and NFT migrations</h3>
      <ul>
        <li><strong>AMM pools:</strong> replace one contract-owned state bucket with a pool PDA, vault token accounts, and an LP mint controlled by the pool PDA.</li>
        <li><strong>NFT contracts:</strong> rewrite CW721 ownership and metadata flows around SPL minting and Metaplex metadata creation.</li>
      </ul>
      <pre><code class="language-rust">// Metaplex metadata creation inside an Anchor instruction
create_metadata_accounts_v3(
    CpiContext::new(
        ctx.accounts.token_metadata_program.to_account_info(),
        CreateMetadataAccountsV3 {
            metadata: ctx.accounts.metadata_account.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            mint_authority: ctx.accounts.authority.to_account_info(),
            update_authority: ctx.accounts.authority.to_account_info(),
            payer: ctx.accounts.payer.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        },
    ),
    metadata,
    true,
    true,
    None,
)?;</code></pre>
    `,
  },
  {
    id: "testing",
    navLabel: "Testing",
    tone: "phase",
    html: `
      <h2>Testing</h2>
      <p>On Solana, transaction assembly is part of the product surface. That means your tests need to exercise accounts, signers, PDA derivation, and CPI edges, not just business logic in isolation.</p>
      <h3>Anchor TypeScript integration tests</h3>
      <pre><code class="language-typescript">const [counterPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter"), authority.publicKey.toBuffer()],
  program.programId
);

await program.methods
  .initialize(new BN(42))
  .accounts({
    counter: counterPda,
    authority: authority.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();

const account = await program.account.counter.fetch(counterPda);
expect(account.count.toNumber()).to.equal(42);</code></pre>
      <h3>Fast tests with LiteSVM</h3>
      <pre><code class="language-typescript">const svm = new LiteSVM();
const programBytes = fs.readFileSync("target/deploy/counter.so");
svm.addProgram(programId, programBytes);

svm.airdrop(authority.publicKey, BigInt(10_000_000_000));
svm.setClock({
  ...svm.getClock(),
  unixTimestamp: svm.getClock().unixTimestamp + BigInt(86400),
});</code></pre>
      <h3>What changes relative to <code>cw-multi-test</code></h3>
      <ul>
        <li><strong><code>cw-multi-test</code></strong> gives you a chain simulator around contract messages and balances.</li>
        <li><strong>Anchor tests</strong> make you own the account graph explicitly, which is closer to production behavior.</li>
        <li><strong>Use both mindsets:</strong> port your old contract tests conceptually, then add Solana-specific cases for signer abuse, account substitution, stale data after CPI, and account closure behavior.</li>
      </ul>
    `,
  },
  {
    id: "deployment-upgrades",
    navLabel: "Deployment & Upgrades",
    tone: "phase",
    html: `
      <h2>Deployment and Upgrades</h2>
      <p>CosmWasm migration logic often lives in <code>migrate</code>. On Solana, code deployment and state migration are separate responsibilities. Upgrade the program binary, then run a protected migration instruction if account layouts or invariants changed.</p>
      <h3>Build and deploy</h3>
      <pre><code class="language-bash">anchor build
anchor keys sync

# localnet
anchor deploy --provider.cluster localnet

# devnet
anchor deploy --provider.cluster devnet

solana program show &lt;PROGRAM_ID&gt;
anchor test --skip-build</code></pre>
      <h3>Upgrade flow</h3>
      <pre><code class="language-bash">anchor build
solana program write-buffer target/deploy/my_program.so
solana program upgrade &lt;BUFFER_PUBKEY&gt; &lt;PROGRAM_ID&gt;
solana program show &lt;PROGRAM_ID&gt;

# transfer or revoke upgrade authority
solana program set-upgrade-authority &lt;PROGRAM_ID&gt; \
  --new-upgrade-authority &lt;NEW_AUTHORITY_PUBKEY&gt;</code></pre>
      <h3>Protected migration instruction</h3>
      <pre><code class="language-rust">pub fn migrate_v1_to_v2(ctx: Context&lt;MigrateState&gt;) -> Result&lt;()&gt; {
    require_keys_eq!(
        ctx.accounts.program_data.upgrade_authority_address
            .ok_or(ErrorCode::NoUpgradeAuthority)?,
        ctx.accounts.authority.key(),
        ErrorCode::Unauthorized
    );

    let old = &amp;ctx.accounts.old_config;
    let new = &amp;mut ctx.accounts.new_config;
    new.owner = old.owner;
    new.fee_bps = old.fee_rate as u16;
    new.version = 2;
    new.bump = ctx.bumps.new_config;
    Ok(())
}</code></pre>
      <p>For production, move upgrade authority to a multisig such as Squads as soon as your rollout process allows. A hot deployer key is not an acceptable long-term admin model.</p>
    `,
  },
  {
    id: "security",
    navLabel: "Security Checklist",
    tone: "warning",
    html: `
      <h2>Security Checklist</h2>
      <p>The security model changes with the execution model. Anchor removes some boilerplate, but it does not remove the need to validate accounts, signers, and state transitions explicitly.</p>
      <h3>Critical rules</h3>
      <ul>
        <li>Never replace a required signer with <code>AccountInfo</code> or <code>UncheckedAccount</code>.</li>
        <li>Prefer <code>Account&lt;T&gt;</code> and <code>Program&lt;T&gt;</code> so owner and discriminator checks happen automatically.</li>
        <li>Store canonical bumps and verify them on every PDA re-entry path.</li>
        <li>Use checked arithmetic or enable release overflow checks.</li>
        <li>Reload accounts after CPI before reading mutated data.</li>
        <li>Validate <code>remaining_accounts</code> manually.</li>
        <li>Treat <code>init_if_needed</code> as a sharp edge. It can enable unintended reinitialization if you do not also store and validate state version.</li>
      </ul>
      <pre><code class="language-rust">// GOOD: signer + typed account + canonical bump
#[derive(Accounts)]
pub struct SecureWithdraw&lt;'info&gt; {
    #[account(
        mut,
        seeds = [b"user_vault", authority.key().as_ref()],
        bump = vault.bump,
        has_one = authority @ ErrorCode::Unauthorized,
    )]
    pub vault: Account&lt;'info, VaultState&gt;,
    pub authority: Signer&lt;'info&gt;,
}</code></pre>
      <div class="tw-overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Risk</th>
              <th>CosmWasm habit</th>
              <th>Anchor fix</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Unauthorized caller</td><td>Check <code>info.sender</code></td><td>Use <code>Signer&lt;'info&gt;</code>, <code>has_one</code>, and constraints</td></tr>
            <tr><td>Wrong account data</td><td>Separate namespaces per contract</td><td>Typed accounts check owner and discriminator</td></tr>
            <tr><td>Overflow</td><td>Often hidden by higher-level numeric types</td><td>Use checked math and release overflow checks</td></tr>
            <tr><td>Stale post-call data</td><td><code>reply</code> handles later state</td><td>Reload after CPI if you read updated accounts</td></tr>
            <tr><td>Arbitrary external program</td><td>Not the same surface</td><td>Use <code>Program&lt;T&gt;</code> or explicit ID checks</td></tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: "quick-reference",
    navLabel: "Quick Reference",
    tone: "success",
    html: `
      <h2>Quick Reference Table</h2>
      <p>Use this as a fast translation map when you are porting familiar contract primitives into Solana-native account and instruction patterns.</p>
    `,
  },
];

export const QUICK_REFERENCE_ROWS = [
  ["Item<T>", "Singleton PDA account"],
  ["Map<K, V>", "PDA per key with deterministic seeds"],
  ["IndexedMap", "PDAs plus off-chain filtering with getProgramAccounts"],
  ["SnapshotMap", "Versioned accounts or custom historical model"],
  ["instantiate", "initialize instruction with init"],
  ["execute", "Instruction handlers in #[program]"],
  ["query", "RPC reads and account decoding"],
  ["migrate", "Program upgrade plus migration instruction"],
  ["reply", "Usually unnecessary because CPI is synchronous"],
  ["BankMsg::Send", "System Program CPI or token transfer CPI"],
  ["WasmMsg::Execute", "Anchor CPI or raw invoke"],
  ["ContractError", "#[error_code] enum"],
  ["env.block.time", "Clock::get()?.unix_timestamp"],
  ["env.block.height", "Clock::get()?.slot"],
  ["info.sender", "ctx.accounts.signer.key()"],
  ["CW20", "SPL mint plus token accounts or ATAs"],
  ["CW721", "Metaplex metadata or Metaplex Core"],
  ["cw-multi-test", "anchor test, LiteSVM, and integration tests"],
  ["Contract admin", "Stored authority plus program upgrade authority"],
  [
    "IBC contract assumptions",
    "Bridge or interoperability project; no native IBC equivalent",
  ],
];

export const RESOURCE_CARD_DECK = {
  numCols: 3,
  featured: true,
  cards: [
    {
      type: "image",
      headingAs: "h3",
      heading: "CosmWasm Book",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        label: "Read the book",
        url: "https://book.cosmwasm.com/",
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
      heading: "Solana Accounts",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        label: "Read the docs",
        url: "/docs/core/accounts",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Program Derived Addresses",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        label: "Read the docs",
        url: "/docs/core/pda",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Cross Program Invocation",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        label: "Read the docs",
        url: "/docs/core/cpi",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      heading: "Tokens on Solana",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        label: "Explore token docs",
        url: "/docs/tokens",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
  ],
};
