// #region fetch
import {
  fetchToken,
  findAssociatedTokenPda,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { address, createSolanaRpc } from "@solana/kit";

const rpc = createSolanaRpc("http://localhost:8899");

const mintAddress = address("2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo");
const authority = address("AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2");

const [associatedTokenAddress] = await findAssociatedTokenPda({
  mint: mintAddress,
  owner: authority,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});

const ataDetails = await fetchToken(rpc, associatedTokenAddress);
console.log(ataDetails);
// #endregion fetch
