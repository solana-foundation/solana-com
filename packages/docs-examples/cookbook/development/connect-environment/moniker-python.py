# #region moniker
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed

# Pass the cluster's public endpoint directly.
client = AsyncClient("https://api.mainnet-beta.solana.com", commitment=Confirmed)
# #endregion moniker
