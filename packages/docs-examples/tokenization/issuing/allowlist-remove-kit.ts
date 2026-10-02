// #region allowlist-remove
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
  AccountState,
  TOKEN_2022_PROGRAM_ADDRESS,
  fetchMaybeToken,
  findAssociatedTokenPda,
} from "@solana-program/token-2022";
import { findMintConfigPda, getFreezeInstruction } from "@solana/token-acl-sdk";
import {
  findListConfigPda,
  findWalletEntryPda,
  getRemoveWalletInstruction,
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
const wallet = address(arg(1, "the wallet to remove"));

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

const [listConfig] = await findListConfigPda({
  authority: payer.address,
  seed: mint,
});
const [walletEntry] = await findWalletEntryPda({ listConfig, wallet });
const instructions: Instruction[] = [
  getRemoveWalletInstruction({ authority: payer, listConfig, walletEntry }),
];

// Removing the entry stops future thaws. It does not touch an account that is
// already open, so the wallet's existing token account is frozen in the same
// transaction, through Token ACL, which holds the mint's freeze authority.
const [tokenAccount] = await findAssociatedTokenPda({
  mint,
  owner: wallet,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
const account = await fetchMaybeToken(client.rpc, tokenAccount);
if (account.exists && account.data.state !== AccountState.Frozen) {
  const [mintConfig] = await findMintConfigPda({ mint });
  instructions.push(
    getFreezeInstruction({ authority: payer, mint, tokenAccount, mintConfig }),
  );
}

await send(payer, instructions);
// #endregion
