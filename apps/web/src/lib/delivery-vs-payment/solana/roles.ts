import {
  createKeyPairSignerFromPrivateKeyBytes,
  type KeyPairSigner,
} from "@solana/kit";
import type { RoleKey } from "../config";

/**
 * App-managed role identities. Each actor is an ephemeral devnet keypair whose
 * 32-byte seed lives in localStorage, so one person can act as every party and
 * the demo survives a page reload. These are throwaway demo keys — never real
 * funds beyond the devnet tokens the faucet drips.
 */
const STORE_KEY = "dvp-demo-roles-v1";
const ROLE_KEYS: RoleKey[] = ["maker", "partyA", "partyB", "authority"];

type SeedMap = Record<RoleKey, string>;

function randomSeedHex(): string {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++)
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export function loadOrCreateSeeds(): SeedMap {
  let seeds: Partial<SeedMap> = {};
  try {
    seeds = JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}");
  } catch {
    seeds = {};
  }
  let changed = false;
  for (const k of ROLE_KEYS) {
    if (!seeds[k]) {
      seeds[k] = randomSeedHex();
      changed = true;
    }
  }
  if (changed) localStorage.setItem(STORE_KEY, JSON.stringify(seeds));
  return seeds as SeedMap;
}

export function resetSeeds(): void {
  localStorage.removeItem(STORE_KEY);
}

export async function signersFromSeeds(
  seeds: SeedMap,
): Promise<Record<RoleKey, KeyPairSigner>> {
  const entries = await Promise.all(
    ROLE_KEYS.map(
      async (k) =>
        [
          k,
          await createKeyPairSignerFromPrivateKeyBytes(hexToBytes(seeds[k])),
        ] as const,
    ),
  );
  return Object.fromEntries(entries) as Record<RoleKey, KeyPairSigner>;
}
