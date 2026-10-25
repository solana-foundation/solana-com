#!/usr/bin/env node
/**
 * Brand pass over the hand-drawn and converted diagram SVGs (everything in
 * apps/docs/public/docs-assets/assets/docs except the mermaid renders, which
 * render-mermaid.ts styles itself).
 *
 *   node packages/docs-tooling/scripts/brand-diagrams.mjs [--check]
 *
 * Run it last, after sync-diagram-themes.mjs. It is idempotent.
 *
 * 1. Colour: the docs illustration system (see draw-concepts.mjs): zinc
 *    neutrals and ONE accent, the theme link purple (light #7a2fe0, dark
 *    #b78aff). Legacy purples fold into the accent; teal, green, blue,
 *    amber and orange fold into neutral zinc (stroke/text #71717a light,
 *    #a1a1aa dark); every pastel fill becomes the neutral surface
 *    (#fafafa light, #151518 dark).
 * 2. Stroke: 1.25px as drawn in the 688px content column (strokes are
 *    scaled by the figure's own down-scaling factor). Corners: 8px as drawn.
 * 3. Type: the most common label size is brought to about 13px as drawn in
 *    the column. Scaled down by at most 0.7x; scaled up (at most 1.15x)
 *    only in the roomy hub and finance figures, so labels never outgrow
 *    their boxes.
 * 4. Flat: drop shadows are removed.
 * 5. One accent per file, on the focal shape only (see oneAccent).
 * 6. One arrowhead, an open chevron (see openHeads).
 *
 * Files drawn by draw-concepts.mjs (root attribute data-sol-drawn="hand")
 * are already in the system and are skipped.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../apps/docs/public/docs-assets/assets/docs",
);
const COLUMN = 688;
const TARGET_FONT = 13;
const TARGET_STROKE = 1.25;
const TARGET_RADIUS = 8;

const LIGHT = {
  // purples -> one purple
  "#9b4dff": "#7c3aed",
  "#7f5cf0": "#7c3aed",
  "#6d5bd0": "#7c3aed",
  "#a21caf": "#7c3aed",
  "#8b5cf6": "#7c3aed",
  "#9945ff": "#7c3aed",
  "#ede9fe": "#f3edff",
  // blue / sky -> teal
  "#3b82f6": "#0f9e94",
  "#2563eb": "#0f9e94",
  "#0284c7": "#0f9e94",
  "#0369a1": "#0f9e94",
  "#0ea5e9": "#0f9e94",
  "#2f6fe0": "#0f9e94",
  "#0f8b78": "#0f9e94",
  "#eff6ff": "#e6f8f6",
  "#f0f9ff": "#e6f8f6",
  // emerald -> green
  "#059669": "#0a8f5a",
  "#047857": "#0a8f5a",
  "#0bb070": "#0a8f5a",
  "#10b981": "#0a8f5a",
  "#0a7a4c": "#0a8f5a",
  "#ecfdf5": "#e3fbef",
  // amber / yellow -> purple, orange -> green
  "#b45309": "#7c3aed",
  "#b88400": "#7c3aed",
  "#9a7700": "#7c3aed",
  "#d97706": "#7c3aed",
  "#fff7dd": "#f3edff",
  "#fff7d6": "#f3edff",
  "#c45a18": "#0a8f5a",
  "#fff0e6": "#e3fbef",
  // slate -> zinc
  "#172033": "#18181b",
  "#5b6678": "#52525b",
  "#667085": "#71717a",
  "#552222": "#18181b",
};
const DARK = {
  "#7a2fe0": "#b78aff",
  "#a777ff": "#b78aff",
  "#b98bff": "#b78aff",
  "#9b84f5": "#b78aff",
  "#a78bfa": "#b78aff",
  "#8b7cf6": "#b78aff",
  "#c4b5fd": "#b78aff",
  "#9945ff": "#b78aff",
  "#60a5fa": "#19d3c5",
  "#38bdf8": "#19d3c5",
  "#7dd3fc": "#19d3c5",
  "#2dd4bf": "#19d3c5",
  "#0f1a2e": "#0b2422",
  "#102b3b": "#0b2422",
  "#34d399": "#14f195",
  "#6ee7b7": "#14f195",
  "#14372d": "#0b261b",
  "#fbbf24": "#b78aff",
  "#facc15": "#b78aff",
  "#342c16": "#1c1430",
  "#fb923c": "#14f195",
  "#352317": "#0b261b",
  "#fca5a5": "#f2f2f3",
  "#a8b3c2": "#a1a1aa",
  "#a8b3c3": "#a1a1aa",
  "#f8fafc": "#f2f2f3",
  "#64748b": "#8b8b94",
};

// Second stage: the one-accent system. Targets are never keys of LIGHT,
// DARK or these maps, so the pass stays idempotent.
const SYSTEM_LIGHT = {
  "#7c3aed": "#7a2fe0",
  "#f3edff": "#fafafa",
  "#e3d8fb": "#d4d4d8",
  "#0f9e94": "#71717a",
  "#e6f8f6": "#fafafa",
  "#0a8f5a": "#71717a",
  "#e3fbef": "#fafafa",
  "#9de8c4": "#d4d4d8",
};
const SYSTEM_DARK = {
  "#1c1430": "#151518",
  "#4c3a75": "#3f3f46",
  "#19d3c5": "#a1a1aa",
  "#0b2422": "#151518",
  "#14f195": "#a1a1aa",
  "#0b261b": "#151518",
  "#1f6b4b": "#3f3f46",
};

function list(dir) {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) {
      if (f === "mermaid") continue;
      out.push(...list(p));
    } else if (f.endsWith(".svg")) out.push(p);
  }
  return out;
}

function recolor(svg, map) {
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${keys.join("|")})(?![0-9a-f])`, "gi");
  return svg.replace(re, (m) => map[m.toLowerCase()]);
}

const num = (n) => String(Math.round(n * 100) / 100);

// Skip embedded font data (base64) when scanning or rewriting.
function splitFonts(svg) {
  const parts = [];
  let last = 0;
  const re = /url\(data:[^)]*\)/g;
  for (let m; (m = re.exec(svg));) {
    parts.push({ text: svg.slice(last, m.index), code: false });
    parts.push({ text: m[0], code: true });
    last = m.index + m[0].length;
  }
  parts.push({ text: svg.slice(last), code: false });
  return parts;
}
const mapText = (svg, fn) =>
  splitFonts(svg)
    .map((p) => (p.code ? p.text : fn(p.text)))
    .join("");

const FONT_RES = [
  /(font-size=")([\d.]+)(")/g,
  /(font-size:\s*)([\d.]+)(px)/g,
  /(font:\s*(?:italic\s+)?(?:\d{3}\s+)?)([\d.]+)(px)/g,
];

// Roomy layouts (hub overviews, finance figures) can take larger labels;
// the tightly packed core diagrams are only ever scaled down.
const ROOMY = /[\\/](diagrams|privacy)[\\/]/;

function brand(svg, dark, file = "") {
  const vb = svg.match(/viewBox="([^"]+)"/);
  const w = vb ? Number(vb[1].trim().split(/[\s,]+/)[2]) : 0;
  if (!w || w < 50) return svg; // icons, sprites
  const scale = Math.min(1, COLUMN / w); // how the figure is drawn

  let out = mapText(svg, (t) => {
    t = recolor(t, dark ? DARK : LIGHT);
    t = recolor(t, dark ? SYSTEM_DARK : SYSTEM_LIGHT);
    return t;
  });
  out = openHeads(oneAccent(out, dark, file), dark);
  out = mapText(out, (t) => {
    t = recolor(t, dark ? SYSTEM_DARK : SYSTEM_LIGHT);
    // Highlighter field marks (yellow, later purple tints) -> neutral.
    t = t.replace(
      /rgba\(\s*(?:247\s*,\s*195\s*,\s*36|153\s*,\s*69\s*,\s*255)\s*,\s*[\d.]+\s*\)/g,
      dark ? "#1c1c1f" : "#f4f4f5",
    );
    // 8px corners as drawn (pills and circles, rx > 16, keep theirs).
    const rr = num(TARGET_RADIUS / scale);
    t = t.replace(/(\s(?:rx|ry)=")([\d.]+)(")/g, (m, a, v, b) =>
      Number(v) >= 3 && Number(v) <= 16 ? a + rr + b : m,
    );
    // Flat figures: no drop shadows.
    t = t.replace(/\sfilter="url\(#[^)]*\)"/g, "");
    // One stroke width, as drawn. Arrow heads and hairlines (<1) keep theirs.
    const sw = num(TARGET_STROKE / scale);
    t = t.replace(/(stroke-width=")([\d.]+)(")/g, (m, a, v, b) =>
      Number(v) >= 1 && Number(v) <= 4.5 ? a + sw + b : m,
    );
    t = t.replace(/(stroke-width:\s*)([\d.]+)(px)?/g, (m, a, v, px) =>
      Number(v) >= 1 && Number(v) <= 4.5 ? a + sw + (px || "") : m,
    );
    return t;
  });

  // Type scale.
  const sizes = {};
  mapText(out, (t) => {
    for (const re of FONT_RES)
      for (const m of t.matchAll(re)) {
        const v = Number(m[2]);
        sizes[v] = (sizes[v] || 0) + 1;
      }
    return t;
  });
  const mode = Number(
    Object.entries(sizes).sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]?.[0] ||
      0,
  );
  // Type is scaled once (the clamp would otherwise compound on re-runs).
  if (mode && !/<svg\b[^>]*data-sol-type/.test(out)) {
    const want = TARGET_FONT / scale;
    const up = ROOMY.test(file) ? 1.15 : 1;
    const f = Math.max(0.7, Math.min(up, want / mode));
    if (Math.abs(f - 1) > 0.03)
      out = mapText(out, (t) => {
        for (const re of FONT_RES)
          t = t.replace(re, (m, a, v, b) => a + num(Number(v) * f) + b);
        return t;
      });
    out = out.replace(/<svg\b/, '<svg data-sol-type="1"');
  }
  return out;
}

/*
 * 5. One accent, chosen by hand, never spread by script. The accent stays on
 *    ONE shape per file (FOCAL[file], default the first accent-stroked
 *    shape in source order); every other accent stroke folds to neutral
 *    zinc, and accent text folds to the muted label colour.
 */
const FOCAL = {
  // file (relative, no -light / .svg) -> index of the shape that keeps it
  "frontend/sign-in-decision": 0, // "Wallet connected", the entry point
  "tools/kora/request-lifecycle": 0, // the client app
};
function oneAccent(svg, dark, file) {
  const rel = path
    .relative(root, file)
    .replace(/\\/g, "/")
    .replace(/(-light)?\.svg$/, "");
  const keep = FOCAL[rel] ?? 0;
  const stroke = dark ? "#71717a" : "#71717a";
  const muted = dark ? "#a1a1aa" : "#52525b";
  let i = 0;
  return mapText(svg, (t) =>
    t
      // Shapes: keep the focal one.
      .replace(
        /<(rect|path|circle|ellipse|polygon|polyline|line)\b[^>]*>/g,
        (tag) => {
          if (!/stroke="#(?:7a2fe0|b78aff)"/i.test(tag) || /<marker/.test(tag))
            return tag;
          return i++ === keep
            ? tag
            : tag.replace(/stroke="#(?:7a2fe0|b78aff)"/i, `stroke="${stroke}"`);
        },
      )
      // Text (attributes and CSS rules): muted.
      .replace(
        /(<(?:text|tspan)\b[^>]*\sfill=")#(?:7a2fe0|b78aff)(")/gi,
        `$1${muted}$2`,
      )
      .replace(
        /(\.[\w-]+\s*\{[^}]*?)fill:\s*#(?:7a2fe0|b78aff)(?![0-9a-f])/gi,
        (m, a) => (/stroke/.test(m) ? m : `${a}fill:${muted}`),
      ),
  );
}

/*
 * 6. One arrowhead: an open chevron. Filled triangle heads (in <marker>s
 *    and as 3-point <polygon>s) become open strokes in the edge colour.
 */
function openHeads(svg, dark) {
  const col = dark ? "#a1a1aa" : "#71717a";
  return mapText(svg, (t) =>
    t
      .replace(
        /(<marker\b[^>]*>)(\s*<path\b[^>]*d="M\s*-?[\d.]+[ ,]-?[\d.]+\s*L?\s*(?:10|9)[ ,]5\s*L?\s*-?[\d.]+[ ,](?:10|9)\s*(?:z|Z)"[^>]*\/>)/g,
        (m, open) =>
          `${open}<path d="M2 1.5L8.5 5L2 8.5" fill="none" stroke="${col}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>`,
      )
      .replace(
        /<polygon\b([^>]*)points="\s*([-\d.]+[ ,][-\d.]+)\s+([-\d.]+[ ,][-\d.]+)\s+([-\d.]+[ ,][-\d.]+)\s*"([^>]*)\/?>(<\/polygon>)?/g,
        (m, a, p1, p2, p3, b) => {
          const attrs = (a + b)
            .replace(/\sfill="[^"]*"/, "")
            .replace(/\/\s*$/, "");
          return `<polyline${attrs} points="${p1} ${p2} ${p3}" fill="none"/>`;
        },
      ),
  );
}

const check = process.argv.includes("--check");
let changed = 0;
for (const file of list(root)) {
  if (file.includes(`${path.sep}surfpool${path.sep}`)) continue; // screenshots
  const svg = readFileSync(file, "utf8");
  if (/<svg\b[^>]*data-sol-drawn="hand"/.test(svg)) continue; // draw-concepts.mjs
  const dark = !file.endsWith("-light.svg");
  // A dark file without a light sibling is a single-mode drawing; treat it
  // as light (it is shown on both backgrounds).
  const hasLight = (() => {
    try {
      statSync(file.replace(/\.svg$/, "-light.svg"));
      return true;
    } catch {
      return false;
    }
  })();
  const out = brand(svg, dark && hasLight, file);
  if (out !== svg) {
    changed++;
    if (check) console.log(`would restyle: ${path.relative(root, file)}`);
    else writeFileSync(file, out);
  }
}
console.log(
  `brand-diagrams${check ? " --check" : ""}: ${changed} file(s) ${check ? "out of date" : "restyled"}`,
);
if (check && changed) process.exit(1);
