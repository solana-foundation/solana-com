---
date: 2023-12-06T00:00:00Z
seoTitle: "Token Extensions: Transfer Fees"
title: How to use the Transfer Fee extension
description:
  "With any form of transaction, there's often a desire to collect or apply a
  fee. Similar to a small service charge every time you transfer money at a bank
  or the way royalties or taxes are collected for particular transfers."
keywords:
  - token 2022
  - token extensions
  - token program
difficulty: beginner
tags:
  - token 2022
  - token extensions
---

With any form of transaction, there's often a desire to collect or apply a fee.
Similar to a small service charge every time you transfer money at a bank or the
way royalties or taxes are collected for particular transfers.

The `TransferFee` extension allows you to configure a transfer fee directly on
the Mint Account, enabling fees to be collected at a protocol level. Every time
tokens are transferred, the fee is set aside in the recipient's Token Account.
This fee is untouchable by the recipient and can only be accessed by the
Withdraw Authority.

The design of pooling transfer fees at the recipient account is meant to
maximize parallelization of transactions. Otherwise, one configured fee
recipient account would be write-locked between parallel transfers, decreasing
throughput of the protocol.

In this guide, we'll walk through an example of creating a mint with the
`TransferFee` extension enabled using Solana Playground. Here is the
[final script](https://beta.solpg.io/6570e5b7fb53fa325bfd0c4e).

<Callout type="info">

The Transfer Fee extension can ONLY take a fee from its same Token Mint. (e.g.
if you created `TokenA`, all transfer fees via the Transfer Fee extension will
be in `TokenA`). If you wish to achieve a similar transfer fee in a token other
that itself, use the Transfer Hook extension.

</Callout>

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
  createAccount,
  createInitializeMintInstruction,
  createInitializeTransferFeeConfigInstruction,
  getMintLen,
  getTransferFeeAmount,
  harvestWithheldTokensToMint,
  mintTo,
  transferCheckedWithFee,
  unpackAccount,
  withdrawWithheldTokensFromAccounts,
  withdrawWithheldTokensFromMint,
} from "@solana/spl-token";

// Connection to devnet cluster
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Playground wallet
const payer = pg.wallet.keypair;

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
// Authority that can modify transfer fees
const transferFeeConfigAuthority = pg.wallet.keypair;
// Authority that can move tokens withheld on mint or token accounts
const withdrawWithheldAuthority = pg.wallet.keypair;

// Fee basis points for transfers (100 = 1%)
const feeBasisPoints = 100;
// Maximum fee for transfers in token base units
const maxFee = BigInt(100);
```

Next, let's determine the size of the new Mint Account and calculate the minimum
lamports needed for rent exemption.

```javascript
// Size of Mint Account with extensions
const mintLen = getMintLen([ExtensionType.TransferFeeConfig]);
// Minimum lamports required for Mint Account
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
```

With Token Extensions, the size of the Mint Account will vary based on the
extensions enabled.

## Build Instructions

Next, let's build the set of instructions to:

- Create a new account
- Initialize the `TransferFee` extension
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

Next, build the instruction to initialize the `TransferFee` extension for the
Mint Account.

```javascript
// Instruction to initialize TransferFeeConfig Extension
const initializeTransferFeeConfig =
  createInitializeTransferFeeConfigInstruction(
    mint, // Mint Account address
    transferFeeConfigAuthority.publicKey, // Authority to update fees
    withdrawWithheldAuthority.publicKey, // Authority to withdraw fees
    feeBasisPoints, // Basis points for transfer fee calculation
    maxFee, // Maximum fee per transfer
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

Finally, we add the instructions to a new transaction and send it to the
network. This will create a mint account with the `TransferFee` extension.

```javascript
// Add instructions to new transaction
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeTransferFeeConfig,
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
transactions on the SolanaFM.

## Create Token Accounts

Next, let's set up two Token Accounts to demonstrate the functionality of the
`TransferFee` extension.

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

Next, generate a random keypair and use it as the owner of a
`destinationTokenAccount`.

```javascript
// Random keypair to use as owner of Token Account
const randomKeypair = new Keypair();
// Create Token Account for random keypair
const destinationTokenAccount = await createAccount(
  connection,
  payer, // Payer to create Token Account
  mint, // Mint Account address
  randomKeypair.publicKey, // Token Account owner
  undefined, // Optional keypair, default to Associated Token Account
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);
```

Lastly, mint 2000 tokens to the `sourceTokenAccount` to fund it.

```javascript
// Mint tokens to sourceTokenAccount
transactionSignature = await mintTo(
  connection,
  payer, // Transaction fee payer
  mint, // Mint Account address
  sourceTokenAccount, // Mint to
  mintAuthority, // Mint Authority address
  2000_00, // Amount
  undefined, // Additional signers
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nMint Tokens:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Transfer Tokens

Next, let's try to transfer tokens from the `sourceTokenAccount` to the
`destinationTokenAccount`. The transfer fee will automatically be deducted from
the transfer amount and remain in the `destinationTokenAccount` account.

To transfer tokens, we have to use the either the `transferChecked` or
`transferCheckedWithFee` instructions.

In this example, we'll use `transferCheckedWithFee`. The transfer only succeeds
if the correct transfer fee amount is passed into the instruction.

```javascript
// Transfer amount
const transferAmount = BigInt(1000_00);
// Calculate transfer fee
const fee = (transferAmount * BigInt(feeBasisPoints)) / BigInt(10_000);
// Determine fee charged
const feeCharged = fee > maxFee ? maxFee : fee;

// Transfer tokens with fee
transactionSignature = await transferCheckedWithFee(
  connection,
  payer, // Transaction fee payer
  sourceTokenAccount, // Source Token Account
  mint, // Mint Account address
  destinationTokenAccount, // Destination Token Account
  payer.publicKey, // Owner of Source Account
  transferAmount, // Amount to transfer
  decimals, // Mint Account decimals
  feeCharged, // Transfer fee
  undefined, // Additional signers
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nTransfer Tokens:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Withdraw Fee from Token Accounts

When tokens are transferred, transfer fees automatically accumulate in the
recipient Token Accounts. The Withdraw Authority can freely withdraw these
withheld tokens from each Token Account of the Mint.

To find the Token Accounts that have accumulated fees, we need to fetch all
Token Accounts for the mint and then filter for ones which have withheld tokens.

First, we fetch all Token Accounts for the Mint Account.

```javascript
// Retrieve all Token Accounts for the Mint Account
const allAccounts = await connection.getProgramAccounts(TOKEN_2022_PROGRAM_ID, {
  commitment: "confirmed",
  filters: [
    {
      memcmp: {
        offset: 0,
        bytes: mint.toString(), // Mint Account address
      },
    },
  ],
});
```

Next, we filter for Token Accounts that hold transfer fees.

```javascript
// List of Token Accounts to withdraw fees from
const accountsToWithdrawFrom = [];

for (const accountInfo of allAccounts) {
  const account = unpackAccount(
    accountInfo.pubkey, // Token Account address
    accountInfo.account, // Token Account data
    TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
  );

  // Extract transfer fee data from each account
  const transferFeeAmount = getTransferFeeAmount(account);

  // Check if fees are available to be withdrawn
  if (transferFeeAmount !== null && transferFeeAmount.withheldAmount > 0) {
    accountsToWithdrawFrom.push(accountInfo.pubkey); // Add account to withdrawal list
  }
}
```

Finally, we use the `withdrawWithheldAuthority` instruction to withdraw the fees
from the Token Accounts to a specified destination Token Account.

```javascript
// Withdraw withheld tokens from Token Accounts
transactionSignature = await withdrawWithheldTokensFromAccounts(
  connection,
  payer, // Transaction fee payer
  mint, // Mint Account address
  destinationTokenAccount, // Destination account for fee withdrawal
  withdrawWithheldAuthority, // Authority for fee withdrawal
  undefined, // Additional signers
  accountsToWithdrawFrom, // Token Accounts to withdrawal from
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nWithdraw Fee From Token Accounts:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Run the script by clicking the `Run` button. You can then inspect the
transaction on the SolanaFM.

## Harvest Fee to Mint Account

Token Accounts holding any tokens, including withheld ones, cannot be closed.
However, a user may want to close a Token Account with withheld transfer fees.

Users can permissionlessly clear out Token Accounts of withheld tokens using the
`harvestWithheldTokensToMint` instruction. This transfers the fees accumulated
on the Token Account directly to the Mint Account.

Let's first send another transfer so the `destinationTokenAccount` has withheld
transfer fees.

```javascript
// Transfer tokens with fee
transactionSignature = await transferCheckedWithFee(
  connection,
  payer, // Transaction fee payer
  sourceTokenAccount, // Source Token Account
  mint, // Mint Account address
  destinationTokenAccount, // Destination Token Account
  payer.publicKey, // Owner of Source Account
  transferAmount, // Amount to transfer
  decimals, // Mint Account decimals
  feeCharged, // Transfer fee
  undefined, // Additional signers
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nTransfer Tokens:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Next, we'll "harvest" the fees from the `destinationTokenAccount`. Note that
this can be done by anyone and not just the owner of the Token Account.

```javascript
// Harvest withheld fees from Token Accounts to Mint Account
transactionSignature = await harvestWithheldTokensToMint(
  connection,
  payer, // Transaction fee payer
  mint, // Mint Account address
  [destinationTokenAccount], // Source Token Accounts for fee harvesting
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nHarvest Fee To Mint Account:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

## Withdraw Fee from Mint Account

Tokens "harvested" to the Mint Account can then be withdrawn at any time by the
Withdraw Authority to a specified Token Account.

```javascript
// Withdraw fees from Mint Account
transactionSignature = await withdrawWithheldTokensFromMint(
  connection,
  payer, // Transaction fee payer
  mint, // Mint Account address
  destinationTokenAccount, // Destination account for fee withdrawal
  withdrawWithheldAuthority, // Withdraw Withheld Authority
  undefined, // Additional signers
  undefined, // Confirmation options
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log(
  "\nWithdraw Fee from Mint Account:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

Run the script by clicking the `Run` button. You can then inspect the
transaction on the SolanaFM.

## Conclusion

The `TransferFee` extension enables token creators to enforce fees on each
transfer without requiring extra instructions or specialized programs. This
approach ensures that fees are collected in the same currency as the transferred
tokens, simplifying the transaction process.
