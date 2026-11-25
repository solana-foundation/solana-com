import {
  createDefaultRpcTransport,
  createSolanaRpcFromTransport,
  type Rpc,
  type SolanaRpcApi,
} from "@solana/kit";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** A Solana RPC whose transport retries transient throttling (429 / 5xx / network blips). */
export function resilientRpc(url: string): Rpc<SolanaRpcApi> {
  const inner = createDefaultRpcTransport({ url });
  const transport = (async (...args: Parameters<typeof inner>) => {
    let lastErr: unknown;
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        return await inner(...args);
      } catch (e) {
        lastErr = e;
        const msg = String((e as Error)?.message ?? e);
        if (
          !/429|too many|fetch failed|timeout|timed out|50[0-9]|network/i.test(
            msg,
          )
        )
          throw e;
        await sleep(250 * 2 ** attempt);
      }
    }
    throw lastErr;
  }) as typeof inner;
  return createSolanaRpcFromTransport(transport);
}
