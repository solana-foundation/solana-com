# #region transfer
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.keypair import Keypair
from solders.message import MessageV0
from solders.system_program import TransferParams, transfer
from solders.transaction import VersionedTransaction

LAMPORTS_PER_SOL = 1_000_000_000


async def main():
    async with AsyncClient("http://localhost:8899", commitment=Confirmed) as client:
        sender = Keypair()
        recipient = Keypair()

        airdrop = await client.request_airdrop(sender.pubkey(), LAMPORTS_PER_SOL)
        await client.confirm_transaction(airdrop.value)

        transfer_instruction = transfer(
            TransferParams(
                from_pubkey=sender.pubkey(),
                to_pubkey=recipient.pubkey(),
                lamports=LAMPORTS_PER_SOL // 100,  # 0.01 SOL
            )
        )

        blockhash = (await client.get_latest_blockhash()).value.blockhash
        message = MessageV0.try_compile(
            sender.pubkey(), [transfer_instruction], [], blockhash
        )
        transaction = VersionedTransaction(message, [sender])

        signature = (await client.send_transaction(transaction)).value
        print("Transaction Signature:", signature)


asyncio.run(main())
# #endregion transfer
