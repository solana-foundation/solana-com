# #region priority
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.compute_budget import set_compute_unit_limit, set_compute_unit_price
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

        instructions = [
            set_compute_unit_limit(200_000),  # max compute units the transaction may use
            set_compute_unit_price(5_000),  # priority fee in micro-lamports per compute unit
            Instruction(MEMO_PROGRAM_ID, b"Hello, world!", []),
        ]

        blockhash = (await client.get_latest_blockhash()).value.blockhash
        message = MessageV0.try_compile(sender.pubkey(), instructions, [], blockhash)
        transaction = VersionedTransaction(message, [sender])

        signature = (await client.send_transaction(transaction)).value
        print("Transaction Signature:", signature)


asyncio.run(main())
# #endregion priority
