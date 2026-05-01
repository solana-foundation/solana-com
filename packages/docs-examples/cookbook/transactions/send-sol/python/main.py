# #region transfer
import asyncio
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.system_program import transfer, TransferParams
from solders.transaction import VersionedTransaction
from solders.message import MessageV0

async def main():
    rpc = AsyncClient("http://localhost:8899")

    sender = Keypair()
    recipient = Keypair()

    LAMPORTS_PER_SOL = 1_000_000_000
    transfer_amount = LAMPORTS_PER_SOL // 100  # 0.01 SOL

    async with rpc:
        # Get latest blockhash
        latest_blockhash = await rpc.get_latest_blockhash()

        # Create transfer instruction
        transfer_instruction = transfer(
            TransferParams(
                from_pubkey=sender.pubkey(),
                to_pubkey=recipient.pubkey(),
                lamports=transfer_amount
            )
        )

        # Create message
        message = MessageV0.try_compile(
            payer=sender.pubkey(),
            instructions=[transfer_instruction],
            address_lookup_table_accounts=[],
            recent_blockhash=latest_blockhash.value.blockhash
        )

        # Create transaction
        transaction = VersionedTransaction(message, [sender])

        print(f"Sender: {sender.pubkey()}")
        print(f"Recipient: {recipient.pubkey()}")
        print(f"Transfer Amount: {transfer_amount / LAMPORTS_PER_SOL} SOL")
        print(f"Transaction created successfully")

if __name__ == "__main__":
    asyncio.run(main())
# #endregion transfer
