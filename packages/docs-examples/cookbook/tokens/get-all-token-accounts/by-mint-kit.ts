// #region by-mint
import { address, createSolanaRpc } from "@solana/kit";

const rpc_url = "http://localhost:8899";
const rpc = createSolanaRpc(rpc_url);

let owner = address("4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF");
let mint = address("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

let response = await rpc
  .getTokenAccountsByOwner(owner, { mint }, { encoding: "jsonParsed" })
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
// #endregion by-mint
