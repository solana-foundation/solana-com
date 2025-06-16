---
title: Transfer Hook
objectives:
  - Create a program that applies the "transfer-hook" interface
  - Create a mint with a transfer hook
  - Transfer a token with a transfer hook successfully
description:
  "Create a token that invokes a function in an onchain program whenever the
  token in transferred."
---

## Summary

- The `transfer hook` extension allows developers to run custom logic on their
  tokens on every transfer

- When a token has a transfer hook, the Token Extensions Program will invoke the
  transfer hook instruction on every token transfer

- For the program to be able to act as a transfer hook program, it needs to
  implement the `TransferHook` interface

- Transfer hooks may use additional accounts beyond those involved in a normal,
  non-hooked transfer. These are called 'extra accounts' and must be provided by
  the transfer instruction, and are set up in in `extra-account-metas` when
  creating the token mint.

- Within the transfer hook CPI, the sender, mint, receiver and owner are all
  de-escalated, meaning they are read-only to the hook. Meaning none of those
  accounts can sign or be written to.

## Overview

The `transfer-hook` extension allows custom onchain logic to be run after each
transfer within the same transaction. More specifically, the `transfer-hook`
extension requires a 'hook' or 'callback' in the form of a Solana program
following the
[Transfer Hook Interface](https://github.com/solana-labs/solana-program-library/tree/master/token/transfer-hook/interface).
Then every time any token of that mint is transferred the Token Extensions
Program calls this 'hook' as a CPI.

Additionally, the `transfer-hook` extension also stores `extra-account-metas`,
which are any additional accounts needed for the hook to function.

This extension allows many new use cases, including:

- Enforcing artist royalty payments to transfer NFTs.
- Stopping tokens from being transferred to known bad actors (blocklists).
- Requiring accounts to own a particular NFT to receive a token (allowlists).
- Token analytics.

In this lesson, we'll explore how to implement transfer hooks onchain and work
with them in the frontend.

### Implementing transfer hooks onchain

The first part of creating a mint with a `transfer hook` is to find or create an
onchain program that follows the
[Transfer Hook Interface](https://github.com/solana-labs/solana-program-library/tree/master/token/transfer-hook/interface).

The
[Transfer Hook Interface](https://github.com/solana-labs/solana-program-library/blob/master/token/transfer-hook/interface/src/instruction.rs)
specifies the transfer hook program includes:

- `Execute` (required): An instruction handler that the Token Extensions Program
  invokes on every token transfer

- `InitializeExtraAccountMetaList` (optional): creates an account
  (`extra_account_meta_list`) that stores a list of additional accounts (i.e.
  those needed by the transfer hook program, beyond the accounts needed for a
  simple transfer) required by the `Execute` instruction

- `UpdateExtraAccountMetaList` (optional): updates the list of additional
  accounts by overwriting the existing list

Technically it's not required to implement the `InitializeExtraAccountMetaList`
instruction using the interface, but it's still required to have the
`extra_account_meta_list` account. This account can be created by any
instruction on a Transfer Hook program. However, the Program Derived Address
(PDA) for the account must be derived using the following seeds:

- The hard-coded string `extra-account-metas`

- The Mint Account address

- The Transfer Hook program ID

```typescript
const [pda] = PublicKey.findProgramAddressSync(
  [Buffer.from("extra-account-metas"), mint.publicKey.toBuffer()],
  program.programId, // transfer hook program ID
);
```

By storing the extra accounts required by the `Execute` instruction in the
`extra_account_meta_list` PDA, these accounts can be automatically added to a
token transfer instruction from the client. We'll see how to do that in the
offchain section.

#### 1. `initialize_extra_account_meta_list` instruction:

When we transfer a token using the Token Extensions Program, the program will
examine our mint to determine if it has a transfer hook. If a transfer hook is
present, the Token Extensions Program will initiate a CPI (cross-program
invocation) to our transfer hook program. The Token Extensions Program will then
pass all the accounts in the transfer (including the extra accounts specified in
the `extra_account_meta_list`) to the transfer hook program. However, before
passing the 4 essential accounts (`sender`, `mint`, `receiver`, `owner`), it
will de-escalate them (i.e. remove the mutable or signing abilities for security
reasons).

In other words, when our hook receives these accounts, they will be read-only.
The transfer hook program cannot modify these accounts, nor can it sign any
transactions with them. Although we cannot alter or sign with any of these four
accounts, we can specify `is_signer` and `is_writable` to any of the additional
accounts in the `extra_account_meta_list` PDA. Additionally, we can use the
`extra_account_meta_list` PDA as a signer for any new data accounts specified in
the hook program.

The `extra_account_meta_list` has to be created before any transfer occurs. It's
also worth noting that we can update the list of accounts in the
`extra_account_meta_list` by implementing and using the
`UpdateExtraAccountMetaList` instruction if necessary.

The `extra_account_meta_list` is just a list of `ExtraAccountMeta`. Let's take a
look at the struct `ExtraAccountMeta`
[in the source code](https://github.com/solana-labs/solana-program-library/blob/4f1668510adef2117ee3c043bd26b79789e67c8d/libraries/tlv-account-resolution/src/account.rs#L90):

```rust
impl ExtraAccountMeta {
    /// Create a `ExtraAccountMeta` from a public key
    /// This represents standard `AccountMeta`
    pub fn new_with_pubkey(
        pubkey: &Pubkey,
        is_signer: bool,
        is_writable: bool,
    ) -> Result<Self, ProgramError> {
        Ok(Self {
            discriminator: 0,
            address_config: pubkey.to_bytes(),
            is_signer: is_signer.into(),
            is_writable: is_writable.into(),
        })
    }

    /// Create an `ExtraAccountMeta` PDA from a list of seeds
    pub fn new_with_seeds(
        seeds: &[Seed],
        is_signer: bool,
        is_writable: bool,
    ) -> Result<Self, ProgramError> {
        Ok(Self {
            discriminator: 1,
            address_config: Seed::pack_into_address_config(seeds)?,
            is_signer: is_signer.into(),
            is_writable: is_writable.into(),
        })
    }

    /// Create an `ExtraAccountMeta` PDA for an external program from a list of seeds
    /// This PDA belongs to a program elsewhere in the account list, rather
    /// than the executing program. For a PDA on the executing program, use
    /// `ExtraAccountMeta::new_with_seeds`.
    pub fn new_external_pda_with_seeds(
        program_index: u8,
        seeds: &[Seed],
        is_signer: bool,
        is_writable: bool,
    ) -> Result<Self, ProgramError> {
        Ok(Self {
            discriminator: program_index
                .checked_add(U8_TOP_BIT)
                .ok_or(AccountResolutionError::InvalidSeedConfig)?,
            address_config: Seed::pack_into_address_config(seeds)?,
            is_signer: is_signer.into(),
            is_writable: is_writable.into(),
        })
    }
```

We have three methods for creating an `ExtraAccountMeta`:

1. `ExtraAccountMeta::new_with_pubkey` - For any normal account (not a program
   account)

2. `ExtraAccountMeta::new_with_seeds` - For a program account PDA from the
   calling transfer hook program

3. `ExtraAccountMeta::new_external_pda_with_seeds` - For a program account PDA
   from a different external program

Now that we know the accounts we can store them in `extra_account_meta_list`.
Let's talk about the `InitializeExtraAccountMetaList` instruction itself. For
most implementations, it should simply just create the `extra_account_meta_list`
account and load it up with any additional accounts it needs.

Let's take a look at a simple example where we'll initialize an
`extra_account_meta_list` with two additional arbitrary accounts, `some_account`
and a `pda_account`. The `initialize_extra_account_meta_list` function will do
the following:

1. Prepare the accounts we need to store in the `extra_account_meta_list`
   account as a vector (we'll discuss that in-depth in a moment).

2. Calculate the size and rent required to store the list of
   `ExtraAccountMetas`.

3. Make a CPI to the System Program to create an account and set the Transfer
   Hook Program as the owner, and then initialize the account data to store the
   list of `ExtraAccountMetas`.

```rust
#[derive(Accounts)]
pub struct InitializeExtraAccountMetaList<'info> {
  #[account(mut)]
  payer: Signer<'info>,

 /// CHECK: ExtraAccountMetaList Account, must use these seeds
  #[account(
        mut,
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump
    )]
  pub extra_account_meta_list: AccountInfo<'info>,
  pub mint: InterfaceAccount<'info, Mint>,

  pub system_program: Program<'info, System>,

  // Accounts to add to the extra-account-metas
  pub some_account: UncheckedAccount<'info>,
  #[account(seeds = [b"some-seed"], bump)]
  pub pda_account: UncheckedAccount<'info>,

}

pub fn initialize_extra_account_meta_list(ctx: Context<InitializeExtraAccountMetaList>) -> Result<()> {
  let account_metas = vec![
    ExtraAccountMeta::new_with_pubkey(&ctx.accounts.some_account.key(), false, true)?, // Read only
    ExtraAccountMeta::new_with_seeds(
      &[
        Seed::Literal {
          bytes: "some-seed".as_bytes().to_vec(),
        },
      ],
      true, // is_signer
      true // is_writable
    )?,
  ];

  // calculate account size
  let account_size = ExtraAccountMetaList::size_of(account_metas.len())? as u64;

  // calculate minimum required lamports
  let lamports = Rent::get()?.minimum_balance(account_size as usize);

  let mint = ctx.accounts.mint.key();
  let signer_seeds: &[&[&[u8]]] = &[&[b"extra-account-metas", &mint.as_ref(), &[ctx.bumps.extra_account_meta_list]]];

  // create ExtraAccountMetaList account
  create_account(
    CpiContext::new(ctx.accounts.system_program.to_account_info(), CreateAccount {
      from: ctx.accounts.payer.to_account_info(),
      to: ctx.accounts.extra_account_meta_list.to_account_info(),
    }).with_signer(signer_seeds),
    lamports,
    account_size,
    ctx.program_id
  )?;

  // initialize ExtraAccountMetaList account with extra accounts
  ExtraAccountMetaList::init::<ExecuteInstruction>(
    &mut ctx.accounts.extra_account_meta_list.try_borrow_mut_data()?,
    &account_metas
  )?;

  Ok(())
}
```

Let's dive a little deeper into the `ExtraAccountMeta` you can store.

You can directly store the account address, store the seeds to derive a PDA of
the program itself and store the seeds to derive a PDA for a program other than
the Transfer Hook program.

The first method is straightforward `ExtraAccountMeta::new_with_pubkey`; you
just need an account address. You can pass it to the instruction or get it from
a library (like the system program or the token program), or you can even
hardcode it.

However, the most interesting part here is storing the seeds, and it could
either be a PDA of the transfer hook program itself or a PDA of another program
like an associated token account. We can do both of them by using
`ExtraAccountMeta::new_with_seeds` and
`ExtraAccountMeta::new_external_pda_with_seeds`, respectively, and pass the
seeds to them.

To learn how we could pass the seeds, let's take a look at the source code
itself:

```rust
pub fn new_with_seeds(
  seeds: &[Seed],
  is_signer: bool,
  is_writable: bool,
)

pub fn new_external_pda_with_seeds(
  program_index: u8,
  seeds: &[Seed],
  is_signer: bool,
  is_writable: bool,
)
```

Both of these methods are similar; the only change is we need to pass the
`program_id` for the PDAs that are not of our program in the
`new_external_pda_with_seeds` method. Other than that we need to provide a list
of seeds (which we'll talk about soon) and two booleans for `is_signer` and
`is_writable` to determine if the account should be a signer or writable.

Providing the seeds themselves takes a little explanation. Hard-coded literal
seeds are easy enough, but what happens if you want a seed to be variable, say
created with the public key of a passed-in account? To make sense of this, let's
break it down to make it easier to understand. First, take a look at the seed
enum implementation from
[spl_tlv_account_resolution::seeds::Seed](https://github.com/solana-labs/solana-program-library/blob/master/libraries/tlv-account-resolution/src/seeds.rs):

```rust
pub enum Seed
    /// Uninitialized configuration byte space
    Uninitialized,
    /// A literal hard-coded argument
    /// Packed as:
    ///     * 1 - Discriminator
    ///     * 1 - Length of literal
    ///     * N - Literal bytes themselves
    Literal {
        /// The literal value represented as a vector of bytes.
        ///
        /// For example, if a literal value is a string literal,
        /// such as "my-seed", this value would be
        /// `"my-seed".as_bytes().to_vec()`.
        bytes: Vec<u8>,
    },
    /// An instruction-provided argument, to be resolved from the instruction
    /// data
    /// Packed as:
    ///     * 1 - Discriminator
    ///     * 1 - Start index of instruction data
    ///     * 1 - Length of instruction data starting at index
    InstructionData {
        /// The index where the bytes of an instruction argument begin
        index: u8,
        /// The length of the instruction argument (number of bytes)
        ///
        /// Note: Max seed length is 32 bytes, so `u8` is appropriate here
        length: u8,
    },
    /// The public key of an account from the entire accounts list.
    /// Note: This includes any extra accounts required.
    ///
    /// Packed as:
    ///     * 1 - Discriminator
    ///     * 1 - Index of account in the accounts list
    AccountKey {
        /// The index of the account in the entire accounts list
        index: u8,
    },
    /// An argument to be resolved from the inner data of some account
    /// Packed as:
    ///     * 1 - Discriminator
    ///     * 1 - Index of account in the accounts list
    ///     * 1 - Start index of account data
    ///     * 1 - Length of account data starting at index
    AccountData {
        /// The index of the account in the entire accounts list
        account_index: u8,
        /// The index where the bytes of an account data argument begin
        data_index: u8,
        /// The length of the argument (number of bytes)
        ///
        /// Note: Max seed length is 32 bytes, so `u8` is appropriate here
        length: u8,
    },
}
```

As we can see from the code above, there are four main ways to provide seeds:

1. A literal hard-coded argument, such as the string `"some-seed"`.

2. An instruction-provided argument, to be resolved from the instruction data.
   This can be done by giving the start index and the length of the data we want
   to have as a seed.

3. The public key of an account from the entire accounts list. This can be done
   by giving the index of the account (we'll talk about this more soon).

4. An argument to be resolved from the inner data of some account. This can be
   done by giving the index of the account, the start index of the data, along
   with the length of the data we want to have as a seed.

To use the 2 last methods of setting the seed, you need to get the account
index. This represents the index of the account passed into the `Execute`
function of the hook. The indexes are standardized:

- index 0-3 will always be, `source`, `mint`, `destination`, and `owner`
  respectively

- index 4: will be the `extra_account_meta_list`

- index 5+: will be in whatever order you create your `account_metas`

```rust
    // index 0-3 are the accounts required for token transfer (source, mint, destination, owner)
    // index 4 is the extra_account_meta_list account
  let account_metas = vec![
    // index 5 - some_account
    ExtraAccountMeta::new_with_pubkey(&ctx.accounts.some_account.key(), false, true)?,
    // index 6 - pda_account
    ExtraAccountMeta::new_with_seeds(
      &[
        Seed::Literal {
          bytes: "some-seed".as_bytes().to_vec(),
        },
      ],
      true, // is_signer
      true // is_writable
    )?,
  ];
```

Now, let's say that the `pda_account` was created from "some-seed" and belonged
to `some_account`. This is where we can specify the account key index:

```rust
  // index 0-3 are the accounts required for token transfer (source, mint, destination, owner)
  // index 4 is the extra_account_meta_list account
  let account_metas = vec![
    // index 5 - some_account
    ExtraAccountMeta::new_with_pubkey(&ctx.accounts.some_account.key(), false, true)?,
    // index 6 - pda_account
    ExtraAccountMeta::new_with_seeds(
      &[
        Seed::AccountKey {
          index: 5, // index of `some_account`
        },
        Seed::Literal {
          bytes: "some-seed".as_bytes().to_vec(),
        },
      ],
      true, // is_signer
      true // is_writable
    )?,
  ];
```

Note: remember that the accounts indexed 0-4 are defined by the `Execute`
function of the transfer hook. They are: `source`, `mint`, `destination`,
`owner`, `extra_account_meta_list` respectively. The first four of which, are
de-escalated, or read-only. These will always be read-only. If you try to be
sneaky and add any of these first four accounts into the
`extra_account_meta_list`, they will always be interpreted as read-only, even if
you specify them differently with `is_writable` or `is_signer`.

#### 2. `transfer_hook` Instruction

In Anchor, when the `Execute` function is called, it looks for and calls the
`transfer_hook` instruction. It is the place where we can implement our custom
logic for the token transfer.

When the Token Extensions Program invokes our program, it will invoke this
instruction and pass to it all the accounts plus the amount of the transfer that
just happened. The first 5 accounts will always be `source`, `mint`,
`destination`, `owner`, `extraAccountMetaList`, and the rest are the extra
accounts that we added to the `ExtraAccountMetaList` account if there is any.

Let's take a look at an example `TransferHook` struct for this instruction:

```rust
// Order of accounts matters for this struct.
// The first 4 accounts are the accounts required for token transfer (source, mint, destination, owner)
// Remaining accounts are the extra accounts required from the ExtraAccountMetaList account
// These accounts are provided via CPI to this program from the Token Extensions Program
#[derive(Accounts)]
pub struct TransferHook<'info> {
  #[account(token::mint = mint, token::authority = owner)]
  pub source_token: InterfaceAccount<'info, TokenAccount>,
  pub mint: InterfaceAccount<'info, Mint>,
  #[account(token::mint = mint)]
  pub destination_token: InterfaceAccount<'info, TokenAccount>,
  /// CHECK: source token account owner
  /// This account is not being checked because it is used for ownership validation within the `transfer_hook` instruction.
  pub owner: UncheckedAccount<'info>,

  /// CHECK: ExtraAccountMetaList Account,
  /// This account list is not being checked because it is used dynamically within the program logic.
  #[account(seeds = [b"extra-account-metas", mint.key().as_ref()], bump)]
  pub extra_account_meta_list: UncheckedAccount<'info>,

  // Accounts to add to the extra-account-metas
  pub some_account: UncheckedAccount<'info>,
  #[account(seeds = [b"some-seed"], bump)]
  pub pda_account: UncheckedAccount<'info>,
}
```

As mentioned in the comment, the order here matters; we need the first 5
accounts as shown above, and then the rest of the accounts need to follow the
order of the accounts in the `extraAccountMetaList` account.

Other than that, you can write any functionality you want in within the transfer
hook. But remember, if the hook fails, the entire transaction fails.

```rust
  pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {
    // do your logic here
    Ok(())
  }
```

#### 3. Fallback

One last caveat to the onchain portion of transfer hooks: when dealing with
Anchor, we need to specify a `fallback` instruction in the Anchor program to
handle the Cross-Program Invocation (CPI) from the Token Extensions Program.

This is necessary because Anchor generates instruction discriminators
differently from the ones used in the Transfer Hook interface instructions. The
instruction discriminator for the `transfer_hook` instruction will not match the
one for the Transfer Hook interface.

Next, versions of Anchor should solve this for us, but for now, we can implement
this simple workaround:

```rust
// fallback instruction handler as work-around to anchor instruction discriminator check
pub fn fallback<'info>(program_id: &Pubkey, accounts: &'info [AccountInfo<'info>], data: &[u8]) -> Result<()> {
  let instruction = TransferHookInstruction::unpack(data)?;

  // match instruction discriminator to transfer hook interface execute instruction
  // token2022 program CPIs this instruction on token transfer
  match instruction {
      TransferHookInstruction::Execute { amount } => {
      let amount_bytes = amount.to_le_bytes();

      // invoke custom transfer hook instruction on our program
      __private::__global::transfer_hook(program_id, accounts, &amount_bytes)
      }
      _ => {
      return Err(ProgramError::InvalidInstructionData.into());
      }
  }
}
```

### Using transfer hooks from the frontend

Now that we've looked at the onchain portion, let's look at how we interact with
them in the frontend.

Let's assume we have a deployed Solana program that follows the Transfer Hook
Interface.

In order to create a mint with a transfer hook and ensure successful transfers,
follow these steps:

1. Create the mint with the transfer hook extension and point to the onchain
   transfer hook program you want to use.

2. Initialize the `extraAccountList` account. This step must be done before any
   transfer, and it is the responsibility of the mint owner/creator. It only
   needs to happen once for each mint.

3. Make sure to pass all the required accounts when invoking the transfer
   instruction from the Token Extensions Program.

#### Create a Mint with the `Transfer-Hook` Extension:

To create a mint with the transfer-hook extension, we need three instructions:

1. `createAccount` - Reserves space on the blockchain for the mint account

2. `createInitializeTransferHookInstruction` - initializes the transfer hook
   extension, this takes the transfer hook's program address as a parameter.

3. `createInitializeMintInstruction` - Initializes the mint.

```ts
const extensions = [ExtensionType.TransferHook];

const mintLen = getMintLen(extensions);

const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

const transaction = new Transaction().add(
  // Allocate the mint account
  SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: mint.publicKey,
    space: mintLen,
    lamports: lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  }),
  // Initialize the transfer hook extension and point to our program
  createInitializeTransferHookInstruction(
    mint.publicKey,
    wallet.publicKey,
    program.programId, // Transfer Hook Program ID
    TOKEN_2022_PROGRAM_ID,
  ),
  // Initialize mint instruction
  createInitializeMintInstruction(mint.publicKey, decimals, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
```

#### Initialize `ExtraAccountMetaList` account:

The next step of getting the mint ready for any transactions is initializing the
`ExtraAccountMetaList`. Generally, this is done by calling the
`initializeExtraAccountMetaList` function on the program containing the transfer
hook. Since this is part of the Transfer Hook Interface, this should be
standardized. Additionally, if the transfer hook program was made with Anchor,
it will most likely have autogenerated IDLs, which are TypeScript interfaces
that represent the instructions and accounts of the program. This makes it easy
to interact with the program from the client side.

If you made your own program in Anchor, the IDLs will be in the `target/idl`
folder after compilation. Inside tests or client code you can access the methods
directly from `anchor.workspace.program_name.method`:

```ts
import * as anchor from "@coral-xyz/anchor";

const program = anchor.workspace.TransferHook as anchor.Program<TransferHook>;
// now program.method will give you the methods of the program
```

so to initialize the `ExtraAccountMetaList` all that we need to do is to call
the `initializeExtraAccountMetaList` from the methods and pass the right
accounts to it, you can use the autocomplete feature to get more help with that

```ts
const initializeExtraAccountMetaListInstruction = await program.methods
  .initializeExtraAccountMetaList()
  .accounts({
    mint: mint.publicKey,
    extraAccountMetaList: extraAccountMetaListPDA,
    anotherMint: crumbMint.publicKey,
  })
  .instruction();

const transaction = new Transaction().add(
  initializeExtraAccountMetaListInstruction,
);
```

After calling `initializeExtraAccountMetaList`, you're all set to transfer
tokens with the transfer hook enabled mint.

#### Transfer tokens successfully:

To actually transfer tokens with the `transfer hook` extension, you need to call
`createTransferCheckedWithTransferHookInstruction`. This is a special helper
function provided by `@solana/spl-token` that will gather and submit all of the
needed extra accounts needed to be specified in the `ExtraAccountMetaList`.

```ts
const transferInstruction =
  await createTransferCheckedWithTransferHookInstruction(
    connection,
    sourceTokenAccount,
    mint.publicKey,
    destinationTokenAccount,
    wallet.publicKey,
    BigInt(1), // amount
    0, // Decimals
    [],
    "confirmed",
    TOKEN_2022_PROGRAM_ID,
  );
```

Under the hood, the `createTransferCheckedWithTransferHookInstruction` method
will examine if the mint has a transfer hook, if it does it will get the extra
accounts and add them to the transfer instruction.
[Take a look at the source code](https://github.com/solana-labs/solana-program-library/blob/8ae0c89c12cf05d0787ee349dd5454e1dcbe4a4f/token/js/src/extensions/transferHook/instructions.ts#L261)

```ts
/**
 * Construct an transferChecked instruction with extra accounts for transfer hook
 *
 * @param connection            Connection to use
 * @param source                Source account
 * @param mint                  Mint to update
 * @param destination           Destination account
 * @param owner                 Owner of the source account
 * @param amount                The amount of tokens to transfer
 * @param decimals              Number of decimals in transfer amount
 * @param multiSigners          The signer account(s) for a multisig
 * @param commitment            Commitment to use
 * @param programId             SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export async function createTransferCheckedWithTransferHookInstruction(
  connection: Connection,
  source: PublicKey,
  mint: PublicKey,
  destination: PublicKey,
  owner: PublicKey,
  amount: bigint,
  decimals: number,
  multiSigners: (Signer | PublicKey)[] = [],
  commitment?: Commitment,
  programId = TOKEN_PROGRAM_ID,
) {
  const instruction = createTransferCheckedInstruction(
    source,
    mint,
    destination,
    owner,
    amount,
    decimals,
    multiSigners,
    programId,
  );

  const mintInfo = await getMint(connection, mint, commitment, programId);
  const transferHook = getTransferHook(mintInfo);

  if (transferHook) {
    await addExtraAccountMetasForExecute(
      connection,
      instruction,
      transferHook.programId,
      source,
      mint,
      destination,
      owner,
      amount,
      commitment,
    );
  }

  return instruction;
}
```

### Theoretical Example - Artist Royalties

Let's take what we know about the `transfer hook` extension and conceptually try
to understand how we could implement artist royalties for NFTs. If you're not
familiar, an artist royalty is a fee paid on any sale of an NFT. Historically,
these were more suggestions than enforcements, since at any time, a user could
strike a private deal and exchange their NFT for payment on a platform or
program that did not enforce these royalties. That being said, we can get a
little closer with transfer hooks.

**First Approach** - Transfer SOL right from the `owner` to the artist right in
the hook. Although this may sound like a good avenue to try, it won't work, for
two reasons. First, the hook would not know how much to pay the artist - this is
because the transfer hook does not take any arguments other than the needed
`source`, `mint`, `destination`, `owner`, `extraAccountMetaList`, and all of the
accounts within the list. Secondly, we would be paying from the `owner` to the
artist, which cannot be done since `owner` is deescalated. It cannot sign and it
cannot be written to - this means we don't have the authority to update
`owner`'s balance. Although we can't use this approach, it's a good way to
showcase the limitations of the transfer hook.

**Second Approach** - Create a data PDA owned by the `extraAccountMetaList` that
tracks if the royalty has been paid. If it has, allow the transfer, if it has
not, deny it. This approach is multi step and would require an additional
function in the transfer hook program.

Say we have a new function called `payRoyalty` in our transfer hook program.
This function would be required to:

1. Create a data PDA owned by the `extraAccountMetaList`

a. This account would hold information about the trade

2. Transfer the amount for the royalty from the `owner` to the artist.

3. Update the data PDA with the sale information

Then you'd transfer, and all the transfer hook should do is check the sales data
on the PDA. It would allow or disallow the transfer from there.

Remember this the above is just a theoretical discussion and is in no way
all-encompassing. For example, how would you enforce the prices of the NFTs? Or,
what if the owner of the NFT wants to transfer it to a different wallet of
theirs - should there be an approved list of "allowed" wallets? Or, should the
artist be a signer involved in every sale/transfer? This system design makes for
a great homework assignment!

## Lab

In this lab we'll explore how transfer hooks work by creating a Cookie Crumb
program. We'll have a Cookie NFT that has a transfer hook which will mint a
Crumb SFT (NFT with a supply > 1) to the sender after each transfer - leaving a
"crumb trail". A fun side effect is we'll able to tell how many times this NFT
has been transferred just by looking at the crumb supply.

### 0. Setup

#### 1. Verify Solana/Anchor/Rust Versions

We'll be interacting with the `Token Extensions Program` in this lab and that
requires you to have the Solana CLI version ≥ 1.18.1.

To check your version run:

```bash
solana --version
```

If the version printed out after running `solana --version` is less than
`1.18.0` then you can update the CLI version manually. Note, at the time of
writing this, you cannot simply run the `solana-install update` command. This
command will not update the CLI to the correct version for us, so we have to
explicitly download version `1.18.0`. You can do so with the following command:

```bash
solana-install init 1.18.1
```

If you run into this error at any point attempting to build the program, that
likely means you do not have the correct version of the Solana CLI installed.

```bash
anchor build
error: package `solana-program v1.18.1` cannot be built because it requires rustc 1.72.0 or newer, while the currently active rustc version is 1.68.0-dev
Run:
cargo update -p solana-program@1.18.0 --precise ver
where `ver` is the latest version of `solana-program` supporting rustc 1.68.0-dev
```

You will also want the latest version of the Anchor CLI installed. You can
follow the steps to
[update Anchor via avm](https://www.anchor-lang.com/docs/avm)

or simply run

```bash
avm install latest
avm use latest
```

At the time of writing, the latest version of the Anchor CLI is `0.30.1`

Now, we should have all the correct versions installed.

#### 2. Get starter code

Let's grab the starter branch.

```bash
git clone https://github.com/Unboxed-Software/solana-lab-transfer-hooks
cd solana-lab-transfer-hooks
git checkout starter
```

#### 3. Update Program ID and Anchor Keypair

Once in the starter branch, run

```bash
anchor keys sync
```

This syncs your program key with the one in the `Anchor.toml` and the declared
program id in the `programs/transfer-hook/src/lib.rs` file.

The last thing you have to do is set your keypair path in `Anchor.toml`:

```toml
[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"
```

#### 4. Confirm the program builds

Let's build the starter code to confirm we have everything configured correctly.
If it does not build, please revisit the steps above.

```bash
anchor build
```

You can safely ignore the warnings of the build script, these will go away as we
add in the necessary code. But at the end, you should see a message like this:

```bash
Finished release [optimized] target(s)
```

Feel free to run the provided tests to make sure the rest of the dev environment
is set up correctly. You'll have to install the node dependencies using `npm` or
`yarn`. The tests should run, but they'll all fail until we have completed our
program.

```bash
yarn install
anchor test
```

We will be filling these tests in later.

### 1. Write the transfer hook program

In this section we'll dive into writing the onchain transfer hook program using
anchor, all the code will go into the `programs/transfer-hook/src/lib.rs` file.

Take a look inside `lib.rs`, you'll notice we have some starter code:

Three instructions

- `initialize_extra_account_meta_list`

- `transfer_hook`

- `fallback`

Two instruction account structs

- `InitializeExtraAccountMetaList`

- `TransferHook`.

- The `initialize_extra_account_meta_list` function initializes the additional
  accounts needed for the transfer hook.

- The `transfer_hook` is the actual CPI called "after" the transfer has been
  made.

- The `fallback` is an anchor adapter function we have to fill out.

We're going to look at each in depth.

#### 1. Initialize Extra Account Meta List instruction

The cookie transfer hook program needs some extra accounts to be able to mint
the crumbs within the `transfer_hook` function, these are:

1. `crumb_mint` - The "crumb" mint account of the token to be minted by the
   transfer_hook instruction.

2. `crumb_mint_ata` - The associated token account of the crumb mint of the
   person sending the cookie.

3. `mint_authority` - For the crumb mint, this will be the account owned by the
   transfer hook program

4. `token_program` - this mint will be a regular SPL token mint.

5. `associated_token_program` - needed to construct the ATA

We are going to store these accounts in the `extra_account_meta_list` account,
by invoking the instruction `initialize_extra_account_meta_list` and passing the
required accounts to it.

First, we have to build the struct `InitializeExtraAccountMetaList`, then we can
write the instruction itself.

**`InitializeExtraAccountMetaList` Struct**

The Instruction requires the following accounts:

1. `extra_account_meta_list` - The PDA that will hold the extra account.

2. `crumb_mint` - The mint account of the crumb token.

3. `mint` - The mint account of the cookie NFT.

4. `mint_authority` - The mint authority account of the crumb token. - This is a
   PDA seeded by `b"mint-authority"`

5. `payer` - The account that will pay for the creation of the
   `extra_account_meta_list` account.

6. `token_program` - The token program account.

7. `system_program` - The system program account.

The code for the struct will go as follows:

```rust
#[derive(Accounts)]
pub struct InitializeExtraAccountMetaList<'info> {
  #[account(mut)]
  payer: Signer<'info>,

  /// CHECK: ExtraAccountMetaList Account, must use these seeds
  #[account(
        mut,
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump
    )]
  pub extra_account_meta_list: AccountInfo<'info>,
  pub mint: InterfaceAccount<'info, Mint>,
  pub token_program: Interface<'info, TokenInterface>,
  pub system_program: Program<'info, System>,

  #[account(mint::authority = mint_authority)]
  pub crumb_mint: InterfaceAccount<'info, Mint>,

  /// CHECK: mint authority Account for crumb mint
  #[account(seeds = [b"mint-authority"], bump)]
  pub mint_authority: UncheckedAccount<'info>,
}
```

Note that we are not specifying the `crumb_mint_ata` or the
`associated_token_program`. This is because the `crumb_mint_ata` is variable and
will be driven by the other accounts in the `extra_account_meta_list`, and
`associated_token_program` will be hardcoded.

Also, notice we are asking Anchor to drive the `mint_authority` account from the
seed `b"mint-authority"`. The resulting PDA allows the program itself to sign
for the mint.

**`initialize_extra_account_meta_list` Instruction**

Let's write the `initialize_extra_account_meta_list` function, it will do the
following:

1. List the accounts required for the transfer hook instruction inside a vector.

2. Calculate the size and rent required to store the list of
   `extra_account_meta_list`.

3. Make a CPI to the System Program to create an account and set the Transfer
   Hook Program as the owner.

4. Initialize the account data to store the list of `extra_account_meta_list`.

here is the code for it:

```rust
pub fn initialize_extra_account_meta_list(ctx: Context<InitializeExtraAccountMetaList>) -> Result<()> {
  // index 0-3 are the accounts required for token transfer (source, mint, destination, owner)
  // index 4 is the extra_account_meta_list account
  let account_metas = vec![
    // index 5, Token program
    ExtraAccountMeta::new_with_pubkey(&token::ID, false, false)?,
    // index 6, Associated Token program
    ExtraAccountMeta::new_with_pubkey(&associated_token_id, false, false)?,
    // index 7, crumb mint
    ExtraAccountMeta::new_with_pubkey(&ctx.accounts.crumb_mint.key(), false, true)?, // is_writable true
    // index 8, mint authority
    ExtraAccountMeta::new_with_seeds(
      &[
        Seed::Literal {
          bytes: "mint-authority".as_bytes().to_vec(),
        },
      ],
      false, // is_signer
      false // is_writable
    )?,
    // index 9, crumb mint ATA
    ExtraAccountMeta::new_external_pda_with_seeds(
      6, // associated token program index
      &[
        Seed::AccountKey { index: 3 }, // owner index
        Seed::AccountKey { index: 5 }, // token program index
        Seed::AccountKey { index: 7 }, // crumb mint index
      ],
      false, // is_signer
      true // is_writable
    )?
  ];

  // calculate account size
  let account_size = ExtraAccountMetaList::size_of(account_metas.len())? as u64;
  // calculate minimum required lamports
  let lamports = Rent::get()?.minimum_balance(account_size as usize);

  let mint = ctx.accounts.mint.key();
  let signer_seeds: &[&[&[u8]]] = &[&[b"extra-account-metas", &mint.as_ref(), &[ctx.bumps.extra_account_meta_list]]];

  // Create ExtraAccountMetaList account
  create_account(
    CpiContext::new(ctx.accounts.system_program.to_account_info(), CreateAccount {
      from: ctx.accounts.payer.to_account_info(),
      to: ctx.accounts.extra_account_meta_list.to_account_info(),
    }).with_signer(signer_seeds),
    lamports,
    account_size,
    ctx.program_id
  )?;

  // Initialize the account data to store the list of ExtraAccountMetas
  ExtraAccountMetaList::init::<ExecuteInstruction>(
    &mut ctx.accounts.extra_account_meta_list.try_borrow_mut_data()?,
    &account_metas
  )?;

  Ok(())
}
```

Pay careful attention to the indexes for each account. Most notably, see that
`index 9` is the index for the `crumb_mint_ata` account. It constructs the ATA
using `ExtraAccountMeta::new_external_pda_with_seeds` and pass in the seeds from
other accounts by their index. Specifically, the ATA belongs to whatever `owner`
calls the transfer. So when a cookie is sent, the crumb will be minted to the
sender.

#### 2. Transfer Hook instruction

In this step, we'll implement the `transfer_hook` instruction. This instruction
will be called by the Token Extensions Program when a token transfer occurs.

The `transfer_hook` instruction will mint one crumb token each time a cookie
transfer occurs.

Again we'll have a struct `TransferHook` that will hold the accounts required
for the instruction.

**`TransferHook` Struct**

In our program the `TransferHook` struct will have 10 accounts:

1. `source_token` - The source token account from which the NFT is transferred.

2. `mint` - The mint account of the Cookie NFT.

3. `destination_token` - The destination token account to which the NFT is
   transferred.

4. `owner` - The owner of the source token account.

5. `extra_account_meta_list` - The ExtraAccountMetaList account that stores the
   additional accounts required by the transfer_hook instruction

6. `token_program` - The token program account.

7. `associated_token_program` - The associated token program account.

8. `crumb_mint` - The mint account of the token to be minted by the
   transfer_hook instruction.

9. `mint_authority` - The mint authority account of the token to be minted by
   the transfer_hook instruction.

10. `crumb_mint_ata` - The `owner`'s ATA of the crumb mint

> Very Important Note: The order of accounts in this struct matters. This is the
> order in which the Token Extensions Program provides these accounts when it
> invokes this Transfer Hook program.

Here is the instruction struct:

```rust
// Order of accounts matters for this struct.
// The first 4 accounts are the accounts required for token transfer (source, mint, destination, owner)
// Remaining accounts are the extra accounts required from the ExtraAccountMetaList account
// These accounts are provided via CPI to this program from the Token Extensions Program

#[derive(Accounts)]
pub struct TransferHook<'info> {
  #[account(token::mint = mint, token::authority = owner)]
  pub source_token: InterfaceAccount<'info, TokenAccount>,
  pub mint: InterfaceAccount<'info, Mint>,
  #[account(token::mint = mint)]
  pub destination_token: InterfaceAccount<'info, TokenAccount>,
  /// CHECK: source token account owner
  pub owner: UncheckedAccount<'info>,
  /// CHECK: ExtraAccountMetaList Account,
  #[account(seeds = [b"extra-account-metas", mint.key().as_ref()], bump)]
  pub extra_account_meta_list: UncheckedAccount<'info>,
  pub token_program: Interface<'info, TokenInterface>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub crumb_mint: InterfaceAccount<'info, Mint>,
  /// CHECK: mint authority Account,
  #[account(seeds = [b"mint-authority"], bump)]
  pub mint_authority: UncheckedAccount<'info>,
  #[account(
        token::mint = crumb_mint,
        token::authority = owner,
    )]
  pub crumb_mint_ata: InterfaceAccount<'info, TokenAccount>,
}
```

**`transfer_hook` Instruction**

This instruction is fairly simple, it will only make one CPI to the Token
Program to mint a new crumb token for each transfer, all that we need to do is
to pass the right accounts to the `mint_to` CPI.

Since the mint_authority is a PDA of the transfer hook program itself, the
program can sign for it. Therefore we'll use `new_with_signer` and pass
mint_authority seeds as the signer seeds.

```rust
pub fn transfer_hook(ctx: Context<TransferHook>, _amount: u64) -> Result<()> {
  let signer_seeds: &[&[&[u8]]] = &[&[b"mint-authority", &[ctx.bumps.mint_authority]]];

  // mint a crumb token for each transaction
  token::mint_to(
    CpiContext::new_with_signer(
      ctx.accounts.token_program.to_account_info(),
      token::MintTo {
        mint: ctx.accounts.crumb_mint.to_account_info(),
        to: ctx.accounts.crumb_mint_ata.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
      },
      signer_seeds
    ),
    1
  ).unwrap();

  Ok(())
}
```

You may have noticed that we are using `token::mint_to` instead of
`token_2022::mint_to`, additionally in the `extra_account_meta_list` we're
saving the Token Program, not the Token Extensions Program. This is because the
crumb SFT _has_ to be a Token Program mint, not a Token Extensions Program mint.
The reason why is interesting: when first writing this, we wanted to make both
the Cookie and Crumb tokens to be Token Extensions Program mints. However, when
we did this, we would get a very interesting error: `No Reentrancy`. This
happens because the transfer hook is called as a CPI from within the Token
Extensions Program, and Solana does not allow
[recursive CPIs into the same program](https://defisec.info/solana_top_vulnerabilities).

To illustrate:

```text
Token Extensions Program -CPI-> Transfer Hook Program -❌CPI❌-> Token Extensions Program
Token Extensions Program -CPI-> Transfer Hook Program -✅CPI✅-> Token Program
```

So, that's why we're making the crumb SFT a Token Program mint.

#### 3. Fallback instruction

The last instruction we have to fill out is the `fallback`, this is necessary
because Anchor generates instruction discriminators differently from the ones
used in Transfer Hook interface instructions. The instruction discriminator for
the `transfer_hook` instruction will not match the one for the Transfer Hook
interface.

Newer versions of Anchor should solve this for us, but for now, we can implement
this simple workaround:

```rust
// fallback instruction handler as a workaround to anchor instruction discriminator check
pub fn fallback<'info>(program_id: &Pubkey, accounts: &'info [AccountInfo<'info>], data: &[u8]) -> Result<()> {
  let instruction = TransferHookInstruction::unpack(data)?;

  // match instruction discriminator to transfer hook interface execute instruction
  // token2022 program CPIs this instruction on token transfer
  match instruction {
      TransferHookInstruction::Execute { amount } => {
      let amount_bytes = amount.to_le_bytes();

      // invoke custom transfer hook instruction on our program
      __private::__global::transfer_hook(program_id, accounts, &amount_bytes)
      }
      _ => {
      return Err(ProgramError::InvalidInstructionData.into());
      }
  }
}
```

#### 4. Build the program

Let's make sure our program builds and that tests are runnable before we
continue actually writing tests for it.

```bash
anchor test
```

This command will build, deploy and run tests within the `tests/` directory.

If you're seeing any errors try to go through the steps again and make sure you
didn't miss anything.

### 2. Write the tests

Now we'll write some TS scripts to test our code. All of our tests will live
inside `tests/anchor.ts`.

The outline of what will we do here is:

1. Understand the environment

2. Run the (empty) tests

3. Write the "Create Cookie NFT with Transfer Hook and Metadata" test

4. Write the "Create Crumb Mint" test

5. Write the "Initializes ExtraAccountMetaList Account" test

6. Write the "Transfer and Transfer Back" test

#### 1. Understand the environment

When anchor projects are created, they come configured to create typescript
tests with `mocha` and `chai`. When you look at `tests/anchor.ts` you'll see
everything already set up with the tests we'll create.

The following functionality is already provided to you:

1. Get the program IDL.

2. Get the wallet.

3. Get the connection.

4. Set up the environment

5. Airdrop some SOLs into the wallet if needed before running any of the tests.

6. 4 empty tests that we'll talk about later

Let's get familiar with the accounts pre-setup for us:

- `payerWallet`: This is the wallet from `Anchor.toml`, it will be used to pay
  for everything

- `cookieMint`: The Token Extensions Program mint we'll attach metadata and the
  transfer hook to

- `crumbMint`: The Token Program mint we'll attach metadata to, this will be
  what's minted as a result of the transfer hook

- `recipient`: Another wallet to send the cookie to/from

- `sourceCookieAccount`: The ATA of the payer and the cookie mint

- `extraAccountMetaListPDA`: Where we will store all of the extra accounts for
  our hook

- `crumbMintAuthority`: The authority to mint the crumb, owned by the Transfer
  Hook program

We've also provided two sets of hardcoded metadata for the Cookie NFT and the
Crumb SFT.

- `cookieMetadata`

- `crumbMetadata`

#### 2. Running the tests

Since the Crumb SFT is a Token Program mint, to attach metadata to it, we need
to create a Metaplex metadata account. To do this, we need to include the
Metaplex program. This has been provided for you.

If you take a look at `Anchor.toml` you'll see that we load in the Metaplex bpf
at the genesis block. This gives our testing validator access to the account.

```toml
[test]
startup_wait = 5000
shutdown_wait = 2000
upgradeable = false

[[test.genesis]]
address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
program = "tests/metaplex_token_metadata_program.so"
```

If you wish to run a separate local validator to look at the explorer links, you
can. However, you need to start your local validator such that it loads in the
Metaplex program at genesis.

In a separate terminal within the project directory run:

```bash
solana-test-validator --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ./tests/metaplex_token_metadata_program.so
```

Then you can test with:

```bash
anchor test --skip-local-validator
```

#### 3. Write the "Create Cookie NFT with Transfer Hook and Metadata" test

Our first test will create our Cookie NFT, which will have metadata and our
transfer hook attached.

To accomplish all of this we will create several instructions:

- `SystemProgram.createAccount`: Saves space for the mint on the blockchain

- `createInitializeMetadataPointerInstruction`: Points to the mint itself since
  the metadata will be stored within the mint

- `createInitializeTransferHookInstruction`: Configures the transfer function to
  call our transfer hook program

- `createInitializeMintInstruction`: Initializes the mint account

- `createInitializeInstruction`: Adds the metadata to the mint

- `createAssociatedTokenAccountInstruction`: Creates the ATA for the mint to be
  minted to - owned by the payer

- `createMintToInstruction`: Mints one NFT to the ATA

- `createSetAuthorityInstruction`: Revokes the mint authority, making a true
  non-fungible token.

Send all of these instructions in a transaction to the blockchain up and you
have Cookie NFT:

```ts
it("Creates a Cookie NFT with Transfer Hook and Metadata", async () => {
  // NFTs have 0 decimals
  const decimals = 0;

  const extensions = [
    ExtensionType.TransferHook,
    ExtensionType.MetadataPointer,
  ];
  const mintLen = getMintLen(extensions);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(cookieMetadata).length;
  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataLen,
  );

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payerWallet.publicKey,
      newAccountPubkey: cookieMint.publicKey,
      space: mintLen,
      lamports: lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      cookieMint.publicKey, //mint
      payerWallet.publicKey, //authority
      cookieMint.publicKey, //metadata address
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeTransferHookInstruction(
      cookieMint.publicKey, // mint
      payerWallet.publicKey, // authority
      program.programId, // Transfer Hook Program ID
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMintInstruction(
      cookieMint.publicKey, // mint
      decimals, // decimals
      payerWallet.publicKey, // mint authority
      null, // freeze authority
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: cookieMint.publicKey,
      metadata: cookieMint.publicKey,
      name: cookieMetadata.name,
      symbol: cookieMetadata.symbol,
      uri: cookieMetadata.uri,
      mintAuthority: payerWallet.publicKey,
      updateAuthority: payerWallet.publicKey,
    }),
    createAssociatedTokenAccountInstruction(
      payerWallet.publicKey, // payer
      sourceCookieAccount, // associated token account
      payerWallet.publicKey, // owner
      cookieMint.publicKey, // mint
      TOKEN_2022_PROGRAM_ID,
    ),
    createMintToInstruction(
      cookieMint.publicKey, // mint
      sourceCookieAccount, // destination
      payerWallet.publicKey, // authority
      1, // amount - NFTs there will only be one
      [], // multi signers
      TOKEN_2022_PROGRAM_ID,
    ),
    createSetAuthorityInstruction(
      // revoke mint authority
      cookieMint.publicKey, // mint
      payerWallet.publicKey, // current authority
      AuthorityType.MintTokens, // authority type
      null, // new authority
      [], // multi signers
      TOKEN_2022_PROGRAM_ID,
    ),
  );

  const txSig = await sendAndConfirmTransaction(connection, transaction, [
    payerWallet.payer,
    cookieMint,
  ]);
  console.log(getExplorerLink("transaction", txSig, "localnet"));
});
```

Feel free to run the first test to make sure everything is working:

```bash
anchor test
```

#### 4. Write the "Create Crumb Mint" test

Now that we have our cookie NFT, we need our crumb SFTs. Creating the crumbs
that will be minted on each transfer of our cookie will be our second test.

Remember our crumbs are a Token Program mint, and to attach metadata we need to
use Metaplex.

First, we need to grab some Metaplex accounts and format our metadata.

To format our metadata, we need to satisfy Metaplex's `DataV2` struct - for
this, we only need to append some additional fields to our `crumbMetadata`.

The Metaplex accounts we will need are:

- `TOKEN_METADATA_PROGRAM_ID`: The Metaplex program

- `metadataPDA`: The metadata account PDA derived from our `crumbMint`

Lastly, to create our crumb, we need the following instructions:

- `SystemProgram.createAccount`: Saves space for our mint

- `createInitializeMintInstruction`: Initializes our mint

- `createCreateMetadataAccountV3Instruction`: Creates the metadata account

- `createSetAuthorityInstruction`: This sets the mint authority to the
  `crumbMintAuthority`, which is the PDA our transfer hook program owns

Putting it all together we get the following:

```ts
it("Create Crumb Mint", async () => {
  // SFT Should have 0 decimals
  const decimals = 0;

  const size = MINT_SIZE;

  const lamports = await connection.getMinimumBalanceForRentExemption(size);

  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
  );

  const metadataData: DataV2 = {
    ...crumbMetadata,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  };

  const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      crumbMint.publicKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  );

  const metadataPDA = metadataPDAAndBump[0];

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payerWallet.publicKey,
      newAccountPubkey: crumbMint.publicKey,
      space: size,
      lamports: lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      crumbMint.publicKey, // mint
      decimals, // decimals
      payerWallet.publicKey, // mint authority
      null, // freeze authority
      TOKEN_PROGRAM_ID,
    ),
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: crumbMetadata.mint,
        mintAuthority: payerWallet.publicKey,
        payer: payerWallet.publicKey,
        updateAuthority: payerWallet.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          collectionDetails: null,
          data: metadataData,
          isMutable: true,
        },
      },
    ),
    createSetAuthorityInstruction(
      // set authority to transfer hook PDA
      crumbMint.publicKey, // mint
      payerWallet.publicKey, // current authority
      AuthorityType.MintTokens, // authority type
      crumbMintAuthority, // new authority
      [], // multi signers
      TOKEN_PROGRAM_ID,
    ),
  );

  const txSig = await sendAndConfirmTransaction(
    provider.connection,
    transaction,
    [payerWallet.payer, crumbMint],
    { skipPreflight: true },
  );

  console.log(getExplorerLink("transaction", txSig, "localnet"));
});
```

#### 5. Write the "Initializes ExtraAccountMetaList Account" test

Our next test is the last step of setup before we can start transferring our
cookie and seeing the transfer hook work. We need to create the
`ExtraAccountMetaList` account.

We only need to execute one instruction this time:
`initializeExtraAccountMetaList`. This is the function that we've implemented.

Remember it takes the following additional accounts:

- `mint`: The cookie mint

- `extraAccountMetaList`: The PDA that holds the extra accounts

- `crumbMint`: The crumb mint

```ts
// Account to store extra accounts required by the transfer hook instruction
it("Initializes ExtraAccountMetaList Account", async () => {
  const initializeExtraAccountMetaListInstruction = await program.methods
    .initializeExtraAccountMetaList()
    .accounts({
      mint: cookieMint.publicKey,
      extraAccountMetaList: extraAccountMetaListPDA,
      crumbMint: crumbMint.publicKey,
    })
    .instruction();

  const transaction = new Transaction().add(
    initializeExtraAccountMetaListInstruction,
  );

  const txSig = await sendAndConfirmTransaction(
    provider.connection,
    transaction,
    [payerWallet.payer],
    {
      skipPreflight: true,
      commitment: "confirmed",
    },
  );

  console.log(getExplorerLink("transaction", txSig, "localnet"));
});
```

#### 6. Write the "Transfer and Transfer Back" test

Our last test is to transfer our cookie back and forth and see that our crumbs
have been minted to both `payerWallet` and `recipient`.

But before we transfer, we have to create the ATAs to hold the cookie and crumb
tokens for both the `payerWallet` and `recipient`. We can do this by calling
`getOrCreateAssociatedTokenAccount`. And we only need to do this to get the
following: `destinationCookieAccount`, `sourceCrumbAccount` and,
`destinationCrumbAccount`,

because `sourceCookieAccount` was created when we minted the NFT.

To transfer, we call `createTransferCheckedWithTransferHookInstruction`. This
takes the following:

- `connection`: Connection to use

- `source`: Source token account

- `mint`: Mint to transfer

- `destination`: Destination token account

- `owner`: Owner of the source token account

- `amount`: Amount to transfer

- `decimals`: Decimals of the mint

- `multiSigners`: The signer account(s) for a multisig

- `commitment`: Commitment to use

- `programId`: SPL Token program account

We will call this twice, to and from the `recipient`.

You may notice that this does not take any of the additional accounts we need
for the transfer hook like the `crumbMint` for example. This is because this
function fetches the `extraAccountMeta` for us and automatically includes all of
the accounts needed! That being said, it is asynchronous, so we will have to
`await` it.

Lastly, after the transfers, we'll grab the crumb mint and assert the total
supply is two, and that both the `sourceCrumbAccount` and the
`destinationCrumbAccount` have some crumbs.

Putting this all together we get our final test:

```ts
it("Transfer and Transfer Back", async () => {
  const amount = BigInt(1);
  const decimals = 0;

  // Create all of the needed ATAs
  const destinationCookieAccount = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payerWallet.payer,
      cookieMint.publicKey,
      recipient.publicKey,
      false,
      undefined,
      { commitment: "confirmed" },
      TOKEN_2022_PROGRAM_ID,
    )
  ).address;

  const sourceCrumbAccount = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payerWallet.payer,
      crumbMint.publicKey,
      payerWallet.publicKey,
      false,
      undefined,
      { commitment: "confirmed" },
      TOKEN_PROGRAM_ID,
    )
  ).address;

  const destinationCrumbAccount = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      payerWallet.payer,
      crumbMint.publicKey,
      recipient.publicKey,
      false,
      undefined,
      { commitment: "confirmed" },
      TOKEN_PROGRAM_ID,
    )
  ).address;

  // Standard token transfer instruction
  const transferInstruction =
    await createTransferCheckedWithTransferHookInstruction(
      connection,
      sourceCookieAccount,
      cookieMint.publicKey,
      destinationCookieAccount,
      payerWallet.publicKey,
      amount,
      decimals, // Decimals
      [],
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );

  const transferBackInstruction =
    await createTransferCheckedWithTransferHookInstruction(
      connection,
      destinationCookieAccount,
      cookieMint.publicKey,
      sourceCookieAccount,
      recipient.publicKey,
      amount,
      decimals, // Decimals
      [],
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );

  const transaction = new Transaction().add(
    transferInstruction,
    transferBackInstruction,
  );
  const txSig = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payerWallet.payer, recipient],
    {
      skipPreflight: true,
    },
  );

  console.log(getExplorerLink("transaction", txSig, "localnet"));

  const mintInfo = await getMint(
    connection,
    crumbMint.publicKey,
    "processed",
    TOKEN_PROGRAM_ID,
  );

  const sourceCrumbAccountInfo = await getAccount(
    connection,
    sourceCrumbAccount,
    "processed",
    TOKEN_PROGRAM_ID,
  );

  const destinationCrumbAccountInfo = await getAccount(
    connection,
    destinationCrumbAccount,
    "processed",
    TOKEN_PROGRAM_ID,
  );

  expect(Number(mintInfo.supply)).to.equal(2);
  expect(Number(sourceCrumbAccountInfo.amount)).to.equal(1);
  expect(Number(destinationCrumbAccountInfo.amount)).to.equal(1);

  console.log("\nCrumb Count:", Number(mintInfo.supply));
  console.log("Source Crumb Amount:", Number(sourceCrumbAccountInfo.amount));
  console.log(
    "Destination Crumb Amount\n",
    Number(destinationCrumbAccountInfo.amount),
  );
});
```

Go ahead and run all of the tests:

```bash
anchor test
```

They should all be passing!

If you want to take a look at any of the Explorer links do the following:

In a separate terminal within the project directory run:

```bash
solana-test-validator --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ./tests/metaplex_token_metadata_program.so
```

Then you can test with:

```bash
anchor test --skip-local-validator
```

Thats it! You've created a mint with a transfer hook!

## Challenge

Amend the transfer hook such that anyone who has a crumb cannot get their cookie
back.
