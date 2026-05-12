// #region calc
import { createSolanaRpc } from "@solana/kit";

const rpc = createSolanaRpc("http://localhost:8899");

const space = 1500n; // bytes
const lamports = await rpc.getMinimumBalanceForRentExemption(space).send();
console.log("Minimum balance for rent exemption:", lamports);
// #endregion calc
