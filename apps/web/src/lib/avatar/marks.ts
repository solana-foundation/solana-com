/**
 * Marks — avatars built the way identity has always been built: a sigil, a
 * coat of arms, a script, a knot, a seal. These read as an *emblem for someone*
 * rather than as decoration, which is what an agent avatar has to do at 24px.
 */

import { System } from "./system";
import { Pt, S, TAU, palette, poly, roundRect } from "./core";

/* --------------------------------------------------------------- 1 · sigil */

export const sigil: System = {
  id: "sigil",
  name: "Sigil",
  blurb:
    "A path walked between nodes of a hex lattice, then sealed in a ring of ticks.",
  family: "mark",
  draw(ctx, r, out) {
    const p = palette(r);
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);

    const C = S / 2;
    const R = S * 0.3;
    const rings = r.between(2, 3);
    const rot = r() * TAU;

    // hex lattice: centre plus `rings` rings of six, alternate rings offset
    const nodes: Pt[] = [[C, C]];
    for (let k = 1; k <= rings; k++) {
      for (let j = 0; j < 6; j++) {
        const a = rot + (j * TAU) / 6 + (k % 2 ? TAU / 12 : 0);
        nodes.push([
          C + Math.cos(a) * R * (k / rings),
          C + Math.sin(a) * R * (k / rings),
        ]);
      }
    }

    const count = r.between(4, 7);
    const path = r
      .shuffle(nodes.map((_, i) => i))
      .slice(0, count)
      .map((i) => nodes[i]);
    const mirrored = r.chance(0.42);
    const closed = r.chance(0.35);
    out.push(
      `${rings} rings`,
      `${count} nodes`,
      mirrored ? "mirrored" : "free hand",
      closed ? "closed" : "open",
    );

    const stroke = (pts: Pt[], w: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = w;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      if (closed) ctx.closePath();
      ctx.stroke();
    };

    const arms: Pt[][] = [path];
    if (mirrored) arms.push(path.map(([x, y]) => [S - x, y] as Pt));

    // a soft under-glow so the mark sits in the field rather than on it
    ctx.save();
    ctx.globalAlpha = p.dark ? 0.5 : 0.25;
    ctx.filter = "blur(3px)";
    for (const a of arms)
      stroke(a, S * 0.062, p.at(1, p.dark ? 0.7 : 0.5, p.chroma * 1.2));
    ctx.restore();

    for (const a of arms) stroke(a, S * 0.042, p.fg);
    for (const a of arms)
      stroke(a, S * 0.014, p.at(1, p.dark ? 0.86 : 0.5, p.chroma * 1.3));

    // nodes
    for (const a of arms) {
      a.forEach(([x, y], i) => {
        const hollow = i === 0 || (i === a.length - 1 && r.chance(0.6));
        ctx.beginPath();
        ctx.arc(x, y, hollow ? S * 0.033 : S * 0.019, 0, TAU);
        if (hollow) {
          ctx.fillStyle = p.bg;
          ctx.fill();
          ctx.lineWidth = S * 0.014;
          ctx.strokeStyle = p.fg;
          ctx.stroke();
        } else {
          ctx.fillStyle = p.fg;
          ctx.fill();
        }
      });
    }

    // containment ring + tick calendar
    const RR = S * 0.435;
    ctx.strokeStyle = p.ink(p.dark ? 0.55 : 0.4, 0.5);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(C, C, RR, 0, TAU);
    ctx.stroke();

    const ticks = r.pick([12, 16, 24, 36]);
    for (let i = 0; i < ticks; i++) {
      const a = rot + (i / ticks) * TAU;
      const long = i % (ticks / 4) === 0;
      const l = long ? S * 0.055 : S * 0.022;
      ctx.strokeStyle = long
        ? p.at(2, p.dark ? 0.8 : 0.35, p.chroma)
        : p.ink(p.dark ? 0.6 : 0.4, 0.55);
      ctx.lineWidth = long ? 1.6 : 1;
      ctx.beginPath();
      ctx.moveTo(C + Math.cos(a) * RR, C + Math.sin(a) * RR);
      ctx.lineTo(C + Math.cos(a) * (RR + l), C + Math.sin(a) * (RR + l));
      ctx.stroke();
    }

    // one live arc of the ring, like a charge indicator
    const a0 = r() * TAU;
    ctx.strokeStyle = p.at(1, p.dark ? 0.82 : 0.45, p.chroma * 1.4);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(C, C, RR, a0, a0 + r.range(0.5, 2.2));
    ctx.stroke();
  },
};

/* ----------------------------------------------------------- 2 · heraldry */

type Region = { pts: Pt[]; tint: number };

export const heraldry: System = {
  id: "heraldry",
  name: "Field & Charge",
  blurb:
    "Blazon as a grammar: a division of the field, a tincture per part, one charge.",
  family: "mark",
  draw(ctx, r, out) {
    const p = palette(r);
    const division = r.pick([
      "plain",
      "per pale",
      "per fess",
      "per bend",
      "quarterly",
      "per saltire",
      "gyronny",
      "per chevron",
    ] as const);
    out.push(division);

    const sq: Pt[] = [
      [0, 0],
      [S, 0],
      [S, S],
      [0, S],
    ];
    const C = S / 2;
    const regions: Region[] = [];
    const add = (pts: Pt[], tint: number) => regions.push({ pts, tint });

    switch (division) {
      case "plain":
        add(sq, 0);
        break;
      case "per pale":
        add(
          [
            [0, 0],
            [C, 0],
            [C, S],
            [0, S],
          ],
          0,
        );
        add(
          [
            [C, 0],
            [S, 0],
            [S, S],
            [C, S],
          ],
          1,
        );
        break;
      case "per fess":
        add(
          [
            [0, 0],
            [S, 0],
            [S, C],
            [0, C],
          ],
          0,
        );
        add(
          [
            [0, C],
            [S, C],
            [S, S],
            [0, S],
          ],
          1,
        );
        break;
      case "per bend":
        add(
          [
            [0, 0],
            [S, 0],
            [0, S],
          ],
          0,
        );
        add(
          [
            [S, 0],
            [S, S],
            [0, S],
          ],
          1,
        );
        break;
      case "quarterly":
        add(
          [
            [0, 0],
            [C, 0],
            [C, C],
            [0, C],
          ],
          0,
        );
        add(
          [
            [C, 0],
            [S, 0],
            [S, C],
            [C, C],
          ],
          1,
        );
        add(
          [
            [0, C],
            [C, C],
            [C, S],
            [0, S],
          ],
          1,
        );
        add(
          [
            [C, C],
            [S, C],
            [S, S],
            [C, S],
          ],
          0,
        );
        break;
      case "per saltire":
        add(
          [
            [0, 0],
            [S, 0],
            [C, C],
          ],
          0,
        );
        add(
          [
            [S, 0],
            [S, S],
            [C, C],
          ],
          1,
        );
        add(
          [
            [S, S],
            [0, S],
            [C, C],
          ],
          0,
        );
        add(
          [
            [0, S],
            [0, 0],
            [C, C],
          ],
          1,
        );
        break;
      case "gyronny":
        for (let i = 0; i < 8; i++) {
          const a1 = (i * TAU) / 8 - TAU / 8,
            a2 = a1 + TAU / 8;
          const far = S * 1.6;
          add(
            [
              [C, C],
              [C + Math.cos(a1) * far, C + Math.sin(a1) * far],
              [
                C + Math.cos((a1 + a2) / 2) * far,
                C + Math.sin((a1 + a2) / 2) * far,
              ],
              [C + Math.cos(a2) * far, C + Math.sin(a2) * far],
            ],
            i % 2,
          );
        }
        break;
      case "per chevron":
        add(sq, 0);
        add(
          [
            [0, S],
            [C, S * 0.38],
            [S, S],
          ],
          1,
        );
        break;
    }

    const tints = [
      p.at(0, p.dark ? 0.32 : 0.72, p.chroma * 1.1),
      p.at(1, p.dark ? 0.5 : 0.55, p.chroma * 1.2),
    ];
    const metal = p.at(2, p.dark ? 0.86 : 0.92, p.chroma * 0.35);

    ctx.fillStyle = tints[0];
    ctx.fillRect(0, 0, S, S);
    for (const rg of regions) {
      ctx.save();
      poly(ctx, rg.pts);
      ctx.clip();
      ctx.fillStyle = tints[rg.tint];
      ctx.fillRect(0, 0, S, S);

      // furs and diapers — the texture inside a tincture
      const fur = r.pick([
        "plain",
        "plain",
        "ermine",
        "barry",
        "checky",
        "seme",
        "lozengy",
      ] as const);
      if (rg === regions[0]) out.push(fur);
      ctx.fillStyle = rg.tint === 0 ? metal : p.ink(p.dark ? 0.16 : 0.9, 0.5);
      const step = S / r.between(5, 9);
      if (fur === "barry")
        for (let y = 0; y < S; y += step * 2) ctx.fillRect(0, y, S, step);
      if (fur === "checky")
        for (let y = 0; y < S; y += step)
          for (let x = 0; x < S; x += step) {
            if (((x / step) | 0) % 2 === ((y / step) | 0) % 2)
              ctx.fillRect(x, y, step, step);
          }
      if (fur === "lozengy")
        for (let y = -S; y < S * 2; y += step)
          for (let x = -S; x < S * 2; x += step) {
            poly(ctx, [
              [x, y + step / 2],
              [x + step / 2, y],
              [x + step, y + step / 2],
              [x + step / 2, y + step],
            ]);
            if ((((x / step) | 0) + ((y / step) | 0)) % 2 === 0) ctx.fill();
          }
      if (fur === "ermine" || fur === "seme") {
        for (let y = step / 2; y < S; y += step) {
          for (
            let x = ((y / step) | 0) % 2 ? step / 2 : step;
            x < S;
            x += step
          ) {
            if (fur === "seme") {
              ctx.beginPath();
              ctx.arc(x, y, step * 0.11, 0, TAU);
              ctx.fill();
            } else {
              const u = step * 0.13;
              ctx.beginPath();
              ctx.moveTo(x, y - u * 1.6);
              ctx.lineTo(x + u, y + u);
              ctx.lineTo(x - u, y + u);
              ctx.closePath();
              ctx.fill();
              ctx.fillRect(x - u * 0.22, y + u, u * 0.44, u * 1.1);
            }
          }
        }
      }
      ctx.restore();
    }

    // an ordinary across the field
    if (r.chance(0.45)) {
      const ord = r.pick(["fess", "pale", "bend", "chief"] as const);
      out.push(ord);
      ctx.fillStyle = metal;
      ctx.save();
      if (ord === "fess") ctx.fillRect(0, C - S * 0.11, S, S * 0.22);
      if (ord === "pale") ctx.fillRect(C - S * 0.11, 0, S * 0.22, S);
      if (ord === "chief") ctx.fillRect(0, 0, S, S * 0.2);
      if (ord === "bend") {
        ctx.translate(C, C);
        ctx.rotate(-Math.PI / 4);
        ctx.fillRect(-S, -S * 0.11, S * 2, S * 0.22);
      }
      ctx.restore();
    }

    // the charge
    const charge = r.pick([
      "mullet",
      "roundel",
      "lozenge",
      "cross",
      "crescent",
      "tower",
      "bolt",
    ] as const);
    out.push(charge);
    const cr = S * 0.19;
    ctx.fillStyle = p.at(2, p.dark ? 0.9 : 0.18, p.chroma * 0.9);
    ctx.strokeStyle = p.ink(p.dark ? 0.12 : 0.98, 0.7);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    if (charge === "mullet") {
      const pts = r.between(5, 8);
      for (let i = 0; i < pts * 2; i++) {
        const a = (i / (pts * 2)) * TAU - Math.PI / 2;
        const rad = i % 2 ? cr * 0.42 : cr * 1.25;
        const x = C + Math.cos(a) * rad,
          y = C + Math.sin(a) * rad;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.closePath();
    } else if (charge === "roundel") {
      ctx.arc(C, C, cr, 0, TAU);
    } else if (charge === "lozenge") {
      ctx.moveTo(C, C - cr * 1.3);
      ctx.lineTo(C + cr * 0.8, C);
      ctx.lineTo(C, C + cr * 1.3);
      ctx.lineTo(C - cr * 0.8, C);
      ctx.closePath();
    } else if (charge === "cross") {
      const a = cr * 0.36,
        b = cr * 1.25;
      ctx.rect(C - a, C - b, a * 2, b * 2);
      ctx.rect(C - b, C - a, b * 2, a * 2);
    } else if (charge === "crescent") {
      ctx.arc(C, C, cr, 0, TAU);
      ctx.arc(C + cr * 0.42, C - cr * 0.2, cr * 0.86, 0, TAU, true);
    } else if (charge === "tower") {
      ctx.rect(C - cr * 0.7, C - cr * 0.4, cr * 1.4, cr * 1.6);
      for (let i = 0; i < 3; i++)
        ctx.rect(
          C - cr * 0.7 + i * cr * 0.55,
          C - cr * 0.95,
          cr * 0.35,
          cr * 0.6,
        );
    } else {
      ctx.moveTo(C + cr * 0.5, C - cr * 1.3);
      ctx.lineTo(C - cr * 0.6, C + cr * 0.1);
      ctx.lineTo(C - cr * 0.05, C + cr * 0.1);
      ctx.lineTo(C - cr * 0.45, C + cr * 1.3);
      ctx.lineTo(C + cr * 0.65, C - cr * 0.15);
      ctx.lineTo(C + cr * 0.1, C - cr * 0.15);
      ctx.closePath();
    }
    ctx.fill("evenodd");
    ctx.stroke();

    // bordure
    if (r.chance(0.4)) {
      out.push("bordure");
      ctx.strokeStyle = metal;
      ctx.lineWidth = S * 0.075;
      ctx.strokeRect(S * 0.037, S * 0.037, S * 0.926, S * 0.926);
    }
  },
};

/* ---------------------------------------------------------------- 3 · kufic */

export const kufic: System = {
  id: "kufic",
  name: "Square Kufic",
  blurb:
    "Self-avoiding strokes on a grid that always leave one empty cell between them — the rule that makes square script legible.",
  family: "mark",
  draw(ctx, r, out) {
    const p = palette(r);
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);

    const n = r.pick([11, 13, 15]);
    const cell = S / n;
    const grid = new Uint8Array(n * n);
    const symmetric = r.chance(0.55);
    const mid = (n - 1) / 2;
    const maxX = symmetric ? mid - 1 : n - 2;
    out.push(`${n}×${n} grid`, symmetric ? "mirrored" : "asymmetric");

    // a cell may be inked only if its 8-neighbourhood is clear, apart from the
    // cell we arrived from. that single rule is the whole look.
    const free = (x: number, y: number, px: number, py: number) => {
      if (x < 1 || y < 1 || x > maxX || y > n - 2) return false;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const X = x + dx,
            Y = y + dy;
          if (X < 0 || Y < 0 || X >= n || Y >= n) continue;
          if (X === px && Y === py) continue;
          if (grid[Y * n + X]) return false;
        }
      return true;
    };

    const dirs: Pt[] = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    // keep laying strokes until the panel reaches a script-like density; the
    // gutter rule refuses most late attempts, so this needs to be a target, not
    // a fixed count
    const room = Math.max(1, maxX) * (n - 2);
    const target = Math.round(room * r.range(0.24, 0.36));
    let inked = 0;
    for (let attempt = 0; attempt < 200 && inked < target; attempt++) {
      let x = r.between(1, maxX),
        y = r.between(1, n - 2);
      if (!free(x, y, -9, -9)) continue;
      grid[y * n + x] = 1;
      inked++;
      let [dx, dy] = r.pick(dirs);
      const len = r.between(3, 12);
      for (let i = 0; i < len; i++) {
        if (r.chance(0.42)) {
          const turn = r.pick(dirs.filter((d) => d[0] !== -dx || d[1] !== -dy));
          dx = turn[0];
          dy = turn[1];
        }
        const nx = x + dx,
          ny = y + dy;
        if (!free(nx, ny, x, y)) break;
        x = nx;
        y = ny;
        grid[y * n + x] = 1;
        inked++;
      }
    }
    out.push(`${inked} cells`);

    ctx.fillStyle = p.fg;
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        if (!grid[y * n + x]) continue;
        ctx.fillRect(x * cell, y * cell, cell + 0.4, cell + 0.4);
        if (symmetric)
          ctx.fillRect((n - 1 - x) * cell, y * cell, cell + 0.4, cell + 0.4);
      }

    // the frame the script sits in
    if (r.chance(0.7)) {
      ctx.strokeStyle = p.at(1, p.dark ? 0.7 : 0.4, p.chroma);
      ctx.lineWidth = cell * 0.55;
      ctx.strokeRect(
        cell * 0.28,
        cell * 0.28,
        S - cell * 0.56,
        S - cell * 0.56,
      );
    }
  },
};

/* ----------------------------------------------------------------- 4 · knot */

export const knot: System = {
  id: "knot",
  name: "Interlace",
  blurb:
    "A star polygon {p/q} drawn as a ribbon, each segment casing over the last — over, under, over.",
  family: "mark",
  draw(ctx, r, out) {
    const p = palette(r);
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);

    const C = S / 2;
    const layers = r.chance(0.42) ? 2 : 1;
    out.push(layers > 1 ? "two strands" : "single strand");

    for (let L = 0; L < layers; L++) {
      const n = r.pick([7, 8, 9, 10, 11, 12]);
      const step = r.between(2, Math.max(2, Math.floor(n / 2)));
      const R = S * (L === 0 ? 0.4 : 0.24);
      const rot = r() * TAU;
      out.push(`{${n}/${step}}`);

      const verts: Pt[] = [];
      const seen = new Set<number>();
      let i = 0;
      do {
        verts.push([
          C + Math.cos(rot + (i / n) * TAU) * R,
          C + Math.sin(rot + (i / n) * TAU) * R,
        ]);
        seen.add(i);
        i = (i + step) % n;
      } while (i !== 0);
      // pick up any vertices the first cycle missed
      for (let j = 0; j < n; j++)
        if (!seen.has(j))
          verts.push([
            C + Math.cos(rot + (j / n) * TAU) * R,
            C + Math.sin(rot + (j / n) * TAU) * R,
          ]);

      const W = (L === 0 ? S * 0.055 : S * 0.038) * (n > 10 ? 0.8 : 1);
      const core =
        L === 0 ? p.fg : p.at(1, p.dark ? 0.78 : 0.42, p.chroma * 1.3);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (let k = 0; k < verts.length; k++) {
        const a = verts[k],
          b = verts[(k + 1) % verts.length];
        ctx.strokeStyle = p.bg;
        ctx.lineWidth = W + 5;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
        ctx.strokeStyle = core;
        ctx.lineWidth = W;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
        // a highlight down the middle of the ribbon reads as roundness
        ctx.strokeStyle = p.ink(p.dark ? 0.98 : 0.2, 0.16);
        ctx.lineWidth = W * 0.3;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }

      if (L === 0) {
        ctx.fillStyle = p.at(2, p.dark ? 0.85 : 0.3, p.chroma);
        for (const v of verts) {
          ctx.beginPath();
          ctx.arc(v[0], v[1], W * 0.28, 0, TAU);
          ctx.fill();
        }
      }
    }

    if (r.chance(0.5)) {
      ctx.strokeStyle = p.ink(p.dark ? 0.6 : 0.4, 0.35);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(C, C, S * 0.47, 0, TAU);
      ctx.stroke();
    }
  },
};

/* ---------------------------------------------------------------- 5 · seal */

export const seal: System = {
  id: "seal",
  name: "Ledger Seal",
  blurb:
    "Banknote guilloché — a hypotrochoid traced in phase-shifted hairlines, ringed by micro-type.",
  family: "mark",
  draw(ctx, r, out) {
    const p = palette(r);
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);
    const C = S / 2;

    const Rb = S * 0.33;
    const q = r.between(5, 13);
    const pn = r.between(2, Math.max(2, q - 2));
    const rr = (Rb * pn) / q;
    const d = rr * r.range(0.55, 1.5);
    const copies = r.between(3, 7);
    out.push(`hypotrochoid ${pn}/${q}`, `${copies} phases`);

    ctx.lineWidth = 0.7;
    for (let c = 0; c < copies; c++) {
      ctx.strokeStyle = p.mix(
        c / Math.max(1, copies - 1),
        p.dark ? 0.78 : 0.38,
        p.chroma * 1.1,
        0.75,
      );
      ctx.beginPath();
      const off = (c / copies) * (TAU / q);
      for (let t = 0; t <= TAU * q + 0.01; t += 0.03) {
        const k = (Rb - rr) / rr;
        const x =
          C + (Rb - rr) * Math.cos(t + off) + d * Math.cos(k * (t + off));
        const y =
          C + (Rb - rr) * Math.sin(t + off) - d * Math.sin(k * (t + off));
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // the type ring — glyphs abstracted to the bars that survive at this size
    const R1 = S * 0.4,
      R2 = S * 0.47;
    ctx.strokeStyle = p.ink(p.dark ? 0.62 : 0.35, 0.7);
    ctx.lineWidth = 1;
    for (const rad of [R1, R2]) {
      ctx.beginPath();
      ctx.arc(C, C, rad, 0, TAU);
      ctx.stroke();
    }

    const glyphs = r.between(26, 44);
    ctx.fillStyle = p.fg;
    for (let i = 0; i < glyphs; i++) {
      const a = (i / glyphs) * TAU;
      if (r.chance(0.14)) continue; // word spaces
      ctx.save();
      ctx.translate(
        C + Math.cos(a) * ((R1 + R2) / 2),
        C + Math.sin(a) * ((R1 + R2) / 2),
      );
      ctx.rotate(a + Math.PI / 2);
      const h = (R2 - R1) * r.range(0.35, 0.72);
      ctx.fillRect(-0.6, -h / 2, 1.2, h);
      if (r.chance(0.3)) ctx.fillRect(-1.9, -h / 2, 1.2, h * 0.6);
      ctx.restore();
    }

    // notching outside the ring
    const notches = r.pick([24, 36, 48, 72]);
    ctx.strokeStyle = p.at(1, p.dark ? 0.7 : 0.4, p.chroma);
    for (let i = 0; i < notches; i++) {
      const a = (i / notches) * TAU;
      ctx.lineWidth = i % 6 === 0 ? 1.8 : 0.8;
      const l = i % 6 === 0 ? S * 0.045 : S * 0.022;
      ctx.beginPath();
      ctx.moveTo(C + Math.cos(a) * R2, C + Math.sin(a) * R2);
      ctx.lineTo(C + Math.cos(a) * (R2 + l), C + Math.sin(a) * (R2 + l));
      ctx.stroke();
    }

    // centre denomination
    const emb = r.pick(["disc", "cartouche", "rosette"] as const);
    out.push(emb);
    ctx.fillStyle = p.at(2, p.dark ? 0.9 : 0.16, p.chroma * 0.7);
    if (emb === "disc") {
      ctx.beginPath();
      ctx.arc(C, C, S * 0.06, 0, TAU);
      ctx.fill();
    }
    if (emb === "cartouche") {
      roundRect(ctx, C - S * 0.1, C - S * 0.05, S * 0.2, S * 0.1, S * 0.05);
      ctx.fill();
    }
    if (emb === "rosette") {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        ctx.beginPath();
        ctx.arc(
          C + Math.cos(a) * S * 0.045,
          C + Math.sin(a) * S * 0.045,
          S * 0.028,
          0,
          TAU,
        );
        ctx.fill();
      }
    }

    // press distress — a seal that has actually been stamped
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 160; i++) {
      const a = r() * TAU,
        rad = Math.sqrt(r()) * S * 0.5;
      ctx.beginPath();
      ctx.arc(
        C + Math.cos(a) * rad,
        C + Math.sin(a) * rad,
        r.range(0.3, 1.4),
        0,
        TAU,
      );
      ctx.fillStyle = `rgba(0,0,0,${r.range(0.2, 0.7)})`;
      ctx.fill();
    }
    // put the ground back under the holes we just punched
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);
    ctx.restore();
  },
};

export const marks = [sigil, heraldry, kufic, knot, seal];
