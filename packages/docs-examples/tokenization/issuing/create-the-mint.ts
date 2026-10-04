// #region create
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
import { generateKeyPairSigner } from "@solana/kit";
import {
  createTokenizedSecurityInitTransaction,
  getListConfigPda,
  inspectToken,
} from "@solana/mosaic-sdk";

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
// A plain Kit RPC pair: the Mosaic SDK types its RPC parameter as the full
// cluster API, which the RPC plugin's client object does not satisfy on Kit 8.
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const rpcSubscriptions = createSolanaRpcSubscriptions(
  devnet("wss://api.devnet.solana.com"),
);

// One address per operational power, from the keys generated in step 1.
const authorityAddress = async (role: string) =>
  (await loadSigner(keypairFile(join("demo-authorities", `${role}.json`))))
    .address;

const mint = await generateKeyPairSigner();

// The fee payer is also the mint authority here, so the same transaction can
// provision the Token ACL config, the allowlist, and permissionless thaw.
const transaction = await createTokenizedSecurityInitTransaction(
  rpc,
  "Demo Tokenized Note",
  "DEMOTN",
  6,
  "https://example.com/demotn.json",
  payer,
  mint,
  payer,
  undefined,
  {
    aclMode: "allowlist",
    enableSrfc37: true,
    metadataAuthority: await authorityAddress("metadata"),
    pausableAuthority: await authorityAddress("pause"),
    permanentDelegateAuthority: await authorityAddress("delegate"),
    permissionedBurnAuthority: await authorityAddress("burn"),
  },
);

const signed = await signTransactionMessageWithSigners(transaction);
assertIsTransactionWithBlockhashLifetime(signed);
await sendAndConfirmTransactionFactory({
  rpc: rpc,
  rpcSubscriptions: rpcSubscriptions,
})(signed, { commitment: "confirmed" });
console.log("Signature:", getSignatureFromTransaction(signed));

const inspection = await inspectToken(rpc, mint.address, "confirmed");
console.log("Mint:", mint.address);
console.log(
  "Freeze authority (Token ACL mint config):",
  inspection.authorities.freezeAuthority,
);
console.log(
  "Allowlist:",
  await getListConfigPda({ authority: payer.address, mint: mint.address }),
);
// #endregion
