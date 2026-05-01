# #region priority
import asyncio
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.system_program import transfer, TransferParams
from solders.transaction import VersionedTransaction
from solders.message import MessageV0
from solders.pubkey import Pubkey
from solders.compute_budget import set_compute_unit_price

# Compute Budget Program ID
COMPUTE_BUDGET_PROGRAM_ID = Pubkey.from_string("ComputeBudget111111111111111111111111111111")

async def main():
    rpc = AsyncClient("http://localhost:8899")

    sender = Keypair()
    recipient = Keypair()

    amount = 1_000_000_000  # 1 SOL
    priority_fee_lamports = 5000  # 5000 lamports priority fee

    async with rpc:
        # Get latest blockhash
        latest_blockhash = await rpc.get_latest_blockhash()

        # Create priority fee instruction
        priority_fee_instruction = set_compute_unit_price(priority_fee_lamports)

        # Create transfer instruction
        transfer_instruction = transfer(
            TransferParams(
                from_pubkey=sender.pubkey(),
                to_pubkey=recipient.pubkey(),
                lamports=amount
            )
        )

        # Create message with priority fee instruction first
        message = MessageV0.try_compile(
            payer=sender.pubkey(),
            instructions=[priority_fee_instruction, transfer_instruction],
            address_lookup_table_accounts=[],
            recent_blockhash=latest_blockhash.value.blockhash
        )

        # Create transaction
        transaction = VersionedTransaction(message, [sender])

        print(f"Sender: {sender.pubkey()}")
        print(f"Recipient: {recipient.pubkey()}")
        print(f"Amount: {amount / 1_000_000_000} SOL")
        print(f"Priority Fee: {priority_fee_lamports} lamports")
        print(f"Transaction with priority fee created successfully")

if __name__ == "__main__":
    asyncio.run(main())
# #endregion priority
