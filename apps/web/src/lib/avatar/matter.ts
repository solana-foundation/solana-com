/**
 * Matter — avatars that behave like a substance rather than a drawing: rock cut
 * open, a gem faceted, ink floated on water, cloth woven, blocks stacked. The
 * appeal is that none of them can be authored by hand at 128px, and all of them
 * survive being shrunk to a row badge, because they are texture, not detail.
 */

import { System } from "./system";
import {
  Pt,
  S,
  TAU,
  clamp,
  clipHalf,
  centroid,
  fbm,
  lerp,
  makeNoise,
  palette,
  poly,
  scatter,
} from "./core";

/* --------------------------------------------------------------- 6 · strata */

export const strata: System = {
  id: "strata",
  name: "Core Sample",
  blurb:
    "Beds laid down thickest-first, then faulted and cut by a later intrusion.",
  family: "matter",
  draw(ctx, r, out) {
    const p = palette(r);
    const n = makeNoise(r);
    const beds = r.between(6, 12);
    const wob = r.range(1.5, 8);
    const faulted = r.chance(0.55);
    const faultX = r.range(0.28, 0.72) * S;
    const throwY = r.range(6, 18) * r.sign();
    out.push(
      `${beds} beds`,
      faulted ? `fault, ${Math.abs(throwY) | 0}px throw` : "conformable",
    );

    // bed boundaries — thicknesses drawn from a power law, like real sediment
    const over = 26; // beds continue above and below the frame
    const cuts = [-over];
    let acc = -over;
    const raw = Array.from({ length: beds }, () => Math.pow(r(), 1.8) + 0.12);
    const total = raw.reduce((a, b) => a + b, 0);
    for (const t of raw) {
      acc += (t / total) * (S + over * 2);
      cuts.push(acc);
    }

    const bedColor = (i: number) => {
      const t = i / beds;
      const l = clamp(
        (p.dark ? 0.24 : 0.62) +
          Math.sin(i * 2.7) * 0.09 +
          r.range(-0.03, 0.03) +
          t * (p.dark ? 0.12 : -0.1),
        0.08,
        0.94,
      );
      return p.mix((i * 0.37) % 1, l, p.chroma * (r.chance(0.25) ? 1.5 : 0.7));
    };
    const colors = Array.from({ length: beds }, (_, i) => bedColor(i));

    const paintColumn = (x0: number, x1: number, dy: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, 0, x1 - x0, S);
      ctx.clip();
      for (let i = 0; i < beds; i++) {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(x0 - 2, cuts[i] + dy + n(x0 * 0.03, i * 4.1) * wob);
        for (let x = x0 - 2; x <= x1 + 2; x += 3)
          ctx.lineTo(x, cuts[i] + dy + n(x * 0.03, i * 4.1) * wob);
        for (let x = x1 + 2; x >= x0 - 2; x -= 3)
          ctx.lineTo(x, cuts[i + 1] + dy + n(x * 0.03, (i + 1) * 4.1) * wob);
        ctx.closePath();
        ctx.fill();

        // grain: coarse beds get big clasts, fine beds get dust
        const coarse = r.chance(0.3);
        const grains = coarse ? 40 : 130;
        for (let g = 0; g < grains; g++) {
          const gx = r.range(x0, x1);
          const gy =
            lerp(Math.max(cuts[i], -4), Math.min(cuts[i + 1], S + 4), r()) + dy;
          ctx.fillStyle = p.ink(
            r.chance(0.5) ? 0.95 : 0.06,
            r.range(0.04, 0.16),
          );
          const s = coarse ? r.range(0.8, 2.4) : r.range(0.4, 1);
          ctx.fillRect(gx, gy, s, s * r.range(0.6, 1));
        }
      }
      ctx.restore();
    };

    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);
    if (faulted) {
      paintColumn(0, faultX, 0);
      paintColumn(faultX, S, throwY);
      ctx.strokeStyle = p.ink(p.dark ? 0.05 : 0.15, 0.5);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(faultX, 0);
      for (let y = 0; y <= S; y += 6)
        ctx.lineTo(faultX + n(y * 0.05, 99) * 3, y);
      ctx.stroke();
    } else {
      paintColumn(0, S, 0);
    }

    // an intrusion cutting every bed it crosses
    if (r.chance(0.6)) {
      out.push("vein");
      ctx.strokeStyle = p.at(2, p.dark ? 0.82 : 0.4, p.chroma * 0.75, 0.9);
      ctx.lineWidth = r.range(1.2, 3);
      ctx.lineJoin = "round";
      ctx.beginPath();
      let x = r.range(0.2, 0.8) * S;
      ctx.moveTo(x, -2);
      for (let y = 0; y <= S + 2; y += 7) {
        x += fbm(n, y * 0.06, 42, 3) * 9;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // nodules
    for (let i = 0; i < r.between(0, 4); i++) {
      const cx = r() * S,
        cy = r() * S;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(r.range(-0.4, 0.4));
      ctx.fillStyle = p.at(1, p.dark ? 0.72 : 0.3, p.chroma * 1.2);
      ctx.beginPath();
      ctx.ellipse(0, 0, r.range(4, 11), r.range(2, 5), 0, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  },
};

/* --------------------------------------------------------------- 7 · facet */

export const facet: System = {
  id: "facet",
  name: "Facet",
  blurb:
    "A Voronoi cut of the square, each cell shaded as if it were a plane catching one light.",
  family: "matter",
  draw(ctx, r, out) {
    const p = palette(r);
    const count = r.between(9, 20);
    const seeds = scatter(r, count, S * 0.06);
    const la = r() * TAU;
    const lx = Math.cos(la),
      ly = Math.sin(la);
    const sharp = r.chance(0.5);
    out.push(
      `${count} facets`,
      sharp ? "hard edges" : "soft edges",
      `light ${((la / TAU) * 360) | 0}°`,
    );

    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);

    const square: Pt[] = [
      [0, 0],
      [S, 0],
      [S, S],
      [0, S],
    ];
    for (let i = 0; i < seeds.length; i++) {
      let cell: Pt[] = square;
      for (let j = 0; j < seeds.length && cell.length; j++) {
        if (i === j) continue;
        cell = clipHalf(
          cell,
          seeds[i][0],
          seeds[i][1],
          seeds[j][0],
          seeds[j][1],
        );
      }
      if (cell.length < 3) continue;

      // treat the offset from the centre as the facet's tilt
      const [cx, cy] = centroid(cell);
      const nx = (cx - S / 2) / (S / 2),
        ny = (cy - S / 2) / (S / 2);
      const nz = Math.sqrt(Math.max(0.05, 1 - nx * nx - ny * ny));
      const diff = clamp(nx * lx + ny * ly + nz * 0.55, -1, 1) * 0.5 + 0.5;
      const l = clamp(
        (p.dark ? 0.18 : 0.5) + diff * (p.dark ? 0.62 : 0.46),
        0.05,
        0.97,
      );

      poly(ctx, cell);
      const g = ctx.createLinearGradient(
        cx - lx * 30,
        cy - ly * 30,
        cx + lx * 30,
        cy + ly * 30,
      );
      g.addColorStop(
        0,
        p.mix(
          clamp(diff + 0.2, 0, 1),
          clamp(l + 0.12, 0, 0.99),
          p.chroma * 1.1,
        ),
      );
      g.addColorStop(
        1,
        p.mix(
          clamp(diff - 0.15, 0, 1),
          clamp(l - 0.1, 0.03, 0.99),
          p.chroma * 0.8,
        ),
      );
      ctx.fillStyle = g;
      ctx.fill();

      ctx.strokeStyle = sharp
        ? p.ink(p.dark ? 0.02 : 1, 0.5)
        : p.ink(p.dark ? 1 : 0.1, 0.1);
      ctx.lineWidth = sharp ? 1 : 0.6;
      ctx.stroke();

      // the one or two facets facing the light get a specular edge
      if (diff > 0.78) {
        ctx.save();
        poly(ctx, cell);
        ctx.clip();
        ctx.strokeStyle = p.ink(0.99, 0.75);
        ctx.lineWidth = 2.4;
        ctx.stroke();
        ctx.restore();
      }
    }

    // the gem's own rim
    ctx.strokeStyle = p.ink(p.dark ? 0.02 : 0.99, 0.55);
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, S - 3, S - 3);
  },
};

/* -------------------------------------------------------------- 8 · marble */

export const marble: System = {
  id: "marble",
  name: "Marbling",
  blurb:
    "Real paper-marbling maths: drops displace the ink already on the bath, then a comb rakes through it.",
  family: "matter",
  draw(ctx, r, out) {
    const p = palette(r);
    const K = 110;
    const rings: { pts: Pt[]; fill: string }[] = [];

    const drop = (cx: number, cy: number, rad: number, fill: string) => {
      for (const rg of rings)
        for (const q of rg.pts) {
          const dx = q[0] - cx,
            dy = q[1] - cy;
          const d2 = dx * dx + dy * dy || 1e-6;
          const f = Math.sqrt(1 + (rad * rad) / d2);
          q[0] = cx + dx * f;
          q[1] = cy + dy * f;
        }
      const pts: Pt[] = [];
      for (let i = 0; i < K; i++) {
        const a = (i / K) * TAU;
        pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
      }
      rings.push({ pts, fill });
    };

    const drops = r.between(7, 16);
    const nested = r.chance(0.5);
    out.push(`${drops} drops`, nested ? "nested at one point" : "scattered");
    let cx = S / 2,
      cy = S / 2;
    for (let i = 0; i < drops; i++) {
      if (!nested || r.chance(0.3)) {
        cx = r.range(0.18, 0.82) * S;
        cy = r.range(0.18, 0.82) * S;
      }
      drop(
        cx,
        cy,
        r.range(8, 26),
        p.mix(
          r(),
          p.dark ? r.range(0.32, 0.86) : r.range(0.28, 0.8),
          p.chroma * r.range(0.6, 1.6),
        ),
      );
    }

    // tines: displace along one axis, falling off exponentially with distance
    const combs = r.between(1, 3);
    out.push(combs > 1 ? `${combs} rakes` : "one rake");
    for (let c = 0; c < combs; c++) {
      const vertical = r.chance(0.5);
      const teeth = r.between(2, 7);
      const mag = r.range(10, 30) * r.sign();
      const lambda = r.range(4, 14);
      for (let t = 0; t < teeth; t++) {
        const at = ((t + 0.5) / teeth) * S;
        for (const rg of rings)
          for (const q of rg.pts) {
            const dist = Math.abs((vertical ? q[0] : q[1]) - at);
            const push = mag * Math.pow(0.5, dist / lambda);
            if (vertical) q[1] += push;
            else q[0] += push;
          }
      }
    }
    if (r.chance(0.5)) {
      // a wavy comb — the "nonpareil" gesture
      const amp = r.range(3, 9),
        freq = r.range(0.04, 0.12);
      for (const rg of rings)
        for (const q of rg.pts) q[1] += Math.sin(q[0] * freq) * amp;
    }

    // the rakes push ink off the edge — recentre and cover, so every avatar is
    // a full bath rather than a corner of one
    let x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;
    for (const rg of rings)
      for (const q of rg.pts) {
        if (q[0] < x0) x0 = q[0];
        if (q[0] > x1) x1 = q[0];
        if (q[1] < y0) y0 = q[1];
        if (q[1] > y1) y1 = q[1];
      }
    const k = clamp(
      Math.max(S / Math.max(1, x1 - x0), S / Math.max(1, y1 - y0)) * 0.92,
      0.45,
      2.4,
    );
    const mx = (x0 + x1) / 2,
      my = (y0 + y1) / 2;
    for (const rg of rings)
      for (const q of rg.pts) {
        q[0] = S / 2 + (q[0] - mx) * k;
        q[1] = S / 2 + (q[1] - my) * k;
      }

    ctx.fillStyle = p.dark
      ? p.at(0, 0.16, p.chroma * 0.4)
      : p.at(0, 0.93, p.chroma * 0.2);
    ctx.fillRect(0, 0, S, S);
    for (const rg of rings) {
      poly(ctx, rg.pts);
      ctx.fillStyle = rg.fill;
      ctx.fill();
      ctx.strokeStyle = p.ink(p.dark ? 0.05 : 0.2, 0.25);
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }
  },
};

/* ---------------------------------------------------------------- 9 · loom */

export const loom: System = {
  id: "loom",
  name: "Loom",
  blurb:
    "A sett of coloured threads and a weave draft — plain, twill, basket or satin — resolved cell by cell.",
  family: "matter",
  draw(ctx, r, out) {
    const p = palette(r);
    const n = r.between(13, 22);
    const w = S / n;
    const draft = r.pick([
      "plain",
      "twill",
      "twill",
      "basket",
      "satin",
    ] as const);
    const shift = r.between(2, 5);
    out.push(`${n} threads`, `${draft} weave`);

    // the sett: a short repeating colour sequence, mirrored like a tartan
    const settLen = r.between(3, 7);
    const half = Array.from({ length: settLen }, () =>
      p.mix(
        r(),
        p.dark ? r.range(0.22, 0.78) : r.range(0.3, 0.82),
        p.chroma * r.range(0.4, 1.5),
      ),
    );
    const sett = [...half, ...[...half].reverse().slice(1)];
    const widths = Array.from({ length: sett.length }, () => r.between(1, 3));
    out.push(`sett of ${sett.length}`);

    const threadOf = (i: number) => {
      let k = i % widths.reduce((a, b) => a + b, 0);
      for (let j = 0; j < widths.length; j++) {
        if (k < widths[j]) return j;
        k -= widths[j];
      }
      return 0;
    };
    const weftHue = r.chance(0.5) ? 0 : r.between(1, sett.length - 1);

    const over = (i: number, j: number) => {
      if (draft === "plain") return (i + j) % 2 === 0;
      if (draft === "twill") return (i + j) % 4 < 2;
      if (draft === "basket") return ((i >> 1) + (j >> 1)) % 2 === 0;
      return (i * shift + j) % 5 === 0;
    };

    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const up = over(i, j);
        const col = up
          ? sett[threadOf(i)]
          : sett[(threadOf(j) + weftHue) % sett.length];
        ctx.fillStyle = col;
        ctx.fillRect(i * w, j * w, w + 0.5, w + 0.5);

        // relief: the thread on top catches light along its length
        ctx.fillStyle = p.ink(0.99, 0.1);
        if (up) ctx.fillRect(i * w + w * 0.18, j * w, w * 0.2, w + 0.5);
        else ctx.fillRect(i * w, j * w + w * 0.18, w + 0.5, w * 0.2);
        ctx.fillStyle = p.ink(0.02, 0.16);
        if (up) ctx.fillRect(i * w + w * 0.8, j * w, w * 0.2, w + 0.5);
        else ctx.fillRect(i * w, j * w + w * 0.8, w + 0.5, w * 0.2);
      }
    }

    // a slub — one fatter thread, the flaw that proves it was woven
    if (r.chance(0.5)) {
      out.push("slub");
      const i = r.int(n);
      ctx.fillStyle = p.ink(0.02, 0.14);
      if (r.chance(0.5)) ctx.fillRect(i * w - w * 0.2, 0, w * 1.4, S);
      else ctx.fillRect(0, i * w - w * 0.2, S, w * 1.4);
    }
  },
};

/* ----------------------------------------------------------- 10 · monolith */

export const monolith: System = {
  id: "monolith",
  name: "Monolith",
  blurb:
    "A voxel structure grown by one of four rules, painted back-to-front in three tones.",
  family: "matter",
  draw(ctx, r, out) {
    const p = palette(r);
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);

    const G = r.between(3, 5);
    const rule = r.pick(["tower", "terrace", "arch", "cluster"] as const);
    out.push(`${G}×${G} plan`, rule);

    const h: number[][] = [];
    for (let x = 0; x < G; x++) {
      h[x] = [];
      for (let y = 0; y < G; y++) {
        const dx = x - (G - 1) / 2,
          dy = y - (G - 1) / 2;
        const d = Math.hypot(dx, dy) / (G / 2);
        h[x][y] =
          rule === "tower"
            ? Math.max(1, Math.round((1 - d) * r.range(3, 6) + r.range(0, 1.2)))
            : rule === "terrace"
              ? 1 + Math.round(((x + y) / (2 * G - 2)) * r.range(2, 5))
              : rule === "arch"
                ? Math.abs(dx) > G * 0.22
                  ? r.between(3, 5)
                  : r.between(0, 1)
                : r.between(0, 4);
      }
    }

    const w = S / (G + 1.6);
    const hz = w * r.range(0.7, 1.15);
    const cx = S / 2;
    const baseY = S * 0.5 - (G * w * 0.5) / 2 + hz * 0.6;
    const proj = (x: number, y: number, z: number): Pt => [
      cx + (x - y) * w,
      baseY + (x + y) * w * 0.5 - z * hz,
    ];

    const cells: { x: number; y: number; z: number }[] = [];
    for (let x = 0; x < G; x++)
      for (let y = 0; y < G; y++)
        for (let z = 0; z < h[x][y]; z++) cells.push({ x, y, z });
    cells.sort((a, b) => a.x + a.y - (b.x + b.y) || a.z - b.z);

    // fit whatever grew into the frame, rather than cropping it
    let bx0 = Infinity,
      by0 = Infinity,
      bx1 = -Infinity,
      by1 = -Infinity;
    for (const c of cells) {
      const t = proj(c.x, c.y, c.z + 1);
      bx0 = Math.min(bx0, t[0] - w);
      bx1 = Math.max(bx1, t[0] + w);
      by0 = Math.min(by0, t[1] - w * 0.5);
      by1 = Math.max(by1, t[1] + w * 0.5 + hz);
    }
    const fit = Math.min(
      (S * 0.86) / Math.max(1, bx1 - bx0),
      (S * 0.86) / Math.max(1, by1 - by0),
      1.25,
    );
    ctx.save();
    ctx.translate(S / 2, S / 2);
    ctx.scale(fit, fit);
    ctx.translate(-(bx0 + bx1) / 2, -(by0 + by1) / 2);

    // ground shadow, a soft diamond under the whole plan
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.filter = "blur(4px)";
    ctx.fillStyle = p.ink(0.02, 1);
    poly(ctx, [
      proj(0, 0, -0.4),
      proj(G, 0, -0.4),
      proj(G, G, -0.4),
      proj(0, G, -0.4),
    ]);
    ctx.fill();
    ctx.restore();

    const glowAt = r.chance(0.6) ? [r.int(G), r.int(G)] : null;
    if (glowAt) out.push("lit block");

    for (const c of cells) {
      const top = proj(c.x, c.y, c.z + 1);
      const lit =
        glowAt &&
        c.x === glowAt[0] &&
        c.y === glowAt[1] &&
        c.z === h[c.x][c.y] - 1;
      const tone = (l: number, slot = 0) =>
        lit
          ? p.at(1, clamp(l + 0.28, 0, 0.99), p.chroma * 1.6)
          : p.at(slot, l, p.chroma * 0.8);
      const jitter = r.range(-0.02, 0.02);

      poly(ctx, [
        [top[0], top[1] - w * 0.5],
        [top[0] + w, top[1]],
        [top[0], top[1] + w * 0.5],
        [top[0] - w, top[1]],
      ]);
      ctx.fillStyle = tone((p.dark ? 0.72 : 0.86) + jitter);
      ctx.fill();

      poly(ctx, [
        [top[0] - w, top[1]],
        [top[0], top[1] + w * 0.5],
        [top[0], top[1] + w * 0.5 + hz],
        [top[0] - w, top[1] + hz],
      ]);
      ctx.fillStyle = tone((p.dark ? 0.44 : 0.62) + jitter, 2);
      ctx.fill();

      poly(ctx, [
        [top[0] + w, top[1]],
        [top[0], top[1] + w * 0.5],
        [top[0], top[1] + w * 0.5 + hz],
        [top[0] + w, top[1] + hz],
      ]);
      ctx.fillStyle = tone((p.dark ? 0.3 : 0.46) + jitter, 2);
      ctx.fill();

      if (lit) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.filter = "blur(4px)";
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = p.at(1, 0.68, p.chroma * 1.8);
        ctx.beginPath();
        ctx.arc(top[0], top[1], w * 0.85, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();

    // survey ticks at the corners, so the object reads as a specimen
    ctx.strokeStyle = p.ink(p.dark ? 0.7 : 0.3, 0.35);
    ctx.lineWidth = 1;
    for (const [x, y] of [
      [6, 6],
      [S - 6, 6],
      [6, S - 6],
      [S - 6, S - 6],
    ]) {
      ctx.beginPath();
      ctx.moveTo(x - 4, y);
      ctx.lineTo(x + 4, y);
      ctx.moveTo(x, y - 4);
      ctx.lineTo(x, y + 4);
      ctx.stroke();
    }
  },
};

export const matters = [strata, facet, marble, loom, monolith];
