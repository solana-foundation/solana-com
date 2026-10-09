// #region sponsor
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js-v3";
import {
  findAssociatedTokenPda,
  getCreateMintInstructionPlan,
  getMintToATAInstructionPlan,
  getTokenDecoder,
  getTransferToATAInstructionPlan,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";

const connection = new Connection("http://localhost:8899", "confirmed");
const latestBlockhash = await connection.getLatestBlockhash();

const feePayer = await Keypair.generate();
const sender = await Keypair.generate();
const recipient = await Keypair.generate();

// Airdrop 1 SOL to fee payer
const airdropSignature = await connection.requestAirdrop(
  feePayer.publicKey,
  LAMPORTS_PER_SOL,
);
await connection.confirmTransaction({
  blockhash: latestBlockhash.blockhash,
  lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  signature: airdropSignature,
});

// Airdrop 1 SOL to sender so it can act as mint authority
const senderAirdropSignature = await connection.requestAirdrop(
  sender.publicKey,
  LAMPORTS_PER_SOL,
);
await connection.confirmTransaction({
  blockhash: latestBlockhash.blockhash,
  lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  signature: senderAirdropSignature,
});

// Airdrop 0.1 SOL to recipient for rent exemption
const recipientAirdropSignature = await connection.requestAirdrop(
  recipient.publicKey,
  LAMPORTS_PER_SOL / 10,
);
await connection.confirmTransaction({
  blockhash: latestBlockhash.blockhash,
  lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  signature: recipientAirdropSignature,
});

// Create mint with feePayer paying the SOL fees
const mint = await Keypair.generate();
await sendAndConfirmTransaction(
  connection,
  new Transaction({
    feePayer: feePayer.publicKey,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  }).add(
    await getCreateMintInstructionPlan(
      {
        getMinimumBalance: (space: number) =>
          connection.getMinimumBalanceForRentExemption(space),
      },
      {
        payer: feePayer, // fee payer
        newMint: mint,
        decimals: 2, // decimals
        mintAuthority: sender.publicKey.toBase58(), // mint authority
        freezeAuthority: sender.publicKey.toBase58(), // freeze authority
      },
    ),
  ),
  [feePayer, mint],
);
const mintPubkey = mint.publicKey;
console.log("Mint Address:", mintPubkey.toBase58());

const [senderATA] = await findAssociatedTokenPda({
  mint: mintPubkey.toBase58(),
  owner: sender.publicKey.toBase58(),
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});
console.log("Sender ATA Address:", senderATA);

const [recipientATA] = await findAssociatedTokenPda({
  mint: mintPubkey.toBase58(),
  owner: recipient.publicKey.toBase58(),
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});
console.log("Recipient ATA Address:", recipientATA);

// Mint 100 tokens (1.00 with 2 decimals) to the sender's ATA
const mintAmount = 100;
const mintSignature = await sendAndConfirmTransaction(
  connection,
  new Transaction({
    feePayer: feePayer.publicKey,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  }).add(
    getMintToATAInstructionPlan({
      payer: feePayer, // payer (covers SOL fee)
      ata: senderATA,
      owner: sender.publicKey.toBase58(),
      mint: mintPubkey.toBase58(),
      mintAuthority: sender, // mint authority must sign
      amount: mintAmount,
      decimals: 2,
    }),
  ),
  [feePayer, sender],
);
console.log("Successfully minted 1.0 tokens");
console.log("Transaction Signature:", mintSignature);

// Transfer 50 tokens from sender to recipient (feePayer pays SOL fee)
const transferAmount = 50;
const transactionSignature2 = await sendAndConfirmTransaction(
  connection,
  new Transaction({
    feePayer: feePayer.publicKey,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  }).add(
    getTransferToATAInstructionPlan({
      payer: feePayer,
      mint: mintPubkey.toBase58(),
      source: senderATA,
      authority: sender,
      destination: recipientATA,
      recipient: recipient.publicKey.toBase58(),
      amount: transferAmount,
      decimals: 2,
    }),
  ),
  [feePayer, sender],
);
console.log("Successfully transferred 0.5 tokens");
console.log("Transaction Signature:", transactionSignature2);

const senderAccountInfo = await connection.getAccountInfo(
  new PublicKey(senderATA),
);
const senderTokenAccount = getTokenDecoder().decode(senderAccountInfo!.data);
const recipientAccountInfo = await connection.getAccountInfo(
  new PublicKey(recipientATA),
);
const recipientTokenAccount = getTokenDecoder().decode(
  recipientAccountInfo!.data,
);

console.log("=== Final Balances ===");
console.log(
  "Sender balance:",
  Number(senderTokenAccount.amount) / 100,
  "tokens",
);
console.log(
  "Recipient balance:",
  Number(recipientTokenAccount.amount) / 100,
  "tokens",
);
// #endregion sponsor
