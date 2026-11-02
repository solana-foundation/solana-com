# #region by-mint
from solana.rpc.api import Client
from solana.rpc.types import TokenAccountOpts
from solders.pubkey import Pubkey

client = Client("http://localhost:8899")

owner = Pubkey.from_string("4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF")
mint = Pubkey.from_string("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

response = client.get_token_accounts_by_owner_json_parsed(
    owner, TokenAccountOpts(mint=mint)
)
for account in response.value:
    print(account.pubkey, account.account.data.parsed["info"])
# #endregion by-mint
