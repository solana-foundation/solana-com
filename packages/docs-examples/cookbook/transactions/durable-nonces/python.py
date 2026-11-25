# #region authority
import asyncio
import base64

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.hash import Hash
from solders.keypair import Keypair
from solders.message import MessageV0
from solders.system_program import (
    AdvanceNonceAccountParams,
    TransferParams,
    advance_nonce_account,
    create_nonce_account,
    transfer,
)
from solders.transaction import VersionedTransaction


async def main():
    async with AsyncClient("http://localhost:8899", commitment=Confirmed) as client:
        nonce_authority = Keypair()
        airdrop = await client.request_airdrop(nonce_authority.pubkey(), 1_000_000_000)
        await client.confirm_transaction(airdrop.value)

        # The next steps run here, inside main()
        # #endregion authority

        # #region create
        nonce_keypair = Keypair()

        # create the nonce account (80 bytes) and initialize it with its authority
        instructions = create_nonce_account(
            nonce_authority.pubkey(),  # pays for the account
            nonce_keypair.pubkey(),
            nonce_authority.pubkey(),  # authority of the nonce
            (await client.get_minimum_balance_for_rent_exemption(80)).value,
        )

        blockhash = (await client.get_latest_blockhash()).value.blockhash
        message = MessageV0.try_compile(
            nonce_authority.pubkey(), list(instructions), [], blockhash
        )
        tx = VersionedTransaction(message, [nonce_authority, nonce_keypair])
        signature = (await client.send_transaction(tx)).value
        await client.confirm_transaction(signature)
        print("Nonce initiated:", signature)
        # #endregion create

        # #region fetch
        nonce_info = (
            await client.get_account_info_json_parsed(nonce_keypair.pubkey())
        ).value
        nonce = Hash.from_string(nonce_info.data.parsed["info"]["blockhash"])
        # #endregion fetch

        # #region use
        payer = nonce_authority

        # advancing the nonce must be the first instruction
        advance_instruction = advance_nonce_account(
            AdvanceNonceAccountParams(
                nonce_pubkey=nonce_keypair.pubkey(),
                authorized_pubkey=nonce_authority.pubkey(),
            )
        )
        transfer_instruction = transfer(
            TransferParams(
                from_pubkey=payer.pubkey(), to_pubkey=payer.pubkey(), lamports=100
            )
        )

        # use the stored nonce as the recent blockhash
        message = MessageV0.try_compile(
            payer.pubkey(), [advance_instruction, transfer_instruction], [], nonce
        )
        durable_tx = VersionedTransaction(message, [payer])

        # the signed transaction doesn't expire: store it and submit it later
        serialized_tx = base64.b64encode(bytes(durable_tx)).decode()
        print("Signed Durable Transaction:", serialized_tx)
        # #endregion use


# #region authority
asyncio.run(main())
# #endregion authority
