import type { RpcPath } from "./directory-state";
import type { RpcSceneLabels } from "./RpcRouteScene";

/** Patch-bay hero shared by the Three.js scene and its SVG fallback.
 * Coordinates are scene units: x right, y up, origin at the rack centre.
 * Label points are the centre of each label.
 */
export type PatchModule = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  jacks: number;
  knobs?: number;
  leds?: boolean;
  grille?: boolean;
  glyphs?: boolean;
  dim?: boolean;
};
export type PatchTone = "request" | "cluster" | "shared" | "standby";
export type PatchCable = {
  from: [string, number];
  to: [string, number];
  tone: PatchTone;
  role?: "request" | "downstream";
};
export type PatchLabel = { key: keyof RpcSceneLabels; x: number; y: number };
export type PatchLayout = {
  frame?: { x: number; y: number; w: number; h: number };
  modules: PatchModule[];
  cables: PatchCable[];
  labels: PatchLabel[];
};

export const PATCH_COLORS = {
  panel: "#1F2221",
  rack: "#101212",
  cream: "#E7DFD0",
  socket: "#060707",
} as const;
/** Solana palette: green, purple, cyan, blue-violet. */
export const PATCH_TONES: Record<PatchTone, string> = {
  request: "#14F195",
  cluster: "#9945FF",
  shared: "#00D4FF",
  standby: "#6570ED",
};
export const PATCH_RACK = { x: 0.3, y: -0.12, w: 8.3, h: 4.3 } as const;

const app = (x: number): PatchModule => ({
  id: "app",
  x,
  y: 0,
  w: 1,
  h: 1.3,
  jacks: 3,
  knobs: 1,
  glyphs: true,
});
const cluster: PatchModule = {
  id: "cluster",
  x: 3.05,
  y: -0.05,
  w: 2.3,
  h: 2.75,
  jacks: 3,
  grille: true,
};

export const PATCH_LAYOUTS: Record<RpcPath, PatchLayout> = {
  local: {
    frame: { x: 0.25, y: 0.02, w: 5.7, h: 3.35 },
    modules: [
      app(-1.45),
      {
        id: "rpc",
        x: 1.95,
        y: 0,
        w: 1.2,
        h: 1.4,
        jacks: 3,
        knobs: 2,
        leds: true,
      },
    ],
    cables: [
      { from: ["app", 2], to: ["rpc", 0], tone: "request", role: "request" },
    ],
    labels: [
      { key: "machine", x: -1.95, y: 1.5 },
      { key: "app", x: -1.45, y: 0.82 },
      { key: "localValidator", x: 1.95, y: 0.86 },
    ],
  },
  public: {
    modules: [
      app(-3.1),
      {
        id: "peer-a",
        x: -1.95,
        y: 1.2,
        w: 0.62,
        h: 0.72,
        jacks: 1,
        dim: true,
      },
      {
        id: "peer-b",
        x: -1.15,
        y: 1.2,
        w: 0.62,
        h: 0.72,
        jacks: 1,
        dim: true,
      },
      {
        id: "rpc",
        x: 0.1,
        y: 0,
        w: 1.15,
        h: 1.4,
        jacks: 4,
        knobs: 2,
        leds: true,
      },
      cluster,
    ],
    cables: [
      { from: ["peer-a", 0], to: ["rpc", 1], tone: "shared" },
      { from: ["peer-b", 0], to: ["rpc", 2], tone: "shared" },
      { from: ["app", 2], to: ["rpc", 0], tone: "request", role: "request" },
      {
        from: ["rpc", 3],
        to: ["cluster", 0],
        tone: "cluster",
        role: "downstream",
      },
    ],
    labels: [
      { key: "otherApps", x: -1.55, y: 1.72 },
      { key: "app", x: -3.1, y: 0.82 },
      { key: "official", x: 0.1, y: 0.86 },
      { key: "devnet", x: 3.05, y: 1.48 },
    ],
  },
  production: {
    modules: [
      app(-3.1),
      {
        id: "rpc",
        x: -0.25,
        y: 0.55,
        w: 1.15,
        h: 1.35,
        jacks: 3,
        knobs: 2,
        leds: true,
      },
      {
        id: "fallback",
        x: -0.15,
        y: -1.02,
        w: 1.9,
        h: 0.9,
        jacks: 2,
        dim: true,
      },
      cluster,
    ],
    cables: [
      { from: ["app", 1], to: ["fallback", 0], tone: "standby" },
      { from: ["fallback", 1], to: ["cluster", 1], tone: "standby" },
      { from: ["app", 2], to: ["rpc", 0], tone: "request", role: "request" },
      {
        from: ["rpc", 2],
        to: ["cluster", 0],
        tone: "cluster",
        role: "downstream",
      },
    ],
    labels: [
      { key: "app", x: -3.1, y: 0.82 },
      { key: "provider", x: -0.25, y: 1.39 },
      { key: "fallback", x: -0.45, y: -0.79 },
      { key: "mainnet", x: 3.05, y: 1.48 },
    ],
  },
};

export function jackSpacing(part: PatchModule) {
  return Math.min(0.24, (part.w - 0.3) / Math.max(1, part.jacks - 1));
}

export function jackPosition(part: PatchModule, index: number) {
  const x = part.grille
    ? -part.w / 2 + 0.3 + index * 0.24
    : (index - (part.jacks - 1) / 2) * jackSpacing(part);
  return { x: part.x + x, y: part.y - part.h / 2 + 0.2 };
}

/** Patch cables hang below both jacks, with a deeper sag for longer runs. */
export function cableEnds(layout: PatchLayout, cable: PatchCable) {
  const find = (id: string) => {
    const part = layout.modules.find((item) => item.id === id);
    if (!part) throw new Error(`Unknown patch module: ${id}`);
    return part;
  };
  const a = jackPosition(find(cable.from[0]), cable.from[1]);
  const b = jackPosition(find(cable.to[0]), cable.to[1]);
  const sag = 0.22 + Math.abs(b.x - a.x) * 0.08;
  return { a, b, low: Math.min(a.y, b.y) - sag };
}

/** Dot positions inside the cluster grille, in module-local units. */
export function grilleDots(radius: number, spacing = 0.105) {
  const dots: { x: number; y: number; lit: boolean }[] = [];
  let index = 0;
  for (let y = -radius; y <= radius + 1e-6; y += spacing)
    for (let x = -radius; x <= radius + 1e-6; x += spacing) {
      if (x * x + y * y > (radius - 0.04) ** 2) continue;
      // Deterministic sparse lit pattern so both renderers agree.
      dots.push({ x, y, lit: (index * 37 + 11) % 23 === 0 });
      index++;
    }
  return dots;
}

/** Outline glyphs from the reference panel: circle, triangle, square. */
export const APP_GLYPHS = [
  { kind: "circle", dx: -0.26 },
  { kind: "triangle", dx: 0 },
  { kind: "square", dx: 0.26 },
] as const;
export const GLYPH_Y = -0.08;
export const GLYPH_SIZE = 0.085;
