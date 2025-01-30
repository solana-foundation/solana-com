---
title: Required Memo
objectives:
  - Create a token account with required memo on transfer
  - Transfer with memo
  - Transfer without memo
  - Disable required memo
description: "Create a token that requires a short note on every transfer."
---

## Summary

- The `required memo` extension allows developers to mandate that all incoming
  transfers to a token account include a memo, facilitating enhanced transaction
  tracking and user identification.
- When a transfer is initiated without a memo, the transaction will fail.
- The `required memo` extension can be disabled by calling
  `disableRequiredMemoTransfers`.

## Overview

For certain applications, such as exchanges or financial services, tracking the
purpose or origin of a transaction is crucial. The `required memo` extension
specifies that a memo is necessary for every incoming transfer to a token
account. This requirement ensures that each transaction is accompanied by
additional information, which can be used for compliance, auditing, or
user-specific purposes. If the need for strict tracking diminishes, the
requirement can be adjusted to make memos optional, offering flexibility in how
transactions are handled and recorded.

It is important to note that this is a token account extension, not a mint
extension. This means individual token accounts need to enable this feature. And
like all extensions, this will only work with Token Extensions Program tokens.

### Creating token with required memo

Initializing a token account with required memo involves three instructions:

- `SystemProgram.createAccount`
- `initializeAccountInstruction`
- `createEnableRequiredMemoTransfersInstruction`

The first instruction `SystemProgram.createAccount` allocates space on the
blockchain for the token account. This instruction accomplishes three things:

- Allocates `space`
- Transfers `lamports` for rent
- Assigns to it's owning program

```tsx
const accountLen = getAccountLen([ExtensionType.MemoTransfer]);
const lamports = await connection.getMinimumBalanceForRentExemption(accountLen);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: tokenAccountKeypair.publicKey,
  space: accountLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

The second instruction `createInitializeAccountInstruction` initializes the
account instruction.

```tsx
const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccountKeypair.publicKey,
  mint,
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

The third instruction `createEnableRequiredMemoTransfersInstruction` initializes
the token account with required memo.

```tsx
const enableRequiredMemoTransfersInstruction =
  createEnableRequiredMemoTransfersInstruction(
    tokenAccountKeypair.publicKey,
    payer.publicKey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
```

When the transaction with these three instructions is sent, a new token account
is created with the required memo extension.

```tsx
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeAccountInstruction,
  enableRequiredMemoTransfersInstruction,
);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, tokenAccountKeypair], // Signers
);
```

### Transferring with required memo

When transferring to a token account with the `required memo` instruction
enabled, you need to send a memo first within the same transaction. We do this
by creating a memo instruction to call the Memo program. Then, we add in our
transfer instruction.

```ts
const message = "Hello, Solana";

const transaction = new Transaction().add(
  new TransactionInstruction({
    keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
    data: Buffer.from(message, "utf-8"), // Memo message. In this case it is "Hello, Solana"
    programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"), // Memo program that validates keys and memo message
  }),
  createTransferInstruction(
    ourTokenAccount,
    otherTokenAccount, // Has required memo
    payer.publicKey,
    amountToTransfer,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  ),
);
await sendAndConfirmTransaction(connection, transaction, [payer]);
```

### Disabling required memo

The required memo extension can be disabled given you have the authority to
modify the token account. To do this, simply call the
`disableRequiredMemoTransfers` function and pass in the required arguments.

```tsx
/**
 * Disable memo transfers on the given account
 *
 * @param connection     Connection to use
 * @param payer          Payer of the transaction fees
 * @param account        Account to modify
 * @param owner          Owner of the account
 * @param multiSigners   Signing accounts if `owner` is a multisig
 * @param confirmOptions Options for confirming the transaction
 * @param programId      SPL Token program account
 *
 * @return Signature of the confirmed transaction
 */
await disableRequiredMemoTransfers(
  connection,
  payer,
  otherTokenAccount,
  payer,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

## Lab

In this lab, we'll create a token account with the required memo extension.
We'll then write tests to check if the extension is working as intended by
attempting to transfer funds with and without a memo.

#### 1. Setup Environment

To get started, create an empty directory named `required-memo` and navigate to
it. We'll be initializing a brand new project. Run `npm init` and follow through
the prompts.

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
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  mintTo,
  createTransferInstruction,
  createMint,
  disableRequiredMemoTransfers,
  enableRequiredMemoTransfers,
} from "@solana/spl-token";
import {
  sendAndConfirmTransaction,
  Connection,
  Transaction,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
// import { createTokenWithMemoExtension } from "./token-helper"; // We'll uncomment this later
import { initializeKeypair, makeKeypairs } from "@solana-developers/helpers";

require("dotenv").config();

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);
const mintDecimals = 9;

const [ourTokenAccountKeypair, otherTokenAccountKeypair] = makeKeypairs(2);
const ourTokenAccount = ourTokenAccountKeypair.publicKey;
const otherTokenAccount = otherTokenAccountKeypair.publicKey;

const amountToMint = 1000;
const amountToTransfer = 300;

// CREATE MINT

// CREATE TOKENS

// MINT TOKENS

// ATTEMPT TO TRANSFER WITHOUT MEMO

// ATTEMPT TO TRANSFER WITH MEMO

// DISABLE MEMO EXTENSION AND TRANSFER
```

#### 2. Run validator node

For the sake of this guide, we'll be running our own validator node.

In a separate terminal, run the following command: `solana-test-validator`. This
will run the node and also log out some keys and values. The value we need to
retrieve and use in our connection is the JSON RPC URL, which in this case is
`http://127.0.0.1:8899`. We then use that in the connection to specify to use
the local RPC URL.

`const connection = new Connection("http://127.0.0.1:8899", "confirmed");`

Alternatively, if you'd like to use testnet or devnet, import the
`clusterApiUrl` from `@solana/web3.js` and pass it to the connection as such:

```typescript
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
```

#### 3. Helpers

When we pasted the `index.ts` code from earlier, we added the following helpers
provided by the `@solana-developers/helpers` package and some starting
variables.

- `initializeKeypair`: This function creates the keypair for the `payer` and
  also airdrops 1 testnet SOL to it
- `makeKeypairs`: This function creates keypairs without airdropping any SOL

#### 4. Create the mint

First things first, since the `required memo` extension is a token extension, we
don't need to do anything fancy with the mint. It just needs to be a Token
Extensions Program mint. That being said, we can just create one using the
`createMint` function.

Let's do this in `src/index.ts`:

```tsx
// CREATE MINT
const mint = await createMint(
  connection,
  payer,
  payer.publicKey,
  null,
  mintDecimals,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

#### 5. Create Token Account with required memo

Let's create a new file `src/token-helper.ts` and create a new function within
it called `createTokenWithMemoExtension`. As the name implies, we'll use this to
create our token accounts with the `required memo` extension enabled. The
function will take the following arguments:

- `connection`: The connection object
- `mint`: Public key for the new mint
- `payer`: Payer for the transaction
- `tokenAccountKeypair`: The token account keypair associated with the token
  account

```ts
import {
  TOKEN_2022_PROGRAM_ID,
  getAccountLen,
  ExtensionType,
  createInitializeAccountInstruction,
  createEnableRequiredMemoTransfersInstruction,
} from "@solana/spl-token";
import {
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  Transaction,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";

export async function createTokenWithMemoExtension(
  connection: Connection,
  payer: Keypair,
  tokenAccountKeypair: Keypair,
  mint: PublicKey,
): Promise<string> {
  // CREATE ACCOUNT INSTRUCTION

  // CREATE INITIALIZE ACCOUNT INSTRUCTION

  // CREATE ENABLE REQUIRED MEMO TRANSFER INSTRUCTION

  // SEND AND CONFIRM TRANSACTION

  return await "TODO FINISH FUNCTION";
}
```

Let's start adding our code.

The first step in creating the token account is reserving space on Solana with
the `SystemProgram.createAccount` method:

```tsx
// CREATE ACCOUNT INSTRUCTION
const accountLen = getAccountLen([ExtensionType.MemoTransfer]);
const lamports = await connection.getMinimumBalanceForRentExemption(accountLen);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: tokenAccountKeypair.publicKey,
  space: accountLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

Now we need to initialize the token account. To create this instruction we call
`createInitializeAccountInstruction` and pass in the required arguments. This
function is provided by the SPL Token package and it constructs a transaction
instruction that initializes a new token account.

```tsx
// CREATE INITIALIZE ACCOUNT INSTRUCTION
const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccountKeypair.publicKey,
  mint,
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

The last instruction we need is the one that enables the required memo. We get
this by calling the `createEnableRequiredMemoTransfersInstruction` function.
When the required memos are enabled, any transfer of tokens into the account
must include a memo.

```tsx
// CREATE ENABLE REQUIRED MEMO TRANSFERS INSTRUCTION
const enableRequiredMemoTransfersInstruction =
  createEnableRequiredMemoTransfersInstruction(
    tokenAccountKeypair.publicKey,
    payer.publicKey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
```

Lastly, let's add all of the instructions to a transaction, send it to the
blockchain and return the signature

```tsx
// SEND AND CONFIRM TRANSACTION
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeAccountInstruction,
  enableRequiredMemoTransfersInstruction,
);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, tokenAccountKeypair], // Signers
);

return transactionSignature;
```

Let's go back to `index.ts` and create two new token accounts:
`ourTokenAccountKeypair` and `otherTokenAccountKeypair` using our newly created
function.

```typescript
// CREATE TOKENS
await createTokenWithMemoExtension(
  connection,
  payer,
  ourTokenAccountKeypair,
  mint,
);

await createTokenWithMemoExtension(
  connection,
  payer,
  otherTokenAccountKeypair,
  mint,
);
```

Lastly, let's call `mintTo` to mint some initial tokens to
`ourTokenAccountKeypair`:

```ts
// MINT TOKENS
await mintTo(
  connection,
  payer,
  mint,
  ourTokenAccount,
  payer,
  amountToMint,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

Note: The `required memo` extension only requires a memo on transferring, not
minting.

#### 6. Tests

Now that we've created some accounts with the `required memo` instruction. Let's
write some tests to see how they function.

We'll write 3 tests in total:

- Transferring without a memo
- Transferring with a memo
- Disabling Required Memo extension and transferring without a memo

#### 6.1 Transfer without Memo

This first test will attempt to transfer tokens from `ourTokenAccount` to
`otherTokenAccount`. This test is expected to fail as there is no memo attached
to the transaction.

```tsx
// ATTEMPT TO TRANSFER WITHOUT MEMO
try {
  const transaction = new Transaction().add(
    createTransferInstruction(
      ourTokenAccount,
      otherTokenAccount,
      payer.publicKey,
      amountToTransfer,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    ),
  );

  await sendAndConfirmTransaction(connection, transaction, [payer]);

  console.error("You should not be able to transfer without a memo.");
} catch (error) {
  console.log(
    `✅ - We expected this to fail because you need to send a memo with the transfer.`,
  );
}
```

Run this test, you should see the following error logged out in the terminal,
meaning the extension is working as intended:
`✅ - We expected this to fail because you need to send a memo with the transfer.`

```bash
npx esrun src/index.ts
```

#### 6.2 Test transfer with memo

This test will attempt to transfer tokens with a memo. This test is expected to
pass. Pay extra attention to the first instruction - It is the part of the
transaction that adds the memo instruction to it:

```tsx
// ATTEMPT TO TRANSFER WITH MEMO
const message = "Hello, Solana";

const transaction = new Transaction().add(
  new TransactionInstruction({
    keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
    data: Buffer.from(message, "utf-8"), // Memo message. In this case it is "Hello, Solana"
    programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"), // Memo program that validates keys and memo message
  }),

  createTransferInstruction(
    ourTokenAccount,
    otherTokenAccount,
    payer.publicKey,
    amountToTransfer,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  ),
);
await sendAndConfirmTransaction(connection, transaction, [payer]);

const accountAfterMemoTransfer = await getAccount(
  connection,
  otherTokenAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

console.log(
  `✅ - We have transferred ${accountAfterMemoTransfer.amount} tokens to ${otherTokenAccount} with the memo: ${message}`,
);
```

Run the test and see that it passes:

```bash
npx esrun src/index.ts
```

#### 6.3 Test transfer with disabled memo

In our last test, we'll disable the `required memo` extension on the
`otherTokenAccount` and send it some tokens without a memo. We expect this to
pass.

```tsx
// DISABLE MEMO EXTENSION AND TRANSFER
await disableRequiredMemoTransfers(
  connection,
  payer,
  otherTokenAccount,
  payer,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

// Transfer tokens to otherTokenAccount
const transfer = new Transaction().add(
  createTransferInstruction(
    ourTokenAccount,
    otherTokenAccount,
    payer.publicKey,
    amountToTransfer,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  ),
);

await sendAndConfirmTransaction(connection, transfer, [payer]);

const accountAfterDisable = await getAccount(
  connection,
  otherTokenAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

// Re-enable memo transfers to show it exists
await enableRequiredMemoTransfers(
  connection,
  payer,
  otherTokenAccount,
  payer,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

console.log(
  `✅ - We have transferred ${accountAfterDisable.amount} tokens to ${otherTokenAccount} without a memo.`,
);
```

Run the tests. You will notice that `otherTokenAccount` now has 600 tokens,
meaning it has successfully transferred without a memo after disabling the
extension.

```bash
npx esrun src/index.ts
```

Congratulations! We've just tested the required memo extension!

## Challenge

Go create your own token account with required memo.
