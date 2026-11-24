// #region check
import { address, isOffCurveAddress } from "@solana/kit";

// on curve address
const key = address("5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY");
console.log("is off curve:", isOffCurveAddress(key));

const offCurveAddress = address("4BJXYkfvg37zEmBbsacZjeQDpTNx91KppxFJxRqrz48e");
console.log("is off curve:", isOffCurveAddress(offCurveAddress));
// #endregion check
