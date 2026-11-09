// #region common
// common.ts: the connection, key files, and send helper every script imports.
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SendTransactionError,
  Transaction,
} from "@solana/web3.js-v3";

// Devnet unless RPC_URL and RPC_SUBSCRIPTIONS_URL point somewhere else, for
// example a local Surfpool at http://127.0.0.1:8899 and ws://127.0.0.1:8900.
export const connection = new Connection(
  process.env.RPC_URL ?? "https://api.devnet.solana.com",
  {
    commitment: "confirmed",
    wsEndpoint: process.env.RPC_SUBSCRIPTIONS_URL,
  },
);

// Key files live in ~/.config/solana, as solana-keygen writes them.
export async function loadKeypair(name: string) {
  const path = join(homedir(), ".config", "solana", `${name}.json`);
  const bytes = JSON.parse(await readFile(path, "utf8")) as number[];
  return Keypair.fromSecretKey(new Uint8Array(bytes));
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

// The program clients take addresses, which toBase58() returns in v3.
export const addressOf = (value: string) => new PublicKey(value).toBase58();

// Sends the instructions in one transaction, paid by the first signer, and
// waits for "confirmed". A rejected transaction prints the program error and
// sets a non-zero exit code instead of throwing.
export async function send(
  signers: Keypair[],
  instructions: Parameters<Transaction["add"]>,
) {
  try {
    const signature = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(...instructions),
      signers,
    );
    console.log("Signature:", signature);
  } catch (error) {
    if (!(error instanceof SendTransactionError)) throw error;
    // The first failing program in the log is where the transaction stopped.
    const failed = error.logs?.find((line) => line.includes(" failed: "));
    console.log("Failed:", failed ?? error.transactionError.message);
    process.exitCode = 1;
  }
}

// Scales a decimal amount such as "1.5" to base units without a float.
export function toBaseUnits(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");
  return BigInt(whole + fraction.padEnd(decimals, "0").slice(0, decimals));
}
// #endregion common
