// #region burn
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
  createPermissionedBurnCheckedInstruction,
  getAssociatedTokenAddressSync,
  getMint,
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

// A holder burn on a permissioned-burn mint needs two signatures: the holder
// and the burn authority configured on the mint.
const holder = await loadKeypair(keypairFile("demo-holder.json"));
const burnAuthority = await loadKeypair(
  keypairFile("demo-authorities/burn.json"),
);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mint = new PublicKey(env("MINT"));
const amount = arg(1, "the decimal amount");

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

// Scales a decimal amount to base units without going through a float.
function toBaseUnits(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");
  return BigInt(whole + fraction.padEnd(decimals, "0").slice(0, decimals));
}

const { decimals } = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);
const tokenAccount = getAssociatedTokenAddressSync(
  mint,
  holder.publicKey,
  false,
  TOKEN_2022_PROGRAM_ID,
);

// Token-2022 rejects a plain burn on this mint. The permissioned burn
// instruction carries both signers.
await send(
  holder,
  [
    createPermissionedBurnCheckedInstruction(
      tokenAccount,
      mint,
      holder.publicKey,
      burnAuthority.publicKey,
      toBaseUnits(amount, decimals),
      decimals,
      [],
      TOKEN_2022_PROGRAM_ID,
    ),
  ],
  [burnAuthority],
);
// #endregion
