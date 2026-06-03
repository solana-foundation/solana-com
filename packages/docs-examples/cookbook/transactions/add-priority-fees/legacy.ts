// #region priority
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

// Create connection
const connection = new Connection("http://localhost:8899", "confirmed");

// Generate keypairs
const sender = Keypair.generate();
const recipient = Keypair.generate();

// Request and confirm airdrop
const airdropSignature = await connection.requestAirdrop(
  sender.publicKey,
  LAMPORTS_PER_SOL,
);

const { blockhash, lastValidBlockHeight } =
  await connection.getLatestBlockhash();
await connection.confirmTransaction({
  signature: airdropSignature,
  blockhash,
  lastValidBlockHeight,
});

// Create instructions
const instructions = [
  // Set compute unit limit (1M units)
  ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000,
  }),
  // Set priority fee (1 microLamports per compute unit)
  ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  }),
  // Transfer 0.01 SOL
  SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient.publicKey,
    lamports: 10000000,
  }),
];

// Get latest blockhash for transaction
const latestBlockhash = await connection.getLatestBlockhash();

// Create transaction using modern VersionedTransaction
const messageV0 = new TransactionMessage({
  payerKey: sender.publicKey,
  recentBlockhash: latestBlockhash.blockhash,
  instructions,
}).compileToV0Message();

const transaction = new VersionedTransaction(messageV0);
transaction.sign([sender]);

// Send and confirm transaction
const transactionSignature = await connection.sendTransaction(transaction);
console.log(`Transaction Signature: ${transactionSignature}`);
// #endregion priority
