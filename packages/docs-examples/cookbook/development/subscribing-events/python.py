# #region subscribe
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solana.rpc.websocket_api import connect
from solders.keypair import Keypair

LAMPORTS_PER_SOL = 1_000_000_000


async def main():
    wallet = Keypair()

    async with (
        AsyncClient("http://localhost:8899") as rpc,
        connect("ws://localhost:8900") as websocket,
    ):
        await websocket.account_subscribe(wallet.pubkey(), commitment=Confirmed)
        await websocket.recv()  # subscription id

        await rpc.request_airdrop(wallet.pubkey(), LAMPORTS_PER_SOL)

        print(await websocket.recv())  # account notification


asyncio.run(main())
# #endregion subscribe
