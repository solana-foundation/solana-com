// #region all
import { TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { address, createSolanaRpc } from "@solana/kit";

const rpc_url = "http://localhost:8899";
const rpc = createSolanaRpc(rpc_url);

let owner = address("4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF");

let response = await rpc
  .getTokenAccountsByOwner(
    owner,
    { programId: TOKEN_PROGRAM_ADDRESS },
    { encoding: "jsonParsed" },
  )
  .send();

response.value.forEach((accountInfo) => {
  console.log(`pubkey: ${accountInfo.pubkey}`);
  console.log(`mint: ${accountInfo.account.data["parsed"]["info"]["mint"]}`);
  console.log(`owner: ${accountInfo.account.data["parsed"]["info"]["owner"]}`);
  console.log(
    `decimals: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["decimals"]}`,
  );
  console.log(
    `amount: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["amount"]}`,
  );
  console.log("====================");
});
// #endregion all
