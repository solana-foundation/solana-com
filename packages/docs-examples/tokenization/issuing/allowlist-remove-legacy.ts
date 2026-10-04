// #region allowlist-remove
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
  TokenAccountNotFoundError,
  getAccount,
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

// The list authority is the key that created the mint.
const payer = await loadKeypair(keypairFile("tokenization-demo.json"));

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mint = new PublicKey(env("MINT"));
const wallet = new PublicKey(arg(1, "the wallet to remove"));

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

const listConfig = pda(GATE, "list_config", payer.publicKey, mint);
const walletEntry = pda(GATE, "wallet_entry", listConfig, wallet);

// Gate removeWallet (discriminator 3): authority, list, entry.
const instructions = [
  new TransactionInstruction({
    programId: GATE,
    keys: [
      account(payer.publicKey, true, true),
      account(listConfig, true),
      account(walletEntry, true),
    ],
    data: Buffer.from([3]),
  }),
];

// Removing the entry stops future thaws. It does not touch an account that is
// already open, so the wallet's existing token account is frozen in the same
// transaction with Token ACL freeze (discriminator 5): authority, mint, token
// account, mint config, token program.
const tokenAccount = getAssociatedTokenAddressSync(
  mint,
  wallet,
  false,
  TOKEN_2022_PROGRAM_ID,
);
const state = await tokenAccountState(tokenAccount);
if (state.exists && !state.frozen) {
  instructions.push(
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
  );
}

await send(payer, instructions);
// #endregion
