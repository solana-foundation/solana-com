// #region sponsor
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

const mint = await Keypair.generate();
const mintRent =
  await connection.getMinimumBalanceForRentExemption(getMintSize());

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

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: sender.publicKey,
  newAccountPubkey: mint.publicKey,
  space: getMintSize(),
  lamports: mintRent,
  programId: new PublicKey(TOKEN_PROGRAM_ADDRESS),
});

const initializeMintInstruction = getInitializeMintInstruction({
  mint: mint.publicKey,
  decimals: 2,
  mintAuthority: sender.publicKey.toBase58(),
  freezeAuthority: sender.publicKey.toBase58(),
});

const createSenderATA = getCreateAssociatedTokenInstruction({
  payer: sender,
  ata: senderATA,
  owner: sender.publicKey,
  mint: mint.publicKey,
});

// Note: feePayer pays for recipient's ATA — that's the sponsorship
const createRecipientATA = getCreateAssociatedTokenInstruction({
  payer: feePayer,
  ata: recipientATA,
  owner: recipient.publicKey,
  mint: mint.publicKey,
});

const mintAmount = 100;
const mintToInstruction = getMintToInstruction({
  mint: mint.publicKey,
  token: senderATA,
  mintAuthority: sender,
  amount: mintAmount,
});

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
const transferInstruction = getTransferInstruction({
  source: senderATA,
  destination: recipientATA,
  authority: sender,
  amount: transferAmount,
});

const transferBlockhash = await connection.getLatestBlockhash();

const transferTransaction = new Transaction({
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
