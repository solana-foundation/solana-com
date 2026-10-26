# #region dontfront
import base64
import random

import httpx
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.instruction import AccountMeta, Instruction
from solders.keypair import Keypair
from solders.message import Message
from solders.pubkey import Pubkey
from solders.system_program import TransferParams, transfer
from solders.transaction import Transaction

JITO_ENDPOINT = "https://mainnet.block-engine.jito.wtf/api/v1/transactions"
# Any pubkey starting with "jitodontfront"; it does not need to exist onchain.
DONT_FRONT = Pubkey.from_string("jitodontfront111111111111111111111111111111")
# Jito tip accounts: https://docs.jito.wtf/lowlatencytxnsend/#gettipaccounts
TIP_ACCOUNTS = [
    "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
    "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
    "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
    "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
    "DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
    "ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
    "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
    "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT",
]

client = Client("http://localhost:8899", commitment=Confirmed)
sender = Keypair()
recipient = Keypair()

airdrop = client.request_airdrop(sender.pubkey(), 1_000_000_000)
client.confirm_transaction(airdrop.value)

# Append jitodontfront as a read-only account to the transfer instruction.
transfer_ix = transfer(
    TransferParams(
        from_pubkey=sender.pubkey(), to_pubkey=recipient.pubkey(), lamports=1_000_000
    )
)
transfer_ix = Instruction(
    transfer_ix.program_id,
    transfer_ix.data,
    transfer_ix.accounts + [AccountMeta(DONT_FRONT, is_signer=False, is_writable=False)],
)

# Jito tip: at least 1000 lamports to a random tip account.
tip_ix = transfer(
    TransferParams(
        from_pubkey=sender.pubkey(),
        to_pubkey=Pubkey.from_string(random.choice(TIP_ACCOUNTS)),
        lamports=1_000,
    )
)

blockhash = client.get_latest_blockhash().value.blockhash
transaction = Transaction(
    [sender], Message([transfer_ix, tip_ix], sender.pubkey()), blockhash
)

# Send through Jito's block engine, not a regular RPC node.
response = httpx.post(
    JITO_ENDPOINT,
    json={
        "jsonrpc": "2.0",
        "id": 1,
        "method": "sendTransaction",
        "params": [
            base64.b64encode(bytes(transaction)).decode(),
            {"encoding": "base64"},
        ],
    },
)
result = response.json()
if "error" in result:
    raise RuntimeError(f"Jito rejected the transaction: {result['error']}")
response.raise_for_status()
print("Sent with dontfront protection:", result["result"])
# #endregion dontfront
