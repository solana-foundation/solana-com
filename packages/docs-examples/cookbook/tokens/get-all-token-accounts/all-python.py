# #region all
from solana.rpc.api import Client
from solana.rpc.types import TokenAccountOpts
from solders.pubkey import Pubkey
from spl.token.constants import TOKEN_PROGRAM_ID

client = Client("http://localhost:8899")

owner = Pubkey.from_string("4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF")

response = client.get_token_accounts_by_owner_json_parsed(
    owner, TokenAccountOpts(program_id=TOKEN_PROGRAM_ID)
)
for account in response.value:
    info = account.account.data.parsed["info"]
    print(account.pubkey, info["mint"], info["tokenAmount"]["amount"])
# #endregion all
