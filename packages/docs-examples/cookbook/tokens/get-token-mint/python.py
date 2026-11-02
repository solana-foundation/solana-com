# #region fetch
import json

from solana.rpc.api import Client
from solders.pubkey import Pubkey

client = Client("http://localhost:8899")
address = Pubkey.from_string("2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo")

mint = client.get_account_info_json_parsed(address)
print(json.dumps(json.loads(mint.value.to_json()), indent=2))
# #endregion fetch
