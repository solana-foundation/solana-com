// #region inspect
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
import { inspectToken } from "@solana/mosaic-sdk";

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

const payer = await loadSigner(keypairFile("tokenization-demo.json"));
const client = createClient().use(signer(payer)).use(solanaDevnetRpc());
const mint = address(env("MINT"));

const token = await inspectToken(client.rpc, mint, "confirmed");
console.log({
  mint: token.address,
  supply: token.supplyInfo.supply.toString(),
  decimals: token.supplyInfo.decimals,
  authorities: token.authorities,
  extensions: token.extensions.map((extension) => extension.name),
  aclMode: token.aclMode,
  tokenAcl: token.enableSrfc37,
  scaledUiAmount: token.scaledUiAmount,
  patterns: token.detectedPatterns,
});
// #endregion
