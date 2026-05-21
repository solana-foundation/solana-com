// #region fetch
import { Address, createSolanaRpc } from "@solana/kit";
import { fetchMint } from "@solana-program/token-2022";

const rpc = createSolanaRpc("https://api.mainnet.solana.com");
const address = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo" as Address;

const mint = await fetchMint(rpc, address);
console.log(mint);
// #endregion fetch
