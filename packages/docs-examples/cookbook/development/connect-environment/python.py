# #region rpc-url
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed

client = AsyncClient("https://api.devnet.solana.com", commitment=Confirmed)
# #endregion rpc-url
