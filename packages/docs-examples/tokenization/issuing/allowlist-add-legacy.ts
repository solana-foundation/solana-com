// #region allowlist-add
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

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

function arg(index: number, name: string): string {
  const value = process.argv[index + 1];
  if (!value) throw new Error(`usage: pass ${name} as argument ${index}`);
  return value;
}

// The list authority is the key that created the mint.
const payer = await loadKeypair(keypairFile("tokenization-demo.json"));

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mint = new PublicKey(env("MINT"));
const wallet = new PublicKey(arg(1, "the wallet to approve"));

// Signs with the fee payer plus any extra signers, sends, and prints the signature.
async function send(
  feePayer: Keypair,
  instructions: TransactionInstruction[],
  signers: Keypair[] = [],
) {
  const transaction = new Transaction().add(...instructions);
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [feePayer, ...signers],
    { commitment: "confirmed" },
  );
  console.log("Signature:", signature);
}

// Token ACL and its gate program have no web3.js client. Each instruction is
// one discriminator byte followed by an account list, so they are built here.
const TOKEN_ACL = new PublicKey("TACLkU6CiCdkQN2MjoyDkVg2yAH9zkxiHDsiztQ52TP");
const GATE = new PublicKey("GATEzzqxhJnsWF6vHRsgtixxSB8PaQdcqGEVTEHWiULz");
const pda = (program: PublicKey, ...seeds: (string | PublicKey)[]) =>
  PublicKey.findProgramAddressSync(
    seeds.map((seed) =>
      typeof seed === "string" ? Buffer.from(seed) : seed.toBuffer(),
    ),
    program,
  )[0];
const account = (pubkey: PublicKey, isWritable = false, isSigner = false) => ({
  pubkey,
  isWritable,
  isSigner,
});

// The allowlist is a gate-program account keyed by its authority and the mint.
// Each approved wallet gets its own entry account under that list.
const listConfig = pda(GATE, "list_config", payer.publicKey, mint);
const walletEntry = pda(GATE, "wallet_entry", listConfig, wallet);

// Gate addWallet (discriminator 2): authority, payer, list, wallet, entry,
// system program. Membership alone lets the wallet's token account be thawed
// through the gate. If the wallet already holds a frozen account, thaw it
// afterwards.
await send(payer, [
  new TransactionInstruction({
    programId: GATE,
    keys: [
      account(payer.publicKey, false, true),
      account(payer.publicKey, true, true),
      account(listConfig, true),
      account(wallet),
      account(walletEntry, true),
      account(SystemProgram.programId),
    ],
    data: Buffer.from([2]),
  }),
]);
// #endregion
