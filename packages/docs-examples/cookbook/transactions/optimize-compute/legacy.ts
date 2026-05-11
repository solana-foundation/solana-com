// #region optimize
import {
  Connection,
  TransactionInstruction,
  ComputeBudgetProgram,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

async function getSimulationComputeUnits(
  connection: Connection,
  instructions: Array<TransactionInstruction>,
  payerKey: PublicKey,
) {
  try {
    const recentBlockhash = await connection.getLatestBlockhash();

    // Include compute budget instructions in simulation
    const simulationInstructions = [
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100 }),
      ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }), // High limit for simulation
      ...instructions,
    ];

    const transaction = new Transaction();
    transaction.recentBlockhash = recentBlockhash.blockhash;
    transaction.feePayer = payerKey;
    transaction.add(...simulationInstructions);

    const simulation = await connection.simulateTransaction(transaction);
    console.log("Simulated Transaction:", simulation);

    if (simulation.value.err) {
      console.error("Simulation error:", simulation.value.err);
      return 200000; // Fallback value
    }

    return simulation.value.unitsConsumed || 200000;
  } catch (error) {
    console.error("Error during simulation:", error);
    return 200000; // Fallback value
  }
}

async function buildOptimalTransaction(
  connection: Connection,
  instructions: Array<TransactionInstruction>,
  signer: Keypair,
  priorityFee: number,
) {
  const [computeUnits, recentBlockhash] = await Promise.all([
    getSimulationComputeUnits(connection, instructions, signer.publicKey),
    connection.getLatestBlockhash(),
  ]);

  const finalInstructions: TransactionInstruction[] = [];

  finalInstructions.push(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityFee }),
  );

  if (computeUnits) {
    const unitsWithMargin = Math.floor(computeUnits * 1.1); // add 10% margin of error
    console.log("Compute Units with extra 10% margin:", unitsWithMargin);
    finalInstructions.push(
      ComputeBudgetProgram.setComputeUnitLimit({ units: unitsWithMargin }),
    );
  }

  finalInstructions.push(...instructions);

  const transaction = new Transaction();
  transaction.recentBlockhash = recentBlockhash.blockhash;
  transaction.feePayer = signer.publicKey;
  transaction.add(...finalInstructions);

  return {
    transaction,
  };
}

const connection = new Connection("http://localhost:8899", {
  commitment: "confirmed",
});

const sender = Keypair.generate();
const recipient = Keypair.generate();
const amount = LAMPORTS_PER_SOL / 2; // 0.5 SOL

const signature = await connection.requestAirdrop(
  sender.publicKey,
  LAMPORTS_PER_SOL,
);

const { blockhash, lastValidBlockHeight } =
  await connection.getLatestBlockhash();

await connection.confirmTransaction({
  blockhash,
  lastValidBlockHeight,
  signature,
});

// Create transfer instruction
const transferInstruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: recipient.publicKey,
  lamports: amount,
});

const priorityFee = 100; // microLamports

// Build optimal transaction
const transaction = await buildOptimalTransaction(
  connection,
  [transferInstruction],
  sender,
  priorityFee,
);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction.transaction,
  [sender],
);

console.log("Transaction sent:", transactionSignature);
// #endregion optimize
