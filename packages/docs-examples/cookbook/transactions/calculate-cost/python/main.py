# #region cost
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

    amount = 1_000_000_000  # 1 SOL

    async with rpc:
        # Get latest blockhash
        latest_blockhash = await rpc.get_latest_blockhash()

        # Create transfer instruction
        transfer_instruction = transfer(
            TransferParams(
                from_pubkey=sender.pubkey(),
                to_pubkey=recipient.pubkey(),
                lamports=amount
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

        # Get fee for transaction
        fee_response = await rpc.get_fee_for_message(message)

        print(f"Transaction fee: {fee_response.value} lamports")
        print(f"Transaction fee: {fee_response.value / 1_000_000_000} SOL")

        # Calculate total cost (amount + fee)
        total_cost = amount + fee_response.value
        print(f"Total cost: {total_cost} lamports")
        print(f"Total cost: {total_cost / 1_000_000_000} SOL")

if __name__ == "__main__":
    asyncio.run(main())
# #endregion cost
