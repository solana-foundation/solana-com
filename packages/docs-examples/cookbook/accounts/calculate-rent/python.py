# #region calc
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed


async def main():
    async with AsyncClient("http://localhost:8899", commitment=Confirmed) as client:
        space = 1500  # bytes
        lamports = (await client.get_minimum_balance_for_rent_exemption(space)).value
        print("Minimum balance for rent exemption:", lamports)


asyncio.run(main())
# #endregion calc
