# #region balance
from solana.rpc.api import Client
from solders.pubkey import Pubkey

client = Client("http://localhost:8899")

token_account_address = Pubkey.from_string(
    "GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ"
)

balance = client.get_token_account_balance(token_account_address)
print(balance)
# #endregion balance
