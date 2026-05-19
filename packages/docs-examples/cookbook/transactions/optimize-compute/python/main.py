# #region optimize
import asyncio
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.system_program import transfer, TransferParams
from solders.transaction import VersionedTransaction
from solders.message import MessageV0
from solders.compute_budget import set_compute_unit_limit, set_compute_unit_price

async def get_simulation_compute_units(rpc, instructions, signer, lookup_tables=[]):
    """Simulate transaction to get actual compute units needed"""
    try:
        # Create a temporary transaction for simulation
        recent_blockhash = await rpc.get_latest_blockhash()

        # Create message for simulation
        message = MessageV0.try_compile(
            payer=signer.pubkey(),
            instructions=instructions,
            address_lookup_table_accounts=lookup_tables,
            recent_blockhash=recent_blockhash.value.blockhash
        )

        # VersionedTransaction needs a real signer at construction time,
        # so sign with the fee payer. sig_verify=False on the RPC call
        # means surfpool won't re-check the signature against the blockhash.
        transaction = VersionedTransaction(message, [signer])

        simulation_result = await rpc.simulate_transaction(
            transaction, sig_verify=False
        )

        if simulation_result.value.err:
            print(f"Simulation error: {simulation_result.value.err}")
            return 200000  # Fallback value

        # Get compute units used from simulation
        units_consumed = simulation_result.value.units_consumed
        if units_consumed:
            return units_consumed
        else:
            return 200000  # Fallback value

    except Exception as e:
        print(f"Error during simulation: {e}")
        return 200000  # Fallback value

async def build_optimal_transaction(rpc, instructions, signer, lookup_tables=[]):
    """Build optimal transaction similar to JavaScript version"""
    micro_lamports = 100  # Get optimal priority fees
    units = await get_simulation_compute_units(rpc, instructions, signer, lookup_tables)
    recent_blockhash = await rpc.get_latest_blockhash()

    # Add compute budget instructions at the beginning (like unshift in JS)
    instructions.insert(0, set_compute_unit_price(micro_lamports))

    if units:
        # Add some margin of error to units
        units_with_margin = int(units * 1.1)
        instructions.insert(0, set_compute_unit_limit(units_with_margin))

    # Create message (equivalent to TransactionMessage.compileToV0Message)
    message = MessageV0.try_compile(
        payer=signer.pubkey(),
        instructions=instructions,
        address_lookup_table_accounts=lookup_tables,
        recent_blockhash=recent_blockhash.value.blockhash
    )

    # Create transaction
    transaction = VersionedTransaction(message, [signer])

    return {
        "transaction": transaction,
        "recent_blockhash": recent_blockhash.value.blockhash
    }

async def main():
    rpc = AsyncClient("http://localhost:8899")

    sender = Keypair()
    recipient = Keypair()

    amount = 1_000_000_000  # 1 SOL

    async with rpc:
        # Fund the sender so simulation has a real account to spend from.
        airdrop_sig = await rpc.request_airdrop(sender.pubkey(), 2 * amount)
        await rpc.confirm_transaction(airdrop_sig.value)

        # Create transfer instruction
        transfer_instruction = transfer(
            TransferParams(
                from_pubkey=sender.pubkey(),
                to_pubkey=recipient.pubkey(),
                lamports=amount
            )
        )

        # Build optimal transaction
        result = await build_optimal_transaction(
            rpc,
            [transfer_instruction],
            sender
        )

        print(f"Sender: {sender.pubkey()}")
        print(f"Recipient: {recipient.pubkey()}")
        print(f"Amount: {amount / 1_000_000_000} SOL")
        print(f"Optimal transaction built successfully")

if __name__ == "__main__":
    asyncio.run(main())
# #endregion optimize
