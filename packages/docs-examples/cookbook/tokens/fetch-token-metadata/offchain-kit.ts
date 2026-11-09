// #region offchain
import { address, createSolanaRpc } from "@solana/kit";
import { fetchMetadataFromSeeds } from "@metaplex-foundation/mpl-token-metadata-kit";

const rpc = createSolanaRpc("http://localhost:8899");
// Example: PYTH mint address (its metadata uri points to a JSON file)
const mintAddress = address("HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3");

// Fetch onchain metadata
const metadata = await fetchMetadataFromSeeds(rpc, { mint: mintAddress });

// Fetch offchain JSON metadata
if (metadata.data.uri) {
  const response = await fetch(metadata.data.uri);
  if (!response.ok) {
    throw new Error(`Fetching ${metadata.data.uri} failed: ${response.status}`);
  }
  const jsonMetadata = (await response.json()) as {
    name?: string;
    description?: string;
    image?: string;
  };

  console.log("Name:", jsonMetadata.name);
  console.log("Description:", jsonMetadata.description);
  console.log("Image:", jsonMetadata.image);
} else {
  console.log("This token's metadata has no uri, so there is no offchain JSON");
}
// #endregion offchain
