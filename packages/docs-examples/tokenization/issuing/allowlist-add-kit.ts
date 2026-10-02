// #region allowlist-add
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  address,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createClient,
  createKeyPairSignerFromBytes,
  createTransactionMessage,
  getSignatureFromTransaction,
  type Instruction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type TransactionSigner,
} from "@solana/kit";
import { solanaDevnetRpc } from "@solana/kit-plugin-rpc";
import { signer } from "@solana/kit-plugin-signer";
import {
  findListConfigPda,
  findWalletEntryPda,
  getAddWalletInstruction,
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

function arg(index: number, name: string): string {
  const value = process.argv[index + 1];
  if (!value) throw new Error(`usage: pass ${name} as argument ${index}`);
  return value;
}

// The list authority is the key that created the mint.
const payer = await loadSigner(keypairFile("tokenization-demo.json"));
const client = createClient().use(signer(payer)).use(solanaDevnetRpc());
const mint = address(env("MINT"));
const wallet = address(arg(1, "the wallet to approve"));

// Builds one transaction from the instructions, signs it with every signer
// they reference, sends it, and prints the signature.
async function send(feePayer: TransactionSigner, instructions: Instruction[]) {
  const { value: latestBlockhash } = await client.rpc
    .getLatestBlockhash()
    .send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(feePayer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) => appendTransactionMessageInstructions(instructions, m),
  );
  const signed = await signTransactionMessageWithSigners(message);
  assertIsTransactionWithBlockhashLifetime(signed);
  await sendAndConfirmTransactionFactory({
    rpc: client.rpc,
    rpcSubscriptions: client.rpcSubscriptions,
  })(signed, { commitment: "confirmed" });
  console.log("Signature:", getSignatureFromTransaction(signed));
}

// The allowlist is a gate-program account keyed by its authority and the mint.
// Each approved wallet gets its own entry account under that list.
const [listConfig] = await findListConfigPda({
  authority: payer.address,
  seed: mint,
});
const [walletEntry] = await findWalletEntryPda({ listConfig, wallet });

// Membership alone lets the wallet's token account be thawed through the gate.
// If the wallet already holds a frozen account, thaw it afterwards.
await send(payer, [
  getAddWalletInstruction({
    authority: payer,
    payer,
    listConfig,
    wallet,
    walletEntry,
  }),
]);
// #endregion
