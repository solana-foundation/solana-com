# #region cost
import asyncio

from solana.rpc.async_api import AsyncClient
from solders.instruction import Instruction
from solders.keypair import Keypair
from solders.message import MessageV0
from solders.pubkey import Pubkey

MEMO_PROGRAM_ID = Pubkey.from_string("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")


async def main():
    async with AsyncClient("http://localhost:8899") as client:
        payer = Keypair()

        memo_instruction = Instruction(MEMO_PROGRAM_ID, b"Hello, world!", [])
        blockhash = (await client.get_latest_blockhash()).value.blockhash
        message = MessageV0.try_compile(payer.pubkey(), [memo_instruction], [], blockhash)

        fee = (await client.get_fee_for_message(message)).value
        print(f"Transaction is estimated to cost {fee} lamports")


asyncio.run(main())
# #endregion cost
