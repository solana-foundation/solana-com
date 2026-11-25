# #region fetch
import asyncio
import json

from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey
from spl.token.constants import TOKEN_2022_PROGRAM_ID
from spl.token.instructions import get_associated_token_address


async def main():
    async with AsyncClient("http://localhost:8899") as client:
        mint_address = Pubkey.from_string("2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo")
        authority = Pubkey.from_string("AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2")

        associated_token_address = get_associated_token_address(
            owner=authority,
            mint=mint_address,
            token_program_id=TOKEN_2022_PROGRAM_ID,
        )

        ata_details = await client.get_account_info_json_parsed(associated_token_address)
        print(json.dumps(json.loads(ata_details.value.to_json()), indent=2))


asyncio.run(main())
# #endregion fetch
