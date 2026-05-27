// #region fetch
import { fetchToken } from "@solana-program/token-2022";
import { address, createSolanaRpc } from "@solana/kit";

const rpc = createSolanaRpc("http://localhost:8899");

const tokenAccountAddress = address(
  "GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ",
);

const tokenAccount = await fetchToken(rpc, tokenAccountAddress, {
  commitment: "confirmed",
});
console.log(tokenAccount);
// #endregion fetch
