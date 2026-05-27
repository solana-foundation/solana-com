// #region fetch
import { fetchMint } from "@solana-program/token-2022";
import { address, createSolanaRpc } from "@solana/kit";

const rpc = createSolanaRpc("http://localhost:8899");

const mintAddress = address("2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo");

const mintAccount = await fetchMint(rpc, mintAddress);

console.log(mintAccount);
// #endregion fetch
