// #region pay-fees
import {
  airdropFactory,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
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
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  getCreateAssociatedTokenInstructionAsync,
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
  getMintToInstruction,
  getTransferInstruction,
  fetchToken,
} from "@solana-program/token";

// Create Connection, local validator in this example
const rpc = createSolanaRpc("http://localhost:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://localhost:8900");

// Generate keypairs for fee payer, sender and recipient
const feePayer = await generateKeyPairSigner();
const sender = await generateKeyPairSigner();
const recipient = await generateKeyPairSigner();

console.log("Fee Payer Address:", feePayer.address.toString());
console.log("Sender Address:", sender.address.toString());
console.log("Recipient Address:", recipient.address.toString());

// Fund fee payer
await airdropFactory({ rpc, rpcSubscriptions })({
  recipientAddress: feePayer.address,
  lamports: lamports(1_000_000_000n),
  commitment: "confirmed",
});

// Generate keypair to use as address of mint
const mint = await generateKeyPairSigner();
console.log("Mint Address:", mint.address.toString());

// Get default mint account size (in bytes), no extensions enabled
const space = BigInt(getMintSize());

// Get minimum balance for rent exemption
const rent = await rpc.getMinimumBalanceForRentExemption(space).send();

// Get latest blockhash to include in transaction
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

// Instruction to create new account for mint (token  program)
const createAccountInstruction = getCreateAccountInstruction({
  payer: feePayer,
  newAccount: mint,
  lamports: rent,
  space,
  programAddress: TOKEN_PROGRAM_ADDRESS,
});

// Instruction to initialize mint account data
const initializeMintInstruction = getInitializeMintInstruction({
  mint: mint.address,
  decimals: 2,
  mintAuthority: sender.address,
});

// Derive the ATAs for fee payer, sender and recipient
const [feePayerAssociatedTokenAddress] = await findAssociatedTokenPda({
  mint: mint.address,
  owner: feePayer.address,
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});

const [senderAssociatedTokenAddress] = await findAssociatedTokenPda({
  mint: mint.address,
  owner: sender.address,
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});

const [recipientAssociatedTokenAddress] = await findAssociatedTokenPda({
  mint: mint.address,
  owner: recipient.address,
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});

// Create instruction for fee payer's ATA
const createFeePayerAtaInstruction =
  await getCreateAssociatedTokenInstructionAsync({
    payer: feePayer,
    mint: mint.address,
    owner: feePayer.address,
  });

// Create instruction for sender's ATA
const createSenderAtaInstruction =
  await getCreateAssociatedTokenInstructionAsync({
    payer: feePayer,
    mint: mint.address,
    owner: sender.address,
  });

// Create instruction for recipient's ATA
const createRecipientAtaInstruction =
  await getCreateAssociatedTokenInstructionAsync({
    payer: feePayer,
    mint: mint.address,
    owner: recipient.address,
  });

// Create instruction to mint tokens to sender
const mintToInstruction = getMintToInstruction({
  mint: mint.address,
  token: senderAssociatedTokenAddress,
  mintAuthority: sender,
  amount: 100n,
});

// Combine all instructions in order
const instructions = [
  createAccountInstruction, // Create mint account
  initializeMintInstruction, // Initialize mint
  createFeePayerAtaInstruction, // Create fee payer's ATA
  createSenderAtaInstruction, // Create sender's ATA
  createRecipientAtaInstruction, // Create recipient's ATA
  mintToInstruction, // Mint tokens to sender
];

// Create transaction message
const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstructions(instructions, tx),
);

// Sign transaction message with all required signers
const signedTransaction =
  await signTransactionMessageWithSigners(transactionMessage);
assertIsTransactionWithBlockhashLifetime(signedTransaction);

// Send and confirm transaction
await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
  signedTransaction,
  { commitment: "confirmed" },
);

const transactionSignature = getSignatureFromTransaction(signedTransaction);
console.log("Transaction Signature:", transactionSignature);
console.log("Successfully minted 1.0 tokens");

// Get a fresh blockhash for the transfer transaction
const { value: transferBlockhash } = await rpc.getLatestBlockhash().send();

// Transfer tokens to recipient
const transferInstruction = getTransferInstruction({
  source: senderAssociatedTokenAddress,
  destination: recipientAssociatedTokenAddress,
  authority: sender,
  amount: 50n, // 0.50 tokens with 2 decimals
});

// Pay the fee payer in tokens to cover the transaction fees.
// For a real-world application, calculate this from the SOL fee.
const transferFeePayerInstruction = getTransferInstruction({
  source: senderAssociatedTokenAddress,
  destination: feePayerAssociatedTokenAddress,
  authority: sender,
  amount: 50n,
});

// Create transaction message for token transfer
const transferTxMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(transferBlockhash, tx),
  (tx) =>
    appendTransactionMessageInstructions(
      [transferInstruction, transferFeePayerInstruction],
      tx,
    ),
);

const signedTransferTx =
  await signTransactionMessageWithSigners(transferTxMessage);
assertIsTransactionWithBlockhashLifetime(signedTransferTx);

await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
  signedTransferTx,
  { commitment: "confirmed" },
);

const transactionSignature2 = getSignatureFromTransaction(signedTransferTx);
console.log("Transaction Signature:", transactionSignature2);
console.log("Successfully transferred 0.5 tokens");

const feePayerTokenAccount = await fetchToken(
  rpc,
  feePayerAssociatedTokenAddress,
  { commitment: "confirmed" },
);
const senderTokenAccount = await fetchToken(rpc, senderAssociatedTokenAddress, {
  commitment: "confirmed",
});
const recipientTokenAccount = await fetchToken(
  rpc,
  recipientAssociatedTokenAddress,
  { commitment: "confirmed" },
);

console.log("=== Final Balances ===");
console.log(
  "Fee Payer balance:",
  Number(feePayerTokenAccount.data.amount) / 100,
  "tokens",
);
console.log(
  "Sender balance:",
  Number(senderTokenAccount.data.amount) / 100,
  "tokens",
);
console.log(
  "Recipient balance:",
  Number(recipientTokenAccount.data.amount) / 100,
  "tokens",
);
// #endregion pay-fees
