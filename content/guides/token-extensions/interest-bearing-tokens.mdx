---
date: 2023-12-07T00:00:00Z
seoTitle: "Token Extensions: Interest-Bearing"
title: How to use the Interest-Bearing extension
description:
  "Interest-bearing tokens are tokens that can either increase or decrease in
  value over time. Similar to how a bank savings account or a loan accumulates
  interest."
keywords:
  - token 2022
  - token extensions
  - token program
difficulty: beginner
tags:
  - token 2022
  - token extensions
---

The `InterestBearingConfig` extension enables developers to set an interest rate
stored directly on the Mint Account. Interest is compounded continuously, based
on the network's timestamp.

In other words, the accrued interest is simply a visual UI conversion, but the
underlying token quantity remains unchanged. This design eliminates the need for
frequent rebase or update operations to adjust for accrued interest.

<Callout type="info">

Note that the interest accrual is only a
[calculation](https://github.com/solana-labs/solana-program-library/blob/master/token/program-2022/src/extension/interest_bearing_mint/mod.rs#L85),
and does not involve minting new tokens.

</Callout>

In this guide, we'll walk through an example of using Solana Playground. Here is
the [final script](https://beta.solpg.io/65724856fb53fa325bfd0c53).

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
  updateRateInterestBearingMint,
  createInitializeInterestBearingMintInstruction,
  createInitializeMintInstruction,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  amountToUiAmount,
  getInterestBearingMintConfigState,
  getMint,
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
// Authority that can update the interest rate
const rateAuthority = pg.wallet.keypair;
// Interest rate basis points (100 = 1%)
// Max value = 32,767 (i16)
const rate = 32_767;
```

Next, let's determine the size of the new Mint Account and calculate the minimum
lamports needed for rent exemption.

```javascript
// Size of Mint Account with extension
const mintLen = getMintLen([ExtensionType.InterestBearingConfig]);
// Minimum lamports required for Mint Account
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
```

With Token Extensions, the size of the Mint Account will vary based on the
extensions enabled.

## Build Instructions

Next, let's build the set of instructions to:

- Create a new account
- Initialize the `InterestBearingConfig` extension
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

Next, build the instruction to initialize the `InterestBearingConfig` extension
for the Mint Account.

```javascript
// Instruction to initialize the InterestBearingConfig Extension
const initializeInterestBearingMintInstruction =
  createInitializeInterestBearingMintInstruction(
    mint, // Mint Account address
    rateAuthority.publicKey, // Designated Rate Authority
    rate, // Interest rate basis points
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
network. This will create a Mint Account with the `InterestBearingConfig`
extension enabled.

```javascript
// Add instructions to new transaction
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeInterestBearingMintInstruction,
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

## Update Interest Rate

The designated Rate Authority can then update the interest rate on the Mint
Account at any time.

```javascript
// New interest rate in basis points
const updateRate = 0;
// Update interest rate on Mint Account
transactionSignature = await updateRateInterestBearingMint(
  connection,
  payer, // Transaction fee payer
  mint, // Mint Account Address
  rateAuthority, // Designated Rate Authority
  updateRate, // New interest rate
  undefined, // Additional signers
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nUpdate Rate:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Fetch Interest Config State

Next, let's check the updated interest rate by fetching the Mint Account data.

```javascript
// Fetch Mint Account data
const mintAccount = await getMint(
  connection,
  mint, // Mint Account Address
  undefined, // Optional commitment
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

// Get Interest Config for Mint Account
const interestBearingMintConfig = await getInterestBearingMintConfigState(
  mintAccount, // Mint Account data
);

console.log(
  "\nMint Config:",
  JSON.stringify(interestBearingMintConfig, null, 2),
);
```

## Calculate Accrued Interest

Lastly, let's calculate the interest accrued for a given amount. Note that this
calculation can be performed independently for any amount, without the need for
minting tokens.

```javascript
// Wait 1 second
sleep(1000);

// Amount to convert
const amount = 100;
// Convert amount to UI amount with accrued interest
const uiAmount = await amountToUiAmount(
  connection, // Connection to the Solana cluster
  payer, // Account that will transfer lamports for the transaction
  mint, // Address of the Mint account
  amount, // Amount to be converted
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log("\nAmount with Accrued Interest:", uiAmount);
```

Run the script by clicking the `Run` button. You can then inspect the
transaction details on SolanaFM and view the data logged in the Playground
terminal.

<Callout type="caution">

Interest is continuously compounded based on the timestamp in the network. Due
to drift that may occur in the network timestamp, the accumulated interest could
be lower than the expected value. Thankfully, this is rare.

</Callout>

You should see an output similar to snippet below, where the decimal values
indicate the interest that has accumulated:

```
Mint Config: {
  "rateAuthority": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
  "initializationTimestamp": 1702321738,
  "preUpdateAverageRate": 32767,
  "lastUpdateTimestamp": 1702321740,
  "currentRate": 0
}

Amount with Accrued Interest: 1.000000207670422
```

## Conclusion

The `InterestBearingConfig` extension introduces a simple mechanism for tokens
to increase or decrease in value over time. By seamlessly integrating tools
commonly found in traditional finance, this innovation broadens Solana's
capabilities, bridging the gap between conventional financial instruments and
the world of blockchain.
