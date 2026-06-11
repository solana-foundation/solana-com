# #region rpc-url
import asyncio
from solana.rpc.async_api import AsyncClient

async def main():
    async with AsyncClient("http://localhost:8899") as client:
        res = await client.is_connected()
    print(res)  # True

asyncio.run(main())
# #endregion rpc-url
