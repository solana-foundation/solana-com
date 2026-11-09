# #region balance
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.pubkey import Pubkey


async def main():
    async with AsyncClient("http://localhost:8899", commitment=Confirmed) as client:
        address = Pubkey.from_string("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        balance = await client.get_balance(address)

        print(f"Balance: {balance.value / 1_000_000_000} SOL")


asyncio.run(main())
# #endregion balance
