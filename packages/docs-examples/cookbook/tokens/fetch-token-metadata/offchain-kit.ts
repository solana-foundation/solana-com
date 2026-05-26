// #region offchain
import { address, createSolanaRpc } from "@solana/kit";
import { fetchMetadataFromSeeds } from "@metaplex-foundation/mpl-token-metadata-kit";

const rpc = createSolanaRpc("http://localhost:8899");
const mintAddress = address("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

// Fetch onchain metadata
const metadata = await fetchMetadataFromSeeds(rpc, { mint: mintAddress });

// Fetch off-chain JSON metadata
if (metadata.data.uri) {
  const response = await fetch(metadata.data.uri);
  const jsonMetadata = (await response.json()) as {
    name?: string;
    description?: string;
    image?: string;
  };

  console.log("Name:", jsonMetadata.name);
  console.log("Description:", jsonMetadata.description);
  console.log("Image:", jsonMetadata.image);
}
// #endregion offchain
