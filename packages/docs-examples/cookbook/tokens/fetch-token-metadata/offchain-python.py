# #region offchain
import asyncio
import json
import struct
import urllib.request

from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

METADATA_PROGRAM_ID = Pubkey.from_string("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")


async def main():
    async with AsyncClient("http://localhost:8899") as client:
        # Example: PYTH mint address (its metadata uri points to a JSON file)
        mint = Pubkey.from_string("HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3")

        # Fetch the onchain metadata and read its uri (after key, update authority,
        # mint, name and symbol)
        metadata_address, _ = Pubkey.find_program_address(
            [b"metadata", bytes(METADATA_PROGRAM_ID), bytes(mint)], METADATA_PROGRAM_ID
        )
        data = (await client.get_account_info(metadata_address)).value.data
        offset = 65
        for _ in range(2):  # skip name and symbol
            offset += 4 + struct.unpack_from("<I", data, offset)[0]
        (length,) = struct.unpack_from("<I", data, offset)
        uri = data[offset + 4 : offset + 4 + length].decode().rstrip("\x00")

    # Fetch the off-chain JSON metadata
    if uri:
        with urllib.request.urlopen(uri) as response:
            json_metadata = json.load(response)

        print("Name:", json_metadata.get("name"))
        print("Description:", json_metadata.get("description"))
        print("Image:", json_metadata.get("image"))
    else:
        print("This token's metadata has no uri, so there is no offchain JSON")


asyncio.run(main())
# #endregion offchain
