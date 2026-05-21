// #region fetch
import { Connection, PublicKey } from "@solana/web3.js";
import { getMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const connection = new Connection(
  "https://api.mainnet.solana.com",
  "confirmed",
);

const mintAddress = new PublicKey(
  "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
);

let mintAccount = await getMint(
  connection,
  mintAddress,
  undefined,
  TOKEN_2022_PROGRAM_ID,
);

console.log(
  JSON.stringify(
    {
      ...mintAccount,
      supply: mintAccount.supply.toString(),
    },
    null,
    2,
  ),
);
// #endregion fetch
