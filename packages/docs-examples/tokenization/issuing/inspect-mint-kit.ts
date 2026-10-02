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
  type Option,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { solanaDevnetRpc } from "@solana/kit-plugin-rpc";
import { signer } from "@solana/kit-plugin-signer";
import { fetchMint } from "@solana-program/token-2022";
import { fetchMaybeMintConfig, findMintConfigPda } from "@solana/token-acl-sdk";

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

const unwrap = <T>(option: Option<T>) =>
  option.__option === "Some" ? option.value : null;

// The mint account carries the extensions. The Token ACL config is a separate
// account, derived from the mint, that holds the gate program and the
// permissionless-thaw flag.
const { data } = await fetchMint(client.rpc, mint, { commitment: "confirmed" });
const [mintConfigAddress] = await findMintConfigPda({ mint });
const mintConfig = await fetchMaybeMintConfig(client.rpc, mintConfigAddress);
const extensions =
  data.extensions.__option === "Some" ? data.extensions.value : [];
const pausable = extensions.find((ext) => ext.__kind === "PausableConfig");

console.log({
  mint,
  supply: data.supply.toString(),
  decimals: data.decimals,
  mintAuthority: unwrap(data.mintAuthority),
  freezeAuthority: unwrap(data.freezeAuthority),
  tokenAcl:
    mintConfig.exists && unwrap(data.freezeAuthority) === mintConfigAddress,
  gatingProgram: mintConfig.exists ? mintConfig.data.gatingProgram : null,
  permissionlessThaw: mintConfig.exists
    ? mintConfig.data.enablePermissionlessThaw
    : false,
  extensions: extensions.map((ext) => ext.__kind),
  paused: pausable?.__kind === "PausableConfig" ? pausable.paused : null,
});
// #endregion
