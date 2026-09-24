/**
 * Motif — the flat, two-tone, tiled register. No shading, no grain, no depth:
 * one hue at two lightnesses, one generated shape, repeated under a symmetry
 * rule. Everything interesting comes from the rule, not from rendering — which
 * is why it is the only register here that stays legible at 16px with no help.
 *
 * The shape grammar is parametric on purpose: the motif is *generated* from a
 * radius, a thickness and a count, so the set is open-ended rather than a pick
 * from a bag of hand-drawn glyphs.
 */

import { System } from "./system";
import { S, TAU, clamp, oklch, roundRect } from "./core";
import type { Rng } from "./core";

type Shape =
  | "stadium"
  | "quarter"
  | "lens"
  | "bar"
  | "dash"
  | "wedge"
  | "ring"
  | "comb"
  | "chevron"
  | "hook"
  | "step";

/** every motif draws inside the unit cell 0..1, already translated and rotated */
function unit(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  r: Rng,
  k: { rr: number; th: number; n: number },
) {
  const { rr, th, n } = k;
  switch (shape) {
    case "stadium":
      roundRect(ctx, 0.08, 0.08, 0.84, 0.84, rr * 0.42);
      ctx.fill();
      break;
    case "quarter":
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 0.94, 0, Math.PI / 2);
      ctx.closePath();
      ctx.fill();
      break;
    case "lens":
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI / 2);
      ctx.arc(1, 1, 1, Math.PI, Math.PI * 1.5);
      ctx.fill();
      break;
    case "bar":
      ctx.fillRect(0.5 - th / 2, -0.02, th, 1.04);
      break;
    case "dash": {
      const gap = 1 / n;
      for (let i = 0; i < n; i++)
        ctx.fillRect(0.5 - th / 2, i * gap + gap * 0.16, th, gap * 0.68);
      break;
    }
    case "wedge":
      ctx.beginPath();
      ctx.moveTo(0.02, 0.98);
      ctx.lineTo(0.98, 0.98);
      ctx.lineTo(0.98, 0.02);
      ctx.closePath();
      ctx.fill();
      break;
    case "ring":
      ctx.beginPath();
      ctx.arc(0.5, 0.5, 0.46, 0, TAU);
      ctx.arc(0.5, 0.5, Math.max(0.06, 0.46 - th), 0, TAU, true);
      ctx.fill("evenodd");
      break;
    case "comb": {
      const gap = 1 / n;
      for (let i = 0; i < n; i++)
        ctx.fillRect(i * gap + gap * 0.5 - th * 0.35, 0, th * 0.7, 1);
      break;
    }
    case "chevron":
      ctx.beginPath();
      ctx.moveTo(0.04, 0.1);
      ctx.lineTo(0.5, 0.62);
      ctx.lineTo(0.96, 0.1);
      ctx.lineTo(0.96, 0.1 + th * 1.5);
      ctx.lineTo(0.5, 0.62 + th * 1.5);
      ctx.lineTo(0.04, 0.1 + th * 1.5);
      ctx.closePath();
      ctx.fill();
      break;
    case "hook": {
      // stroked, not filled — a corner radius that survives any thickness
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = th * 0.9;
      ctx.lineCap = "butt";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(0.22, 0.06);
      ctx.lineTo(0.22, 0.56);
      ctx.quadraticCurveTo(0.22, 0.88, 0.54, 0.88);
      ctx.lineTo(0.94, 0.88);
      ctx.stroke();
      break;
    }
    case "step": {
      const s = 1 / n;
      for (let i = 0; i < n; i++) ctx.fillRect(i * s, i * s, s, 1 - i * s);
      break;
    }
  }
  void r;
}

export const motif: System = {
  id: "motif",
  name: "Motif",
  blurb:
    "One parametric shape, two flat tones of a single hue, laid out under a symmetry rule — rotation, mirror, brick or checker.",
  family: "pattern",
  flat: true,
  draw(ctx, r, out) {
    // two lightnesses of one hue, and nothing else
    const hue = r() * 360;
    const chroma = r.chance(0.12) ? r.range(0.02, 0.04) : r.range(0.08, 0.19);
    const deep = r.chance(0.3);
    const groundL = deep ? r.range(0.22, 0.38) : r.range(0.56, 0.8);
    // figure is normally the lighter tint; on a light ground it sometimes goes
    // the other way, which is the difference between a pattern and a print
    const down = !deep && r.chance(0.35);
    const delta = deep ? r.range(0.18, 0.32) : r.range(0.14, 0.24);
    const figureL = clamp(groundL + (down ? -delta : delta), 0.14, 0.97);
    const ground = oklch(groundL, chroma, hue);
    const figure = oklch(
      figureL,
      chroma * (down ? 1.15 : deep ? 1 : 0.78),
      hue + r.range(-6, 6),
    );

    ctx.fillStyle = ground;
    ctx.fillRect(0, 0, S, S);

    const n = r.between(3, 6);
    const cell = S / n;
    const shape = r.pick<Shape>([
      "stadium",
      "quarter",
      "lens",
      "bar",
      "dash",
      "wedge",
      "ring",
      "comb",
      "chevron",
      "hook",
      "step",
    ]);
    const rule = r.pick([
      "still",
      "pinwheel",
      "mirror",
      "brick",
      "checker",
      "cascade",
    ] as const);
    const knobs = {
      rr: r.range(0.3, 1),
      th: r.range(0.18, 0.5),
      n: r.between(2, 5),
    };
    const drop = r.chance(0.3) ? r.range(0.06, 0.2) : 0;
    const breakRow = r.chance(0.35) ? r.between(1, n - 1) : -1;
    out.push(
      shape,
      `${n}×${n}`,
      rule,
      ...(drop ? ["dropout"] : []),
      ...(breakRow > 0 ? ["phase break"] : []),
    );

    // a second tone band, the one deliberate interruption the grid gets
    const band = r.chance(0.28)
      ? { at: r.int(n), vertical: r.chance(0.5) }
      : null;
    if (band) out.push("band");

    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        if (drop && r.chance(drop)) continue;
        const inBand = band && (band.vertical ? i === band.at : j === band.at);

        // the rule decides orientation; the seed decides nothing else here
        let rot = 0;
        let flipX = 1;
        let dx = 0;
        let scale = 1;
        if (rule === "pinwheel") rot = ((i + j) % 4) * (Math.PI / 2);
        else if (rule === "mirror") {
          flipX = i % 2 ? -1 : 1;
          rot = j % 2 ? Math.PI : 0;
        } else if (rule === "brick") dx = j % 2 ? cell / 2 : 0;
        else if (rule === "checker") rot = (i + j) % 2 ? Math.PI / 2 : 0;
        else if (rule === "cascade") {
          rot = ((i * 2 + j) % 4) * (Math.PI / 2);
          scale = 1 - (j / n) * 0.35;
        }
        if (breakRow > 0 && j >= breakRow) dx += cell * 0.5;

        const x = (((i * cell + dx) % S) + S) % S;
        ctx.save();
        ctx.translate(x + cell / 2, j * cell + cell / 2);
        ctx.rotate(rot);
        ctx.scale((cell / 2) * flipX * scale, (cell / 2) * scale);
        ctx.translate(-1, -1);
        ctx.scale(2, 2);
        ctx.fillStyle = inBand ? ground : figure;
        if (inBand) {
          // invert inside the band: figure becomes ground on a figure field
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fillStyle = figure;
          ctx.fillRect(x, j * cell, cell + 0.5, cell + 0.5);
          ctx.restore();
          ctx.fillStyle = ground;
        }
        unit(ctx, shape, r, knobs);
        ctx.restore();

        // a cell that wraps off the right edge comes back on the left
        if (dx > 0 && x + cell > S) {
          ctx.save();
          ctx.translate(x - S + cell / 2, j * cell + cell / 2);
          ctx.rotate(rot);
          ctx.scale((cell / 2) * flipX * scale, (cell / 2) * scale);
          ctx.translate(-1, -1);
          ctx.scale(2, 2);
          ctx.fillStyle = inBand ? ground : figure;
          unit(ctx, shape, r, knobs);
          ctx.restore();
        }
      }
    }
  },
};

export const patterns = [motif];
