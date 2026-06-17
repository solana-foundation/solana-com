// #region sign
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { createMemorySigner } from "@solana/keychain-memory";
import { rpcAirdrop, solanaRpc } from "@solana/kit-plugin-rpc";
import { airdropSigner, signer } from "@solana/kit-plugin-signer";
import { getTransferSolInstruction } from "@solana-program/system";

// Every Keychain backend returns the same `SolanaSigner`. Swap this in-memory
// signer for `createAwsKmsSigner`, `createVaultSigner`, ... and the rest of
// this file is identical.
const keychainSigner = await createMemorySigner({
  privateKey: crypto.getRandomValues(new Uint8Array(32)),
});

const recipient = await generateKeyPairSigner();

const client = await createClient()
  .use(signer(keychainSigner))
  .use(
    solanaRpc({
      rpcUrl: "http://localhost:8899",
      rpcSubscriptionsUrl: "ws://localhost:8900",
    }),
  )
  .use(rpcAirdrop())
  .use(airdropSigner(lamports(1_000_000_000n)));

const { context } = await client.sendTransaction([
  getTransferSolInstruction({
    source: keychainSigner,
    destination: recipient.address,
    amount: lamports(10_000_000n),
  }),
]);

console.log("Signature:", context.signature);
// #endregion sign
