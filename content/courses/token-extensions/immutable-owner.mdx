---
title: Immutable Owner
objectives:
  - Create token accounts with an immutable owner
  - Explain the use cases of the immutable owner extension
  - Experiment with the rules of the extension
description:
  "Make a token that ensures the account storing the tokens cannot change owner."
---

## Summary

- The `immutable owner` extension ensures that once a token account is created,
  its owner is unchangeable, securing the ownership against any modifications.
- Token accounts with this extension can have only one permanent state regarding
  ownership: **Immutable**.
- Associated Token Accounts (ATAs) have the `immutable owner` extension enabled
  by default.
- The `immutable owner` extension is a token account extension; enabled on each
  token account, not the mint.

## Overview

Associated Token Accounts (ATAs) are uniquely determined by the owner and the
mint, streamlining the process of identifying the correct Token Account for a
specific owner. Initially, any token account could change its owner, even ATAs.
This led to security concerns, as users could mistakenly send funds to an
account no longer owned by the expected recipient. This can unknowingly lead to
the loss of funds should the owner change.

The `immutable owner` extension, which is automatically applied to ATAs,
prevents any changes in ownership. This extension can also be enabled for new
Token Accounts created through the Token Extensions Program, guaranteeing that
once ownership is set it is permanent. This secures accounts against
unauthorized access and transfer attempts.

It is important to note that this extension is a Token Account extension,
meaning it's on the token account, not the mint.

### Creating token account with immutable owner

All Token Extensions Program ATAs have immutable owners enabled by default. If
you want to create an ATA you may use `createAssociatedTokenAccount`.

Outside of ATAs, which enable the immutable owner extension by default, you can
enable it manually on any Token Extensions Program token account.

Initializing a token account with immutable owner involves three instructions:

- `SystemProgram.createAccount`
- `createInitializeImmutableOwnerInstruction`
- `createInitializeAccountInstruction`

Note: We are assuming a mint has already been created.

The first instruction `SystemProgram.createAccount` allocates space on the
blockchain for the token account. This instruction accomplishes three things:

- Allocates `space`
- Transfers `lamports` for rent
- Assigns to its owning program

```typescript
const tokenAccountKeypair = Keypair.generate();
const tokenAccount = tokenAccountKeypair.publicKey;
const extensions = [ExtensionType.ImmutableOwner];

const tokenAccountLen = getAccountLen(extensions);
const lamports =
  await connection.getMinimumBalanceForRentExemption(tokenAccountLen);

const createTokenAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: tokenAccount,
  space: tokenAccountLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

The second instruction `createInitializeImmutableOwnerInstruction` initializes
the immutable owner extension.

```typescript
const initializeImmutableOwnerInstruction =
  createInitializeImmutableOwnerInstruction(
    tokenAccount,
    TOKEN_2022_PROGRAM_ID,
  );
```

The third instruction `createInitializeAccountInstruction` initializes the token
account.

```typescript
const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccount,
  mint,
  owner.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

Lastly, add all of these instructions to a transaction and send it to the
blockchain.

```ts
const transaction = new Transaction().add(
  createTokenAccountInstruction,
  initializeImmutableOwnerInstruction,
  initializeAccountInstruction,
);

transaction.feePayer = payer.publicKey;

return await sendAndConfirmTransaction(connection, transaction, [
  payer,
  owner,
  tokenAccountKeypair,
]);
```

When the transaction with these three instructions is sent, a new token account
is created with the immutable owner extension.

## Lab

In this lab, we'll be creating a token account with an immutable owner. We'll
then write tests to check if the extension is working as intended by attempting
to transfer ownership of the token account.

#### 1. Setup Environment

To get started, create an empty directory named `immutable-owner` and navigate
to it. We'll be initializing a brand new project. Run `npm init -y` to make a
project with defaults.

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
  AuthorityType,
  TOKEN_2022_PROGRAM_ID,
  createMint,
  setAuthority,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { initializeKeypair, makeKeypairs } from "@solana-developers/helpers";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const payer = await initializeKeypair(connection);

const [otherOwner, mintKeypair, ourTokenAccountKeypair] = makeKeypairs(3);
const ourTokenAccount = ourTokenAccountKeypair.publicKey;
```

#### 2. Run validator node

For the sake of this guide, we'll be running our own validator node.

In a separate terminal, run the following command: `solana-test-validator`. This
will run the node and also log out some keys and values. The value we need to
retrieve and use in our connection is the JSON RPC URL, which in this case is
`http://127.0.0.1:8899`. We then use that in the connection to specify to use of
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
  also airdrops 2 testnet SOL to it
- `makeKeypairs`: This function creates keypairs without airdropping any SOL

Additionally, we have some initial accounts:

- `payer`: Used to pay for and be the authority for everything
- `mintKeypair`: Our mint
- `ourTokenAccountKeypair`: The token account owned by the payer that we'll use
  for testing
- `otherOwner`: The token account we'll try to transfer ownership of the two
  immutable accounts to

#### 4. Create mint

Let's create the mint we'll be using for our token accounts.

Inside of `src/index.ts`, the required dependencies will already be imported,
along with the aforementioned accounts. Add the following `createMint` function
beneath the existing code:

```typescript
// CREATE MINT
const mint = await createMint(
  connection,
  payer,
  mintKeypair.publicKey,
  null,
  2,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

#### 5. Create Token Account with immutable owner

Remember, all ATAs come with the `immutable owner` extension. However, we're
going to create a token account using a keypair. This requires us to create the
account, initialize the immutable owner extension, and initialize the account.

Inside the `src` directory, create a new file named `token-helper.ts` and create
a new function within it called `createTokenAccountWithImmutableOwner`. This
function is where we'll be creating the associated token account with the
immutable owner. The function will take the following arguments:

- `connection`: The connection object
- `mint`: Public key for the new mint
- `payer`: Payer for the transaction
- `owner`: Owner of the associated token account
- `tokenAccountKeypair`: The token account keypair associated with the token
  account

```ts
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeAccountInstruction,
  createInitializeImmutableOwnerInstruction,
  getAccountLen,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export async function createTokenAccountWithImmutableOwner(
  connection: Connection,
  mint: PublicKey,
  payer: Keypair,
  owner: Keypair,
  tokenAccountKeypair: Keypair,
): Promise<string> {
  // Create account instruction

  // Enable immutable owner instruction

  // Initialize account instruction

  // Send to blockchain

  return "TODO Replace with signature";
}
```

The first step in creating the token account is reserving space on Solana with
the **`SystemProgram.createAccount`** method. This requires specifying the
payer's keypair, (the account that will fund the creation and provide SOL for
rent exemption), the new token account's public key
(`tokenAccountKeypair.publicKey`), the space required to store the token
information on the blockchain, the amount of SOL (lamports) necessary to exempt
the account from rent and the ID of the token program that will manage this
token account (**`TOKEN_2022_PROGRAM_ID`**).

```typescript
// CREATE ACCOUNT INSTRUCTION
const tokenAccount = tokenAccountKeypair.publicKey;

const extensions = [ExtensionType.ImmutableOwner];

const tokenAccountLen = getAccountLen(extensions);
const lamports =
  await connection.getMinimumBalanceForRentExemption(tokenAccountLen);

const createTokenAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: tokenAccount,
  space: tokenAccountLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

After the token account creation, the next instruction initializes the
`immutable owner` extension. The `createInitializeImmutableOwnerInstruction`
function is used to generate this instruction.

```typescript
// ENABLE IMMUTABLE OWNER INSTRUCTION
const initializeImmutableOwnerInstruction =
  createInitializeImmutableOwnerInstruction(
    tokenAccount,
    TOKEN_2022_PROGRAM_ID,
  );
```

We then add the initialize account instruction by calling
`createInitializeAccountInstruction` and passing in the required arguments. This
function is provided by the SPL Token package and it constructs a transaction
instruction that initializes a new token account.

```typescript
// INITIALIZE ACCOUNT INSTRUCTION
const initializeAccountInstruction = createInitializeAccountInstruction(
  tokenAccount,
  mint,
  owner.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

Now that the instructions have been created, the token account can be created
with an immutable owner.

```typescript
// SEND TO BLOCKCHAIN
const transaction = new Transaction().add(
  createTokenAccountInstruction,
  initializeImmutableOwnerInstruction,
  initializeAccountInstruction,
);

transaction.feePayer = payer.publicKey;

const signature = await sendAndConfirmTransaction(connection, transaction, [
  payer,
  owner,
  tokenAccountKeypair,
]);

return signature;
```

Now that we've added the functionality for `token-helper`, we can create our
test token accounts. One of the two test token accounts will be created by
calling `createTokenAccountWithImmutableOwner`. The other will be created with
the baked-in SPL helper function `createAssociatedTokenAccount`. This helper
will create an associated token account which by default includes an immutable
owner. For the sake of this guide, we'll be testing against both of these
approaches.

Back in `index.ts` underneath the mint variable, create the following two token
accounts:

```
// CREATE TEST TOKEN ACCOUNTS: Create explicitly with immutable owner instructions
const createOurTokenAccountSignature = await createTokenAccountWithImmutableOwner(
  connection,
  mint,
  payer,
  payer,
  ourTokenAccountKeypair
);

// CREATE TEST TOKEN ACCOUNTS: Create an associated token account with default immutable owner
const associatedTokenAccount = await createAssociatedTokenAccount(
  connection,
  payer,
  mint,
  payer.publicKey,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);
```

That's it for the token accounts! Now we can move on and start testing that the
extension rules are applied correctly by running a few tests against it.

If you'd like to test that everything is working, feel free to run the script.

```bash
npx esrun src/index.ts
```

#### 6. Tests

**Test trying to transfer owner**

The first token account that is being created is the account is tied to
`ourTokenAccountKeypair`. We'll be attempting to transfer ownership of the
account to `otherOwner` which was generated earlier. This test is expected to
fail as the new authority is not the owner of the account upon creation.

Add the following code to your `src/index.ts` file:

```typescript
// TEST TRANSFER ATTEMPT ON IMMUTABLE ACCOUNT
try {
  await setAuthority(
    connection,
    payer,
    ourTokenAccount,
    payer.publicKey,
    AuthorityType.AccountOwner,
    otherOwner.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  console.error("You should not be able to change the owner of the account.");
} catch (error) {
  console.log(
    `✅ - We expected this to fail because the account is immutable, and cannot change owner.`,
  );
}
```

We can now invoke the `setAuthority` function by running
`npx esrun src/index.ts`. We should see the following error logged out in the
terminal, meaning the extension is working as we need it to:
`✅ - We expected this to fail because the account is immutable, and cannot change owner.`

**Test trying to transfer owner with associated token account**

This test will attempt to transfer ownership to the Associated Token Account.
This test is also expected to fail as the new authority is not the owner of the
account upon creation.

Below the previous test, add the following try/catch:

```typescript
// TEST TRANSFER ATTEMPT ON ASSOCIATED IMMUTABLE ACCOUNT
try {
  await setAuthority(
    connection,
    payer,
    associatedTokenAccount,
    payer.publicKey,
    AuthorityType.AccountOwner,
    otherOwner.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  console.error("You should not be able to change the owner of the account.");
} catch (error) {
  console.log(
    `✅ - We expected this to fail because the associated token account is immutable, and cannot change owner.`,
  );
}
```

Now we can run `npx esrun src/index.ts`. This test should log a failure message
similar to the one from the previous test. This means that both of our token
accounts are in fact immutable and working as intended.

Congratulations! We've just created token accounts and tested the immutable
owner extension! If you are stuck at any point, you can find the working code on
the `solution` branch of
[this repository](https://github.com/Unboxed-Software/solana-lab-immutable-owner/tree/solution).

## Challenge

Go create your own token account with an immutable owner.
