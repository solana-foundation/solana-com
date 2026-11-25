# #region rebroadcast
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solana.rpc.models import TxOpts
from solders.keypair import Keypair
from solders.message import MessageV0
from solders.system_program import TransferParams, transfer
from solders.transaction import VersionedTransaction
from solders.transaction_status import TransactionConfirmationStatus


async def main():
    async with AsyncClient("http://localhost:8899", commitment=Confirmed) as client:
        payer = Keypair()
        to_account = Keypair().pubkey()
        airdrop = await client.request_airdrop(payer.pubkey(), 1_000_000_000)
        await client.confirm_transaction(airdrop.value)

        latest = (await client.get_latest_blockhash()).value
        transfer_instruction = transfer(
            TransferParams(
                from_pubkey=payer.pubkey(), to_pubkey=to_account, lamports=1_000_000
            )
        )
        message = MessageV0.try_compile(
            payer.pubkey(), [transfer_instruction], [], latest.blockhash
        )
        transaction = VersionedTransaction(message, [payer])
        raw_transaction = bytes(transaction)
        signature = transaction.signatures[0]

        # Resend the same signed transaction until it lands or its blockhash expires.
        # max_retries=0 turns off the RPC node's own rebroadcasting.
        while (await client.get_block_height()).value <= latest.last_valid_block_height:
            await client.send_raw_transaction(
                raw_transaction, opts=TxOpts(skip_preflight=True, max_retries=0)
            )
            await asyncio.sleep(0.5)
            status = (await client.get_signature_statuses([signature])).value[0]
            # Keep resending until confirmed: a "processed" transaction can still be dropped.
            if (
                status is not None
                and status.confirmation_status != TransactionConfirmationStatus.Processed
            ):
                if status.err:
                    raise RuntimeError(f"Transaction failed: {status.err}")
                break

        print("Signature:", signature)


asyncio.run(main())
# #endregion rebroadcast
