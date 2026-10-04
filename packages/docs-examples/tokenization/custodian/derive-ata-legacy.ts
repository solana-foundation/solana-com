// #region derive-ata
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

// The same keypair files and environment variables the CLI tab uses.
const keypairFile = (name: string) =>
  join(homedir(), ".config", "solana", name);

async function loadKeypair(path: string) {
  const bytes = JSON.parse(await readFile(path, "utf8")) as number[];
  return Keypair.fromSecretKey(Uint8Array.from(bytes));
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

const mint = new PublicKey(env("MINT"));
const owner = new PublicKey(arg(1, "the custody wallet"));

// Deterministic: the address exists before the account does, so monitoring
// and reconciliation can be wired up ahead of the first transfer.
const tokenAccount = getAssociatedTokenAddressSync(
  mint,
  owner,
  false,
  TOKEN_2022_PROGRAM_ID,
);
console.log("Wallet address:", owner.toBase58());
console.log("Associated token address:", tokenAccount.toBase58());
// #endregion
