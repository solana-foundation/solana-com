import type {
  AlpenglowEvent,
  BlockConfirmed,
  StreamStatus,
  TransactionObserved,
} from "@/components/alpenglow/types";
import {
  blockRequestOptions,
  cursorAfterBlockReads,
  shouldReplayCanonicalBlock,
  type BlockRead,
  type RpcBlock,
} from "@/lib/alpenglow-stream";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const encoder = new TextEncoder();
const POLL_MS = 700;
const MAX_BLOCKS_PER_POLL = 64;
const MAX_CONCURRENT_BLOCK_READS = 8;
const MAX_RETRY_MS = 10_000;
const MAX_STREAM_CLIENTS = 64;
const MAX_PENDING_BYTES_PER_CLIENT = 2 * 1024 * 1024;
const FIXTURE_SAMPLE_SIZE = 512;
type Emit = (_event: AlpenglowEvent) => void;
type Subscriber = {
  controller: ReadableStreamDefaultController<Uint8Array>;
  pending: Uint8Array[];
  pendingBytes: number;
  cleanup: () => void;
};
type Producer = { abort: AbortController };

const subscribers = new Set<Subscriber>();
let producer: Producer | null = null;
let latestStatus: StreamStatus | null = null;

async function rpc<T>(
  url: string,
  method: string,
  params: unknown[] = [],
  signal?: AbortSignal,
) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: method, method, params }),
    cache: "no-store",
    signal,
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

function flush(subscriber: Subscriber) {
  while (
    subscriber.pending.length > 0 &&
    (subscriber.controller.desiredSize ?? 0) > 0
  ) {
    const chunk = subscriber.pending.shift()!;
    subscriber.pendingBytes -= chunk.byteLength;
    subscriber.controller.enqueue(chunk);
  }
}

function removeSubscriber(subscriber: Subscriber) {
  if (!subscribers.delete(subscriber)) return;
  subscriber.cleanup();
  if (subscribers.size === 0) {
    producer?.abort.abort();
  }
}

function publish(event: AlpenglowEvent) {
  if (event.type === "stream_status") latestStatus = event;
  const chunk = sse(event);
  for (const subscriber of [...subscribers]) {
    if (
      subscriber.pending.length === 0 &&
      (subscriber.controller.desiredSize ?? 0) > 0
    ) {
      subscriber.controller.enqueue(chunk);
      continue;
    }
    if (
      subscriber.pendingBytes + chunk.byteLength >
      MAX_PENDING_BYTES_PER_CLIENT
    ) {
      removeSubscriber(subscriber);
      subscriber.controller.close();
      continue;
    }
    subscriber.pending.push(chunk);
    subscriber.pendingBytes += chunk.byteLength;
  }
}

function fixtureSignature(slot: number, index: number) {
  return `fixture-${slot.toString(36)}-${index.toString(36)}-FinalForm`;
}

function fixtureBlock(slot: number, now: number): AlpenglowEvent[] {
  const blockhash = `fixture-block-${slot}`;
  const transactions: TransactionObserved[] = Array.from(
    { length: FIXTURE_SAMPLE_SIZE },
    (_, index) => ({
      type: "transaction_observed",
      signature: fixtureSignature(slot, index),
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
      transactionCount: 2_900,
    },
  ];
}

async function wait(ms: number, signal: AbortSignal) {
  await new Promise<void>((resolve) => {
    const finish = () => {
      signal.removeEventListener("abort", handleAbort);
      resolve();
    };
    const timer = setTimeout(finish, ms);
    const handleAbort = () => {
      clearTimeout(timer);
      finish();
    };
    signal.addEventListener("abort", handleAbort, { once: true });
  });
}

async function runFixture(emit: Emit, signal: AbortSignal) {
  emit({
    type: "stream_status",
    status: "simulated",
    protocol: "tower-bft",
    sampled: true,
    message: "Deterministic sampled fixture",
  });
  let slot = 428_901_741;
  const pending: Array<{
    slot: number;
    blockhash: string;
    confirmedAt: number;
  }> = [];
  while (!signal.aborted) {
    const now = Date.now();
    for (const event of fixtureBlock(slot, now)) emit(event);
    pending.push({
      slot,
      blockhash: `fixture-block-${slot}`,
      confirmedAt: now,
    });
    if (pending.length > 5) {
      const block = pending.shift()!;
      emit({
        type: "block_finalized",
        slot: block.slot,
        blockhash: block.blockhash,
        finalizedAt: now,
        observedFinalityMs: now - block.confirmedAt,
      });
    }
    emit({
      type: "performance_sample",
      sampledAt: now,
      totalTps: 2_412 + (slot % 9) * 37,
      nonVoteTps: 1_180 + (slot % 7) * 23,
      samplePeriodSeconds: 1,
    });
    slot += 1;
    await wait(1_200, signal);
  }
}

async function getBlock(
  url: string,
  slot: number,
  commitment: "confirmed" | "finalized",
  signal: AbortSignal,
) {
  return rpc<RpcBlock | null>(
    url,
    "getBlock",
    [slot, blockRequestOptions(commitment)],
    signal,
  );
}

async function getProducedSlots(
  url: string,
  start: number,
  end: number,
  commitment: "confirmed" | "finalized",
  signal: AbortSignal,
) {
  if (end < start) return [];
  return rpc<number[]>(url, "getBlocks", [start, end, { commitment }], signal);
}

async function readBlockRange(
  url: string,
  start: number,
  end: number,
  commitment: "confirmed" | "finalized",
  signal: AbortSignal,
) {
  let producedSlots: number[];
  try {
    producedSlots = await getProducedSlots(url, start, end, commitment, signal);
  } catch (error) {
    if (signal.aborted) throw error;
    return {
      reads: [] as BlockRead[],
      cursor: start - 1,
      failed: true,
      error,
    };
  }
  const reads: BlockRead[] = [];
  for (
    let index = 0;
    index < producedSlots.length;
    index += MAX_CONCURRENT_BLOCK_READS
  ) {
    const slots = producedSlots.slice(
      index,
      index + MAX_CONCURRENT_BLOCK_READS,
    );
    const batch = await Promise.all(
      slots.map(async (slot) => {
        try {
          return {
            slot,
            block: await getBlock(url, slot, commitment, signal),
            failed: false,
          };
        } catch (error) {
          if (signal.aborted) throw error;
          return { slot, block: null, failed: true };
        }
      }),
    );
    reads.push(...batch);
    if (batch.some((read) => read.failed || !read.block)) break;
  }
  const cursor = cursorAfterBlockReads(end, reads);
  return {
    reads: reads.filter((read) => read.slot <= cursor),
    cursor,
    failed: cursor < end,
    error: undefined,
  };
}

function emitConfirmedBlock(
  emit: Emit,
  slot: number,
  block: RpcBlock,
  now: number,
) {
  block.signatures.forEach((signature, index) => {
    emit({
      type: "transaction_observed",
      signature,
      slot,
      blockhash: block.blockhash,
      observedAt: now,
      programIds: [],
      success: true,
      indexInBlock: index,
    });
  });
  const event: BlockConfirmed = {
    type: "block_confirmed",
    slot,
    blockhash: block.blockhash,
    confirmedAt: now,
    transactionCount: block.signatures.length,
  };
  emit(event);
}

async function runLive(url: string, emit: Emit, signal: AbortSignal) {
  let confirmedCursor =
    (await rpc<number>(url, "getSlot", [{ commitment: "confirmed" }], signal)) -
    2;
  let finalizedCursor =
    (await rpc<number>(url, "getSlot", [{ commitment: "finalized" }], signal)) -
    1;
  const confirmedAt = new Map<number, { at: number; hash: string }>();
  let performanceTick = 6;
  let protocol: "tower-bft" | "alpenglow" | "unknown" = "unknown";
  let confirmedRetryMs = POLL_MS;
  let finalizedRetryMs = POLL_MS;
  let confirmedRetryAt = 0;
  let finalizedRetryAt = 0;
  let reconnecting = false;

  try {
    const certificate = await rpc<unknown>(url, "getAgGenesisCert", [], signal);
    protocol = certificate == null ? "tower-bft" : "alpenglow";
  } catch {
    protocol = "unknown";
  }
  emit({ type: "stream_status", status: "live", protocol, sampled: false });

  while (!signal.aborted) {
    try {
      const [confirmedHead, finalizedHead] = await Promise.all([
        rpc<number>(url, "getSlot", [{ commitment: "confirmed" }], signal),
        rpc<number>(url, "getSlot", [{ commitment: "finalized" }], signal),
      ]);
      const pollNow = Date.now();
      let confirmedComplete = false;
      let finalizedComplete = false;
      let pollError: unknown;

      if (pollNow >= confirmedRetryAt) {
        const confirmedEnd = Math.min(
          confirmedHead,
          confirmedCursor + MAX_BLOCKS_PER_POLL,
        );
        const confirmedRange = await readBlockRange(
          url,
          confirmedCursor + 1,
          confirmedEnd,
          "confirmed",
          signal,
        );
        for (const { slot, block } of confirmedRange.reads) {
          if (!block) continue;
          if (slot <= finalizedCursor) continue;
          const now = Date.now();
          emitConfirmedBlock(emit, slot, block, now);
          confirmedAt.set(slot, { at: now, hash: block.blockhash });
        }
        confirmedCursor = confirmedRange.cursor;
        confirmedComplete = !confirmedRange.failed;
        if (confirmedRange.failed) {
          confirmedRetryMs = Math.min(MAX_RETRY_MS, confirmedRetryMs * 2);
          confirmedRetryAt = pollNow + confirmedRetryMs;
          pollError =
            confirmedRange.error ?? new Error("Confirmed block unavailable");
        } else {
          confirmedRetryMs = POLL_MS;
          confirmedRetryAt = 0;
        }
      }

      if (pollNow >= finalizedRetryAt) {
        const finalizedEnd = Math.min(
          finalizedHead,
          finalizedCursor + MAX_BLOCKS_PER_POLL,
        );
        const finalizedRange = await readBlockRange(
          url,
          finalizedCursor + 1,
          finalizedEnd,
          "finalized",
          signal,
        );
        for (const { slot, block } of finalizedRange.reads) {
          if (!block) continue;
          const observed = confirmedAt.get(slot);
          const now = Date.now();
          if (shouldReplayCanonicalBlock(observed?.hash, block.blockhash)) {
            if (observed) {
              emit({
                type: "block_orphaned",
                slot,
                blockhash: observed.hash,
                replacedBy: block.blockhash,
              });
            }
            emitConfirmedBlock(emit, slot, block, now);
          }
          emit({
            type: "block_finalized",
            slot,
            blockhash: block.blockhash,
            finalizedAt: now,
            observedFinalityMs: observed ? now - observed.at : 0,
          });
          confirmedAt.delete(slot);
        }
        finalizedCursor = finalizedRange.cursor;
        finalizedComplete = !finalizedRange.failed;
        if (finalizedRange.failed) {
          finalizedRetryMs = Math.min(MAX_RETRY_MS, finalizedRetryMs * 2);
          finalizedRetryAt = pollNow + finalizedRetryMs;
          pollError ??=
            finalizedRange.error ?? new Error("Finalized block unavailable");
        } else {
          finalizedRetryMs = POLL_MS;
          finalizedRetryAt = 0;
        }
      }

      performanceTick += 1;
      if (performanceTick % 7 === 0) {
        const samples = await rpc<
          Array<{
            numTransactions: number;
            numNonVoteTransactions?: number;
            samplePeriodSecs: number;
          }>
        >(url, "getRecentPerformanceSamples", [1], signal);
        const sample = samples[0];
        if (sample) {
          emit({
            type: "performance_sample",
            sampledAt: Date.now(),
            totalTps: sample.numTransactions / sample.samplePeriodSecs,
            nonVoteTps:
              sample.numNonVoteTransactions == null
                ? undefined
                : sample.numNonVoteTransactions / sample.samplePeriodSecs,
            samplePeriodSeconds: sample.samplePeriodSecs,
          });
        }
      }
      if (pollError) {
        reconnecting = true;
        emit({
          type: "stream_status",
          status: "reconnecting",
          protocol,
          sampled: false,
          message:
            pollError instanceof Error ? pollError.message : "RPC unavailable",
        });
      } else if (reconnecting && confirmedComplete && finalizedComplete) {
        emit({
          type: "stream_status",
          status: "live",
          protocol,
          sampled: false,
        });
        reconnecting = false;
      }
    } catch (error) {
      if (signal.aborted) return;
      reconnecting = true;
      emit({
        type: "stream_status",
        status: "reconnecting",
        protocol,
        sampled: false,
        message: error instanceof Error ? error.message : "RPC unavailable",
      });
    }
    await wait(POLL_MS, signal);
  }
}

function ensureProducer() {
  if (producer && !producer.abort.signal.aborted) return;
  const nextProducer: Producer = { abort: new AbortController() };
  producer = nextProducer;
  latestStatus = null;
  const signal = nextProducer.abort.signal;
  const emit: Emit = (event) => {
    if (producer === nextProducer && !signal.aborted) publish(event);
  };
  const rpcUrl = process.env.SOLANA_RPC_URL;
  const runner = rpcUrl
    ? runLive(rpcUrl, emit, signal)
    : runFixture(emit, signal);
  runner
    .catch(async (error) => {
      if (!signal.aborted) {
        emit({
          type: "stream_status",
          status: "reconnecting",
          protocol: "unknown",
          sampled: false,
          message:
            error instanceof Error ? error.message : "Stream unavailable",
        });
        await wait(POLL_MS, signal);
      }
    })
    .finally(() => {
      if (producer !== nextProducer) return;
      producer = null;
      if (subscribers.size > 0) ensureProducer();
    });
}

export async function GET(request: Request) {
  if (subscribers.size >= MAX_STREAM_CLIENTS) {
    return new Response("Too many Alpenglow stream clients", {
      status: 503,
      headers: { "Retry-After": "5" },
    });
  }

  let subscriber: Subscriber | undefined;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const handleAbort = () => {
        if (subscriber) removeSubscriber(subscriber);
        try {
          controller.close();
        } catch {
          // The stream may already have been cancelled by the client.
        }
      };
      subscriber = {
        controller,
        pending: [],
        pendingBytes: 0,
        cleanup: () => request.signal.removeEventListener("abort", handleAbort),
      };
      subscribers.add(subscriber);
      request.signal.addEventListener("abort", handleAbort, { once: true });
      const initialStatus =
        producer && !producer.abort.signal.aborted && latestStatus
          ? latestStatus
          : ({
              type: "stream_status",
              status: "connecting",
              protocol: "unknown",
              sampled: false,
            } satisfies StreamStatus);
      controller.enqueue(sse(initialStatus));
      ensureProducer();
    },
    pull() {
      if (subscriber) flush(subscriber);
    },
    cancel() {
      if (subscriber) removeSubscriber(subscriber);
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
