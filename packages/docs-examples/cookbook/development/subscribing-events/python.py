# #region subscribe
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solana.rpc.websocket_api import SolanaWsClient
from solders.keypair import Keypair

LAMPORTS_PER_SOL = 1_000_000_000


async def main():
    wallet = Keypair()

    async with (
        AsyncClient("http://localhost:8899") as rpc,
        SolanaWsClient("ws://localhost:8900") as websocket,
    ):
        # Returns once the server confirms the subscription
        subscription = await websocket.account_subscribe(
            pubkey=wallet.pubkey(), commitment=Confirmed
        )

        await rpc.request_airdrop(wallet.pubkey(), LAMPORTS_PER_SOL)

        # Print the first notification (or give up after 30 seconds)
        notification = await asyncio.wait_for(websocket.recv(), timeout=30)
        print(notification)

        await websocket.unsubscribe(subscription)


asyncio.run(main())
# #endregion subscribe
