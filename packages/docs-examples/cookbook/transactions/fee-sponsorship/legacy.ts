// #region sponsor
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

const mint = Keypair.generate();
const mintRent = await getMinimumBalanceForRentExemptMint(connection);

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

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: sender.publicKey,
  newAccountPubkey: mint.publicKey,
  space: MINT_SIZE,
  lamports: mintRent,
  programId: TOKEN_PROGRAM_ID,
});

const initializeMintInstruction = createInitializeMintInstruction(
  mint.publicKey,
  2,
  sender.publicKey,
  sender.publicKey,
  TOKEN_PROGRAM_ID,
);

const createSenderATA = createAssociatedTokenAccountInstruction(
  sender.publicKey,
  senderATA,
  sender.publicKey,
  mint.publicKey,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
);

// Note: feePayer pays for recipient's ATA — that's the sponsorship
const createRecipientATA = createAssociatedTokenAccountInstruction(
  feePayer.publicKey,
  recipientATA,
  recipient.publicKey,
  mint.publicKey,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
);

const mintAmount = 100;
const mintToInstruction = createMintToInstruction(
  mint.publicKey,
  senderATA,
  sender.publicKey,
  mintAmount,
  [],
  TOKEN_PROGRAM_ID,
);

// feePayer pays the SOL fee for this whole transaction
const transaction = new Transaction({
  feePayer: feePayer.publicKey,
  blockhash: latestBlockhash.blockhash,
  lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
}).add(
  createAccountInstruction,
  initializeMintInstruction,
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

// Transfer tokens — fee still paid by feePayer
const transferAmount = 50;
const transferInstruction = createTransferInstruction(
  senderATA,
  recipientATA,
  sender.publicKey,
  transferAmount,
  [],
  TOKEN_PROGRAM_ID,
);

const transferBlockhash = await connection.getLatestBlockhash();

let transferTransaction = new Transaction({
  feePayer: feePayer.publicKey,
  blockhash: transferBlockhash.blockhash,
  lastValidBlockHeight: transferBlockhash.lastValidBlockHeight,
}).add(transferInstruction);

const transactionSignature2 = await sendAndConfirmTransaction(
  connection,
  transferTransaction,
  [feePayer, sender],
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
