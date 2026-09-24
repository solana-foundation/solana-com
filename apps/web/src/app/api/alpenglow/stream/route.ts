import type {
  AlpenglowEvent,
  BlockConfirmed,
  TransactionObserved,
} from "@/components/alpenglow/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const encoder = new TextEncoder();
const POLL_MS = 700;
const MAX_BLOCKS_PER_POLL = 3;

type RpcBlock = {
  blockhash: string;
  signatures: string[];
};

async function rpc<T>(url: string, method: string, params: unknown[] = []) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: method, method, params }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`RPC ${response.status}`);
  const payload = (await response.json()) as {
    result?: T;
    error?: { message: string };
  };
  if (payload.error) throw new Error(payload.error.message);
  return payload.result as T;
}

function sse(event: AlpenglowEvent) {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
}

function fixtureSignature(slot: number, index: number) {
  return `fixture-${slot.toString(36)}-${index.toString(36)}-FinalForm`;
}

function fixtureBlock(
  slot: number,
  now: number,
  count = 2_900,
): AlpenglowEvent[] {
  const blockhash = `fixture-block-${slot}`;
  const signatures = Array.from({ length: count }, (_, index) =>
    fixtureSignature(slot, index),
  );
  const transactions: TransactionObserved[] = signatures.map(
    (signature, index) => ({
      type: "transaction_observed",
      signature,
      slot,
      blockhash,
      observedAt: now,
      programIds: index % 4 === 0 ? ["Tokenkeg"] : ["1111111"],
      success: index % 23 !== 0,
      fee: 5_000 + (index % 8) * 250,
      computeUnits: 18_000 + (index % 12) * 8_000,
      indexInBlock: index,
    }),
  );
  return [
    ...transactions,
    {
      type: "block_confirmed",
      slot,
      blockhash,
      confirmedAt: now,
      transactionSignatures: signatures,
      transactionCount: signatures.length,
    },
  ];
}

async function runFixture(
  controller: ReadableStreamDefaultController<Uint8Array>,
  signal: AbortSignal,
) {
  controller.enqueue(
    sse({
      type: "stream_status",
      status: "simulated",
      protocol: "tower-bft",
      sampled: false,
      message: "Deterministic recorded fixture",
    }),
  );
  let slot = 428_901_741;
  const pending: Array<{
    slot: number;
    blockhash: string;
    confirmedAt: number;
  }> = [];
  while (!signal.aborted) {
    const now = Date.now();
    const events = fixtureBlock(slot, now);
    for (const event of events) controller.enqueue(sse(event));
    pending.push({
      slot,
      blockhash: `fixture-block-${slot}`,
      confirmedAt: now,
    });
    if (pending.length > 5) {
      const block = pending.shift()!;
      controller.enqueue(
        sse({
          type: "block_finalized",
          slot: block.slot,
          blockhash: block.blockhash,
          finalizedAt: now,
          observedFinalityMs: now - block.confirmedAt,
        }),
      );
    }
    controller.enqueue(
      sse({
        type: "performance_sample",
        sampledAt: now,
        totalTps: 2_412 + (slot % 9) * 37,
        nonVoteTps: 1_180 + (slot % 7) * 23,
        samplePeriodSeconds: 1,
      }),
    );
    slot += 1;
    await new Promise((resolve) => setTimeout(resolve, 1_200));
  }
}

async function getBlock(url: string, slot: number, commitment: string) {
  return rpc<RpcBlock | null>(url, "getBlock", [
    slot,
    {
      commitment,
      encoding: "json",
      transactionDetails: "signatures",
      rewards: false,
      maxSupportedTransactionVersion: 0,
    },
  ]);
}

async function runLive(
  url: string,
  controller: ReadableStreamDefaultController<Uint8Array>,
  signal: AbortSignal,
) {
  let confirmedCursor =
    (await rpc<number>(url, "getSlot", [{ commitment: "confirmed" }])) - 2;
  let finalizedCursor =
    (await rpc<number>(url, "getSlot", [{ commitment: "finalized" }])) - 1;
  const confirmedAt = new Map<number, { at: number; hash: string }>();
  let performanceTick = 6;
  let protocol: "tower-bft" | "alpenglow" | "unknown" = "unknown";

  try {
    const certificate = await rpc<unknown>(url, "getAgGenesisCert");
    protocol = certificate == null ? "tower-bft" : "alpenglow";
  } catch {
    protocol = "unknown";
  }
  controller.enqueue(
    sse({ type: "stream_status", status: "live", protocol, sampled: false }),
  );

  while (!signal.aborted) {
    try {
      const [confirmedHead, finalizedHead] = await Promise.all([
        rpc<number>(url, "getSlot", [{ commitment: "confirmed" }]),
        rpc<number>(url, "getSlot", [{ commitment: "finalized" }]),
      ]);
      const confirmedEnd = Math.min(
        confirmedHead,
        confirmedCursor + MAX_BLOCKS_PER_POLL,
      );
      for (let slot = confirmedCursor + 1; slot <= confirmedEnd; slot += 1) {
        const block = await getBlock(url, slot, "confirmed").catch(() => null);
        if (!block) continue;
        const now = Date.now();
        const signatures: string[] = [];
        block.signatures.forEach((signature, index) => {
          signatures.push(signature);
          controller.enqueue(
            sse({
              type: "transaction_observed",
              signature,
              slot,
              blockhash: block.blockhash,
              observedAt: now,
              programIds: [],
              success: true,
              indexInBlock: index,
            }),
          );
        });
        const event: BlockConfirmed = {
          type: "block_confirmed",
          slot,
          blockhash: block.blockhash,
          confirmedAt: now,
          transactionSignatures: signatures,
          transactionCount: signatures.length,
        };
        confirmedAt.set(slot, { at: now, hash: block.blockhash });
        controller.enqueue(sse(event));
      }
      confirmedCursor = confirmedEnd;

      const finalizedEnd = Math.min(
        finalizedHead,
        finalizedCursor + MAX_BLOCKS_PER_POLL,
      );
      for (let slot = finalizedCursor + 1; slot <= finalizedEnd; slot += 1) {
        const observed = confirmedAt.get(slot);
        const block = observed
          ? null
          : await getBlock(url, slot, "finalized").catch(() => null);
        const hash = observed?.hash ?? block?.blockhash;
        if (!hash) continue;
        const now = Date.now();
        controller.enqueue(
          sse({
            type: "block_finalized",
            slot,
            blockhash: hash,
            finalizedAt: now,
            observedFinalityMs: observed ? now - observed.at : 0,
          }),
        );
        confirmedAt.delete(slot);
      }
      finalizedCursor = finalizedEnd;

      performanceTick += 1;
      if (performanceTick % 7 === 0) {
        const samples = await rpc<
          Array<{
            numTransactions: number;
            numNonVoteTransactions?: number;
            samplePeriodSecs: number;
          }>
        >(url, "getRecentPerformanceSamples", [1]);
        const sample = samples[0];
        if (sample)
          controller.enqueue(
            sse({
              type: "performance_sample",
              sampledAt: Date.now(),
              totalTps: sample.numTransactions / sample.samplePeriodSecs,
              nonVoteTps:
                sample.numNonVoteTransactions == null
                  ? undefined
                  : sample.numNonVoteTransactions / sample.samplePeriodSecs,
              samplePeriodSeconds: sample.samplePeriodSecs,
            }),
          );
      }
    } catch (error) {
      controller.enqueue(
        sse({
          type: "stream_status",
          status: "reconnecting",
          protocol,
          sampled: false,
          message: error instanceof Error ? error.message : "RPC unavailable",
        }),
      );
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
}

export async function GET(request: Request) {
  const rpcUrl = process.env.SOLANA_RPC_URL;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        sse({
          type: "stream_status",
          status: "connecting",
          protocol: "unknown",
          sampled: false,
        }),
      );
      const runner = rpcUrl
        ? runLive(rpcUrl, controller, request.signal)
        : runFixture(controller, request.signal);
      runner.catch(() => {
        if (!request.signal.aborted) controller.close();
      });
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
