// #region cost
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

// Connect to Solana network
const connection = new Connection("http://localhost:8899", "confirmed");

const { blockhash, lastValidBlockHeight } =
  await connection.getLatestBlockhash();

// Create keypairs for transaction
const sender = Keypair.generate();
const recipient = Keypair.generate();
console.log(`Created sender account: ${sender.publicKey.toString()}`);
console.log(`Created recipient account: ${recipient.publicKey.toString()}`);

// Request and confirm airdrop
const airdropSignature = await connection.requestAirdrop(
  sender.publicKey,
  LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({
  signature: airdropSignature,
  blockhash,
  lastValidBlockHeight,
});

// Create a transfer instruction
const transferInstruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: recipient.publicKey,
  lamports: 1000000, // 0.001 SOL
});

// Create simulation instructions with placeholder compute unit limit
const simulationInstructions = [
  ComputeBudgetProgram.setComputeUnitLimit({
    units: 1_400_000, // High value for simulation
  }),
  ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1n,
  }),
  transferInstruction,
];

// Create transaction for simulation
const simulationTransaction = new VersionedTransaction(
  new TransactionMessage({
    instructions: simulationInstructions,
    payerKey: sender.publicKey,
    recentBlockhash: blockhash,
  }).compileToV0Message(),
);

// Simulate transaction to get compute unit estimate
const simulationResponse = await connection.simulateTransaction(
  simulationTransaction,
);

const estimatedUnits = simulationResponse.value.unitsConsumed;
console.log(`Estimated compute units: ${estimatedUnits}`);

// Create final transaction with compute budget instructions
const computeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
  units: estimatedUnits!,
});

const computeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 1n,
});

// Build transaction with all instructions
const messageV0 = new TransactionMessage({
  payerKey: sender.publicKey,
  recentBlockhash: blockhash,
  instructions: [
    computeUnitPriceInstruction,
    computeUnitLimitInstruction,
    transferInstruction,
  ],
}).compileToV0Message();

// Calculate fee
const fees = await connection.getFeeForMessage(messageV0);
console.log(`Transaction fee: ${fees.value} lamports`);

const transaction = new VersionedTransaction(messageV0);
transaction.sign([sender]);

// Send and confirm transaction
const signature = await connection.sendTransaction(transaction);
console.log(`Transaction Signature: ${signature}`);
// #endregion cost
