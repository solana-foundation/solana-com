# #region by-mint
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.models import TokenAccountOpts
from solders.pubkey import Pubkey


async def main():
    async with AsyncClient("http://localhost:8899") as client:
        owner = Pubkey.from_string("4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF")
        mint = Pubkey.from_string("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

        response = await client.get_token_accounts_by_owner_json_parsed(
            owner, TokenAccountOpts(mint=mint)
        )
        for account in response.value:
            print(account.pubkey, account.account.data.parsed["info"])


asyncio.run(main())
# #endregion by-mint
