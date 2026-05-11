// #region sponsor
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
const rent = await rpc.getMinimumBalanceForRentExemption(space).send();
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

// Instructions to create + initialize the mint, and create the ATAs
const createAccountInstruction = getCreateAccountInstruction({
  payer: feePayer,
  newAccount: mint,
  lamports: rent,
  space,
  programAddress: TOKEN_PROGRAM_ADDRESS,
});

const initializeMintInstruction = getInitializeMintInstruction({
  mint: mint.address,
  decimals: 2,
  mintAuthority: sender.address,
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

console.log("Sender ATA:", senderAssociatedTokenAddress.toString());
console.log("Recipient ATA:", recipientAssociatedTokenAddress.toString());

const createSenderAtaInstruction =
  await getCreateAssociatedTokenInstructionAsync({
    payer: feePayer,
    mint: mint.address,
    owner: sender.address,
  });

const createRecipientAtaInstruction =
  await getCreateAssociatedTokenInstructionAsync({
    payer: feePayer,
    mint: mint.address,
    owner: recipient.address,
  });

const mintToInstruction = getMintToInstruction({
  mint: mint.address,
  token: senderAssociatedTokenAddress,
  mintAuthority: sender,
  amount: 100n,
});

const instructions = [
  createAccountInstruction,
  initializeMintInstruction,
  createSenderAtaInstruction,
  createRecipientAtaInstruction,
  mintToInstruction,
];

const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstructions(instructions, tx),
);

const signedTransaction =
  await signTransactionMessageWithSigners(transactionMessage);
assertIsTransactionWithBlockhashLifetime(signedTransaction);

await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
  signedTransaction,
  { commitment: "confirmed" },
);

const transactionSignature = getSignatureFromTransaction(signedTransaction);
console.log("Transaction Signature:", transactionSignature);
console.log("Successfully minted 1.0 tokens");

// Transfer 0.50 tokens from sender to recipient — fee paid by feePayer
const { value: transferBlockhash } = await rpc.getLatestBlockhash().send();

const transferInstruction = getTransferInstruction({
  source: senderAssociatedTokenAddress,
  destination: recipientAssociatedTokenAddress,
  authority: sender,
  amount: 50n,
});

const transferTxMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(transferBlockhash, tx),
  (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
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
  "Sender balance:",
  Number(senderTokenAccount.data.amount) / 100,
  "tokens",
);
console.log(
  "Recipient balance:",
  Number(recipientTokenAccount.data.amount) / 100,
  "tokens",
);
// #endregion sponsor
