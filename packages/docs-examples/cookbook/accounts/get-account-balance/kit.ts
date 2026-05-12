// #region balance
import { createSolanaRpc, Address } from "@solana/kit";

const rpc = createSolanaRpc("http://localhost:8899");

const address = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" as Address;
const { value } = await rpc.getBalance(address).send();

console.log(`Balance: ${Number(value) / 1_000_000_000} SOL`);
// #endregion balance
