// #region by-mint
import { Connection, PublicKey } from "@solana/web3.js";

// connection
const connection = new Connection("http://localhost:8899", "confirmed");

const owner = new PublicKey("G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY");
const mint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

let response = await connection.getParsedTokenAccountsByOwner(owner, {
  mint: mint,
});

response.value.forEach((accountInfo) => {
  console.log(`pubkey: ${accountInfo.pubkey.toBase58()}`);
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
