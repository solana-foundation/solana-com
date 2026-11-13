/**
 * Solana 1.0 hero configuration: the four validator clients, their light
 * colours, and which sub-clients count toward each family's light.
 */

export type ClientId = "agave" | "firedancer" | "mithril" | "sig";

export interface ClientConfig {
  id: ClientId;
  name: string;
  language: string;
  team: string;
  /**
   * Producing blocks on mainnet. Flip to `true` when a staged client goes
   * live: it becomes a toggle, its blocks take its colour, and its stencil
   * outline in the plate becomes a light source.
   */
  live: boolean;
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
    live: true,
    hex: "#00f0f0",
  },
  {
    id: "firedancer",
    name: "Firedancer",
    language: "C",
    team: "Jump",
    live: true,
    hex: "#ff1420",
  },
  {
    id: "mithril",
    name: "Mithril",
    language: "Go",
    team: "Overclock",
    live: false,
    hex: "#9d6cff",
  },
  {
    id: "sig",
    name: "Sig",
    language: "Zig",
    team: "Syndica",
    live: false,
    hex: "#5ac8ffff",
  },
];

export const CLIENTS: readonly ClientConfig[] = CLIENT_DEFS.map((client) => ({
  ...client,
  rgb: hexToRgb(client.hex),
}));

export const CLIENT_INDEX: Record<ClientId, number> = {
  agave: 0,
  firedancer: 1,
  mithril: 2,
  sig: 3,
};

export const NEUTRAL_RGB: [number, number, number] = [0.42, 0.41, 0.4];

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
  Mithril: "mithril",
  Sig: "sig",
};

const LIVE = new Set(CLIENTS.filter((c) => c.live).map((c) => c.id));

/**
 * Family for a block's builder. Null when the client is unknown or its
 * family is not yet live on mainnet: the block renders neutral grey and does
 * not count toward any client's light.
 */
export function familyOf(client: string | null | undefined): ClientId | null {
  if (!client) return null;
  const family = FAMILY_BY_CLIENT[client];
  return family && LIVE.has(family) ? family : null;
}

export const TOKENS = {
  bg: "#040408",
  fg: "#ece7df",
  fgDim: "#8a857f",
  fgFaint: "#3f3b3a",
  rule: "#2a2727",
} as const;

/** Site font stacks; canvas text needs literal family names. */
export const FONT_DISPLAY = "Diatype, sans-serif";
export const FONT_MONO = "DSemi, monospace";

/** Group a slot number in threes: 461204117 -> "461 204 117". */
export function groupSlot(slot: number): string {
  return String(Math.max(0, Math.floor(slot))).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    " ",
  );
}
