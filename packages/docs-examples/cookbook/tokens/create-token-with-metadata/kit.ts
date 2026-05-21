// #region create
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { solanaLocalRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer as kitPayer } from "@solana/kit-plugin-signer";
import {
  getCreateV1InstructionAsync,
  fetchMetadataFromSeeds,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata-kit";

const payer = await generateKeyPairSigner();
const mint = await generateKeyPairSigner();

const client = await createClient()
  .use(kitPayer(payer))
  .use(solanaLocalRpc())
  .use(airdropPayer(lamports(1_000_000_000n)));

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

const { context } = await client.sendTransaction([createInstruction]);
console.log("Transaction Signature:", context.signature);

// Verify metadata was created
const metadata = await fetchMetadataFromSeeds(client.rpc, {
  mint: mint.address,
});

console.log("Mint Address:", mint.address);
console.log("Token Name:", metadata.data.name);
console.log("Token Symbol:", metadata.data.symbol);
console.log("Metadata URI:", metadata.data.uri);
// #endregion create
