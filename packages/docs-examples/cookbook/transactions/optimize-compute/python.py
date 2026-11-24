# #region optimize
import asyncio

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.compute_budget import set_compute_unit_limit
from solders.keypair import Keypair
from solders.message import MessageV0
from solders.system_program import TransferParams, transfer
from solders.transaction import VersionedTransaction


async def main():
    async with AsyncClient("http://localhost:8899", commitment=Confirmed) as client:
        sender = Keypair()
        recipient = Keypair()
        airdrop = await client.request_airdrop(sender.pubkey(), 1_000_000_000)
        await client.confirm_transaction(airdrop.value)

        transfer_instruction = transfer(
            TransferParams(
                from_pubkey=sender.pubkey(), to_pubkey=recipient.pubkey(), lamports=500_000_000
            )
        )
        blockhash = (await client.get_latest_blockhash()).value.blockhash

        def build(units):
            message = MessageV0.try_compile(
                sender.pubkey(),
                [set_compute_unit_limit(units), transfer_instruction],
                [],
                blockhash,
            )
            return VersionedTransaction(message, [sender])

        # Simulate with the maximum limit to measure the compute units actually used.
        simulation = await client.simulate_transaction(build(1_400_000))
        units = int(simulation.value.units_consumed * 1.1)  # add a 10% margin
        print("Compute unit limit:", units)

        # Request only that many compute units.
        signature = (await client.send_transaction(build(units))).value
        print("Transaction Signature:", signature)


asyncio.run(main())
# #endregion optimize
