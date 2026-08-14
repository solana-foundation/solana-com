# #region calc
import asyncio
from solana.rpc.async_api import AsyncClient

async def main():
    rpc = AsyncClient("http://localhost:8899")

    space = 1500  # bytes

    async with rpc:
        lamports = await rpc.get_minimum_balance_for_rent_exemption(space)
        print(f"Minimum balance for rent exemption: {lamports.value}")
        print(f"For account size: {space} bytes")
        print(f"Cost in SOL: {lamports.value / 1_000_000_000}")

if __name__ == "__main__":
    asyncio.run(main())
# #endregion calc
