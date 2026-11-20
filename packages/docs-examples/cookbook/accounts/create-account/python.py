# #region create
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.keypair import Keypair
from solders.message import MessageV0
from solders.system_program import ID as SYSTEM_PROGRAM_ID
from solders.system_program import CreateAccountParams, create_account
from solders.transaction import VersionedTransaction

LAMPORTS_PER_SOL = 1_000_000_000


async def main():
    async with AsyncClient("http://localhost:8899", commitment=Confirmed) as client:
        sender = Keypair()
        airdrop = await client.request_airdrop(sender.pubkey(), LAMPORTS_PER_SOL)
        await client.confirm_transaction(airdrop.value)

        new_account = Keypair()
        space = 0
        rent_lamports = (
            await client.get_minimum_balance_for_rent_exemption(space)
        ).value

        create_account_instruction = create_account(
            CreateAccountParams(
                from_pubkey=sender.pubkey(),
                to_pubkey=new_account.pubkey(),
                lamports=rent_lamports,
                space=space,
                owner=SYSTEM_PROGRAM_ID,
            )
        )

        blockhash = (await client.get_latest_blockhash()).value.blockhash
        message = MessageV0.try_compile(
            sender.pubkey(), [create_account_instruction], [], blockhash
        )
        transaction = VersionedTransaction(message, [sender, new_account])

        signature = (await client.send_transaction(transaction)).value
        print("Transaction Signature for create account:", signature)


asyncio.run(main())
# #endregion create
