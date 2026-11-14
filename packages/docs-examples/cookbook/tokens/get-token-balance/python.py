# #region balance
import asyncio

from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey


async def main():
    async with AsyncClient("http://localhost:8899") as client:
        token_account_address = Pubkey.from_string(
            "GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ"
        )

        balance = await client.get_token_account_balance(token_account_address)
        print(balance)


asyncio.run(main())
# #endregion balance
