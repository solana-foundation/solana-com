// #region fetch
import { Connection, PublicKey } from "@solana/web3.js-v3";
import { getMintDecoder } from "@solana-program/token-2022";

const connection = new Connection("http://localhost:8899", "confirmed");

const mintAddress = new PublicKey(
  "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
);

const mintAccountInfo = await connection.getAccountInfo(
  mintAddress,
  "confirmed",
);
const mintAccount = getMintDecoder().decode(mintAccountInfo!.data);

console.log(mintAccount);
// #endregion fetch
