---
date: 2023-12-07T00:00:00Z
seoTitle: "Token Extensions: Required Memo"
title: How to use the Required Memo token extension
description:
  "Memos in financial transactions serve as a communication tool between sender
  and recipient. It aids in the identification of both parties and offers
  clarity on the purpose of the transfer."
keywords:
  - token 2022
  - token extensions
  - token program
difficulty: beginner
tags:
  - token 2022
  - token extensions
---

The `MemoTransfer` extension enforces that every incoming transfer to a Token
Account is accompanied by a [memo](https://spl.solana.com/memo) instruction.
This memo instruction records a message in the transaction's program logs. This
feature is particularly useful for adding context to transactions, making it
easier to understand their purpose when reviewing the transaction logs later.

In this guide, we'll walk through an example of using Solana Playground. Here is
the [final script](https://beta.solpg.io/65724a91fb53fa325bfd0c54).

## Getting Started

Start by opening this Solana Playground
[link](https://beta.solpg.io/656e19acfb53fa325bfd0c46) with the following
starter code.

```javascript
// Client
console.log("My address:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
```

If it is your first time using Solana Playground, you'll first need to create a
Playground Wallet and fund the wallet with devnet SOL.

<Callout type="info">

If you do not have a Playground wallet, you may see a type error within the
editor on all declarations of `pg.wallet.publicKey`. This type error will clear
after you create a Playground wallet.

</Callout>

To get devnet SOL, run the `solana airdrop` command in the Playground's
terminal, or visit this [devnet faucet](https://faucet.solana.com/).

```
solana airdrop 5
```

Once you've created and funded the Playground wallet, click the "Run" button to
run the starter code.

## Add Dependencies

Let's start by setting up our script. We'll be using the `@solana/web3.js`,
`@solana/spl-token`, and `@solana/spl-memo` libraries.

Replace the starter code with the following:

```javascript
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
  TransactionInstruction,
  PublicKey,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createEnableRequiredMemoTransfersInstruction,
  createInitializeAccountInstruction,
  createMint,
  disableRequiredMemoTransfers,
  enableRequiredMemoTransfers,
  getAccountLen,
  createAccount,
  mintTo,
  createTransferInstruction,
} from "@solana/spl-token";
import { createMemoInstruction } from "@solana/spl-memo";

// Playground wallet
const payer = pg.wallet.keypair;

// Connection to devnet cluster
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Transaction to send
let transaction: Transaction;
// Transaction signature returned from sent transaction
let transactionSignature: string;
```

## Mint Setup

We'll first need to create a new Mint Account before we can create Token
Accounts.

```javascript
// Authority that can mint new tokens
const mintAuthority = pg.wallet.publicKey;
// Decimals for Mint Account
const decimals = 2;

// Create Mint Account
const mint = await createMint(
  connection,
  payer, // Payer of the transaction and initialization fees
  mintAuthority, // Mint Authority
  null, // Optional Freeze Authority
  decimals, // Decimals of Mint
  undefined, // Optional keypair
  undefined, // Options for confirming the transaction
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);
```

## Memo Transfer Token Account

Next, let's build a transaction to enable the `MemoTransfer` extension for a new
Token Account.

First, let's generate a new keypair to use as the address of the Token Account.

```javascript
// Random keypair to use as owner of Token Account
const tokenAccountKeypair = Keypair.generate();
// Address for Token Account
const tokenAccount = tokenAccountKeypair.publicKey;
```

Next, let's determine the size of the new Token Account and calculate the
minimum lamports needed for rent exemption.

```javascript
// Size of Token Account with extension
const accountLen = getAccountLen([ExtensionType.MemoTransfer]);
// Minimum lamports required for Token Account
const lamports = await connection.getMinimumBalanceForRentExemption(accountLen);
```

With Token Extensions, the size of the Token Account will vary based on the
extensions enabled.

## Build Instructions

Next, let's build the set of instructions to:

- Create a new account
- Initialize the Token Account data
- Enable the `MemoTransfer` extension

First, build the instruction to invoke the System Program to create an account
and assign ownership to the Token Extensions Program.

```javascript
// Instruction to invoke System Program to create new account
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Account that will transfer lamports to created account
  newAccountPubkey: tokenAccount, // Address of the account to create
  space: accountLen, // Amount of bytes to allocate to the created account
  lamports, // Amount of lamports transferred to created account
  programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
});
```

Next, build the instruction to initialize the Token Account data.

```javascript
// Instruction to initialize Token Account data
const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccount, // Token Account Address
  mint, // Mint Account
  payer.publicKey, // Token Account Owner
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);
```

Lastly, build the instruction to enable the `MemoTransfer` extension for the
Token Account.

```javascript
// Instruction to initialize the MemoTransfer Extension
const enableRequiredMemoTransfersInstruction =
  createEnableRequiredMemoTransfersInstruction(
    tokenAccount, // Token Account address
    payer.publicKey, // Token Account Owner
    undefined, // Additional signers
    TOKEN_2022_PROGRAM_ID, // Token Program ID
  );
```

## Send Transaction

Next, let's add the instructions to a new transaction and send it to the
network. This will create a Token Account with the `MemoTransfer` extension
enabled.

```javascript
// Add instructions to new transaction
transaction = new Transaction().add(
  createAccountInstruction,
  initializeAccountInstruction,
  enableRequiredMemoTransfersInstruction,
);

// Send transaction
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, tokenAccountKeypair], // Signers
);

console.log(
  "\nCreate Token Account:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Run the script by clicking the `Run` button. You can then inspect the
transaction details on SolanaFM.

## Create and Fund Token Account

Next, let's set up another Token Account to demonstrate the functionality of the
`MemoTransfer` extension.

First, create a `sourceTokenAccount` owned by the Playground wallet.

```javascript
// Create Token Account for Playground wallet
const sourceTokenAccount = await createAccount(
  connection,
  payer, // Payer to create Token Account
  mint, // Mint Account address
  payer.publicKey, // Token Account owner
  undefined, // Optional keypair, default to Associated Token Account
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);
```

Next, mint 2 tokens to the `sourceTokenAccount` to fund it.

```javascript
// Mint tokens to sourceTokenAccount
transactionSignature = await mintTo(
  connection,
  payer, // Transaction fee payer
  mint, // Mint Account address
  sourceTokenAccount, // Mint to
  mintAuthority, // Mint Authority address
  200, // Amount
  undefined, // Additional signers
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nMint Tokens:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Transfer and Memo Instruction

Next, let's prepare the token transfer and memo instructions.

First, build the instruction to transfer tokens from the `sourceTokenAccount` to
the `tokenAccount` which has the `MemoTransfer` extension enabled.

```javascript
// Instruction to transfer tokens
const transferInstruction = createTransferInstruction(
  sourceTokenAccount, // Source Token Account
  tokenAccount, // Destination Token Account
  payer.publicKey, // Source Token Account owner
  100, // Amount
  undefined, // Additional signers
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);
```

Next, build the memo instruction. The message will be included in the program
logs of the transaction the instruction is added to.

```javascript
// Message for the memo
const message = "Hello, Solana";
// Instruction to add memo
const memoInstruction = new TransactionInstruction({
  keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
  data: Buffer.from(message, "utf-8"),
  programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
});
```

Alternatively, you can create the instruction using the `@solana/spl-memo`
library:

```javascript
// Message for the memo
const message = "Hello, Solana";
// Instruction to add memo
const memoInstruction = createMemoInstruction(message, [payer.publicKey]);
```

## Attempt Transfer without Memo

To demonstrate the functionality of the `MemoTransfer` extension, let's first
attempt to send a token transfer without a memo.

```javascript
try {
  // Attempt to transfer without memo
  transaction = new Transaction().add(transferInstruction);

  // Send transaction
  await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer], // Signers
  );
} catch (error) {
  console.log("\nExpect Error:", error);
}
```

Run the script by clicking the `Run` button. You can then inspect the error in
the Playground terminal. You should see a message similar to the following:

```
Expect Error: { [Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x24]
  logs:
   [ 'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb invoke [1]',
     'Program log: Instruction: Transfer',
     'Program log: Error: No memo in previous instruction; required for recipient to receive a transfer',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb consumed 6571 of 200000 compute units',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0x24' ] }
```

## Transfer with Memo

Next, send a token transfer with the memo instruction included on the
transaction.

```javascript
// Add instructions to new transaction
transaction = new Transaction().add(memoInstruction, transferInstruction);

// Send transaction
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer], // Signers
);

console.log(
  "\nTransfer with Memo:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Run the script by clicking the `Run` button. You can then inspect the
transaction details on SolanaFM.

## Enable and Disable Memo Transfer

The `MemoTransfer` extension can also be freely enabled or disabled by the Token
Account owner.

To enable the `MemoTransfer` extension, use the `enableRequiredMemoTransfers`
instruction.

```javascript
// Enable Required Memo Transfers
transactionSignature = await enableRequiredMemoTransfers(
  connection, // Connection to use
  payer, // Payer of the transaction fee
  tokenAccount, // Token Account to modify
  payer.publicKey, // Owner of Token Account
  undefined, // Additional signers
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nEnable Required Memo Transfers:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

To disable the `MemoTransfer` extension, use the `disableRequiredMemoTransfers`
instruction.

```javascript
// Disable Required Memo Transfers
transactionSignature = await disableRequiredMemoTransfers(
  connection, // Connection to use
  payer, // Payer of the transaction fee
  tokenAccount, // Token Account to modify
  payer.publicKey, // Owner of Token Account
  undefined, // Additional signers
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nDisable Required Memo Transfers:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Once the `MemoTransfer` extension is disabled, transactions to transfer tokens
without a memo instruction will complete successfully.

```javascript
// Add instructions to new transaction
transaction = new Transaction().add(transferInstruction);

// Send transaction
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer], // Signers
);

console.log(
  "\nTransfer without Memo:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Run the script by clicking the `Run` button. You can then inspect the
transaction details on SolanaFM.

## Conclusion

The `MemoTransfer` extension ensures every incoming transfer to a Token Account
includes a memo. By requiring a memo instruction with each transfer, a message
is recorded in the transaction's program logs. This feature is especially useful
for understanding the purpose of transactions when reviewing logs at a later
time.
