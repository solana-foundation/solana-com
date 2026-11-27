/**
 * Particle targets for the Solana 1.0 film stage. Each scene from the launch
 * film is one cloud of `count` points; the renderer morphs between them as
 * the page scrolls.
 *
 * Particle order carries the client: the first half of the buffer is Agave's
 * light, the second half Firedancer's. Every shape sorts its points by a
 * colour field before handing them out, so each client lights one region of
 * the shape instead of a salt-and-pepper mix.
 */

export const SCENE_KEYS = [
  "iris",
  "tree",
  "globe",
  "tower",
  "lattice",
  "torus",
  "tunnel",
  "horizon",
] as const;

export type SceneKey = (typeof SCENE_KEYS)[number];

type Rand = () => number;
/** x, y, z, colour field (low = Firedancer purple, high = Agave green) */
type Emit = (_x: number, _y: number, _z: number, _field: number) => void;

const TAU = Math.PI * 2;

export function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rand: Rand): number {
  const u = Math.max(rand(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * rand());
}

/** The eye: radial fibres around the Solana mark. */
function iris(n: number, rand: Rand, emit: Emit) {
  const logo = Math.floor(n * 0.16);
  const rim = Math.floor(n * 0.07);
  const fibres = 260;
  for (let i = 0; i < n - logo - rim; i++) {
    const fibre = Math.floor(rand() * fibres);
    const angle = (fibre / fibres) * TAU + gauss(rand) * 0.004;
    const r = 0.47 + 0.53 * Math.pow(rand(), 0.85);
    // each fibre waves slightly, like the film's iris
    const wave = Math.sin(r * 14 + fibre) * 0.012;
    const x = Math.cos(angle + wave) * r;
    const y = Math.sin(angle + wave) * r;
    emit(x, y, Math.cos(r * 1.5) * 0.16 - 0.1, x + gauss(rand) * 0.12);
  }
  for (let i = 0; i < rim; i++) {
    const angle = rand() * TAU;
    const r = 1.04 + gauss(rand) * 0.004;
    const x = Math.cos(angle) * r;
    emit(x, Math.sin(angle) * r, -0.08, x + gauss(rand) * 0.12);
  }
  // three bars; the middle one leans the other way
  const w = 0.44;
  const h = 0.105;
  const pitch = 0.17;
  for (let i = 0; i < logo; i++) {
    const bar = Math.floor(rand() * 3);
    const u = rand() - 0.5;
    const v = rand() - 0.5;
    const lean = bar === 1 ? -1 : 1;
    const x = u * w + lean * v * h;
    const y = (1 - bar) * pitch + v * h;
    emit(x, y, 0.06, x * 2.2 + y + gauss(rand) * 0.05);
  }
}

/** Genesis: a branching tree with a flat, wide canopy. */
function tree(n: number, rand: Rand, emit: Emit) {
  const segs: number[][] = [];
  const tips: number[][] = [];
  const grow = (p: number[], d: number[], len: number, depth: number): void => {
    const end = [p[0] + d[0] * len, p[1] + d[1] * len, p[2] + d[2] * len];
    segs.push([...p, ...end, len * (7 - depth)]);
    if (depth >= 6) {
      tips.push(end);
      return;
    }
    const kids = depth === 0 ? 3 : 2;
    for (let k = 0; k < kids; k++) {
      const spread = depth === 0 ? 1.1 : 0.85;
      const nx = d[0] + (rand() * 2 - 1) * spread;
      const ny = d[1] * 0.75 + rand() * 0.3 + 0.1;
      const nz = d[2] + (rand() * 2 - 1) * spread;
      const m = Math.hypot(nx, ny, nz) || 1;
      grow(end, [nx / m, ny / m, nz / m], len * 0.7, depth + 1);
    }
  };
  grow([0, 0, 0], [0, 1, 0], 1, 0);

  const raw: number[][] = [];
  const total = segs.reduce((sum, s) => sum + s[6], 0);
  const wood = Math.floor(n * 0.4);
  for (const s of segs) {
    const count = Math.round((s[6] / total) * wood);
    for (let i = 0; i < count; i++) {
      const t = rand();
      raw.push([
        s[0] + (s[3] - s[0]) * t + gauss(rand) * 0.006,
        s[1] + (s[4] - s[1]) * t + gauss(rand) * 0.006,
        s[2] + (s[5] - s[2]) * t + gauss(rand) * 0.006,
      ]);
    }
  }
  while (raw.length < n) {
    const tip = tips[Math.floor(rand() * tips.length)];
    raw.push([
      tip[0] + gauss(rand) * 0.13,
      tip[1] + gauss(rand) * 0.045,
      tip[2] + gauss(rand) * 0.13,
    ]);
  }

  let minY = Infinity;
  let maxY = -Infinity;
  let maxR = 0;
  for (const p of raw) {
    minY = Math.min(minY, p[1]);
    maxY = Math.max(maxY, p[1]);
    maxR = Math.max(maxR, Math.hypot(p[0], p[2]));
  }
  const scale = Math.min(2.2 / (maxY - minY), 1.25 / maxR);
  const midY = (minY + maxY) / 2;
  for (const p of raw) {
    const y = (p[1] - midY) * scale;
    emit(p[0] * scale, y, p[2] * scale, y + gauss(rand) * 0.08);
  }
}

/** Validator mesh: a wireframe globe with a cluster at every node. */
function globe(n: number, rand: Rand, emit: Emit) {
  const put = (x: number, y: number, z: number, r = 1) =>
    emit(x * r, y * r, z * r, x * 0.9 + y * 0.35 + gauss(rand) * 0.1);
  const lines = Math.floor(n * 0.45);
  for (let i = 0; i < lines; i++) {
    const theta = rand() * TAU;
    if (rand() < 0.5) {
      const lat = ((Math.floor(rand() * 11) - 5) / 6) * (Math.PI / 2);
      put(
        Math.cos(lat) * Math.cos(theta),
        Math.sin(lat),
        Math.cos(lat) * Math.sin(theta),
      );
    } else {
      const lon = (Math.floor(rand() * 16) / 16) * TAU;
      put(
        Math.sin(theta) * Math.cos(lon),
        Math.cos(theta),
        Math.sin(theta) * Math.sin(lon),
      );
    }
  }
  const sites: number[][] = [];
  for (let i = 0; i < 72; i++) {
    const y = rand() * 2 - 1;
    const a = rand() * TAU;
    const r = Math.sqrt(1 - y * y);
    sites.push([Math.cos(a) * r, y, Math.sin(a) * r]);
  }
  const nodes = Math.floor(n * 0.27);
  for (let i = 0; i < nodes; i++) {
    const s = sites[Math.floor(rand() * sites.length)];
    const x = s[0] + gauss(rand) * 0.022;
    const y = s[1] + gauss(rand) * 0.022;
    const z = s[2] + gauss(rand) * 0.022;
    const m = Math.hypot(x, y, z);
    put(x / m, y / m, z / m, 1.03);
  }
  for (let i = lines + nodes; i < n; i++) {
    const y = rand() * 2 - 1;
    const a = rand() * TAU;
    const r = Math.sqrt(1 - y * y);
    put(Math.cos(a) * r, y, Math.sin(a) * r, 0.985);
  }
}

/** Blocks: a stacked tower, three slabs a layer, the top layer lifting off. */
function tower(n: number, rand: Rand, emit: Emit) {
  const layers = 15;
  const pitch = 0.15;
  const half = [0.46, 0.058, 0.142];
  for (let i = 0; i < n; i++) {
    const layer = Math.floor(rand() * layers);
    const slot = Math.floor(rand() * 3) - 1;
    const local = [0, 0, 0];
    const edge = rand() < 0.55;
    const free = Math.floor(rand() * 3);
    for (let axis = 0; axis < 3; axis++) {
      const snap = edge ? axis !== free : axis === free;
      local[axis] =
        (snap ? (rand() < 0.5 ? -1 : 1) : rand() * 2 - 1) * half[axis];
    }
    const across = slot * 0.31;
    const along = layer % 2 === 0;
    const x = along ? local[0] : across + local[2];
    const z = along ? across + local[2] : local[0];
    const lift = layer === layers - 1 ? 0.16 : 0;
    const y = (layer - (layers - 1) / 2) * pitch + local[1] + lift - 0.06;
    emit(x, y, z, y + gauss(rand) * 0.1);
  }
}

/** Node graph: a cubic lattice, tilted. */
function lattice(n: number, rand: Rand, emit: Emit) {
  const grid = 6;
  const span = 0.86;
  const at = (i: number) => (i / (grid - 1)) * 2 * span - span;
  const cx = Math.cos(0.55);
  const sx = Math.sin(0.55);
  const cz = Math.cos(0.32);
  const sz = Math.sin(0.32);
  const put = (x: number, y: number, z: number) => {
    const y1 = y * cx - z * sx;
    const z1 = y * sx + z * cx;
    const x2 = x * cz - y1 * sz;
    const y2 = x * sz + y1 * cz;
    emit(x2, y2, z1, x + y + z + gauss(rand) * 0.2);
  };
  const pick = () => at(Math.floor(rand() * grid));
  for (let i = 0; i < n; i++) {
    const p = [pick(), pick(), pick()];
    if (rand() < 0.62) {
      p[Math.floor(rand() * 3)] = (rand() * 2 - 1) * span;
      put(p[0], p[1], p[2]);
    } else {
      put(
        p[0] + gauss(rand) * 0.017,
        p[1] + gauss(rand) * 0.017,
        p[2] + gauss(rand) * 0.017,
      );
    }
  }
}

/** State field: a particle torus tipped toward the viewer. */
function torus(n: number, rand: Rand, emit: Emit) {
  const major = 0.7;
  const c = Math.cos(1.05);
  const s = Math.sin(1.05);
  for (let i = 0; i < n; i++) {
    const u = rand() * TAU;
    const v = rand() * TAU;
    const minor = 0.3 * (1 + gauss(rand) * 0.07);
    const ring = major + minor * Math.cos(v);
    const x = ring * Math.cos(u);
    const y = minor * Math.sin(v);
    const z = ring * Math.sin(u);
    emit(
      x,
      y * c - z * s,
      y * s + z * c,
      Math.cos(u + 0.5) + gauss(rand) * 0.2,
    );
  }
}

/** The warp: spiral arms opening toward the viewer. */
function tunnel(n: number, rand: Rand, emit: Emit) {
  const arms = 34;
  for (let i = 0; i < n; i++) {
    const arm = Math.floor(rand() * arms);
    const t = Math.pow(rand(), 0.8);
    const radius = 0.06 + 2.7 * Math.pow(t, 1.35);
    const angle =
      (arm / arms) * TAU + 2.4 * Math.log(1 + 3 * t) + gauss(rand) * 0.012;
    emit(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      -4 + 6.4 * t,
      Math.cos((arm / arms) * TAU + 0.6) + gauss(rand) * 0.15,
    );
  }
}

/** Mainnet: a planet's limb under a thin field of stars. */
function horizon(n: number, rand: Rand, emit: Emit) {
  const radius = 4.6;
  const centre = -5.3;
  const limb = Math.floor(n * 0.38);
  const stars = Math.floor(n * 0.1);
  for (let i = 0; i < limb; i++) {
    const a = (rand() * 2 - 1) * 0.95;
    // atmosphere: an exponential falloff above the surface
    const r = radius + -Math.log(Math.max(rand(), 1e-6)) * 0.035;
    const x = Math.sin(a) * r;
    emit(
      x,
      centre + Math.cos(a) * r,
      gauss(rand) * 0.05,
      -x + gauss(rand) * 0.5,
    );
  }
  for (let i = 0; i < stars; i++) {
    const x = (rand() * 2 - 1) * 4.2;
    emit(x, -0.5 + rand() * 2.6, -3 + rand() * 3, -x + gauss(rand) * 2);
  }
  for (let i = limb + stars; i < n; i++) {
    // the lit cap facing the viewer
    const a = (rand() * 2 - 1) * 0.95;
    const b = Math.pow(rand(), 1.6) * 0.5;
    const x = Math.sin(a) * Math.cos(b) * radius;
    emit(
      x,
      centre + Math.cos(a) * Math.cos(b) * radius,
      Math.sin(b) * radius,
      -x + gauss(rand) * 0.5,
    );
  }
}

const GENERATORS: Record<SceneKey, (_n: number, _r: Rand, _e: Emit) => void> = {
  iris,
  tree,
  globe,
  tower,
  lattice,
  torus,
  tunnel,
  horizon,
};

function shuffledRange(start: number, end: number, rand: Rand): Uint32Array {
  const out = new Uint32Array(end - start);
  for (let i = 0; i < out.length; i++) out[i] = start + i;
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

/** Particles below this index belong to Agave; the rest to Firedancer. */
export function familySplit(count: number): number {
  return count >> 1;
}

/**
 * `count` xyz positions for a scene, ordered so the greenest half of the
 * shape lands on Agave's particles and the rest on Firedancer's.
 */
export function buildShape(key: SceneKey, count: number): Float32Array {
  const rand = mulberry32(SCENE_KEYS.indexOf(key) * 7919 + 17);
  const raw = new Float32Array(count * 3);
  const field = new Float32Array(count);
  let filled = 0;
  GENERATORS[key](count, rand, (x, y, z, f) => {
    if (filled >= count) return;
    raw[filled * 3] = x;
    raw[filled * 3 + 1] = y;
    raw[filled * 3 + 2] = z;
    field[filled] = f;
    filled++;
  });
  for (let i = filled; i < count && filled > 0; i++) {
    const src = Math.floor(rand() * filled);
    raw.copyWithin(i * 3, src * 3, src * 3 + 3);
    field[i] = field[src];
  }

  const order = new Uint32Array(count);
  for (let i = 0; i < count; i++) order[i] = i;
  order.sort((a, b) => field[a] - field[b]);

  const split = familySplit(count);
  const agave = shuffledRange(0, split, rand);
  const firedancer = shuffledRange(split, count, rand);
  const out = new Float32Array(count * 3);
  for (let rank = 0; rank < count; rank++) {
    const src = order[rank] * 3;
    const dst =
      (rank < firedancer.length
        ? firedancer[rank]
        : agave[rank - firedancer.length]) * 3;
    out[dst] = raw[src];
    out[dst + 1] = raw[src + 1];
    out[dst + 2] = raw[src + 2];
  }
  return out;
}
