# #region fetch
#!/usr/bin/env python3
"""
Solana Cookbook - How to Get a Token Mint
"""

import asyncio
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey
from spl.token._layouts import MINT_LAYOUT

async def main():
    rpc = AsyncClient("http://localhost:8899")

    mint_address = Pubkey.from_string("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU")

    async with rpc:
        # Get account info
        account_info = await rpc.get_account_info(mint_address)
        if account_info.value is None:
            raise SystemExit("mint not found on this cluster")

        # Parse mint data using layout
        mint_data = MINT_LAYOUT.parse(account_info.value.data)

        print(f"Mint Address: {mint_address}")
        print(f"Decimals: {mint_data.decimals}")
        print(f"Supply: {mint_data.supply}")
        print(f"Is Initialized: {bool(mint_data.is_initialized)}")
        print(f"Freeze Authority: {Pubkey.from_bytes(mint_data.freeze_authority)}")
        print(f"Mint Authority: {Pubkey.from_bytes(mint_data.mint_authority)}")

if __name__ == "__main__":
    asyncio.run(main())
# #endregion fetch
