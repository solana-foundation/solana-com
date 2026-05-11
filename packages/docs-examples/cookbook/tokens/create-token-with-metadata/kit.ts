// #region create
import {
  airdropFactory,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import {
  getCreateV1InstructionAsync,
  fetchMetadataFromSeeds,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata-kit";

// Create connection to local validator
const rpc = createSolanaRpc("http://127.0.0.1:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://127.0.0.1:8900");

// Generate keypairs
const payer = await generateKeyPairSigner();
const mint = await generateKeyPairSigner();

// Airdrop SOL to payer
const airdrop = airdropFactory({ rpc, rpcSubscriptions });
await airdrop({
  recipientAddress: payer.address,
  lamports: lamports(1_000_000_000n),
  commitment: "confirmed",
});

// Create token with metadata
const createInstruction = await getCreateV1InstructionAsync({
  mint,
  authority: payer,
  payer,
  name: "My Token",
  symbol: "MTK",
  uri: "https://example.com/token-metadata.json",
  sellerFeeBasisPoints: 0, // 0% royalty (use 500 for 5%)
  tokenStandard: TokenStandard.Fungible,
});

// Build and send transaction
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(payer, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstructions([createInstruction], tx),
);

const signedTransaction =
  await signTransactionMessageWithSigners(transactionMessage);
assertIsTransactionWithBlockhashLifetime(signedTransaction);

await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
  signedTransaction,
  { commitment: "confirmed" },
);

// Verify metadata was created
const metadata = await fetchMetadataFromSeeds(rpc, { mint: mint.address });

console.log("Mint Address:", mint.address);
console.log("Token Name:", metadata.data.name);
console.log("Token Symbol:", metadata.data.symbol);
console.log("Metadata URI:", metadata.data.uri);
// #endregion create
