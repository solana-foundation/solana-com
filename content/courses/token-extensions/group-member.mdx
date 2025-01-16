---
title: Group, Group Pointer, Member, Member Pointer
objectives:
  - Create an NFT collection using the group, group pointer, member, and member
    pointer extensions.
  - Update the authority and max size of a group.
description: "Make an NFT collection using token extensions."
---

## Summary

- 'token groups' are commonly used to implement NFT collections.
- The `group pointer` extension sets a group account on the token mint, to hold
  token group information.
- The `group` extension allows us to save group data within the mint itself.
- The `member pointer` extension sets an individual member account on the token
  mint, to hold information about the token's membership within a group.
- The `member` extension allows us to save member data within the mint itself.

## Overview

SPL tokens are valuable alone but can be combined for extra functionality. We
can do this in the Token Extensions Program by combining the `group`,
`group pointer`, `member`, and `member pointer` extensions. The most common use
case for these extensions is to create a collection of NFTs.

To create a collection of NFTs we need two parts: the "collection" NFT and all
of the NFTs within the collection. We can do this entirely using token
extensions. The "collection" NFT can be a single mint combining the `metadata`,
`metadata pointer`, `group`, and `group pointer` extensions. And then each
individual NFT within the collection can be an array of mints combining the
`metadata`, `metadata pointer`, `member`, and `member pointer` extensions.

Although NFT collections are a common use-case, groups and members can be
applied to any token type.

A quick note on `group pointer` vs `group`. The `group pointer` extension saves
the address of any onchain account that follows to the
[Token-Group Interface](https://github.com/solana-labs/solana-program-library/tree/master/token-group/interface).
While the `group` extension saves the Token-Group Interface data directly within
the mint account. Generally, these are used together where the `group pointer`
points to the mint itself. The same is true for `member pointer` vs `member`,
but with the member data.

NOTE: A group can have many members, but a member can only belong to one group.

### Group and Group Pointer

The `group` and `group pointer` extensions define a token group. The onchain
data is as follows:

- `update_authority`: The authority that can sign to update the group.
- `mint`: The mint of the group token.
- `size`: The current number of group members.
- `max_size`: The maximum number of group members.

```rust
type OptionalNonZeroPubkey = Pubkey; // if all zeroes, interpreted as `None`
type PodU32 = [u8; 4];
type Pubkey = [u8; 32];

/// Type discriminant: [214, 15, 63, 132, 49, 119, 209, 40]
/// First 8 bytes of `hash("spl_token_group_interface:group")`
pub struct TokenGroup {
    /// The authority that can sign to update the group
    pub update_authority: OptionalNonZeroPubkey,
    /// The associated mint, used to counter spoofing to be sure that group
    /// belongs to a particular mint
    pub mint: Pubkey,
    /// The current number of group members
    pub size: PodU32,
    /// The maximum number of group members
    pub max_size: PodU32,
}
```

#### Creating a mint with group and group pointer

Creating a mint with the `group` and `group pointer` involves four instructions:

- `SystemProgram.createAccount`
- `createInitializeGroupPointerInstruction`
- `createInitializeMintInstruction`
- `createInitializeGroupInstruction`

The first instruction `SystemProgram.createAccount` allocates space on the
blockchain for the mint account. However like all Token Extensions Program
mints, we need to calculate the size and cost of the mint. This can be
accomplished by using `getMintLen` and `getMinimumBalanceForRentExemption`. In
this case, we'll call `getMintLen` with only the `ExtensionType.GroupPointer`.
Then we add `TOKEN_GROUP_SIZE` to the mint length to account for the group data.

To get the mint length and create account instruction, do the following:

```ts
// get mint length
const extensions = [ExtensionType.GroupPointer];
const mintLength = getMintLen(extensions) + TOKEN_GROUP_SIZE;

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

The second instruction `createInitializeGroupPointerInstruction` initializes the
group pointer. It takes the mint, optional authority that can set the group
address, address that holds the group and the owning program as it's arguments.

```ts
const initializeGroupPointerInstruction =
  createInitializeGroupPointerInstruction(
    mintKeypair.publicKey,
    payer.publicKey,
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
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

The fourth instruction `createInitializeGroupInstruction` actually initializes
the group and stores the configuration on the group account.

```ts
const initializeGroupInstruction = createInitializeGroupInstruction({
  group: mintKeypair.publicKey,
  maxSize: maxMembers,
  mint: mintKeypair.publicKey,
  mintAuthority: payer.publicKey,
  programId: TOKEN_2022_PROGRAM_ID,
  updateAuthority: payer.publicKey,
});
```

Finally, we add the instructions to the transaction and submit it to the Solana
network.

```ts
const mintTransaction = new Transaction().add(
  createAccountInstruction,
  initializeGroupPointerInstruction,
  initializeMintInstruction,
  initializeGroupInstruction,
);

const signature = await sendAndConfirmTransaction(
  connection,
  mintTransaction,
  [payer, mintKeypair],
  { commitment: "finalized" },
);
```

### Update group authority

To update the authority of a group, we just need the
`tokenGroupUpdateGroupAuthority` function.

```ts
import { tokenGroupUpdateGroupAuthority } from "@solana/spl-token";

const signature = await tokenGroupUpdateGroupAuthority(
  connection, //connection - Connection to use
  payer, // payer - Payer for the transaction fees
  mint.publicKey, // mint - Group mint
  oldAuthority, // account - Public key of the old update authority
  newAuthority, // account - Public key of the new update authority
  undefined, // multiSigners - Signing accounts if `authority` is a multisig
  { commitment: "finalized" }, // confirmOptions - Options for confirming thr transaction
  TOKEN_2022_PROGRAM_ID, // programId - SPL Token program account
);
```

### Update max size of a group

To update the max size of a group we just need the
`tokenGroupUpdateGroupMaxSize` function.

```ts
import { tokenGroupUpdateGroupMaxSize } from "@solana/spl-token";

const signature = tokenGroupUpdateGroupMaxSize(
  connection, //connection - Connection to use
  payer, // payer - Payer for the transaction fees
  mint.publicKey, // mint - Group mint
  updateAuthority, // account - Update authority of the group
  4, // maxSize - new max size of the group
  undefined, // multiSigners — Signing accounts if `authority` is a multisig
  { commitment: "finalized" }, // confirmOptions - Options for confirming thr transaction
  TOKEN_2022_PROGRAM_ID, // programId - SPL Token program account
);
```

### Member and Member Pointer

The `member` and `member pointer` extensions define a token member. The onchain
data is as follows:

- `mint`: The mint of the member token.
- `group`: The address of the group account.
- `member_number`: The member number (index within the group).

```rust
/// Type discriminant: [254, 50, 168, 134, 88, 126, 100, 186]
/// First 8 bytes of `hash("spl_token_group_interface:member")`
pub struct TokenGroupMember {
    /// The associated mint, used to counter spoofing to be sure that member
    /// belongs to a particular mint
    pub mint: Pubkey,
    /// The pubkey of the `TokenGroup`
    pub group: Pubkey,
    /// The member number
    pub member_number: PodU32,
}
```

#### Creating a mint with member pointer

Creating a mint with the `member pointer` and `member` extensions involves four
instructions:

- `SystemProgram.createAccount`
- `createInitializeGroupMemberPointerInstruction`
- `createInitializeMintInstruction`
- `createInitializeMemberInstruction`

The first instruction `SystemProgram.createAccount` allocates space on the
blockchain for the mint account. However, like all Token Extensions Program
mints, we need to calculate the size and cost of the mint. This can be
accomplished by using `getMintLen` and `getMinimumBalanceForRentExemption`. In
this case, we'll call `getMintLen` with the `ExtensionType.GroupMemberPointer`.
Then we have to add `TOKEN_GROUP_MEMBER_SIZE` to the mint length to account for
the member data.

To get the mint length and create account instruction, do the following:

```ts
// get mint length
const extensions = [ExtensionType.GroupMemberPointer];
const mintLength = getMintLen(extensions) + TOKEN_GROUP_MEMBER_SIZE;

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

The second instruction `createInitializeGroupMemberPointerInstruction`
initializes the group member pointer. It takes the mint, optional authority that
can set the group address, address that holds the group, and the owning program
as its arguments.

```ts
const initializeGroupMemberPointerInstruction =
  createInitializeGroupMemberPointerInstruction(
    mintKeypair.publicKey,
    payer.publicKey,
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
  payer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);
```

The fourth instruction `createInitializeMemberInstruction` actually initializes
the member and stores the configuration on the member account. This function
takes the group address as an argument and associates the member with that
group.

```ts
const initializeMemberInstruction = createInitializeMemberInstruction({
  group: groupAddress,
  groupUpdateAuthority: payer.publicKey,
  member: mintKeypair.publicKey,
  memberMint: mintKeypair.publicKey,
  memberMintAuthority: payer.publicKey,
  programId: TOKEN_2022_PROGRAM_ID,
});
```

Finally, we add the instructions to the transaction and submit it to the Solana
network.

```ts
const mintTransaction = new Transaction().add(
  createAccountInstruction,
  initializeGroupMemberPointerInstruction,
  initializeMintInstruction,
  initializeMemberInstruction,
);

const signature = await sendAndConfirmTransaction(
  connection,
  mintTransaction,
  [payer, mintKeypair],
  { commitment: "finalized" },
);
```

### Fetch group and member data

#### Get group pointer state

To retrieve the state of the `group pointer` for a mint, we need to fetch the
account using `getMint` and then parse this data using the
`getGroupPointerState` function. This returns us the `GroupPointer` struct.

```ts
/** GroupPointer as stored by the program */
export interface GroupPointer {
  /** Optional authority that can set the group address */
  authority: PublicKey | null;
  /** Optional account address that holds the group */
  groupAddress: PublicKey | null;
}
```

To get the `GroupPointer` data, call the following:

```ts
const groupMint = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);

const groupPointerData: GroupPointer = getGroupPointerState(groupMint);
```

#### Get group state

To retrieve the group state for a mint, we need to fetch the account using
`getMint` and then parse this data using the `getTokenGroupState` function. This
returns the `TokenGroup` struct.

```ts
export interface TokenGroup {
  /** The authority that can sign to update the group */
  updateAuthority?: PublicKey;
  /** The associated mint, used to counter spoofing to be sure that group belongs to a particular mint */
  mint: PublicKey;
  /** The current number of group members */
  size: number;
  /** The maximum number of group members */
  maxSize: number;
}
```

To get the `TokenGroup` data, call the following:

```ts
const groupMint = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);

const groupData: TokenGroup = getTokenGroupState(groupMint);
```

#### Get group member pointer state

To retrieve the `member pointer` state for a mint, we fetch the mint with
`getMint` and then parse with `getGroupMemberPointerState`. This returns us the
`GroupMemberPointer` struct.

```ts
/** GroupMemberPointer as stored by the program */
export interface GroupMemberPointer {
  /** Optional authority that can set the member address */
  authority: PublicKey | null;
  /** Optional account address that holds the member */
  memberAddress: PublicKey | null;
}
```

To get the `GroupMemberPointer` data, call the following:

```ts
const memberMint = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);

const memberPointerData = getGroupMemberPointerState(memberMint);
```

#### Get group member state

To retrieve a mint's `member` state, we fetch the mint with `getMint` and then
parse with `getTokenGroupMemberState`. This returns the `TokenGroupMember`
struct.

```ts
export interface TokenGroupMember {
  /** The associated mint, used to counter spoofing to be sure that member belongs to a particular mint */
  mint: PublicKey;
  /** The pubkey of the `TokenGroup` */
  group: PublicKey;
  /** The member number */
  memberNumber: number;
}
```

To get the `TokenGroupMember` data, call the following:

```ts
const memberMint = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);
const memberData = getTokenGroupMemberState(memberMint);
```

## Lab

In this lab we'll create a Cool Cats NFT collection using the `group`,
`group pointer`, `member` and `member pointer` extensions in conjunction with
the `metadata` and `metadata pointer` extensions.

The Cool Cats NFT collection will have a group NFT with three member NFTs within
it.

#### 1. Getting started

To get started, clone
[this](https://github.com/Unboxed-Software/solana-lab-group-member) repository's
`starter` branch.

```bash
git clone https://github.com/Unboxed-Software/solana-lab-group-member.git
cd solana-lab-group-member
git checkout starter
npm install
```

The `starter` code comes with:

- `index.ts`: creates a connection object and calls `initializeKeypair`. This is
  where we will write our script.
- `assets`: folder which contains the image for our NFT collection.
- `helper.ts`: helper functions for uploading metadata.

#### 2. Run validator node

For the sake of this guide, we'll be running our own validator node.

In a separate terminal, run the following command: `solana-test-validator`. This
will run the node and also log out some keys and values. The value we need to
retrieve and use in our connection is the JSON RPC URL, which in this case is
`http://127.0.0.1:8899`. We then use that in the connection to specify to use
the local RPC URL.

`const connection = new Connection("http://127.0.0.1:8899", "confirmed");`

With the validator setup correctly, you may run `index.ts` and confirm
everything is working.

```bash
npx esrun src/index.ts
```

#### 3. Setup group metadata

Before creating our group NFT, we must prepare and upload the group metadata. We
are using devnet Irys (Arweave) to upload the image and metadata. This
functionality is provided for you in the `helpers.ts`.

For ease of this lesson, we've provided assets for the NFTs in the `assets`
directory.

If you'd like to use your own files and metadata feel free!

To get our group metadata ready we have to do the following:

1. We need to format our metadata for upload using the `LabNFTMetadata`
   interface from `helper.ts`
2. Call the `uploadOffChainMetadata` from `helpers.ts`
3. Format everything including the resulting uri from the previous step into the

We need to format our metadata for upload (`LabNFTMetadata`), upload the image
and metadata (`uploadOffChainMetadata`), and finally format everything into the
`TokenMetadata` interface from the `@solana/spl-token-metadata` library.

Note: We are using devnet Irys, which is free to upload to under 100kb.

```ts
// Create group metadata

const groupMetadata: LabNFTMetadata = {
  mint: groupMintKeypair,
  imagePath: "assets/collection.png",
  tokenName: "cool-cats-collection",
  tokenDescription: "Collection of Cool Cat NFTs",
  tokenSymbol: "MEOW",
  tokenExternalUrl: "https://solana.com/",
  tokenAdditionalMetadata: {},
  tokenUri: "",
};

// Upload offchain metadata
groupMetadata.tokenUri = await uploadOffChainMetadata(payer, groupMetadata);

// Format group token metadata
const collectionTokenMetadata: TokenMetadata = {
  name: groupMetadata.tokenName,
  mint: groupMintKeypair.publicKey,
  symbol: groupMetadata.tokenSymbol,
  uri: groupMetadata.tokenUri,
  updateAuthority: payer.publicKey,
  additionalMetadata: Object.entries(
    groupMetadata.tokenAdditionalMetadata || [],
  ).map(([trait_type, value]) => [trait_type, value]),
};
```

Feel free to run the script and make sure everything uploads.

```bash
npx esrun src/index.ts
```

#### 3. Create a mint with group and group pointer

Let's create the group NFT by creating a mint with the `metadata`,
`metadata pointer`, `group` and `group pointer` extensions.

This NFT is the visual representation of our collection.

Let's first define the inputs to our new function `createTokenGroup`:

- `connection`: Connection to the blockchain
- `payer`: The keypair paying for the transaction
- `mintKeypair`: The mint keypair
- `decimals`: The mint decimals ( 0 for NFTs )
- `maxMembers`: The maximum number of members allowed in the group
- `metadata`: The metadata for the group mint

```ts
export async function createTokenGroup(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
  maxMembers: number,
  metadata: TokenMetadata,
): Promise<TransactionSignature>;
```

To make our NFT, we will store the metadata directly on the mint account using
the `metadata` and `metadata pointer` extensions. We'll also save some info
about the group with the `group` and `group pointer` extensions.

To create our group NFT, we need the following instructions:

- `SystemProgram.createAccount`: Allocates space on Solana for the mint account.
  We can get the `mintLength` and `mintLamports` using `getMintLen` and
  `getMinimumBalanceForRentExemption` respectively.
- `createInitializeGroupPointerInstruction`: Initializes the group pointer
- `createInitializeMetadataPointerInstruction`: Initializes the metadata pointer
- `createInitializeMintInstruction`: Initializes the mint
- `createInitializeGroupInstruction`: Initializes the group
- `createInitializeInstruction`: Initializes the metadata

Finally, we need to add all of these instructions to a transaction and send it
to the Solana network, and return the signature. We can do this by calling
`sendAndConfirmTransaction`.

```ts
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
  createInitializeGroupInstruction,
  createInitializeGroupPointerInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  createInitializeMetadataPointerInstruction,
  TOKEN_GROUP_SIZE,
} from "@solana/spl-token";
import {
  TokenMetadata,
  createInitializeInstruction,
  pack,
} from "@solana/spl-token-metadata";

export async function createTokenGroup(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
  maxMembers: number,
  metadata: TokenMetadata,
): Promise<TransactionSignature> {
  const extensions: ExtensionType[] = [
    ExtensionType.GroupPointer,
    ExtensionType.MetadataPointer,
  ];

  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length + 500;
  const mintLength = getMintLen(extensions);
  const totalLen = mintLength + metadataLen + TOKEN_GROUP_SIZE;

  const mintLamports =
    await connection.getMinimumBalanceForRentExemption(totalLen);

  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLength,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeGroupPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      payer.publicKey,
      payer.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeGroupInstruction({
      group: mintKeypair.publicKey,
      maxSize: maxMembers,
      mint: mintKeypair.publicKey,
      mintAuthority: payer.publicKey,
      programId: TOKEN_2022_PROGRAM_ID,
      updateAuthority: payer.publicKey,
    }),
    createInitializeInstruction({
      metadata: mintKeypair.publicKey,
      mint: mintKeypair.publicKey,
      mintAuthority: payer.publicKey,
      name: metadata.name,
      programId: TOKEN_2022_PROGRAM_ID,
      symbol: metadata.symbol,
      updateAuthority: payer.publicKey,
      uri: metadata.uri,
    }),
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
  );

  return signature;
}
```

Now that we have our function, let's call it in our `index.ts` file.

```ts
// Create group
const signature = await createTokenGroup(
  connection,
  payer,
  groupMintKeypair,
  decimals,
  maxMembers,
  collectionTokenMetadata,
);

console.log(
  `Created collection mint with metadata:\n${getExplorerLink("tx", signature, "localnet")}\n`,
);
```

Before we run the script, lets fetch the newly created group NFT and print it's
contents. Let's do this in `index.ts`:

```ts
// Fetch the group
const groupMint = await getMint(
  connection,
  groupMintKeypair.publicKey,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);
const fetchedGroupMetadata = await getTokenMetadata(
  connection,
  groupMintKeypair.publicKey,
);
const metadataPointerState = getMetadataPointerState(groupMint);
const groupData = getGroupPointerState(groupMint);

console.log("\n---------- GROUP DATA -------------\n");
console.log("Group Mint: ", groupMint.address.toBase58());
console.log(
  "Metadata Pointer Account: ",
  metadataPointerState?.metadataAddress?.toBase58(),
);
console.log("Group Pointer Account: ", groupData?.groupAddress?.toBase58());
console.log("\n--- METADATA ---\n");
console.log("Name: ", fetchedGroupMetadata?.name);
console.log("Symbol: ", fetchedGroupMetadata?.symbol);
console.log("Uri: ", fetchedGroupMetadata?.uri);
console.log("\n------------------------------------\n");
```

Now we can run the script and see the group NFT we created.

```bash
npx esrun src/index.ts
```

#### 4. Setup member NFT Metadata

Now that we've created our group NFT, we can create the member NFTs. But before
we actually create them, we need to prepare their metadata.

The flow is the exact same to what we did with the group NFT.

1. We need to format our metadata for upload using the `LabNFTMetadata`
   interface from `helper.ts`
2. Call the `uploadOffChainMetadata` from `helpers.ts`
3. Format everything including the resulting uri from the previous step into the
   `TokenMetadata` interface from the `@solana/spl-token-metadata` library.

However, since we have three members, we'll loop through each step for each
member.

First, let's define the metadata for each member:

```ts
// Define member metadata
const membersMetadata: LabNFTMetadata[] = [
  {
    mint: cat0Mint,
    imagePath: "assets/cat_0.png",
    tokenName: "Cat 1",
    tokenDescription: "Adorable cat",
    tokenSymbol: "MEOW",
    tokenExternalUrl: "https://solana.com/",
    tokenAdditionalMetadata: {},
    tokenUri: "",
  },
  {
    mint: cat1Mint,
    imagePath: "assets/cat_1.png",
    tokenName: "Cat 2",
    tokenDescription: "Sassy cat",
    tokenSymbol: "MEOW",
    tokenExternalUrl: "https://solana.com/",
    tokenAdditionalMetadata: {},
    tokenUri: "",
  },
  {
    mint: cat2Mint,
    imagePath: "assets/cat_2.png",
    tokenName: "Cat 3",
    tokenDescription: "Silly cat",
    tokenSymbol: "MEOW",
    tokenExternalUrl: "https://solana.com/",
    tokenAdditionalMetadata: {},
    tokenUri: "",
  },
];
```

Now let's loop through each member and upload their metadata.

```ts
// Upload member metadata
for (const member of membersMetadata) {
  member.tokenUri = await uploadOffChainMetadata(payer, member);
}
```

Finally, let's format the metadata for each member into the `TokenMetadata`
interface:

Note: We'll want to carry over the keypair since we'll need it to create the
member NFTs.

```ts
// Format token metadata
const memberTokenMetadata: { mintKeypair: Keypair; metadata: TokenMetadata }[] =
  membersMetadata.map(member => ({
    mintKeypair: member.mint,
    metadata: {
      name: member.tokenName,
      mint: member.mint.publicKey,
      symbol: member.tokenSymbol,
      uri: member.tokenUri,
      updateAuthority: payer.publicKey,
      additionalMetadata: Object.entries(
        member.tokenAdditionalMetadata || [],
      ).map(([trait_type, value]) => [trait_type, value]),
    } as TokenMetadata,
  }));
```

#### 5. Create member NFTs

Just like the group NFT, we need to create the member NFTs. Let's do this in a
new file called `create-member.ts`. It will look very similar to the
`create-group.ts` file, except we'll use the `member` and `member pointer`
extensions instead of the `group` and `group pointer` extensions.

First, let's define the inputs to our new function `createTokenMember`:

- `connection`: Connection to the blockchain
- `payer`: The keypair paying for the transaction
- `mintKeypair`: The mint keypair
- `decimals`: The mint decimals ( 0 for NFTs )
- `metadata`: The metadata for the group mint
- `groupAddress`: The address of the group account - in this case it's the group
  mint itself

```ts
export async function createTokenMember(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
  metadata: TokenMetadata,
  groupAddress: PublicKey,
): Promise<TransactionSignature>;
```

Just like the group NFT, we need the following instructions:

- `SystemProgram.createAccount`: Allocates space on Solana for the mint account.
  We can get the `mintLength` and `mintLamports` using `getMintLen` and
  `getMinimumBalanceForRentExemption` respectively.
- `createInitializeGroupMemberPointerInstruction`: Initializes the member
  pointer
- `createInitializeMetadataPointerInstruction`: Initializes the metadata pointer
- `createInitializeMintInstruction`: Initializes the mint
- `createInitializeMemberInstruction`: Initializes the member
- `createInitializeInstruction`: Initializes the metadata

Finally, we need to add these instructions to a transaction, send it to the
Solana network, and return the signature. We can do this by calling
`sendAndConfirmTransaction`.

```ts
import {
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  TransactionSignature,
  PublicKey,
} from "@solana/web3.js";

import {
  ExtensionType,
  createInitializeMintInstruction,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
  LENGTH_SIZE,
  createInitializeMetadataPointerInstruction,
  TOKEN_GROUP_MEMBER_SIZE,
  createInitializeGroupMemberPointerInstruction,
  createInitializeMemberInstruction,
} from "@solana/spl-token";
import {
  TokenMetadata,
  createInitializeInstruction,
  pack,
} from "@solana/spl-token-metadata";

export async function createTokenMember(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  decimals: number,
  metadata: TokenMetadata,
  groupAddress: PublicKey,
): Promise<TransactionSignature> {
  const extensions: ExtensionType[] = [
    ExtensionType.GroupMemberPointer,
    ExtensionType.MetadataPointer,
  ];

  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
  const mintLength = getMintLen(extensions);
  const totalLen = mintLength + metadataLen + TOKEN_GROUP_MEMBER_SIZE;

  const mintLamports =
    await connection.getMinimumBalanceForRentExemption(totalLen);

  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLength,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeGroupMemberPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      payer.publicKey,
      payer.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMemberInstruction({
      group: groupAddress,
      groupUpdateAuthority: payer.publicKey,
      member: mintKeypair.publicKey,
      memberMint: mintKeypair.publicKey,
      memberMintAuthority: payer.publicKey,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeInstruction({
      metadata: mintKeypair.publicKey,
      mint: mintKeypair.publicKey,
      mintAuthority: payer.publicKey,
      name: metadata.name,
      programId: TOKEN_2022_PROGRAM_ID,
      symbol: metadata.symbol,
      updateAuthority: payer.publicKey,
      uri: metadata.uri,
    }),
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
  );

  return signature;
}
```

Let's add our new function to `index.ts` and call it for each member:

```ts
// Create member mints
for (const memberMetadata of memberTokenMetadata) {
  const signature = await createTokenMember(
    connection,
    payer,
    memberMetadata.mintKeypair,
    decimals,
    memberMetadata.metadata,
    groupMintKeypair.publicKey,
  );

  console.log(
    `Created ${memberMetadata.metadata.name} NFT:\n${getExplorerLink("tx", signature, "localnet")}\n`,
  );
}
```

Let's fetch our newly created member NFTs and display their contents.

```ts
for (const member of membersMetadata) {
  const memberMint = await getMint(
    connection,
    member.mint.publicKey,
    "confirmed",
    TOKEN_2022_PROGRAM_ID,
  );
  const memberMetadata = await getTokenMetadata(
    connection,
    member.mint.publicKey,
  );
  const metadataPointerState = getMetadataPointerState(memberMint);
  const memberPointerData = getGroupMemberPointerState(memberMint);
  const memberData = getTokenGroupMemberState(memberMint);

  console.log("\n---------- MEMBER DATA -------------\n");
  console.log("Member Mint: ", memberMint.address.toBase58());
  console.log(
    "Metadata Pointer Account: ",
    metadataPointerState?.metadataAddress?.toBase58(),
  );
  console.log("Group Account: ", memberData?.group?.toBase58());
  console.log(
    "Member Pointer Account: ",
    memberPointerData?.memberAddress?.toBase58(),
  );
  console.log("Member Number: ", memberData?.memberNumber);
  console.log("\n--- METADATA ---\n");
  console.log("Name: ", memberMetadata?.name);
  console.log("Symbol: ", memberMetadata?.symbol);
  console.log("Uri: ", memberMetadata?.uri);
  console.log("\n------------------------------------\n");
}
```

Lastly, let's run the script and see our full collection of NFTs!

```bash
npx esrun src/index.ts
```

That's it! If you're having troubles feel free to check out the `solution`
[branch in the repository](https://github.com/Unboxed-Software/solana-lab-group-member/tree/solution).

## Challenge

Go create a NFT collection of your own using the the `group`, `group pointer`,
`member` and `member pointer` extensions.
