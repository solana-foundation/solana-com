/** Amount + address formatting shared across the UI. */

/** Base-unit bigint → human string, e.g. 10000n @ 2 decimals → "100.00". */
export function formatAmount(
  base: bigint,
  decimals: number,
  opts?: { compact?: boolean },
): string {
  const neg = base < 0n;
  const abs = neg ? -base : base;
  const d = BigInt(10) ** BigInt(decimals);
  const whole = abs / d;
  const frac = abs % d;
  const wholeStr = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (decimals === 0) return (neg ? "-" : "") + wholeStr;
  let fracStr = frac.toString().padStart(decimals, "0");
  if (opts?.compact) fracStr = fracStr.replace(/0+$/, "") || "0";
  return (neg ? "-" : "") + wholeStr + "." + fracStr;
}

/** Human string → base-unit bigint. Throws on malformed input. */
export function parseAmount(input: string, decimals: number): bigint {
  const cleaned = input.replace(/,/g, "").trim();
  if (!/^\d+(\.\d+)?$/.test(cleaned))
    throw new Error(`Invalid amount: ${input}`);
  const [whole, frac = ""] = cleaned.split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return (
    BigInt(whole) * BigInt(10) ** BigInt(decimals) + BigInt(fracPadded || "0")
  );
}

/** SOL float → lamports bigint. */
export function solToLamports(sol: number): bigint {
  return BigInt(Math.round(sol * 1_000_000_000));
}

/** lamports bigint → SOL string. */
export function lamportsToSol(lamports: bigint, dp = 3): string {
  return (Number(lamports) / 1_000_000_000).toFixed(dp);
}

/** Middle-truncate an address: "dvp34bdb…dcsyZq". */
export function shortAddress(addr: string, lead = 4, tail = 4): string {
  if (addr.length <= lead + tail + 1) return addr;
  return `${addr.slice(0, lead)}…${addr.slice(-tail)}`;
}

/** Whole-second countdown → "59m 12s" / "12s". */
export function formatCountdown(secondsLeft: number): string {
  if (secondsLeft <= 0) return "expired";
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}
