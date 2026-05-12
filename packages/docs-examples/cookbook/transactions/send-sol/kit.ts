// #region transfer
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
import { getTransferSolInstruction } from "@solana-program/system";

const rpc = createSolanaRpc("http://localhost:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://localhost:8900");

const sender = await generateKeyPairSigner();
const recipient = await generateKeyPairSigner();

const LAMPORTS_PER_SOL = 1_000_000_000n;
const transferAmount = lamports(LAMPORTS_PER_SOL / 100n); // 0.01 SOL

await airdropFactory({ rpc, rpcSubscriptions })({
  recipientAddress: sender.address,
  lamports: lamports(LAMPORTS_PER_SOL), // 1 SOL
  commitment: "confirmed",
});

const transferInstruction = getTransferSolInstruction({
  source: sender,
  destination: recipient.address,
  amount: transferAmount,
});

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(sender, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
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
// #endregion transfer
