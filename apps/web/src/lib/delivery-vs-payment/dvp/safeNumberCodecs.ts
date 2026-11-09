/**
 * Guarded u64/i64 encoders for the generated instruction data codecs.
 *
 * `@solana/kit`'s `getU64Encoder` / `getI64Encoder` accept `number | bigint`
 * and encode via `BigInt(value)`. A JavaScript `number` above
 * `Number.MAX_SAFE_INTEGER` has already lost precision by then, so distinct
 * 64-bit amounts collapse to the same wire bytes with no error. For a DvP
 * that is source-of-truth corruption: CreateDvp is the consent point and the
 * program stores and settles the amounts verbatim.
 *
 * These wrappers require a `bigint` and throw on any `number`, so the only
 * way to pass a 64-bit value is losslessly. The codegen patch
 * (`patch-typescript-safe-numbers.ts`) rewrites the generated encoders to use
 * these; keep this file outside `generated/` so it survives regeneration.
 */
import {
  getI64Encoder,
  getU64Encoder,
  transformEncoder,
  type FixedSizeEncoder,
} from "@solana/kit";

function requireBigint(codec: string, value: bigint): bigint {
  if (typeof value !== "bigint") {
    throw new TypeError(
      `${codec} argument must be a bigint, got ${typeof value}. ` +
        `A JavaScript number cannot represent all 64-bit values (anything ` +
        `above 2^53 rounds), so pass a bigint literal such as 123n for ` +
        `token amounts, nonces, and timestamps.`,
    );
  }
  return value;
}

/**
 * `getU64Encoder` that rejects `number`, requiring a lossless `bigint`.
 * Stays fixed-size (8 bytes) so all-fixed instruction structs keep their
 * `FixedSizeEncoder` type.
 */
export function getSafeU64Encoder(): FixedSizeEncoder<bigint> {
  return transformEncoder(getU64Encoder(), (value: bigint) =>
    requireBigint("u64", value),
  );
}

/** `getI64Encoder` that rejects `number`, requiring a lossless `bigint`. */
export function getSafeI64Encoder(): FixedSizeEncoder<bigint> {
  return transformEncoder(getI64Encoder(), (value: bigint) =>
    requireBigint("i64", value),
  );
}
