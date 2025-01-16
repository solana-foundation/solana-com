---
title: Default Account State
objectives:
  - Create mint account with default account state of frozen
  - Explain the use cases of default account state
  - Experiment with the rules of the extension
description:
  "Create token that requires interaction with a specific service to use."
---

## Summary

- The `default state` extension enables developers to set new token accounts for
  a mint with this extension to be frozen by default, requiring interaction with
  a specific service to unfreeze and utilize the tokens.
- There are three states of token accounts: Initialized, Uninitialized, and
  Frozen, which determine how a token account can be interacted with.
- When a token account is frozen, the balance cannot change.
- The `freezeAuthority` is the only address that can freeze and thaw a token
  account
- The `default state` can be updated using `updateDefaultAccountState`
- The lab demonstrates creating a mint with the `default state` extension and
  creating a new token account which is set to a frozen state upon creation. The
  lab includes tests to ensure the extension works as intended for both minting
  and transferring tokens in frozen and thawed states.

## Overview

The `default state` extension allows developers to force all new token accounts
to be in one of two states: "Initialized" or "Frozen". Most usefully, with this
extension any new token accounts created can be set to frozen. When a token
account is frozen, it's balance cannot change. Meaning it cannot be minted to,
transferred from or burned. Only the `freezeAuthority` can thaw a frozen
account.

Imagine you're a Solana game dev, and you only want players of your game to
interact with your in-game token. You can make the player, sign up for the game
to thaw their token account and allow them to play and trade with other players.
This works because of the `default state` extension, where it is set that all
new token accounts are frozen.

#### Types of States

There are 3 types of state with the default account state extension:

- Uninitialized: This state indicates that the token account has been created
  but not yet initialized through the Token Program.
- Initialized: An account in the Initialized state has been properly set up
  through the Token Program. This means it has a specified mint and an owner has
  been assigned.
- Frozen: A Frozen account is one that has been temporarily disabled from
  performing certain operations, specifically transferring and minting tokens.

```ts
/** Token account state as stored by the program */
export enum AccountState {
  Uninitialized = 0,
  Initialized = 1,
  Frozen = 2,
}
```

However, `default state` only deals with the latter two: `Initialized` and
`Frozen`. When you freeze an account, the state is `Frozen`, when you thaw, it
is `Initialized`.

### Adding default account state

Initializing a mint with the default account state extension involves three
instructions:

- `SystemProgram.createAccount`
- `createInitializeDefaultAccountStateInstruction`
- `createInitializeMintInstruction`

The first instruction `SystemProgram.createAccount` allocates space on the
blockchain for the mint account. This instruction accomplishes three things:

- Allocates `space`
- Transfers `lamports` for rent
- Assigns to it's owning program

To grab the size of the mint account, we call `getMintLen`, and to grab the
lamports needed for the space, we call `getMinimumBalanceForRentExemption`.

```typescript
const mintLen = getMintLen([ExtensionType.DefaultAccountState]);
// Minimum lamports required for Mint Account
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mintKeypair.publicKey,
  space: mintLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

The second
instruction `createInitializeDefaultAccountStateInstruction` initializes the
default account state extension.

```typescript
const initializeDefaultAccountStateInstruction =
  createInitializeDefaultAccountStateInstruction(
    mintKeypair.publicKey, // Mint
    defaultState, // Default State
    TOKEN_2022_PROGRAM_ID,
  );
```

The third instruction `createInitializeMintInstruction` initializes the mint.

```typescript
const initializeMintInstruction = createInitializeMintInstruction(
  mintKeypair.publicKey,
  decimals,
  payer.publicKey,
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

Lastly, add all of these instructions to a transaction and send it to the
blockchain.

```ts
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeDefaultAccountStateInstruction,
  initializeMintInstruction,
);

return await sendAndConfirmTransaction(connection, transaction, [
  payer,
  mintKeypair,
]);
```

### Updating the Default Account State

You can always change the default account state assuming you have the authority
to do so. To do this, simply call `updateDefaultAccountState`.

```ts
/**
 * Update the default account state on a mint
 *
 * @param connection     Connection to use
 * @param payer          Payer of the transaction fees
 * @param mint        Mint to modify
 * @param state        New account state to set on created accounts
 * @param freezeAuthority          Freeze authority of the mint
 * @param multiSigners   Signing accounts if `freezeAuthority` is a multisig
 * @param confirmOptions Options for confirming the transaction
 * @param programId      SPL Token program account
 *
 * @return Signature of the confirmed transaction
 */
export async function updateDefaultAccountState(
  connection: Connection,
  payer: Signer,
  mint: PublicKey,
  state: AccountState,
  freezeAuthority: Signer | PublicKey,
  multiSigners: Signer[] = [],
  confirmOptions?: ConfirmOptions,
  programId = TOKEN_2022_PROGRAM_ID,
): Promise<TransactionSignature>;
```

### Updating the Freeze Authority

Lastly, you may want to update the `freezeAuthority` to another account. Say you
want to handle the freezing and thawing by a program for example. You can do
this, by calling `setAuthority`, adding in the correct accounts and passing in
the `authorityType`, which in this case would be `AuthorityType.FreezeAccount`.

```ts
/**
 * Assign a new authority to the account
 *
 * @param connection       Connection to use
 * @param payer            Payer of the transaction fees
 * @param account          Address of the account
 * @param currentAuthority Current authority of the specified type
 * @param authorityType    Type of authority to set
 * @param newAuthority     New authority of the account
 * @param multiSigners     Signing accounts if `currentAuthority` is a multisig
 * @param confirmOptions   Options for confirming the transaction
 * @param programId        SPL Token program account
 *
 * @return Signature of the confirmed transaction
 */

await setAuthority(
  connection,
  payer,
  mint,
  currentAuthority,
  AuthorityType.FreezeAccount,
  newAuthority,
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

## Lab

In this lab we will be creating a mint which all new token accounts are frozen
upon creation by using the `default state` extension. We will then write tests
to check if the extension is working as intended by attempting to mint and
transfer the tokens in a frozen and thawed account state.

#### 1. Setup Environment

To get started, create an empty directory named `default-account-state` and
navigate to it. We'll be initializing a brand new project. Run `npm init` and
follow through the prompts.

Next, we'll need to add our dependencies. Run the following to install the
required packages:

```bash
npm i @solana-developers/helpers@2 @solana/spl-token @solana/web3.js@1 esrun dotenv typescript
```

Create a directory named `src`. In this directory, create a file named
`index.ts`. This is where we will run checks against the rules of this
extension. Paste the following code in `index.ts`:

```ts
import {
  AccountState,
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  mintTo,
  thawAccount,
  transfer,
  createAccount,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
// import { createTokenExtensionMintWithDefaultState } from "./mint-helper"; // This will be uncommented later
import { initializeKeypair, makeKeypairs } from "@solana-developers/helpers";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);

const [mintKeypair, ourTokenAccountKeypair, otherTokenAccountKeypair] =
  makeKeypairs(3);
const mint = mintKeypair.publicKey;
const decimals = 2;
const defaultState = AccountState.Frozen;

const ourTokenAccount = ourTokenAccountKeypair.publicKey;

// To satisfy the transferring tests
const otherTokenAccount = otherTokenAccountKeypair.publicKey;

const amountToMint = 1000;
const amountToTransfer = 50;

// CREATE MINT WITH DEFAULT STATE

// CREATE TEST TOKEN ACCOUNTS

// TEST: MINT WITHOUT THAWING

// TEST: MINT WITH THAWING

// TEST: TRANSFER WITHOUT THAWING

// TEST: TRANSFER WITH THAWING
```

`index.ts` creates a connection to the specified validator node and calls
`initializeKeypair`. It also has a few variables we will be using in the rest of
this lab. The `index.ts` is where we'll end up calling the rest of our script
once we've written it.

If you run into an error in `initializeKeypair` with airdropping, follow the
next step.

#### 2. Run validator node

For the sake of this guide, we'll be running our own validator node.

In a separate terminal, run the following command: `solana-test-validator`. This
will run the node and also log out some keys and values. The value we need to
retrieve and use in our connection is the JSON RPC URL, which in this case is
`http://127.0.0.1:8899`. We then use that in the connection to specify to use
the local RPC URL.

```typescript
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
```

Alternatively, if you'd like to use testnet or devnet, import the
`clusterApiUrl` from `@solana/web3.js` and pass it to the connection as such:

```typescript
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
```

If you decide to use devnet, and have issues with airdropping sol. Feel free to
add the `keypairPath` parameter to `initializeKeypair`. You can get this from
running `solana config get` in your terminal. And then go to
[faucet.solana.com](https://faucet.solana.com/) and airdrop some sol to your
address. You can get your address from running `solana address` in your
terminal.

#### 3. Helpers

When we pasted the `index.ts` code from earlier, we added the following helpers:

- `initializeKeypair`: This function creates the keypair for the `payer` and
  also airdrops some SOL to it
- `makeKeypairs`: This function creates keypairs without airdropping any SOL

Additionally we have some initial accounts:

- `payer`: Used to pay for and be the authority for everything
- `mintKeypair`: Our mint that will have the `default state` extension
- `ourTokenAccountKeypair`: The token account owned by payer that we'll use for
  testing
- `otherTokenAccountKeypair`: Another token used for testing

#### 4. Create Mint with Default account state

When creating a mint token with default state, we must create the account
instruction, initialize the default account state for the mint account and
initialize the mint itself.

Create an asynchronous function named `createTokenExtensionMintWithDefaultState`
in `src/mint-helpers.ts`. This function will create the mint such that all new
token accounts will be “frozen” to start. The function will take the following
arguments:

- `connection` : The connection object
- `payer` : Payer for the transaction
- `mintKeypair` : Keypair for the new mint
- `decimals` : Mint decimals
- `defaultState` : Mint token default state - eg: `AccountState.Frozen`

The first step in creating a mint is reserving space on Solana with the
`SystemProgram.createAccount` method. This requires specifying the payer's
keypair, (the account that will fund the creation and provide SOL for rent
exemption), the new mint account's public key (`mintKeypair.publicKey`), the
space required to store the mint information on the blockchain, the amount of
SOL (lamports) necessary to exempt the account from rent and the ID of the token
program that will manage this mint account (`TOKEN_2022_PROGRAM_ID`).

```typescript
const mintLen = getMintLen([ExtensionType.DefaultAccountState]);
// Minimum lamports required for Mint Account
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mintKeypair.publicKey,
  space: mintLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

After the mint account creation, the next step involves initializing it with the
default state. The `createInitializeDefaultAccountStateInstruction` function is
used to generate an instruction that enables the mint to set `defaultState` of
any new token accounts.

```typescript
const initializeDefaultAccountStateInstruction =
  createInitializeDefaultAccountStateInstruction(
    mintKeypair.publicKey,
    defaultState,
    TOKEN_2022_PROGRAM_ID,
  );
```

Next, lets add the mint instruction by calling `createInitializeMintInstruction`
and passing in the required arguments. This function is provided by the SPL
Token package and it constructs a transaction instruction that initializes a new
mint.

```typescript
const initializeMintInstruction = createInitializeMintInstruction(
  mintKeypair.publicKey,
  decimals,
  payer.publicKey, // Designated Mint Authority
  payer.publicKey, //  Designated Freeze Authority
  TOKEN_2022_PROGRAM_ID,
);
```

Lastly, let's add all of the instructions to a transaction and send it to the
blockchain:

```typescript
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeDefaultAccountStateInstruction,
  initializeMintInstruction,
);

return await sendAndConfirmTransaction(connection, transaction, [
  payer,
  mintKeypair,
]);
```

Putting it all together, the final `src/mint-helpers.ts` file will look like
this:

```ts
import {
  AccountState,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeDefaultAccountStateInstruction,
  createInitializeMintInstruction,
  getMintLen,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

/**
 * Creates the token mint with the default state
 * @param connection
 * @param payer
 * @param mintKeypair
 * @param decimals
 * @param defaultState
 * @returns signature of the transaction
 */
export async function createTokenExtensionMintWithDefaultState(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number = 2,
  defaultState: AccountState,
): Promise<string> {
  const mintLen = getMintLen([ExtensionType.DefaultAccountState]);
  // Minimum lamports required for Mint Account
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mintKeypair.publicKey,
    space: mintLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  const initializeDefaultAccountStateInstruction =
    createInitializeDefaultAccountStateInstruction(
      mintKeypair.publicKey,
      defaultState,
      TOKEN_2022_PROGRAM_ID,
    );

  const initializeMintInstruction = createInitializeMintInstruction(
    mintKeypair.publicKey,
    decimals,
    payer.publicKey, // Designated Mint Authority
    payer.publicKey, //  Designated Freeze Authority
    TOKEN_2022_PROGRAM_ID,
  );

  const transaction = new Transaction().add(
    createAccountInstruction,
    initializeDefaultAccountStateInstruction,
    initializeMintInstruction,
  );

  return await sendAndConfirmTransaction(connection, transaction, [
    payer,
    mintKeypair,
  ]);
}
```

#### 6. Test Setup

Now that we have the ability to create a mint with a default state for all of
it's new token accounts, let's write some tests to see how it functions.

#### 6.1 Create Mint with Default State

Let's first create a mint with the default state of `frozen`. To do this we call
the `createTokenExtensionMintWithDefaultState` function we just created in out
`index.ts` file:

```ts
// CREATE MINT WITH DEFAULT STATE
await createTokenExtensionMintWithDefaultState(
  connection,
  payer,
  mintKeypair,
  decimals,
  defaultState,
);
```

#### 6.2 Create Test Token Accounts

Now, let's create two new Token accounts to test with. We can accomplish this by
calling the `createAccount` helper provided by the SPL Token library. We will
use the keypairs we generated at the beginning: `ourTokenAccountKeypair` and
`otherTokenAccountKeypair`.

```typescript
// CREATE TEST TOKEN ACCOUNTS
// Transferring from account
await createAccount(
  connection,
  payer,
  mint,
  payer.publicKey,
  ourTokenAccountKeypair,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
// Transferring to account
await createAccount(
  connection,
  payer,
  mint,
  payer.publicKey,
  otherTokenAccountKeypair,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

#### 7 Tests

Now let's write some tests to show the interactions that can be had with the
`default state` extension.

We'll write four tests in total:

- Minting without thawing the recipient's account
- Minting with thawing the recipient's account
- Transferring without thawing the recipient's account
- Transferring with thawing the recipient's account

#### 7.1 Minting without thawing the recipient's account

This test will attempt to mint a token to `ourTokenAccount` without thawing the
account. This test is expected to fail as the account will be frozen on the mint
attempt. Remember: when a token account is frozen, the balance cannot change.

To do this, let's wrap a `mintTo` function in a `try catch` and print out the
respected result:

```typescript
// TEST: MINT WITHOUT THAWING
try {
  // Attempt to mint without thawing
  await mintTo(
    connection,
    payer,
    mint,
    ourTokenAccount,
    payer.publicKey,
    amountToMint,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  console.error("Should not have minted...");
} catch (error) {
  console.log(
    "✅ - We expected this to fail because the account is still frozen.",
  );
}
```

Test this by running the script:

```bash
esrun src/index.ts
```

We should see the following error logged out in the terminal, meaning the
extension is working as intended.
`✅ - We expected this to fail because the account is still frozen.`

#### 7.2 Minting with thawing the recipient's account

This test will attempt to mint a token after thawing the token account. This
test is expected to pass as the account will be thawed on the mint attempt.

We can create this test by calling `thawAccount` and then `mintTo`:

```typescript
// TEST: MINT WITH THAWING
// Unfreeze frozen token
await thawAccount(
  connection,
  payer,
  ourTokenAccount,
  mint,
  payer.publicKey,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
// Mint tokens to tokenAccount
await mintTo(
  connection,
  payer,
  mint,
  ourTokenAccount,
  payer.publicKey,
  amountToMint,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const ourTokenAccountWithTokens = await getAccount(
  connection,
  ourTokenAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

console.log(
  `✅ - The new account balance is ${Number(ourTokenAccountWithTokens.amount)} after thawing and minting.`,
);
```

Go ahead and run the script, the transaction should succeed.

```bash
esrun src/index.ts
```

#### 7.3 Transferring without thawing the recipient's account

Now that we've tested minting, we can test transferring our tokens frozen and
not. First lets test a transfer without thawing the recipient's token account.
Remember, by default, the `otherTokenAccountKeypair` is frozen due to the
extension.

Again, we expect this test to fail, since the `otherTokenAccountKeypair` is
frozen and it's balance cannot change.

To test this, let's wrap a `transfer` function in a `try catch`:

```typescript
// TEST: TRANSFER WITHOUT THAWING
try {
  await transfer(
    connection,
    payer,
    ourTokenAccount,
    otherTokenAccount,
    payer,
    amountToTransfer,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  console.error("Should not have minted...");
} catch (error) {
  console.log(
    "✅ - We expected this to fail because the account is still frozen.",
  );
}
```

Run the test and see the results:

```bash
esrun src/index.ts
```

#### 7.4 Transferring with thawing the recipient's account

The last test we'll create tests transferring tokens after thawing the token
account we will be transferring to. This test is expected to pass, since all
token accounts will now be thawed.

We'll do this by calling `thawAccount` and then `transfer`:

```typescript
// TEST: TRANSFER WITH THAWING
// Unfreeze frozen token
await thawAccount(
  connection,
  payer,
  otherTokenAccount,
  mint,
  payer.publicKey,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

await transfer(
  connection,
  payer,
  ourTokenAccount,
  otherTokenAccount,
  payer,
  amountToTransfer,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const otherTokenAccountWithTokens = await getAccount(
  connection,
  otherTokenAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

console.log(
  `✅ - The new account balance is ${Number(
    otherTokenAccountWithTokens.amount,
  )} after thawing and transferring.`,
);
```

Run all of the tests one last time and see the results:

```bash
esrun src/index.ts
```

Remember the key takeaways:

- The `default state` extension, enforces the default state on _all_ new token
  accounts.
- Frozen account's balance cannot change.

Congratulations! We've just created and tested a mint using the default account
extension!

## Challenge

Add tests for burning tokens from frozen and thawed token accounts (hint, one
will fail, one will succeed).

To get you started:

```ts
// TEST: Burn tokens in frozen account
await freezeAccount(
  connection,
  payer,
  ourTokenAccount,
  mint,
  payer.publicKey,
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

await burn(
  connection,
  payer,
  ourTokenAccount,
  mint,
  payer.publicKey,
  1,
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```
