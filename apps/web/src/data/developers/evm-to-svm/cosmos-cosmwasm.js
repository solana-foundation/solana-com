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

// Prose lives in the i18n catalog (`sections.<id>.prose`); each "prose"
// entry consumes the next catalog string, code blocks stay here untranslated.
export const GUIDE_SECTIONS = [
  {
    id: "philosophy-scaling",
    blocks: ["prose"],
  },
  {
    id: "account-model",
    blocks: [
      "prose",
      {
        language: "bash",
        code: `Code Upload (code_id: 42)
      |
      |-- instantiate() -&gt; Contract Address A  [owns its own key-value store]
      |-- instantiate() -&gt; Contract Address B  [owns its own key-value store]
      '-- instantiate() -&gt; Contract Address C  [owns its own key-value store]`,
      },
      "prose",
      {
        language: "bash",
        code: `Deployed Program (address: Program111...)
      |
      |-- Pool Account A   (PDA)
      |-- Pool Account B   (PDA)
      '-- User Account C   (PDA)`,
      },
      "prose",
      {
        language: "rust",
        code: `#[derive(Accounts)]
pub struct Increment&lt;'info&gt; {
    pub user: Signer&lt;'info&gt;,

    #[account(
        mut,
        seeds = [b"counter", user.key().as_ref()],
        bump,
    )]
    pub counter: Account&lt;'info, Counter&gt;,
}`,
      },
      "prose",
      {
        language: "rust",
        code: `pub const USER_COUNTERS: Map&lt;&amp;Addr, u64&gt; = Map::new("user_counters");
let count = USER_COUNTERS.load(deps.storage, &amp;info.sender)?;`,
      },
      "prose",
      {
        language: "typescript",
        code: `import { getAddressEncoder, getProgramDerivedAddress } from "@solana/kit";

const [counterPda, bump] = await getProgramDerivedAddress({
  programAddress: COUNTER_PROGRAM_ADDRESS,
  seeds: ["counter", getAddressEncoder().encode(userAddress)],
});`,
      },
    ],
  },
  {
    id: "project-structure",
    blocks: [
      "prose",
      {
        language: "bash",
        code: `rustup target add wasm32-unknown-unknown
cargo generate --git https://github.com/CosmWasm/cw-template
cargo build --target wasm32-unknown-unknown --release`,
      },
      "prose",
      {
        language: "bash",
        code: `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
cargo install --git https://github.com/solana-foundation/anchor anchor-cli

anchor init my_program
cd my_program
anchor build
anchor test`,
      },
      "prose",
      {
        language: "bash",
        code: `cargo add pinocchio
cargo build-sbf`,
      },
      "prose",
      {
        language: "bash",
        code: `src/
  contract.rs
  msg.rs
  state.rs
  error.rs
tests/`,
      },
      {
        language: "bash",
        code: `programs/my_program/src/
  lib.rs
  instructions/
    initialize.rs
    update_position.rs
    settle.rs
  state.rs
  error.rs
tests/
  initialize.rs
  settle.rs`,
      },
    ],
  },
  {
    id: "entry-points",
    blocks: [
      "prose",
      {
        language: "rust",
        code: `#[entry_point]
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
) -&gt; StdResult&lt;Binary&gt; { ... }`,
      },
      {
        language: "rust",
        code: `use pinocchio::{entrypoint, AccountView, Address, ProgramResult};
use solana_program_error::ProgramError;

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &amp;Address,
    accounts: &amp;mut [AccountView],
    instruction_data: &amp;[u8],
) -&gt; ProgramResult {
    match instruction_data.first() {
        Some(0) =&gt; instructions::initialize::process(program_id, accounts, instruction_data),
        Some(1) =&gt; instructions::increment::process(program_id, accounts, instruction_data),
        Some(2) =&gt; instructions::reset::process(program_id, accounts, instruction_data),
        _ =&gt; Err(ProgramError::InvalidInstructionData),
    }
}`,
      },
      "prose",
      {
        language: "rust",
        code: `#[program]
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
}`,
      },
    ],
  },
  {
    id: "state-management",
    blocks: [
      "prose",
      {
        language: "rust",
        code: `use cw_storage_plus::{Item, Map};

pub const CONFIG: Item&lt;Config&gt; = Item::new("config");
pub const BALANCES: Map&lt;&amp;Addr, Uint128&gt; = Map::new("balances");
pub const ALLOWANCES: Map&lt;(&amp;Addr, &amp;Addr), Uint128&gt; = Map::new("allowances");`,
      },
      {
        language: "rust",
        code: `#[account]
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
}`,
      },
      {
        language: "rust",
        code: `#[repr(C)]
pub struct UserBalance {
    pub owner: Address,
    pub amount: u64,
    pub bump: u8,
}

pub fn process_transfer(
    program_id: &amp;Address,
    accounts: &amp;[AccountView],
    _instruction_data: &amp;[u8],
) -&gt; ProgramResult {
    let [sender, sender_balance, ..] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    let (expected_balance, _bump) =
        Address::derive_program_address(&amp;[b"balance", sender.address().as_ref()], program_id)
            .ok_or(ProgramError::InvalidSeeds)?;

    if sender_balance.address() != &amp;expected_balance {
        return Err(ProgramError::InvalidArgument);
    }

    let balance_data = sender_balance.try_borrow()?;
    let sender_balance_state = UserBalance::try_from_bytes(&amp;balance_data)?;

    if sender_balance_state.owner != *sender.address() {
        return Err(ProgramError::IllegalOwner);
    }

    Ok(())
}`,
      },
      "prose",
      {
        language: "bash",
        code: `solana rent 49 -um
# Rent-exempt minimum: 0.00123192 SOL`,
      },
      {
        language: "rust",
        code: `#[account(
    init,
    payer = user,
    space = 8 + UserBalance::INIT_SPACE,
)]
pub user_balance: Account&lt;'info, UserBalance&gt;`,
      },
      "prose",
      {
        language: "rust",
        code: `use pinocchio::sysvars::{rent::Rent, Sysvar};
use pinocchio_system::instructions::CreateAccount;

let lamports = Rent::get()?.try_minimum_balance(space)?;

CreateAccount {
    from: payer,
    to: user_balance,
    lamports,
    space: space as u64,
    owner: program_id,
}
.invoke()?;`,
      },
      "prose",
      {
        language: "rust",
        code: `#[account]
#[derive(InitSpace)]
pub struct Metadata {
    #[max_len(32)]
    pub name: String,
    #[max_len(200)]
    pub uri: String,
}`,
      },
      "prose",
    ],
  },
  {
    id: "cross-program",
    blocks: [
      "prose",
      {
        language: "rust",
        code: `let exec = WasmMsg::Execute {
    contract_addr: pool_contract.to_string(),
    msg: to_json_binary(&amp;PoolExecuteMsg::Swap { amount_in, min_amount_out })?,
    funds: coins(amount_in.u128(), "uatom"),
};

let sub_msg = SubMsg::reply_on_success(exec, SWAP_REPLY_ID);
Ok(Response::new().add_submessage(sub_msg))`,
      },
      {
        language: "rust",
        code: `let cpi_ctx = CpiContext::new(
    ctx.accounts.pool_program.to_account_info(),
    pool_program::cpi::accounts::Swap {
        pool: ctx.accounts.pool.to_account_info(),
        user_src: ctx.accounts.user_src.to_account_info(),
        user_dst: ctx.accounts.user_dst.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    },
);

pool_program::cpi::swap(cpi_ctx, amount_in, min_amount_out)?;`,
      },
      "prose",
    ],
  },
  {
    id: "token-handling",
    blocks: [
      "prose",
      {
        language: "rust",
        code: `let payment = info.funds.iter()
    .find(|c| c.denom == "uatom")
    .ok_or(ContractError::NoFundsProvided {})?;

let transfer_msg = Cw20ExecuteMsg::TransferFrom {
    owner: info.sender.to_string(),
    recipient: env.contract.address.to_string(),
    amount,
};`,
      },
      {
        language: "rust",
        code: `system_program::transfer(
    CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.sender.to_account_info(),
            to: ctx.accounts.recipient.to_account_info(),
        },
    ),
    lamport_amount,
)?;`,
      },
      {
        language: "rust",
        code: `token::transfer(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.sender_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.sender.to_account_info(),
        },
    ),
    amount,
)?;`,
      },
      {
        language: "rust",
        code: `token::transfer(
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
)?;`,
      },
      {
        language: "rust",
        code: `let transfer_ix = system_instruction::transfer(
    sender.key(),
    recipient.key(),
    lamport_amount,
);

invoke(
    &amp;transfer_ix,
    &amp;[
        sender.clone(),
        recipient.clone(),
        system_program.clone(),
    ],
)?;`,
      },
      {
        language: "rust",
        code: `let transfer_ix = spl_token::instruction::transfer(
    token_program.key(),
    sender_token_account.key(),
    recipient_token_account.key(),
    sender.key(),
    &amp;[],
    amount,
)?;

invoke(
    &amp;transfer_ix,
    &amp;[
        sender_token_account.clone(),
        recipient_token_account.clone(),
        sender.clone(),
        token_program.clone(),
    ],
)?;`,
      },
      {
        language: "rust",
        code: `let signer_seeds: [&amp;[u8]; 2] = [b"vault_authority", &amp;[vault_bump]];
let transfer_ix = spl_token::instruction::transfer(
    token_program.key(),
    vault.key(),
    user_token_account.key(),
    vault_authority.key(),
    &amp;[],
    amount,
)?;

invoke_signed(
    &amp;transfer_ix,
    &amp;[
        vault.clone(),
        user_token_account.clone(),
        vault_authority.clone(),
        token_program.clone(),
    ],
    &amp;[&amp;signer_seeds],
)?;`,
      },
      "prose",
    ],
  },
  {
    id: "serialization",
    blocks: [
      "prose",
      {
        language: "rust",
        code: `#[cw_serde]
pub enum ExecuteMsg {
    Transfer { recipient: String, amount: Uint128 },
    Burn { amount: Uint128 },
}`,
      },
      {
        language: "rust",
        code: `#[derive(SchemaWrite, SchemaRead)]
pub enum CounterInstruction {
    Initialize { start_value: i64 },
    Increment,
    Reset { value: i64 },
}`,
      },
      "prose",
      {
        language: "typescript",
        code: `import { getAddressCodec, getStructCodec, getU64Codec, getU8Codec } from "@solana/kit";

const userBalanceCodec = getStructCodec([
  ["owner", getAddressCodec()],
  ["amount", getU64Codec()],
  ["bump", getU8Codec()],
]);

// Skip Anchor's 8-byte account discriminator, then decode the layout.
const state = userBalanceCodec.decode(accountData.slice(8));`,
      },
    ],
  },
  {
    id: "client-generation",
    blocks: [
      "prose",
      {
        language: "typescript",
        code: `const client = await SigningCosmWasmClient.connectWithSigner(rpcUrl, signer);
await client.execute(sender, contractAddress, { increment: {} }, "auto");`,
      },
      {
        language: "typescript",
        code: `const program = new Program(idl, provider);

await program.methods
  .increment()
  .accounts({ user: wallet.publicKey })
  .rpc();`,
      },
      "prose",
      {
        language: "bash",
        code: `npx codama init
npx codama run js`,
      },
      "prose",
    ],
  },
  {
    id: "error-handling",
    blocks: [
      "prose",
      {
        language: "rust",
        code: `#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("Unauthorized")]
    Unauthorized {},
}`,
      },
      {
        language: "rust",
        code: `#[error_code]
pub enum CounterError {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    #[msg("Arithmetic overflow")]
    Overflow,
}`,
      },
      {
        language: "rust",
        code: `require!(
    ctx.accounts.counter.authority == ctx.accounts.user.key(),
    CounterError::Unauthorized
);`,
      },
    ],
  },
  {
    id: "time-block",
    blocks: [
      "prose",
      {
        language: "rust",
        code: `let now_secs = env.block.time.seconds();
let height = env.block.height;`,
      },
      {
        language: "rust",
        code: `let clock = Clock::get()?;

require!(
    clock.unix_timestamp &gt;= unlock_time,
    LockError::NotYetUnlockable
);`,
      },
      "prose",
    ],
  },
  {
    id: "testing",
    blocks: [
      "prose",
      {
        language: "rust",
        code: `let mut app = App::default();
let code = ContractWrapper::new(execute, instantiate, query);
let code_id = app.store_code(Box::new(code));`,
      },
      "prose",
      {
        language: "bash",
        code: `cargo add --dev litesvm
cargo add --dev litesvm-utils
cargo add --dev litesvm-token
cargo add --dev anchor-litesvm`,
      },
      {
        language: "rust",
        code: `let mut svm = LiteSVM::new();
svm.add_program_from_file(PROGRAM_ID, "target/deploy/counter.so")?;`,
      },
      "prose",
      { language: "bash", code: `surfpool start` },
      "prose",
    ],
  },
  {
    id: "deployment-upgrades",
    blocks: [
      "prose",
      {
        language: "bash",
        code: `# CosmWasm
cargo build --target wasm32-unknown-unknown --release
wasmd tx wasm store counter_opt.wasm --from wallet
wasmd tx wasm instantiate CODE_ID '{"count":0}' --from wallet`,
      },
      {
        language: "bash",
        code: `# Solana / Anchor programs
anchor build
anchor deploy

solana program show PROGRAM_ID
solana program set-upgrade-authority PROGRAM_ID --final`,
      },
      {
        language: "bash",
        code: `# Solana / Pinocchio programs with the Solana CLI
cargo build-sbf
solana program deploy ./target/deploy/my_program.so

solana program show PROGRAM_ID
solana program deploy --program-id PROGRAM_ID ./target/deploy/my_program.so
solana program set-upgrade-authority PROGRAM_ID --final`,
      },
      "prose",
      {
        language: "bash",
        code: `solana rent $(wc -c &lt; ./target/deploy/my_program.so)`,
      },
      "prose",
      {
        language: "bash",
        code: `solana-keygen grind --starts-with CNTR:1
solana program deploy ./target/deploy/my_program.so --program-id CNTR_KEYPAIR.json`,
      },
      "prose",
      {
        language: "bash",
        code: `cargo install kora-deploy
kora-deploy --program-so ./target/deploy/my_program.so`,
      },
      "prose",
    ],
  },
  {
    id: "counter-example",
    blocks: [
      "prose",
      {
        language: "rust",
        code: `pub const COUNTS: Map&lt;&amp;Addr, i32&gt; = Map::new("counts");

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
}`,
      },
      "prose",
      {
        language: "rust",
        code: `#[account]
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
}`,
      },
      {
        language: "rust",
        code: `pub fn increment(ctx: Context&lt;ModifyCounter&gt;) -&gt; Result&lt;()&gt; {
    let counter = &amp;mut ctx.accounts.counter;
    if counter.authority == Pubkey::default() {
        counter.authority = ctx.accounts.user.key();
        counter.bump = ctx.bumps.counter;
    }
    counter.count = counter.count
        .checked_add(1)
        .ok_or(CounterError::Overflow)?;
    Ok(())
}`,
      },
      {
        language: "rust",
        code: `#[repr(C)]
pub struct Counter {
    pub count: i64,
    pub authority: Address,
    pub bump: u8,
}

pub fn process_increment(
    program_id: &amp;Address,
    accounts: &amp;mut [AccountView],
    _instruction_data: &amp;[u8],
) -&gt; ProgramResult {
    let [user, counter, ..] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    let (expected_counter, bump) =
        Address::derive_program_address(&amp;[b"counter", user.address().as_ref()], program_id)
            .ok_or(ProgramError::InvalidSeeds)?;

    if counter.address() != &amp;expected_counter {
        return Err(ProgramError::InvalidArgument);
    }

    let mut counter_data = counter.try_borrow_mut()?;
    let counter_state = Counter::try_from_bytes_mut(&amp;mut counter_data)?;

    if counter_state.authority == Address::default() {
        counter_state.authority = *user.address();
        counter_state.bump = bump;
    }

    counter_state.count = counter_state
        .count
        .checked_add(1)
        .ok_or(ProgramError::ArithmeticOverflow)?;

    Ok(())
}`,
      },
      "prose",
    ],
  },
  {
    id: "dex-lessons",
    blocks: ["prose"],
  },
  {
    id: "pitfalls",
    blocks: ["prose"],
  },
  {
    id: "migration-checklist",
    blocks: ["prose"],
  },
  {
    id: "quick-reference",
    blocks: ["prose"],
  },
];

// Destination text is in the catalog (`quickReference.rows`), index-aligned.
export const QUICK_REFERENCE_SOURCES = [
  "Item<T>",
  "Map<K, V>",
  "IndexedMap",
  "SnapshotMap",
  "instantiate",
  "execute",
  "query",
  "migrate",
  "reply",
  "BankMsg::Send",
  "WasmMsg::Execute",
  "ContractError",
  "env.block.time",
  "env.block.height",
  "info.sender",
  "CW20",
  "CW721",
  "cw-multi-test",
  "Contract instance",
  "Contract admin",
];

// Card copy is in the catalog (`resourceCards`), index-aligned.
export const RESOURCE_CARD_URLS = [
  "https://solana.com/docs",
  "https://www.anchor-lang.com/docs",
  "https://solana.com/docs/core/pda",
  "https://solana.com/docs/core/cpi",
  "https://rustopian.dev/article/dopple-dex-in-cosmwasm-and-solana",
  "https://github.com/brimigs/cosmos-migration-guide/tree/main/example-escrow-contracts",
];
