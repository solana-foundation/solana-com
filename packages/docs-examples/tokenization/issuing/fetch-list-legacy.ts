// #region fetch-list
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

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

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// $LIST is the allowlist address printed when the mint was created.
const listConfig = new PublicKey(env("LIST"));
const GATE = new PublicKey("GATEzzqxhJnsWF6vHRsgtixxSB8PaQdcqGEVTEHWiULz");

// ListConfig layout: discriminator (1), authority (32), seed (32), mode (1),
// wallet count (8). Mode 0 is an allowlist, 2 a blocklist.
const info = await connection.getAccountInfo(listConfig);
if (!info) throw new Error(`list ${listConfig.toBase58()} not found`);
const modes = ["allow", "unused", "block"];
console.log("List:", listConfig.toBase58());
console.log("Mode:", modes[info.data.readUInt8(65)]);
console.log("Authority:", new PublicKey(info.data.subarray(1, 33)).toBase58());

// Every approved wallet is its own 65-byte entry account: discriminator (1),
// wallet (32), list (32). Membership is read by filtering on the list pointer.
const entries = await connection.getProgramAccounts(GATE, {
  filters: [
    { dataSize: 65 },
    { memcmp: { offset: 33, bytes: listConfig.toBase58() } },
  ],
});
const wallets = entries.map(({ account }) =>
  new PublicKey(account.data.subarray(1, 33)).toBase58(),
);
console.log("Wallets:", wallets.length ? wallets : "none");
// #endregion
