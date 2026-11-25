# #region memo
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.instruction import Instruction
from solders.keypair import Keypair
from solders.message import MessageV0
from solders.pubkey import Pubkey
from solders.transaction import VersionedTransaction

MEMO_PROGRAM_ID = Pubkey.from_string("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")


async def main():
    async with AsyncClient("http://localhost:8899", commitment=Confirmed) as client:
        sender = Keypair()
        airdrop = await client.request_airdrop(sender.pubkey(), 1_000_000_000)
        await client.confirm_transaction(airdrop.value)

        memo_instruction = Instruction(MEMO_PROGRAM_ID, b"Hello, world!", [])

        blockhash = (await client.get_latest_blockhash()).value.blockhash
        message = MessageV0.try_compile(sender.pubkey(), [memo_instruction], [], blockhash)
        transaction = VersionedTransaction(message, [sender])

        signature = (await client.send_transaction(transaction)).value
        print("Transaction Signature:", signature)


asyncio.run(main())
# #endregion memo
