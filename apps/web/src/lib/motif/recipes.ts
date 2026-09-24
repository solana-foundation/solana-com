/**
 * Motif — a curated set, not a search space.
 *
 * Two tiers. The simple tier is one shape on a regular grid — the vocabulary.
 * The composed tier is where the interesting work is: a macro layout whose
 * cells carry a micro texture, tracks of unequal width, dash rhythms that
 * break mid-tile. That second level is what separates a pattern that was
 * designed from a pattern that was merely generated.
 *
 * Colourways are parametric — one hue, a lightness ramp — so a recipe can ask
 * for any tone between ground and figure and stay in the family.
 */

import { oklch } from "@/lib/avatar/core";

const H = Math.PI / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------------------------------------------------------------- colour */

export interface Look {
  id: string;
  name: string;
  h: number; // hue
  gL: number; // ground lightness / chroma
  gC: number;
  fL: number; // figure lightness / chroma
  fC: number;
}

/** any tone on the ramp: 0 is ground, 1 is figure */
export const tone = (k: Look, t: number) =>
  oklch(lerp(k.gL, k.fL, t), lerp(k.gC, k.fC, t), k.h);

export const LOOKS: Look[] = [
  {
    id: "lilac",
    name: "Lilac",
    h: 300,
    gL: 0.34,
    gC: 0.13,
    fL: 0.85,
    fC: 0.09,
  },
  { id: "plum", name: "Plum", h: 352, gL: 0.31, gC: 0.11, fL: 0.8, fC: 0.11 },
  { id: "coral", name: "Coral", h: 27, gL: 0.7, gC: 0.16, fL: 0.94, fC: 0.05 },
  { id: "rust", name: "Rust", h: 52, gL: 0.5, gC: 0.14, fL: 0.88, fC: 0.09 },
  { id: "lime", name: "Lime", h: 124, gL: 0.9, gC: 0.13, fL: 0.68, fC: 0.17 },
  { id: "moss", name: "Moss", h: 138, gL: 0.4, gC: 0.09, fL: 0.83, fC: 0.13 },
  { id: "teal", name: "Teal", h: 196, gL: 0.38, gC: 0.08, fL: 0.82, fC: 0.1 },
  { id: "navy", name: "Navy", h: 254, gL: 0.26, gC: 0.09, fL: 0.72, fC: 0.13 },
  {
    id: "slate",
    name: "Slate",
    h: 250,
    gL: 0.33,
    gC: 0.02,
    fL: 0.82,
    fC: 0.02,
  },
];

/* --------------------------------------------------------------- drawing */

export interface Variant {
  n?: number; // cells across (rhythm recipes divide by tracks instead)
  mode?: number; // which symmetry / orientation the recipe should use
  t?: number; // the one proportion the recipe cares about
  r?: number; // which rhythm to divide the tile by
}

/** what a recipe actually receives: the same shape, with defaults filled in */
export type Cells = Variant & { n: number };

export interface DrawArgs {
  g: string; // ground
  f: string; // figure
  m: string; // the tone between them
  t: (u: number) => string; // any tone on the ramp
  v: Cells;
  S: number;
}

export interface Recipe {
  id: string;
  name: string;
  tier: "simple" | "composed";
  /** the one set of cells this motif is drawn on */
  cells: Variant;
  draw(c: CanvasRenderingContext2D, o: DrawArgs): void;
}

const bg = (c: CanvasRenderingContext2D, g: string, S: number) => {
  c.fillStyle = g;
  c.fillRect(0, 0, S, S);
};

/**
 * Unequal tracks. Regular grids read as wallpaper; a tile divided 3:1:2:1 reads
 * as a composition. These are hand-set sequences, mirrored so the tile balances.
 */
const RHYTHMS: number[][] = [
  [3, 1, 2, 1, 3],
  [2, 1, 1, 3, 1, 2],
  [1, 2, 3, 2, 1],
  [3, 2, 1, 1, 2, 3],
  [1, 1, 3, 1, 1, 2],
  [2, 3, 1, 2],
];

interface Track {
  p: number;
  s: number;
}
const tracks = (S: number, which: number, scale = 1): Track[] => {
  const seq = RHYTHMS[which % RHYTHMS.length];
  const rep = Math.max(1, Math.round(scale));
  const all: number[] = [];
  for (let k = 0; k < rep; k++) all.push(...seq);
  const total = all.reduce((a, b) => a + b, 0);
  let p = 0;
  return all.map((w) => {
    const t = { p, s: (w / total) * S };
    p += t.s;
    return t;
  });
};

/** iterate cell centres; `drop` offsets every other row by half a cell */
const grid = (
  S: number,
  n: number,
  drop: boolean,
  cb: (cx: number, cy: number, u: number, i: number, j: number) => void,
) => {
  const u = S / n;
  for (let j = 0; j < n; j++) {
    for (let i = drop ? -1 : 0; i < (drop ? n + 1 : n); i++) {
      cb(i * u + u / 2 + (drop && j % 2 ? u / 2 : 0), j * u + u / 2, u, i, j);
    }
  }
};

/** draw into a cell: origin at its centre, unit box -0.5..0.5 */
const at = (
  c: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  u: number,
  rot: number,
  fn: () => void,
) => {
  c.save();
  c.translate(cx, cy);
  if (rot) c.rotate(rot);
  c.scale(u, u);
  fn();
  c.restore();
};

/** the four symmetry rules that were worth keeping */
const spin = (mode: number, i: number, j: number) => {
  const a = ((i % 4) + 4) % 4,
    b = ((j % 4) + 4) % 4;
  switch (mode) {
    case 1:
      return ((a + b) % 4) * H; // pinwheel
    case 2:
      return ((a + b) % 2) * H; // checker
    case 3:
      return (b % 2) * Math.PI; // flip alternate rows
    case 4:
      return ((a * 2 + b) % 4) * H; // spin
    default:
      return 0; // still
  }
};

const R = (
  id: string,
  name: string,
  cells: Variant,
  draw: Recipe["draw"],
): Recipe => ({ id, name, tier: "simple", cells, draw });

/** composed: two levels, or unequal tracks, or both */
const C = (
  id: string,
  name: string,
  cells: Variant,
  draw: Recipe["draw"],
): Recipe => ({ id, name, tier: "composed", cells, draw });

/* Two motifs are drawn by the same hand on a different count. They are separate
   entries rather than settings of one entry: at plate size the coarse and the
   fine read as different things, and nothing here has variants any more. */
const triNest: Recipe["draw"] = (c, { g, f, t, v, S }) => {
  bg(c, g, S);
  // every cell is a square cut corner to corner in two tones; half the
  // cells are cut again into four smaller ones
  const split = (
    x: number,
    y: number,
    u: number,
    flip: boolean,
    hi: string,
    lo: string,
  ) => {
    c.fillStyle = hi;
    c.beginPath();
    if (flip) {
      c.moveTo(x, y);
      c.lineTo(x + u, y);
      c.lineTo(x, y + u);
    } else {
      c.moveTo(x + u, y);
      c.lineTo(x + u, y + u);
      c.lineTo(x, y + u);
    }
    c.closePath();
    c.fill();
    c.fillStyle = lo;
    c.beginPath();
    if (flip) {
      c.moveTo(x + u, y);
      c.lineTo(x + u, y + u);
      c.lineTo(x, y + u);
    } else {
      c.moveTo(x, y);
      c.lineTo(x + u, y);
      c.lineTo(x, y + u);
    }
    c.closePath();
    c.fill();
  };
  const u = S / v.n;
  for (let j = 0; j < v.n; j++)
    for (let i = 0; i < v.n; i++) {
      if ((((i + j) % 2) + 2) % 2 === 0)
        split(i * u, j * u, u, (i + j) % 4 < 2, f, t(0.22));
      else
        for (let b = 0; b < 4; b++) {
          const hx = i * u + ((b % 2) * u) / 2,
            hy = j * u + (Math.floor(b / 2) * u) / 2;
          split(hx, hy, u / 2, (b + i + j) % 2 === 0, t(0.66), t(0.12));
        }
    }
};

const halfChecker: Recipe["draw"] = (c, { g, f, t, v, S }) => {
  bg(c, g, S);
  // half discs on a three-tone check: the ground reads as a shape too
  grid(S, v.n, false, (cx, cy, u, i, j) => {
    c.fillStyle = (((i + j) % 2) + 2) % 2 ? t(0.28) : t(0.05);
    c.fillRect(cx - u / 2, cy - u / 2, u + 0.5, u + 0.5);
    c.fillStyle = f;
    at(c, cx, cy, u, spin(v.mode ?? 3, i, j), () => {
      c.beginPath();
      c.moveTo(-0.5, 0.5);
      c.arc(0, 0.5, 0.5, Math.PI, 0);
      c.closePath();
      c.fill();
    });
  });
};

/* --------------------------------------------------------------- recipes */

export const RECIPES: Recipe[] = [
  C("dash-cross", "Dash Cross", { n: 15, t: 0.44 }, (c, { g, f, v, S }) => {
    bg(c, g, S);
    c.fillStyle = f;
    // two seams instead of one: the field breaks across and along
    const colW = S / v.n;
    const step = colW * 2.3;
    const seamY = S * (v.t ?? 0.44);
    const seamX = Math.floor(v.n * 0.42);
    for (let i = 0; i < v.n; i++) {
      const shift = i > seamX ? colW * 0.5 : 0;
      const x = i * colW + colW * 0.26 + shift;
      const w = colW * 0.34;
      const phase = ((i * 5) % 4) * step * 0.25 + (i > seamX ? step * 0.3 : 0);
      for (let y = -step + phase; y < S; y += step) {
        const mid = y + step * 0.5;
        if (mid > seamY && mid < seamY + S * 0.13) {
          c.fillRect(x + colW * 0.08, y + step * 0.44, w * 0.66, step * 0.1);
        } else {
          c.fillRect(x, y + (mid > seamY ? step * 0.44 : 0), w, step * 0.6);
        }
      }
    }
  }),

  C("tri-nest", "Triangle Nest", { n: 2 }, triNest),

  /* the finer count reads as its own motif rather than a setting of the last */
  C("tri-nest-3", "Triangle Nest III", { n: 3 }, triNest),

  C(
    "dash-diagonal",
    "Dash Diagonal",
    { n: 15, t: 0.5 },
    (c, { g, f, v, S }) => {
      bg(c, g, S);
      c.fillStyle = f;
      // the same dash field as Dash Break, but the seam runs on the diagonal
      const colW = S / v.n;
      const step = colW * 2.3;
      for (let i = 0; i < v.n; i++) {
        const x = i * colW + colW * 0.26;
        const w = colW * 0.34;
        const seam = S * (v.t ?? 0.5) - (i - v.n / 2) * colW * 0.9;
        for (let y = -step; y < S + step; y += step) {
          const mid = y + step * 0.5;
          if (mid > seam && mid < seam + S * 0.14) {
            c.fillRect(x + colW * 0.08, y + step * 0.44, w * 0.66, step * 0.1);
          } else {
            c.fillRect(x, y + (mid > seam ? step * 0.44 : 0), w, step * 0.6);
          }
        }
      }
    },
  ),

  /* --- bold tessellation -------------------------------------------------- */

  R("pie", "Pie", { n: 3, mode: 1 }, (c, { g, f, t, v, S }) => {
    bg(c, g, S);
    grid(S, v.n, false, (cx, cy, u, i, j) => {
      at(c, cx, cy, u, spin(v.mode ?? 1, i, j), () => {
        for (let k = 0; k < 4; k++) {
          c.fillStyle = k % 2 ? f : t(0.5);
          c.beginPath();
          c.moveTo(0, 0);
          c.arc(0, 0, 0.5, k * H, (k + 1) * H);
          c.closePath();
          c.fill();
        }
      });
    });
  }),

  R("half-checker", "Half Checker", { n: 4, mode: 3 }, halfChecker),

  R("half-checker-3", "Half Checker III", { n: 3, mode: 0 }, halfChecker),

  C("dash-break", "Dash Break", { n: 15, t: 0.42 }, (c, { g, f, v, S }) => {
    bg(c, g, S);
    c.fillStyle = f;
    // a field of vertical dashes interrupted by a seam: inside it the marks
    // collapse to ticks, and everything below picks up on a new phase
    const colW = S / v.n;
    const step = colW * 2.3;
    const breakY = S * (v.t ?? 0.42);
    const breakH = S * 0.16;
    for (let i = 0; i < v.n; i++) {
      const x = i * colW + colW * 0.26;
      const w = colW * 0.34;
      const phase = ((i * 5) % 4) * step * 0.25;
      for (let y = -step + phase; y < S; y += step) {
        const mid = y + step * 0.5;
        if (mid > breakY && mid < breakY + breakH) {
          c.fillRect(x + colW * 0.08, y + step * 0.44, w * 0.66, step * 0.1);
        } else {
          c.fillRect(x, y + (mid > breakY ? step * 0.44 : 0), w, step * 0.6);
        }
      }
    }
  }),

  C("check-rhythm", "Check Rhythm", { r: 2 }, (c, { g, t, v, S }) => {
    bg(c, g, S);
    const rows = tracks(S, (v.r ?? 2) + 1);
    const cols = tracks(S, v.r ?? 2);
    rows.forEach((row, j) => {
      cols.forEach((col, i) => {
        const on = (((i + j) % 2) + 2) % 2 === 0;
        const third = (i * 2 + j) % 5 === 0;
        c.fillStyle = on ? t(1) : third ? t(0.55) : t(0.14);
        c.fillRect(col.p, row.p, col.s + 0.5, row.s + 0.5);
      });
    });
  }),

  C("windmill-nest", "Windmill Nest", { n: 2 }, (c, { g, f, t, v, S }) => {
    bg(c, g, S);
    const blade = (
      x: number,
      y: number,
      u: number,
      rot: number,
      colour: string,
    ) => {
      c.fillStyle = colour;
      at(c, x + u / 2, y + u / 2, u, rot, () => {
        for (let k = 0; k < 4; k++) {
          c.save();
          c.rotate(k * H);
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(0.51, 0);
          c.lineTo(0.51, 0.51);
          c.closePath();
          c.fill();
          c.restore();
        }
      });
    };
    const u = S / v.n;
    for (let j = 0; j < v.n; j++)
      for (let i = 0; i < v.n; i++) {
        if ((((i + j) % 2) + 2) % 2 === 0)
          blade(i * u, j * u, u, spin(1, i, j), f);
        else
          for (let b = 0; b < 4; b++) {
            blade(
              i * u + ((b % 2) * u) / 2,
              j * u + (Math.floor(b / 2) * u) / 2,
              u / 2,
              spin(1, i + b, j),
              t(0.62),
            );
          }
      }
  }),

  R("checker", "Checker", { n: 6 }, (c, { g, f, v, S }) => {
    bg(c, g, S);
    c.fillStyle = f;
    if (v.mode === 1) {
      c.save();
      c.translate(S / 2, S / 2);
      c.rotate(Math.PI / 4);
      c.translate(-S, -S);
      const u = (S * 2) / v.n;
      for (let j = 0; j < v.n * 1.5; j++)
        for (let i = 0; i < v.n * 1.5; i++) {
          if ((i + j) % 2) continue;
          c.fillRect(i * u, j * u, u + 0.5, u + 0.5);
        }
      c.restore();
      return;
    }
    const u = S / v.n;
    for (let j = 0; j < v.n; j++)
      for (let i = 0; i < v.n; i++) {
        if ((i + j) % 2) continue;
        c.fillRect(i * u, j * u, u + 0.5, u + 0.5);
      }
  }),

  R("lens", "Lens", { n: 4, mode: 2 }, (c, { g, f, v, S }) => {
    bg(c, g, S);
    c.fillStyle = f;
    grid(S, v.n, false, (cx, cy, u, i, j) => {
      at(c, cx, cy, u, spin(v.mode ?? 0, i, j), () => {
        c.beginPath();
        c.arc(-0.5, -0.5, 1, 0, H);
        c.arc(0.5, 0.5, 1, Math.PI, Math.PI * 1.5);
        c.closePath();
        c.fill();
      });
    });
  }),

  R("windmill", "Windmill", { n: 3 }, (c, { g, f, v, S }) => {
    bg(c, g, S);
    c.fillStyle = f;
    grid(S, v.n, false, (cx, cy, u, i, j) => {
      at(c, cx, cy, u, spin(1, i, j), () => {
        for (let k = 0; k < 4; k++) {
          c.save();
          c.rotate(k * H);
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(0.51, 0);
          c.lineTo(0.51, 0.51);
          c.closePath();
          c.fill();
          c.restore();
        }
      });
    });
  }),

  R("concentric-squares", "Concentric", { n: 6 }, (c, { g, f, v, S }) => {
    bg(c, g, S);
    const step = (S * 0.8) / v.n;
    for (let k = v.n; k >= 1; k--) {
      c.fillStyle = k % 2 ? f : g;
      const s = k * step;
      c.fillRect(S / 2 - s, S / 2 - s, s * 2, s * 2);
    }
  }),
];

/* -------------------------------------------------------------- rendering */

export const UNIT = 128;

export function renderRecipe(
  ctx: CanvasRenderingContext2D,
  recipe: Recipe,
  look: Look,
  S = UNIT,
) {
  const v: Cells = { n: 4, ...recipe.cells };
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, S, S);
  ctx.clip();
  recipe.draw(ctx, {
    g: tone(look, 0),
    f: tone(look, 1),
    m: tone(look, 0.5),
    t: (u: number) => tone(look, u),
    v,
    S,
  });
  ctx.restore();
}

/**
 * The subset the corridor draws payment faces from.
 *
 * The gallery shows every recipe; a plate is a small moving surface next to
 * type, so anything that reads as a picture rather than a texture is kept out
 * of it. Excluded: lens — the petal grid is a shape at plate size, not a
 * pattern, and it pulls the eye off the payment.
 */
export const PLATE_RECIPES: Recipe[] = RECIPES.filter((r) => r.id !== "lens");

export function recipeToCanvas(recipe: Recipe, look: Look, px = 512) {
  const cv = document.createElement("canvas");
  cv.width = px;
  cv.height = px;
  const ctx = cv.getContext("2d")!;
  ctx.setTransform(px / UNIT, 0, 0, px / UNIT, 0, 0);
  renderRecipe(ctx, recipe, look, UNIT);
  return cv;
}

export function downloadRecipe(recipe: Recipe, look: Look, px = 512) {
  const a = document.createElement("a");
  a.href = recipeToCanvas(recipe, look, px).toDataURL("image/png");
  a.download = `${recipe.id}-${look.id}-${px}.png`;
  a.click();
}
