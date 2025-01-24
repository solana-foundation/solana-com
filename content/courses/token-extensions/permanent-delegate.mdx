---
title: Permanent Delegate
objectives:
  - Create a mint with a permanent delegate
  - Explain the use cases of permanent delegate
  - Experiment with the rules of the extension
description:
  "Create a token than can be permanently transferred or burned by a particular
  account."
---

## Summary

- The permanent delegate holds global ownership over all token accounts
  associated with the mint
- The permanent delegate has unrestricted permissions to transfer and burn
  tokens from any token account of that mint
- This delegate role designates a trusted entity with comprehensive control.
  Common use cases include sanction compliance and revocable access tokens.
- With this level of access, the permanent delegate can carry out high-level
  administrative functions, such as reassigning tokens, managing token supplies,
  and directly implementing specific policies or rules on the token accounts.

## Overview

The `permanent delegate` extension allows a `permanent delegate` for all tokens
of the mint. This means one address is capable of transferring or burning any
token of that mint, from any token account. This makes the extension very
powerful but can also be very risky. It gives a single address complete control
over the token supply. This can be good for things like automatic payments,
recovering drained wallets, and refunds. However, it's a double-edged sword, the
`permanent delegate` could be stolen or abused. In the words of Uncle Ben, "With
great power, comes great responsibility."

Imagine a Solana based AirBnb, where NFTs that use permanent delegate are used
as the keys to unlock the door. When you check-in, the NFT key will be
transferred to you and you'll be able to enjoy your stay. At the end of your
stay, the owner will transfer it back from you to them - since they are the
`permanent delegate`. What happens if your wallet gets drained, or you lose
access to the key? No worries, the owner can transfer the key from any account
back to you! But on the other end, say the owner doesn't want you staying there
anymore, they can revoke it at any time, and you'd be locked out. In this way,
the permanent delegate extension is a double-edged sword.

This all being said - the `permanent delegate` is a very exciting extension that
adds a world of possibilities to Solana tokens.

### Initializing a permanent delegate to mint

Initializing a permanent delegate token involves three instructions:

- `SystemProgram.createAccount`
- `createInitializePermanentDelegateInstruction`
- `createInitializeMintInstruction`

The first instruction `SystemProgram.createAccount` allocates space on the
blockchain for the mint account. This instruction accomplishes three things:

- Allocates space
- Transfers lamports for rent
- Assigns to its owning program

```typescript
SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mint,
  space: mintLen,
  lamports: mintLamports,
  programId: TOKEN_2022_PROGRAM_ID,
}),
```

The second instruction `createInitializePermanentDelegateInstruction`
initializes the permanent delegate extension. The defining argument that
dictates the permanent delegate will be a variable we create named
`permanentDelegate`.

```typescript
createInitializePermanentDelegateInstruction(
  mint,
  permanentDelegate.publicKey,
  TOKEN_2022_PROGRAM_ID,
),
```

The third instruction `createInitializeMintInstruction` initializes the mint.

```typescript
createInitializeMintInstruction(
  mint,
  decimals,
  mintAuthority.publicKey,
  null,
  TOKEN_2022_PROGRAM_ID,
);
```

When the transaction with these three instructions is sent, a new permanent
delegate token is created with the specified configuration.

### Transferring tokens as delegate

The `transferChecked` function enables the permanent delegate to securely
transfer tokens between accounts. This function makes sure that the token
transfer adheres to the mint's configured rules and requires the delegate to
sign the transaction.

```ts
/**
 * Approve a delegate to transfer up to a maximum number of tokens from an account, asserting the token mint and decimals
 *
 * @param connection     Connection to use
 * @param payer          Payer of the transaction fees
 * @param mint           Address of the mint
 * @param account        Address of the account
 * @param delegate       Account authorized to perform a transfer tokens from the source account
 * @param owner          Owner of the source account
 * @param amount         Maximum number of tokens the delegate may transfer
 * @param decimals       Number of decimals in approved amount
 * @param multiSigners   Signing accounts if `owner` is a multisig
 * @param confirmOptions Options for confirming the transaction
 * @param programId      SPL Token program account
 *
 * @return Signature of the confirmed transaction
 */
await transferChecked(
  connection,
  payer,
  bobAccount,
  mint,
  carolAccount,
  permanentDelegate,
  amountToTransfer,
  decimals,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

### Burning tokens as delegate

The `burnChecked` function allows the permanent delegate to burn tokens from any
token account of the mint. This function makes sure that the burn operation
complies with the mint's rules and requires the delegate to sign the
transaction.

```ts
/**
 * Burn tokens from an account, asserting the token mint and decimals
 *
 * @param connection     Connection to use
 * @param payer          Payer of the transaction fees
 * @param account        Account to burn tokens from
 * @param mint           Mint for the account
 * @param owner          Account owner
 * @param amount         Amount to burn
 * @param decimals       Number of decimals in amount to burn
 * @param multiSigners   Signing accounts if `owner` is a multisig
 * @param confirmOptions Options for confirming the transaction
 * @param programId      SPL Token program account
 *
 * @return Signature of the confirmed transaction
 */
await burnChecked(
  connection,
  payer,
  bobAccount,
  mint,
  permanentDelegate,
  amountToBurn,
  decimals,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

### Assign permissions to a new delegate

The `approveChecked` function approves a delegate to transfer or burn up to a
maximum number of tokens from an account. This allows the designated delegate to
perform token transfers on behalf of the account owner up to the specified
limit.

```ts
/**
 * Approve a delegate to transfer up to a maximum number of tokens from an account, asserting the token mint and
 * decimals
 *
 * @param connection     Connection to use
 * @param payer          Payer of the transaction fees
 * @param mint           Address of the mint
 * @param account        Address of the account
 * @param delegate       Account authorized to perform a transfer tokens from the source account
 * @param owner          Owner of the source account
 * @param amount         Maximum number of tokens the delegate may transfer
 * @param decimals       Number of decimals in approved amount
 * @param multiSigners   Signing accounts if `owner` is a multisig
 * @param confirmOptions Options for confirming the transaction
 * @param programId      SPL Token program account
 *
 * @return Signature of the confirmed transaction
 */

// Approve new delegate to perform actions
await approveChecked(
  connection,
  payer,
  mint,
  bobAccount,
  delegate.publicKey,
  bob,
  amountToApprove,
  decimals,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

// Newly assigned delegate can now transfer from an account
await transferChecked(
  connection,
  payer,
  bobAccount,
  mint,
  carolAccount,
  carol,
  amountToTransfer,
  decimals,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

## Lab

In this lab, we'll explore the functionality of the `permanent delegate`
extension by creating a mint account with a permanent delegate and testing
various interactions with token accounts associated with that mint.

#### 1. Setup Environment

To get started, create an empty directory named `permanent-delegate` and
navigate to it. We'll be initializing a brand new project. Run `npm init` and
follow through the prompts.

Next, we'll need to add our dependencies. Run the following to install the
required packages:

```bash
npm i @solana-developers/helpers@2 @solana/spl-token @solana/web3.js@1 esrun
```

Create a directory named `src`. In this directory, create a file named
`index.ts`. This is where we will run checks against the rules of this
extension. Paste the following code in `index.ts`:

```ts
import {
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";

import {
  ExtensionType,
  createInitializeMintInstruction,
  createInitializePermanentDelegateInstruction,
  mintTo,
  createAccount,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  transferChecked,
} from "@solana/spl-token";
import { initializeKeypair } from "@solana-developers/helpers";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);

const mintAuthority = payer;
const mintKeypair = Keypair.generate();
const mint = mintKeypair.publicKey;
const permanentDelegate = payer;

const extensions = [ExtensionType.PermanentDelegate];
const mintLen = getMintLen(extensions);

const decimals = 9;
const amountToMint = 100;
const amountToTransfer = 10;
const amountToBurn = 5;

// Create mint account with permanent delegate

// Create delegate and destination token accounts

// Mint tokens to accounts

// Attempt to transfer with correct delegate

// Attempt to transfer without correct delegate

// Attempt to transfer from one account to another with correct delegate

// Attempt to burn with correct delegate

// Attempt to burn without correct delegate

// Grant permission to an account to transfer tokens from a different token account

// Try to transfer tokens again with Carol as the delegate, overdrawing her allotted control
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

#### 3. Helpers

When we pasted the `index.ts` code from earlier, we added the following helpers:

- `initializeKeypair`: This function creates the keypair for the `payer` and
  also airdrops some SOL to it
- `makeKeypairs`: This function creates keypairs without airdropping any SOL

Additionally we have some initial accounts and variables that will be used to
test the `permanent delegate` extension!

#### 4. Create Mint with permanent delegate

When creating a mint token with default state, we must create the account
instruction, initialize the default account state for the mint account and
initialize the mint itself.

Create an asynchronous function named
`createTokenExtensionMintWithPermanentDelegate` in `src/mint-helper.ts`. This
function will create the mint such that all new mints will be created with a
permanent delegate. The function will take the following arguments:

- `connection`: The connection object
- `payer`: Payer for the transaction
- `mintKeypair`: Keypair for the new mint
- `decimals`: Mint decimals
- `permanentDelegate`: Assigned delegate keypair

The first step in creating a mint is reserving space on Solana with the
`SystemProgram.createAccount` method. This requires specifying the payer's
keypair, (the account that will fund the creation and provide SOL for rent
exemption), the new mint account's public key (`mintKeypair.publicKey`), the
space required to store the mint information on the blockchain, the amount of
SOL (lamports) necessary to exempt the account from rent and the ID of the token
program that will manage this mint account (`TOKEN_2022_PROGRAM_ID`).

```typescript
const extensions = [ExtensionType.PermanentDelegate];
const mintLen = getMintLen(extensions);
const mintLamports =
  await connection.getMinimumBalanceForRentExemption(mintLen);

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mint,
  space: mintLen,
  lamports: mintLamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

After the mint account creation, the next step involves initializing it with a
permanent delegate. The `createInitializePermanentDelegateInstruction` function
is used to generate an instruction that enables the mint to set the permanent
delegate of any new mint accounts.

```typescript
const initializePermanentDelegateInstruction =
  createInitializePermanentDelegateInstruction(
    mint,
    permanentDelegate.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );
```

Next, let's add the mint instruction by calling
`createInitializeMintInstruction` and passing in the required arguments. This
function is provided by the SPL Token package and it constructs a transaction
instruction that initializes a new mint.

```typescript
const initializeMintInstruction = createInitializeMintInstruction(
  mint,
  decimals,
  mintAuthority.publicKey, // Designated Mint Authority
  null, // No Freeze Authority
  TOKEN_2022_PROGRAM_ID,
);
```

Lastly, let's add all of the instructions to a transaction and send it to the
blockchain:

```typescript
const transaction = new Transaction().add(
  createAccountInstruction,
  initializePermanentDelegateInstruction,
  initializeMintInstruction,
);

return await sendAndConfirmTransaction(connection, transaction, [
  payer,
  mintKeypair,
]);
```

Putting it all together, the final `src/mint-helper.ts` file will look like
this:

```ts
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  createInitializePermanentDelegateInstruction,
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
 * Creates the mint with a permanent delegate
 * @param connection
 * @param payer
 * @param mintKeypair
 * @param decimals
 * @param permanentDelegate
 * @returns signature of the transaction
 */
export async function createTokenExtensionMintWithPermanentDelegate(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number = 2,
  permanentDelegate: Keypair,
): Promise<string> {
  const mintAuthority = payer;
  const mint = mintKeypair.publicKey;

  const extensions = [ExtensionType.PermanentDelegate];
  const mintLen = getMintLen(extensions);
  const mintLamports =
    await connection.getMinimumBalanceForRentExemption(mintLen);
  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint,
    space: mintLen,
    lamports: mintLamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  const initializePermanentDelegateInstruction =
    createInitializePermanentDelegateInstruction(
      mint,
      permanentDelegate.publicKey,
      TOKEN_2022_PROGRAM_ID,
    );

  const initializeMintInstruction = createInitializeMintInstruction(
    mint,
    decimals,
    mintAuthority.publicKey, // Designated Mint Authority
    null, // No Freeze Authority
    TOKEN_2022_PROGRAM_ID,
  );

  const transaction = new Transaction().add(
    createAccountInstruction,
    initializePermanentDelegateInstruction,
    initializeMintInstruction,
  );

  return await sendAndConfirmTransaction(connection, transaction, [
    payer,
    mintKeypair,
  ]);
}
```

#### 6. Create printBalances function

We're going to be creating multiple tests that modify a token account's balance.
To make it easier to follow along we should probably create a utility function
that prints all token account balances.

At the bottom of the `src/index.ts` file add the following `printBalances`
function:

```typescript
async function printBalances(
  connection: Connection,
  tokenAccounts: PublicKey[],
  names: string[],
) {
  if (tokenAccounts.length !== names.length)
    throw new Error("Names needs to be one to one with accounts");

  for (let i = 0; i < tokenAccounts.length; i++) {
    const tokenInfo = await getAccount(
      connection,
      tokenAccounts[i],
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    console.log(`${names[i]}: ${tokenInfo.amount}`);
  }
}
```

#### 7. Test Setup

Now that we have the ability to create a mint with a permanent delegate for all
of its new mint accounts, let's write some tests to see how it functions.

#### 7.1 Create Mint with Permanent Delegate

Let's first create a mint with `payer` as the permanent delegate. To do this we
call the `createTokenExtensionMintWithPermanentDelegate` function we just
created in our `index.ts` file:

```ts
// Create mint account with permanent delegate
await createTokenExtensionMintWithPermanentDelegate(
  connection,
  payer, // Also known as alice
  mintKeypair,
  decimals,
  defaultState,
);
```

#### 7.2 Create Test Token Accounts

Now, let's create three new Token accounts to test with. We can accomplish this
by calling the `createAccount` helper provided by the SPL Token library. We will
use the keypairs we generated at the beginning: `alice`, `bob`, and `carol`.

In this lab, `alice` will be the permanent delegate.

```typescript
// Create delegate and destination token accounts
const aliceAccount = await createAccount(
  connection,
  payer,
  mint,
  alice.publicKey,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const bobAccount = await createAccount(
  connection,
  payer,
  mint,
  bob.publicKey,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

const carolAccount = await createAccount(
  connection,
  payer,
  mint,
  carol.publicKey,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

#### 7.3 Mint tokens to accounts

In the previous step, we created the 3 accounts we need to test the
`permanent delegate` extension. Next, we need to mint tokens to those accounts
before we write the tests.

Add the `tokenAccounts` and `names` variables and then create a for loop that
iterates over each account and mints 100 tokens to each account. Call the
`printBalances` function so we can display the token balance of each account:

```typescript
// Mint tokens to accounts
const tokenAccounts = [aliceAccount, bobAccount, carolAccount];
const names = ["Alice", "Bob", "Carol"];

for (const holder of tokenAccounts) {
  await mintTo(
    connection,
    payer,
    mint,
    holder,
    mintAuthority,
    amountToMint,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
}

console.log("Initial Balances: ");
await printBalances(connection, tokenAccounts, names);
```

Start your local validator and run `npx esrun src/index.ts`. You should see the
following in your terminal, indicating that our token accounts have had tokens
minted to them:

```bash
Initial Balances:
Alice: 100
Bob: 100
Carol: 100
```

#### 8. Tests

Now let's write some tests to show the interactions that can be had with the
`permanent delegate` extension.

We'll write the following tests:

1. **Attempt to Transfer with Correct Delegate:**

   - Have Alice transfer tokens from Bob's account to herself successfully since
     she is the permanent delegate.
   - Print balances to verify the transfer.

2. **Attempt to Transfer without Correct Delegate:**

   - Have Bob attempt to transfer tokens from Alice's account to himself (expect
     this to fail since Bob isn't authorized).
   - Print balances to verify the failure.

3. **Attempt to Transfer from One Account to Another with Correct Delegate:**

   - Have Alice transfer tokens from Bob's account to Carol's account.
   - Print balances to verify the transfer.

4. **Attempt to Burn with Correct Delegate:**

   - Have Alice burn tokens from Bob's account successfully since she is the
     permanent delegate.
   - Print balances to verify the burning.

5. **Attempt to Burn without Correct Delegate:**

   - Have Bob attempt to burn tokens from Carol's account (expect this to fail
     since Bob isn't authorized).
   - Print balances to verify the failure.

6. **Grant Permission to an Account to Transfer Tokens from a Different Token
   Account:**

   - Approve Carol to transfer tokens from Bob's account to herself.
   - Transfer tokens from Bob's account to Carol's account.
   - Print balances to verify the transfer.

7. **Try to Transfer Tokens Again with Carol as the Delegate, Overdrawing Her
   Allotted Control:**
   - Attempt to transfer tokens from Bob's account to Carol's account with Carol
     again, but overdraw her allotted control (expect this to fail).

#### 8.1 Transfer tokens with the correct delegate

In this test, `alice` attempts to transfer tokens from `bob` to herself. This
test is expected to pass as `alice` is the permanent delegate and has control
over the token accounts of that mint.

To do this, let's wrap a `transferChecked` function in a `try catch` and print
out the balances of our accounts:

```typescript
// Attempt to transfer with correct delegate
{
  // Have Alice transfer tokens from Bob to herself ( Will Succeed )
  try {
    await transferChecked(
      connection,
      payer,
      bobAccount,
      mint,
      aliceAccount,
      alice,
      amountToTransfer,
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    console.log(
      "✅ Since Alice is the permanent delegate, she has control over all token accounts of this mint",
    );
    await printBalances(connection, tokenAccounts, names);
  } catch (error) {
    console.log("Alice should be able to transfer Bob's tokens to Alice");
  }
}
```

Test this by running the script:

```bash
npx esrun src/index.ts
```

We should see the following error logged out in the terminal, meaning the
extension is working as intended.
`✅ Since Alice is the permanent delegate, she has control over all token accounts of this mint`

#### 8.2 Transfer tokens with incorrect delegate

In this test, `bob` is going to try to transfer tokens from `alice` to himself.
Given that `bob` is not the permanent delegate, the attempt won't be successful.

Similar to the previous test we can create this test by calling
`transferChecked` and then printing the balances:

```typescript
// Attempt to transfer without correct delegate
{
  // Have Bob try to transfer tokens from Alice to himself ( Will Fail )
  try {
    await transferChecked(
      connection,
      payer,
      aliceAccount, // transfer from
      mint,
      bobAccount,
      bob, // incorrect delegate
      amountToTransfer,
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    console.log("Bob should not be able to transfer tokens");
  } catch (error) {
    console.log(
      "✅ We expect this to fail because Bob does not have authority over Alice's funds",
    );
    await printBalances(connection, tokenAccounts, names);
  }
}
```

Go ahead and run the script, the transaction should fail.

```bash
npx esrun src/index.ts
```

#### 8.3 Transfer from one account to another with the correct delegate

Lets use the power of the permanent delegate extension to have `alice` transfer
some tokens from `bob` to `carol`.

We expect this test to succeed. Remember, the permanent delegate has control
over **all** token accounts of the mint.

To test this, let's wrap a `transferChecked` function in a `try catch` and print
the balances:

```typescript
// Attempt to transfer from one account to another with correct delegate
{
  // Have Alice transfer tokens from Bob to Carol
  try {
    await transferChecked(
      connection,
      payer,
      bobAccount, // transfer from
      mint,
      carolAccount, // transfer to
      alice,
      amountToTransfer,
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    console.log(
      "✅ Since Alice is the permanent delegate, she has control and can transfer Bob's tokens to Carol",
    );
    await printBalances(connection, tokenAccounts, names);
  } catch (error) {
    console.log("Alice should be able to transfer Bob's tokens to Alice");
  }
}
```

In our first test we wrote, `bob` had 10 of his tokens transferred to `carol`.
Up until this point `bob` has 90 tokens remaining. Run the test and see the
results. You will notice that `bob` now has 80 tokens:

```bash
npx esrun src/index.ts
```

#### 8.4 Burn with correct delegate

Now let's try and burn some of the tokens from `bob`. This test is expected to
pass.

We'll do this by calling `burnChecked` and then printing out the balances:

```typescript
// Attempt to burn with correct delegate
{
  // Have Alice burn Bob's tokens
  try {
    await burnChecked(
      connection,
      payer,
      bobAccount,
      mint,
      alice, // correct permanent delegate
      amountToBurn, // in this case is 5
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    console.log(
      "✅ Since Alice is the permanent delegate, she has control and can burn Bob's tokens",
    );
    await printBalances(connection, tokenAccounts, names);
  } catch (error) {
    console.error("Alice should be able to burn Bob's tokens");
  }
}
```

Run the tests again:

```bash
npx esrun src/index.ts
```

Bob had 5 tokens burned and now only has 75 tokens. Poor Bob!

#### 8.5 Burn with incorrect delegate

Let's try and burn tokens from an account using the incorrect delegate. This is
expected to fail as `bob` doesn't have any control over the token accounts.

```typescript
// Attempt to burn without correct delegate
{
  // Have Bob try to burn tokens from Carol ( Will Fail )
  try {
    await burnChecked(
      connection,
      payer,
      carolAccount,
      mint,
      bob, // wrong permanent delegate
      amountToBurn,
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    await printBalances(connection, tokenAccounts, names);
    console.error("Bob should not be able to burn the tokens");
  } catch (error) {
    console.log(
      "✅ We expect this to fail since Bob is not the permanent delegate and has no control over the tokens",
    );
  }
}
```

Run `npm start`. You will see the following message, indicating that the
extension is working as intended:
`✅ We expect this to fail since Bob is not the permanent delegate and has no control over the tokens`

#### 8.6. Assign delegate permissions to Carol and transfer

With the `permanent delegate` extension, the initial delegate can grant a token
account permission to hold a certain level of control over the mint tokens. In
this case, `alice` will allow `carol` to transfer some of the tokens from `bob`
account to herself.

For this to work we will need to set some boundaries for `carol`. Using the
`approveChecked` function provided by the SPL Library, we can set the maximum
number of tokens that can be transferred or burned by `carol`. This ensures that
she can only transfer a specified amount, protecting the overall balance from
excessive or unauthorized transfers.

Add the following test:

```typescript
// Grant permission to an account to transfer tokens from a different token account
{
  // Approve Carol to transfer Bob's tokens to herself
  await approveChecked(
    connection,
    payer,
    mint,
    bobAccount,
    carol.publicKey,
    bob,
    amountToTransfer, // maximum amount to transfer
    decimals,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await transferChecked(
    connection,
    payer,
    bobAccount,
    mint,
    carolAccount,
    carol,
    amountToTransfer,
    decimals,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  console.log(
    "✅ Since Alice is the permanent delegate, she can allow Carol to transfer Bob's tokens to Carol",
  );
  await printBalances(connection, tokenAccounts, names);
}
```

Run the tests again. You will notice that `bob` now only has 65 tokens as
`carol` has just transferred 10 of his tokens to herself:
`npx esrun src/index.ts`

#### 8.7. Attempt to transfer again

In the previous test, we approved `carol` to be able to transfer 10 tokens to
herself. This means that she has reached the maximum amount of tokens to send
from another account. Let's write a test and attempt to transfer another 10
tokens to herself. This is expected to fail.

```typescript
// Try to transfer tokens again with Carol as the delegate, overdrawing her allotted control
{
  // Try to transfer again with Carol as the delegate overdrawing her allotted control
  try {
    await transferChecked(
      connection,
      payer,
      bobAccount,
      mint,
      carolAccount,
      carol, // Owner - whoever has the authority to transfer tokens on behalf of the destination account
      amountToTransfer,
      decimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
  } catch (e) {
    console.log(
      `✅ We expect this to fail since Carol already transferred ${amountToTransfer} tokens and has no more allotted`,
    );
  }
}
```

Run the tests one last time and you will see this message, meaning that the
`✅ We expect this to fail since Carol already transferred 10 tokens and has no more allotted`

Thats it! You've just created a mint account with a permanent delegate and
tested that the functionality all works!

## Challenge

Create your own mint account with a permanent delegate.
