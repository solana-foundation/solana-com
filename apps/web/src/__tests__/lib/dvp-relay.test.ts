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
const stranger = address("Stake11111111111111111111111111111111111111");
const mint = address("Config1111111111111111111111111111111111111");
const ata = address("SysvarRent111111111111111111111111111111111");
const systemProgram = address("11111111111111111111111111111111");

/** Associated Token Program create: payer, ata, owner, mint, system, token. */
function ataCreate(owner: Address): Instruction {
  return {
    programAddress: ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
    accounts: [
      { address: treasury, role: 3 },
      { address: ata, role: 1 },
      { address: owner, role: 0 },
      { address: mint, role: 0 },
      { address: systemProgram, role: 0 },
      { address: TOKEN_PROGRAM_ADDRESS, role: 0 },
    ],
    data: new Uint8Array([1]),
  };
}

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
  const dvpIx = {
    programAddress: address(PROGRAM_ID),
    accounts: [{ address: party, role: 3 }],
    data: new Uint8Array([2]),
  };

  it("accepts a settlement that creates destination accounts for non-signing parties", () => {
    // settle(): only the authority signs; the DvP instruction names the
    // destination token accounts (not their owners).
    const authority = stranger;
    const settlement = transaction(treasury, [
      ataCreate(party),
      {
        programAddress: address(PROGRAM_ID),
        accounts: [
          { address: authority, role: 2 },
          { address: ata, role: 1 },
        ],
        data: new Uint8Array([3]),
      },
    ]);
    expect(() => assertRelayable(settlement, treasury)).not.toThrow();
  });

  it("accepts the demo programs, including sponsored ATAs for the step's parties", () => {
    // Owner is a signer (a role wallet signing this step).
    expect(() =>
      assertRelayable(
        transaction(treasury, [ataCreate(party), dvpIx]),
        treasury,
      ),
    ).not.toThrow();
    // Owner is an account the DvP instruction names (the escrow PDA).
    const escrowOwner = transaction(treasury, [
      ataCreate(stranger),
      {
        programAddress: address(PROGRAM_ID),
        accounts: [{ address: stranger, role: 1 }],
        data: new Uint8Array([2]),
      },
    ]);
    expect(() => assertRelayable(escrowOwner, treasury)).not.toThrow();
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

  it("refuses treasury-paid ATA creates that are not part of the DvP step", () => {
    expect(() =>
      assertRelayable(transaction(treasury, [ataCreate(party)]), treasury),
    ).toThrow(/must accompany a DvP instruction/);
    // An unrelated owner appended to an otherwise valid step.
    expect(() =>
      assertRelayable(
        transaction(treasury, [ataCreate(party), ataCreate(stranger), dvpIx]),
        treasury,
      ),
    ).toThrow(/not part of this DvP step/);
    // The treasury itself may not become a token account owner here.
    expect(() =>
      assertRelayable(
        transaction(treasury, [ataCreate(treasury), dvpIx]),
        treasury,
      ),
    ).toThrow(/not part of this DvP step/);
    const four = [
      ataCreate(party),
      ataCreate(party),
      ataCreate(party),
      ataCreate(party),
    ];
    expect(() =>
      assertRelayable(transaction(treasury, [...four, dvpIx]), treasury),
    ).not.toThrow();
    expect(() =>
      assertRelayable(
        transaction(treasury, [...four, ataCreate(party), dvpIx]),
        treasury,
      ),
    ).toThrow(/too many associated token account creates/);
  });
});
