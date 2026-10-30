// #region asset
import { writeFileSync } from "node:fs";
import { generateKeyPairSigner, unwrapOption } from "@solana/kit";
import { extension } from "@solana-program/token-2022";
import { client } from "./client";

const wallet = client.identity;
const mint = await generateKeyPairSigner(); // the new asset's address
const { instructions } = client.token2022;

// One transaction: create the mint (the account that defines the asset) with
// its name, symbol, and details stored in it, then mint 1,000 EXF to your
// token account, created if needed. Amounts are in base units: 1,000 x 10^2.
const { context } = await client.sendTransaction([
  await instructions.createMint({
    newMint: mint,
    decimals: 2,
    mintAuthority: wallet,
    freezeAuthority: wallet.address, // lets you freeze holders (step 5)
    extensions: [
      extension("MetadataPointer", {
        authority: wallet.address,
        metadataAddress: mint.address,
      }),
      extension("TokenMetadata", {
        updateAuthority: wallet.address,
        mint: mint.address,
        name: "Example Fund",
        symbol: "EXF",
        uri: "https://example.com/exf.json",
        additionalMetadata: new Map([["asset class", "fund share"]]),
      }),
    ],
  }),
  await instructions.mintToATA({
    mint: mint.address,
    owner: wallet.address,
    mintAuthority: wallet,
    amount: 100_000n,
    decimals: 2,
  }),
]);

// Save the asset's address for the next steps.
writeFileSync("asset.json", JSON.stringify({ mint: mint.address }));

// Read the asset back from the network.
const asset = await client.token2022.accounts.mint.fetch(mint.address);
const metadata = unwrapOption(asset.data.extensions)?.find(
  (e) => e.__kind === "TokenMetadata",
);

console.log("Asset (mint):", mint.address);
console.log("Name:", metadata?.name, `(${metadata?.symbol})`);
console.log("Signature:", context.signature);
console.log(
  `Explorer: https://explorer.solana.com/address/${mint.address}?cluster=devnet`,
);
console.log("Supply:", Number(asset.data.supply) / 100, "EXF");
// #endregion asset
