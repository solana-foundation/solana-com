# #region rebroadcast
import time

from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TxOpts
from solders.keypair import Keypair
from solders.message import Message
from solders.system_program import TransferParams, transfer
from solders.transaction import Transaction
from solders.transaction_status import TransactionConfirmationStatus

client = Client("http://localhost:8899", commitment=Confirmed)

payer = Keypair()
to_account = Keypair().pubkey()
client.confirm_transaction(client.request_airdrop(payer.pubkey(), 1_000_000_000).value)

latest = client.get_latest_blockhash().value
transaction = Transaction(
    [payer],
    Message(
        [
            transfer(
                TransferParams(
                    from_pubkey=payer.pubkey(), to_pubkey=to_account, lamports=1_000_000
                )
            )
        ],
        payer.pubkey(),
    ),
    latest.blockhash,
)
raw_transaction = bytes(transaction)
signature = transaction.signatures[0]

# Resend the same signed transaction until it lands or its blockhash expires.
# max_retries=0 turns off the RPC node's own rebroadcasting.
while client.get_block_height().value <= latest.last_valid_block_height:
    client.send_raw_transaction(
        raw_transaction, opts=TxOpts(skip_preflight=True, max_retries=0)
    )
    time.sleep(0.5)
    status = client.get_signature_statuses([signature]).value[0]
    # Keep resending until confirmed: a "processed" transaction can still be dropped.
    if status is not None and status.confirmation_status != TransactionConfirmationStatus.Processed:
        if status.err:
            raise RuntimeError(f"Transaction failed: {status.err}")
        break

print("Signature:", signature)
# #endregion rebroadcast
