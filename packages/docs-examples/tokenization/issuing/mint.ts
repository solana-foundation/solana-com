// #region mint
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
import { createMintToTransaction } from "@solana/mosaic-sdk";

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

const payer = await loadSigner(keypairFile("tokenization-demo.json"));
const client = createClient().use(signer(payer)).use(solanaDevnetRpc());
const mint = address(env("MINT"));
const recipient = address(arg(1, "the recipient wallet"));
const amount = Number(arg(2, "the decimal amount"));

// Creates the recipient's token account, thaws it through the Token ACL gate,
// and mints, in one transaction. The fee payer holds the mint authority here.
const transaction = await createMintToTransaction(
  client.rpc,
  mint,
  recipient,
  amount,
  payer,
  payer,
);

const signed = await signTransactionMessageWithSigners(transaction);
assertIsTransactionWithBlockhashLifetime(signed);
await sendAndConfirmTransactionFactory({
  rpc: client.rpc,
  rpcSubscriptions: client.rpcSubscriptions,
})(signed, { commitment: "confirmed" });
console.log("Signature:", getSignatureFromTransaction(signed));
// #endregion
