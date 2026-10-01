import { describe, expect, it } from "vitest";
import {
  address,
  appendTransactionMessageInstructions,
  compileTransactionMessage,
  createTransactionMessage,
  getCompiledTransactionMessageEncoder,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  type Address,
  type Blockhash,
  type Instruction,
  type Transaction,
} from "@solana/kit";
import {
  ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { PROGRAM_ID } from "@/lib/delivery-vs-payment/config";
import { assertRelayable } from "@/lib/delivery-vs-payment/server/solana";

const treasury = address("So11111111111111111111111111111111111111112");
const party = address("Vote111111111111111111111111111111111111111");

function transaction(feePayer: Address, instructions: Instruction[]) {
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayer(feePayer, m),
    (m) =>
      setTransactionMessageLifetimeUsingBlockhash(
        {
          blockhash: "11111111111111111111111111111111" as Blockhash,
          lastValidBlockHeight: 1n,
        },
        m,
      ),
    (m) => appendTransactionMessageInstructions(instructions, m),
  );
  return {
    messageBytes: getCompiledTransactionMessageEncoder().encode(
      compileTransactionMessage(message),
    ),
  } as Transaction;
}

describe("DvP treasury relay", () => {
  it("accepts the demo programs, including arbitrary sponsored ATAs", () => {
    const tx = transaction(treasury, [
      {
        programAddress: ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
        accounts: [
          { address: treasury, role: 3 },
          { address: party, role: 1 },
        ],
        data: new Uint8Array([1]),
      },
      { programAddress: address(PROGRAM_ID), data: new Uint8Array([2]) },
    ]);
    expect(() => assertRelayable(tx, treasury)).not.toThrow();
  });

  it("rejects other programs and a different fee payer", () => {
    const systemIx = {
      programAddress: address("11111111111111111111111111111111"),
      data: new Uint8Array([2]),
    };
    expect(() =>
      assertRelayable(transaction(treasury, [systemIx]), treasury),
    ).toThrow(/program .* is not allowed/);
    expect(() =>
      assertRelayable(transaction(party, [systemIx]), treasury),
    ).toThrow(/treasury is not the fee payer/);
  });

  it("rejects a Token instruction that could use the treasury authority", () => {
    const tx = transaction(treasury, [
      {
        programAddress: TOKEN_PROGRAM_ADDRESS,
        accounts: [{ address: treasury, role: 2 }],
        data: new Uint8Array([7]),
      },
    ]);
    expect(() => assertRelayable(tx, treasury)).toThrow(
      /treasury account inside a token instruction/,
    );
  });
});
