// #region create
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
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
  createInitializeMintInstruction,
  createInitializePausableConfigInstruction,
  createInitializePermanentDelegateInstruction,
  getMintLen,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  pack,
  type TokenMetadata,
} from "@solana/spl-token-metadata";

const payer = Keypair.generate();
const mint = Keypair.generate();

const connection = new Connection("http://localhost:8899", "confirmed");

const airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  LAMPORTS_PER_SOL,
);
await connection.confirmTransaction(airdropSignature);

// A compliance-ready Token-2022 mint: onchain metadata, pausable transfers,
// a permanent delegate that can move or burn any balance, and token accounts
// that start frozen until the issuer thaws them.
const metadata: TokenMetadata = {
  updateAuthority: payer.publicKey,
  mint: mint.publicKey,
  name: "Example Stablecoin",
  symbol: "EXUSD",
  uri: "https://example.com/exusd.json",
  additionalMetadata: [],
};

// Token metadata is written after the mint is initialized, so allocate the
// account without it but fund rent for the full size.
const mintLen = getMintLen([
  ExtensionType.MetadataPointer,
  ExtensionType.PausableConfig,
  ExtensionType.PermanentDelegate,
  ExtensionType.DefaultAccountState,
]);
const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
const rent = await connection.getMinimumBalanceForRentExemption(
  mintLen + metadataLen,
);

const transaction = new Transaction().add(
  SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint.publicKey,
    space: mintLen,
    lamports: rent,
    programId: TOKEN_2022_PROGRAM_ID,
  }),
  createInitializeMetadataPointerInstruction(
    mint.publicKey,
    payer.publicKey,
    mint.publicKey,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializePausableConfigInstruction(
    mint.publicKey,
    payer.publicKey,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializePermanentDelegateInstruction(
    mint.publicKey,
    payer.publicKey,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializeDefaultAccountStateInstruction(
    mint.publicKey,
    AccountState.Frozen,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializeMintInstruction(
    mint.publicKey,
    6,
    payer.publicKey,
    payer.publicKey,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializeInstruction({
    programId: TOKEN_2022_PROGRAM_ID,
    metadata: mint.publicKey,
    updateAuthority: payer.publicKey,
    mint: mint.publicKey,
    mintAuthority: payer.publicKey,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
  }),
);

const signature = await sendAndConfirmTransaction(connection, transaction, [
  payer,
  mint,
]);
console.log("Transaction Signature:", signature);
console.log("Mint Address:", mint.publicKey.toBase58());
// #endregion create
