// #region create
import { generateKeyPairSigner } from "@solana/kit";

const signer = await generateKeyPairSigner();
console.log("address: ", signer.address);
// #endregion create
