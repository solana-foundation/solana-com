# #region airdrop
import asyncio

from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair

LAMPORTS_PER_SOL = 1_000_000_000


async def main():
    async with AsyncClient("http://localhost:8899") as client:
        wallet = Keypair()
        airdrop = await client.request_airdrop(wallet.pubkey(), LAMPORTS_PER_SOL)  # 1 SOL
        print("Airdrop Signature:", airdrop.value)


asyncio.run(main())
# #endregion airdrop
