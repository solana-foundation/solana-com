// #region read-account
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  Connection,
  Keypair,
  PublicKey,
  type Commitment,
} from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, getAccount } from "@solana/spl-token";

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

const tokenAccount = new PublicKey(arg(1, "the token account address"));

// Read at a stated commitment level. Use "finalized" for anything that feeds
// a book of record; "confirmed" is enough for a display.
const commitment = (process.argv[3] ?? "confirmed") as Commitment;
const connection = new Connection("https://api.devnet.solana.com", commitment);
const info = await getAccount(
  connection,
  tokenAccount,
  commitment,
  TOKEN_2022_PROGRAM_ID,
);

console.log("Mint:", info.mint.toBase58());
console.log("Owner:", info.owner.toBase58());
console.log("Balance (raw):", info.amount.toString());
console.log("State:", info.isFrozen ? "Frozen" : "Initialized");
// #endregion
