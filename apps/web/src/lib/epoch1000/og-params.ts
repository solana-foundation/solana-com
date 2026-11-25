/**
 * Query-parameter validation for the Epoch 1000 share card.
 *
 * The card is a Solana-branded PNG that is edge-cached for a day, so every
 * value drawn into it must come from the campaign's own data shapes: a base58
 * wallet address and epoch numbers inside the first-1000-epochs window.
 * Anything else is refused rather than rendered, which stops the route from
 * minting official-looking images with arbitrary text.
 */

const BASE58_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/** Upper bound for the epoch counters the card can show. */
export const MAX_EPOCH = 1000;

export type OgCardParams = {
  survived: number;
  firstEpoch: number;
  currentEpoch: number;
  wallet: string | null;
  capped: boolean;
};

export class InvalidOgParamsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidOgParamsError";
  }
}

function clampInt(raw: string | null, max: number): number {
  const value = parseInt(raw ?? "0", 10);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(value, max);
}

/**
 * Parses and bounds the share-card parameters. Throws when `w` is present but
 * is not a Solana address, so callers can 404 instead of drawing the string.
 */
export function parseOgCardParams(params: URLSearchParams): OgCardParams {
  const rawWallet = params.get("w");
  let wallet: string | null = null;
  if (rawWallet !== null && rawWallet !== "") {
    if (!BASE58_ADDRESS.test(rawWallet)) {
      throw new InvalidOgParamsError("w must be a Solana address");
    }
    wallet = rawWallet;
  }

  const survived = clampInt(params.get("s"), MAX_EPOCH);
  const firstEpoch = clampInt(params.get("fe"), MAX_EPOCH);
  const currentEpoch = Math.max(
    firstEpoch,
    clampInt(params.get("c"), MAX_EPOCH),
  );

  return {
    survived,
    firstEpoch,
    currentEpoch,
    wallet,
    capped: params.get("x") === "1",
  };
}
