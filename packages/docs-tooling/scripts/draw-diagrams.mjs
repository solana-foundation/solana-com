#!/usr/bin/env node
/**
 * Draws the diagrams that used to be pastel PNGs (Actions lifecycle, SWQoS
 * peering; the transaction-format and payment figures are in
 * draw-concepts.mjs) as light/dark SVG pairs in the docs palette:
 * 688px wide (the content column, so 13px labels are 13px on the page),
 * 1.25px strokes, 8px corners, one purple accent on zinc.
 *
 *   node packages/docs-tooling/scripts/draw-diagrams.mjs
 *   python3 packages/docs-tooling/scripts/embed-diagram-fonts.py
 *
 * Writes <name>-light.svg and <name>.svg next to the old PNGs. The pages
 * link the pair with `block dark:hidden` / `hidden dark:block` images.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const assets = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../apps/docs/public/docs-assets/assets",
);

const P = {
  light: {
    ink: "#18181b",
    muted: "#52525b",
    line: "#71717a",
    nFill: "#fafafa",
    nStroke: "#d4d4d8",
    // One accent; the former teal/green roles are neutral zinc
    // (brand-diagrams.mjs folds any leftovers the same way).
    purple: "#7a2fe0",
    purpleFill: "#fafafa",
    teal: "#71717a",
    tealFill: "#fafafa",
    green: "#71717a",
    greenFill: "#fafafa",
  },
  dark: {
    ink: "#f2f2f3",
    muted: "#a1a1aa",
    line: "#8b8b94",
    nFill: "#111113",
    nStroke: "#3f3f46",
    purple: "#b78aff",
    purpleFill: "#151518",
    teal: "#a1a1aa",
    tealFill: "#151518",
    green: "#a1a1aa",
    greenFill: "#151518",
  },
};
const W = 688;
const SANS = "Diatype,Inter,ui-sans-serif,system-ui,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,monospace";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A drawing context for one mode. */
function ctx(mode) {
  const c = P[mode];
  const tone = (t) =>
    ({
      purple: [c.purple, c.purpleFill],
      teal: [c.teal, c.tealFill],
      green: [c.green, c.greenFill],
      neutral: [c.nStroke, c.nFill],
      ghost: [c.nStroke, "none"],
    })[t];
  const parts = [];
  const api = {
    c,
    box(x, y, w, h, t = "neutral", { dashed = false, rx = 8 } = {}) {
      const [s, f] = tone(t);
      parts.push(
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" stroke="${s}" stroke-width="1.5"${dashed ? ' stroke-dasharray="5 4"' : ""}/>`,
      );
    },
    /** Centred lines; each line is a string or [{t, b, i, mono}] runs. */
    text(
      x,
      y,
      lines,
      {
        size = 13,
        color = c.ink,
        anchor = "middle",
        lh = 1.4,
        weight = 400,
        mono = false,
      } = {},
    ) {
      const arr = Array.isArray(lines) ? lines : [lines];
      const top = y - ((arr.length - 1) * size * lh) / 2;
      arr.forEach((ln, i) => {
        const runs = typeof ln === "string" ? [{ t: ln }] : ln;
        const spans = runs
          .map(
            (r) =>
              `<tspan${r.b ? ' font-weight="600"' : ""}${r.i ? ' font-style="italic"' : ""}${r.c ? ` fill="${r.c}"` : ""}>${esc(r.t)}</tspan>`,
          )
          .join("");
        parts.push(
          `<text x="${x}" y="${(top + i * size * lh).toFixed(1)}" dominant-baseline="central" text-anchor="${anchor}" font-family="${mono ? MONO : SANS}" font-size="${size}" font-weight="${weight}" fill="${color}">${spans}</text>`,
        );
      });
    },
    /** Polyline with an arrow head at the end. */
    arrow(points, { dashed = false, color = c.line, head = true } = {}) {
      const d = points
        .map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`)
        .join(" ");
      parts.push(
        `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"${dashed ? ' stroke-dasharray="4 4"' : ""}${head ? ` marker-end="url(#ah-${mode})"` : ""}/>`,
      );
    },
    line(x1, y1, x2, y2, { color = c.nStroke, dashed = false } = {}) {
      parts.push(
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.5"${dashed ? ' stroke-dasharray="3 4"' : ""}/>`,
      );
    },
    raw(s) {
      parts.push(s);
    },
    svg(h, title) {
      return `<svg data-sol-type="1" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><defs><marker id="ah-${mode}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5 L8.5 5 L1 8.5" fill="none" stroke="${c.line}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>${parts.join("")}</svg>\n`;
    },
  };
  return api;
}

const diagrams = {
  // Transaction-format, compact-array and payment-flow figures moved to
  // draw-concepts.mjs (hand-laid-out field cards).
  "docs/action-execution-and-lifecycle": {
    title:
      "Solana Actions: execution and lifecycle between the user, the Action client, the Action provider and Solana",
    draw(d) {
      const lanes = [
        ["User", 52, "teal"],
        ["Action client", 268, "purple"],
        ["Action provider", 498, "teal"],
        ["Solana", 636, "green"],
      ];
      const top = 8;
      const msgs = [
        [0, 1, ["Scans a QR code, clicks", "a link or a button"]],
        [1, 2, ["GET request for metadata"]],
        [2, 1, ["Metadata and available", "Actions"]],
        [1, 0, ["Shows the Action UI"]],
        [0, 1, ["Chooses an Action"]],
        [1, 2, ["POST request with", "the wallet’s public key"]],
        [2, 1, ["Serialized transaction"]],
        [1, 0, ["Shows transaction details"]],
        [0, 1, ["Approves the transaction"]],
        [1, 3, ["Signs and sends", "the transaction"]],
      ];
      const rowH = 42;
      const y0 = top + 36 + 24;
      const bottom = y0 + msgs.length * rowH;
      lanes.forEach(([name, x, t]) => {
        d.box(x - 50, top, 100, 32, t);
        d.text(x, top + 16, name, { size: 12.5, weight: 500 });
        d.line(x, top + 32, x, bottom, { dashed: true });
      });
      msgs.forEach(([a, b, label], i) => {
        const y = y0 + i * rowH + 22;
        const xa = lanes[a][1];
        const xb = lanes[b][1];
        const dir = Math.sign(xb - xa);
        d.arrow(
          [
            [xa + dir * 2, y],
            [xb - dir * 4, y],
          ],
          { dashed: b < a },
        );
        const mid = b === 3 ? (xa + lanes[2][1]) / 2 : (xa + xb) / 2;
        d.text(
          mid,
          y - 11 - ((label.length - 1) * 12 * 1.3) / 2,
          label.map((l) => [{ t: l }]),
          { size: 12, lh: 1.3 },
        );
      });
      return bottom + 8;
    },
  },
  "guides/stake-weighted-qos-guide/peered-RPCs-guide": {
    title: "RPC nodes peering with a staked validator for stake-weighted QoS",
    draw(d) {
      d.box(40, 92, 180, 96, "purple", { rx: 12 });
      d.text(130, 140, "Validator", { weight: 600 });
      d.text(130, 210, "--staked-nodes-overrides", {
        mono: true,
        size: 12,
        color: d.c.muted,
      });
      for (let i = 0; i < 4; i++) {
        const y = 14 + i * 64;
        d.box(468, y, 140, 44, "teal");
        d.text(538, y + 22, "RPC node");
        d.arrow([
          [468, y + 22],
          [226, 116 + i * 16],
        ]);
      }
      d.text(538, 284, "--rpc-send-transaction-tpu-peer HOST:PORT", {
        mono: true,
        size: 12,
        color: d.c.muted,
      });
      return 300;
    },
  },
};

for (const [name, def] of Object.entries(diagrams)) {
  for (const mode of ["light", "dark"]) {
    const d = ctx(mode);
    const h = def.draw(d);
    const file = path.join(
      assets,
      `${name}${mode === "light" ? "-light" : ""}.svg`,
    );
    writeFileSync(file, d.svg(h, def.title));
  }
}
console.log(
  `draw-diagrams: ${Object.keys(diagrams).length} diagram pair(s) written`,
);
