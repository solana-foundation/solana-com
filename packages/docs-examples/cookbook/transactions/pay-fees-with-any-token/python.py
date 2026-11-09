# #region pay-fees
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
        fee_payer = Keypair()  # pays the SOL fee, gets paid back in tokens
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
        atas = {
            owner: get_associated_token_address(owner, mint.pubkey())
            for owner in (sender.pubkey(), recipient.pubkey(), fee_payer.pubkey())
        }
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
                *[
                    create_associated_token_account(fee_payer.pubkey(), owner, mint.pubkey())
                    for owner in atas
                ],
                mint_to(
                    MintToParams(
                        program_id=TOKEN_PROGRAM_ID,
                        mint=mint.pubkey(),
                        dest=atas[sender.pubkey()],
                        mint_authority=fee_payer.pubkey(),
                        amount=100,
                    )
                ),
            ],
            [fee_payer, mint],
        )

        # One transaction: 0.50 token to the recipient, and 0.50 token to the fee
        # payer to cover the SOL fee it pays.
        instructions = [
            transfer_checked(
                TransferCheckedParams(
                    program_id=TOKEN_PROGRAM_ID,
                    source=atas[sender.pubkey()],
                    mint=mint.pubkey(),
                    dest=atas[dest],
                    owner=sender.pubkey(),
                    amount=50,
                    decimals=2,
                )
            )
            for dest in (recipient.pubkey(), fee_payer.pubkey())
        ]
        signature = await send(instructions, [fee_payer, sender])
        print("Transaction Signature:", signature)


asyncio.run(main())
# #endregion pay-fees
