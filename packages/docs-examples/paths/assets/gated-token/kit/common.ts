// #region common
// common.ts: the connection, key files, and send helper every script imports.
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getSignatureFromTransaction,
  isSolanaError,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SEND_TRANSACTION_PREFLIGHT_FAILURE,
  type Instruction,
  type TransactionSigner,
} from "@solana/kit";

// Devnet unless RPC_URL and RPC_SUBSCRIPTIONS_URL point somewhere else, for
// example a local Surfpool at http://127.0.0.1:8899 and ws://127.0.0.1:8900.
export const rpc = createSolanaRpc(
  process.env.RPC_URL ?? "https://api.devnet.solana.com",
);
export const rpcSubscriptions = createSolanaRpcSubscriptions(
  process.env.RPC_SUBSCRIPTIONS_URL ?? "wss://api.devnet.solana.com",
);

// Key files live in ~/.config/solana, as solana-keygen writes them.
export async function loadSigner(name: string) {
  const path = join(homedir(), ".config", "solana", `${name}.json`);
  const bytes = JSON.parse(await readFile(path, "utf8")) as number[];
  return createKeyPairSignerFromBytes(new Uint8Array(bytes));
}

export function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`export ${name} before running this script`);
  return value;
}

export function arg(index: number, name: string): string {
  const value = process.argv[index + 1];
  if (!value) throw new Error(`pass ${name} as argument ${index}`);
  return value;
}

const sendAndConfirm = sendAndConfirmTransactionFactory({
  rpc,
  rpcSubscriptions,
});

// Builds one transaction from the instructions, signs it with every signer
// they reference, sends it, and waits for "confirmed". A rejected transaction
// prints the program error and sets a non-zero exit code instead of throwing.
export async function send(
  feePayer: TransactionSigner,
  instructions: Instruction[],
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
  try {
    await sendAndConfirm(transaction, { commitment: "confirmed" });
    console.log("Signature:", getSignatureFromTransaction(transaction));
  } catch (error) {
    const logs = isSolanaError(
      error,
      SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SEND_TRANSACTION_PREFLIGHT_FAILURE,
    )
      ? (error.context.logs ?? [])
      : [];
    // The first failing program in the log is where the transaction stopped.
    const failed = logs.find((line) => line.includes(" failed: "));
    console.log("Failed:", failed ?? (error as Error).message);
    process.exitCode = 1;
  }
}

// Scales a decimal amount such as "1.5" to base units without a float.
export function toBaseUnits(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");
  return BigInt(whole + fraction.padEnd(decimals, "0").slice(0, decimals));
}
// #endregion common
