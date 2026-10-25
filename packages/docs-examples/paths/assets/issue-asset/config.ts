// #region config
import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Instruction,
  type Signature,
  type TransactionSigner,
} from "@solana/kit";

export const RPC_URL = process.env.RPC_URL ?? "https://api.devnet.solana.com";
export const RPC_SUBSCRIPTIONS_URL =
  process.env.RPC_SUBSCRIPTIONS_URL ?? "wss://api.devnet.solana.com";

export const rpc = createSolanaRpc(RPC_URL);
const rpcSubscriptions = createSolanaRpcSubscriptions(RPC_SUBSCRIPTIONS_URL);
const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
  rpc,
  rpcSubscriptions,
});

/** Build, sign, send and confirm one transaction; returns its signature. */
export async function send(
  feePayer: TransactionSigner,
  instructions: Instruction[],
  options: { skipPreflight?: boolean } = {},
) {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(feePayer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) => appendTransactionMessageInstructions(instructions, m),
  );
  const transaction = await signTransactionMessageWithSigners(message);
  assertIsTransactionWithBlockhashLifetime(transaction);
  const signature = getSignatureFromTransaction(transaction);
  try {
    await sendAndConfirmTransaction(transaction, {
      commitment: "confirmed",
      skipPreflight: options.skipPreflight,
    });
  } catch (error) {
    // Keep the signature (a skipPreflight failure still landed onchain) and
    // the message (to decode program errors) on the error.
    throw Object.assign(error as object, {
      signature,
      transactionMessage: message,
    });
  }
  return signature;
}

/** The network fee a confirmed transaction paid, in lamports. */
export async function fee(signature: Signature) {
  const tx = await rpc
    .getTransaction(signature, {
      commitment: "confirmed",
      encoding: "json",
      maxSupportedTransactionVersion: 0,
    })
    .send();
  return tx?.meta?.fee ?? 0n;
}
// #endregion config
