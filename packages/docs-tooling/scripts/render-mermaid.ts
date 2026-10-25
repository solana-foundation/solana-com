/**
 * Pre-render every ```mermaid fence in apps/docs/content to a themed SVG pair.
 *
 *   pnpm --filter @workspace/docs-tooling exec tsx scripts/render-mermaid.ts [--check] [--force]
 *   python3 packages/docs-tooling/scripts/embed-diagram-fonts.py
 *
 * Writes apps/docs/public/docs-assets/assets/docs/mermaid/<hash>-light.svg
 * and <hash>.svg (dark), where <hash> = mermaidHash(source) — the names the
 * `<div className="sol-mermaid">` figure after each fence links. Files
 * that exist are kept (sources are content-addressed); --force redraws all;
 * SVGs no fence uses any more are deleted. --check exits 1 when a figure is
 * missing or orphaned. Run embed-diagram-fonts.py afterwards so the labels
 * use ABC Diatype inside <img>.
 *
 * Style: the docs illustration system (see draw-concepts.mjs): neutral
 * zinc nodes, 1px outlines, 1.25px edges, 8px corners, one purple accent;
 * light and dark. Labels are SVG text (htmlLabels off), so the files work as <img>.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { mdxCodec } from "../src/lib/codec.ts";
import { listContentPages } from "../src/generators/_lib.ts";
import { drawPhone } from "./mermaid-phone.ts";
import { docsPublicAssets, docsRoot, repoRoot } from "../src/lib/paths.ts";
import type { AstNode } from "../src/types.ts";

const outDir = path.join(docsPublicAssets, "assets", "docs", "mermaid");
const fontsRoot = path.join(repoRoot, "apps", "docs", "src", "fonts");

/** Stable id of a diagram source (file names of its SVG pair). */
export function mermaidHash(source: string): string {
  return createHash("sha256").update(source).digest("hex").slice(0, 12);
}

/**
 * Flowcharts and sequence diagrams also get a phone drawing
 * (`<hash>-sm-light.svg` / `<hash>-sm.svg`, drawn top to bottom by
 * mermaid-phone.ts), shown below 640px instead of a sideways scroll.
 */
export function hasPhoneVariant(source: string): boolean {
  return /^\s*(?:(?:flowchart|graph)\b|sequenceDiagram\b)/m.test(source);
}
// mermaid is not a dependency of this package (it ships with the docs
// toolchain in the pnpm store); use the newest copy there, or MERMAID_JS.
function findMermaid(): string {
  if (process.env.MERMAID_JS) return process.env.MERMAID_JS;
  const store = path.join(repoRoot, "node_modules", ".pnpm");
  const dirs = readdirSync(store)
    .filter((d) => /^mermaid@\d/.test(d))
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  for (const d of dirs) {
    const f = path.join(
      store,
      d,
      "node_modules",
      "mermaid",
      "dist",
      "mermaid.min.js",
    );
    if (existsSync(f)) return f;
  }
  throw new Error("mermaid.min.js not found; set MERMAID_JS");
}
const mermaidJs = findMermaid();

/** Width of the phone drawings: the figure on a 390px phone. */
const PHONE_WIDTH = 336;
const FONT = "Diatype, Inter, ui-sans-serif, system-ui, sans-serif";
const common = {
  fontFamily: FONT,
  // One label size for every diagram. The figure is shown at its natural
  // size (see sizeSvg), so 13px here is 13px on the page.
  fontSize: "13px",
};
// The docs illustration system (draw-concepts.mjs): neutral zinc nodes on
// the page colour, thin edges, and no default accent. An author marks the
// ONE focal node with `class X focal` (flowcharts); render() adds the
// `focal` classDef, which draws that node's outline in the accent.
const SYS = {
  light: {
    page: "#ffffff",
    surface: "#ffffff",
    sunken: "#fafafa",
    ink: "#18181b",
    ink2: "#52525b",
    line: "#d4d4d8",
    hair: "#e4e4e7",
    edge: "#8b8b94",
    accent: "#7a2fe0",
  },
  dark: {
    page: "#0a0a0b",
    surface: "#111113",
    sunken: "#151518",
    ink: "#f2f2f3",
    ink2: "#a1a1aa",
    line: "#3f3f46",
    hair: "#27272a",
    edge: "#71717a",
    accent: "#b78aff",
  },
} as const;

function themeVariables(mode: keyof typeof SYS) {
  const c = SYS[mode];
  return {
    ...common,
    darkMode: mode === "dark",
    background: c.page,
    primaryColor: c.surface,
    primaryTextColor: c.ink,
    primaryBorderColor: c.line,
    secondaryColor: c.sunken,
    secondaryBorderColor: c.line,
    secondaryTextColor: c.ink,
    tertiaryColor: c.sunken,
    tertiaryBorderColor: c.hair,
    tertiaryTextColor: c.ink,
    mainBkg: c.surface,
    nodeBorder: c.line,
    nodeTextColor: c.ink,
    textColor: c.ink,
    titleColor: c.ink,
    lineColor: c.edge,
    clusterBkg: c.sunken,
    clusterBorder: c.hair,
    edgeLabelBackground: c.page,
    actorBkg: c.surface,
    actorBorder: c.line,
    actorTextColor: c.ink,
    actorLineColor: c.hair,
    signalColor: c.edge,
    signalTextColor: c.ink,
    labelBoxBkgColor: c.page,
    labelBoxBorderColor: c.line,
    labelTextColor: c.ink2,
    loopTextColor: c.ink2,
    noteBkgColor: c.page,
    noteBorderColor: c.hair,
    noteTextColor: c.ink2,
    activationBkgColor: c.page,
    activationBorderColor: c.line,
    sequenceNumberColor: c.page,
    altBackground: c.sunken,
    // Pie: the accent, then a zinc ramp.
    pie1: c.accent,
    pie2: mode === "dark" ? "#a1a1aa" : "#52525b",
    pie3: mode === "dark" ? "#71717a" : "#a1a1aa",
    pie4: mode === "dark" ? "#3f3f46" : "#d4d4d8",
    pie5: mode === "dark" ? "#27272a" : "#e4e4e7",
    pieStrokeColor: c.page,
    pieOuterStrokeColor: c.hair,
  };
}
const THEMES = {
  light: themeVariables("light"),
  dark: themeVariables("dark"),
} as const;

// Shared stroke and corner rules: 1px boxes, 1.25px edges, 8px corners.
const themeCss = (mode: keyof typeof SYS) => `
  .node rect, .node polygon, .node circle, .node path, rect.actor, .cluster rect, rect.note, .labelBox { stroke-width: 1px; }
  .node rect, .cluster rect, rect.actor, rect.note, .labelBox { rx: 8px; ry: 8px; }
  .node polygon { stroke: ${SYS[mode].line}; stroke-width: 1px; }
  .edgePath .path, .flowchart-link, .messageLine0, .messageLine1, .loopLine { stroke-width: 1.25px; }
  .actor-line { stroke-width: 1px; stroke-dasharray: 2 4; }
  .messageLine1 { stroke-dasharray: 4 4 !important; }
  .flowchart-link.edge-pattern-dotted, .flowchart-link.edge-pattern-dashed { stroke-dasharray: 4 4 !important; }
  .loopLine { stroke: ${SYS[mode].line}; stroke-dasharray: 3 3; }
  .sequenceNumber { fill: ${SYS[mode].page}; }
  #sequencenumber { fill: ${SYS[mode].ink2}; }
  .edgeLabel, .edgeLabel rect { opacity: 1; }
  .edgeLabel text, .edgeLabel span { fill: ${SYS[mode].ink2}; color: ${SYS[mode].ink2}; }
  .labelText, .labelText > tspan { font-weight: 500; }
  text, .nodeLabel, .label { font-family: ${FONT}; }
`;

function config(mode: keyof typeof THEMES) {
  return {
    startOnLoad: false,
    // The sequence renderer copies the top-level fontSize over its own
    // actor/message/note sizes, so it has to be 13 here too.
    fontSize: 13,
    theme: "base",
    securityLevel: "strict",
    htmlLabels: false,
    deterministicIds: true,
    themeVariables: THEMES[mode],
    themeCSS: themeCss(mode),
    flowchart: {
      htmlLabels: false,
      useMaxWidth: false,
      // Orthogonal steps; postProcess rounds the corners to 8px, like the
      // concept SVGs' elbow connectors.
      curve: "step",
      padding: 14,
      // Lines wrap at 200px, so boxes come out close to one width;
      // postProcess then makes them exactly equal.
      wrappingWidth: 200,
      nodeSpacing: 32,
      rankSpacing: 56,
    },
    sequence: {
      mirrorActors: false,
      actorMargin: 36,
      boxMargin: 8,
      noteMargin: 12,
      messageMargin: 38,
      // Long messages wrap inside the actor spacing instead of stretching
      // the diagram to 2,000px (which scaled labels down to 4px).
      wrap: true,
      width: 136,
      actorFontSize: 13,
      messageFontSize: 13,
      noteFontSize: 12,
      useMaxWidth: false,
    },
    state: { padding: 12, useMaxWidth: false },
  };
}

/** Marks the end of a node's title line (see prepare / postProcess). */
const TITLE_END = "⁤";
const MONO =
  "'ABC Favorit Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** `%% focal: <message text>` marks the one focal message of a sequence. */
export function focalMessage(source: string): string | undefined {
  return /^\s*%%\s*focal\s*:\s*(.+?)\s*$/m.exec(source)?.[1];
}

/** Layout direction of a flowchart source (TD for TB/TD/BT, else LR). */
export function flowDirection(source: string): "TD" | "LR" | undefined {
  const m = /^\s*(?:flowchart|graph)\s+(TB|TD|BT|LR|RL)\b/m.exec(source);
  if (!m) return /^\s*(?:flowchart|graph)\s*$/m.test(source) ? "TD" : undefined;
  return m[1] === "LR" || m[1] === "RL" ? "LR" : "TD";
}

/**
 * Source tweaks applied at render time only (the hash is of the authored
 * source): the `focal` classDef, a marker after the first `<br/>` of each
 * node label so postProcess can set the title line apart. (Phone drawings
 * are not mermaid layouts: see mermaid-phone.ts.)
 */
export function prepare(source: string, mode: keyof typeof SYS): string {
  const c = SYS[mode];
  let src = source;
  if (/^\s*(flowchart|graph)\b/.test(src)) {
    src = src
      .split("\n")
      .map((line) =>
        // Node labels only: ["…<br/>…"], {"…<br/>…"}, ("…<br/>…") etc.
        line.replace(
          /([[({]+"?)([^\]|)}"]*?)<br\s*\/?>/g,
          (m, open, title) => `${open}${title}${TITLE_END}<br/>`,
        ),
      )
      .join("\n");
    src += `\n  classDef focal stroke:${c.accent},stroke-width:1.25px`;
  }
  return src;
}

/**
 * Runs in the page, on the live SVG (it measures text), and redraws the
 * figure in the concept-SVG system:
 * - open chevron heads; dashed (not dotted) "refers to" edges;
 * - node labels as a 13px/500 title line plus muted 12px lines, left-aligned
 *   and top-aligned; identifiers (CreateDvp, mint_a, "dvp") in Favorit Mono;
 * - top-to-bottom flowcharts: every box the same width, every box in a rank
 *   the same height (tops aligned), ranks re-spaced to fit;
 * - edges re-routed orthogonally with at most two bends (straight when the
 *   ends line up, one shared trunk for forks), 8px corners, heads that end
 *   on the box; any route that would cross a box keeps mermaid's path;
 * - edge labels 8px beside their line (after a vertical segment, above a
 *   horizontal one), never knocked out;
 * - sequence diagrams: message labels start at the arrow's tail, notes are
 *   left-aligned, and the `%% focal:` message carries the accent.
 */
function postProcess(
  svgText: string,
  c: { ink: string; ink2: string; edge: string; accent: string; page: string },
  titleEnd: string,
  o: { mono: string; focal?: string; flow?: "TD" | "LR" },
): string {
  const NS = "http://www.w3.org/2000/svg";
  const host = document.createElement("div");
  host.innerHTML = svgText;
  document.body.appendChild(host);
  const svg = host.querySelector("svg") as SVGSVGElement;
  const sid = svg.id;
  const num = (v: number) => String(Math.round(v * 100) / 100);
  const mk = (tag: string, attrs: Record<string, string>) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  };
  // Our own heads: tip exactly at the path end (draw-concepts' marker).
  const defs =
    svg.querySelector("defs") ??
    svg.insertBefore(mk("defs", {}), svg.firstChild);
  const head = (name: string, col: string) => {
    const m = mk("marker", {
      id: `${sid}-${name}`,
      viewBox: "0 0 10 10",
      refX: "8.5",
      refY: "5",
      markerWidth: "10",
      markerHeight: "10",
      markerUnits: "userSpaceOnUse",
      orient: "auto-start-reverse",
    });
    m.appendChild(
      mk("path", {
        d: "M3 1.5L8.5 5L3 8.5",
        fill: "none",
        stroke: col,
        "stroke-width": "1.25",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
    );
    defs.appendChild(m);
  };
  head("sol-head", c.edge);
  head("sol-head-accent", c.accent);

  // 1. Mermaid's own arrowheads: filled triangles -> open chevrons.
  svg.querySelectorAll("marker").forEach((m) => {
    if (m.id.includes("sol-head")) return;
    const path = m.querySelector("path");
    if (!path) return;
    const d = path.getAttribute("d") ?? "";
    if (!/z\s*$/i.test(d)) return;
    const v = (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
    if (v.length !== 6) return;
    const pts = [
      [v[0]!, v[1]!],
      [v[2]!, v[3]!],
      [v[4]!, v[5]!],
    ];
    const ys = pts.map((q) => q[1]!).sort((a, b) => a - b);
    const tipI = pts.findIndex((q) => q[1] === ys[1] && ys[0] !== ys[2]);
    if (tipI < 0) return;
    const tip = pts[tipI]!;
    const base = pts.filter((_, i) => i !== tipI);
    const pull = (b: number[]) => [b[0]! + (tip[0]! - b[0]!) * 0.3, b[1]!];
    const [b1, b2] = base.map(pull) as [number[], number[]];
    path.setAttribute(
      "d",
      `M${num(b1[0]!)} ${num(b1[1]!)}L${num(tip[0]!)} ${num(tip[1]!)}L${num(b2[0]!)} ${num(b2[1]!)}`,
    );
    const vb = (m.getAttribute("viewBox") ?? "").split(/[\s,]+/).map(Number);
    const mw = Number(m.getAttribute("markerWidth")) || 10;
    const k = vb.length === 4 && vb[2] ? vb[2] / mw : 1;
    path.setAttribute(
      "style",
      `fill:none;stroke:${c.edge};stroke-width:${num(1.25 * k)};stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none`,
    );
  });

  // Identifiers are code: Favorit Mono, inside any label.
  const IDENT =
    /^(?:[A-Z][a-z0-9]+[A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*(?:_[a-z0-9]+)+|[a-z]+[A-Z][A-Za-z0-9]*|"[^"\s]*"|[A-Z]+(?:-[A-Z]+)+)$/;
  // HTTP paths (/weather) count as code in sequence messages only.
  const PATH = /^\/[a-z][\w-]*(?:\/[\w-]+)*$/;
  const monoize = (t: Element, paths = false) => {
    const s = t.textContent ?? "";
    const m = /^(\s*)(.*?)([,;:.]*)$/.exec(s);
    if (!m || !(IDENT.test(m[2]!) || (paths && PATH.test(m[2]!)))) return;
    t.textContent = "";
    if (m[1]) t.appendChild(document.createTextNode(m[1]));
    const code = mk("tspan", {
      "font-family": o.mono,
      style: `font-family:${o.mono}`,
    });
    code.textContent = m[2]!;
    t.appendChild(code);
    if (m[3]) t.appendChild(document.createTextNode(m[3]));
  };

  // 2. Node labels.
  type Box = {
    el: SVGGElement;
    shape: SVGGraphicsElement;
    isBox: boolean;
    cx: number;
    cy: number;
    w: number;
    h: number;
    id: string;
  };
  const nodes: Box[] = [];
  svg.querySelectorAll("g.node").forEach((nodeEl) => {
    const node = nodeEl as SVGGElement;
    const text = node.querySelector("g.label text");
    const rows = text
      ? Array.from(text.querySelectorAll("tspan.text-outer-tspan"))
      : [];
    let end = rows.findIndex((r) => (r.textContent ?? "").includes(titleEnd));
    const hasDesc = end >= 0 && end < rows.length - 1;
    if (end < 0) end = rows.length - 1;
    const rect = node.querySelector(
      ":scope > rect.label-container",
    ) as SVGRectElement | null;
    const isBox = !!rect;
    const em = (v: string | null) =>
      v && /em$/.test(v)
        ? Number.parseFloat(v) * 13
        : Number.parseFloat(v ?? "0") || 0;
    rows.forEach((row, i) => {
      const title = i <= end;
      const extra = hasDesc ? (title ? -1.5 : 1.5) : 0;
      row.setAttribute("y", `${num(em(row.getAttribute("y")) + extra)}px`);
      row.setAttribute("dy", `${num(em(row.getAttribute("dy")))}px`);
      row.querySelectorAll("tspan.text-inner-tspan").forEach((t) => {
        if (t.textContent?.includes(titleEnd))
          t.textContent = t.textContent.split(titleEnd).join("");
        t.setAttribute("font-weight", title && isBox ? "500" : "normal");
        monoize(t);
      });
      if (!title && hasDesc) {
        row.setAttribute("fill", c.ink2);
        row.setAttribute("style", `fill:${c.ink2};font-size:12px`);
      } else row.setAttribute("style", `fill:${c.ink}`);
    });
    const m = /translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/.exec(
      node.getAttribute("transform") ?? "",
    );
    const shape = (rect ??
      node.querySelector(
        ":scope > polygon, :scope > g > polygon, :scope > circle, :scope > path",
      )) as SVGGraphicsElement | null;
    if (!m || !shape) return;
    const b = shape.getBBox();
    const tr = /translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/.exec(
      shape.getAttribute("transform") ?? "",
    );
    const sx = tr ? Number(tr[1]) : 0,
      sy = tr ? Number(tr[2]) : 0;
    nodes.push({
      el: node,
      shape,
      isBox,
      cx: Number(m[1]) + sx + b.x + b.width / 2,
      cy: Number(m[2]) + sy + b.y + b.height / 2,
      w: b.width,
      h: b.height,
      id: (node.id || "")
        .replace(`${sid}-`, "")
        .replace(/^flowchart-/, "")
        .replace(/-\d+$/, ""),
    });
  });
  const labelOf = (n: Box) =>
    n.el.querySelector(":scope > g.label") as SVGGElement | null;
  const setBox = (n: Box) => {
    // Redraw the box rect and move the node so its centre is (cx, cy).
    const rect = n.shape as SVGRectElement;
    n.el.setAttribute("transform", `translate(${num(n.cx)}, ${num(n.cy)})`);
    if (!n.isBox) return;
    rect.setAttribute("x", num(-n.w / 2));
    rect.setAttribute("y", num(-n.h / 2));
    rect.setAttribute("width", num(n.w));
    rect.setAttribute("height", num(n.h));
    // Label: left 14px in, top 14px down.
    const label = labelOf(n);
    const text = label?.querySelector("text");
    if (!label || !text) return;
    const rows = Array.from(text.querySelectorAll("tspan.text-outer-tspan"));
    label.setAttribute("transform", "translate(0, 0)");
    text.setAttribute(
      "style",
      `${text.getAttribute("style") ?? ""};text-anchor:start`,
    );
    text.setAttribute("text-anchor", "start");
    rows.forEach((row) => row.setAttribute("x", num(-n.w / 2 + 14)));
    const tb = (text as SVGTextElement).getBBox();
    label.setAttribute(
      "transform",
      `translate(0, ${num(-n.h / 2 + 13 - tb.y)})`,
    );
  };

  if (o.flow === "TD" && nodes.length) {
    // Equal widths: the widest label (after mono) + 14px a side.
    const textW = (n: Box) => {
      const t = labelOf(n)?.querySelector("text") as SVGTextElement | null;
      return t ? t.getBBox().width : 0;
    };
    const boxes = nodes.filter((n) => n.isBox);
    const W = Math.ceil(Math.max(...boxes.map((n) => textW(n) + 28), 0));
    // Ranks: nodes sharing a centre line.
    const ranks: Box[][] = [];
    for (const n of [...nodes].sort((a, b) => a.cy - b.cy)) {
      const r = ranks.find((k) => Math.abs(k[0]!.cy - n.cy) < 3);
      if (r) r.push(n);
      else ranks.push([n]);
    }
    // One width for every box when the widest rank still fits the 688px
    // column; otherwise one width per rank.
    const span = (r: Box[], w: (n: Box) => number) =>
      r.reduce((a, n) => a + (n.isBox ? w(n) : n.w), 0) + 32 * (r.length - 1);
    const global = ranks.every((r) => span(r, () => W) <= 672);
    for (const r of ranks) {
      const H = Math.max(...r.filter((n) => n.isBox).map((n) => n.h), 0);
      const RW = global
        ? W
        : Math.ceil(
            Math.max(...r.filter((n) => n.isBox).map((n) => textW(n) + 28), 0),
          );
      for (const n of r) if (n.isBox) n.w = RW;
      // Same height per rank, tops aligned.
      const top = Math.min(...r.map((n) => n.cy - n.h / 2));
      for (const n of r)
        if (n.isBox) {
          n.h = H;
          n.cy = top + H / 2;
        }
      // Re-space left to right, 32px apart, around the old centre.
      r.sort((a, b) => a.cx - b.cx);
      const old = r.map((n) => n.cx);
      let right = -Infinity;
      for (const n of r) {
        n.cx = Math.max(n.cx, right + 32 + n.w / 2);
        right = n.cx + n.w / 2;
      }
      const shift = r.reduce((a, n, i) => a + n.cx - old[i]!, 0) / r.length;
      for (const n of r) n.cx -= shift;
    }
    nodes.forEach(setBox);
  } else nodes.filter((n) => n.isBox).forEach((n) => setBox(n));

  // 3. Edges.
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const ends = (eid: string): [Box, Box] | undefined => {
    const core = eid.replace(/^L_/, "").replace(/_\d+$/, "");
    const parts = core.split("_");
    for (let i = 1; i < parts.length; i++) {
      const a = byId.get(parts.slice(0, i).join("_"));
      const b = byId.get(parts.slice(i).join("_"));
      if (a && b) return [a, b];
    }
    return undefined;
  };
  const box = (n: Box) => ({
    l: n.cx - n.w / 2,
    r: n.cx + n.w / 2,
    t: n.cy - n.h / 2,
    b: n.cy + n.h / 2,
  });
  const hits = (pts: number[][], skip: Box[]) =>
    nodes.some((n) => {
      if (skip.includes(n)) return false;
      const q = box(n);
      for (let i = 0; i + 1 < pts.length; i++) {
        const [x1, y1] = pts[i]!,
          [x2, y2] = pts[i + 1]!;
        const lo = (a: number, b: number) => Math.min(a, b),
          hi = (a: number, b: number) => Math.max(a, b);
        if (
          hi(x1!, x2!) > q.l - 4 &&
          lo(x1!, x2!) < q.r + 4 &&
          hi(y1!, y2!) > q.t - 4 &&
          lo(y1!, y2!) < q.b + 4
        )
          return true;
      }
      return false;
    });
  const roundPath = (P: number[][]) => {
    let out = `M${num(P[0]![0]!)} ${num(P[0]![1]!)}`;
    for (let i = 1; i < P.length; i++) {
      const [x, y] = P[i] as [number, number];
      const next = P[i + 1];
      if (!next) {
        out += `L${num(x)} ${num(y)}`;
        break;
      }
      const [px, py] = P[i - 1] as [number, number];
      const r = Math.min(
        8,
        Math.hypot(x - px, y - py) / 2,
        Math.hypot(next[0]! - x, next[1]! - y) / 2,
      );
      const l1 = Math.hypot(x - px, y - py) || 1,
        l2 = Math.hypot(next[0]! - x, next[1]! - y) || 1;
      out += `L${num(x - ((x - px) / l1) * r)} ${num(y - ((y - py) / l1) * r)}Q${num(x)} ${num(y)} ${num(x + ((next[0]! - x) / l2) * r)} ${num(y + ((next[1]! - y) / l2) * r)}`;
    }
    return out;
  };
  const labels = new Map<string, string>();
  svg.querySelectorAll("g.edgeLabel g.label[data-id]").forEach((l) => {
    const t = (l.textContent ?? "")
      .replace(new RegExp(titleEnd, "g"), "")
      .trim();
    if (t) labels.set(l.getAttribute("data-id")!, t);
  });
  const placed: {
    x: number;
    y: number;
    t: string;
    anchor: string;
    accent: boolean;
  }[] = [];
  const rerouted = new Set<string>();
  const exits = new Map<Box, number[]>();
  svg.querySelectorAll("path.flowchart-link").forEach((pe) => {
    const p = pe as SVGPathElement;
    const eid = p.getAttribute("data-id") ?? "";
    const pair = o.flow ? ends(eid) : undefined;
    const dashed = /dotted|dashed/.test(p.getAttribute("class") ?? "");
    if (dashed) p.style.strokeDasharray = "4 4";
    let pts: number[][] | undefined;
    let labelY: number | undefined;
    if (pair && pair[0] !== pair[1]) {
      const [S, T] = pair;
      const s = box(S),
        t = box(T);
      if (t.t >= s.b - 1) {
        // Down.
        const ov = (x: number, q: { l: number; r: number }) =>
          x >= q.l + 16 && x <= q.r - 16;
        const tx = T.cx,
          sx = S.cx;
        const ym = s.b + Math.min(24, (t.t - s.b) / 2);
        // A straight drop, if one fits both boxes and keeps 24px from the
        // source's other exits.
        const used = exits.get(S) ?? [];
        const free = (x: number) => used.every((u) => Math.abs(u - x) >= 24);
        const straight = [tx, sx, tx + 32, tx - 32, sx + 32, sx - 32].find(
          (x) =>
            (Math.abs(x - tx) < 1 && Math.abs(x - sx) < 1 && free(x)) ||
            (S.isBox && T.isBox && ov(x, s) && ov(x, t) && free(x)),
        );
        if (Math.abs(tx - sx) < 1 && !free(sx) && straight === undefined)
          pts = [
            [sx, s.b],
            [sx, t.t],
          ];
        else if (straight !== undefined)
          pts = [
            [straight, s.b],
            [straight, t.t],
          ];
        else
          pts = [
            [sx, s.b],
            [sx, ym],
            [tx, ym],
            [tx, t.t],
          ];
        labelY = (ym + t.t) / 2;
      } else if (t.l >= s.r - 1) {
        // Right.
        const ty = T.cy,
          sy = S.cy;
        if (Math.abs(ty - sy) < 1)
          pts = [
            [s.r, sy],
            [t.l, sy],
          ];
        else {
          const xm = s.r + Math.min(24, (t.l - s.r) / 2);
          pts = [
            [s.r, sy],
            [xm, sy],
            [xm, ty],
            [t.l, ty],
          ];
        }
      }
      if (pts && hits(pts, [S, T])) pts = undefined;
      if (pts) exits.set(S, [...(exits.get(S) ?? []), pts[0]![0]!]);
    }
    const focal = false; // the accent is the focal node's, not its edges'
    if (pts) {
      p.setAttribute("d", roundPath(pts));
      p.setAttribute(
        "marker-end",
        `url(#${sid}-sol-head${focal ? "-accent" : ""})`,
      );
      p.removeAttribute("marker-start");
      rerouted.add(eid);
      const t = labels.get(eid);
      if (t) {
        const [a, b] = [pts[pts.length - 2]!, pts[pts.length - 1]!];
        if (a[0] === b[0])
          placed.push({
            x: a[0]! + 8,
            y: labelY ?? (a[1]! + b[1]!) / 2,
            t,
            anchor: "start",
            accent: focal,
          });
        else
          placed.push({
            x: (a[0]! + b[0]!) / 2,
            y: a[1]! - 14,
            t,
            anchor: "middle",
            accent: focal,
          });
      }
      return;
    }
    // Kept path: round mermaid's step corners to 8px.
    const d = p.getAttribute("d") ?? "";
    if (/[CQSA]/i.test(d)) return;
    const v = (d.match(/-?\d*\.?\d+(e-?\d+)?/g) ?? []).map(Number);
    const raw: number[][] = [];
    for (let i = 0; i + 1 < v.length; i += 2) {
      const q = [v[i]!, v[i + 1]!];
      const last = raw[raw.length - 1];
      if (!last || Math.hypot(q[0]! - last[0]!, q[1]! - last[1]!) > 0.5)
        raw.push(q);
    }
    const P = raw.filter((q, i) => {
      if (i === 0 || i === raw.length - 1) return true;
      const a = raw[i - 1]!,
        b = raw[i + 1]!;
      return !(
        (Math.abs(a[0]! - q[0]!) < 0.5 && Math.abs(b[0]! - q[0]!) < 0.5) ||
        (Math.abs(a[1]! - q[1]!) < 0.5 && Math.abs(b[1]! - q[1]!) < 0.5)
      );
    });
    if (P.length >= 2) p.setAttribute("d", roundPath(P));
  });
  // Edge labels: ours replace mermaid's (which sat on the line, knocked out).
  svg.querySelectorAll("g.edgeLabel").forEach((g) => {
    const l = g.querySelector("g.label[data-id]");
    const eid = l?.getAttribute("data-id") ?? "";
    if (rerouted.has(eid)) {
      g.remove();
      return;
    }
    // A label left on mermaid's own path sits on the line: keep it legible
    // on a page-colour plate there.
    g.querySelectorAll("rect").forEach((r) =>
      r.setAttribute("style", `fill:${c.page};stroke:none;opacity:1`),
    );
    g.querySelectorAll("tspan.text-inner-tspan").forEach((t) => monoize(t));
  });
  if (placed.length) {
    const layer = mk("g", { class: "sol-edge-labels" });
    for (const q of placed) {
      const t = mk("text", {
        x: num(q.x),
        y: num(q.y + 4.2),
        "text-anchor": q.anchor,
        "font-size": "12",
        fill: q.accent ? c.accent : c.ink2,
        style: `font-size:12px;fill:${q.accent ? c.accent : c.ink2}`,
      });
      for (const [i, w] of q.t.split(/(\s+)/).entries()) {
        const s = mk("tspan", { class: "text-inner-tspan" });
        s.textContent = w;
        t.appendChild(s);
        if (i >= 0) monoize(s);
      }
      layer.appendChild(t);
    }
    svg.appendChild(layer);
  }

  // 4. Sequence diagrams.
  if (svg.getAttribute("aria-roledescription") === "sequence") {
    // Message labels: start at the tail of their arrow, 8px in.
    let group: SVGTextElement[] = [];
    for (const el of Array.from(
      svg.querySelectorAll(
        "text.messageText, line[class^='messageLine'], path[class^='messageLine']",
      ),
    )) {
      if (el.tagName === "text") {
        group.push(el as SVGTextElement);
        continue;
      }
      if (el.tagName !== "line" || !group.length) {
        group = [];
        continue;
      }
      const x1 = Number(el.getAttribute("x1")),
        x2 = Number(el.getAttribute("x2"));
      const rtl = x2 < x1;
      const text = group
        .map((t) => t.textContent ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      const isFocal = !!o.focal && text === o.focal.trim();
      for (const t of group) {
        t.setAttribute("x", num(rtl ? x1 - 8 : x1 + 8));
        t.setAttribute("text-anchor", rtl ? "end" : "start");
        t.style.textAnchor = rtl ? "end" : "start";
        t.style.fontSize = "13px";
        t.querySelectorAll("tspan").forEach((s) =>
          s.setAttribute("x", num(rtl ? x1 - 8 : x1 + 8)),
        );
        if (isFocal) t.style.fill = c.accent;
      }
      if (isFocal) {
        (el as SVGElement).style.stroke = c.accent;
        el.setAttribute("marker-end", `url(#${sid}-sol-head-accent)`);
      }
      group = [];
    }
    // Notes: left-aligned, 12px, 12px in from the note's edge.
    svg.querySelectorAll("rect.note").forEach((r) => {
      const x = Number(r.getAttribute("x"));
      // Unwrapped notes can be wider than their box: grow the box.
      let widest = 0;
      for (
        let k = r.nextElementSibling;
        k && k.tagName === "text" && k.classList.contains("noteText");
        k = k.nextElementSibling
      ) {
        (k as SVGTextElement).style.fontSize = "12px";
        widest = Math.max(
          widest,
          (k as SVGTextElement).getComputedTextLength(),
        );
      }
      if (widest + 24 > Number(r.getAttribute("width")))
        r.setAttribute("width", num(widest + 24));
      let n = r.nextElementSibling;
      while (n && n.tagName === "text" && n.classList.contains("noteText")) {
        n.setAttribute("x", num(x + 12));
        n.setAttribute("text-anchor", "start");
        (n as SVGTextElement).style.textAnchor = "start";
        (n as SVGTextElement).style.fontSize = "12px";
        n.querySelectorAll("tspan").forEach((s) =>
          s.setAttribute("x", num(x + 12)),
        );
        n = n.nextElementSibling;
      }
    });
    svg.querySelectorAll("text.messageText").forEach((t) => {
      const leaves = t.children.length
        ? Array.from(t.querySelectorAll("tspan")).filter(
            (k) => !k.children.length,
          )
        : [t];
      for (const leaf of leaves) {
        const words = (leaf.textContent ?? "").split(/(\s+)/);
        leaf.textContent = "";
        for (const w of words) {
          const k = mk("tspan", {});
          k.textContent = w;
          leaf.appendChild(k);
          monoize(k, true);
        }
      }
    });
  }

  // Any stray markers left in the text.
  svg.querySelectorAll("tspan").forEach((t) => {
    if (t.childElementCount === 0 && t.textContent?.includes(titleEnd))
      t.textContent = t.textContent.split(titleEnd).join("");
  });
  const out = new XMLSerializer().serializeToString(svg);
  host.remove();
  return out;
}

/**
 * Give the SVG its natural pixel size (from the viewBox) instead of
 * width="100%": styles/diagrams.css shows it at that size, so every label is
 * the same 13px whatever the diagram's width, and wide diagrams scroll
 * sideways rather than shrinking.
 */
export function sizeSvg(svg: string): string {
  svg = svg.replace(/^(<svg\b[^>]*?)\swidth="\d+" height="\d+"/, "$1");
  const vb = svg.match(/viewBox="([^"]+)"/);
  if (!vb) return svg;
  const [, , w, h] = vb[1]!
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (!w || !h) return svg;
  // Up to about 870px the figure is fitted to the 688px column (labels stay
  // at 10.3px or more); wider ones are drawn at 12px and scroll sideways.
  const k = w <= 870 ? Math.min(1, 688 / w) : 12 / 13;
  return svg.replace(/<svg\b[^>]*>/, (tag) =>
    tag
      .replace(/\swidth="[^"]*"/, "")
      .replace(/\sheight="[^"]*"/, "")
      .replace(/\sstyle="max-width:[^"]*"/, "")
      .replace(
        /^<svg/,
        `<svg width="${Math.ceil(w * k)}" height="${Math.ceil(h * k)}"`,
      ),
  );
}

/** Every mermaid source in the docs, by hash, with one file that uses it. */
export function collectSources(): Map<
  string,
  { source: string; file: string }
> {
  const out = new Map<string, { source: string; file: string }>();
  for (const abs of listContentPages(docsRoot)) {
    const text = readFileSync(abs, "utf8");
    if (!text.includes("```mermaid")) continue;
    const { tree } = mdxCodec.parse(text, { path: abs });
    const walk = (n: AstNode) => {
      if (n.type === "code" && (n as { lang?: string }).lang === "mermaid") {
        const source = String(n.value ?? "");
        const h = mermaidHash(source);
        if (!out.has(h))
          out.set(h, { source, file: path.relative(docsRoot, abs) });
      }
      for (const k of n.children ?? []) walk(k);
    };
    walk(tree);
  }
  return out;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const check = args.has("--check");
  const force = args.has("--force");
  const sources = collectSources();
  mkdirSync(outDir, { recursive: true });
  const want = new Set<string>();
  const variants = (h: string) =>
    hasPhoneVariant(sources.get(h)!.source) ? ["", "-sm"] : [""];
  const files = (h: string) =>
    variants(h).flatMap((v) => [`${h}${v}-light.svg`, `${h}${v}.svg`]);
  for (const h of sources.keys()) for (const f of files(h)) want.add(f);
  const have = new Set(readdirSync(outDir).filter((f) => f.endsWith(".svg")));
  const missing = [...sources.keys()].filter(
    (h) => force || files(h).some((f) => !have.has(f)),
  );
  const orphans = [...have].filter((f) => !want.has(f));
  if (check) {
    for (const h of missing)
      console.log(
        `missing: mermaid/${h}{-light,}.svg (${sources.get(h)!.file})`,
      );
    for (const f of orphans) console.log(`orphan: mermaid/${f}`);
    console.log(
      `render-mermaid --check: ${sources.size} diagrams, ${missing.length} missing, ${orphans.length} orphaned`,
    );
    process.exit(missing.length || orphans.length ? 1 : 0);
  }
  for (const f of orphans) rmSync(path.join(outDir, f));
  if (missing.length) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const face = (w: string, f: string) =>
      `@font-face{font-family:"Diatype";font-weight:${w};src:url("file://${path.join(fontsRoot, "diatype", f)}") format("woff2")}`;
    // A file:// page, so the file:// fonts load (about:blank may not read
    // them, and mermaid would measure labels in a fallback face).
    const probe = path.join(tmpdir(), `render-mermaid-${process.pid}.html`);
    const mono = `@font-face{font-family:"ABC Favorit Mono";src:url("file://${path.join(fontsRoot, "abcmono", "ABCFavoritMonoVariable-Regular.woff2")}") format("woff2")}`;
    writeFileSync(
      probe,
      `<!doctype html><html><head><style>${face("400", "ABCDiatype-Regular.woff2")}${face("500 700", "ABCDiatype-Medium.woff2")}${mono}body{font-family:${FONT}}</style></head><body><div id="probe">Diatype <b>Diatype</b> <span style="font-family:'ABC Favorit Mono'">mono</span></div></body></html>`,
    );
    await page.goto(`file://${probe}`);
    await page.addScriptTag({ path: mermaidJs });
    await page.evaluate(() => document.fonts.ready);
    // tsx (esbuild) wraps named functions in __name(); define it in the page
    // so postProcess.toString() runs there.
    await page.evaluate("window.__name = (f) => f");
    let failed = 0;
    for (const h of missing) {
      const { source, file } = sources.get(h)!;
      for (const v of variants(h))
        for (const mode of ["light", "dark"] as const) {
          const phone = v === "-sm";
          const name = mode === "light" ? `${h}${v}-light.svg` : `${h}${v}.svg`;
          if (phone) {
            // The phone drawing is our own top-to-bottom layout.
            const svg: string = await page.evaluate(
              ({ fn, src, c, o }) =>
                // eslint-disable-next-line no-new-func
                new Function(`return (${fn})`)()(src, c, o),
              {
                fn: drawPhone.toString(),
                src: source,
                c: SYS[mode],
                o: {
                  sans: FONT,
                  mono: MONO,
                  focal: focalMessage(source),
                  width: PHONE_WIDTH,
                },
              },
            );
            writeFileSync(path.join(outDir, name), svg);
            continue;
          }
          let res: { svg?: string; error?: string } = await page.evaluate(
            async ({ id, src, cfg }) => {
              const m = (
                window as unknown as {
                  mermaid: {
                    initialize(c: unknown): void;
                    render(id: string, s: string): Promise<{ svg: string }>;
                  };
                }
              ).mermaid;
              try {
                m.initialize(cfg);
                return { svg: (await m.render(id, src)).svg };
              } catch (e) {
                document
                  .querySelectorAll(`#d${id}, #${id}`)
                  .forEach((n) => n.remove());
                return { error: String((e as Error)?.message ?? e) };
              }
            },
            {
              id: `m${h}`,
              src: prepare(source, mode),
              cfg: config(mode),
            },
          );
          // Mermaid's wrap mode fails on a few sources (notes with <br>);
          // draw those unwrapped.
          if ("error" in res) {
            const cfg = config(mode);
            res = await page.evaluate(
              async ({ id, src, cfg }) => {
                const m = (
                  window as unknown as {
                    mermaid: {
                      initialize(c: unknown): void;
                      render(id: string, s: string): Promise<{ svg: string }>;
                    };
                  }
                ).mermaid;
                try {
                  m.initialize(cfg);
                  return { svg: (await m.render(id, src)).svg };
                } catch (e) {
                  document
                    .querySelectorAll(`#d${id}, #${id}`)
                    .forEach((n) => n.remove());
                  return { error: String((e as Error)?.message ?? e) };
                }
              },
              {
                id: `m${h}`,
                src: prepare(source, mode),
                cfg: { ...cfg, sequence: { ...cfg.sequence, wrap: false } },
              },
            );
          }
          if ("error" in res) {
            failed++;
            console.log(
              `error: ${file} (${h}, ${mode}): ${res.error!.split("\n")[0]}`,
            );
            break;
          }
          const styled: string = await page.evaluate(
            ({ fn, svg, c, end, o }) =>
              // eslint-disable-next-line no-new-func
              new Function(`return (${fn})`)()(svg, c, end, o),
            {
              fn: postProcess.toString(),
              svg: res.svg!,
              c: SYS[mode],
              end: TITLE_END,
              o: {
                mono: MONO,
                focal: focalMessage(source),
                flow: flowDirection(source),
              },
            },
          );
          // Crop the sides to the drawing (mermaid pads sequence diagrams by
          // 50px a side), 8px margin, so the figure is as small as its content.
          const cropped: string = await page.evaluate(
            ([svgText, flow]) => {
              const host = document.createElement("div");
              host.innerHTML = svgText;
              document.body.appendChild(host);
              const el = host.querySelector("svg") as SVGSVGElement;
              const b = el.getBBox();
              const r = (v: number) => Math.round(v * 100) / 100;
              // Sideways only: lifelines run past the drawing (y2=2000) and
              // mermaid's own viewBox already trims them vertically.
              const [, vy, , vh] = (el.getAttribute("viewBox") ?? "")
                .split(/[\s,]+/)
                .map(Number) as [number, number, number, number];
              // Flowcharts were re-laid out (postProcess), so fit both ways.
              if (flow) {
                el.setAttribute(
                  "viewBox",
                  `${r(b.x - 8)} ${r(b.y - 8)} ${r(b.width + 16)} ${r(b.height + 16)}`,
                );
              } else {
                const x0 = b.x - 8;
                const x1 = b.x + b.width + 8;
                el.setAttribute(
                  "viewBox",
                  `${r(x0)} ${r(vy)} ${r(x1 - x0)} ${r(vh)}`,
                );
              }
              const out = new XMLSerializer().serializeToString(el);
              host.remove();
              return out;
            },
            [styled, flowDirection(source) ?? ""] as const,
          );
          res = { svg: cropped };
          writeFileSync(
            path.join(outDir, name),
            `${sizeSvg(res.svg!.replace(/<br>/g, "<br/>"))}\n`,
          );
        }
    }
    await browser.close();
    rmSync(probe, { force: true });
    console.log(
      `render-mermaid: ${missing.length - failed} rendered, ${failed} failed, ${orphans.length} orphan(s) removed`,
    );
    if (failed) process.exitCode = 1;
  } else {
    console.log(
      `render-mermaid: ${sources.size} diagrams up to date, ${orphans.length} orphan(s) removed`,
    );
  }
}

if (existsSync(docsRoot) && process.argv[1]?.endsWith("render-mermaid.ts"))
  await main();
