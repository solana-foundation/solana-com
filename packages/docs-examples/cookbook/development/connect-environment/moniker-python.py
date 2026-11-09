# #region moniker
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed

# solana-py has no cluster monikers, so pass the public endpoint directly.
client = Client("https://api.mainnet-beta.solana.com", commitment=Confirmed)
# #endregion moniker
