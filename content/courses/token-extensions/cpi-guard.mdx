---
title: CPI Guard
objectives:
  - Explain what the CPI Guard protects against
  - Write code to test the CPI Guard
description:
  "Create tokens that don't allow certain accounts to be invoked from other
  programs."
---

## Summary

- `CPI Guard` is a token account extension from the Token Extensions Program
- The `CPI Guard` extension prohibits certain actions inside cross-program
  invocations. When enabled, the guard provides protections against various
  potentially malicious actions on a token account
- `CPI Guard` can be enabled or disabled at will
- These protections are enforced within the `Token Extensions Program` itself

## Overview

CPI Guard is an extension that prohibits certain actions inside cross-program
invocations, protecting users from implicitly signing for actions they can't
see, such as those hidden in programs that aren't the System or Token programs.

A specific example of this is when the CPI guard is enabled, no CPI can approve
a delegate over a token account. This is handy, because if a malicious CPI calls
`set_delegate` no immediate balance change will be apparent, however the
attacker now has transfer and burn authority over the token account. CPI guard
makes this impossible.

Users may choose to enable or disable the CPI Guard extension on their token
account at will. When enabled, it has the following effects during a CPI:

- Transfer: the signing authority must be the owner or previously established
  account delegate
- Burn: the signing authority must be the owner or previously established
  account delegate
- Approve: prohibited - no delegates can be approved within the CPI
- Close Account: the lamport destination must be the account owner
- Set Close Authority: prohibited unless unsetting
- Set Owner: always prohibited, including outside CPI

The CPI Guard is a token account extension, meaning each individual Token
Extensions Program token account has to enable it.

### How the CPI Guard Works

The CPI Guard can be enabled and disabled on a token account that was created
with enough space for the extension. The `Token Extensions Program` runs a few
checks in the logic related to the above actions to determine if it should allow
an instruction to continue or not related to CPI Guards. Generally, what it does
is the following:

- Check if the account has the CPI Guard extension
- Check if CPI Guard is enabled on the token account
- Check if the function is being executed within a CPI

A good way to think about the CPI Guard token extension is simply as a lock that
is either enabled or disabled. The guard uses a
[data struct called `CpiGuard`](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/extension/cpi_guard/mod.rs#L24)
that stores a boolean value. That value indicates whether the guard is enabled
or disabled. The CPI Guard extension only has two instructions, `Enable` and
`Disable`. They each toggle this boolean value.

```rust
pub struct CpiGuard {
    /// Lock privileged token operations from happening via CPI
    pub lock_cpi: PodBool,
}
```

The CPI Guard has two additional helper functions that the
`Token Extensions Program` is able to use to help determine when the CPI Guard
is enabled and when the instruction is being executed as part of a CPI. The
first, `cpi_guard_enabled()`, simply returns the current value of the
`CpiGuard.lock_cpi` field if the extension exists on the account, otherwise, it
returns false. The rest of the program can use this function to determine if the
guard is enabled or not.

```rust
/// Determine if CPI Guard is enabled for this account
pub fn cpi_guard_enabled(account_state: &StateWithExtensionsMut<Account>) -> bool {
    if let Ok(extension) = account_state.get_extension::<CpiGuard>() {
        return extension.lock_cpi.into();
    }
    false
}
```

The second helper function is called `in_cpi()` and determines whether or not
the current instruction is within a CPI. The function is able to determine if
it's currently in a CPI by calling
[`get_stack_height()` from the `solana_program` rust crate](https://docs.rs/solana-program/latest/solana_program/instruction/fn.get_stack_height.html).
This function returns the current stack height of instructions. Instructions
created at the initial transaction level will have a height of
[`TRANSACTION_LEVEL_STACK_HEIGHT`](https://docs.rs/solana-program/latest/solana_program/instruction/constant.TRANSACTION_LEVEL_STACK_HEIGHT.html)
or 1. The first inner invoked transaction, or CPI, will have a height of
`TRANSACTION_LEVEL_STACK_HEIGHT` + 1 and so on. With this information, we know
that if `get_stack_height()` returns a value greater than
`TRANSACTION_LEVEL_STACK_HEIGHT`, we're currently in a CPI! This is exactly what
the `in_cpi()` function checks. If
`get_stack_height() > TRANSACTION_LEVEL_STACK_HEIGHT`, it returns `True`.
Otherwise, it returns `False`.

```rust
/// Determine if we are in CPI
pub fn in_cpi() -> bool {
    get_stack_height() > TRANSACTION_LEVEL_STACK_HEIGHT
}
```

Using these two helper functions, the `Token Extensions Program` can easily
determine if it should reject an instruction or not.

### Toggle CPI Guard

To toggle the CPI Guard on/off, a Token Account must have been initialized for
this specific extension. Then, an instruction can be sent to enable the CPI
Guard. This can only be done from a client. _You cannot toggle the CPI Guard via
CPI_. The `Enable` instruction
[checks if it was invoked via CPI and will return an error if so](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/extension/cpi_guard/processor.rs#L44).
This means only the end user can toggle the CPI Guard.

```rust
// inside process_toggle_cpi_guard()
if in_cpi() {
    return Err(TokenError::CpiGuardSettingsLocked.into());
}
```

You can enable the CPI using the
[`@solana/spl-token` Typescript package](https://solana-labs.github.io/solana-program-library/token/js/modules.html).
Here is an example.

```typescript
// create token account with the CPI Guard extension
const tokenAccount = tokenAccountKeypair.publicKey;
const extensions = [ExtensionType.CpiGuard];
const tokenAccountLen = getAccountLen(extensions);
const lamports =
  await connection.getMinimumBalanceForRentExemption(tokenAccountLen);

const createTokenAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: tokenAccount,
  space: tokenAccountLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});

// create 'enable CPI Guard' instruction
const enableCpiGuardInstruction = createEnableCpiGuardInstruction(
  tokenAccount,
  owner.publicKey,
  [],
  TOKEN_2022_PROGRAM_ID,
);

const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccount,
  mint,
  owner.publicKey,
  TOKEN_2022_PROGRAM_ID,
);

// construct transaction with these instructions
const transaction = new Transaction().add(
  createTokenAccountInstruction,
  initializeAccountInstruction,
  enableCpiGuardInstruction,
);

transaction.feePayer = payer.publicKey;
// Send transaction
await sendAndConfirmTransaction(connection, transaction, [
  payer,
  owner,
  tokenAccountKeypair,
]);
```

You can also use the
[`enableCpiGuard`](https://solana-labs.github.io/solana-program-library/token/js/functions/enableCpiGuard.html)
and
[`disableCpiGuard`](https://solana-labs.github.io/solana-program-library/token/js/functions/disableCpiGuard.html)
helper functions from the `@solana/spl-token` API after the account as been
initialized.

```typescript
// enable CPI Guard
await enableCpiGuard(
  connection, // connection
  payer, // payer
  userTokenAccount.publicKey, // account
  payer, // owner
  [], // multiSigners
);

// disable CPI Guard
await disableCpiGuard(
  connection, // connection
  payer, // payer
  userTokenAccount.publicKey, // account
  payer, // owner
  [], // multiSigners
);
```

### CPI Guard Protections

#### Transfer

The transfer feature of the CPI Guard prevents anyone but the account delegate
from authorizing a transfer instruction. This is enforced in the various
transfer functions in the `Token Extensions Program`. For example,
[looking at the `transfer` instruction](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L428)
we can see a check that will return an error if the required circumstances are
met.

Using the helper functions we discussed above, the program is able to determine
if it should throw an error or not.

```rust
// inside process_transfer in the token extensions program
if let Ok(cpi_guard) = source_account.get_extension::<CpiGuard>() {
    if cpi_guard.lock_cpi.into() && in_cpi() {
        return Err(TokenError::CpiGuardTransferBlocked.into());
    }
}
```

This guard means that not even the owner of a token account can transfer tokens
out of the account while another account is an authorized delegate.

#### Burn

This CPI Guard also ensures only the account delegate can burn tokens from a
token account, just like the transfer protection.

The `process_burn` function in the `Token Extension Program` functions in the
same way as the transfer instructions. It will
[return an error under the same circumstances](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L1076).

```rust
// inside process_burn in the token extensions program
if let Ok(cpi_guard) = source_account.get_extension::<CpiGuard>() {
    if cpi_guard.lock_cpi.into() && in_cpi() {
        return Err(TokenError::CpiGuardBurnBlocked.into());
    }
}
```

This guard means that not even the owner of a token account can burn tokens out
of the account while another account is an authorized delegate.

#### Approve

The CPI Guard prevents from approving a delegate of a token account via CPI. You
can approve a delegate via a client instruction, but not CPI. The
`process_approve` function of the `Token Extension Program` runs the
[same checks to determine if the guard is enabled and its currently in a CPI](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L583).

This means an end user is not at risk of signing a transaction that indirectly
approves a delegate over their token account without the knowledge of the user.
Before, the user was at the mercy of their wallet to notify them of transactions
like this ahead of time.

#### Close

To close a token account via CPI, having the guard enabled means that the
`Token Extensions Program` will check that the
[destination account receiving the token account's lamports is the account owner](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L1128).

Here is the exact code block from the `process_close_account` function.

```rust
if !source_account
    .base
    .is_owned_by_system_program_or_incinerator()
{
    if let Ok(cpi_guard) = source_account.get_extension::<CpiGuard>() {
        if cpi_guard.lock_cpi.into()
            && in_cpi()
            && !cmp_pubkeys(destination_account_info.key, &source_account.base.owner)
        {
            return Err(TokenError::CpiGuardCloseAccountBlocked.into());
        }
    }
...
}
```

This guard protects the user from signing a transaction that closes a token
account they own and transferring that account's lamports to another account via
CPI. This would be hard to detect from an end user's perspective without
inspecting the instructions themselves. This guard ensures those lamports are
transferred only to their owner when closing a token account via CPI.

#### Set Close Authority

The CPI Guard prevents from setting the `CloseAccount` authority via CPI, you
can unset a previously set `CloseAccount` authority however. The
`Token Extension Program` enforces this by
[checking if a value has been passed in the `new_authority` parameter](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L697)
to the `process_set_authority` function.

```rust
AuthorityType::CloseAccount => {
    let authority = account.base.close_authority.unwrap_or(account.base.owner);
    Self::validate_owner(
        program_id,
        &authority,
        authority_info,
        authority_info_data_len,
        account_info_iter.as_slice(),
    )?;

    if let Ok(cpi_guard) = account.get_extension::<CpiGuard>() {
        if cpi_guard.lock_cpi.into() && in_cpi() && new_authority.is_some() {
            return Err(TokenError::CpiGuardSetAuthorityBlocked.into());
        }
    }

    account.base.close_authority = new_authority;
}
```

This guard prevents the user from signing a transaction that gives another
account the ability to close their Token account behind the scenes.

#### Set Owner

The CPI Guard prevents from changing the account owner in all circumstances,
whether via CPI or not. The account authority is updated in the same
`process_set_authority` function as the `CloseAccount` authority in the previous
section. If the instruction is attempting to update the authority of an account
with the CPI Guard enabled, the
[function will return one of two possible errors](https://github.com/solana-labs/solana-program-library/blob/ce8e4d565edcbd26e75d00d0e34e9d5f9786a646/token/program-2022/src/processor.rs#L662).

If the instruction is being executed in a CPI, the function will return a
`CpiGuardSetAuthorityBlocked` error. Otherwise it will return a
`CpiGuardOwnerChangeBlocked` error.

```rust
if let Ok(cpi_guard) = account.get_extension::<CpiGuard>() {
    if cpi_guard.lock_cpi.into() && in_cpi() {
        return Err(TokenError::CpiGuardSetAuthorityBlocked.into());
    } else if cpi_guard.lock_cpi.into() {
        return Err(TokenError::CpiGuardOwnerChangeBlocked.into());
    }
}
```

This guard prevents from changing the ownership of a Token account at all times
when enabled.

## Lab

This lab will primarily focus on writing tests in TypeScript, but we'll need to
run a program locally against these tests. For this reason, we'll need to go
through a few steps to ensure a proper environment on your machine for the
program to run. The onchain program has already been written for you and is
included in the lab starter code.

The onchain program contains a few instructions that showcase what the CPI Guard
can protect against. We'll write tests invoking these instructions both with a
CPI Guard enabled and disabled.

The tests have been broken up into individual files in the `/tests` directory.
Each file serves as its own unit test that will invoke a specific instruction on
our program and illustrate a specific CPI Guard.

The program has five instructions: `malicious_close_account`,
`prohibited_approve_account`, `prohibited_set_authority`, `unauthorized_burn`,
`set_owner`.

Each of these instructions makes a CPI to the `Token Extensions Program` and
attempts to take an action on the given token account that is potentially
malicious unknowingly to the signer of the original transaction. We won't test
the `Transfer` guard as it is same as the `Burn` guard.

#### 1. Verify Solana/Anchor/Rust Versions

We'll be interacting with the `Token Extensions Program` in this lab and that
requires you to have Solana CLI version ≥ 1.18.0.

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
solana-install init 1.18.0
```

If you run into this error at any point attempting to build the program, that
likely means you do not have the correct version of the Solana CLI installed.

```bash
anchor build
error: package `solana-program v1.18.0` cannot be built because it requires rustc 1.72.0 or newer, while the currently active rustc version is 1.68.0-dev
Either upgrade to rustc 1.72.0 or newer, or use
cargo update -p solana-program@1.18.0 --precise ver
where `ver` is the latest version of `solana-program` supporting rustc 1.68.0-dev
```

You will also want the `0.29.0` version of the Anchor CLI installed. You can
follow the steps listed here to update via avm
https://www.anchor-lang.com/docs/avm

or simply run

```bash
avm install 0.29.0
avm use 0.29.0
```

At the time of writing, the latest version of the Anchor CLI is `0.29.0`

Now, we can check our rust version.

```bash
rustc --version
```

At the time of writing, version `1.26.0` was used for the Rust compiler. If you
would like to update, you can do so via `rustup`
https://doc.rust-lang.org/book/ch01-01-installation.html

```bash
rustup update
```

Now, we should have all the correct versions installed.

#### 2. Get starter code and add dependencies

Let's grab the starter branch.

```bash
git clone https://github.com/Unboxed-Software/solana-lab-cpi-guard
cd solana-lab-cpi-guard
git checkout starter
```

#### 3. Update Program ID and Anchor Keypair

Once in the starter branch, run

`anchor keys sync`

This will replace the program ID in various locations with your new program
keypair.

Then set your developer keypair path in `Anchor.toml`.

```toml
[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"
```

"~/.config/solana/id.json" is the most common keypair path, but if you're
unsure, just run:

```bash
solana config get
```

#### 4. Confirm the program builds

Let's build the starter code to confirm we have everything configured correctly.
If it does not build, please revisit the steps above.

```bash
anchor build
```

You can safely ignore the warnings of the build script, these will go away as we
add in the necessary code.

Feel free to run the provided tests to make sure the rest of the dev environment
is setup correctly. You'll have to install the node dependencies using `npm` or
`yarn`. The tests should run, but they do not do anything currently.

```bash
yarn install
anchor test
```

#### 5. Create token with CPI Guard

Before we write any tests, let's create a helper function that will create a
Token account with the CPI Guard extension. Let's do this in a new file
`tests/token-helper.ts` and a new function called
`createTokenAccountWithCPIGuard`.

Internally, this function will call:

- `SystemProgram.createAccount`: Allocates space for the token account
- `createInitializeAccountInstruction`: Initializes the token account
- `createEnableCpiGuardInstruction`: Enables the CPI Guard

```ts
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createEnableCpiGuardInstruction,
  createInitializeAccountInstruction,
  getAccountLen,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export async function createTokenAccountWithCPIGuard(
  connection: Connection,
  payer: Keypair,
  owner: Keypair,
  tokenAccountKeypair: Keypair,
  mint: PublicKey,
): Promise<string> {
  const tokenAccount = tokenAccountKeypair.publicKey;

  const extensions = [ExtensionType.CpiGuard];

  const tokenAccountLen = getAccountLen(extensions);
  const lamports =
    await connection.getMinimumBalanceForRentExemption(tokenAccountLen);

  const createTokenAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: tokenAccount,
    space: tokenAccountLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  const initializeAccountInstruction = createInitializeAccountInstruction(
    tokenAccount,
    mint,
    owner.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );

  const enableCpiGuardInstruction = createEnableCpiGuardInstruction(
    tokenAccount,
    owner.publicKey,
    [],
    TOKEN_2022_PROGRAM_ID,
  );

  const transaction = new Transaction().add(
    createTokenAccountInstruction,
    initializeAccountInstruction,
    enableCpiGuardInstruction,
  );

  transaction.feePayer = payer.publicKey;

  // Send transaction
  return await sendAndConfirmTransaction(connection, transaction, [
    payer,
    owner,
    tokenAccountKeypair,
  ]);
}
```

#### 5. Approve delegate

The first CPI Guard we'll test is the approve delegate functionality. The CPI
Guard prevents approving a delegate of a token account with the CPI Guard
enabled via CPI completely. It's important to note that you can approve a
delegate on a CPI Guarded account, just not with a CPI. To do so, you must send
an instruction directly to the `Token Extensions Program` from a client rather
than via another program.

Before we write our test, we need to take a look at the program code we are
testing. The `prohibited_approve_account` instruction is what we'll be targeting
here.

```rust
// inside src/lib.rs
pub fn prohibited_approve_account(ctx: Context<ApproveAccount>, amount: u64) -> Result<()> {
    msg!("Invoked ProhibitedApproveAccount");

    msg!(
        "Approving delegate: {} to transfer up to {} tokens.",
        ctx.accounts.delegate.key(),
        amount
    );

    approve(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Approve {
                to: ctx.accounts.token_account.to_account_info(),
                delegate: ctx.accounts.delegate.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )
}
...

#[derive(Accounts)]
pub struct ApproveAccount<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        token::token_program = token_program,
        token::authority = authority
    )]
    pub token_account: InterfaceAccount<'info, token_interface::TokenAccount>,
    /// CHECK: delegate to approve
    #[account(mut)]
    pub delegate: AccountInfo<'info>,
    pub token_program: Interface<'info, token_interface::TokenInterface>,
}
```

If you are familiar with Solana programs, then this should look like a pretty
simple instruction. The instruction expects an `authority` account as a `Signer`
and a `token_account` that `authority` is the authority of.

The instruction then invokes the `Approve` instruction on the
`Token Extensions Program` and attempts to assign `delegate` as the delegate
over the given `token_account`.

Let's open the `/tests/approve-delegate-example.ts` file to begin testing this
instruction. Take a look at the starting code. We have a payer, some test
keypairs and an `airdropIfRequired` function that will run before the tests.

Once you feel comfortable with the starting code, we can move on to the 'Approve
Delegate' tests. We will make tests that invoke the same exact instruction in
our target program, with and without CPI guard.

To test our instruction, we first need to create our token mint and a token
account with extensions.

```typescript
it("stops 'Approve Delegate' when CPI guard is enabled", async () => {
  await createMint(
    provider.connection,
    payer,
    provider.wallet.publicKey,
    undefined,
    6,
    testTokenMint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  await createTokenAccountWithCPIGuard(
    provider.connection,
    payer,
    payer,
    userTokenAccount,
    testTokenMint.publicKey,
  );
});
```

Now let's send a transaction to our program that will attempt to invoke the
'Approve delegate' instruction on the `Token Extensions Program`.

```typescript
// inside "allows 'Approve Delegate' when CPI guard is disabled" test block
try {
  const tx = await program.methods
    .prohibitedApproveAccount(new anchor.BN(1000))
    .accounts({
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      delegate: maliciousAccount.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();

  console.log("Your transaction signature", tx);
} catch (e) {
  assert(
    e.message ==
      "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x2d",
  );
  console.log(
    "CPI Guard is enabled, and a program attempted to approve a delegate",
  );
}
```

Notice we wrap this in a try/catch block. This is because this instruction
should fail if the CPI Guard works correctly. We catch the error and assert that
the error message is what we expect.

Now, we essentially do the same thing for the
`"allows 'Approve Delegate' when CPI guard is disabled"` test, except we want to
pass in a token account without a CPI Guard. To do this, we can simply disable
the CPI Guard on the `userTokenAccount` and resend the transaction.

```typescript
it("allows 'Approve Delegate' when CPI guard is disabled", async () => {
  await disableCpiGuard(
    provider.connection,
    payer,
    userTokenAccount.publicKey,
    payer,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await program.methods
    .prohibitedApproveAccount(new anchor.BN(1000))
    .accounts({
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      delegate: maliciousAccount.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
});
```

This transaction will succeed and the `delegate` account will now have the
authority to transfer the given amount of tokens from the `userTokenAccount`.

Feel free to save your work and run `anchor test`. All of the tests will run,
but these two are the only ones that are doing anything yet. They should both
pass at this point.

#### 6. Close Account

The close account instruction invokes the `close_account` instruction on the
`Token Extensions Program`. This closes the given token account. However, you
have the ability to define which account the returned rent lamports should be
transferred to. The CPI Guard ensures that this account is always the account
owner.

```rust
pub fn malicious_close_account(ctx: Context<MaliciousCloseAccount>) -> Result<()> {
    msg!("Invoked MaliciousCloseAccount");

    msg!(
        "Token account to close : {}",
        ctx.accounts.token_account.key()
    );

    close_account(CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        CloseAccount {
            account: ctx.accounts.token_account.to_account_info(),
            destination: ctx.accounts.destination.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        },
    ))
}

...

#[derive(Accounts)]
pub struct MaliciousCloseAccount<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        token::token_program = token_program,
        token::authority = authority
    )]
    pub token_account: InterfaceAccount<'info, token_interface::TokenAccount>,
    /// CHECK: malicious account
    #[account(mut)]
    pub destination: AccountInfo<'info>,
    pub token_program: Interface<'info, token_interface::TokenInterface>,
    pub system_program: Program<'info, System>,
}
```

Our program just invokes the `close_account` instruction, but a potentially
malicious client could pass in a different account than the token account owner
as the `destination` account. This would be hard to see from a user's
perspective unless the wallet notified them. With CPI Guards enabled, the
`Token Extension Program` will simply reject the instruction if that is the
case.

To test this, we'll open up the `/tests/close-account-example.ts` file. The
starting code here is the same as our previous test.

First, let's create our mint and CPI guarded token account:

```typescript
it("stops 'Close Account' when CPI guard in enabled", async () => {
  await createMint(
    provider.connection,
    payer,
    provider.wallet.publicKey,
    undefined,
    6,
    testTokenMint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  await createTokenAccountWithCPIGuard(
    provider.connection,
    payer,
    payer,
    userTokenAccount,
    testTokenMint.publicKey,
  );
});
```

Now let's send a transaction to our `malicious_close_account` instruction. Since
we have the CPI Guard enabled on this token account, the transaction should
fail. Our test verifies it fails for the expected reason.

```typescript
// inside "stops 'Close Account' when CPI guard in enabled" test block
try {
  const tx = await program.methods
    .maliciousCloseAccount()
    .accounts({
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      destination: maliciousAccount.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();

  console.log("Your transaction signature", tx);
} catch (e) {
  assert(
    e.message ==
      "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x2c",
  );
  console.log(
    "CPI Guard is enabled, and a program attempted to close an account without returning lamports to owner",
  );
}
```

Now, we can disable the CPI Guard and send the same exact transaction in the
`"Close Account without CPI Guard"` test. This transaction should succeed this
time.

```typescript
it("Close Account without CPI Guard", async () => {
  await disableCpiGuard(
    provider.connection,
    payer,
    userTokenAccount.publicKey,
    payer,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await program.methods
    .maliciousCloseAccount()
    .accounts({
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      destination: maliciousAccount.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
});
```

#### 7. Set Authority

Moving on to the `prohibited_set_authority` instruction, the CPI Guard protects
against a CPI setting the `CloseAccount` authority.

```rust
pub fn prohibited_set_authority(ctx: Context<SetAuthorityAccount>) -> Result<()> {
    msg!("Invoked ProhibitedSetAuthority");

    msg!(
        "Setting authority of token account: {} to address: {}",
        ctx.accounts.token_account.key(),
        ctx.accounts.new_authority.key()
    );

    set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: ctx.accounts.authority.to_account_info(),
                account_or_mint: ctx.accounts.token_account.to_account_info(),
            },
        ),
        spl_token_2022::instruction::AuthorityType::CloseAccount,
        Some(ctx.accounts.new_authority.key()),
    )
}

#[derive(Accounts)]
pub struct SetAuthorityAccount<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        token::token_program = token_program,
        token::authority = authority
    )]
    pub token_account: InterfaceAccount<'info, token_interface::TokenAccount>,
    /// CHECK: delegate to approve
    #[account(mut)]
    pub new_authority: AccountInfo<'info>,
    pub token_program: Interface<'info, token_interface::TokenInterface>,
}
```

Our program instruction simply invokes the `SetAuthority` instruction and
indicates we want to set the
`spl_token_2022::instruction::AuthorityType::CloseAccount` authority of the
given token account.

Open the `/tests/set-authority-example.ts` file. The starter code is the same as
the previous tests.

Let's create our mint and CPI-guarded token account. Then, we can send a
transaction to our `prohibited_set_authority` instruction.

```typescript
it("sets authority when CPI guard in enabled", async () => {
  await createMint(
    provider.connection,
    payer,
    provider.wallet.publicKey,
    undefined,
    6,
    testTokenMint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  await createTokenAccountWithCPIGuard(
    provider.connection,
    payer,
    payer,
    userTokenAccount,
    testTokenMint.publicKey,
  );

  try {
    const tx = await program.methods
      .prohibitedSetAuthority()
      .accounts({
        authority: payer.publicKey,
        tokenAccount: userTokenAccount.publicKey,
        newAuthority: maliciousAccount.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    console.log("Your transaction signature", tx);
  } catch (e) {
    assert(
      e.message ==
        "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x2e",
    );
    console.log(
      "CPI Guard is enabled, and a program attempted to add or change an authority",
    );
  }
});
```

For the `"Set Authority Example"` test, we can disable the CPI Guard and re-send
the transaction.

```typescript
it("Set Authority Example", async () => {
  await disableCpiGuard(
    provider.connection,
    payer,
    userTokenAccount.publicKey,
    payer,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await program.methods
    .prohibitedSetAuthority()
    .accounts({
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      newAuthority: maliciousAccount.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
});
```

#### 8. Burn

The next instruction we'll test is the `unauthorized_burn` instruction from our
test program. This instruction invokes the `burn` instruction from the
`Token Extensions Program` and attempts to burn a given amount of tokens from
the given token account.

The CPI Guard ensures that this is only possible if the signing authority is the
token account delegate.

```rust
pub fn unauthorized_burn(ctx: Context<BurnAccounts>, amount: u64) -> Result<()> {
    msg!("Invoked Burn");

    msg!(
        "Burning {} tokens from address: {}",
        amount,
        ctx.accounts.token_account.key()
    );

    burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.token_mint.to_account_info(),
                from: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )
}

...

#[derive(Accounts)]
pub struct BurnAccounts<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        token::token_program = token_program,
        token::authority = authority
    )]
    pub token_account: InterfaceAccount<'info, token_interface::TokenAccount>,
    #[account(
        mut,
        mint::token_program = token_program
    )]
    pub token_mint: InterfaceAccount<'info, token_interface::Mint>,
    pub token_program: Interface<'info, token_interface::TokenInterface>,
}
```

To test this, open up the `tests/burn-example.ts` file. The starter code is the
same as the previous, except we swapped `maliciousAccount` to `delegate`.

Then, we can create our mint and CPI-guarded token account.

```typescript
it("stops 'Burn' without a delegate signature", async () => {
  await createMint(
    provider.connection,
    payer,
    provider.wallet.publicKey,
    undefined,
    6,
    testTokenMint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await createTokenAccountWithCPIGuard(
    provider.connection,
    payer,
    payer,
    userTokenAccount,
    testTokenMint.publicKey,
  );
});
```

Now, let's mint some tokens to our test account.

```typescript
// inside "stops 'Burn' without a delegate signature" test block
const mintToTx = await mintTo(
  provider.connection,
  payer,
  testTokenMint.publicKey,
  userTokenAccount.publicKey,
  payer,
  1000,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

Now let's approve a delegate over our token account. This token account has a
CPI Guard enabled currently, but we are still able to approve a delegate. This
is because we are doing so by invoking the `Token Extensions Program` directly
and not via a CPI like our earlier example.

```typescript
// inside "stops 'Burn' without a delegate signature" test block
const approveTx = await approve(
  provider.connection,
  payer,
  userTokenAccount.publicKey,
  delegate.publicKey,
  payer,
  500,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

Now that we have a delegate over our token account, we can send a transaction to
our program to attempt to burn some tokens. We'll be passing in the `payer`
account as the authority. This account is the owner over the `userTokenAccount`,
but since we have approved the `delegate` account as the delegate, the CPI Guard
will prevent this transaction from going through.

```typescript
// inside "stops 'Burn' without a delegate signature" test block
try {
  const tx = await program.methods
    .unauthorizedBurn(new anchor.BN(500))
    .accounts({
      // payer is not the delegate
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      tokenMint: testTokenMint.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();

  console.log("Your transaction signature", tx);
} catch (e) {
  assert(
    e.message ==
      "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x2b",
  );
  console.log(
    "CPI Guard is enabled, and a program attempted to burn user funds without using a delegate.",
  );
}
```

For the `"Burn without Delegate Signature Example"` test, we'll simply disable
the CPI Guard and re-send the transaction.

```typescript
it("Burn without Delegate Signature Example", async () => {
  await disableCpiGuard(
    provider.connection,
    payer,
    userTokenAccount.publicKey,
    payer,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  const tx = await program.methods
    .unauthorizedBurn(new anchor.BN(500))
    .accounts({
      // payer is not the delegate
      authority: payer.publicKey,
      tokenAccount: userTokenAccount.publicKey,
      tokenMint: testTokenMint.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
});
```

#### 9. Set Owner

The last CPI Guard we'll test is the `SetOwner` protection. With the CPI Guard
enabled, this action is always prohibited even outside of a CPI. To test this,
we'll attempt to set the owner of a token account from the client side, as well
as CPI via our test program.

Here is the program instruction.

```rust
pub fn set_owner(ctx: Context<SetOwnerAccounts>) -> Result<()> {
    msg!("Invoked SetOwner");

    msg!(
        "Setting owner of token account: {} to address: {}",
        ctx.accounts.token_account.key(),
        ctx.accounts.new_owner.key()
    );

    set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: ctx.accounts.authority.to_account_info(),
                account_or_mint: ctx.accounts.token_account.to_account_info(),
            },
        ),
        spl_token_2022::instruction::AuthorityType::AccountOwner,
        Some(ctx.accounts.new_owner.key()),
    )
}

#[derive(Accounts)]
pub struct SetOwnerAccounts<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        token::token_program = token_program,
        token::authority = authority
    )]
    pub token_account: InterfaceAccount<'info, token_interface::TokenAccount>,
    /// CHECK: delegate to approve
    #[account(mut)]
    pub new_owner: AccountInfo<'info>,
    pub token_program: Interface<'info, token_interface::TokenInterface>,
}
```

Open up the `/tests/set-owner-example.ts` file. There are four tests we'll write
for this one. Two for setting the Owner without a CPI and two for setting the
owner via CPI.

Notice we've taken out `delegate` and added `firstNonCPIGuardAccount`,
`secondNonCPIGuardAccount`, and `newOwner`.

Starting with the first
`"stops 'Set Authority' without CPI on a CPI-guarded account"` test, we'll
create the mint and CPI-guarded token account.

```typescript
it("stops 'Set Authority' without CPI on a CPI-guarded account", async () => {
  await createMint(
    provider.connection,
    payer,
    provider.wallet.publicKey,
    undefined,
    6,
    testTokenMint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await createTokenAccountWithCPIGuard(
    provider.connection,
    payer,
    payer,
    userTokenAccount,
    testTokenMint.publicKey,
  );
});
```

Then, we'll try to send a transaction to the `set_authority` instruction of the
`Token Extensions Program` with the `setAuthority` function from the
`@solana/spl-token` library.

```typescript
// inside the "stops 'Set Authority' without CPI on a CPI-guarded account" test block
try {
  await setAuthority(
    provider.connection,
    payer,
    userTokenAccount.publicKey,
    payer,
    AuthorityType.AccountOwner,
    newOwner.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
} catch (e) {
  assert(
    e.message ==
      "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x2f",
  );
  console.log(
    "Account ownership cannot be changed while CPI Guard is enabled.",
  );
}
```

This transaction should fail, so we wrap the call in a try/catch block and
ensure the error is the expected error.

Next, we'll create another token account without the CPI Guard enabled and
attempt the same thing.

```typescript
it("Set Authority without CPI on Non-CPI Guarded Account", async () => {
  await createAccount(
    provider.connection,
    payer,
    testTokenMint.publicKey,
    payer.publicKey,
    firstNonCPIGuardAccount,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await setAuthority(
    provider.connection,
    payer,
    firstNonCPIGuardAccount.publicKey,
    payer,
    AuthorityType.AccountOwner,
    newOwner.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
});
```

This test should succeed.

Now, let's test this out using a CPI. To do that, we just have to send a
transaction to the `set_owner` instruction of our program.

```typescript
it("[CPI Guard] Set Authority via CPI on CPI Guarded Account", async () => {
  try {
    await program.methods
      .setOwner()
      .accounts({
        authority: payer.publicKey,
        tokenAccount: userTokenAccount.publicKey,
        newOwner: newOwner.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();
  } catch (e) {
    assert(
      e.message ==
        "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x2e",
    );
    console.log(
      "CPI Guard is enabled, and a program attempted to add or change an authority.",
    );
  }
});
```

Lastly, we can create another token account without the CPI Guard enabled and
pass this to the program instruction. This time, the CPI should go through.

```typescript
it("Set Authority via CPI on Non-CPI Guarded Account", async () => {
  await createAccount(
    provider.connection,
    payer,
    testTokenMint.publicKey,
    payer.publicKey,
    secondNonCPIGuardAccount,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await program.methods
    .setOwner()
    .accounts({
      authority: payer.publicKey,
      tokenAccount: secondNonCPIGuardAccount.publicKey,
      newOwner: newOwner.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
});
```

And that is it! You should be able to save your work and run `anchor test`. All
of the tests we have written should pass.

## Challenge

Write some tests for the Transfer functionality.
