// #region transfer
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
import {
  TOKEN_2022_PROGRAM_ID,
  TokenAccountNotFoundError,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAccount,
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

// The holder signs its own transfer, matching --keypair demo-holder.json.
const holder = await loadKeypair(keypairFile("demo-holder.json"));

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mint = new PublicKey(env("MINT"));
const recipient = new PublicKey(arg(1, "the recipient wallet"));
const amount = arg(2, "the decimal amount");

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

// A missing account counts as frozen: it will be created frozen by default.
async function tokenAccountState(address: PublicKey) {
  try {
    const info = await getAccount(
      connection,
      address,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
    return { exists: true, frozen: info.isFrozen };
  } catch (error) {
    if (error instanceof TokenAccountNotFoundError)
      return { exists: false, frozen: true };
    throw error;
  }
}

// Token ACL thawPermissionless (discriminator 6). The program checks the owner
// with the gate program, which reads three extra accounts after the fixed
// nine: its extra-metas record for the mint, the allowlist, and the owner's
// entry on that list. The tutorial's list is keyed by the mint authority and
// the mint, which is how Mosaic derives it.
function thawThroughGate(
  authority: PublicKey,
  tokenAccount: PublicKey,
  owner: PublicKey,
  listAuthority: PublicKey,
) {
  const mintConfig = pda(TOKEN_ACL, "MINT_CONFIG", mint);
  const flagAccount = pda(TOKEN_ACL, "FLAG_ACCOUNT", tokenAccount);
  const extraMetas = pda(GATE, "thaw_extra_account_metas", mint);
  const listConfig = pda(GATE, "list_config", listAuthority, mint);
  const walletEntry = pda(GATE, "wallet_entry", listConfig, owner);
  return new TransactionInstruction({
    programId: TOKEN_ACL,
    keys: [
      account(authority, true, true),
      account(mint),
      account(tokenAccount, true),
      account(flagAccount, true),
      account(owner),
      account(mintConfig),
      account(TOKEN_2022_PROGRAM_ID),
      account(SystemProgram.programId),
      account(GATE),
      account(extraMetas),
      account(listConfig),
      account(walletEntry),
    ],
    data: Buffer.from([6]),
  });
}

const mintInfo = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);
const source = getAssociatedTokenAddressSync(
  mint,
  holder.publicKey,
  false,
  TOKEN_2022_PROGRAM_ID,
);
const destination = getAssociatedTokenAddressSync(
  mint,
  recipient,
  false,
  TOKEN_2022_PROGRAM_ID,
);
const state = await tokenAccountState(destination);
const instructions: TransactionInstruction[] = [];

// The recipient's account is created if needed and thawed through the gate.
// The thaw is where an unlisted recipient fails: the gate rejects the owner
// and the whole transaction is dropped before any token moves.
if (!state.exists) {
  instructions.push(
    createAssociatedTokenAccountIdempotentInstruction(
      holder.publicKey,
      destination,
      recipient,
      mint,
      TOKEN_2022_PROGRAM_ID,
    ),
  );
}
if (state.frozen) {
  instructions.push(
    thawThroughGate(
      holder.publicKey,
      destination,
      recipient,
      mintInfo.mintAuthority ?? holder.publicKey,
    ),
  );
}
instructions.push(
  createTransferCheckedInstruction(
    source,
    mint,
    destination,
    holder.publicKey,
    toBaseUnits(amount, mintInfo.decimals),
    mintInfo.decimals,
    [],
    TOKEN_2022_PROGRAM_ID,
  ),
);

await send(holder, instructions);
// #endregion
