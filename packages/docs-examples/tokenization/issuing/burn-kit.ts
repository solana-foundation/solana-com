// #region burn
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
  TOKEN_2022_PROGRAM_ADDRESS,
  fetchMint,
  findAssociatedTokenPda,
  getPermissionedBurnCheckedInstruction,
} from "@solana-program/token-2022";

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
const client = createClient().use(signer(holder)).use(solanaDevnetRpc());
const mint = address(env("MINT"));
const amount = arg(1, "the decimal amount");

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

// Scales a decimal amount to base units without going through a float.
function toBaseUnits(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");
  return BigInt(whole + fraction.padEnd(decimals, "0").slice(0, decimals));
}

const { data: mintData } = await fetchMint(client.rpc, mint);
const [tokenAccount] = await findAssociatedTokenPda({
  mint,
  owner: holder.address,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});

// Token-2022 rejects a plain burn on this mint. The permissioned burn
// instruction carries both signers.
await send(holder, [
  getPermissionedBurnCheckedInstruction({
    account: tokenAccount,
    mint,
    permissionedBurnAuthority: burnAuthority,
    authority: holder,
    amount: toBaseUnits(amount, mintData.decimals),
    decimals: mintData.decimals,
  }),
]);
// #endregion
