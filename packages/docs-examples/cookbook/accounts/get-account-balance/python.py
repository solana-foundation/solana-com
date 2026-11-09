# #region balance
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.pubkey import Pubkey

client = Client("http://localhost:8899", commitment=Confirmed)

address = Pubkey.from_string("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
balance = client.get_balance(address)

print(f"Balance: {balance.value / 1_000_000_000} SOL")
# #endregion balance
