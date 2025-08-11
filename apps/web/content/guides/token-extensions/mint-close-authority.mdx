---
date: 2023-12-05T00:00:00Z
seoTitle: "Token Extensions: Mint Close Authority"
title: How to use the Mint Close Authority extension
description:
  "With Token Extensions, it is possible to close token mint accounts by
  initializing the MintCloseAuthority extension before initializing the mint."
keywords:
  - token 2022
  - token extensions
  - token program
difficulty: beginner
tags:
  - token 2022
  - token extensions
---

With the original SPL token program, there was no option to close Mint Accounts
owned by the Token Program and reclaim the SOL allocated to these accounts.

The `MintCloseAuthority` extension introduces a solution to this limitation by
allowing a designated Close Authority to close a Mint Account if the supply of
the mint is 0. This feature provides a mechanism to recover SOL allocated to
Mint Accounts that are no longer in use.

In this guide, we'll walk through an example of using Solana Playground. Here is
the [final script](https://beta.solpg.io/65700c73fb53fa325bfd0c4a).

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

Let's start by setting up our script. We'll be using the `@solana/web3.js` and
`@solana/spl-token` libraries.

Replace the starter code with the following:

```javascript
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  closeAccount,
  createInitializeMintCloseAuthorityInstruction,
  createInitializeMintInstruction,
  getMintLen,
} from "@solana/spl-token";

// Playground wallet
const payer = pg.wallet.keypair;

// Connection to devnet cluster
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Transaction signature returned from sent transaction
let transactionSignature: string;
```

## Mint Setup

First, let's define the properties of the Mint Account we'll be creating in the
following step.

```javascript
// Generate new keypair for Mint Account
const mintKeypair = Keypair.generate();
// Address for Mint Account
const mint = mintKeypair.publicKey;
// Decimals for Mint Account
const decimals = 2;
// Authority that can mint new tokens
const mintAuthority = pg.wallet.publicKey;
// Authority that can close the Mint Account
const closeAuthority = pg.wallet.publicKey;
```

Next, let's determine the size of the new Mint Account and calculate the minimum
lamports needed for rent exemption.

```javascript
// Size of Mint Account with extension
const mintLen = getMintLen([ExtensionType.MintCloseAuthority]);
// Minimum lamports required for Mint Account
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
```

With Token Extensions, the size of the Mint Account will vary based on the
extensions enabled.

## Build Instructions

Next, let's build the set of instructions to:

- Create a new account
- Initialize the `MintCloseAuthority` extension
- Initialize the remaining Mint Account data

First, build the instruction to invoke the System Program to create an account
and assign ownership to the Token Extensions Program.

```javascript
// Instruction to invoke System Program to create new account
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Account that will transfer lamports to created account
  newAccountPubkey: mint, // Address of the account to create
  space: mintLen, // Amount of bytes to allocate to the created account
  lamports, // Amount of lamports transferred to created account
  programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
});
```

Next, build the instruction to initialize the `MintCloseAuthority` extension for
the Mint Account.

```javascript
// Instruction to initialize the MintCloseAuthority Extension
const initializeMintCloseAuthorityInstruction =
  createInitializeMintCloseAuthorityInstruction(
    mint, // Mint Account address
    closeAuthority, // Designated Close Authority
    TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
  );
```

Lastly, build the instruction to initialize the rest of the Mint Account data.
This is the same as with the original Token Program.

```javascript
// Instruction to initialize Mint Account data
const initializeMintInstruction = createInitializeMintInstruction(
  mint, // Mint Account Address
  decimals, // Decimals of Mint
  mintAuthority, // Designated Mint Authority
  null, // Optional Freeze Authority
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);
```

## Send Transaction

Next, let's add the instructions to a new transaction and send it to the
network. This will create a Mint Account with the `MintCloseAuthority` extension
enabled.

```javascript
// Add instructions to new transaction
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeMintCloseAuthorityInstruction,
  initializeMintInstruction,
);

// Send transaction
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, mintKeypair], // Signers
);

console.log(
  "\nCreate Mint Account:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Run the script by clicking the `Run` button. You can then inspect the
transaction details on SolanaFM.

## Close Mint Account

With the `MintCloseAuthority` extension enabled, the Close Authority can close
the Mint Account to reclaim the lamports from the account.

```javascript
// Send transaction to close Mint Account
transactionSignature = await closeAccount(
  connection,
  payer, // Transaction fee payer
  mint, // Mint Account address
  payer.publicKey, // Account to receive lamports from closed account
  closeAuthority, // Close Authority for Mint Account
  undefined, // Additional signers
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nClose Mint Account:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Run the script by clicking the `Run` button. You can then inspect the
transaction details on the SolanaFM.

## Conclusion

The `MintCloseAuthority` extension enables developers to reclaim SOL that
otherwise would have been permanently locked in a Mint Account. This feature is
particularly useful for applications or games involving single-use NFTs that are
meant to be burned. It ensures that the SOL allocated to Mint Accounts which are
no longer used can be reclaimed and reused.
