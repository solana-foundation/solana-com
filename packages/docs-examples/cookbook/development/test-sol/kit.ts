// #region airdrop
import {
  airdropFactory,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  generateKeyPairSigner,
  lamports,
} from "@solana/kit";

const rpc = createSolanaRpc("http://localhost:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://localhost:8900");

const wallet = await generateKeyPairSigner();
const LAMPORTS_PER_SOL = 1_000_000_000n;

await airdropFactory({ rpc, rpcSubscriptions })({
  recipientAddress: wallet.address,
  lamports: lamports(LAMPORTS_PER_SOL), // 1 SOL
  commitment: "confirmed",
});

const { value } = await rpc.getBalance(wallet.address).send();
console.log(`Balance: ${value / LAMPORTS_PER_SOL} SOL`);
// #endregion airdrop
