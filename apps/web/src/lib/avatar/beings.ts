/**
 * Beings — the four ways a thing can look back at you: an eye, a face, the
 * silicon it thinks with, the sound it makes, and the system it keeps. These
 * are the systems that make a grid of avatars feel populated rather than
 * patterned.
 */

import { System } from "./system";
import { Pt, S, TAU, clamp, lerp, palette, poly, roundRect } from "./core";

/* -------------------------------------------------------------- 16 · ocular */

export const ocular: System = {
  id: "ocular",
  name: "Ocular",
  blurb:
    "Radial stroma fibres, a collarette, and a pupil whose shape decides what kind of thing this is.",
  family: "being",
  draw(ctx, r, out) {
    const p = palette(r);
    const C = S / 2;
    const gaze: Pt = [r.range(-0.1, 0.1) * S, r.range(-0.08, 0.08) * S];
    const R = S * r.range(0.28, 0.36);
    const pupilShape = r.pick([
      "round",
      "round",
      "slit",
      "goat",
      "keyhole",
      "square",
    ] as const);
    const pr = R * r.range(0.26, 0.5);
    const lidded = r.chance(0.5);
    const hetero = r.chance(0.22);
    out.push(
      `${pupilShape} pupil`,
      lidded ? "lidded" : "unlidded",
      hetero ? "heterochromia" : `${((R / S) * 100) | 0}% iris`,
    );

    // sclera
    const sg = ctx.createRadialGradient(C, C * 0.85, 4, C, C, S * 0.62);
    sg.addColorStop(0, p.ink(p.dark ? 0.34 : 0.98));
    sg.addColorStop(1, p.ink(p.dark ? 0.14 : 0.74));
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, S, S);

    ctx.save();
    if (lidded) {
      // almond aperture from two opposing arcs
      const open = r.range(0.5, 0.92);
      ctx.beginPath();
      ctx.moveTo(C - S * 0.47, C);
      ctx.quadraticCurveTo(C, C - S * 0.5 * open, C + S * 0.47, C);
      ctx.quadraticCurveTo(C, C + S * 0.5 * open, C - S * 0.47, C);
      ctx.closePath();
      ctx.clip();
    }

    const ix = C + gaze[0],
      iy = C + gaze[1];

    // iris body
    ctx.fillStyle = p.at(0, p.dark ? 0.38 : 0.5, p.chroma * 1.2);
    ctx.beginPath();
    ctx.arc(ix, iy, R, 0, TAU);
    ctx.fill();

    // stroma: tapered fibres from pupil to limbus, brightness in bands
    const fibres = 520;
    const sector = r() * TAU;
    for (let i = 0; i < fibres; i++) {
      const a = (i / fibres) * TAU;
      const inSector =
        hetero &&
        Math.abs(((a - sector + Math.PI * 3) % TAU) - Math.PI) > Math.PI * 0.72;
      const wob = Math.sin(a * r.between(5, 13)) * 0.5 + 0.5;
      const l = clamp(
        (p.dark ? 0.44 : 0.52) + wob * 0.22 + r.range(-0.1, 0.14),
        0.05,
        0.96,
      );
      ctx.strokeStyle = inSector
        ? p.at(2, l, p.chroma * 1.4, 0.85)
        : p.at(0, l, p.chroma * (0.7 + wob * 0.9), 0.85);
      ctx.lineWidth = r.range(0.5, 1.9);
      const r0 = pr * r.range(0.95, 1.25);
      const r1 = R * r.range(0.82, 1.0);
      ctx.beginPath();
      ctx.moveTo(ix + Math.cos(a) * r0, iy + Math.sin(a) * r0);
      ctx.lineTo(ix + Math.cos(a) * r1, iy + Math.sin(a) * r1);
      ctx.stroke();
    }

    // collarette — the jagged ring where the stroma changes gear
    ctx.strokeStyle = p.at(1, p.dark ? 0.78 : 0.36, p.chroma * 1.3, 0.75);
    ctx.lineWidth = r.range(1, 2.6);
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * TAU;
      const rad = pr * 1.55 + Math.sin(a * r.between(7, 15)) * R * 0.06;
      const x = ix + Math.cos(a) * rad,
        y = iy + Math.sin(a) * rad;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // limbal ring
    ctx.strokeStyle = p.ink(0.08, 0.55);
    ctx.lineWidth = R * 0.13;
    ctx.beginPath();
    ctx.arc(ix, iy, R - R * 0.05, 0, TAU);
    ctx.stroke();

    // pupil
    ctx.fillStyle = p.ink(0.04);
    ctx.beginPath();
    if (pupilShape === "round") ctx.arc(ix, iy, pr, 0, TAU);
    else if (pupilShape === "slit")
      ctx.ellipse(ix, iy, pr * 0.34, pr * 1.9, 0, 0, TAU);
    else if (pupilShape === "goat")
      ctx.ellipse(ix, iy, pr * 1.9, pr * 0.42, 0, 0, TAU);
    else if (pupilShape === "square") {
      const q = pr * 0.92;
      ctx.rect(ix - q, iy - q, q * 2, q * 2);
    } else {
      ctx.arc(ix, iy - pr * 0.3, pr * 0.8, 0, TAU);
      ctx.moveTo(ix + pr * 0.4, iy);
      ctx.lineTo(ix - pr * 0.4, iy);
      ctx.lineTo(ix - pr * 0.2, iy + pr * 1.5);
      ctx.lineTo(ix + pr * 0.2, iy + pr * 1.5);
    }
    ctx.fill();

    // catchlights
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.arc(ix - R * 0.36, iy - R * 0.4, R * 0.14, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(ix + R * 0.3, iy + R * 0.34, R * 0.07, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    if (lidded) {
      // lash line
      ctx.strokeStyle = p.ink(p.dark ? 0.06 : 0.2, 0.8);
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(C - S * 0.47, C);
      ctx.quadraticCurveTo(C, C - S * 0.5 * 0.8, C + S * 0.47, C);
      ctx.stroke();
    }
  },
};

/* --------------------------------------------------------------- 17 · visor */

export const visor: System = {
  id: "visor",
  name: "Visor",
  blurb:
    "A head silhouette, an eye arrangement, a mouth treatment, a crest — combinatorics you can recognise across a room.",
  family: "being",
  draw(ctx, r, out) {
    const p = palette(r);
    const C = S / 2;
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);

    // halo, so the head has somewhere to be
    const halo = ctx.createRadialGradient(C, C * 0.95, S * 0.1, C, C, S * 0.55);
    halo.addColorStop(0, p.at(1, p.dark ? 0.4 : 0.8, p.chroma * 1.2, 0.55));
    halo.addColorStop(1, p.at(1, p.dark ? 0.2 : 0.9, p.chroma, 0));
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, S, S);

    const shape = r.pick(["dome", "hex", "wedge", "block", "capsule"] as const);
    const crest = r.pick([
      "none",
      "none",
      "antenna",
      "horns",
      "fin",
      "ears",
    ] as const);
    const eyes = r.between(1, 4);
    const eyeKind = r.pick([
      "disc",
      "ring",
      "slit",
      "chevron",
      "cross",
    ] as const);
    const mouth = r.pick(["grille", "seam", "dots", "none", "fang"] as const);
    out.push(
      shape,
      `${eyes} ${eyeKind} eye${eyes > 1 ? "s" : ""}`,
      mouth === "none" ? "no mouth" : mouth,
      crest === "none" ? "bare crown" : crest,
    );

    const w = S * 0.33,
      h = S * 0.38;
    const top = C - h,
      bot = C + h * 0.92;

    // crest sits behind the plate
    ctx.fillStyle = p.at(2, p.dark ? 0.55 : 0.4, p.chroma * 1.1);
    if (crest === "antenna") {
      ctx.fillRect(C - 1.4, top - S * 0.2, 2.8, S * 0.22);
      ctx.beginPath();
      ctx.arc(C, top - S * 0.2, S * 0.035, 0, TAU);
      ctx.fill();
    } else if (crest === "horns") {
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(C + s * w * 0.7, top + h * 0.25);
        ctx.quadraticCurveTo(
          C + s * w * 1.5,
          top - h * 0.35,
          C + s * w * 0.85,
          top - h * 0.55,
        );
        ctx.quadraticCurveTo(
          C + s * w * 1.0,
          top - h * 0.05,
          C + s * w * 0.55,
          top + h * 0.3,
        );
        ctx.fill();
      }
    } else if (crest === "fin") {
      poly(ctx, [
        [C - w * 0.12, top + 6],
        [C, top - S * 0.18],
        [C + w * 0.12, top + 6],
      ]);
      ctx.fill();
    } else if (crest === "ears") {
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(C + s * w * 1.1, C - h * 0.1, w * 0.2, h * 0.3, 0, 0, TAU);
        ctx.fill();
      }
    }

    // the plate
    ctx.beginPath();
    if (shape === "dome") {
      ctx.moveTo(C - w, bot);
      ctx.lineTo(C - w, C - h * 0.15);
      ctx.quadraticCurveTo(C - w, top, C, top);
      ctx.quadraticCurveTo(C + w, top, C + w, C - h * 0.15);
      ctx.lineTo(C + w, bot);
      ctx.closePath();
    } else if (shape === "hex") {
      poly(ctx, [
        [C - w, C - h * 0.45],
        [C, top],
        [C + w, C - h * 0.45],
        [C + w, C + h * 0.45],
        [C, bot],
        [C - w, C + h * 0.45],
      ]);
    } else if (shape === "wedge") {
      poly(ctx, [
        [C - w, top],
        [C + w, top],
        [C + w * 0.62, bot],
        [C - w * 0.62, bot],
      ]);
    } else if (shape === "block") {
      roundRect(ctx, C - w, top, w * 2, bot - top, S * 0.05);
    } else {
      roundRect(ctx, C - w, top, w * 2, bot - top, w);
    }
    const pg = ctx.createLinearGradient(C - w, top, C + w, bot);
    pg.addColorStop(0, p.at(0, p.dark ? 0.52 : 0.86, p.chroma * 0.7));
    pg.addColorStop(1, p.at(0, p.dark ? 0.26 : 0.6, p.chroma * 0.9));
    ctx.fillStyle = pg;
    ctx.fill();
    ctx.strokeStyle = p.ink(p.dark ? 0.08 : 0.25, 0.6);
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // brow / visor slot
    const browY = C - h * 0.28;
    ctx.fillStyle = p.ink(0.07, 0.85);
    ctx.fillRect(C - w * 0.94, browY - h * 0.16, w * 1.88, h * 0.34);

    // eyes
    const glow = p.at(1, p.dark ? 0.86 : 0.55, p.chroma * 1.7);
    ctx.save();
    ctx.shadowColor = glow;
    ctx.shadowBlur = 8;
    ctx.fillStyle = glow;
    ctx.strokeStyle = glow;
    const span = w * 1.3;
    for (let i = 0; i < eyes; i++) {
      const t = eyes === 1 ? 0.5 : i / (eyes - 1);
      const ex = C - span / 2 + t * span;
      const ey = browY + (eyes === 3 && i === 1 ? -h * 0.02 : 0);
      const s = eyes > 2 ? S * 0.036 : S * 0.05;
      ctx.beginPath();
      if (eyeKind === "disc") ctx.arc(ex, ey, s, 0, TAU);
      else if (eyeKind === "ring") {
        ctx.lineWidth = s * 0.42;
        ctx.arc(ex, ey, s * 0.8, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
      } else if (eyeKind === "slit")
        ctx.rect(ex - s * 1.5, ey - s * 0.26, s * 3, s * 0.52);
      else if (eyeKind === "chevron") {
        ctx.moveTo(ex - s, ey - s * 0.5);
        ctx.lineTo(ex, ey + s * 0.55);
        ctx.lineTo(ex + s, ey - s * 0.5);
        ctx.lineTo(ex, ey - s * 0.05);
        ctx.closePath();
      } else {
        ctx.rect(ex - s * 1.2, ey - s * 0.22, s * 2.4, s * 0.44);
        ctx.rect(ex - s * 0.22, ey - s * 1.2, s * 0.44, s * 2.4);
      }
      ctx.fill();
    }
    ctx.restore();

    // mouth
    const my = C + h * 0.42;
    ctx.fillStyle = p.ink(0.1, 0.75);
    if (mouth === "grille") {
      const bars = r.between(3, 6);
      for (let i = 0; i < bars; i++)
        ctx.fillRect(
          C - w * 0.5 + (i * w) / bars,
          my,
          (w * 0.6) / bars,
          h * 0.22,
        );
    } else if (mouth === "seam") {
      ctx.fillRect(C - w * 0.5, my, w, 2.4);
    } else if (mouth === "dots") {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(C - w * 0.3 + i * w * 0.3, my + 4, 2.2, 0, TAU);
        ctx.fill();
      }
    } else if (mouth === "fang") {
      poly(ctx, [
        [C - w * 0.45, my],
        [C + w * 0.45, my],
        [C + w * 0.2, my + h * 0.3],
        [C - w * 0.2, my + h * 0.3],
      ]);
      ctx.fill();
      ctx.fillStyle = p.at(2, 0.9, p.chroma * 0.4);
      for (let i = 0; i < 4; i++) {
        poly(ctx, [
          [C - w * 0.4 + i * w * 0.24, my + 1],
          [C - w * 0.28 + i * w * 0.24, my + 1],
          [C - w * 0.34 + i * w * 0.24, my + h * 0.14],
        ]);
        ctx.fill();
      }
    }

    // seams and rivets
    ctx.strokeStyle = p.ink(p.dark ? 0.75 : 0.35, 0.2);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(C, browY + h * 0.2);
    ctx.lineTo(C, my - 2);
    ctx.stroke();
    ctx.fillStyle = p.ink(p.dark ? 0.8 : 0.4, 0.35);
    for (const s of [-1, 1])
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.arc(C + s * w * 0.84, C + h * (0.1 + i * 0.32), 1.5, 0, TAU);
        ctx.fill();
      }
  },
};

/* ----------------------------------------------------------------- 18 · die */

export const die: System = {
  id: "die",
  name: "Die Shot",
  blurb:
    "A floorplan: guillotine-cut blocks, each with the texture of what it does, wired through the channels between.",
  family: "being",
  draw(ctx, r, out) {
    const p = palette(r);
    const sub = p.at(0, p.dark ? 0.2 : 0.72, p.chroma * 0.5);
    ctx.fillStyle = sub;
    ctx.fillRect(0, 0, S, S);

    const pad = S * 0.11;
    type Blk = { x: number; y: number; w: number; h: number };
    const leaves: Blk[] = [];
    const cut = (b: Blk, d: number) => {
      const min = S * 0.14;
      if (
        d > 3 ||
        (b.w < min * 2 && b.h < min * 2) ||
        (d > 1 && r.chance(0.3))
      ) {
        leaves.push(b);
        return;
      }
      const vertical = b.w > b.h ? r.chance(0.82) : r.chance(0.18);
      const t = r.range(0.32, 0.68);
      if (vertical) {
        const w = b.w * t;
        cut({ ...b, w }, d + 1);
        cut({ ...b, x: b.x + w, w: b.w - w }, d + 1);
      } else {
        const h = b.h * t;
        cut({ ...b, h }, d + 1);
        cut({ ...b, y: b.y + h, h: b.h - h }, d + 1);
      }
    };
    cut({ x: pad, y: pad, w: S - pad * 2, h: S - pad * 2 }, 0);
    out.push(`${leaves.length} blocks`);

    const kinds: string[] = [];
    for (const b of leaves) {
      const g = 1.4;
      const x = b.x + g,
        y = b.y + g,
        w = b.w - g * 2,
        h = b.h - g * 2;
      if (w <= 0 || h <= 0) continue;
      const kind = r.pick([
        "sram",
        "logic",
        "logic",
        "analog",
        "pll",
        "pad",
      ] as const);
      kinds.push(kind);
      ctx.fillStyle = p.at(
        kind === "analog" ? 2 : 0,
        p.dark ? 0.28 : 0.62,
        p.chroma * 0.6,
      );
      ctx.fillRect(x, y, w, h);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      const trace = p.at(
        kind === "pll" ? 1 : 0,
        p.dark ? 0.66 : 0.4,
        p.chroma * (kind === "pll" ? 1.6 : 0.7),
      );
      ctx.fillStyle = trace;
      ctx.strokeStyle = trace;
      if (kind === "sram") {
        const gap = r.range(1.6, 3);
        const vert = w > h;
        for (let u = 0; u < (vert ? w : h); u += gap) {
          if (vert) ctx.fillRect(x + u, y, gap * 0.5, h);
          else ctx.fillRect(x, y + u, w, gap * 0.5);
        }
      } else if (kind === "logic") {
        const rows = Math.max(2, Math.round(h / r.range(3, 6)));
        for (let i = 0; i < rows; i++) {
          const ry = y + (i + 0.2) * (h / rows);
          let cx = x + 0.5;
          while (cx < x + w) {
            const cw = r.range(1, 4);
            if (r.chance(0.72)) ctx.fillRect(cx, ry, cw, (h / rows) * 0.55);
            cx += cw + r.range(0.6, 2);
          }
        }
      } else if (kind === "analog") {
        for (let i = 0; i < 6; i++) {
          ctx.lineWidth = 1;
          ctx.strokeRect(x + i * 2.2, y + i * 2.2, w - i * 4.4, h - i * 4.4);
        }
      } else if (kind === "pll") {
        ctx.lineWidth = 1.2;
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(
            x + w / 2,
            y + h / 2,
            (Math.min(w, h) / 2) * (i / 3.4),
            0,
            TAU,
          );
          ctx.stroke();
        }
      } else {
        const s = r.range(3, 5);
        for (let py = y + 1; py < y + h - s; py += s * 1.8)
          for (let px = x + 1; px < x + w - s; px += s * 1.8)
            ctx.fillRect(px, py, s, s);
      }
      ctx.restore();
      ctx.strokeStyle = p.ink(p.dark ? 0.75 : 0.3, 0.25);
      ctx.lineWidth = 0.8;
      ctx.strokeRect(x, y, w, h);
    }

    // routing over the channels, with vias where it turns
    const metal = p.at(1, p.dark ? 0.82 : 0.45, p.chroma * 1.3);
    ctx.strokeStyle = metal;
    ctx.fillStyle = metal;
    ctx.lineWidth = r.range(0.8, 1.6);
    const routes = r.between(3, 8);
    for (let i = 0; i < routes; i++) {
      const a = r.pick(leaves),
        b = r.pick(leaves);
      const ax = a.x + a.w / 2,
        ay = a.y + a.h / 2,
        bx = b.x + b.w / 2,
        by = b.y + b.h / 2;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx, ay, 1.6, 0, TAU);
      ctx.fill();
    }

    // bond pads all round the edge
    const gold = p.at(2, p.dark ? 0.84 : 0.62, p.chroma * 1.1);
    ctx.fillStyle = gold;
    const n = r.between(7, 12);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const s = S * 0.045;
      ctx.fillRect(t * S - s / 2, pad * 0.22, s, s * 0.8);
      ctx.fillRect(t * S - s / 2, S - pad * 0.22 - s * 0.8, s, s * 0.8);
      ctx.fillRect(pad * 0.22, t * S - s / 2, s * 0.8, s);
      ctx.fillRect(S - pad * 0.22 - s * 0.8, t * S - s / 2, s * 0.8, s);
    }

    // fiducial + scribe line, the marks that are not part of the circuit
    ctx.strokeStyle = p.ink(p.dark ? 0.9 : 0.2, 0.6);
    ctx.lineWidth = 1.2;
    const fx = S * 0.5,
      fy = S * 0.5;
    ctx.beginPath();
    ctx.moveTo(fx - 4, fy);
    ctx.lineTo(fx + 4, fy);
    ctx.moveTo(fx, fy - 4);
    ctx.lineTo(fx, fy + 4);
    ctx.stroke();
  },
};

/* ---------------------------------------------------------- 19 · voiceprint */

export const voiceprint: System = {
  id: "voiceprint",
  name: "Voiceprint",
  blurb:
    "Stacked harmonic lanes with one Lissajous figure over the top — what the agent sounds like, plotted.",
  family: "being",
  draw(ctx, r, out) {
    const p = palette(r);
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);

    // instrument rules
    ctx.strokeStyle = p.ink(p.dark ? 0.6 : 0.4, 0.16);
    ctx.lineWidth = 1;
    for (let i = 1; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i / 8) * S);
      ctx.lineTo(S, (i / 8) * S);
      ctx.moveTo((i / 8) * S, 0);
      ctx.lineTo((i / 8) * S, S);
      ctx.stroke();
    }

    const lanes = r.between(3, 6);
    const mode = r.pick(["trace", "trace", "bars", "envelope"] as const);
    out.push(`${lanes} lanes`, mode);

    for (let L = 0; L < lanes; L++) {
      const y0 = ((L + 0.5) / lanes) * S;
      const amp = (S / lanes) * r.range(0.18, 0.45);
      const harm = Array.from({ length: r.between(2, 5) }, () => ({
        f: r.range(0.5, 9),
        a: r.range(0.2, 1),
        ph: r() * TAU,
      }));
      const wave = (x: number) => {
        let v = 0,
          norm = 0;
        for (const h of harm) {
          v += h.a * Math.sin((x / S) * TAU * h.f + h.ph);
          norm += h.a;
        }
        return v / norm;
      };
      const col = p.mix(
        L / Math.max(1, lanes - 1),
        p.dark ? 0.82 : 0.35,
        p.chroma * 1.3,
      );

      if (mode === "bars") {
        const bars = r.between(20, 46);
        ctx.fillStyle = col;
        for (let i = 0; i < bars; i++) {
          const x = (i / bars) * S;
          const v = Math.abs(wave(x)) * amp;
          ctx.fillRect(x + 0.5, y0 - v, (S / bars) * 0.62, v * 2);
        }
      } else if (mode === "envelope") {
        ctx.fillStyle = p.mix(
          L / Math.max(1, lanes - 1),
          p.dark ? 0.5 : 0.55,
          p.chroma * 1.2,
          0.55,
        );
        ctx.beginPath();
        ctx.moveTo(0, y0);
        for (let x = 0; x <= S; x += 2)
          ctx.lineTo(x, y0 - Math.abs(wave(x)) * amp);
        for (let x = S; x >= 0; x -= 2)
          ctx.lineTo(x, y0 + Math.abs(wave(x)) * amp);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.strokeStyle = col;
        ctx.lineWidth = r.range(1, 2.4);
        ctx.beginPath();
        for (let x = 0; x <= S; x += 1.5) {
          const y = y0 + wave(x) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    // the figure: a:b Lissajous, the signature on top of the signal
    const a = r.between(1, 5),
      b = r.between(1, 5),
      ph = r() * TAU;
    out.push(`lissajous ${a}:${b}`);
    ctx.save();
    ctx.globalCompositeOperation = p.dark ? "lighter" : "multiply";
    ctx.strokeStyle = p.at(2, p.dark ? 0.9 : 0.32, p.chroma * 1.8, 0.9);
    ctx.lineWidth = r.range(1.2, 2.6);
    ctx.beginPath();
    const R = S * 0.33;
    for (let t = 0; t <= TAU + 0.02; t += 0.02) {
      const x = S / 2 + Math.sin(a * t + ph) * R;
      const y = S / 2 + Math.sin(b * t) * R;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // playhead
    const px = r.range(0.15, 0.85) * S;
    ctx.strokeStyle = p.at(1, p.dark ? 0.95 : 0.3, p.chroma * 1.5, 0.7);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, S);
    ctx.stroke();
  },
};

/* -------------------------------------------------------------- 20 · orrery */

export const orrery: System = {
  id: "orrery",
  name: "Orrery",
  blurb:
    "A primary, its satellites on tilted ellipses, each caught at the phase the seed puts it in.",
  family: "being",
  draw(ctx, r, out) {
    const p = palette(r);
    const C = S / 2;
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, S, S);

    // field stars
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = p.ink(p.dark ? 0.95 : 0.2, r.range(0.05, 0.35));
      ctx.fillRect(r() * S, r() * S, r.chance(0.15) ? 1.6 : 0.9, 0.9);
    }

    const bodies = r.between(2, 5);
    const ringed = r.chance(0.4);
    const primary = S * r.range(0.075, 0.13);
    out.push(
      `${bodies} satellites`,
      ringed ? "ringed primary" : "bare primary",
    );

    // corona
    const cor = ctx.createRadialGradient(
      C,
      C,
      primary * 0.6,
      C,
      C,
      primary * 4.2,
    );
    cor.addColorStop(0, p.at(1, 0.7, p.chroma * 1.6, 0.5));
    cor.addColorStop(1, p.at(1, 0.5, p.chroma, 0));
    ctx.fillStyle = cor;
    ctx.fillRect(0, 0, S, S);

    const orbits = Array.from({ length: bodies }, (_, i) => ({
      rx: S * (0.17 + (i + 1) * r.range(0.055, 0.085)),
      squash: r.range(0.18, 0.85),
      tilt: r() * TAU,
      phase: r() * TAU,
      retro: r.chance(0.3),
      size: S * r.range(0.018, 0.045),
      hue: r.int(3),
    }));

    for (const o of orbits) {
      const ry = o.rx * o.squash;
      ctx.save();
      ctx.translate(C, C);
      ctx.rotate(o.tilt);
      ctx.strokeStyle = p.ink(p.dark ? 0.85 : 0.3, 0.22);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, o.rx, ry, 0, 0, TAU);
      ctx.stroke();

      // the arc the body has just swept
      const sweep = r.range(0.6, 2.4) * (o.retro ? -1 : 1);
      ctx.strokeStyle = p.at(o.hue, p.dark ? 0.85 : 0.35, p.chroma * 1.4, 0.85);
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(0, 0, o.rx, ry, 0, o.phase - sweep, o.phase, sweep < 0);
      ctx.stroke();

      const bx = Math.cos(o.phase) * o.rx,
        by = Math.sin(o.phase) * ry;
      ctx.fillStyle = p.at(o.hue, p.dark ? 0.9 : 0.3, p.chroma * 1.5);
      ctx.beginPath();
      ctx.arc(bx, by, o.size, 0, TAU);
      ctx.fill();
      // terminator: the lit half faces the primary
      ctx.fillStyle = p.ink(0.05, 0.55);
      ctx.beginPath();
      ctx.arc(
        bx + Math.cos(o.phase) * o.size * 0.55,
        by + Math.sin(o.phase) * o.size * 0.55,
        o.size * 0.85,
        0,
        TAU,
      );
      ctx.fill();
      ctx.restore();
    }

    // the primary
    const pg = ctx.createRadialGradient(
      C - primary * 0.35,
      C - primary * 0.4,
      primary * 0.1,
      C,
      C,
      primary,
    );
    pg.addColorStop(0, p.at(1, 0.96, p.chroma * 0.5));
    pg.addColorStop(0.55, p.at(1, 0.78, p.chroma * 1.4));
    pg.addColorStop(1, p.at(0, 0.5, p.chroma * 1.5));
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.arc(C, C, primary, 0, TAU);
    ctx.fill();

    if (ringed) {
      ctx.save();
      ctx.translate(C, C);
      ctx.rotate(r.range(-0.5, 0.5));
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = p.at(
          2,
          p.dark ? 0.8 : 0.4,
          p.chroma,
          lerp(0.7, 0.2, i / 2),
        );
        ctx.lineWidth = lerp(2.4, 0.8, i / 2);
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          primary * (1.6 + i * 0.28),
          primary * (0.4 + i * 0.07),
          0,
          0,
          TAU,
        );
        ctx.stroke();
      }
      ctx.restore();
    }

    // frame ticks
    ctx.strokeStyle = p.ink(p.dark ? 0.8 : 0.3, 0.3);
    ctx.lineWidth = 1;
    for (const [x, y, dx, dy] of [
      [5, 5, 1, 1],
      [S - 5, 5, -1, 1],
      [5, S - 5, 1, -1],
      [S - 5, S - 5, -1, -1],
    ]) {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * 6);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * 6, y);
      ctx.stroke();
    }
  },
};

export const beings = [ocular, visor, die, voiceprint, orrery];
