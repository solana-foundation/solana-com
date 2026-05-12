// #region calc
import { Connection } from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", "confirmed");

// allocate 1.5k bytes of extra space in the account for data
const space = 1500;
const lamports = await connection.getMinimumBalanceForRentExemption(space);
console.log("Minimum balance for rent exemption:", lamports);
// #endregion calc
