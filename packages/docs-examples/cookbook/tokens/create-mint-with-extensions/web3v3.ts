// #region create
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js-v3";
import {
  AccountState,
  extension,
  getCreateMintInstructionPlan,
  getMintDecoder,
} from "@solana-program/token-2022";

const payer = await Keypair.generate();
const mint = await Keypair.generate();

const connection = new Connection("http://localhost:8899", "confirmed");

const airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  LAMPORTS_PER_SOL,
);
await connection.confirmTransaction(airdropSignature);

// A compliance-ready Token-2022 mint: onchain metadata, pausable transfers,
// a permanent delegate that can move or burn any balance, and token accounts
// that start frozen until the issuer thaws them.
const extensions = [
  extension("MetadataPointer", {
    authority: payer.publicKey.toBase58(),
    metadataAddress: mint.publicKey.toBase58(),
  }),
  extension("TokenMetadata", {
    updateAuthority: payer.publicKey.toBase58(),
    mint: mint.publicKey.toBase58(),
    name: "Example Stablecoin",
    symbol: "EXUSD",
    uri: "https://example.com/exusd.json",
    additionalMetadata: new Map<string, string>(),
  }),
  extension("PausableConfig", {
    authority: payer.publicKey.toBase58(),
    paused: false,
  }),
  extension("PermanentDelegate", { delegate: payer.publicKey.toBase58() }),
  extension("DefaultAccountState", { state: AccountState.Frozen }),
];

const transaction = new Transaction().add(
  await getCreateMintInstructionPlan(
    {
      getMinimumBalance: (space: number) =>
        connection.getMinimumBalanceForRentExemption(space),
    },
    {
      payer,
      newMint: mint,
      decimals: 6,
      mintAuthority: payer,
      freezeAuthority: payer.publicKey.toBase58(),
      extensions,
    },
  ),
);

const signature = await sendAndConfirmTransaction(connection, transaction, [
  payer,
  mint,
]);
console.log("Transaction Signature:", signature);

// Verify the mint and its extensions
const mintAccountInfo = await connection.getAccountInfo(mint.publicKey);
const mintAccount = getMintDecoder().decode(mintAccountInfo!.data);
const enabledExtensions =
  mintAccount.extensions.__option === "Some"
    ? mintAccount.extensions.value.map(({ __kind }) => __kind)
    : [];

console.log("Mint Address:", mint.publicKey.toBase58());
console.log("Decimals:", mintAccount.decimals);
console.log("Extensions:", enabledExtensions.join(", "));
// #endregion create
