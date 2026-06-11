# #region subscribe
import asyncio
from solana.rpc.commitment import Confirmed
from solana.rpc.websocket_api import connect
from solders.keypair import Keypair

async def main():
    keypair = Keypair()

    async with connect("ws://localhost:8900") as websocket:
        # Subscribe to account changes
        await websocket.account_subscribe(keypair.pubkey(), commitment=Confirmed)

        # Subscribe to logs
        await websocket.logs_subscribe(commitment=Confirmed)

        # Drain the first few messages then exit. In a real app you'd
        # iterate forever or until your application shuts down.
        try:
            async with asyncio.timeout(3):
                async for message in websocket:
                    print(f"Received: {message}")
        except TimeoutError:
            pass

if __name__ == "__main__":
    asyncio.run(main())
# #endregion subscribe
