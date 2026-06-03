// #region memo
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import { createMemoInstruction } from "@solana/spl-memo";

// Connect to Solana cluster
const connection = new Connection("http://localhost:8899", "confirmed");

// Create keypair for the fee payer
const feePayer = Keypair.generate();

// Request and confirm airdrop
const airdropSignature = await connection.requestAirdrop(
  feePayer.publicKey,
  LAMPORTS_PER_SOL,
);

// Get latest blockhash for confirmation
const { blockhash, lastValidBlockHeight } =
  await connection.getLatestBlockhash();
await connection.confirmTransaction({
  signature: airdropSignature,
  blockhash,
  lastValidBlockHeight,
});

// Create a memo instruction
const memoInstruction = createMemoInstruction("Hello, World!");

// Create transaction and add the memo instruction
const transaction = new Transaction().add(memoInstruction);

// Sign and send transaction
const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [feePayer],
);
console.log("Transaction Signature: ", transactionSignature);
// #endregion memo
