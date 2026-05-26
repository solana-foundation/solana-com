# #region airdrop
import asyncio
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair

async def main():
    keypair = Keypair()

    async with AsyncClient("http://localhost:8899") as client:
        # Request airdrop (1 SOL = 1_000_000_000 lamports)
        res = await client.request_airdrop(keypair.pubkey(), 1_000_000_000)
        print(f"Airdrop signature: {res.value}")

        # Wait for confirmation so the balance call sees the airdrop
        await client.confirm_transaction(res.value)

        # Check balance
        balance = await client.get_balance(keypair.pubkey())
        print(f"Balance: {balance.value} lamports")

if __name__ == "__main__":
    asyncio.run(main())
# #endregion airdrop
