// #region freeze
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

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

// The Token ACL config authority is the key that created the mint.
const payer = await loadKeypair(keypairFile("tokenization-demo.json"));

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mint = new PublicKey(env("MINT"));
const wallet = new PublicKey(arg(1, "the holder wallet to freeze"));

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

const tokenAccount = getAssociatedTokenAddressSync(
  mint,
  wallet,
  false,
  TOKEN_2022_PROGRAM_ID,
);

// Token ACL freeze (discriminator 5): authority, mint, token account, mint
// config, token program. Token ACL holds the mint's freeze authority, so the
// config authority signs.
await send(payer, [
  new TransactionInstruction({
    programId: TOKEN_ACL,
    keys: [
      account(payer.publicKey, false, true),
      account(mint),
      account(tokenAccount, true),
      account(pda(TOKEN_ACL, "MINT_CONFIG", mint)),
      account(TOKEN_2022_PROGRAM_ID),
    ],
    data: Buffer.from([5]),
  }),
]);
// #endregion
