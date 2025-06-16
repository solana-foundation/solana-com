---
title: Interest Bearing Token
objectives:
  - Create a mint account with the interest bearing extension
  - Explain the use cases of interest bearing tokens
  - Experiment with the rules of the extension
description: "Make a token that earns interest over time."
---

## Summary

- Creators can set an interest rate and store it directly on the mint account.
- The underlying token quantity for interest bearing tokens remains unchanged.
- The accrued interest can be displayed for UI purposes without the need to
  frequently rebase or update to adjust for accrued interest.
- The lab demonstrates configuring a mint account that is set to mint with an
  interest rate. The test case also shows how to update the interest rate, along
  with retrieving the rate from the token.

## Overview

Tokens with values that either increase or decrease over time have practical
applications in the real world, with bonds being a prime example. Previously,
the ability to reflect this dynamic in tokens was limited to the use of proxy
contracts, necessitating frequent rebasing or updates.

The `interest bearing token` extension helps with this. By leveraging the
`interest bearing token` extension and the `amount_to_ui_amount` function, users
can apply an interest rate to their tokens and retrieve the updated total,
including interest, at any given moment.

The calculation of interest is done continuously, factoring in the network's
timestamp. However, discrepancies in the network's time could result in accrued
interest being slightly less than anticipated, though this situation is
uncommon.

It's important to note that this mechanism does not generate new tokens and the
displayed amount simply includes the accumulated interest, making the change
purely aesthetic. That being said, this is a value stored on within the mint
account and programs can take advantage of this to create functionality beyond
pure aesthetics.

### Adding interest rate to token

Initializing an interest bearing token involves three instructions:

- `SystemProgram.createAccount`
- `createInitializeTransferFeeConfigInstruction`
- `createInitializeMintInstruction`

The first instruction `SystemProgram.createAccount` allocates space on the
blockchain for the mint account. This instruction accomplishes three things:

- Allocates `space`
- Transfers `lamports` for rent
- Assigns to it's owning program

```typescript
SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint,
    space: mintLen,
    lamports: mintLamports,
    programId: TOKEN_2022_PROGRAM_ID,
  }),
```

The second
instruction `createInitializeInterestBearingMintInstruction` initializes the
interest bearing token extension. The defining argument that dictates the
interest rate will be a variable we create named `rate`. The `rate` is defined
in [basis points](https://www.investopedia.com/terms/b/basispoint.asp).

```typescript
  createInitializeInterestBearingMintInstruction(
    mint,
    rateAuthority.publicKey,
    rate,
    TOKEN_2022_PROGRAM_ID,
  ),
```

The third instruction `createInitializeMintInstruction` initializes the mint.

```typescript
createInitializeMintInstruction(
  mint,
  decimals,
  mintAuthority.publicKey,
  null,
  TOKEN_2022_PROGRAM_ID,
);
```

When the transaction with these three instructions is sent, a new interest
bearing token is created with the specified rate configuration.

### Fetching accumulated interest

To retrieve the accumulated interest on a token at any given point, first use
the `getAccount` function to fetch token information, including the amount and
any associated data, passing in the connection, payer's token account, and the
relevant program ID, `TOKEN_2022_PROGRAM_ID`.

Next, utilize the `amountToUiAmount` function with the obtained token
information, along with additional parameters such as connection, payer, and
mint, to convert the token amount to its corresponding UI amount, which
inherently includes any accumulated interest.

```typescript
const tokenInfo = await getAccount(
  connection,
  payerTokenAccount,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

/**
 * Get the amount as a string using mint-prescribed decimals
 *
 * @param connection     Connection to use
 * @param payer          Payer of the transaction fees
 * @param mint           Mint for the account
 * @param amount         Amount of tokens to be converted to Ui Amount
 * @param programId      SPL Token program account
 *
 * @return Ui Amount generated
 */
const uiAmount = await amountToUiAmount(
  connection,
  payer,
  mint,
  tokenInfo.amount,
  TOKEN_2022_PROGRAM_ID,
);

console.log("UI Amount: ", uiAmount);
```

The return value of `uiAmount` is a string representation of the UI amount and
will look similar to this: `0.0000005000001557528245`.

### Update rate authority

Solana provides a helper function, `setAuthority`, to set a new authority on an
interest bearing token.

Use the `setAuthority` function to assign a new authority to the account. You'll
need to provide the `connection`, the account paying for transaction fees
(payer), the token account to update (mint), the current authority's public key,
the type of authority to update (in this case, 7 represents the `InterestRate`
authority type), and the new authority's public key.

After setting the new authority, use the `updateRateInterestBearingMint`
function to update the interest rate for the account. Pass in the necessary
parameters: `connection`, `payer`, `mint`, the new authority's public key, the
updated interest rate, and the program ID.

```typescript
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
  rateAuthority,
  AuthorityType.InterestRate, // Rate type (InterestRate)
  otherAccount.publicKey, // new rate authority,
  [],
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

await updateRateInterestBearingMint(
  connection,
  payer,
  mint,
  otherAccount, // new rate authority
  10, // updated rate
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

## Lab

In this lab, we're establishing Interest Bearing Tokens via the Token-2022
program on Solana. We'll initialize these tokens with a specific interest rate,
update the rate with proper authorization, and observe how interest accumulates
on tokens over time.

#### 1. Setup Environment

To get started, create an empty directory named `interest-bearing-token` and
navigate to it. Run `npm init -y` to initialize a brand new project.

Next, we'll need to add our dependencies. Run the following to install the
required packages:

```bash
npm i @solana-developers/helpers@2 @solana/spl-token @solana/web3.js@1 esrun dotenv typescript
```

Create a directory named `src`. In this directory, create a file named
`index.ts`. This is where we will run checks against the rules of this
extension. Paste the following code in `index.ts`:

```ts
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

import {
  ExtensionType,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  getMint,
  getInterestBearingMintConfigState,
  updateRateInterestBearingMint,
  amountToUiAmount,
  mintTo,
  createAssociatedTokenAccount,
  getAccount,
  AuthorityType,
} from "@solana/spl-token";

import { initializeKeypair, makeKeypairs } from "@solana-developers/helpers";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);
const [otherAccount, mintKeypair] = makeKeypairs(2);
const mint = mintKeypair.publicKey;
const rateAuthority = payer;

const rate = 32_767;

// Create an interest-bearing token

// Create an associated token account

// Create the getInterestBearingMint function

// Attempt to update the interest rate

// Attempt to update the interest rate with the incorrect owner

// Log the accrued interest

// Log the interest-bearing mint configuration state

// Update the rate authority and attempt to update the interest rate with the new authority
```

`index.ts` creates a connection to the specified validator node and calls
`initializeKeypair`. It also has a few variables we will be using in the rest of
this lab. The `index.ts` is where we'll end up calling the rest of our script
once we've written it.

#### 2. Run validator node

For the sake of this guide, we'll be running our own validator node.

In a separate terminal, run the following command: `solana-test-validator`. This
will run the node and also log out some keys and values. The value we need to
retrieve and use in our connection is the JSON RPC URL, which in this case is
`http://127.0.0.1:8899`. We then use that in the connection to specify to use
the local RPC URL.

`const connection = new Connection("http://127.0.0.1:8899", "confirmed");`

#### 3. Helpers

When we pasted the `index.ts` code from earlier, we added the following helpers:

- `initializeKeypair`: This function creates the keypair for the `payer` and
  also airdrops 1 testnet SOL to it
- `makeKeypairs`: This function creates keypairs without airdropping any SOL

Additionally, we have some initial accounts:

- `payer`: Used to pay for and be the authority for everything
- `mintKeypair`: Our mint that will have the `interest bearing token` extension
- `otherAccount`: The account we will use to attempt to update interest
- `otherTokenAccountKeypair`: Another token used for testing

#### 4. Create Mint with interest bearing token

This function is where we'll be creating the token such that all new tokens will
be created with an interest rate. Create a new file inside of `src` named
`token-helper.ts`.

```typescript
import {
  TOKEN_2022_PROGRAM_ID,
  createInitializeInterestBearingMintInstruction,
  createInitializeMintInstruction,
} from "@solana/spl-token";
import {
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  Transaction,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";

export async function createTokenWithInterestRateExtension(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  mintLen: number,
  rateAuthority: Keypair,
  rate: number,
  mintKeypair: Keypair,
) {
  const mintAuthority = payer;
  const decimals = 9;
}
```

This function will take the following arguments:

- `connection`: The connection object
- `payer`: Payer for the transaction
- `mint`: Public key for the new mint
- `rateAuthority`: Keypair of the account that can modify the token, in this
  case, it is `payer`
- `rate`: Chosen interest rate for the token. In our case, this will be
  `32_767`, or 32767, the max rate for the interest bearing token extension
- `mintKeypair`: Keypair for the new mint

When creating an interest bearing token, we must create the account instruction,
add the interest instruction and initialize the mint itself. Inside of
`createTokenWithInterestRateExtension` in `src/token-helper.ts` there are a few
variables already created that will be used to create the interest bearing
token. Add the following code beneath the declared variables:

```ts
const extensions = [ExtensionType.InterestBearingConfig];
const mintLen = getMintLen(extensions);
const mintLamports =
  await connection.getMinimumBalanceForRentExemption(mintLen);

const mintTransaction = new Transaction().add(
  SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint,
    space: mintLen,
    lamports: mintLamports,
    programId: TOKEN_2022_PROGRAM_ID,
  }),
  createInitializeInterestBearingMintInstruction(
    mint,
    rateAuthority.publicKey,
    rate,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializeMintInstruction(
    mint,
    decimals,
    mintAuthority.publicKey,
    null,
    TOKEN_2022_PROGRAM_ID,
  ),
);

await sendAndConfirmTransaction(
  connection,
  mintTransaction,
  [payer, mintKeypair],
  undefined,
);
```

That's it for the token creation! Now we can move on and start adding tests.

#### 5. Establish required accounts

Inside of `src/index.ts`, the starting code already has some values related to
the creation of the interest bearing token.

Underneath the existing `rate` variable, add the following function call to
`createTokenWithInterestRateExtension` to create the interest bearing token.
We'll also need to create an associated token account which we'll be using to
mint the interest bearing tokens to and also run some tests to check if the
accrued interest increases as expected.

```typescript
const rate = 32_767;

// Create interest bearing token
await createTokenWithInterestRateExtension(
  connection,
  payer,
  mint,
  rateAuthority,
  rate,
  mintKeypair,
);

// Create associated token account
const payerTokenAccount = await createAssociatedTokenAccount(
  connection,
  payer,
  mint,
  payer.publicKey,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

### 6. Tests

Before we start writing any tests, it would be helpful for us to have a function
that takes in the `mint` and returns the current interest rate of that
particular token.

Let's utilize the `getInterestBearingMintConfigState` helper provided by the SPL
library to do just that. We'll then create a function that is used in our tests
to log out the current interest rate of the mint.

The return value of this function is an object with the following values:

- `rateAuthority`: Keypair of the account that can modify the token
- `initializationTimestamp`: Timestamp of interest bearing token initialization
- `preUpdateAverageRate`: Last rate before update
- `lastUpdateTimestamp`: Timestamp of last update
- `currentRate`: Current interest rate

Add the following types and function:

```typescript
// Create getInterestBearingMint function
interface GetInterestBearingMint {
  connection: Connection;
  mint: PublicKey;
}

async function getInterestBearingMint(inputs: GetInterestBearingMint) {
  const { connection, mint } = inputs;
  // retrieves information of the mint
  const mintAccount = await getMint(
    connection,
    mint,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  // retrieves the interest state of mint
  const interestBearingMintConfig =
    await getInterestBearingMintConfigState(mintAccount);

  // returns the current interest rate
  return interestBearingMintConfig?.currentRate;
}
```

**Updating interest rate**

The Solana SPL library provides a helper function for updating the interest rate
of a token named `updateRateInterestBearingMint`. For this function to work
correctly, the `rateAuthority` of that token must be the same one of which the
token was created. If the `rateAuthority` is incorrect, updating the token will
result in a failure.

Let's create a test to update the rate with the correct authority. Add the
following function calls:

```typescript
// Attempt to update interest rate
const initialRate = await getInterestBearingMint({ connection, mint });
try {
  await updateRateInterestBearingMint(
    connection,
    payer,
    mint,
    payer,
    0, // updated rate
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  const newRate = await getInterestBearingMint({ connection, mint });

  console.log(
    `✅ - We expected this to pass because the rate has been updated. Old rate: ${initialRate}. New rate: ${newRate}`,
  );
} catch (error) {
  console.error("You should be able to update the interest.");
}
```

Run `npx esrun src/index.ts`. We should see the following error logged out in
the terminal, meaning the extension is working as intended and the interest rate
has been updated:
`✅ - We expected this to pass because the rate has been updated. Old rate: 32767. New rate: 0`

**Updating interest rate with incorrect rate authority**

In this next test, let's try and update the interest rate with the incorrect
`rateAuthority`. Earlier we created a keypair named `otherAccount`. This will be
what we use as the `otherAccount` to attempt the change the interest rate.

Below the previous test we created add the following code:

```typescript
// Attempt to update the interest rate as the account other than the rate authority.
try {
  await updateRateInterestBearingMint(
    connection,
    otherAccount,
    mint,
    otherAccount, // incorrect authority
    0, // updated rate
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  console.log("You should be able to update the interest.");
} catch (error) {
  console.error(
    `✅ - We expected this to fail because the owner is incorrect.`,
  );
}
```

Now run `npx esrun src/index.ts`. This is expected to fail and log out
`✅ - We expected this to fail because the owner is incorrect.`

**Mint tokens and read interest rate**

So we've tested updating the interest rate. How do we check that the accrued
interest increases when an account mints more tokens? We can use the
`amountToUiAmount` and `getAccount` helpers from the SPL library to help us
achieve this.

Let's create a for loop that 5 times and mints 100 tokens per loop and logs out
the new accrued interest:

```typescript
// Log accrued interest
{
  // Logs out interest on token
  for (let i = 0; i < 5; i++) {
    const rate = await getInterestBearingMint({ connection, mint });
    await mintTo(
      connection,
      payer,
      mint,
      payerTokenAccount,
      payer,
      100,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    const tokenInfo = await getAccount(
      connection,
      payerTokenAccount,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    // Convert amount to UI amount with accrued interest
    const uiAmount = await amountToUiAmount(
      connection,
      payer,
      mint,
      tokenInfo.amount,
      TOKEN_2022_PROGRAM_ID,
    );

    console.log(
      `Amount with accrued interest at ${rate}: ${tokenInfo.amount} tokens = ${uiAmount}`,
    );
  }
}
```

You should see something similar to the logs below:

```typescript
Amount with accrued interest at 32767: 100 tokens = 0.0000001000000207670422
Amount with accrued interest at 32767: 200 tokens = 0.0000002000000623011298
Amount with accrued interest at 32767: 300 tokens = 0.0000003000001246022661
Amount with accrued interest at 32767: 400 tokens = 0.00000040000020767045426
Amount with accrued interest at 32767: 500 tokens = 0.0000005000003634233328
```

As you can see, the interest rate increases as more tokens are minted!

**Log mint config**

If for some reason you need to retrieve the mint config state, we can utilize
the `getInterestBearingMintConfigState` function we created earlier to display
information about the interest bearing mint state.

```ts
// Log interest bearing mint config state
const mintAccount = await getMint(
  connection,
  mint,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

// Get Interest Config for Mint Account
const interestBearingMintConfig =
  await getInterestBearingMintConfigState(mintAccount);

console.log(
  "\nMint Config:",
  JSON.stringify(interestBearingMintConfig, null, 2),
);
```

This should log out something that looks similar to this:

```typescript
Mint Config: {
  "rateAuthority": "Ezv2bZZFTQEznBgTDmaPPwFCg7uNA5KCvMGBNvJvUmS",
  "initializationTimestamp": 1709422265,
  "preUpdateAverageRate": 32767,
  "lastUpdateTimestamp": 1709422267,
  "currentRate": 0
}
```

### Update rate authority and interest rate

Before we conclude this lab, let's set a new rate authority on the interest
bearing token and attempt to update the interest rate. We do this by using the
`setAuthority` function and passing in the original authority, specifying the
rate type (in this case it is 7 for `InterestRate`) and passing the new
authority's public key.

Once we set the new authority, we can attempt to update the interest rate.

```typescript
// Update rate authority and attempt to update interest rate with new authority
try {
  await setAuthority(
    connection,
    payer,
    mint,
    rateAuthority,
    AuthorityType.InterestRate, // Rate type (InterestRate)
    otherAccount.publicKey, // new rate authority,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await updateRateInterestBearingMint(
    connection,
    payer,
    mint,
    otherAccount, // new authority
    10, // updated rate
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  const newRate = await getInterestBearingMint({ connection, mint });

  console.log(
    `✅ - We expected this to pass because the rate can be updated with the new authority. New rate: ${newRate}`,
  );
} catch (error) {
  console.error(
    `You should be able to update the interest with new rate authority.`,
  );
}
```

This is expected to work and the new interest rate should be 10.

Thats it! We've just created an interest bearing token, updated the interest
rate and logged the updated state of the token!

## Challenge

Create your own interest bearing token.
