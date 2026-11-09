# #region dontfront
import asyncio
import base64
import json
import os
import random
import urllib.error
import urllib.request

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.instruction import AccountMeta, Instruction
from solders.keypair import Keypair
from solders.message import MessageV0
from solders.pubkey import Pubkey
from solders.system_program import TransferParams, transfer
from solders.transaction import VersionedTransaction

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


async def main():
    async with AsyncClient("http://localhost:8899", commitment=Confirmed) as client:
        sender = Keypair()
        recipient = Keypair()

        airdrop = await client.request_airdrop(sender.pubkey(), 1_000_000_000)
        await client.confirm_transaction(airdrop.value)

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

        blockhash = (await client.get_latest_blockhash()).value.blockhash
        message = MessageV0.try_compile(sender.pubkey(), [transfer_ix, tip_ix], [], blockhash)
        transaction = VersionedTransaction(message, [sender])
        base64_tx = base64.b64encode(bytes(transaction)).decode()

    # Sending through Jito submits a real mainnet transaction, so it is off by
    # default and the example prints the signed transaction instead. To send it,
    # sign with a funded mainnet keypair, take the blockhash from a mainnet RPC
    # node, and set SEND_TO_JITO=1.
    if os.environ.get("SEND_TO_JITO") != "1":
        print("Signed transaction (base64):", base64_tx)
        return

    # Send through Jito's block engine, not a regular RPC node.
    request = urllib.request.Request(
        JITO_ENDPOINT,
        data=json.dumps(
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "sendTransaction",
                "params": [base64_tx, {"encoding": "base64"}],
            }
        ).encode(),
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request) as response:
            result = json.load(response)
    except urllib.error.HTTPError as error:
        raise RuntimeError(f"Jito rejected the transaction: {error.read().decode()}") from error
    if "error" in result:
        raise RuntimeError(f"Jito rejected the transaction: {result['error']}")
    print("Sent with dontfront protection:", result["result"])


asyncio.run(main())
# #endregion dontfront
