# #region rpc-url
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed

client = Client("https://api.devnet.solana.com", commitment=Confirmed)
# #endregion rpc-url
