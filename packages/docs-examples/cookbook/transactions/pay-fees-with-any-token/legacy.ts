// #region pay-fees
import {
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMintToInstruction,
  createTransferInstruction,
  getAccount,
} from "@solana/spl-token";

// Create connection to local validator
const connection = new Connection("http://localhost:8899", "confirmed");
const latestBlockhash = await connection.getLatestBlockhash();

// Generate keypairs
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

// Airdrop 0.1 SOL to sender for rent exemption
const senderAirdropSignature = await connection.requestAirdrop(
  sender.publicKey,
  LAMPORTS_PER_SOL / 10,
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

// Generate keypair to use as address of mint
const mint = Keypair.generate();

// Get minimum balance for rent exemption
const mintRent = await getMinimumBalanceForRentExemptMint(connection);

// Get the associated token account addresses
const feePayerATA = getAssociatedTokenAddressSync(
  mint.publicKey,
  feePayer.publicKey,
  false,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
);

const senderATA = getAssociatedTokenAddressSync(
  mint.publicKey,
  sender.publicKey,
  false,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
);

const recipientATA = getAssociatedTokenAddressSync(
  mint.publicKey,
  recipient.publicKey,
  false,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
);

// Create account instruction
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: sender.publicKey,
  newAccountPubkey: mint.publicKey,
  space: MINT_SIZE,
  lamports: mintRent,
  programId: TOKEN_PROGRAM_ID,
});

// Initialize mint instruction
const initializeMintInstruction = createInitializeMintInstruction(
  mint.publicKey,
  2, // decimals
  sender.publicKey, // mint authority
  sender.publicKey, // freeze authority
  TOKEN_PROGRAM_ID,
);

// Create associated token account instructions
const createFeePayerATA = createAssociatedTokenAccountInstruction(
  feePayer.publicKey,
  feePayerATA,
  feePayer.publicKey,
  mint.publicKey,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
);

const createSenderATA = createAssociatedTokenAccountInstruction(
  feePayer.publicKey,
  senderATA,
  sender.publicKey,
  mint.publicKey,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
);

const createRecipientATA = createAssociatedTokenAccountInstruction(
  feePayer.publicKey,
  recipientATA,
  recipient.publicKey,
  mint.publicKey,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
);

// Create mint to instruction (mint 100 tokens = 1.00 with 2 decimals)
const mintAmount = 100;
const mintToInstruction = createMintToInstruction(
  mint.publicKey,
  senderATA,
  sender.publicKey,
  mintAmount,
  [],
  TOKEN_PROGRAM_ID,
);

// Create and sign transaction with mint creation and ATAs
const transaction = new Transaction({
  feePayer: feePayer.publicKey,
  blockhash: latestBlockhash.blockhash,
  lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
}).add(
  createAccountInstruction,
  initializeMintInstruction,
  createFeePayerATA,
  createSenderATA,
  createRecipientATA,
  mintToInstruction,
);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [feePayer, sender, mint],
);
console.log("Transaction Signature:", transactionSignature);

// Transfer 50 tokens to recipient
const transferAmount = 50;
const transferInstruction = createTransferInstruction(
  senderATA,
  recipientATA,
  sender.publicKey,
  transferAmount,
  [],
  TOKEN_PROGRAM_ID,
);

// Transfer tokens to fee payer to cover the transaction fees
const transferFeePayerInstruction = createTransferInstruction(
  senderATA,
  feePayerATA,
  sender.publicKey,
  transferAmount,
  [],
  TOKEN_PROGRAM_ID,
);

// Get a new blockhash for the transfer transaction
const transferBlockhash = await connection.getLatestBlockhash();

let transferTransaction = new Transaction({
  feePayer: feePayer.publicKey,
  blockhash: transferBlockhash.blockhash,
  lastValidBlockHeight: transferBlockhash.lastValidBlockHeight,
}).add(transferInstruction, transferFeePayerInstruction);

const transactionSignature2 = await sendAndConfirmTransaction(
  connection,
  transferTransaction,
  [feePayer, sender],
);

console.log("Successfully transferred 0.5 tokens");
console.log("Transaction Signature:", transactionSignature2);

const feePayerTokenAccount = await getAccount(
  connection,
  feePayerATA,
  "confirmed",
  TOKEN_PROGRAM_ID,
);
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
  "Fee Payer balance:",
  Number(feePayerTokenAccount.amount) / 100,
  "tokens",
);
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
// #endregion pay-fees
