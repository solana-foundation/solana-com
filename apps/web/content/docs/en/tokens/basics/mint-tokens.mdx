---
title: Mint Tokens
description: Learn how to mint new units of a token.
---

## How to Mint Tokens

Minting creates new units of a token using the
[`MintTo`](https://github.com/solana-program/token/blob/a7c488ca39ed4cd71a87950ed854929816e9099f/program/src/instruction.rs#L174)
instruction.

- Only the mint authority can mint new tokens
- A destination token account must exist to receive the minted tokens

<Callout type="info">
  The [Token
  Program](https://github.com/solana-program/token/blob/3daf44899f0bd71c879d28dffdfb788dd944f3c5/program/src/processor.rs#L521)
  and [Token Extension
  Program](https://github.com/solana-program/token-2022/blob/efd0c957fefbd79882d77df5fb2dac88c001249c/program/src/processor.rs#L973)
  share similar implementations to achieve the same functionality.
</Callout>

### Typescript

<CodeTabs storage="token-ts" flags="r">

```ts !! title="Kit"
import {
  airdropFactory,
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners
} from "@solana/kit";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  getCreateAssociatedTokenInstructionAsync,
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
  getMintToInstruction
} from "@solana-program/token";

// Create Connection, local validator in this example
const rpc = createSolanaRpc("http://localhost:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://localhost:8900");

// Generate keypairs for fee payer
const feePayer = await generateKeyPairSigner();

// Fund fee payer
await airdropFactory({ rpc, rpcSubscriptions })({
  recipientAddress: feePayer.address,
  lamports: lamports(1_000_000_000n),
  commitment: "confirmed"
});

// Generate keypair to use as address of mint
const mint = await generateKeyPairSigner();
console.log("Mint Address:", mint.address);

// Get default mint account size (in bytes), no extensions enabled
const space = BigInt(getMintSize());

// Get minimum balance for rent exemption
const rent = await rpc.getMinimumBalanceForRentExemption(space).send();

// Get latest blockhash to include in transaction
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

// Instruction to create new account for mint (token program)
// Invokes the system program
const createAccountInstruction = getCreateAccountInstruction({
  payer: feePayer,
  newAccount: mint,
  lamports: rent,
  space,
  programAddress: TOKEN_PROGRAM_ADDRESS
});

// Instruction to initialize mint account data
// Invokes the token program
const initializeMintInstruction = getInitializeMintInstruction({
  mint: mint.address,
  decimals: 2,
  mintAuthority: feePayer.address
});

// Create instruction to create the associated token account
const createAtaInstruction = await getCreateAssociatedTokenInstructionAsync({
  payer: feePayer,
  mint: mint.address,
  owner: feePayer.address
});

const instructions = [
  createAccountInstruction,
  initializeMintInstruction,
  createAtaInstruction
];

// Create transaction message
const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstructions(instructions, tx)
);

// Sign transaction message with all required signers
const signedTransaction =
  await signTransactionMessageWithSigners(transactionMessage);

// Send and confirm transaction
await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
  signedTransaction,
  { commitment: "confirmed" }
);

// Get transaction signature
const transactionSignature = getSignatureFromTransaction(signedTransaction);

// Use findAssociatedTokenPda to derive the ATA address
const [associatedTokenAddress] = await findAssociatedTokenPda({
  mint: mint.address,
  owner: feePayer.address,
  tokenProgram: TOKEN_PROGRAM_ADDRESS
});

console.log(
  "Associated Token Account Address: ",
  associatedTokenAddress.toString()
);

// Create instruction to mint tokens
const mintToInstruction = getMintToInstruction({
  mint: mint.address,
  token: associatedTokenAddress,
  mintAuthority: feePayer.address,
  amount: 100n // 1.00 tokens with 2 decimals
});

// Create transaction message for minting tokens
const mintTxMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstructions([mintToInstruction], tx)
);

// Sign transaction message with all required signers
const signedMintTx = await signTransactionMessageWithSigners(mintTxMessage);

// Send and confirm transaction
await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
  signedMintTx,
  { commitment: "confirmed" }
);

// Get transaction signature
const transactionSignature2 = getSignatureFromTransaction(signedMintTx);

console.log("Successfully minted 1.0 tokens");
console.log("Transaction Signature:", transactionSignature2);
```

```ts !! title="Legacy"
import {
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMintToInstruction
} from "@solana/spl-token";

// Create connection to local validator
const connection = new Connection("http://localhost:8899", "confirmed");
const latestBlockhash = await connection.getLatestBlockhash();

// Generate a new keypair for the fee payer
const feePayer = Keypair.generate();

// Airdrop 1 SOL to fee payer
const airdropSignature = await connection.requestAirdrop(
  feePayer.publicKey,
  LAMPORTS_PER_SOL
);
await connection.confirmTransaction({
  blockhash: latestBlockhash.blockhash,
  lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  signature: airdropSignature
});

// Generate keypair to use as address of mint
const mint = Keypair.generate();

// Get minimum balance for rent exemption
const mintRent = await getMinimumBalanceForRentExemptMint(connection);

// Get the associated token account address
const associatedTokenAccount = getAssociatedTokenAddressSync(
  mint.publicKey,
  feePayer.publicKey,
  false, // allowOwnerOffCurve
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
);

// Create account instruction
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: feePayer.publicKey,
  newAccountPubkey: mint.publicKey,
  space: MINT_SIZE,
  lamports: mintRent,
  programId: TOKEN_PROGRAM_ID
});

// Initialize mint instruction
const initializeMintInstruction = createInitializeMintInstruction(
  mint.publicKey, // mint pubkey
  2, // decimals
  feePayer.publicKey, // mint authority
  feePayer.publicKey, // freeze authority
  TOKEN_PROGRAM_ID
);

// Create associated token account instruction
const createAssociatedTokenAccountIx = createAssociatedTokenAccountInstruction(
  feePayer.publicKey, // payer
  associatedTokenAccount, // associated token account address
  feePayer.publicKey, // owner
  mint.publicKey, // mint
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
);

// Create and sign transaction with both mint creation and ATA creation
const transaction = new Transaction({
  feePayer: feePayer.publicKey,
  blockhash: latestBlockhash.blockhash,
  lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
}).add(
  createAccountInstruction,
  initializeMintInstruction,
  createAssociatedTokenAccountIx
);

// Sign transaction
const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [feePayer, mint]
);

console.log("Mint Address:", mint.publicKey.toBase58());
console.log(
  "Associated Token Account Address:",
  associatedTokenAccount.toBase58()
);
console.log("Transaction Signature:", transactionSignature);

// Create a separate transaction for minting tokens
// Create mint to instruction (mint 100 tokens = 1.00 with 2 decimals)
const mintAmount = 100;
const mintToInstruction = createMintToInstruction(
  mint.publicKey, // mint
  associatedTokenAccount, // destination
  feePayer.publicKey, // authority
  mintAmount, // amount
  [], // multiSigners
  TOKEN_PROGRAM_ID // programId
);

// Get a new blockhash for the mint transaction
const mintBlockhash = await connection.getLatestBlockhash();

// Create and sign transaction for minting tokens
const mintTransaction = new Transaction({
  feePayer: feePayer.publicKey,
  blockhash: mintBlockhash.blockhash,
  lastValidBlockHeight: mintBlockhash.lastValidBlockHeight
}).add(mintToInstruction);

// Sign and send mint transaction
const mintTransactionSignature = await sendAndConfirmTransaction(
  connection,
  mintTransaction,
  [feePayer]
);

console.log("Successfully minted 1.0 tokens");
console.log("Transaction Signature:", mintTransactionSignature);
```

```ts !! title="Legacy Helper"
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";

// Create connection to local validator
const connection = new Connection("http://localhost:8899", "confirmed");
const latestBlockhash = await connection.getLatestBlockhash();

// Generate a new keypair for the fee payer
const feePayer = Keypair.generate();

// Airdrop 1 SOL to fee payer
const airdropSignature = await connection.requestAirdrop(
  feePayer.publicKey,
  LAMPORTS_PER_SOL
);
await connection.confirmTransaction({
  blockhash: latestBlockhash.blockhash,
  lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  signature: airdropSignature
});

// Create mint using helper function
const mintPubkey = await createMint(
  connection, // connection
  feePayer, // fee payer
  feePayer.publicKey, // mint authority
  feePayer.publicKey, // freeze authority
  2, // decimals
  Keypair.generate(), // keypair (optional)
  {
    commitment: "confirmed" // confirmation options
  },
  TOKEN_PROGRAM_ID // program id
);
console.log(`Mint Address: ${mintPubkey.toBase58()}`);

// Create associated token account using helper function
const associatedTokenAccount = await createAssociatedTokenAccount(
  connection, // connection
  feePayer, // fee payer
  mintPubkey, // mint
  feePayer.publicKey, // owner
  {
    commitment: "confirmed" // confirmation options
  },
  TOKEN_PROGRAM_ID // program id
);
console.log(
  `Associated Token Account Address: ${associatedTokenAccount.toBase58()}`
);

// Mint 100 tokens to the associated token account (with 2 decimals, this is 1.00 tokens)
const mintAmount = 100; // 1.00 tokens with 2 decimals
const mintTransactionSignature = await mintTo(
  connection,
  feePayer,
  mintPubkey,
  associatedTokenAccount,
  feePayer, // Authority (mint authority)
  mintAmount,
  [],
  {
    commitment: "confirmed"
  },
  TOKEN_PROGRAM_ID
);
console.log(
  `Successfully minted 1.00 tokens to ${associatedTokenAccount.toBase58()}`
);
console.log("Transaction Signature:", mintTransactionSignature);
```

</CodeTabs>

### Rust

<CodeTabs storage="token-rs" flags="r">

```rust !! title="Rust"
use anyhow::Result;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    program_pack::Pack,
    signature::{Keypair, Signer},
    transaction::Transaction,
};
use solana_system_interface::instruction::create_account;
use spl_associated_token_account_interface::{
    address::get_associated_token_address_with_program_id,
    instruction::create_associated_token_account,
};
use spl_token_interface::{
    id as token_program_id,
    instruction::{initialize_mint, mint_to},
    state::{Account, Mint},
};

#[tokio::main]
async fn main() -> Result<()> {
    // Create connection to local validator
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );
    let latest_blockhash = client.get_latest_blockhash().await?;

    // Generate a new keypair for the fee payer
    let fee_payer = Keypair::new();

    // Airdrop 1 SOL to fee payer
    let airdrop_signature = client
        .request_airdrop(&fee_payer.pubkey(), 1_000_000_000)
        .await?;
    client.confirm_transaction(&airdrop_signature).await?;

    loop {
        let confirmed = client.confirm_transaction(&airdrop_signature).await?;
        if confirmed {
            break;
        }
    }

    // Generate keypair to use as address of mint
    let mint = Keypair::new();

    // Get default mint account size (in bytes), no extensions enabled
    let mint_space = Mint::LEN;
    let mint_rent = client
        .get_minimum_balance_for_rent_exemption(mint_space)
        .await?;

    // Instruction to create new account for mint (token program)
    let create_account_instruction = create_account(
        &fee_payer.pubkey(), // payer
        &mint.pubkey(),      // new account (mint)
        mint_rent,           // lamports
        mint_space as u64,   // space
        &token_program_id(), // program id
    );

    // Instruction to initialize mint account data
    let initialize_mint_instruction = initialize_mint(
        &token_program_id(),
        &mint.pubkey(),            // mint
        &fee_payer.pubkey(),       // mint authority
        Some(&fee_payer.pubkey()), // freeze authority
        2,                         // decimals
    )?;

    // Calculate the associated token account address for fee_payer
    let associated_token_address = get_associated_token_address_with_program_id(
        &fee_payer.pubkey(), // owner
        &mint.pubkey(),      // mint
        &token_program_id(), // program_id
    );

    // Instruction to create associated token account
    let create_ata_instruction = create_associated_token_account(
        &fee_payer.pubkey(), // funding address
        &fee_payer.pubkey(), // wallet address
        &mint.pubkey(),      // mint address
        &token_program_id(), // program id
    );

    // Create transaction and add instructions
    let transaction = Transaction::new_signed_with_payer(
        &[
            create_account_instruction,
            initialize_mint_instruction,
            create_ata_instruction,
        ],
        Some(&fee_payer.pubkey()),
        &[&fee_payer, &mint],
        latest_blockhash,
    );

    // Send and confirm transaction
    client.send_and_confirm_transaction(&transaction).await?;

    // Amount of tokens to mint (100 tokens with 2 decimal places)
    let amount = 100;

    // Create mint_to instruction to mint tokens to the associated token account
    let mint_to_instruction = mint_to(
        &token_program_id(),
        &mint.pubkey(),            // mint
        &associated_token_address, // destination
        &fee_payer.pubkey(),       // authority
        &[&fee_payer.pubkey()],    // signer
        amount,                    // amount
    )?;

    // Create transaction for minting tokens
    let transaction = Transaction::new_signed_with_payer(
        &[mint_to_instruction],
        Some(&fee_payer.pubkey()),
        &[&fee_payer],
        latest_blockhash,
    );

    // Send and confirm transaction
    let transaction_signature = client.send_and_confirm_transaction(&transaction).await?;

    let mint_account = client.get_account(&mint.pubkey()).await?;
    let mint_data = Mint::unpack(&mint_account.data)?;

    let token = client.get_account(&associated_token_address).await?;
    let token_data = Account::unpack(&token.data)?;

    println!("Minted 1.00 tokens to the associated token account");
    println!("\nMint Address: {}", mint.pubkey());
    println!("{:#?}", mint_data);

    println!(
        "\nAssociated Token Account Address: {}",
        associated_token_address
    );
    println!("{:#?}", token_data);

    println!("Transaction Signature: {}", transaction_signature);

    Ok(())
}
```

</CodeTabs>

### Python

<CodeTabs flags="r">

```py !! title="Python"
#!/usr/bin/env python3

import asyncio
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.transaction import VersionedTransaction
from solders.message import MessageV0
from spl.token.instructions import mint_to, MintToParams
from spl.token.constants import TOKEN_PROGRAM_ID

async def main():
    rpc = AsyncClient("http://localhost:8899")

    # Example keypairs and addresses
    payer = Keypair()
    mint_authority = Keypair()
    mint_address = Pubkey.from_string("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU")
    destination_token_account = Pubkey.from_string("GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ")

    # Amount to mint (in smallest unit)
    amount_to_mint = 1000000000  # 1 token with 9 decimals

    async with rpc:
        # Create mint instruction
        mint_instruction = mint_to(
            MintToParams(
                program_id=TOKEN_PROGRAM_ID,
                mint=mint_address,
                dest=destination_token_account,
                mint_authority=mint_authority.pubkey(),
                amount=amount_to_mint
            )
        )

        # Get latest blockhash
        recent_blockhash = await rpc.get_latest_blockhash()

        # Create message
        message = MessageV0.try_compile(
            payer=payer.pubkey(),
            instructions=[mint_instruction],
            address_lookup_table_accounts=[],
            recent_blockhash=recent_blockhash.value.blockhash
        )

        # Create transaction
        transaction = VersionedTransaction(message, [payer, mint_authority])

        print(f"Mint: {mint_address}")
        print(f"Destination: {destination_token_account}")
        print(f"Amount: {amount_to_mint}")
        print(f"Mint authority: {mint_authority.pubkey()}")
        print(f"Payer: {payer.pubkey()}")
        print(f"Mint transaction created successfully")

if __name__ == "__main__":
    asyncio.run(main())
```

</CodeTabs>
