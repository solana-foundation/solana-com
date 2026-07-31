// #region create
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { rpcAirdrop, solanaRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer as kitPayer } from "@solana/kit-plugin-signer";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  AccountState,
  TOKEN_2022_PROGRAM_ADDRESS,
  extension,
  fetchMint,
  getInitializeMintInstruction,
  getMintSize,
  getPostInitializeInstructionsForMintExtensions,
  getPreInitializeInstructionsForMintExtensions,
} from "@solana-program/token-2022";

const payer = await generateKeyPairSigner();
const mint = await generateKeyPairSigner();

const client = await createClient()
  .use(kitPayer(payer))
  .use(
    solanaRpc({
      rpcUrl: "http://localhost:8899",
      rpcSubscriptionsUrl: "ws://localhost:8900",
    }),
  )
  .use(rpcAirdrop())
  .use(airdropPayer(lamports(1_000_000_000n)));

// A compliance-ready Token-2022 mint: onchain metadata, pausable transfers,
// a permanent delegate that can move or burn any balance, and token accounts
// that start frozen until the issuer thaws them.
const extensions = [
  extension("MetadataPointer", {
    authority: payer.address,
    metadataAddress: mint.address,
  }),
  extension("TokenMetadata", {
    updateAuthority: payer.address,
    mint: mint.address,
    name: "Example Stablecoin",
    symbol: "EXUSD",
    uri: "https://example.com/exusd.json",
    additionalMetadata: new Map<string, string>(),
  }),
  extension("PausableConfig", { authority: payer.address, paused: false }),
  extension("PermanentDelegate", { delegate: payer.address }),
  extension("DefaultAccountState", { state: AccountState.Frozen }),
];

// Token metadata is written after the mint is initialized, so allocate the
// account without it but fund rent for the full size.
const spaceWithoutMetadata = BigInt(
  getMintSize(extensions.filter(({ __kind }) => __kind !== "TokenMetadata")),
);
const spaceWithMetadata = BigInt(getMintSize(extensions));
const rent = await client.rpc
  .getMinimumBalanceForRentExemption(spaceWithMetadata)
  .send();

const instructions = [
  getCreateAccountInstruction({
    payer,
    newAccount: mint,
    lamports: rent,
    space: spaceWithoutMetadata,
    programAddress: TOKEN_2022_PROGRAM_ADDRESS,
  }),
  ...getPreInitializeInstructionsForMintExtensions(mint.address, extensions),
  getInitializeMintInstruction({
    mint: mint.address,
    decimals: 6,
    mintAuthority: payer.address,
    freezeAuthority: payer.address,
  }),
  ...getPostInitializeInstructionsForMintExtensions(
    mint.address,
    payer,
    extensions,
  ),
];

const { context } = await client.sendTransaction(instructions);
console.log("Transaction Signature:", context.signature);

// Verify the mint and its extensions
const mintAccount = await fetchMint(client.rpc, mint.address);
const enabledExtensions =
  mintAccount.data.extensions.__option === "Some"
    ? mintAccount.data.extensions.value.map(({ __kind }) => __kind)
    : [];

console.log("Mint Address:", mintAccount.address);
console.log("Decimals:", mintAccount.data.decimals);
console.log("Extensions:", enabledExtensions.join(", "));
// #endregion create
