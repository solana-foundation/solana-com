# #region sponsor
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.keypair import Keypair
from solders.message import MessageV0
from solders.system_program import CreateAccountParams, create_account
from solders.transaction import VersionedTransaction
from spl.token.constants import MINT_LEN, TOKEN_PROGRAM_ID
from spl.token.instructions import (
    create_associated_token_account,
    get_associated_token_address,
    initialize_mint,
    mint_to,
    transfer_checked,
)
from spl.token.models import InitializeMintParams, MintToParams, TransferCheckedParams


async def main():
    async with AsyncClient("http://localhost:8899", commitment=Confirmed) as client:
        fee_payer = Keypair()  # pays every fee
        sender = Keypair()  # holds tokens but no SOL
        recipient = Keypair()
        mint = Keypair()

        airdrop = await client.request_airdrop(fee_payer.pubkey(), 1_000_000_000)
        await client.confirm_transaction(airdrop.value)

        async def send(instructions, signers):
            # fee_payer is the fee payer of every transaction
            blockhash = (await client.get_latest_blockhash()).value.blockhash
            message = MessageV0.try_compile(fee_payer.pubkey(), instructions, [], blockhash)
            signature = (
                await client.send_transaction(VersionedTransaction(message, signers))
            ).value
            await client.confirm_transaction(signature)
            return signature

        # Setup: a mint with 2 decimals, and 1.00 token in the sender's account.
        sender_ata = get_associated_token_address(sender.pubkey(), mint.pubkey())
        recipient_ata = get_associated_token_address(recipient.pubkey(), mint.pubkey())
        rent = (await client.get_minimum_balance_for_rent_exemption(MINT_LEN)).value
        await send(
            [
                create_account(
                    CreateAccountParams(
                        from_pubkey=fee_payer.pubkey(),
                        to_pubkey=mint.pubkey(),
                        lamports=rent,
                        space=MINT_LEN,
                        owner=TOKEN_PROGRAM_ID,
                    )
                ),
                initialize_mint(
                    InitializeMintParams(
                        program_id=TOKEN_PROGRAM_ID,
                        mint=mint.pubkey(),
                        decimals=2,
                        mint_authority=fee_payer.pubkey(),
                    )
                ),
                create_associated_token_account(
                    fee_payer.pubkey(), sender.pubkey(), mint.pubkey()
                ),
                create_associated_token_account(
                    fee_payer.pubkey(), recipient.pubkey(), mint.pubkey()
                ),
                mint_to(
                    MintToParams(
                        program_id=TOKEN_PROGRAM_ID,
                        mint=mint.pubkey(),
                        dest=sender_ata,
                        mint_authority=fee_payer.pubkey(),
                        amount=100,
                    )
                ),
            ],
            [fee_payer, mint],
        )

        # Sender transfers 0.50 token; fee_payer is the transaction's fee payer.
        transfer_ix = transfer_checked(
            TransferCheckedParams(
                program_id=TOKEN_PROGRAM_ID,
                source=sender_ata,
                mint=mint.pubkey(),
                dest=recipient_ata,
                owner=sender.pubkey(),
                amount=50,
                decimals=2,
            )
        )
        signature = await send([transfer_ix], [fee_payer, sender])
        print("Transaction Signature:", signature)


asyncio.run(main())
# #endregion sponsor
