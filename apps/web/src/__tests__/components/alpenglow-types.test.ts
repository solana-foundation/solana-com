import { describe, expect, it } from "vitest";
import {
  alpenglowRpcUrl,
  blockRequestOptions,
  cursorAfterBlockReads,
  DEFAULT_SOLANA_RPC_URL,
  MAX_SUPPORTED_TRANSACTION_VERSION,
  shouldDeferFinalizedBlock,
  shouldReplayCanonicalBlock,
} from "@/lib/alpenglow-stream";
import { signatureSeed } from "@/components/alpenglow/types";

describe("Alpenglow artwork sampling", () => {
  it("derives a stable seed from each signature", () => {
    expect(signatureSeed("5igNatureA")).toBe(signatureSeed("5igNatureA"));
    expect(signatureSeed("5igNatureA")).not.toBe(signatureSeed("5igNatureB"));
  });
});

describe("Alpenglow stream progression", () => {
  it("uses an RPC in every environment", () => {
    expect(
      alpenglowRpcUrl({
        SOLANA_RPC_URL: "https://server.example",
        NEXT_PUBLIC_RPC_ENDPOINT: "https://public.example",
      }),
    ).toBe("https://server.example");
    expect(
      alpenglowRpcUrl({
        NEXT_PUBLIC_RPC_ENDPOINT: "https://public.example",
      }),
    ).toBe("https://public.example");
    expect(alpenglowRpcUrl({})).toBe(DEFAULT_SOLANA_RPC_URL);
  });

  it("requests every supported transaction version", () => {
    expect(
      blockRequestOptions("confirmed").maxSupportedTransactionVersion,
    ).toBe(MAX_SUPPORTED_TRANSACTION_VERSION);
  });

  it("stops the cursor before a failed block so the slot is retried", () => {
    expect(
      cursorAfterBlockReads(14, [
        {
          slot: 11,
          block: { blockhash: "11", signatures: [] },
          failed: false,
        },
        { slot: 12, block: null, failed: true },
        {
          slot: 13,
          block: { blockhash: "13", signatures: [] },
          failed: false,
        },
      ]),
    ).toBe(11);
  });

  it("replays a canonical block before finalizing an orphaned confirmation", () => {
    expect(shouldReplayCanonicalBlock("orphan", "canonical")).toBe(true);
    expect(shouldReplayCanonicalBlock("canonical", "canonical")).toBe(false);
    expect(shouldReplayCanonicalBlock(undefined, "canonical")).toBe(true);
  });

  it("defers finalization first observed in the confirmation poll", () => {
    expect(shouldDeferFinalizedBlock(13, 12)).toBe(true);
    expect(shouldDeferFinalizedBlock(12, 12)).toBe(false);
  });
});
