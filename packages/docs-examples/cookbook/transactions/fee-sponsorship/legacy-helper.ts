// #region sponsor
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  transfer,
  getAccount,
} from "@solana/spl-token";

const connection = new Connection("http://localhost:8899", "confirmed");
const latestBlockhash = await connection.getLatestBlockhash();

const feePayer = Keypair.generate();
const sender = Keypair.generate();
const recipient = Keypair.generate();

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
const mintPubkey = await createMint(
  connection,
  feePayer, // fee payer
  sender.publicKey, // mint authority
  sender.publicKey, // freeze authority
  2, // decimals
  Keypair.generate(),
  { commitment: "confirmed" },
  TOKEN_PROGRAM_ID,
);
console.log("Mint Address:", mintPubkey.toBase58());

// Create sender's ATA (feePayer covers the fee)
const senderATA = await createAssociatedTokenAccount(
  connection,
  feePayer,
  mintPubkey,
  sender.publicKey,
  { commitment: "confirmed" },
  TOKEN_PROGRAM_ID,
);
console.log("Sender ATA Address:", senderATA.toBase58());

// Create recipient's ATA (feePayer covers the fee)
const recipientATA = await createAssociatedTokenAccount(
  connection,
  feePayer,
  mintPubkey,
  recipient.publicKey,
  { commitment: "confirmed" },
  TOKEN_PROGRAM_ID,
);
console.log("Recipient ATA Address:", recipientATA.toBase58());

// Mint 100 tokens (1.00 with 2 decimals) to the sender's ATA
const mintAmount = 100;
const mintSignature = await mintTo(
  connection,
  feePayer, // payer (covers SOL fee)
  mintPubkey,
  senderATA,
  sender.publicKey, // mint authority
  mintAmount,
  [sender], // mint authority must sign
  { commitment: "confirmed" },
  TOKEN_PROGRAM_ID,
);
console.log("Successfully minted 1.0 tokens");
console.log("Transaction Signature:", mintSignature);

// Transfer 50 tokens from sender to recipient (feePayer pays SOL fee)
const transferAmount = 50;
const transactionSignature2 = await transfer(
  connection,
  feePayer,
  senderATA,
  recipientATA,
  sender.publicKey,
  transferAmount,
  [sender],
  { commitment: "confirmed" },
  TOKEN_PROGRAM_ID,
);
console.log("Successfully transferred 0.5 tokens");
console.log("Transaction Signature:", transactionSignature2);

const senderTokenAccount = await getAccount(
  connection,
  senderATA,
  "confirmed",
  TOKEN_PROGRAM_ID,
);
const recipientTokenAccount = await getAccount(
  connection,
  recipientATA,
  "confirmed",
  TOKEN_PROGRAM_ID,
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
