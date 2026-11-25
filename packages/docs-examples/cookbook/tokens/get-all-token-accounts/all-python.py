# #region all
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.models import TokenAccountOpts
from solders.pubkey import Pubkey
from spl.token.constants import TOKEN_PROGRAM_ID


async def main():
    async with AsyncClient("http://localhost:8899") as client:
        owner = Pubkey.from_string("4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF")

        response = await client.get_token_accounts_by_owner_json_parsed(
            owner, TokenAccountOpts(program_id=TOKEN_PROGRAM_ID)
        )
        for account in response.value:
            info = account.account.data.parsed["info"]
            print(account.pubkey, info["mint"], info["tokenAmount"]["amount"])


asyncio.run(main())
# #endregion all
