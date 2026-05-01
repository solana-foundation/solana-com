# #region fetch
import asyncio
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey
from spl.token._layouts import MINT_LAYOUT
from spl.token.core import MintInfo

async def main():
    rpc = AsyncClient("http://localhost:8899")

    # USDC mint on mainnet — surfpool clones the account on demand
    mint_address = Pubkey.from_string("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

    async with rpc:
        # Get account info
        account_info = await rpc.get_account_info(mint_address)

        # Parse mint data using layout
        mint_data = MINT_LAYOUT.parse(account_info.value.data)

        # Create MintInfo object
        mint_info = MintInfo(
            mint_authority=mint_data.mint_authority,
            supply=mint_data.supply,
            decimals=mint_data.decimals,
            is_initialized=mint_data.is_initialized,
            freeze_authority=mint_data.freeze_authority
        )

        print(f"Mint Address: {mint_address}")
        print(f"Decimals: {mint_info.decimals}")
        print(f"Supply: {mint_info.supply}")
        print(f"Is Initialized: {mint_info.is_initialized}")
        print(f"Freeze Authority: {mint_info.freeze_authority}")
        print(f"Mint Authority: {mint_info.mint_authority}")

if __name__ == "__main__":
    asyncio.run(main())
# #endregion fetch
