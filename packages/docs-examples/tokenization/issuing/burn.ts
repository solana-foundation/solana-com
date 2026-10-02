// #region burn
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  address,
  assertIsTransactionWithBlockhashLifetime,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  devnet,
  createKeyPairSignerFromBytes,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { createBurnTransaction } from "@solana/mosaic-sdk";

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

// A holder burn on a permissioned-burn mint needs two signatures: the holder
// and the burn authority configured on the mint.
const holder = await loadSigner(keypairFile("demo-holder.json"));
const burnAuthority = await loadSigner(
  keypairFile("demo-authorities/burn.json"),
);
// A plain Kit RPC pair: the Mosaic SDK types its RPC parameter as the full
// cluster API, which the RPC plugin's client object does not satisfy on Kit 8.
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const rpcSubscriptions = createSolanaRpcSubscriptions(
  devnet("wss://api.devnet.solana.com"),
);
const mint = address(env("MINT"));
const amount = Number(arg(1, "the decimal amount"));

const transaction = await createBurnTransaction(
  rpc,
  mint,
  holder,
  amount,
  holder,
  burnAuthority,
);

const signed = await signTransactionMessageWithSigners(transaction);
assertIsTransactionWithBlockhashLifetime(signed);
await sendAndConfirmTransactionFactory({
  rpc: rpc,
  rpcSubscriptions: rpcSubscriptions,
})(signed, { commitment: "confirmed" });
console.log("Signature:", getSignatureFromTransaction(signed));
// #endregion
