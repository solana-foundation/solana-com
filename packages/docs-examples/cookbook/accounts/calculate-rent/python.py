# #region calc
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed

client = Client("http://localhost:8899", commitment=Confirmed)

space = 1500  # bytes
lamports = client.get_minimum_balance_for_rent_exemption(space).value
print("Minimum balance for rent exemption:", lamports)
# #endregion calc
