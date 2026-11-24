# #region fetch
import asyncio
import json

from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey


async def main():
    async with AsyncClient("http://localhost:8899") as client:
        address = Pubkey.from_string("2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo")

        mint = await client.get_account_info_json_parsed(address)
        print(json.dumps(json.loads(mint.value.to_json()), indent=2))


asyncio.run(main())
# #endregion fetch
