// #region memo
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { rpcAirdrop, solanaRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer } from "@solana/kit-plugin-signer";
import { getAddMemoInstruction } from "@solana-program/memo";

const sender = await generateKeyPairSigner();
const LAMPORTS_PER_SOL = 1_000_000_000n;

const client = await createClient()
  .use(payer(sender))
  .use(
    solanaRpc({
      rpcUrl: "http://localhost:8899",
      rpcSubscriptionsUrl: "ws://localhost:8900",
    }),
  )
  .use(rpcAirdrop())
  .use(airdropPayer(lamports(LAMPORTS_PER_SOL)));

const memoInstruction = getAddMemoInstruction({
  memo: "Hello, world!",
});

const { context } = await client.sendTransaction([memoInstruction]);
console.log("Transaction Signature:", context.signature);
// #endregion memo
