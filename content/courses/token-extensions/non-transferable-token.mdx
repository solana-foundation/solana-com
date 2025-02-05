---
title: Non-Transferable Token
objectives:
  - Create non-transferable token
  - Mint a non-transferable token
  - Attempt to transfer the non-transferable token
description:
  "Create tokens that can't be transferred. Certificates, identity, ticketing
  and more."
---

## Summary

- In the original Token Program, creating non-transferrable (sometimes called
  "soul-bound") tokens is impossible
- The Token Extension Program's `non-transferrable token` enables
  non-transferrable tokens

## Overview

In the Token Program, it's impossible to create a token that cannot be
transferred away. While this may seem unimportant, there are several reasons one
may want to issue a non-transferrable (or "soul-bound") token.

Take the following example: Say you are a Solana game dev, and your new game,
"Bits and Bytes", wants to award achievements to the players. Achievements are
not transferrable, and you want their hard work to be proudly displayed in their
wallet. The solution is to send them a non-transferable NFT. However, in the
Token Program, this is not possible. However, it is in the Token Extension
Program! Enter, the `non-transferable` extension.

Token Extension Program has the `non-transferable` extension which can be used
to create non-transferable mints. These mints can be burned, but they can't be
transferred.

### Creating non-transferable mint account

Initializing a non-transferable mint involves three instruction:

- `SystemProgram.createAccount`
- `createInitializeNonTransferableMintInstruction`
- `createInitializeMintInstruction`

The first instruction `SystemProgram.createAccount` allocates space on the
blockchain for the mint account. This instruction accomplishes three things:

- Allocates `space`
- Transfers `lamports` for rent
- Assigns to itself it's owning program

Like all other extensions, you'll need to calculate the space and lamports
needed for the mint account. You can do this by calling: `getMintLen` and
`getMinimumBalanceForRentExemption`.

```ts
const extensions = [ExtensionType.NonTransferable];
const mintLength = getMintLen(extensions);

const mintLamports =
  await connection.getMinimumBalanceForRentExemption(mintLength);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mintKeypair.publicKey,
  space: mintLength,
  lamports: mintLamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

The second instruction `createInitializeNonTransferableMintInstruction`
initializes the non-transferable extension.

```ts
const initializeNonTransferableMintInstruction =
  createInitializeNonTransferableMintInstruction(
    mintKeypair.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );
```

The third instruction `createInitializeMintInstruction` initializes the mint.

```ts
const initializeMintInstruction = createInitializeMintInstruction(
  mintKeypair.publicKey,
  decimals,
  payer.publicKey,
  null, // Confirmation Config
  TOKEN_2022_PROGRAM_ID,
);
```

Lastly, add all of the instructions to a transaction and send to Solana.

```ts
const mintTransaction = new Transaction().add(
  createAccountInstruction,
  initializeNonTransferableMintInstruction,
  initializeMintInstruction,
);

await sendAndConfirmTransaction(
  connection,
  mintTransaction,
  [payer, mintKeypair],
  { commitment: "finalized" },
);
```

And that's it! You now have a mint account, that when minted, cannot be
transferred. This extension gets more exciting when you mix it with the
`metadata` and `metadata-pointer` extensions to create soul-bound NFTs.

## Lab

In this lab, we will create a non-transferable token and then see what happens
when we try to transfer it (hint: it will fail the transfer).

#### 1. Getting started

To get started, create an empty directory named `non-transferable-token` and
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
import { Connection, Keypair } from "@solana/web3.js";
import { initializeKeypair } from "@solana-developers/helpers";
import dotenv from "dotenv";
import {
  createAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
// import { createNonTransferableMint } from './create-mint';
dotenv.config();

/**
 * Create a connection and initialize a keypair if one doesn't already exists.
 * If a keypair exists, airdrop a sol if needed.
 */
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);

console.log(`public key: ${payer.publicKey.toBase58()}`);

const mintKeypair = Keypair.generate();
const mint = mintKeypair.publicKey;
console.log("\nmint public key: " + mintKeypair.publicKey.toBase58() + "\n\n");

// CREATE MINT

// CREATE SOURCE ACCOUNT AND MINT TOKEN

// CREATE DESTINATION ACCOUNT FOR TRANSFER

// TRY TRANSFER
```

This file has a main function that creates a connection to the specified
validator node and calls `initializeKeypair`. This main function is where we'll
end up calling the rest of our script once we've written it.

Go ahead and run the script. You should see the `mint` public key logged to your
terminal.

```bash
esrun src/index.ts
```

If you run into an error in `initializeKeypair` with airdropping, follow the
next step.

#### 2. Setting up dev environment (optional)

If you are having issues with airdropping devnet SOL. You can either:

1. Add the `keypairPath` parameter to `initializeKeypair` and get some devnet
   SOL from [Solana's faucet.](https://faucet.solana.com/)
2. Run a local validator by doing the following:

In a separate terminal, run the following command: `solana-test-validator`. This
will run the node and also log out some keys and values. The value we need to
retrieve and use in our connection is the JSON RPC URL, which in this case is
`http://127.0.0.1:8899`. We then use that in the connection to specify to use
the local RPC URL.

```typescript
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
```

#### 3. Create a non-transferable mint

Let's create the function `createNonTransferableMint` in a new file
`src/create-mint.ts`.

Inside the file, create the function `createNonTransferableMint` with the
following arguments:

- `connection` : The connection object
- `payer` : Payer for the transaction
- `mintKeypair` : Keypair for new mint
- `decimals` : Mint decimals

Inside the function, we'll call the following:

- `getMintLen` - to get the space needed for the mint account
- `getMinimumBalanceForRentExemption` - to get the amount of lamports needed for
  the mint account
- `createAccount` - Allocates space on the blockchain for the mint account
- `createInitializeNonTransferableMintInstruction` - initializes the extension
- `createInitializeMintInstruction` - initializes the mint
- `sendAndConfirmTransaction` - sends the transaction to the blockchain

```typescript
import {
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";

import {
  ExtensionType,
  createInitializeMintInstruction,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  createInitializeNonTransferableMintInstruction,
} from "@solana/spl-token";

export async function createNonTransferableMint(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
): Promise<TransactionSignature> {
  const extensions = [ExtensionType.NonTransferable];
  const mintLength = getMintLen(extensions);

  const mintLamports =
    await connection.getMinimumBalanceForRentExemption(mintLength);

  console.log("Creating a transaction with non-transferable instruction...");
  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLength,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeNonTransferableMintInstruction(
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      payer.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID,
    ),
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
    { commitment: "finalized" },
  );

  return signature;
}
```

Now let's invoke this function in `src/index.ts` to create the non-transferable
mint:

```typescript
// CREATE MINT
const decimals = 9;

await createNonTransferableMint(connection, payer, mintKeypair, decimals);
```

The script should run with no errors

```bash
esrun src/index.ts
```

The non-transferable mint has been set up correctly and will be created when we
run `npm start`. Let's move on to the next step and create a source account and
mint a token to it.

#### 4. Mint token

Let's test that we can't actually transfer tokens created from this mint. To do
this, we need to mint a token to an account.

Let's do this in `src/index.ts`. Let's create a source account and mint one
non-transferable token.

We can accomplish this in two functions:

- `getOrCreateAssociatedTokenAccount`: from the `@solana/spl-token` library,
  this creates an associated token account (ATA) for the given mint and owner.
- `mintTo`: This function will mint an `amount` of tokens to the given token
  account.

```typescript
// CREATE PAYER ATA AND MINT TOKEN
console.log("Creating an Associated Token Account...");
const ata = (
  await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey,
    undefined,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  )
).address;

console.log("Minting 1 token...");

const amount = 1 * 10 ** decimals;
await mintTo(
  connection,
  payer,
  mint,
  ata,
  payer,
  amount,
  [payer],
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);
const tokenBalance = await connection.getTokenAccountBalance(ata, "finalized");

console.log(
  `Account ${ata.toBase58()} now has ${tokenBalance.value.uiAmount} token.`,
);
```

Run the script and confirm a token has been minted to an account:

```bash
esrun src/index.ts
```

#### 5. Attempt to transfer a non-transferable token

Lastly, let's try and actually transfer the token somewhere else. First we need
to create a token account to transfer to, and then we want to try and transfer.

In `src/index.ts`, we will create a destination account and try to transfer the
non-transferable token to this account.

We can accomplish this in two functions:

- `createAccount`: This will create a token account for a given mint and the
  keypair of said account. So instead of using an ATA here, let's generate a new
  keypair as the token account. We're doing this just to show different options
  of accounts.
- `transferChecked`: This will attempt to transfer the token.

First, the `createAccount` function:

```typescript
// CREATE DESTINATION ACCOUNT FOR TRANSFER
console.log("Creating a destination account...\n\n");
const destinationKeypair = Keypair.generate();
const destinationAccount = await createAccount(
  connection,
  payer,
  mintKeypair.publicKey,
  destinationKeypair.publicKey,
  undefined,
  { commitment: "finalized" },
  TOKEN_2022_PROGRAM_ID,
);
```

Now, the `transferChecked` function:

```typescript
// TRY TRANSFER
console.log("Attempting to transfer non-transferable mint...");
try {
  const signature = await transferChecked(
    connection,
    payer,
    ata,
    mint,
    destinationAccount,
    ata,
    amount,
    decimals,
    [destinationKeypair],
    { commitment: "finalized" },
    TOKEN_2022_PROGRAM_ID,
  );
} catch (e) {
  console.log(
    "This transfer is failing because the mint is non-transferable. Check out the program logs: ",
    (e as any).logs,
    "\n\n",
  );
}
```

Now let's run everything and see what happens:

```
esrun src/index.ts
```

You should get an error message at the very end that says
`Transfer is disabled for this mint`. This is indicating that the token we are
attempting to transfer is in fact non-transferable!

```bash
Attempting to transfer non-transferable mint...
This transfer is failing because the mint is non-transferable. Check out the program logs:  [
  'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb invoke [1]',
  'Program log: Instruction: TransferChecked',
  'Program log: Transfer is disabled for this mint',
  'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb consumed 3910 of 200000 compute units',
  'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0x25'
]
```

That's it! We have successfully created a non-transferable mint. If you are
stuck at any point, you can find the working code on the `solution` branch of
[this repository](https://github.com/Unboxed-Software/solana-lab-non-transferable-token/tree/solution).

## Challenge

For the challenge, create your own non-transferable token with the metadata
extension and keep a “soulbound” NFT to yourself.
