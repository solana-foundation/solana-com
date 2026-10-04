// #region create
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
  AccountState,
  ExtensionType,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
  createInitializeDefaultAccountStateInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMint2Instruction,
  createInitializePausableConfigInstruction,
  createInitializePermanentDelegateInstruction,
  createInitializePermissionedBurnInstruction,
  createInitializeScaledUiAmountConfigInstruction,
  getMintLen,
} from "@solana/spl-token";
import {
  type TokenMetadata,
  createInitializeInstruction,
  pack,
} from "@solana/spl-token-metadata";

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

const payer = await loadKeypair(keypairFile("tokenization-demo.json"));

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// One address per operational power, from the keys generated in step 1.
const authorityAddress = async (role: string) =>
  (await loadKeypair(keypairFile(join("demo-authorities", `${role}.json`))))
    .publicKey;
const metadataAuthority = await authorityAddress("metadata");
const pauseAuthority = await authorityAddress("pause");
const permanentDelegate = await authorityAddress("delegate");
const burnAuthority = await authorityAddress("burn");

const mint = Keypair.generate();
const decimals = 6;
const metadata: TokenMetadata = {
  mint: mint.publicKey,
  name: "Demo Tokenized Note",
  symbol: "DEMOTN",
  uri: "https://example.com/demotn.json",
  updateAuthority: metadataAuthority,
  additionalMetadata: [],
};

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

// The same extension set the Mosaic tokenized-security template turns on.
// Default account state is Frozen: every new holder account starts frozen and
// is opened through the gate. Rent covers the metadata too; the account is
// allocated without it because initializing metadata reallocates the account.
const extensions = [
  ExtensionType.MetadataPointer,
  ExtensionType.PausableConfig,
  ExtensionType.DefaultAccountState,
  ExtensionType.ConfidentialTransferMint,
  ExtensionType.PermanentDelegate,
  ExtensionType.PermissionedBurn,
  ExtensionType.ScaledUiAmountConfig,
];
const mintLen = getMintLen(extensions);
const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
const lamports = await connection.getMinimumBalanceForRentExemption(
  mintLen + metadataLen,
);

// @solana/spl-token has no builder for the confidential transfer mint
// extension, so its initialize instruction (27, 0) is encoded directly:
// authority, auto-approve flag off, no auditor key.
const initializeConfidentialTransferMint = new TransactionInstruction({
  programId: TOKEN_2022_PROGRAM_ID,
  keys: [account(mint.publicKey, true)],
  data: Buffer.concat([
    Buffer.from([27, 0]),
    payer.publicKey.toBuffer(),
    Buffer.from([0]),
    Buffer.alloc(32),
  ]),
});

const mintInstructions = [
  SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint.publicKey,
    space: mintLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  }),
  // Extension configs are initialized before the mint itself.
  createInitializeMetadataPointerInstruction(
    mint.publicKey,
    metadataAuthority,
    mint.publicKey,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializePausableConfigInstruction(
    mint.publicKey,
    pauseAuthority,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializeDefaultAccountStateInstruction(
    mint.publicKey,
    AccountState.Frozen,
    TOKEN_2022_PROGRAM_ID,
  ),
  initializeConfidentialTransferMint,
  createInitializePermanentDelegateInstruction(
    mint.publicKey,
    permanentDelegate,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializePermissionedBurnInstruction(
    mint.publicKey,
    burnAuthority,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializeScaledUiAmountConfigInstruction(
    mint.publicKey,
    payer.publicKey,
    1,
    TOKEN_2022_PROGRAM_ID,
  ),
  // The freeze authority starts as the mint authority. Token ACL's create
  // config requires the current freeze authority to sign, then moves it to
  // the mint config account.
  createInitializeMint2Instruction(
    mint.publicKey,
    decimals,
    payer.publicKey,
    payer.publicKey,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializeInstruction({
    programId: TOKEN_2022_PROGRAM_ID,
    metadata: mint.publicKey,
    updateAuthority: metadataAuthority,
    mint: mint.publicKey,
    mintAuthority: payer.publicKey,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
  }),
];

// Token ACL config plus the gate program's allowlist, keyed by the mint
// authority and the mint. Permissionless thaw is what lets an allowlisted
// holder's account be opened by anyone who pays the fee.
const mintConfig = pda(TOKEN_ACL, "MINT_CONFIG", mint.publicKey);
const listConfig = pda(GATE, "list_config", payer.publicKey, mint.publicKey);
const extraMetas = pda(GATE, "thaw_extra_account_metas", mint.publicKey);
const signer = account(payer.publicKey, false, true);
const funder = account(payer.publicKey, true, true);
const gateInstructions = [
  // createConfig (0): payer, authority, mint, mint config, system, token program; data carries the gate program.
  new TransactionInstruction({
    programId: TOKEN_ACL,
    keys: [
      funder,
      signer,
      account(mint.publicKey, true),
      account(mintConfig, true),
      account(SystemProgram.programId),
      account(TOKEN_2022_PROGRAM_ID),
    ],
    data: Buffer.concat([Buffer.from([0]), GATE.toBuffer()]),
  }),
  // setGatingProgram (2): authority, mint config.
  new TransactionInstruction({
    programId: TOKEN_ACL,
    keys: [signer, account(mintConfig, true)],
    data: Buffer.concat([Buffer.from([2]), GATE.toBuffer()]),
  }),
  // togglePermissionlessInstructions (8): freeze off, thaw on.
  new TransactionInstruction({
    programId: TOKEN_ACL,
    keys: [signer, account(mintConfig, true)],
    data: Buffer.from([8, 0, 1]),
  }),
  // Gate createList (1): mode 0 is an allowlist; the seed is the mint.
  new TransactionInstruction({
    programId: GATE,
    keys: [
      signer,
      funder,
      account(listConfig, true),
      account(SystemProgram.programId),
    ],
    data: Buffer.concat([Buffer.from([1, 0]), mint.publicKey.toBuffer()]),
  }),
  // Gate setupExtraMetas (4): records the list as the account the gate reads on thaw.
  new TransactionInstruction({
    programId: GATE,
    keys: [
      signer,
      funder,
      account(mintConfig),
      account(mint.publicKey),
      account(extraMetas, true),
      account(SystemProgram.programId),
      account(listConfig),
    ],
    data: Buffer.from([4]),
  }),
];

await send(payer, [...mintInstructions, ...gateInstructions], [mint]);
console.log("Mint:", mint.publicKey.toBase58());
console.log("Freeze authority (Token ACL mint config):", mintConfig.toBase58());
console.log("Allowlist:", listConfig.toBase58());
// #endregion
