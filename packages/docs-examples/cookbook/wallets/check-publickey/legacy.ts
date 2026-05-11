// #region check
import { PublicKey } from "@solana/web3.js";

// on curve address
const key = new PublicKey("5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY");
console.log(PublicKey.isOnCurve(key.toBytes()));

const offCurveAddress = new PublicKey(
  "4BJXYkfvg37zEmBbsacZjeQDpTNx91KppxFJxRqrz48e",
);
console.log(PublicKey.isOnCurve(offCurveAddress.toBytes()));
// #endregion check
