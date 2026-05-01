// #region balance
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", "confirmed");
const address = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const balance = await connection.getBalance(address);
console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
// #endregion balance
