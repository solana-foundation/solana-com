// #region fetch-list
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  address,
  assertIsTransactionWithBlockhashLifetime,
  type Base58EncodedBytes,
  createClient,
  createKeyPairSignerFromBytes,
  getBase64Encoder,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { solanaDevnetRpc } from "@solana/kit-plugin-rpc";
import { signer } from "@solana/kit-plugin-signer";
import {
  Mode,
  TOKEN_ACL_GATE_PROGRAM_PROGRAM_ADDRESS,
  fetchListConfig,
  getWalletEntryDecoder,
  getWalletEntrySize,
} from "@solana/token-acl-gate-sdk";

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

// $LIST is the allowlist address printed when the mint was created.
const listConfig = address(env("LIST"));
const { data: list } = await fetchListConfig(client.rpc, listConfig);
console.log("List:", listConfig);
console.log("Mode:", Mode[list.mode]);
console.log("Authority:", list.authority);

// Every approved wallet is its own entry account that points back at the list,
// so the membership is read with a program-accounts query on that pointer.
const entries = await client.rpc
  .getProgramAccounts(TOKEN_ACL_GATE_PROGRAM_PROGRAM_ADDRESS, {
    encoding: "base64",
    filters: [
      { dataSize: BigInt(getWalletEntrySize()) },
      {
        memcmp: {
          offset: 33n,
          bytes: listConfig as string as Base58EncodedBytes,
          encoding: "base58",
        },
      },
    ],
  })
  .send();
const wallets = entries.map(
  ({ account }) =>
    getWalletEntryDecoder().decode(getBase64Encoder().encode(account.data[0]))
      .walletAddress,
);
console.log("Wallets:", wallets.length ? wallets : "none");
// #endregion
