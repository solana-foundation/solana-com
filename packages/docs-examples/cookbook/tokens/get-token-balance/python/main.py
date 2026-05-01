# #region balance
import asyncio
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

async def main():
    rpc = AsyncClient("http://localhost:8899")

    # Use a real token account address from mainnet
    token_account_address = Pubkey.from_string("GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ")

    async with rpc:
        try:
            balance = await rpc.get_token_account_balance(token_account_address)
            print(balance)
        except Exception as e:
            print(f"Error getting token balance: {e}")
            print("This might be because the account doesn't exist or isn't a token account")

if __name__ == "__main__":
    asyncio.run(main())
# #endregion balance
