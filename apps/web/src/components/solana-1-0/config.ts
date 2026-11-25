/**
 * Solana 1.0 hero configuration: the validator clients producing mainnet
 * blocks, their light colours, and which sub-clients count toward each
 * family's light.
 */

export type ClientId = "agave" | "firedancer";

export interface ClientConfig {
  id: ClientId;
  name: string;
  language: string;
  team: string;
  /**
   * The client's light: `#rrggbb` (a trailing alpha byte is ignored). Lamps,
   * the plate shader, and the block stream all read this one value.
   */
  hex: string;
  /** `hex` as 0-1 RGB for the shader; derived, never set by hand. */
  rgb: [number, number, number];
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1, 7), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** CSS colour for a client's light at the given opacity. */
export function lightCss(client: ClientConfig, alpha = 1): string {
  const [r, g, b] = client.rgb.map((v) => Math.round(v * 255));
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

const CLIENT_DEFS: Omit<ClientConfig, "rgb">[] = [
  {
    id: "agave",
    name: "Agave",
    language: "Rust",
    team: "Anza",
    hex: "#14f195",
  },
  {
    id: "firedancer",
    name: "Firedancer",
    language: "C",
    team: "Jump",
    hex: "#9945ff",
  },
];

export const CLIENTS: readonly ClientConfig[] = CLIENT_DEFS.map((client) => ({
  ...client,
  rgb: hexToRgb(client.hex),
}));

export const CLIENT_INDEX: Record<ClientId, number> = {
  agave: 0,
  firedancer: 1,
};

/**
 * Sub-client names (as reported by the validator history program, see
 * `lib/slot200/validatorHistory.ts`, plus the gossip-version fallback
 * families) mapped to the family whose light they count toward.
 */
const FAMILY_BY_CLIENT: Record<string, ClientId> = {
  Agave: "agave",
  "Agave lineage": "agave",
  "Solana Labs": "agave",
  Jito: "agave",
  "Agave Paladin": "agave",
  "Agave BAM": "agave",
  "Harmonic Agave": "agave",
  Rakurai: "agave",
  Firedancer: "firedancer",
  Frankendancer: "firedancer",
  FireBAM: "firedancer",
  "Harmonic FD": "firedancer",
  "Harmonic Frank": "firedancer",
};

/**
 * Family for a block's builder. Null for any other client: the block renders
 * neutral grey and does not count toward any client's light.
 */
export function familyOf(client: string | null | undefined): ClientId | null {
  if (!client) return null;
  return FAMILY_BY_CLIENT[client] ?? null;
}

/** Group a slot number in threes: 461204117 -> "461 204 117". */
export function groupSlot(slot: number): string {
  return String(Math.max(0, Math.floor(slot))).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    " ",
  );
}
