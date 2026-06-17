// #region sign
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { createKeychainSigner } from "@solana/keychain";
import { rpcAirdrop, solanaRpc } from "@solana/kit-plugin-rpc";
import { airdropSigner, signer } from "@solana/kit-plugin-signer";
import { getTransferSolInstruction } from "@solana-program/system";

// One factory, one config shape for every backend. Swap `backend: "memory"`
// for "aws-kms", "vault", "turnkey", ... and the rest of this file is
// identical — each backend returns the same `SolanaSigner` interface.
const keychainSigner = await createKeychainSigner({
  backend: "memory",
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
