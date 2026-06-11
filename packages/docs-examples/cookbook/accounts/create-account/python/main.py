# #region create
import asyncio
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.transaction import VersionedTransaction
from solders.message import MessageV0

async def main():
    rpc = AsyncClient("http://localhost:8899")

    payer = Keypair()
    program_id = Pubkey.from_string("11111111111111111111111111111111")

    # Derive a deterministic address from (base, seed, program_id). The
    # runtime uses the same SHA-256 formula in create_account_with_seed, so
    # this address and the one the System Program computes have to match.
    seed = "hello"
    derived_address = Pubkey.create_with_seed(payer.pubkey(), seed, program_id)

    space = 100  # Account data space

    async with rpc:
        # Get minimum balance for rent exemption
        rent_lamports = await rpc.get_minimum_balance_for_rent_exemption(space)

        # Get latest blockhash
        recent_blockhash = await rpc.get_latest_blockhash()

        from solders.system_program import create_account_with_seed, CreateAccountWithSeedParams

        create_account_instruction = create_account_with_seed(
            CreateAccountWithSeedParams(
                from_pubkey=payer.pubkey(),
                to_pubkey=derived_address,
                base=payer.pubkey(),
                seed=seed,
                lamports=rent_lamports.value,
                space=space,
                owner=program_id
            )
        )

        # Create message
        message = MessageV0.try_compile(
            payer=payer.pubkey(),
            instructions=[create_account_instruction],
            address_lookup_table_accounts=[],
            recent_blockhash=recent_blockhash.value.blockhash
        )

        # Create transaction
        transaction = VersionedTransaction(message, [payer])

        print(f"Payer: {payer.pubkey()}")
        print(f"Derived address: {derived_address}")
        print(f"Program ID: {program_id}")
        print(f"Seed: {seed}")
        print(f"Rent Lamports: {rent_lamports.value}")
        print(f"Account creation transaction created successfully")

if __name__ == "__main__":
    asyncio.run(main())
# #endregion create
