import type {
  AlpenglowEvent,
  BlockConfirmed,
  StreamStatus,
} from "@/components/alpenglow/types";
import { unstable_cache } from "next/cache";
import {
  alpenglowRpcUrl,
  blockRequestOptions,
  cursorAfterBlockReads,
  shouldDeferFinalizedBlock,
  shouldReplayCanonicalBlock,
  type BlockRead,
  type RpcBlock,
} from "@/lib/alpenglow-stream";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const encoder = new TextEncoder();
const POLL_MS = 300;
const MAX_BLOCKS_PER_POLL = 64;
const MAX_CONCURRENT_BLOCK_READS = 8;
const MAX_RETRY_MS = 10_000;
const MAX_STREAM_CLIENTS = 64;
const MAX_PENDING_BYTES_PER_CLIENT = 2 * 1024 * 1024;
const BLOCK_CACHE_REVALIDATE_SECONDS = 4;
const PERFORMANCE_CACHE_REVALIDATE_SECONDS = 15;
const PROTOCOL_CACHE_REVALIDATE_SECONDS = 60;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
type Emit = (_event: AlpenglowEvent) => void;
type Subscriber = {
  controller: ReadableStreamDefaultController<Uint8Array>;
  pending: Uint8Array[];
  pendingBytes: number;
  streamVersion: 1 | 2;
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

type Commitment = "confirmed" | "finalized";
type PerformanceSample = {
  numTransactions: number;
  numNonVoteTransactions?: number;
  samplePeriodSecs: number;
};

async function loadBlock(url: string, slot: number, commitment: Commitment) {
  const block = await rpc<RpcBlock | null>(url, "getBlock", [
    slot,
    blockRequestOptions(commitment),
  ]);
  // Do not persist a transient null while a newly confirmed block is still
  // becoming available. Failed cache fills are retried by the stream loop.
  if (!block) throw new Error(`Block ${slot} unavailable`);
  return block;
}

async function loadProducedSlots(
  url: string,
  start: number,
  end: number,
  commitment: Commitment,
) {
  return rpc<number[]>(url, "getBlocks", [start, end, { commitment }]);
}

async function loadPerformanceSamples(url: string) {
  return rpc<PerformanceSample[]>(url, "getRecentPerformanceSamples", [1]);
}

async function loadProtocolCertificate(url: string) {
  return rpc<unknown>(url, "getAgGenesisCert");
}

// As on /200ms, keep local development live while sharing production RPC
// reads through Vercel's data cache. Slot heads remain uncached because their
// arrival times are used to measure and render observed finality.
const getCachedBlock = IS_PRODUCTION
  ? unstable_cache(loadBlock, ["alpenglow-block-v1"], {
      revalidate: BLOCK_CACHE_REVALIDATE_SECONDS,
    })
  : null;
const getCachedProducedSlots = IS_PRODUCTION
  ? unstable_cache(loadProducedSlots, ["alpenglow-produced-slots-v1"], {
      revalidate: BLOCK_CACHE_REVALIDATE_SECONDS,
    })
  : null;
const getCachedPerformanceSamples = IS_PRODUCTION
  ? unstable_cache(loadPerformanceSamples, ["alpenglow-performance-v1"], {
      revalidate: PERFORMANCE_CACHE_REVALIDATE_SECONDS,
    })
  : null;
const getCachedProtocolCertificate = IS_PRODUCTION
  ? unstable_cache(loadProtocolCertificate, ["alpenglow-protocol-v1"], {
      revalidate: PROTOCOL_CACHE_REVALIDATE_SECONDS,
    })
  : null;

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

function enqueue(subscriber: Subscriber, chunk: Uint8Array) {
  if (
    subscriber.pending.length === 0 &&
    (subscriber.controller.desiredSize ?? 0) > 0
  ) {
    subscriber.controller.enqueue(chunk);
    return true;
  }
  if (
    subscriber.pendingBytes + chunk.byteLength >
    MAX_PENDING_BYTES_PER_CLIENT
  ) {
    removeSubscriber(subscriber);
    subscriber.controller.close();
    return false;
  }
  subscriber.pending.push(chunk);
  subscriber.pendingBytes += chunk.byteLength;
  return true;
}

function legacyTransactionChunks(event: BlockConfirmed) {
  return (event.transactionSignatures ?? []).map((signature, indexInBlock) =>
    sse({
      type: "transaction_observed",
      signature,
      slot: event.slot,
      blockhash: event.blockhash,
      observedAt: event.confirmedAt,
      programIds: [],
      success: true,
      indexInBlock,
    }),
  );
}

function publish(event: AlpenglowEvent) {
  if (event.type === "stream_status") latestStatus = event;
  const chunk = sse(event);
  const legacyChunks =
    event.type === "block_confirmed" &&
    [...subscribers].some((subscriber) => subscriber.streamVersion === 1)
      ? legacyTransactionChunks(event)
      : [];
  for (const subscriber of [...subscribers]) {
    if (subscriber.streamVersion === 1) {
      for (const legacyChunk of legacyChunks) {
        if (!enqueue(subscriber, legacyChunk)) break;
      }
    }
    if (subscribers.has(subscriber)) enqueue(subscriber, chunk);
  }
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

async function getBlock(
  url: string,
  slot: number,
  commitment: Commitment,
  signal: AbortSignal,
) {
  if (!getCachedBlock) {
    return rpc<RpcBlock | null>(
      url,
      "getBlock",
      [slot, blockRequestOptions(commitment)],
      signal,
    );
  }
  signal.throwIfAborted();
  const block = await getCachedBlock(url, slot, commitment);
  signal.throwIfAborted();
  return block;
}

async function getProducedSlots(
  url: string,
  start: number,
  end: number,
  commitment: Commitment,
  signal: AbortSignal,
) {
  if (end < start) return [];
  if (!getCachedProducedSlots) {
    return rpc<number[]>(
      url,
      "getBlocks",
      [start, end, { commitment }],
      signal,
    );
  }
  signal.throwIfAborted();
  const slots = await getCachedProducedSlots(url, start, end, commitment);
  signal.throwIfAborted();
  return slots;
}

async function readBlockRange(
  url: string,
  start: number,
  end: number,
  commitment: Commitment,
  signal: AbortSignal,
) {
  if (end < start) {
    return {
      reads: [] as BlockRead[],
      cursor: start - 1,
      failed: false,
      error: undefined,
    };
  }
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
  const event: BlockConfirmed = {
    type: "block_confirmed",
    slot,
    blockhash: block.blockhash,
    confirmedAt: now,
    transactionSignatures: block.signatures,
    transactionCount: block.signatures.length,
  };
  emit(event);
}

async function runLive(url: string, emit: Emit, signal: AbortSignal) {
  let confirmedCursor =
    (await rpc<number>(url, "getSlot", [{ commitment: "confirmed" }], signal)) -
    2;
  // Start finalization at the first confirmation this producer can observe.
  // Replaying the pre-connection finalized gap would enqueue a stale finality
  // window and make the artwork fall behind the live network.
  let finalizedCursor = confirmedCursor;
  const confirmedAt = new Map<number, { at: number; hash: string }>();
  let performanceTick = 6;
  let protocol: "tower-bft" | "alpenglow" | "unknown" = "unknown";
  let confirmedRetryMs = POLL_MS;
  let finalizedRetryMs = POLL_MS;
  let confirmedRetryAt = 0;
  let finalizedRetryAt = 0;
  let reconnecting = false;

  try {
    signal.throwIfAborted();
    const certificate = getCachedProtocolCertificate
      ? await getCachedProtocolCertificate(url)
      : await rpc<unknown>(url, "getAgGenesisCert", [], signal);
    if (getCachedProtocolCertificate) signal.throwIfAborted();
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
      const confirmedCursorAtPollStart = confirmedCursor;

      const confirmedEnd = Math.min(
        confirmedHead,
        confirmedCursor + MAX_BLOCKS_PER_POLL,
      );
      const finalizedEnd = Math.min(
        finalizedHead,
        finalizedCursor + MAX_BLOCKS_PER_POLL,
      );
      const [confirmedRange, finalizedRange] = await Promise.all([
        pollNow >= confirmedRetryAt
          ? readBlockRange(
              url,
              confirmedCursor + 1,
              confirmedEnd,
              "confirmed",
              signal,
            )
          : null,
        pollNow >= finalizedRetryAt
          ? readBlockRange(
              url,
              finalizedCursor + 1,
              finalizedEnd,
              "finalized",
              signal,
            )
          : null,
      ]);

      if (confirmedRange) {
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

      if (finalizedRange) {
        let deferredFinalizedSlot: number | undefined;
        for (const { slot, block } of finalizedRange.reads) {
          if (!block) continue;
          if (shouldDeferFinalizedBlock(slot, confirmedCursorAtPollStart)) {
            deferredFinalizedSlot = slot;
            break;
          }
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
        finalizedCursor = deferredFinalizedSlot
          ? deferredFinalizedSlot - 1
          : finalizedRange.cursor;
        finalizedComplete =
          !finalizedRange.failed && deferredFinalizedSlot == null;
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
        signal.throwIfAborted();
        const samples = getCachedPerformanceSamples
          ? await getCachedPerformanceSamples(url)
          : await rpc<PerformanceSample[]>(
              url,
              "getRecentPerformanceSamples",
              [1],
              signal,
            );
        if (getCachedPerformanceSamples) signal.throwIfAborted();
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
  const rpcUrl = alpenglowRpcUrl({
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
    NEXT_PUBLIC_RPC_ENDPOINT: process.env.NEXT_PUBLIC_RPC_ENDPOINT,
  });
  const runner = runLive(rpcUrl, emit, signal);
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

  const streamVersion =
    new URL(request.url).searchParams.get("version") === "2" ? 2 : 1;
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
        streamVersion,
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
