// #region derive-ata
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
import {
  TOKEN_2022_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
} from "@solana-program/token-2022";

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

const mint = address(env("MINT"));
const owner = address(arg(1, "the custody wallet"));

// Deterministic: the address exists before the account does, so monitoring
// and reconciliation can be wired up ahead of the first transfer.
const [tokenAccount] = await findAssociatedTokenPda({
  mint,
  owner,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
console.log("Wallet address:", owner);
console.log("Associated token address:", tokenAccount);
// #endregion
