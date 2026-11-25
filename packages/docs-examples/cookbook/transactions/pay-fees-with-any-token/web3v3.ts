// #region pay-fees
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js-v3";
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenInstruction,
  getInitializeMintInstruction,
  getMintSize,
  getMintToInstruction,
  getTokenDecoder,
  getTransferInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";

// Create connection to local validator
const connection = new Connection("http://localhost:8899", "confirmed");
const latestBlockhash = await connection.getLatestBlockhash();

// Generate keypairs
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
const mint = await Keypair.generate();

// Get minimum balance for rent exemption
const mintRent =
  await connection.getMinimumBalanceForRentExemption(getMintSize());

// Get the associated token account addresses
const [feePayerATA] = await findAssociatedTokenPda({
  mint: mint.publicKey.toBase58(),
  owner: feePayer.publicKey.toBase58(),
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});

const [senderATA] = await findAssociatedTokenPda({
  mint: mint.publicKey.toBase58(),
  owner: sender.publicKey.toBase58(),
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});

const [recipientATA] = await findAssociatedTokenPda({
  mint: mint.publicKey.toBase58(),
  owner: recipient.publicKey.toBase58(),
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});

// Create account instruction
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: sender.publicKey,
  newAccountPubkey: mint.publicKey,
  space: getMintSize(),
  lamports: mintRent,
  programId: new PublicKey(TOKEN_PROGRAM_ADDRESS),
});

// Initialize mint instruction
const initializeMintInstruction = getInitializeMintInstruction({
  mint: mint.publicKey,
  decimals: 2, // decimals
  mintAuthority: sender.publicKey.toBase58(), // mint authority
  freezeAuthority: sender.publicKey.toBase58(), // freeze authority
});

// Create associated token account instructions
const createFeePayerATA = getCreateAssociatedTokenInstruction({
  payer: feePayer,
  ata: feePayerATA,
  owner: feePayer.publicKey,
  mint: mint.publicKey,
});

const createSenderATA = getCreateAssociatedTokenInstruction({
  payer: feePayer,
  ata: senderATA,
  owner: sender.publicKey,
  mint: mint.publicKey,
});

const createRecipientATA = getCreateAssociatedTokenInstruction({
  payer: feePayer,
  ata: recipientATA,
  owner: recipient.publicKey,
  mint: mint.publicKey,
});

// Create mint to instruction (mint 100 tokens = 1.00 with 2 decimals)
const mintAmount = 100;
const mintToInstruction = getMintToInstruction({
  mint: mint.publicKey,
  token: senderATA,
  mintAuthority: sender,
  amount: mintAmount,
});

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
const transferInstruction = getTransferInstruction({
  source: senderATA,
  destination: recipientATA,
  authority: sender,
  amount: transferAmount,
});

// Transfer tokens to fee payer to cover the transaction fees
const transferFeePayerInstruction = getTransferInstruction({
  source: senderATA,
  destination: feePayerATA,
  authority: sender,
  amount: transferAmount,
});

// Get a new blockhash for the transfer transaction
const transferBlockhash = await connection.getLatestBlockhash();

const transferTransaction = new Transaction({
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

const feePayerAccountInfo = await connection.getAccountInfo(
  new PublicKey(feePayerATA),
);
const feePayerTokenAccount = getTokenDecoder().decode(
  feePayerAccountInfo!.data,
);
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
