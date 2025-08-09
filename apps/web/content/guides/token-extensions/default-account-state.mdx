---
date: 2023-12-06T00:00:00Z
seoTitle: "Token Extensions: Default Account State"
title: How to use the Default Account State extension
description:
  "Configure all new Token Accounts to be frozen by default, then requiring all
  tokens to be unfrozen by the authority before they can be usable."
keywords:
  - token 2022
  - token extensions
  - token program
difficulty: beginner
tags:
  - token 2022
  - token extensions
---

The `DefaultAccountState` extension provides the option to have all new Token
Accounts to be frozen by default. With this configuration, Token Accounts must
first be thawed (unfrozen) by the Freeze Authority of the mint before they
become usable. This feature grants token creators the ability to have greater
control over token distribution by limiting who can hold the tokens.

In this guide, we'll walk through an example of using Solana Playground. Here is
the [final script](https://beta.solpg.io/6570ae7afb53fa325bfd0c4c).

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
  AccountState,
  createInitializeDefaultAccountStateInstruction,
  createInitializeMintInstruction,
  getMintLen,
  createAccount,
  mintTo,
  updateDefaultAccountState,
  thawAccount,
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
// Authority that can freeze and thaw token accounts
const freezeAuthority = pg.wallet.publicKey;
```

Next, let's determine the size of the new Mint Account and calculate the minimum
lamports needed for rent exemption.

```javascript
// Size of Mint Account with extension
const mintLen = getMintLen([ExtensionType.DefaultAccountState]);
// Minimum lamports required for Mint Account
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
```

With Token Extensions, the size of the Mint Account will vary based on the
extensions enabled.

## Build Instructions

Next, let's build the set of instructions to:

- Create a new account
- Initialize the `DefaultAccountState` extension
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

Next, build the instruction to initialize the `DefaultAccountState` extension
for the Mint Account.

```javascript
// Set default account state as Frozen
const defaultState = AccountState.Frozen;
// Instruction to initialize the DefaultAccountState Extension
const initializeDefaultAccountStateInstruction =
  createInitializeDefaultAccountStateInstruction(
    mint, // Mint Account address
    defaultState, // Default AccountState
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
  freezeAuthority, //  Designated Freeze Authority
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);
```

## Send Transaction

Next, let's add the instructions to a new transaction and send it to the
network. This will create a Mint Account with the `DefaultAccountState`
extension enabled.

```javascript
// Add instructions to new transaction
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeDefaultAccountStateInstruction,
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
transaction on the SolanaFM.

## Default Frozen Token Account

When a Token Account is created, it will be frozen by default. As a result, any
transactions interacting with the Token Account will fail.

```javascript
// Create Token Account for Playground wallet
const tokenAccount = await createAccount(
  connection,
  payer, // Payer to create Token Account
  mint, // Mint Account address
  payer.publicKey, // Token Account owner
  undefined, // Optional keypair, default to Associated Token Account
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);
```

In the default frozen state, users are unable to hold or interact with tokens
from the mint until the Freeze Authority thaws (unfreezes) the Token Account.

For instance, minting tokens to the new Token Account will fail.

```javascript
try {
  // Attempt to Mint tokens
  await mintTo(
    connection,
    payer, // Transaction fee payer
    mint, // Mint Account address
    tokenAccount, // Destination for minting
    mintAuthority, // Mint Authority
    100, // Amount to mint
    undefined, // Additional signers
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
  );
} catch (error) {
  console.log("\nExpect Error:", error);
}
```

Run the script by clicking the `Run` button. You can then inspect the error in
the Playground terminal. You should see a message similar to the following:

```
[Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x11]
  logs:
   [ 'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb invoke [1]',
     'Program log: Instruction: MintTo',
     'Program log: Error: Account is frozen',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb consumed 3274 of 200000 compute units',
     'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0x11' ]
```

## Unfreeze (Thaw) Token Account

A Token Account can be unfrozen using the `thawAccount` instruction in the same
way as with the original Token program.

```javascript
// Thaw (unfreeze) the Token Account
transactionSignature = await thawAccount(
  connection,
  payer, // Transaction fee payer
  tokenAccount, // Token Account to unfreeze
  mint, // Mint Account address
  freezeAuthority, // Freeze Authority
  undefined, // Additional signers
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nThaw Token Account:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

The instruction to thaw the Token Account can be added to more complex
transactions, requiring users to perform certain actions to unfreeze their Token
Account.

## Update Default State

The token creator can choose to relax the initial restriction by using the
`updateDefaultAccountState` instruction by passing in the new account state to
set on created accounts.

```javascript
// Update default account state for new Token Accounts
transactionSignature = await updateDefaultAccountState(
  connection,
  payer, // Payer of the transaction fee
  mint, // Mint to modify
  AccountState.Initialized, // New account state to set on created accounts
  freezeAuthority, // Freeze authority
  undefined, // Additional signers
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nUpdate Default Mint Account State:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Run the script by clicking the `Run` button. You can then inspect the
transaction on the SolanaFM.

## Conclusion

The `DefaultAccountState` extension introduces a valuable tool for token
creators to have enhanced control of their token. This feature allows for
controlled token distribution, enabling mechanisms like mandatory KYC
verification for token holders.
