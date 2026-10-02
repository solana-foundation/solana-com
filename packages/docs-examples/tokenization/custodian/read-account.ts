// #region read-account
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  address,
  assertIsTransactionWithBlockhashLifetime,
  createClient,
  createKeyPairSignerFromBytes,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { solanaDevnetRpc } from "@solana/kit-plugin-rpc";
import { signer } from "@solana/kit-plugin-signer";
import type { Commitment } from "@solana/kit";
import { AccountState, fetchToken } from "@solana-program/token-2022";

// The same keypair files and environment variables the CLI tab uses.
const keypairFile = (name: string) =>
  join(homedir(), ".config", "solana", name);

async function loadSigner(path: string) {
  const bytes = JSON.parse(await readFile(path, "utf8")) as number[];
  return createKeyPairSignerFromBytes(new Uint8Array(bytes));
}

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`export ${name} before running this example`);
  return value;
}

function arg(index: number, name: string): string {
  const value = process.argv[index + 1];
  if (!value) throw new Error(`usage: pass ${name} as argument ${index}`);
  return value;
}

const custodian = await loadSigner(keypairFile("demo-custodian.json"));
const client = createClient().use(signer(custodian)).use(solanaDevnetRpc());
const tokenAccount = address(arg(1, "the token account address"));

// Read at a stated commitment level. Use "finalized" for anything that feeds
// a book of record; "confirmed" is enough for a display.
const commitment = (process.argv[3] ?? "confirmed") as Commitment;
const { data } = await fetchToken(client.rpc, tokenAccount, { commitment });

console.log("Mint:", data.mint);
console.log("Owner:", data.owner);
console.log("Balance (raw):", data.amount.toString());
console.log("State:", AccountState[data.state]);
// #endregion
