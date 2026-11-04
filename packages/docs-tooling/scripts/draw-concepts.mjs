#!/usr/bin/env node
/**
 * Hand-authored concept diagrams (core concepts, transactions, PDAs, tokens,
 * payments), drawn in the docs illustration system. Each figure is laid out
 * by hand on an 8px grid in the 688px content column, so 13px labels are
 * 13px on the page, and is written once per mode:
 *
 *   node packages/docs-tooling/scripts/draw-concepts.mjs [--only name,...]
 *   python3 packages/docs-tooling/scripts/embed-diagram-fonts.py
 *
 * Writes <path>-light.svg (light) and <path>.svg (dark) under
 * apps/docs/public/docs-assets/assets/docs. The root carries data-sol-drawn="hand":
 * brand-diagrams.mjs and sync-diagram-themes.mjs leave these files alone.
 *
 * The system (AUTHORING.md "Diagrams (SVG)"; keep brand-diagrams.mjs and
 * render-mermaid.ts in step):
 * - Monochrome zinc, ONE accent (theme link purple) for the focal element.
 * - No fills beyond the surface colour, no gradients, shadows or glows.
 * - 1px box strokes, 1.25px connectors, 8px corners, one open-chevron head.
 * - Type: Diatype 13px/500 titles, left-aligned; 12px/400 labels. One rule:
 *   titles and field labels are names, always Diatype (even identifiers:
 *   MessageHeader, rent_epoch). Values, header tags and description lines
 *   follow isCode: code (u64, Pubkey, true, 5,000, "seed", 9fXw…k2Qe,
 *   findProgramAddress, (pda, bump)) in Favorit Mono 12px; words (System
 *   Program, fee payer, one or more) in Diatype 12px. No glyph arrows;
 *   phrases start with words, not numerals ("one instruction").
 * - Phones: SM holds a portrait drawing per core figure (<name>-sm*.svg,
 *   336px wide), shown below 640px by styles/diagrams.css.
 * - Edge labels: one placement. Beside the line, 8px off it: above a
 *   horizontal segment, after (right of) a vertical one. Never knocked out.
 * - Solid connector = acts on / owns; dashed = refers to / derives from.
 * - Transparent canvas (sits on the page).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../apps/docs/public/docs-assets/assets/docs",
);

export const PALETTE = {
  light: {
    page: "#ffffff",
    surface: "#ffffff",
    ink: "#18181b",
    ink2: "#52525b",
    ink3: "#71717a",
    line: "#d4d4d8",
    hair: "#e4e4e7",
    edge: "#8b8b94",
    accent: "#7a2fe0",
  },
  dark: {
    page: "#0a0a0b",
    surface: "#111113",
    ink: "#f2f2f3",
    ink2: "#a1a1aa",
    ink3: "#8b8b94",
    line: "#3f3f46",
    hair: "#27272a",
    edge: "#71717a",
    accent: "#b78aff",
  },
};
const SANS = "Diatype,Inter,ui-sans-serif,system-ui,sans-serif";
const MONO = "'ABC Favorit Mono',ui-monospace,SFMono-Regular,Menlo,monospace";
const W = 688;
const R = 8; // corner radius
const ROW = 32; // field row height
const HEAD = 40; // card header height
const HEAD_DESC = 60; // card header height with a description line
const GAP = 8; // edge label offset from its line
const SUBROW = 48; // field row with a second, muted line

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const n = (v) => String(Math.round(v * 100) / 100);

/**
 * The one value rule: is `v` code (a type name or a literal)? Code is set in
 * mono; everything else (human names, prose) in the sans.
 */
export function isCode(v) {
  const s = String(v);
  return (
    /^(u8|u16|u32|u64|u128|i64|bool|bytes|Hash|Epoch|Pubkey\??|compact-u16|true|false|null|n)$/.test(
      s,
    ) ||
    /^(Vec|Option)<.+>$/.test(s) ||
    /^[A-Z][a-z]+[A-Z]\w*$/.test(s) || // PascalCase type: AccountMeta
    /^[a-z]+[A-Z]\w*(\(.*\))?$/.test(s) || // camelCase call: findProgramAddress
    /^\d[\d,.]*$/.test(s) || // 5,000 · 126
    /^\(.*\)$/.test(s) || // tuple: (pda, bump)
    /^[a-z_]+ [−+×] \d+$/.test(s) || // expression: bump − 1
    /^[\d, …→]+$/.test(s) || // 255, 254, …
    /…/.test(s) || // shortened address 9fXw…k2Qe
    /^".*"|"$/.test(s) || // string literal
    /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s) // base58 address
  );
}

/** A drawing for one mode. */
class Pen {
  constructor(mode) {
    this.mode = mode;
    this.c = PALETTE[mode];
    this.back = []; // edges (drawn under cards)
    this.front = [];
  }

  text(x, y, s, o = {}) {
    const size = o.size ?? 12;
    const attrs = [
      `x="${n(x)}"`,
      `y="${n(y + size * 0.35)}"`,
      o.anchor && o.anchor !== "start" ? `text-anchor="${o.anchor}"` : "",
      o.mono ? `font-family="${MONO}"` : "",
      `font-size="${size}"`,
      o.weight ? `font-weight="${o.weight}"` : "",
      `fill="${o.fill ?? this.c.ink}"`,
    ].filter(Boolean);
    (o.layer ?? this.front).push(`<text ${attrs.join(" ")}>${esc(s)}</text>`);
  }

  /** A value: mono when it is code, sans otherwise (see isCode). */
  value(x, y, v, o = {}) {
    const code = o.code ?? isCode(v);
    this.text(x, y, v, { ...o, mono: code });
  }

  rect(x, y, w, h, o = {}) {
    const sw = o.sw ?? 1;
    const off = sw % 2 ? 0.5 : 0; // crisp 1px lines
    (o.layer ?? this.front).push(
      `<rect x="${n(x + off)}" y="${n(y + off)}" width="${n(w - 2 * off)}" height="${n(h - 2 * off)}" rx="${o.r ?? R}" fill="${o.fill ?? this.c.surface}" stroke="${o.stroke ?? this.c.line}" stroke-width="${sw}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`,
    );
  }

  hline(x1, x2, y, o = {}) {
    this.front.push(
      `<path d="M${n(x1)} ${n(y + 0.5)}H${n(x2)}" stroke="${o.stroke ?? this.c.hair}" stroke-width="1"/>`,
    );
  }

  vline(x, y1, y2, o = {}) {
    this.front.push(
      `<path d="M${n(x + 0.5)} ${n(y1)}V${n(y2)}" stroke="${o.stroke ?? this.c.hair}" stroke-width="1"/>`,
    );
  }

  /**
   * A card: left-aligned title (+ optional tag on the right, optional
   * description lines) and optional field rows [label, value, opts].
   * Titles and field labels are names: always Diatype, even when the name
   * is an identifier. Tags, descriptions and values follow isCode.
   * Row opts: {code} overrides isCode, {accent} colours the value, {note}
   * adds a muted middle column at `noteX`, {sub} a muted second line under
   * the label (the row grows to SUBROW). `minH` pads the card to a height
   * shared with its neighbours.
   */
  card({
    x,
    y,
    w,
    title,
    tag,
    desc,
    rows = [],
    accent,
    minH = 0,
    noteX = 0,
    dash,
  }) {
    const c = this.c;
    const lines = desc == null ? [] : [].concat(desc);
    const head = lines.length ? HEAD_DESC + (lines.length - 1) * 18 : HEAD;
    const rh = (r) => (r[2]?.sub ? SUBROW : ROW);
    const h = Math.max(minH, head + rows.reduce((a, r) => a + rh(r), 0));
    this.rect(x, y, w, h, {
      stroke: accent ? c.accent : c.line,
      sw: accent ? 1.25 : 1,
      dash,
    });
    const ty = lines.length ? y + 23 : y + head / 2;
    this.text(x + 16, ty, title, { size: 13, weight: 500 });
    // A call wrapped over several lines is still one piece of code.
    const code = isCode(
      lines.join("").replace(/\s+/g, " ").replace(/\( /, "("),
    );
    lines.forEach((l, i) =>
      this.value(x + 16, y + 41 + i * 18, l, { fill: c.ink2, code }),
    );
    if (tag)
      this.value(x + w - 16, ty, tag, {
        fill: accent ? c.accent : c.ink3,
        anchor: "end",
      });
    const out = { x, y, w, h, head, rows: [] };
    const inset = accent ? 1.25 : 1;
    let ry = y + head;
    rows.forEach((r) => {
      const [label, value, o = {}] = r;
      const hh = rh(r);
      const ly = o.sub ? ry + 16 : ry + hh / 2;
      this.hline(x + inset, x + w - inset, ry);
      if (o.index != null)
        this.text(x + 16, ly, String(o.index), { mono: true, fill: c.ink3 });
      const lx = x + (o.index != null ? 40 : 16);
      this.text(lx, ly, label, { fill: c.ink2 });
      if (o.sub) this.text(lx, ry + 34, o.sub, { fill: c.ink3 });
      if (o.note) this.text(x + noteX, ly, o.note, { fill: c.ink3 });
      if (value != null)
        this.value(x + w - 16, ly, value, {
          anchor: "end",
          code: o.code,
          fill: o.accent ? c.accent : c.ink,
        });
      out.rows.push({ y: ly, top: ry, bottom: ry + hh });
      ry += hh;
    });
    out.cx = x + w / 2;
    out.cy = y + h / 2;
    out.right = x + w;
    out.bottom = y + h;
    out.headY = ty;
    return out;
  }

  /**
   * A byte strip: one outline, hairline dividers, a field name and a size
   * per cell. One cell may carry the accent (outline drawn flush on it).
   */
  strip({ x, y, h = 56, cells }) {
    const c = this.c;
    const w = cells.reduce((a, k) => a + k.w, 0);
    this.rect(x, y, w, h);
    let cx = x;
    const out = { x, y, w, h, right: x + w, bottom: y + h, cells: [] };
    cells.forEach((k, i) => {
      if (i) this.vline(cx, y + 1, y + h - 1, { stroke: c.line });
      this.text(cx + 12, k.sub ? y + 21 : y + h / 2, k.title, {
        size: 13,
        weight: 500,
        fill: k.dim ? c.ink3 : c.ink,
      });
      if (k.sub)
        this.value(cx + 12, y + 39, k.sub, { fill: k.dim ? c.ink3 : c.ink2 });
      out.cells.push({ x: cx, w: k.w, cx: cx + k.w / 2, right: cx + k.w });
      cx += k.w;
    });
    cells.forEach((k, i) => {
      if (!k.accent) return;
      const cell = out.cells[i];
      const first = i === 0,
        last = i === cells.length - 1;
      const x1 = cell.x,
        x2 = cell.right;
      const r = R;
      const d = [
        `M${n(x1 + (first ? r : 0))} ${n(y + 0.625)}`,
        `H${n(x2 - (last ? r : 0))}`,
        last
          ? `Q${n(x2 - 0.625)} ${n(y + 0.625)} ${n(x2 - 0.625)} ${n(y + r)}`
          : "",
        `V${n(y + h - (last ? r : 0))}`,
        last
          ? `Q${n(x2 - 0.625)} ${n(y + h - 0.625)} ${n(x2 - r)} ${n(y + h - 0.625)}`
          : "",
        `H${n(x1 + (first ? r : 0))}`,
        first
          ? `Q${n(x1 + 0.625)} ${n(y + h - 0.625)} ${n(x1 + 0.625)} ${n(y + h - r)}`
          : "",
        `V${n(y + (first ? r : 0))}`,
        first
          ? `Q${n(x1 + 0.625)} ${n(y + 0.625)} ${n(x1 + r)} ${n(y + 0.625)}`
          : "",
        "Z",
      ].join("");
      this.front.push(
        `<path d="${d}" fill="none" stroke="${c.accent}" stroke-width="1.25"/>`,
      );
    });
    return out;
  }

  /**
   * A span: hairline bracket (line with end ticks) marking a range, label
   * 8px beside it. Horizontal (x1..x2 at y, label above unless `below`) or
   * vertical (y1..y2 at x, label after).
   */
  span({ x1, x2, y, y1, y2, x, label, labelX, labelY, below, accent }) {
    const col = accent ? this.c.accent : this.c.edge;
    const fill = accent ? this.c.accent : this.c.ink2;
    if (y1 != null) {
      this.front.push(
        `<path d="M${n(x - 4)} ${n(y1 + 0.5)}H${n(x + 0.5)}V${n(y2 - 0.5)}H${n(x - 4)}" fill="none" stroke="${col}" stroke-width="1"/>`,
      );
      if (label)
        this.text(labelX ?? x + GAP, labelY ?? (y1 + y2) / 2, label, {
          fill,
        });
      return;
    }
    const t = below ? 4 : -4;
    this.front.push(
      `<path d="M${n(x1 + 0.5)} ${n(y + t)}V${n(y + 0.5)}H${n(x2 - 0.5)}V${n(y + t)}" fill="none" stroke="${col}" stroke-width="1"/>`,
    );
    this.text(x1, below ? y + GAP + 8 : y - GAP - 6, label, { fill });
  }

  /**
   * Connector through orthogonal points, corners rounded to 8px, open
   * chevron head at the end (and start if `both`). `label` sits beside
   * segment `seg` (default: the longest), 8px off the line: above a
   * horizontal segment, after a vertical one (`side: "before"` flips it).
   */
  edge(pts, o = {}) {
    const c = this.c;
    const stroke = o.accent ? c.accent : c.edge;
    let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
    for (let i = 1; i < pts.length; i++) {
      const [x, y] = pts[i];
      const next = pts[i + 1];
      if (!next) {
        d += `L${n(x)} ${n(y)}`;
        break;
      }
      const [px, py] = pts[i - 1];
      const r = Math.min(
        o.r ?? 8,
        Math.hypot(x - px, y - py) / 2,
        Math.hypot(next[0] - x, next[1] - y) / 2,
      );
      const ux = Math.sign(x - px),
        uy = Math.sign(y - py);
      const vx = Math.sign(next[0] - x),
        vy = Math.sign(next[1] - y);
      d += `L${n(x - ux * r)} ${n(y - uy * r)}Q${n(x)} ${n(y)} ${n(x + vx * r)} ${n(y + vy * r)}`;
    }
    const id = o.accent ? "ha" : "hn";
    this.back.push(
      `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"${o.dashed ? ' stroke-dasharray="4 4"' : ""}${o.head === false ? "" : ` marker-end="url(#${id})"`}${o.both ? ` marker-start="url(#${id})"` : ""}/>`,
    );
    if (o.label) {
      let seg = o.seg;
      if (seg == null) {
        let best = -1;
        for (let i = 0; i < pts.length - 1; i++) {
          const len = Math.hypot(
            pts[i + 1][0] - pts[i][0],
            pts[i + 1][1] - pts[i][1],
          );
          if (len > best) {
            best = len;
            seg = i;
          }
        }
      }
      const [a, b] = [pts[seg], pts[seg + 1]];
      const fill = o.accent ? c.accent : c.ink2;
      if (a[1] === b[1]) {
        this.text((a[0] + b[0]) / 2, a[1] - GAP - 6, o.label, {
          anchor: "middle",
          fill,
        });
      } else {
        const before = o.side === "before";
        this.text(a[0] + (before ? -GAP : GAP), (a[1] + b[1]) / 2, o.label, {
          anchor: before ? "end" : "start",
          fill,
        });
      }
    }
  }

  /** Large operator glyph (+, =) between cards. */
  op(x, y, s) {
    this.text(x, y, s, { size: 16, anchor: "middle", fill: this.c.ink3 });
  }

  /** A curve (the Ed25519 sketch): a thin neutral line, no head. */
  curve(d) {
    this.back.push(
      `<path d="${d}" fill="none" stroke="${this.c.edge}" stroke-width="1.25" stroke-linecap="round"/>`,
    );
  }

  dot(x, y, o = {}) {
    this.front.push(
      `<circle cx="${n(x)}" cy="${n(y)}" r="4" fill="${this.c.page}" stroke="${o.accent ? this.c.accent : this.c.ink2}" stroke-width="1.25"/>`,
    );
  }

  svg(w, h, label) {
    const c = this.c;
    const head = (id, col) =>
      `<marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M3 1.5L8.5 5L3 8.5" fill="none" stroke="${col}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></marker>`;
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" data-sol-drawn="hand" data-sol-type="1" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}" font-family="${SANS}">`,
      `<defs>${head("hn", c.edge)}${head("ha", c.accent)}</defs>`,
      ...this.back,
      ...this.front,
      `</svg>`,
      "",
    ].join("\n");
  }
}

/* ------------------------------------------------------------- figures */

/**
 * Account + owner + account data, the pattern behind the program, mint,
 * token and wallet account figures. The owner field points straight at the
 * owner; the data field (dashed) at the decoded account data, if any.
 */
function ownedAccount(
  p,
  {
    name,
    tag,
    owner,
    ownerTag,
    executable,
    lamports = "u64",
    dataValue = "bytes",
    data,
    dataTag = "account data",
    fields,
    label,
  },
) {
  const acct = p.card({
    x: 24,
    y: 24,
    w: 304,
    title: name,
    tag,
    accent: true,
    rows: [
      ["owner", owner],
      ["executable", executable],
      ["lamports", lamports],
      ["data", dataValue],
    ],
  });
  const prog = p.card({
    x: 416,
    y: acct.rows[0].y - HEAD / 2,
    w: 248,
    title: owner,
    tag: ownerTag,
  });
  p.edge(
    [
      [acct.right, acct.rows[0].y],
      [prog.x, acct.rows[0].y],
    ],
    { label: "owner" },
  );
  let bottom = Math.max(acct.bottom, prog.bottom);
  if (data) {
    const dataCard = p.card({
      x: 416,
      y: Math.max(prog.bottom + 24, acct.rows[3].y - HEAD / 2),
      w: 248,
      title: data,
      tag: dataTag,
      rows: fields,
    });
    const dy = dataCard.headY;
    p.edge(
      [
        [acct.right, acct.rows[3].y],
        [372, acct.rows[3].y],
        [372, dy],
        [dataCard.x, dy],
      ],
      { dashed: true },
    );
    bottom = Math.max(bottom, dataCard.bottom);
  }
  return [W, bottom + 24, label];
}

function programAccount(p, name, label) {
  return ownedAccount(p, {
    name,
    tag: "program account",
    owner: "BPF Loader",
    ownerTag: "loader",
    executable: "true",
    data: "Program code",
    fields: [["format", "sBPF ELF"]],
    label,
  });
}

/** The Ed25519 sketch shared by the on- and off-curve figures. */
function ed25519(p, { x0, y0, x1, y1 }) {
  // A 1/x-like branch: steep at the top left, flat at the bottom right.
  const d = `M${x0} ${y0}C${x0 + 40} ${y0 + (y1 - y0) * 0.7} ${x0 + (x1 - x0) * 0.3} ${y1} ${x1} ${y1}`;
  p.curve(d);
  p.text(x0 + 12, y0 + 4, "Ed25519 curve", { fill: p.c.ink3 });
  // Point on the curve at parameter t.
  return (t) => {
    const P = [
      [x0, y0],
      [x0 + 40, y0 + (y1 - y0) * 0.7],
      [x0 + (x1 - x0) * 0.3, y1],
      [x1, y1],
    ];
    const u = 1 - t;
    const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
    return [
      k.reduce((a, v, i) => a + v * P[i][0], 0),
      k.reduce((a, v, i) => a + v * P[i][1], 0),
    ];
  };
}

/* One transaction, step by step (diagrams/transaction-flow): lanes left to
 * right, then the messages in order. `yours` marks the lanes that hold the
 * reader's code. Checked against core/transactions, fees, pda, and cpi:
 * signatures are verified and the fee is charged before any instruction
 * runs, and the fee stays charged if execution fails (so it sits outside
 * the atomic box); a PDA signs only through its own program's
 * invoke_signed. */
const LANES = [
  { title: "Your app", desc: ["Your code,", "offchain"], yours: true },
  { title: "Wallet", desc: ["Signs and", "pays fees"] },
  { title: "Network", desc: ["Validators", "verify and run"] },
  { title: "Your program", desc: ["Your code,", "onchain"], yours: true },
  { title: "Token Program", desc: ["An existing", "program"] },
  { title: "Accounts", desc: ["Onchain", "state"] },
];
const SEQ = [
  {
    from: 0,
    self: true,
    label: "build transaction",
    sub: "instructions, recent blockhash",
    step: ["Build the transaction: instructions", "and a recent blockhash."],
  },
  { from: 0, to: 1, label: "ask to sign", step: ["Ask the wallet to sign."] },
  {
    from: 1,
    to: 0,
    ret: true,
    label: "signature",
    step: ["Sign and return the signature."],
  },
  {
    from: 0,
    to: 2,
    label: "send transaction through RPC",
    step: ["Send the transaction through RPC."],
  },
  {
    from: 2,
    self: true,
    label: "verify signatures",
    step: ["Verify every signature."],
  },
  {
    from: 2,
    to: 1,
    label: "charge fee",
    note: "Charged even if the transaction fails",
    step: [
      "Charge the fee to the fee payer. It is",
      "charged even if the transaction fails.",
    ],
  },
  { atomic: "start" },
  {
    from: 2,
    to: 3,
    label: "run instruction",
    step: ["Run your program’s instruction."],
  },
  { from: 3, self: true, label: "derive PDA", step: ["Derive a PDA."] },
  { from: 3, to: 5, label: "read state", step: ["Read state."] },
  {
    from: 3,
    to: 4,
    label: "transfer (CPI)",
    label2: "PDA signs",
    step: ["Transfer tokens through a CPI.", "The PDA signs."],
  },
  {
    from: 4,
    to: 5,
    label: "write balances",
    step: ["Write the new balances."],
  },
  { from: 4, to: 3, ret: true, label: "OK", step: ["Return OK."] },
  { from: 3, to: 5, label: "write state", step: ["Write state."] },
  { from: 3, to: 2, ret: true, label: "OK", step: ["Return OK."] },
  { atomic: "end" },
  {
    from: 2,
    to: 0,
    ret: true,
    label: "confirmation (signature status)",
    step: ["Report the confirmation (signature status)."],
  },
];
const FLOW_LABEL =
  "One transaction, step by step. Your app builds a transaction, the wallet signs it, and your app sends it to the network through RPC. The network verifies the signatures and charges the fee, then runs your program's instruction all or nothing: your program derives a PDA, reads state, calls the Token Program through a CPI that the PDA signs, and writes state. Your app then gets the confirmation.";
const LAYERS_LABEL =
  "Layers, top to bottom. The Solana network: validators that each keep the same accounts, where some accounts hold programs (your program, the Token Program) and others hold state (token balances, your program's data). Below it, apps (payments, games, markets) send transactions and read accounts through RPC. Below the apps, wallets hold keys and sign. At the bottom, users.";

const FIGURES = {
  /* ------------------------------------------------------ accounts */

  "core/accounts/accounts": (p) => {
    const c = p.c;
    // Key-value store
    const x = 24,
      y = 24,
      w = 312;
    const rows = [
      ["4Nd1m…Bm5a", "account"],
      ["9WzDX…AWWM", "account"],
      ["Gh9Zw…Pn2A", "account"],
    ];
    const RH = 36;
    const h = HEAD + 28 + rows.length * RH;
    const col = x + 160;
    p.rect(x, y, w, h);
    p.text(x + 16, y + HEAD / 2, "Accounts", { size: 13, weight: 500 });
    p.text(x + w - 16, y + HEAD / 2, "key-value store", {
      anchor: "end",
      fill: c.ink3,
    });
    p.hline(x + 1, x + w - 1, y + HEAD);
    p.text(x + 16, y + HEAD + 14, "address", { fill: c.ink2 });
    p.text(col + 16, y + HEAD + 14, "value", { fill: c.ink2 });
    const focus = 1;
    const fTop = y + HEAD + 28 + focus * RH;
    rows.forEach(([k, v], i) => {
      const ry = y + HEAD + 28 + i * RH;
      if (i !== focus && i !== focus + 1) p.hline(x + 1, x + w - 1, ry);
      p.value(x + 16, ry + RH / 2, k, { fill: c.ink });
      p.text(col + 16, ry + RH / 2, v, {
        fill: i === focus ? c.accent : c.ink2,
      });
    });
    // Column divider, broken under the highlighted row.
    p.vline(col, y + HEAD + 1, fTop);
    p.vline(col, fTop + RH, y + h - 1);
    // Highlight: flush with the row, full table width.
    p.front.push(
      `<rect x="${x + 0.625}" y="${fTop + 0.625}" width="${w - 1.25}" height="${RH - 1.25}" rx="0" fill="none" stroke="${c.accent}" stroke-width="1.25"/>`,
    );
    const fy = fTop + RH / 2;
    const acct = p.card({
      x: 400,
      y: fy - HEAD / 2,
      w: 264,
      title: "Account",
      tag: "struct",
      rows: [
        ["lamports", "u64"],
        ["data", "Vec<u8>"],
        ["owner", "Pubkey"],
        ["executable", "bool"],
        ["rent_epoch", "Epoch"],
      ],
    });
    p.edge(
      [
        [x + w, fy],
        [acct.x, fy],
      ],
      { accent: true },
    );
    return [
      W,
      Math.max(y + h, acct.bottom) + 24,
      "Accounts: a key-value store from address to account, and the fields of one account",
    ];
  },

  "core/accounts/account-address": (p) => {
    const addr = p.card({
      x: 24,
      y: 24,
      w: 448,
      title: "Address",
      tag: "public key, base58",
      accent: true,
      rows: [["address", "14grJpemFaf88c8tiVb77W7TYg2W3ir6pfkKz3YjhhZ5"]],
    });
    const acct = p.card({
      x: 24,
      y: addr.bottom + 56,
      w: 264,
      title: "Account",
      rows: [
        ["lamports", "u64"],
        ["data", "Vec<u8>"],
        ["owner", "Pubkey"],
        ["executable", "bool"],
      ],
    });
    p.edge(
      [
        [80, addr.bottom],
        [80, acct.y],
      ],
      { label: "identifies" },
    );
    return [
      W,
      acct.bottom + 24,
      "An account is found by its address: a 32-byte public key, written in base58",
    ];
  },

  "core/accounts/system-account": (p) =>
    ownedAccount(p, {
      name: "Wallet Account",
      tag: "system account",
      owner: "System Program",
      ownerTag: "program",
      executable: "false",
      lamports: "1,000,000",
      dataValue: "empty",
      label:
        "A wallet account: owned by the System Program, not executable, holding 1,000,000 lamports and no data",
    }),

  "core/accounts/data-account": (p) => {
    // Reads left to right, like every other owner arrow: the data account,
    // then its owner, then the owner's owner. Each card drops so its title
    // sits level with the owner row before it, so the arrows run straight.
    const cw = 176,
      xs = [24, 256, 488];
    const mk = (i, y, title, owner, exec, data, accent) =>
      p.card({
        x: xs[i],
        y,
        w: cw,
        title,
        accent,
        rows: [
          ["owner", owner],
          ["executable", exec],
          ["lamports", "u64"],
          ["data", data],
        ],
      });
    const acct = mk(
      0,
      24,
      "Data Account",
      "Program",
      "false",
      "program state",
      true,
    );
    const prog = mk(
      1,
      acct.rows[0].y - HEAD / 2,
      "Program",
      "BPF Loader",
      "true",
      "program code",
    );
    const loader = mk(
      2,
      prog.rows[0].y - HEAD / 2,
      "BPF Loader",
      "Native Loader",
      "true",
      "loader code",
    );
    const link = (from, to) =>
      p.edge(
        [
          [from.right, from.rows[0].y],
          [to.x, from.rows[0].y],
        ],
        { label: "owner" },
      );
    link(acct, prog);
    link(prog, loader);
    return [
      W,
      loader.bottom + 24,
      "A data account stores state; its owner field names the program that can change it, and that program is in turn owned by its loader",
    ];
  },

  "core/accounts/program-account-expanded": (p) => {
    const prog = p.card({
      x: 24,
      y: 24,
      w: 272,
      title: "Program",
      tag: "program account",
      rows: [
        ["owner", "Upgradeable Loader"],
        ["executable", "true"],
        ["lamports", "u64"],
        ["data", "programdata address"],
      ],
    });
    const pd = p.card({
      x: 392,
      y: 24,
      w: 272,
      title: "Program Data",
      tag: "account",
      accent: true,
      rows: [
        ["owner", "Upgradeable Loader"],
        ["executable", "false"],
        ["lamports", "u64"],
        ["data", "program code"],
      ],
    });
    p.edge(
      [
        [prog.right, prog.rows[3].y],
        [pd.x, pd.rows[3].y],
      ],
      { dashed: true, label: "points to" },
    );
    return [
      W,
      pd.bottom + 24,
      "An upgradeable program: the program account stores the address of a separate program data account, which holds the code",
    ];
  },

  "core/accounts/program-account-simple": (p) =>
    programAccount(
      p,
      "Program",
      "A program account: owned by a loader, executable, with program code as its data",
    ),

  /* -------------------------------------------------- transactions */

  "core/transactions/transaction-simple": (p) => {
    const c = p.c;
    const words = ["zero", "one", "two", "three"];
    const tx = (x, ins, accent) => {
      const w = 248;
      const h = HEAD + ins.length * ROW;
      p.rect(x, 24, w, h, accent ? { stroke: c.accent, sw: 1.25 } : {});
      p.text(x + 16, 24 + HEAD / 2, "Transaction", { size: 13, weight: 500 });
      p.text(
        x + w - 16,
        24 + HEAD / 2,
        `${words[ins.length]} instruction${ins.length > 1 ? "s" : ""}`,
        { anchor: "end", fill: accent ? c.accent : c.ink3 },
      );
      const inset = accent ? 1.25 : 1;
      ins.forEach((s, i) => {
        const iy = 24 + HEAD + i * ROW;
        p.hline(x + inset, x + w - inset, iy);
        p.text(x + 16, iy + ROW / 2, String(i), { mono: true, fill: c.ink3 });
        p.text(x + 40, iy + ROW / 2, s, { fill: c.ink2 });
      });
      return { bottom: 24 + h, right: x + w };
    };
    const b1 = tx(24, ["Instruction"]);
    const b2 = tx(304, ["Instruction", "Instruction", "Instruction"], true);
    p.span({
      x: b2.right + 16,
      y1: 24 + HEAD + 4,
      y2: b2.bottom - 4,
      label: "",
      accent: true,
    });
    p.text(b2.right + 16 + GAP, (24 + HEAD + b2.bottom) / 2, "all or none", {
      fill: c.accent,
    });
    return [
      W,
      Math.max(b1.bottom, b2.bottom) + 24,
      "Two transactions: one with a single instruction, one with three instructions that execute atomically",
    ];
  },

  "core/transactions/tx_format": (p) => {
    const tx = p.card({
      x: 24,
      y: 24,
      w: 280,
      title: "Transaction",
      tag: "struct",
      rows: [
        ["signatures", "Vec<Signature>"],
        ["message", "Message"],
      ],
    });
    const msg = p.card({
      x: 376,
      y: tx.rows[1].y - HEAD / 2,
      w: 288,
      title: "Message",
      tag: "struct",
      accent: true,
      rows: [
        ["header", "MessageHeader"],
        ["account_keys", "Vec<Pubkey>"],
        ["recent_blockhash", "Hash"],
        ["instructions", "Vec<Instruction>"],
      ],
    });
    p.edge(
      [
        [tx.right, tx.rows[1].y],
        [msg.x, tx.rows[1].y],
      ],
      { accent: true },
    );
    return [
      W,
      msg.bottom + 24,
      "A transaction has two parts: the signatures, and the message they sign",
    ];
  },

  "core/transactions/issues_with_legacy_txs": (p) => {
    const s = p.strip({
      x: 24,
      y: 48,
      cells: [
        { w: 168, title: "signatures", sub: "n × 64 bytes" },
        { w: 80, title: "header", sub: "3 bytes" },
        { w: 160, title: "account keys", sub: "n × 32 bytes" },
        { w: 104, title: "blockhash", sub: "32 bytes" },
        { w: 128, title: "instructions", sub: "the rest" },
      ],
    });
    const [sig, , , , ins] = s.cells;
    p.span({ x1: sig.x, x2: sig.right - 4, y: 40, label: "Signatures" });
    p.span({ x1: sig.right + 4, x2: ins.right, y: 40, label: "Message" });
    // The limit: one dimension line under the whole strip.
    const y = s.bottom + 24;
    p.edge(
      [
        [s.x + 1, y],
        [s.right - 1, y],
      ],
      { accent: true, both: true },
    );
    p.text(s.x, y + GAP + 10, "1,232 bytes in total, the size of one packet", {
      fill: p.c.accent,
    });
    return [
      W,
      y + GAP + 10 + 24,
      "A legacy transaction, signatures and message together, must fit in one 1,232-byte packet",
    ];
  },

  "core/transactions/message_header": (p) => {
    const hdr = p.card({
      x: 24,
      y: 24,
      w: 640,
      title: "MessageHeader",
      tag: "3 bytes",
      accent: true,
      noteX: 272,
      rows: [
        ["num_required_signatures", "u8", { note: "accounts that must sign" }],
        [
          "num_readonly_signed_accounts",
          "u8",
          { note: "of those, accounts that are read-only" },
        ],
        [
          "num_readonly_unsigned_accounts",
          "u8",
          { note: "non-signers that are read-only" },
        ],
      ],
    });
    return [
      W,
      hdr.bottom + 24,
      "The message header: three one-byte counts that give each account in account_keys its permissions",
    ];
  },

  "core/transactions/compat_array_of_account_addresses": (p) => {
    const keys = p.card({
      x: 24,
      y: 24,
      w: 344,
      title: "Account addresses",
      tag: "in order",
      rows: [
        ["signer, writable", "fee payer first", { index: 1 }],
        ["signer, read-only", null, { index: 2 }],
        ["non-signer, writable", null, { index: 3 }],
        ["non-signer, read-only", null, { index: 4 }],
      ],
    });
    // One bracket column: the 1-2 and 4 brackets on it, the row-2 bracket
    // nested 12px inside. Same stroke and cap; labels on one column. Only
    // the focal count (signers) carries the accent.
    const [r1, r2, , r4] = keys.rows;
    const col = keys.right + 28,
      inner = col - 12,
      lx = col + GAP;
    p.span({
      x: col,
      y1: r1.top + 6,
      y2: r2.bottom - 6,
      label: "num_required_signatures",
      labelX: lx,
      labelY: r1.y,
      accent: true,
    });
    p.span({
      x: inner,
      y1: r2.top + 6,
      y2: r2.bottom - 6,
      label: "num_readonly_signed_accounts",
      labelX: lx,
      labelY: r2.y,
    });
    p.span({
      x: col,
      y1: r4.top + 6,
      y2: r4.bottom - 6,
      label: "num_readonly_unsigned_accounts",
      labelX: lx,
      labelY: r4.y,
    });
    return [
      W,
      keys.bottom + 24,
      "Account addresses are ordered signer-writable, signer-read-only, non-signer-writable, non-signer-read-only; the header counts mark the boundaries",
    ];
  },

  "core/transactions/compact_array_of_ixs": (p) => {
    const list = p.card({
      x: 24,
      y: 24,
      w: 288,
      title: "Instructions",
      tag: "compact array",
      rows: [
        ["length", "compact-u16"],
        ["instruction", "CompiledInstruction", { index: 0 }],
        ["instruction", "CompiledInstruction", { index: 1 }],
        ["instruction", "CompiledInstruction", { index: 2 }],
      ],
    });
    const ix = p.card({
      x: 376,
      y: list.rows[1].y - HEAD / 2,
      w: 288,
      title: "CompiledInstruction",
      accent: true,
      rows: [
        ["program_id_index", "u8"],
        ["accounts", "Vec<u8>"],
        ["data", "Vec<u8>"],
      ],
    });
    p.edge(
      [
        [list.right, list.rows[1].y],
        [ix.x, list.rows[1].y],
      ],
      { accent: true },
    );
    return [
      W,
      Math.max(list.bottom, ix.bottom) + 24,
      "The instructions field: a length, then each compiled instruction, which names its program and accounts by index into account_keys",
    ];
  },

  "core/transactions/compact_array_format": (p) => {
    const s = p.strip({
      x: 24,
      y: 24,
      cells: [
        { w: 152, title: "length", sub: "compact-u16", accent: true },
        { w: 128, title: "item 0" },
        { w: 128, title: "item 1" },
        { w: 128, title: "item 2" },
        { w: 104, title: "…", dim: true },
      ],
    });
    return [
      W,
      s.bottom + 24,
      "A compact array: a compact-u16 length, then the items",
    ];
  },

  "core/transactions/instruction": (p) => {
    const tx = p.card({
      x: 24,
      y: 24,
      w: 264,
      title: "Transaction",
      rows: [
        ["signatures", "Vec<Signature>"],
        ["instruction", "Instruction"],
      ],
    });
    const ix = p.card({
      x: 360,
      y: tx.rows[1].y - HEAD / 2,
      w: 304,
      title: "Instruction",
      accent: true,
      rows: [
        ["program_id", "Pubkey", { note: "program to call" }],
        ["accounts", "Vec<AccountMeta>", { note: "" }],
        ["data", "Vec<u8>", { note: "arguments" }],
      ],
      noteX: 104,
    });
    p.edge(
      [
        [tx.right, tx.rows[1].y],
        [ix.x, tx.rows[1].y],
      ],
      { accent: true },
    );
    return [
      W,
      ix.bottom + 24,
      "An instruction names the program to call, the accounts it uses and the data it passes",
    ];
  },

  "core/transactions/accountmeta": (p) => {
    const tx = p.card({ x: 24, y: 56, w: 152, title: "Transaction" });
    const ix = p.card({
      x: 224,
      y: 56,
      w: 224,
      title: "Instruction",
      rows: [
        ["program_id", "Pubkey"],
        ["accounts", "Vec<AccountMeta>"],
        ["data", "Vec<u8>"],
      ],
    });
    p.edge(
      [
        [tx.right, tx.headY],
        [ix.x, tx.headY],
      ],
      { label: "has" },
    );
    const meta = (y, who, signer, accent) =>
      p.card({
        x: 512,
        y,
        w: 152,
        title: "AccountMeta",
        tag: who,
        accent,
        rows: [
          ["pubkey", "Pubkey"],
          ["is_signer", signer],
          ["is_writable", "true"],
        ],
      });
    const a = meta(24, "sender", "true", true);
    const b = meta(a.bottom + 24, "receiver", "false");
    const ay = ix.rows[1].y;
    p.edge([
      [ix.right, ay],
      [480, ay],
      [480, a.headY],
      [a.x, a.headY],
    ]);
    p.edge([
      [ix.right, ay],
      [480, ay],
      [480, b.headY],
      [b.x, b.headY],
    ]);
    return [
      W,
      b.bottom + 24,
      "An instruction's accounts field is a list of AccountMeta: each names an account and whether it signs and is written",
    ];
  },

  "core/transactions/sol-transfer": (p) => {
    const wallet = p.card({ x: 24, y: 24, w: 176, title: "Sender wallet" });
    const tx = p.card({
      x: 24,
      y: 120,
      w: 176,
      title: "Transaction",
      rows: [
        ["signer", "Sender"],
        ["instruction", "Transfer"],
        ["blockhash", "Hash"],
      ],
    });
    p.edge(
      [
        [56, wallet.bottom],
        [56, tx.y],
      ],
      { label: "signs, sends" },
    );
    const ix = p.card({
      x: 248,
      y: 120,
      w: 208,
      title: "Transfer",
      tag: "instruction",
      accent: true,
      rows: [
        ["program", "System Program"],
        ["accounts", "2 AccountMeta", { code: false }],
        ["data", "amount"],
      ],
    });
    p.edge(
      [
        [tx.right, tx.rows[1].y],
        [216, tx.rows[1].y],
        [216, ix.headY],
        [ix.x, ix.headY],
      ],
      {},
    );
    const meta = (y, who, signer) =>
      p.card({
        x: 512,
        y,
        w: 152,
        title: who,
        rows: [
          ["is_signer", signer],
          ["is_writable", "true"],
        ],
      });
    const a = meta(24, "Sender", "true");
    const b = meta(a.bottom + 24 + 40, "Receiver", "false");
    const ay = ix.rows[1].y;
    p.edge([
      [ix.right, ay],
      [484, ay],
      [484, a.headY],
      [a.x, a.headY],
    ]);
    p.edge([
      [ix.right, ay],
      [484, ay],
      [484, b.headY],
      [b.x, b.headY],
    ]);
    return [
      W,
      Math.max(tx.bottom, ix.bottom, b.bottom) + 24,
      "A SOL transfer: the sender signs a transaction whose transfer instruction lists the sender as a writable signer and the receiver as writable",
    ];
  },

  "core/transactions/sol-transfer-process": (p) => {
    const acct = (y, name, change) =>
      p.card({
        x: 24,
        y,
        w: 248,
        title: name,
        rows: [
          ["lamports", change],
          ["owner", "System Program"],
        ],
      });
    const s = acct(24, "Sender wallet", "− amount");
    const r = acct(s.bottom + 48, "Receiver wallet", "+ amount");
    const tx = p.card({
      x: 432,
      y: 24,
      w: 232,
      title: "Transaction",
      rows: [["instruction", "Transfer"]],
    });
    const sys = p.card({
      x: 432,
      y: (s.rows[0].y + r.rows[0].y) / 2 - HEAD / 2,
      w: 232,
      title: "System Program",
      tag: "program",
      accent: true,
    });
    p.edge(
      [
        [s.right, s.headY],
        [tx.x, s.headY],
      ],
      { label: "signs, sends" },
    );
    p.edge(
      [
        [tx.x + 40, tx.bottom],
        [tx.x + 40, sys.y],
      ],
      { label: "invokes" },
    );
    const tx0 = 352;
    p.edge(
      [
        [sys.x, sys.headY],
        [tx0, sys.headY],
        [tx0, s.rows[0].y],
        [s.right, s.rows[0].y],
      ],
      { label: "debits", seg: 2 },
    );
    p.edge(
      [
        [sys.x, sys.headY],
        [tx0, sys.headY],
        [tx0, r.rows[0].y],
        [r.right, r.rows[0].y],
      ],
      { label: "credits", seg: 2 },
    );
    return [
      W,
      r.bottom + 24,
      "Processing a SOL transfer: the System Program debits the sender's lamports and credits the receiver's",
    ];
  },

  /* ---------------------------------------------------------- PDAs */

  "core/pda/pda": (p) => {
    // Three equal columns, 32px gutters, equal heights (every card has a
    // one-line description).
    const cw = 192,
      xs = [24, 248, 472];
    const inputs = p.card({
      x: xs[0],
      y: 24,
      w: cw,
      title: "Inputs",
      desc: "seeds and a program ID",
      rows: [
        ["seeds", '"vault", user'],
        ["program id", "Prog…1111"],
      ],
    });
    const fn = p.card({
      x: xs[1],
      y: 24,
      w: cw,
      title: "Derive",
      desc: "findProgramAddress",
      rows: [
        ["bump", "255, 254, …"],
        ["until", "off curve"],
      ],
    });
    const pda = p.card({
      x: xs[2],
      y: 24,
      w: cw,
      title: "PDA",
      desc: "off the Ed25519 curve",
      accent: true,
      rows: [
        ["address", "9fXw…k2Qe"],
        ["bump", "254"],
      ],
    });
    p.edge([
      [inputs.right, inputs.headY],
      [fn.x, inputs.headY],
    ]);
    p.edge(
      [
        [fn.right, fn.headY],
        [pda.x, fn.headY],
      ],
      { accent: true },
    );
    // The PDA is the address of an account the program can sign for.
    const acct = p.card({
      x: pda.x,
      y: pda.bottom + 56,
      w: cw,
      title: "Account",
      rows: [["owner", "the program"]],
    });
    p.edge(
      [
        [pda.x + 40, pda.bottom],
        [pda.x + 40, acct.y],
      ],
      { dashed: true, label: "address of" },
    );
    return [
      W,
      acct.bottom + 24,
      "A program derived address: seeds and a program ID go through findProgramAddress to produce an off-curve address and bump",
    ];
  },

  "core/pda/pda-derivation": (p) => {
    // Steps are named in words; the call each step makes is its
    // description, in mono (isCode).
    const w = 432;
    const a = p.card({
      x: 24,
      y: 24,
      w,
      title: "Start at bump 255",
      desc: "findProgramAddress(seeds, programId)",
    });
    const b = p.card({
      x: 24,
      y: a.bottom + 48,
      w,
      title: "Create a candidate address",
      desc: "createProgramAddress(seeds, bump, programId)",
    });
    const chk = p.card({
      x: 24,
      y: b.bottom + 48,
      w,
      title: "Is the address off the Ed25519 curve?",
      dash: "4 4",
    });
    const ret = p.card({
      x: 24,
      y: chk.bottom + 48,
      w,
      title: "Return the address and bump",
      desc: "(pda, bump)",
      accent: true,
    });
    const dec = p.card({
      x: 520,
      y: chk.y,
      w: 144,
      title: "Next bump",
      desc: "bump − 1",
    });
    const vx = 64;
    p.edge([
      [vx, a.bottom],
      [vx, b.y],
    ]);
    p.edge([
      [vx, b.bottom],
      [vx, chk.y],
    ]);
    p.edge(
      [
        [vx, chk.bottom],
        [vx, ret.y],
      ],
      { label: "yes", accent: true },
    );
    p.edge(
      [
        [chk.right, chk.headY],
        [dec.x, chk.headY],
      ],
      { label: "no" },
    );
    p.edge(
      [
        [dec.cx, dec.y],
        [dec.cx, b.headY],
        [b.right, b.headY],
      ],
      { label: "try again", seg: 0 },
    );
    return [
      W,
      ret.bottom + 24,
      "Deriving a PDA: start at bump 255 and count down until the address falls off the Ed25519 curve, then return the address and bump",
    ];
  },

  "core/pda/address-on-curve": (p) => {
    // The sketch ends 32px inside the frame on every side.
    const at = ed25519(p, { x0: 56, y0: 32, x1: 632, y1: 264 });
    const card = (t, x, y, title, addr, bal) => {
      const [px, py] = at(t);
      const k = p.card({
        x,
        y,
        w: 208,
        title,
        rows: [
          ["address", addr],
          ["balance", bal],
        ],
      });
      p.edge(
        [
          [px + 6, py],
          [k.x, py],
        ],
        { head: false },
      );
      p.dot(px, py);
      p.text(px + 16, py - GAP - 6, "on curve", { fill: p.c.ink3 });
      return k;
    };
    // Points chosen so the leader lines are horizontal into the card rows.
    card(0.16, 176, 40, "Alice's wallet", "4Nd1…Bm5a", "15 SOL");
    card(0.5, 416, 120, "Bob's wallet", "9WzD…AWWM", "27 SOL");
    return [
      W,
      296,
      "Two wallet addresses: public keys that are points on the Ed25519 curve, each with a private key that can sign",
    ];
  },

  "core/pda/address-off-curve": (p) => {
    // Two rows of equal cards: the program and the seed on top; the
    // derivation and the PDA under the seed. The sketch keeps a 32px
    // margin.
    const cw = 208;
    const at = ed25519(p, { x0: 56, y0: 32, x1: 376, y1: 336 });
    const prog = p.card({
      x: 128,
      y: 40,
      w: cw,
      title: "Counter program",
      rows: [["address", "Coun…1111"]],
    });
    // The point on the curve level with the program's address row.
    let lo = 0,
      hi = 1;
    for (let k = 0; k < 40; k++) {
      const mid = (lo + hi) / 2;
      if (at(mid)[1] < prog.rows[0].y) lo = mid;
      else hi = mid;
    }
    const [px, py] = at(lo);
    p.dot(px, py);
    p.edge(
      [
        [px + 6, prog.rows[0].y],
        [prog.x, prog.rows[0].y],
      ],
      { head: false },
    );
    const sx = W - 24 - cw;
    const seed = p.card({
      x: sx,
      y: 40,
      w: cw,
      title: "Seed",
      rows: [["string", '"global state"']],
    });
    const fn = p.card({
      x: sx,
      y: seed.bottom + 48,
      w: cw,
      title: "Derive",
      desc: "findProgramAddress",
    });
    const pda = p.card({
      x: sx,
      y: fn.bottom + 48,
      w: cw,
      title: "PDA",
      tag: "off curve",
      accent: true,
      rows: [
        ["address", "7xKX…gAsU"],
        ["count", "126"],
      ],
    });
    p.edge(
      [
        [seed.x + 40, seed.bottom],
        [seed.x + 40, fn.y],
      ],
      { label: "seed" },
    );
    const gx = (prog.right + sx) / 2;
    p.edge(
      [
        [prog.right, prog.rows[0].y],
        [gx, prog.rows[0].y],
        [gx, fn.headY],
        [fn.x, fn.headY],
      ],
      { label: "program ID", seg: 1, side: "before" },
    );
    p.edge(
      [
        [seed.x + 40, fn.bottom],
        [seed.x + 40, pda.y],
      ],
      { label: "derives" },
    );
    return [
      W,
      Math.max(pda.bottom, 336 + 8) + 24,
      "A PDA: derived from a seed and the program's address, it falls off the Ed25519 curve, so no private key exists for it",
    ];
  },

  "core/cpi/cpi": (p) => {
    // Three equal columns on one 56px gutter.
    const cw = 176,
      xs = [24, 256, 488];
    const wallet = p.card({
      x: xs[0],
      y: 24,
      w: cw,
      title: "Wallet",
      tag: "signer",
    });
    const tx = p.card({
      x: xs[0],
      y: 136,
      w: cw,
      title: "Transaction",
      rows: [["instruction", "Program A"]],
    });
    const a = p.card({
      x: xs[1],
      y: 136,
      w: cw,
      title: "Program A",
      rows: [["stack height", "1"]],
    });
    const b = p.card({
      x: xs[2],
      y: 136,
      w: cw,
      title: "Program B",
      accent: true,
      rows: [["stack height", "2"]],
    });
    p.edge(
      [
        [xs[0] + 40, wallet.bottom],
        [xs[0] + 40, tx.y],
      ],
      { label: "signs, sends" },
    );
    p.edge(
      [
        [tx.right, tx.headY],
        [a.x, tx.headY],
      ],
      { label: "invokes" },
    );
    p.edge(
      [
        [a.right, a.headY],
        [b.x, a.headY],
      ],
      { accent: true, label: "CPI" },
    );
    return [
      W,
      tx.bottom + 24,
      "Cross-program invocation: a wallet signs a transaction whose instruction invokes Program A, which invokes Program B",
    ];
  },

  "diagrams/core-concepts": (p) => {
    // Two rows on one grid: three 168px columns, 76px gutters (room for
    // edge labels), every card in a row the same height. Both horizontal
    // edges run on the title band, so they meet each card at its name.
    const cw = 168,
      xs = [16, 260, 504];
    const top = 24;
    const acc = p.card({
      x: xs[0],
      y: top,
      w: cw,
      title: "Accounts",
      desc: "Store onchain state",
      rows: [["owner", "a program"]],
    });
    const prog = p.card({
      x: xs[1],
      y: top,
      w: cw,
      title: "Programs",
      desc: "Stateless logic",
      accent: true,
      rows: [["state", "in accounts"]],
    });
    const tx = p.card({
      x: xs[2],
      y: top,
      w: cw,
      title: "Transactions",
      desc: "Execute atomically",
      rows: [["holds", "instructions"]],
    });
    const y2 = prog.bottom + 56;
    const pda = p.card({
      x: xs[0],
      y: y2,
      w: cw,
      title: "PDAs",
      desc: "Derived addresses",
    });
    const cpi = p.card({
      x: xs[1],
      y: y2,
      w: cw,
      title: "CPIs",
      desc: "Calls across programs",
    });
    const fees = p.card({
      x: xs[2],
      y: y2,
      w: cw,
      title: "Fees",
      desc: "Price execution",
    });
    const hy = top + HEAD_DESC / 2;
    p.edge(
      [
        [prog.x, hy],
        [acc.right, hy],
      ],
      { both: true, label: "read, write" },
    );
    p.edge(
      [
        [tx.x, hy],
        [prog.right, hy],
      ],
      { label: "call" },
    );
    const band = (prog.bottom + y2) / 2;
    p.edge(
      [
        [prog.x + 32, prog.bottom],
        [prog.x + 32, band],
        [pda.cx, band],
        [pda.cx, pda.y],
      ],
      { label: "derive", seg: 1 },
    );
    p.edge(
      [
        [prog.cx, prog.bottom],
        [prog.cx, cpi.y],
      ],
      { label: "invoke" },
    );
    p.edge(
      [
        [tx.cx, tx.bottom],
        [tx.cx, fees.y],
      ],
      { label: "pay" },
    );
    return [
      W,
      fees.bottom + 24,
      "Core concepts: accounts store state, programs hold logic, transactions carry instructions that call programs and pay fees; programs derive PDAs and invoke other programs through CPIs",
    ];
  },

  "diagrams/solana-overview": (p) => {
    // Apps on top, each connecting down into the network: one focal card
    // holding six computers linked in a row (peers, so no heads).
    const label =
      "Payment, game, and market apps connect to Solana, a network made up of computers working together.";
    const aw = 176,
      xs = [24, 256, 488];
    const apps = ["Payments", "Games", "Markets"].map((title, i) =>
      p.card({ x: xs[i], y: 24, w: aw, title, tag: "app" }),
    );
    const ny = apps[0].bottom + 48;
    const net = p.card({
      x: 24,
      y: ny,
      w: W - 48,
      title: "Solana network",
      desc: "Computers working together",
      accent: true,
      minH: HEAD_DESC + 40 + 24,
    });
    apps.forEach((a) =>
      p.edge([
        [a.cx, a.bottom],
        [a.cx, net.y],
      ]),
    );
    const cw = 88,
      gap = 16,
      cy = ny + HEAD_DESC;
    const nodes = [];
    for (let i = 0; i < 6; i++) {
      const x = net.x + 16 + i * (cw + gap);
      p.rect(x, cy, cw, 40);
      p.text(x + 16, cy + 20, "Computer", { fill: p.c.ink2 });
      nodes.push(x);
    }
    for (let i = 0; i < 5; i++)
      p.edge(
        [
          [nodes[i] + cw, cy + 20],
          [nodes[i + 1], cy + 20],
        ],
        { head: false },
      );
    // The links sit inside the network card: lift them above its fill.
    for (let i = 0; i < 5; i++) p.front.push(p.back.pop());
    return [W, net.bottom + 24, label];
  },

  "diagrams/solana-layers": (p) => {
    // Layers, top to bottom: the network (validators, and the accounts
    // they all keep: programs and state), then apps, wallets, and users.
    // Apps reach the network through RPC: transactions call programs
    // (solid), reads look at accounts (dashed).
    const c = p.c;
    const label = LAYERS_LABEL;
    const x = 24,
      w = W - 48,
      ix = x + 16,
      iw = w - 32;
    const vw = 104,
      vgap = (iw - 5 * vw) / 4,
      vh = 40;
    const vy = 24 + HEAD_DESC;
    const ay = vy + vh + 24; // "Accounts" heading
    const cy = ay + 48; // program and state cards
    const cw = (iw - 16) / 2;
    const tmp = { rows: [["Your program"], ["Token Program"]] };
    const cardH = HEAD + tmp.rows.length * ROW;
    const net = p.card({
      x,
      y: 24,
      w,
      title: "Solana network",
      tag: "onchain",
      desc: "Validators: computers that each keep the same copy of every account",
      accent: true,
      minH: cy + cardH + 16 - 24,
    });
    const nodes = [];
    for (let i = 0; i < 5; i++) {
      const nx = ix + i * (vw + vgap);
      p.rect(nx, vy, vw, vh);
      p.text(nx + 16, vy + vh / 2, "Validator", { fill: c.ink2 });
      nodes.push(nx);
    }
    for (let i = 0; i < 4; i++)
      p.edge(
        [
          [nodes[i] + vw, vy + vh / 2],
          [nodes[i + 1], vy + vh / 2],
        ],
        { head: false },
      );
    for (let i = 0; i < 4; i++) p.front.push(p.back.pop());
    p.hline(x + 1.25, x + w - 1.25, ay - 12);
    p.text(ix, ay + 8, "Accounts", { size: 13, weight: 500 });
    p.text(ix, ay + 26, "Store data, like files on a computer", {
      fill: c.ink2,
    });
    const prog = p.card({
      x: ix,
      y: cy,
      w: cw,
      title: "Programs",
      tag: "executable code",
      rows: [["Your program"], ["Token Program"]],
    });
    const state = p.card({
      x: ix + cw + 16,
      y: cy,
      w: cw,
      title: "State",
      tag: "data",
      rows: [["Token balances"], ["Your program’s data"]],
    });
    const apy = net.bottom + 72;
    const bw = (iw - 32) / 3;
    const apps = p.card({
      x,
      y: apy,
      w,
      title: "Apps",
      tag: "offchain",
      desc: "Your code: websites, mobile apps, and servers",
      minH: HEAD_DESC + 40 + 16,
    });
    ["Payments", "Games", "Markets"].forEach((t, i) => {
      const bx = ix + i * (bw + 16);
      p.rect(bx, apy + HEAD_DESC, bw, 40);
      p.text(bx + 16, apy + HEAD_DESC + 20, t, { fill: c.ink2 });
    });
    const tx = prog.x + 40,
      rx = state.x + 40;
    p.edge(
      [
        [tx, apps.y],
        [tx, prog.bottom],
      ],
      { label: "send transactions through RPC" },
    );
    p.edge(
      [
        [rx, apps.y],
        [rx, state.bottom],
      ],
      { dashed: true, label: "read accounts through RPC" },
    );
    // Both cross the network card's bottom edge: lift them above its fill.
    p.front.push(p.back.pop(), p.back.pop());
    const wal = p.card({
      x,
      y: apps.bottom + 56,
      w,
      title: "Wallets",
      tag: "offchain",
      desc: "Hold users’ keys: sign in and approve transactions",
    });
    const usr = p.card({
      x,
      y: wal.bottom + 56,
      w,
      title: "Users",
      desc: "People using your app",
    });
    p.edge(
      [
        [tx, wal.y],
        [tx, apps.bottom],
      ],
      { label: "sign" },
    );
    p.edge(
      [
        [tx, usr.y],
        [tx, wal.bottom],
      ],
      { label: "approve" },
    );
    return [W, usr.bottom + 24, label];
  },

  "diagrams/transaction-flow": (p) => {
    // A sequence diagram of one transaction: six lanes, the two that hold
    // your code drawn in the accent.
    const c = p.c;
    const pitch = 112,
      x0 = (W - 6 * pitch) / 2,
      hw = pitch - 8;
    const cx = (i) => x0 + pitch * i + pitch / 2;
    const top = 24,
      hh = 76;
    LANES.forEach((l, i) => {
      const hx = cx(i) - hw / 2;
      p.rect(hx, top, hw, hh, {
        stroke: l.yours ? c.accent : c.line,
        sw: l.yours ? 1.25 : 1,
      });
      p.text(cx(i), top + 23, l.title, {
        size: 13,
        weight: 500,
        anchor: "middle",
      });
      l.desc.forEach((d, k) =>
        p.text(cx(i), top + 41 + k * 18, d, {
          anchor: "middle",
          fill: l.yours && k === 0 ? c.accent : c.ink2,
        }),
      );
    });
    // Lifelines are cut where a label crosses them (6px clear above and
    // below), instead of running under a tight backing that still read as
    // a line through the text.
    const holes = [];
    const back = (x, y, s, anchor) => {
      const tw = s.length * 6.2 + 8;
      const lx = anchor === "middle" ? x - tw / 2 : x - 4;
      holes.push({ x0: lx, x1: lx + tw, y0: y - 8 - 6, y1: y + 8 + 6 });
    };
    const label = (x, y, s, o = {}) => {
      back(x, y, s, o.anchor);
      p.text(x, y, s, { fill: c.ink2, ...o });
    };
    // Rows: a message row puts its label 14px above the line and the line
    // 24px (42px with a second label line) below the row top; a self row
    // draws a 16px loop with its label beside it.
    let y = top + hh + 16;
    let atomicTop = 0;
    for (const s of SEQ) {
      if (s.atomic === "start") {
        atomicTop = y;
        const t = "Atomic: all or nothing";
        const bx = x0 + pitch * 2 + 2;
        back(bx + 12, y + 20, t + "  ");
        p.text(bx + 12, y + 20, t, { weight: 500 });
        y += 40;
        continue;
      }
      if (s.atomic === "end") {
        const bx = x0 + pitch * 2 + 2,
          bw = W - x0 - 2 - bx;
        p.rect(bx, atomicTop, bw, y + 4 - atomicTop, {
          fill: "none",
          stroke: c.line,
          dash: "3 3",
          layer: p.back,
        });
        y += 20;
        continue;
      }
      if (s.self) {
        const lx = cx(s.from),
          ly = y + 8;
        p.edge(
          [
            [lx, ly],
            [lx + 24, ly],
            [lx + 24, ly + 16],
            [lx, ly + 16],
          ],
          { r: 4 },
        );
        label(lx + 32, ly + 8, s.label, { anchor: "start" });
        if (s.sub)
          label(lx + 32, ly + 26, s.sub, { anchor: "start", fill: c.ink3 });
        y += s.sub ? 56 : 36;
        continue;
      }
      const ly = y + (s.label2 ? 42 : 24);
      const a = cx(s.from),
        b = cx(s.to);
      p.edge(
        [
          [a, ly],
          [b, ly],
        ],
        { dashed: s.ret },
      );
      const mid = (a + b) / 2;
      label(mid, ly - GAP - 6, s.label2 ?? s.label, { anchor: "middle" });
      if (s.label2) label(mid, ly - GAP - 24, s.label, { anchor: "middle" });
      if (s.note)
        label(Math.max(a, b) + 12, ly, s.note, {
          anchor: "start",
          fill: c.ink3,
        });
      y = ly + 12;
    }
    y += 16;
    // Lifelines, under everything.
    const end = y - 8;
    LANES.forEach((l, i) => {
      const x = cx(i);
      const cuts = holes
        .filter((h) => x > h.x0 && x < h.x1)
        .sort((a, b) => a.y0 - b.y0)
        .reduce((acc, h) => {
          const last = acc[acc.length - 1];
          if (last && h.y0 - last.y1 < 24) last.y1 = Math.max(last.y1, h.y1);
          else acc.push({ y0: h.y0, y1: h.y1 });
          return acc;
        }, []);
      let d = "";
      let from = top + hh;
      for (const k of [...cuts, { y0: end, y1: end }]) {
        if (k.y0 > from) d += `M${n(x + 0.5)} ${n(from)}V${n(k.y0)}`;
        from = Math.max(from, k.y1);
      }
      p.back.unshift(
        `<path d="${d}" stroke="${l.yours ? c.accent : c.line}" stroke-width="${l.yours ? 1.25 : 1}" stroke-dasharray="2 4"/>`,
      );
    });
    return [W, end + 24, FLOW_LABEL];
  },

  "core/fees/fees": (p) => {
    const c = p.c;
    const base = p.card({
      x: 24,
      y: 24,
      w: 208,
      title: "Base fee",
      tag: "required",
      rows: [
        ["per signature", "5,000 lamports"],
        ["signatures", "one or more"],
      ],
    });
    const prio = p.card({
      x: 264,
      y: 24,
      w: 208,
      title: "Prioritization fee",
      tag: "optional",
      rows: [
        ["CU price", "set by you"],
        ["CU limit", "set by you"],
      ],
    });
    const total = p.card({
      x: 504,
      y: 24,
      w: 160,
      title: "Transaction fee",
      accent: true,
      rows: [
        ["paid in", "SOL"],
        ["paid by", "fee payer"],
      ],
    });
    p.op(248, base.cy, "+");
    p.op(488, base.cy, "=");
    // Where each part goes: one annotation per column, one style.
    const y = base.bottom + 20;
    p.text(base.x, y, "Half burned, half to the validator.", { fill: c.ink2 });
    p.text(prio.x, y, "All of it to the validator.", { fill: c.ink2 });
    p.text(total.x, y, "Charged even if it fails.", { fill: c.ink2 });
    return [
      W,
      y + 24,
      "A transaction fee is the base fee of 5,000 lamports per signature plus an optional prioritization fee of compute unit price times compute unit limit",
    ];
  },

  /* -------------------------------------------------------- tokens */

  "core/tokens/token-program": (p) =>
    programAccount(
      p,
      "Token Program",
      "The Token Program account: owned by a loader, executable, with program code as its data",
    ),

  "core/tokens/mint-account": (p) =>
    ownedAccount(p, {
      name: "Mint Account",
      tag: "account",
      owner: "Token Program",
      ownerTag: "program",
      executable: "false",
      data: "Mint data",
      fields: [
        ["supply", "u64"],
        ["decimals", "u8"],
        ["mint authority", "Pubkey?"],
        ["freeze authority", "Pubkey?"],
      ],
      label:
        "A mint account: owned by the Token Program, with supply, decimals and authorities as its data",
    }),

  "core/tokens/token-account": (p) =>
    ownedAccount(p, {
      name: "Token Account",
      tag: "account",
      owner: "Token Program",
      ownerTag: "program",
      executable: "false",
      data: "Token account data",
      fields: [
        ["mint", "Pubkey"],
        ["owner", "Pubkey"],
        ["amount", "u64"],
      ],
      label:
        "A token account: owned by the Token Program, with mint, owner and amount as its data",
    }),

  "core/tokens/token-account-relationship": (p) => {
    const sys = p.card({ x: 24, y: 24, w: 192, title: "System Program" });
    const tok = p.card({ x: 360, y: 24, w: 208, title: "Token Program" });
    const wallet = p.card({ x: 24, y: 152, w: 192, title: "Wallet Account" });
    const ta = p.card({
      x: 256,
      y: 152,
      w: 208,
      title: "Token Account",
      accent: true,
      rows: [
        ["mint", "Mint Account"],
        ["owner", "Wallet Account"],
        ["amount", "u64"],
      ],
    });
    const mint = p.card({ x: 504, y: 152, w: 160, title: "Mint Account" });
    p.edge(
      [
        [sys.cx, sys.bottom],
        [sys.cx, wallet.y],
      ],
      { label: "owns" },
    );
    const ty = tok.bottom;
    const by = 112;
    p.edge(
      [
        [tok.cx - 24, ty],
        [tok.cx - 24, by],
        [ta.cx, by],
        [ta.cx, ta.y],
      ],
      { label: "owns", seg: 2, side: "before" },
    );
    p.edge(
      [
        [tok.cx + 24, ty],
        [tok.cx + 24, by],
        [mint.cx, by],
        [mint.cx, mint.y],
      ],
      { label: "owns", seg: 2 },
    );
    // Field references.
    p.edge(
      [
        [ta.x, ta.rows[1].y],
        [wallet.cx, ta.rows[1].y],
        [wallet.cx, wallet.bottom],
      ],
      { dashed: true },
    );
    p.edge(
      [
        [ta.right, ta.rows[0].y],
        [mint.cx, ta.rows[0].y],
        [mint.cx, mint.bottom],
      ],
      { dashed: true },
    );
    return [
      W,
      ta.bottom + 24,
      "Account relationships: the System Program owns the wallet; the Token Program owns the token account and the mint; the token account's mint and owner fields point to the mint and the wallet",
    ];
  },

  "core/tokens/associated-token-account": (p) => {
    const wallet = p.card({
      x: 24,
      y: 24,
      w: 176,
      title: "Wallet Account",
      desc: "the owner",
    });
    const mint = p.card({
      x: 488,
      y: 24,
      w: 176,
      title: "Mint Account",
      desc: "the token",
    });
    const fn = p.card({
      x: 248,
      y: 24,
      w: 192,
      title: "Derive",
      desc: "findProgramAddress",
    });
    const ata = p.card({
      x: 240,
      y: 128,
      w: 208,
      title: "Associated Token Account",
      accent: true,
      rows: [
        ["mint", "Mint Account"],
        ["owner", "Wallet Account"],
        ["amount", "u64"],
      ],
    });
    p.edge(
      [
        [wallet.right, fn.headY],
        [fn.x, fn.headY],
      ],
      { label: "seed" },
    );
    p.edge(
      [
        [mint.x, fn.headY],
        [fn.right, fn.headY],
      ],
      { label: "seed" },
    );
    p.edge(
      [
        [fn.cx, fn.bottom],
        [fn.cx, ata.y],
      ],
      { accent: true, label: "address" },
    );
    p.edge(
      [
        [ata.x, ata.rows[1].y],
        [wallet.cx, ata.rows[1].y],
        [wallet.cx, wallet.bottom],
      ],
      { dashed: true },
    );
    p.edge(
      [
        [ata.right, ata.rows[0].y],
        [mint.cx, ata.rows[0].y],
        [mint.cx, mint.bottom],
      ],
      { dashed: true },
    );
    return [
      W,
      ata.bottom + 24,
      "Associated token account: its address is a PDA derived from the wallet and the mint; its mint and owner fields point back to them",
    ];
  },

  "core/tokens/token-account-relationship-ata": (p) => {
    // Matrix: wallets x mints, one ATA per pair. Equal 24px gutters. Row
    // and column headers are title-only cards (40px); a row header sits
    // level with the title of the cells it labels.
    const g = 24;
    const wx = 24,
      ww = 160;
    const cw = (W - 24 - wx - ww - 2 * g) / 2; // 216
    const colX = [wx + ww + g, wx + ww + g + cw + g];
    const ch = HEAD + 2 * ROW; // 104
    const hy = 24;
    const rowY = [hy + HEAD + g, hy + HEAD + g + ch + g];
    ["Mint A", "Mint B"].forEach((m, k) =>
      p.card({ x: colX[k], y: hy, w: cw, title: m }),
    );
    const wallets = ["Wallet 1", "Wallet 2"];
    wallets.forEach((wName, r) => {
      p.card({ x: wx, y: rowY[r], w: ww, title: wName });
      ["Mint A", "Mint B"].forEach((m, k) => {
        p.card({
          x: colX[k],
          y: rowY[r],
          w: cw,
          title: "Associated Token Account",
          accent: r === 0 && k === 0,
          rows: [
            ["mint", m],
            ["owner", wName],
          ],
        });
      });
    });
    return [
      W,
      rowY[1] + ch + 24,
      "Two wallets and two mints give four associated token accounts, one for each wallet and mint pair",
    ];
  },

  "diagrams/assets-overview": (p) => {
    // Wallet -> Token Program -> (Mint Account, Token Accounts). The
    // program's two edges leave one mid-edge point and fork 24px out.
    const mint = p.card({
      x: 448,
      y: 24,
      w: 216,
      title: "Mint Account",
      desc: "Supply and authorities",
    });
    const accts = p.card({
      x: 448,
      y: mint.bottom + 32,
      w: 216,
      title: "Token Accounts",
      desc: "Balances for this mint",
      rows: [
        ["Alice", "90"],
        ["Bob", "10"],
      ],
    });
    const mid = (mint.headY + accts.headY) / 2;
    const prog = p.card({
      x: 232,
      y: mid - HEAD_DESC / 2,
      w: 168,
      title: "Token Program",
      desc: "Applies the rules",
      accent: true,
    });
    const wallet = p.card({
      x: 24,
      y: prog.y,
      w: 160,
      title: "Wallet or app",
      desc: "Signs instructions",
    });
    p.edge(
      [
        [wallet.right, prog.cy],
        [prog.x, prog.cy],
      ],
      { label: "signs" },
    );
    const fx = prog.right + 24;
    p.edge([
      [prog.right, prog.cy],
      [fx, prog.cy],
      [fx, mint.headY],
      [mint.x, mint.headY],
    ]);
    p.edge([
      [prog.right, prog.cy],
      [fx, prog.cy],
      [fx, accts.headY],
      [accts.x, accts.headY],
    ]);
    return [
      W,
      accts.bottom + 24,
      "The Token Program updates a mint and its token accounts while owners authorize balance changes",
    ];
  },

  /* ------------------------------------------------------ payments */

  "payments/payment-flow": (p) => {
    const c = p.c;
    // Balances as before / after columns (no glyph arrows). The transfer
    // is the focus: both rows it touches, and the edge, carry the accent.
    const ledger = (x, w, title, rows, focus) => {
      const sub = 28;
      const h = HEAD + sub + rows.length * ROW;
      p.rect(x, 24, w, h);
      p.text(x + 16, 24 + HEAD / 2, title, { size: 13, weight: 500 });
      p.hline(x + 1, x + w - 1, 24 + HEAD);
      const bx = x + w - 88,
        ax = x + w - 16;
      p.text(x + 16, 24 + HEAD + 14, "token account", { fill: c.ink3 });
      p.text(bx, 24 + HEAD + 14, "before", { fill: c.ink3, anchor: "end" });
      p.text(ax, 24 + HEAD + 14, "after", { fill: c.ink3, anchor: "end" });
      const out = [];
      rows.forEach(([label, before, after], i) => {
        const ry = 24 + HEAD + sub + i * ROW;
        if (i !== focus && i !== focus + 1) p.hline(x + 1, x + w - 1, ry);
        p.text(x + 16, ry + ROW / 2, label, { fill: c.ink2 });
        p.value(bx, ry + ROW / 2, before, {
          anchor: "end",
          fill: after == null ? c.ink : c.ink3,
        });
        if (after != null)
          p.value(ax, ry + ROW / 2, after, {
            anchor: "end",
            fill: i === focus ? c.accent : c.ink,
          });
        out.push({ top: ry, y: ry + ROW / 2 });
      });
      const r = out[focus];
      p.front.push(
        `<rect x="${x + 0.625}" y="${r.top + 0.625}" width="${w - 1.25}" height="${ROW - 1.25}" rx="0" fill="none" stroke="${c.accent}" stroke-width="1.25"/>`,
      );
      return { x, right: x + w, bottom: 24 + h, rows: out };
    };
    const sender = ledger(
      24,
      296,
      "Sender's wallet",
      [
        ["USDG", "100", "90"],
        ["USDC", "50"],
        ["PYUSD", "200"],
      ],
      0,
    );
    const recv = ledger(
      392,
      272,
      "Receiver's wallet",
      [["USDG", "45", "55"]],
      0,
    );
    p.edge(
      [
        [sender.right, sender.rows[0].y],
        [recv.x, sender.rows[0].y],
      ],
      { accent: true, label: "10 USDG" },
    );
    return [
      W,
      sender.bottom + 24,
      "A stablecoin payment: 10 USDG moves from the sender's USDG token account to the receiver's",
    ];
  },
};

/* ------------------------------------------------------------ phones
 * Portrait variants, <name>-sm{-light,}.svg, for the core figures: the
 * same content restacked for a 336px drawing (the frame on a 390px phone),
 * so labels stay at 12-13px instead of shrinking. styles/diagrams.css shows
 * them below 640px, in place of the desktop drawing.
 */
const SW = 336; // phone drawing width
const SX = 16; // phone margin
const SC = SW - 2 * SX; // 304: full-width card
const SH = (SC - 16) / 2; // 144: half-width card, 16px gutter
const SX2 = SX + SH + 16; // second half column

/** Owner above, account, data below; arrows point at what they name. */
function ownedAccountSm(
  p,
  {
    name,
    owner,
    executable,
    lamports = "u64",
    dataValue = "bytes",
    data,
    fields,
    label,
  },
) {
  const prog = p.card({ x: SX, y: 24, w: SC, title: owner });
  const acct = p.card({
    x: SX,
    y: prog.bottom + 48,
    w: SC,
    title: name,
    accent: true,
    rows: [
      ["owner", owner],
      ["executable", executable],
      ["lamports", lamports],
      ["data", dataValue],
    ],
  });
  p.edge(
    [
      [SX + 40, acct.y],
      [SX + 40, prog.bottom],
    ],
    { label: "owner" },
  );
  let bottom = acct.bottom;
  if (data) {
    const d = p.card({
      x: SX,
      y: acct.bottom + 48,
      w: SC,
      title: data,
      tag: "account data",
      rows: fields,
    });
    p.edge(
      [
        [SX + 40, acct.bottom],
        [SX + 40, d.y],
      ],
      { dashed: true, label: "data" },
    );
    bottom = d.bottom;
  }
  return [SW, bottom + 24, label];
}

/** Elbow from a parent's bottom edge (at x) into a child's top centre. */
function forkSm(p, parent, x, child, o = {}) {
  const band = (parent.bottom + child.y) / 2;
  const pts =
    Math.abs(x - child.cx) < 1
      ? [
          [x, parent.bottom],
          [x, child.y],
        ]
      : [
          [x, parent.bottom],
          [x, band],
          [child.cx, band],
          [child.cx, child.y],
        ];
  p.edge(pts, { seg: pts.length > 2 ? 2 : 0, ...o });
}

/** A vertical chain of full-width cards joined by labelled edges. */
function chainSm(p, items, label) {
  let y = 24,
    prev = null;
  for (const it of items) {
    const { edge, edgeAccent, dashed, ...card } = it;
    const k = p.card({ x: SX, w: SC, ...card, y: prev ? y + 48 : y });
    if (prev)
      p.edge(
        [
          [SX + 40, prev.bottom],
          [SX + 40, k.y],
        ],
        { label: edge, accent: edgeAccent, dashed },
      );
    prev = k;
    y = k.bottom;
  }
  return [SW, y + 24, label];
}

const SM = {
  "core/accounts/accounts@sm": (p) => {
    const c = p.c;
    const x = SX,
      y = 24,
      w = SC;
    const rows = [
      ["4Nd1m…Bm5a", "account"],
      ["9WzDX…AWWM", "account"],
      ["Gh9Zw…Pn2A", "account"],
    ];
    const RH = 36;
    const h = HEAD + 28 + rows.length * RH;
    const col = x + 152;
    p.rect(x, y, w, h);
    p.text(x + 16, y + HEAD / 2, "Accounts", { size: 13, weight: 500 });
    p.text(x + w - 16, y + HEAD / 2, "key-value store", {
      anchor: "end",
      fill: c.ink3,
    });
    p.hline(x + 1, x + w - 1, y + HEAD);
    p.text(x + 16, y + HEAD + 14, "address", { fill: c.ink2 });
    p.text(col + 16, y + HEAD + 14, "value", { fill: c.ink2 });
    const focus = rows.length - 1;
    const fTop = y + HEAD + 28 + focus * RH;
    rows.forEach(([k, v], i) => {
      const ry = y + HEAD + 28 + i * RH;
      if (i !== focus) p.hline(x + 1, x + w - 1, ry);
      p.value(x + 16, ry + RH / 2, k, { fill: c.ink });
      p.text(col + 16, ry + RH / 2, v, {
        fill: i === focus ? c.accent : c.ink2,
      });
    });
    p.vline(col, y + HEAD + 1, fTop);
    p.vline(col, fTop + RH, y + h - 1);
    p.front.push(
      `<rect x="${x + 0.625}" y="${fTop + 0.625}" width="${w - 1.25}" height="${RH - 1.25}" rx="0" fill="none" stroke="${c.accent}" stroke-width="1.25"/>`,
    );
    const acct = p.card({
      x,
      y: y + h + 48,
      w,
      title: "Account",
      tag: "struct",
      rows: [
        ["lamports", "u64"],
        ["data", "Vec<u8>"],
        ["owner", "Pubkey"],
        ["executable", "bool"],
        ["rent_epoch", "Epoch"],
      ],
    });
    p.edge(
      [
        [col + 16 + 24, y + h],
        [col + 16 + 24, acct.y],
      ],
      { accent: true },
    );
    return [
      SW,
      acct.bottom + 24,
      "Accounts: a key-value store from address to account, and the fields of one account",
    ];
  },

  "core/accounts/account-address@sm": (p) =>
    chainSm(
      p,
      [
        {
          title: "Address",
          tag: "public key, base58",
          accent: true,
          rows: [["address", "14grJpemFa…3YjhhZ5"]],
        },
        {
          edge: "identifies",
          title: "Account",
          rows: [
            ["lamports", "u64"],
            ["data", "Vec<u8>"],
            ["owner", "Pubkey"],
            ["executable", "bool"],
          ],
        },
      ],
      "An account is found by its address: a 32-byte public key, written in base58",
    ),

  "core/accounts/system-account@sm": (p) =>
    ownedAccountSm(p, {
      name: "Wallet Account",
      owner: "System Program",
      executable: "false",
      lamports: "1,000,000",
      dataValue: "empty",
      label:
        "A wallet account: owned by the System Program, not executable, holding 1,000,000 lamports and no data",
    }),

  "core/accounts/program-account-simple@sm": (p) =>
    ownedAccountSm(p, {
      name: "Program",
      owner: "BPF Loader",
      executable: "true",
      data: "Program code",
      fields: [["format", "sBPF ELF"]],
      label:
        "A program account: owned by a loader, executable, with program code as its data",
    }),

  "core/tokens/token-program@sm": (p) =>
    ownedAccountSm(p, {
      name: "Token Program",
      owner: "BPF Loader",
      executable: "true",
      data: "Program code",
      fields: [["format", "sBPF ELF"]],
      label:
        "The Token Program account: owned by a loader, executable, with program code as its data",
    }),

  "core/tokens/mint-account@sm": (p) =>
    ownedAccountSm(p, {
      name: "Mint Account",
      owner: "Token Program",
      executable: "false",
      data: "Mint data",
      fields: [
        ["supply", "u64"],
        ["decimals", "u8"],
        ["mint authority", "Pubkey?"],
        ["freeze authority", "Pubkey?"],
      ],
      label:
        "A mint account: owned by the Token Program, with supply, decimals and authorities as its data",
    }),

  "core/tokens/token-account@sm": (p) =>
    ownedAccountSm(p, {
      name: "Token Account",
      owner: "Token Program",
      executable: "false",
      data: "Token account data",
      fields: [
        ["mint", "Pubkey"],
        ["owner", "Pubkey"],
        ["amount", "u64"],
      ],
      label:
        "A token account: owned by the Token Program, with mint, owner and amount as its data",
    }),

  "core/accounts/data-account@sm": (p) => {
    // Owner above, as in the other phone figures: loader, program, data.
    const mk = (y, title, owner, exec, data, accent) =>
      p.card({
        x: SX,
        y,
        w: SC,
        title,
        accent,
        rows: [
          ["owner", owner],
          ["executable", exec],
          ["lamports", "u64"],
          ["data", data],
        ],
      });
    const loader = mk(24, "BPF Loader", "Native Loader", "true", "loader code");
    const prog = mk(
      loader.bottom + 48,
      "Program",
      "BPF Loader",
      "true",
      "program code",
    );
    const acct = mk(
      prog.bottom + 48,
      "Data Account",
      "Program",
      "false",
      "program state",
      true,
    );
    for (const [from, to] of [
      [acct, prog],
      [prog, loader],
    ])
      p.edge(
        [
          [SX + 40, from.y],
          [SX + 40, to.bottom],
        ],
        { label: "owner" },
      );
    return [
      SW,
      acct.bottom + 24,
      "A data account stores state; its owner field names the program that can change it, and that program is in turn owned by its loader",
    ];
  },

  "core/accounts/program-account-expanded@sm": (p) =>
    chainSm(
      p,
      [
        {
          title: "Program",
          tag: "program account",
          rows: [
            ["owner", "Upgradeable Loader"],
            ["executable", "true"],
            ["lamports", "u64"],
            ["data", "programdata address"],
          ],
        },
        {
          edge: "points to",
          dashed: true,
          title: "Program Data",
          tag: "account",
          accent: true,
          rows: [
            ["owner", "Upgradeable Loader"],
            ["executable", "false"],
            ["lamports", "u64"],
            ["data", "program code"],
          ],
        },
      ],
      "An upgradeable program: the program account stores the address of a separate program data account, which holds the code",
    ),

  "core/transactions/transaction-simple@sm": (p) => {
    const c = p.c;
    const words = ["zero", "one", "two", "three"];
    const w = 232;
    const tx = (y, ins, accent) => {
      const h = HEAD + ins.length * ROW;
      p.rect(SX, y, w, h, accent ? { stroke: c.accent, sw: 1.25 } : {});
      p.text(SX + 16, y + HEAD / 2, "Transaction", { size: 13, weight: 500 });
      p.text(
        SX + w - 16,
        y + HEAD / 2,
        `${words[ins.length]} instruction${ins.length > 1 ? "s" : ""}`,
        {
          anchor: "end",
          fill: accent ? c.accent : c.ink3,
        },
      );
      ins.forEach((s, i) => {
        const iy = y + HEAD + i * ROW;
        p.hline(SX + (accent ? 1.25 : 1), SX + w - (accent ? 1.25 : 1), iy);
        p.text(SX + 16, iy + ROW / 2, String(i), { mono: true, fill: c.ink3 });
        p.text(SX + 40, iy + ROW / 2, s, { fill: c.ink2 });
      });
      return { y, bottom: y + h };
    };
    const b1 = tx(24, ["Instruction"]);
    const b2 = tx(
      b1.bottom + 24,
      ["Instruction", "Instruction", "Instruction"],
      true,
    );
    const bx = SX + w + 12;
    p.span({
      x: bx,
      y1: b2.y + HEAD + 4,
      y2: b2.bottom - 4,
      label: "",
      accent: true,
    });
    p.text(bx + GAP, (b2.y + HEAD + b2.bottom) / 2 - 8, "all or", {
      fill: c.accent,
    });
    p.text(bx + GAP, (b2.y + HEAD + b2.bottom) / 2 + 8, "none", {
      fill: c.accent,
    });
    return [
      SW,
      b2.bottom + 24,
      "Two transactions: one with a single instruction, one with three instructions that execute atomically",
    ];
  },

  "core/transactions/tx_format@sm": (p) =>
    chainSm(
      p,
      [
        {
          title: "Transaction",
          tag: "struct",
          rows: [
            ["signatures", "Vec<Signature>"],
            ["message", "Message"],
          ],
        },
        {
          edgeAccent: true,
          title: "Message",
          tag: "struct",
          accent: true,
          rows: [
            ["header", "MessageHeader"],
            ["account_keys", "Vec<Pubkey>"],
            ["recent_blockhash", "Hash"],
            ["instructions", "Vec<Instruction>"],
          ],
        },
      ],
      "A transaction has two parts: the signatures, and the message they sign",
    ),

  "core/transactions/issues_with_legacy_txs@sm": (p) => {
    const c = p.c;
    // The strip turned on its side: one row per field.
    const x = SX + 24,
      w = 200,
      RH = 40;
    const cells = [
      ["signatures", "n × 64 bytes"],
      ["header", "3 bytes"],
      ["account keys", "n × 32 bytes"],
      ["blockhash", "32 bytes"],
      ["instructions", "the rest"],
    ];
    const top = 24;
    p.rect(x, top, w, cells.length * RH);
    cells.forEach(([t, sz], i) => {
      const ry = top + i * RH;
      if (i) p.hline(x + 1, x + w - 1, ry, { stroke: c.line });
      p.text(x + 12, ry + RH / 2, t, { size: 13, weight: 500 });
      p.value(x + w - 12, ry + RH / 2, sz, { anchor: "end", fill: c.ink2 });
    });
    const bottom = top + cells.length * RH;
    const bx = x + w + 12;
    p.span({ x: bx, y1: top + 4, y2: top + RH - 4, label: "Signatures" });
    p.span({ x: bx, y1: top + RH + 4, y2: bottom - 4, label: "Message" });
    // The limit: one vertical dimension line beside the whole strip.
    p.edge(
      [
        [SX + 8, top + 1],
        [SX + 8, bottom - 1],
      ],
      { accent: true, both: true },
    );
    p.text(SX, bottom + 24, "1,232 bytes in total, the size of one packet", {
      fill: c.accent,
    });
    return [
      SW,
      bottom + 24 + 24,
      "A legacy transaction, signatures and message together, must fit in one 1,232-byte packet",
    ];
  },

  "core/transactions/message_header@sm": (p) => {
    const hdr = p.card({
      x: SX,
      y: 24,
      w: SC,
      title: "MessageHeader",
      tag: "3 bytes",
      accent: true,
      rows: [
        ["num_required_signatures", "u8", { sub: "accounts that must sign" }],
        [
          "num_readonly_signed_accounts",
          "u8",
          { sub: "of those, accounts that are read-only" },
        ],
        [
          "num_readonly_unsigned_accounts",
          "u8",
          { sub: "non-signers that are read-only" },
        ],
      ],
    });
    return [
      SW,
      hdr.bottom + 24,
      "The message header: three one-byte counts that give each account in account_keys its permissions",
    ];
  },

  "core/transactions/compat_array_of_account_addresses@sm": (p) => {
    // Rows carry the header count that covers them as a second line; the
    // focal count (signers) is the accent bracket.
    const keys = p.card({
      x: SX,
      y: 24,
      w: SC - 28,
      title: "Account addresses",
      tag: "in order",
      rows: [
        [
          "signer, writable",
          null,
          { index: 1, sub: "num_required_signatures" },
        ],
        [
          "signer, read-only",
          null,
          { index: 2, sub: "and num_readonly_signed_accounts" },
        ],
        ["non-signer, writable", null, { index: 3, sub: "neither count" }],
        [
          "non-signer, read-only",
          null,
          { index: 4, sub: "num_readonly_unsigned_accounts" },
        ],
      ],
    });
    const [r1, r2] = keys.rows;
    p.span({
      x: keys.right + 16,
      y1: r1.top + 6,
      y2: r2.bottom - 6,
      label: "",
      accent: true,
    });
    return [
      SW,
      keys.bottom + 24,
      "Account addresses are ordered signer-writable, signer-read-only, non-signer-writable, non-signer-read-only; the header counts mark the boundaries",
    ];
  },

  "core/transactions/compact_array_of_ixs@sm": (p) =>
    chainSm(
      p,
      [
        {
          title: "Instructions",
          tag: "compact array",
          rows: [
            ["length", "compact-u16"],
            ["instruction", "CompiledInstruction", { index: 0 }],
            ["instruction", "CompiledInstruction", { index: 1 }],
            ["instruction", "CompiledInstruction", { index: 2 }],
          ],
        },
        {
          edgeAccent: true,
          title: "CompiledInstruction",
          accent: true,
          rows: [
            ["program_id_index", "u8"],
            ["accounts", "Vec<u8>"],
            ["data", "Vec<u8>"],
          ],
        },
      ],
      "The instructions field: a length, then each compiled instruction, which names its program and accounts by index into account_keys",
    ),

  "core/transactions/compact_array_format@sm": (p) => {
    const s = p.strip({
      x: SX,
      y: 24,
      cells: [
        { w: 104, title: "length", sub: "compact-u16", accent: true },
        { w: 72, title: "item 0" },
        { w: 72, title: "item 1" },
        { w: 56, title: "…", dim: true },
      ],
    });
    return [
      SW,
      s.bottom + 24,
      "A compact array: a compact-u16 length, then the items",
    ];
  },

  "core/transactions/instruction@sm": (p) =>
    chainSm(
      p,
      [
        {
          title: "Transaction",
          rows: [
            ["signatures", "Vec<Signature>"],
            ["instruction", "Instruction"],
          ],
        },
        {
          edgeAccent: true,
          title: "Instruction",
          accent: true,
          rows: [
            ["program_id", "Pubkey", { sub: "program to call" }],
            [
              "accounts",
              "Vec<AccountMeta>",
              { sub: "accounts it reads and writes" },
            ],
            ["data", "Vec<u8>", { sub: "arguments" }],
          ],
        },
      ],
      "An instruction names the program to call, the accounts it uses and the data it passes",
    ),

  "core/transactions/accountmeta@sm": (p) => {
    const tx = p.card({ x: SX, y: 24, w: SC, title: "Transaction" });
    const ix = p.card({
      x: SX,
      y: tx.bottom + 48,
      w: SC,
      title: "Instruction",
      rows: [
        ["program_id", "Pubkey"],
        ["accounts", "Vec<AccountMeta>"],
        ["data", "Vec<u8>"],
      ],
    });
    p.edge(
      [
        [SX + 40, tx.bottom],
        [SX + 40, ix.y],
      ],
      { label: "has" },
    );
    const meta = (x, who, signer, accent) =>
      p.card({
        x,
        y: ix.bottom + 56,
        w: SH,
        title: "AccountMeta",
        desc: who,
        accent,
        rows: [
          ["pubkey", "Pubkey"],
          ["is_signer", signer],
          ["is_writable", "true"],
        ],
      });
    const a = meta(SX, "sender", "true", true);
    const b = meta(SX2, "receiver", "false");
    forkSm(p, ix, ix.cx, a);
    forkSm(p, ix, ix.cx, b);
    return [
      SW,
      a.bottom + 24,
      "An instruction's accounts field is a list of AccountMeta: each names an account and whether it signs and is written",
    ];
  },

  "core/transactions/sol-transfer@sm": (p) => {
    const wallet = p.card({ x: SX, y: 24, w: SC, title: "Sender wallet" });
    const tx = p.card({
      x: SX,
      y: wallet.bottom + 48,
      w: SC,
      title: "Transaction",
      rows: [
        ["signer", "Sender"],
        ["instruction", "Transfer"],
        ["blockhash", "Hash"],
      ],
    });
    p.edge(
      [
        [SX + 40, wallet.bottom],
        [SX + 40, tx.y],
      ],
      { label: "signs, sends" },
    );
    const ix = p.card({
      x: SX,
      y: tx.bottom + 48,
      w: SC,
      title: "Transfer",
      tag: "instruction",
      accent: true,
      rows: [
        ["program", "System Program"],
        ["accounts", "2 AccountMeta", { code: false }],
        ["data", "amount"],
      ],
    });
    p.edge([
      [SX + 40, tx.bottom],
      [SX + 40, ix.y],
    ]);
    const meta = (x, who, signer) =>
      p.card({
        x,
        y: ix.bottom + 56,
        w: SH,
        title: who,
        rows: [
          ["is_signer", signer],
          ["is_writable", "true"],
        ],
      });
    const a = meta(SX, "Sender", "true");
    const b = meta(SX2, "Receiver", "false");
    forkSm(p, ix, ix.cx, a);
    forkSm(p, ix, ix.cx, b);
    return [
      SW,
      a.bottom + 24,
      "A SOL transfer: the sender signs a transaction whose transfer instruction lists the sender as a writable signer and the receiver as writable",
    ];
  },

  "core/transactions/sol-transfer-process@sm": (p) => {
    const tx = p.card({
      x: SX,
      y: 24,
      w: SC,
      title: "Transaction",
      tag: "signed by the sender",
      rows: [["instruction", "Transfer"]],
    });
    const sys = p.card({
      x: SX,
      y: tx.bottom + 48,
      w: SC,
      title: "System Program",
      tag: "program",
      accent: true,
    });
    p.edge(
      [
        [SX + 40, tx.bottom],
        [SX + 40, sys.y],
      ],
      { label: "invokes" },
    );
    const acct = (x, name, change) =>
      p.card({
        x,
        y: sys.bottom + 64,
        w: SH,
        title: name,
        rows: [["lamports", change]],
      });
    const s = acct(SX, "Sender", "− amount");
    const r = acct(SX2, "Receiver", "+ amount");
    forkSm(p, sys, sys.cx, s, { label: "debits" });
    forkSm(p, sys, sys.cx, r, { label: "credits" });
    return [
      SW,
      s.bottom + 24,
      "Processing a SOL transfer: the System Program debits the sender's lamports and credits the receiver's",
    ];
  },

  "core/pda/pda@sm": (p) =>
    chainSm(
      p,
      [
        {
          title: "Inputs",
          desc: "seeds and a program ID",
          rows: [
            ["seeds", '"vault", user'],
            ["program id", "Prog…1111"],
          ],
        },
        {
          title: "Derive",
          desc: "findProgramAddress",
          rows: [
            ["bump", "255, 254, …"],
            ["until", "off curve"],
          ],
        },
        {
          edgeAccent: true,
          title: "PDA",
          desc: "off the Ed25519 curve",
          accent: true,
          rows: [
            ["address", "9fXw…k2Qe"],
            ["bump", "254"],
          ],
        },
        {
          edge: "address of",
          dashed: true,
          title: "Account",
          rows: [["owner", "the program"]],
        },
      ],
      "A program derived address: seeds and a program ID go through findProgramAddress to produce an off-curve address and bump",
    ),

  "core/pda/pda-derivation@sm": (p) => {
    const w = 208;
    const a = p.card({
      x: SX,
      y: 24,
      w,
      title: "Start at bump 255",
      desc: ["findProgramAddress(", "  seeds, programId)"],
    });
    const b = p.card({
      x: SX,
      y: a.bottom + 40,
      w,
      title: "Create a candidate",
      desc: ["createProgramAddress(", "  seeds, bump,", "  programId)"],
    });
    const chk = p.card({
      x: SX,
      y: b.bottom + 40,
      w: 184,
      title: "Off the Ed25519 curve?",
      dash: "4 4",
    });
    const ret = p.card({
      x: SX,
      y: chk.bottom + 40,
      w,
      title: "Return",
      desc: "(pda, bump)",
      accent: true,
    });
    const dec = p.card({
      x: SW - SX - 88,
      y: chk.y,
      w: 88,
      title: "Next",
      desc: "bump − 1",
    });
    const vx = SX + 40;
    p.edge([
      [vx, a.bottom],
      [vx, b.y],
    ]);
    p.edge([
      [vx, b.bottom],
      [vx, chk.y],
    ]);
    p.edge(
      [
        [vx, chk.bottom],
        [vx, ret.y],
      ],
      { label: "yes", accent: true },
    );
    p.edge(
      [
        [chk.right, chk.headY],
        [dec.x, chk.headY],
      ],
      { label: "no" },
    );
    p.edge(
      [
        [dec.cx, dec.y],
        [dec.cx, b.headY],
        [b.right, b.headY],
      ],
      { label: "again", seg: 0, side: "before" },
    );
    return [
      SW,
      ret.bottom + 24,
      "Deriving a PDA: start at bump 255 and count down until the address falls off the Ed25519 curve, then return the address and bump",
    ];
  },

  "core/pda/address-on-curve@sm": (p) => {
    const at = ed25519(p, { x0: 32, y0: 32, x1: SW - 32, y1: 344 });
    const card = (y, title, addr, bal) => {
      const k = p.card({
        x: SW - SX - 192,
        y,
        w: 192,
        title,
        tag: "on curve",
        rows: [
          ["address", addr],
          ["balance", bal],
        ],
      });
      const ty = k.rows[0].y;
      let lo = 0,
        hi = 1;
      for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        if (at(mid)[1] < ty) lo = mid;
        else hi = mid;
      }
      const [px, py] = at(lo);
      p.edge(
        [
          [px + 6, py],
          [k.x, py],
        ],
        { head: false },
      );
      p.dot(px, py);
      return k;
    };
    card(48, "Alice's wallet", "4Nd1…Bm5a", "15 SOL");
    card(176, "Bob's wallet", "9WzD…AWWM", "27 SOL");
    return [
      SW,
      376,
      "Two wallet addresses: public keys that are points on the Ed25519 curve, each with a private key that can sign",
    ];
  },

  "core/pda/address-off-curve@sm": (p) => {
    // The program sits on the curve; seed and program ID feed the
    // derivation below, which lands off it.
    const at = ed25519(p, { x0: 32, y0: 32, x1: 184, y1: 160 });
    const prog = p.card({
      x: SW - SX - 208,
      y: 56,
      w: 208,
      title: "Counter program",
      rows: [["address", "Coun…1111"]],
    });
    let lo = 0,
      hi = 1;
    for (let k = 0; k < 40; k++) {
      const mid = (lo + hi) / 2;
      if (at(mid)[1] < prog.rows[0].y) lo = mid;
      else hi = mid;
    }
    const [px, py] = at(lo);
    p.dot(px, py);
    p.edge(
      [
        [px + 6, prog.rows[0].y],
        [prog.x, prog.rows[0].y],
      ],
      { head: false },
    );
    const seed = p.card({
      x: SX,
      y: 192,
      w: SH,
      title: "Seed",
      rows: [["string", '"global"']],
    });
    const fn = p.card({
      x: SX,
      y: seed.bottom + 48,
      w: SC,
      title: "Derive",
      desc: "findProgramAddress",
    });
    const pda = p.card({
      x: SX,
      y: fn.bottom + 48,
      w: SC,
      title: "PDA",
      tag: "off curve",
      accent: true,
      rows: [
        ["address", "7xKX…gAsU"],
        ["count", "126"],
      ],
    });
    p.edge(
      [
        [SX + 40, seed.bottom],
        [SX + 40, fn.y],
      ],
      { label: "seed" },
    );
    const gx = SX2 + 40;
    p.edge(
      [
        [gx, prog.bottom],
        [gx, fn.y],
      ],
      { label: "program ID" },
    );
    p.edge(
      [
        [SX + 40, fn.bottom],
        [SX + 40, pda.y],
      ],
      { label: "derives" },
    );
    return [
      SW,
      pda.bottom + 24,
      "A PDA: derived from a seed and the program's address, it falls off the Ed25519 curve, so no private key exists for it",
    ];
  },

  "core/cpi/cpi@sm": (p) =>
    chainSm(
      p,
      [
        { title: "Wallet", tag: "signer" },
        {
          edge: "signs, sends",
          title: "Transaction",
          rows: [["instruction", "Program A"]],
        },
        { edge: "invokes", title: "Program A", rows: [["stack height", "1"]] },
        {
          edge: "CPI",
          edgeAccent: true,
          title: "Program B",
          accent: true,
          rows: [["stack height", "2"]],
        },
      ],
      "Cross-program invocation: a wallet signs a transaction whose instruction invokes Program A, which invokes Program B",
    ),

  "diagrams/core-concepts@sm": (p) => {
    // Two columns, three rows; title-only cards; labelled edges.
    const cw = 120,
      ax = SX,
      bx = SW - SX - cw,
      ys = [24, 120, 216];
    const k = (x, y, title, accent) => p.card({ x, y, w: cw, title, accent });
    const tx = k(ax, ys[0], "Transactions");
    const fees = k(bx, ys[0], "Fees");
    const prog = k(ax, ys[1], "Programs", true);
    const acc = k(bx, ys[1], "Accounts");
    const pda = k(ax, ys[2], "PDAs");
    const cpi = k(bx, ys[2], "CPIs");
    p.edge(
      [
        [tx.right, tx.headY],
        [fees.x, tx.headY],
      ],
      { label: "pay" },
    );
    p.edge(
      [
        [prog.right, prog.headY],
        [acc.x, prog.headY],
      ],
      { both: true, label: "read, write" },
    );
    p.edge(
      [
        [ax + 24, tx.bottom],
        [ax + 24, prog.y],
      ],
      { label: "call" },
    );
    p.edge(
      [
        [ax + 24, prog.bottom],
        [ax + 24, pda.y],
      ],
      { label: "derive" },
    );
    const band = (prog.bottom + cpi.y) / 2;
    p.edge(
      [
        [ax + cw - 24, prog.bottom],
        [ax + cw - 24, band],
        [cpi.cx, band],
        [cpi.cx, cpi.y],
      ],
      { label: "invoke", seg: 2 },
    );
    return [
      SW,
      pda.bottom + 24,
      "Core concepts: accounts store state, programs hold logic, transactions carry instructions that call programs and pay fees; programs derive PDAs and invoke other programs through CPIs",
    ];
  },

  "diagrams/solana-overview@sm": (p) => {
    const label =
      "Payment, game, and market apps connect to Solana, a network made up of computers working together.";
    const aw = (SC - 16) / 3;
    const apps = ["Payments", "Games", "Markets"].map((title, i) =>
      p.card({ x: SX + i * (aw + 8), y: 24, w: aw, title }),
    );
    const ny = apps[0].bottom + 48;
    const cw = 80,
      gap = 16,
      ch = 40;
    const net = p.card({
      x: SX,
      y: ny,
      w: SC,
      title: "Solana network",
      desc: "Computers working together",
      accent: true,
      minH: HEAD_DESC + 2 * ch + gap + 24,
    });
    apps.forEach((a) =>
      p.edge([
        [a.cx, a.bottom],
        [a.cx, net.y],
      ]),
    );
    const x0 = SX + (SC - (3 * cw + 2 * gap)) / 2;
    const ys = [ny + HEAD_DESC, ny + HEAD_DESC + ch + gap];
    for (const y of ys)
      for (let i = 0; i < 3; i++) {
        const x = x0 + i * (cw + gap);
        p.rect(x, y, cw, ch);
        p.text(x + 12, y + ch / 2, "Computer", { fill: p.c.ink2 });
        if (i < 2)
          p.edge(
            [
              [x + cw, y + ch / 2],
              [x + cw + gap, y + ch / 2],
            ],
            { head: false },
          );
      }
    for (let i = 0; i < 3; i++) {
      const x = x0 + i * (cw + gap) + cw / 2;
      p.edge(
        [
          [x, ys[0] + ch],
          [x, ys[1]],
        ],
        { head: false },
      );
    }
    // The links sit inside the network card: lift them above its fill.
    for (let i = 0; i < 7; i++) p.front.push(p.back.pop());
    return [SW, net.bottom + 24, label];
  },

  "diagrams/solana-layers@sm": (p) => {
    // The same layers, restacked: three validators, program and state
    // cards side by side (8px inner margin so the longest row fits).
    const c = p.c;
    const ix = SX + 8,
      iw = SC - 16;
    const vw = 88,
      vgap = (iw - 3 * vw) / 2,
      vh = 40;
    const ndesc = [
      "Validators: computers that each keep",
      "the same copy of every account",
    ];
    const nhead = HEAD_DESC + 18;
    const vy = 24 + nhead;
    const ay = vy + vh + 24;
    const cy = ay + 48;
    const cw = (iw - 8) / 2;
    const cardH = HEAD_DESC + 2 * ROW;
    const net = p.card({
      x: SX,
      y: 24,
      w: SC,
      title: "Solana network",
      tag: "onchain",
      desc: ndesc,
      accent: true,
      minH: cy + cardH + 8 - 24,
    });
    const nodes = [];
    for (let i = 0; i < 3; i++) {
      const nx = ix + i * (vw + vgap);
      p.rect(nx, vy, vw, vh);
      p.text(nx + 16, vy + vh / 2, "Validator", { fill: c.ink2 });
      nodes.push(nx);
    }
    for (let i = 0; i < 2; i++)
      p.edge(
        [
          [nodes[i] + vw, vy + vh / 2],
          [nodes[i + 1], vy + vh / 2],
        ],
        { head: false },
      );
    for (let i = 0; i < 2; i++) p.front.push(p.back.pop());
    p.hline(SX + 1.25, SX + SC - 1.25, ay - 12);
    p.text(ix + 8, ay + 8, "Accounts", { size: 13, weight: 500 });
    p.text(ix + 8, ay + 26, "Store data, like files on a computer", {
      fill: c.ink2,
    });
    const prog = p.card({
      x: ix,
      y: cy,
      w: cw,
      title: "Programs",
      desc: "Executable code",
      rows: [["Your program"], ["Token Program"]],
    });
    const state = p.card({
      x: ix + cw + 8,
      y: cy,
      w: cw,
      title: "State",
      desc: "Data",
      rows: [["Token balances"], ["Your program’s data"]],
    });
    const apy = net.bottom + 80;
    const bw = (iw - 16) / 3;
    const adesc = ["Your code: websites, mobile apps,", "and servers"];
    const ahead = HEAD_DESC + 18;
    const apps = p.card({
      x: SX,
      y: apy,
      w: SC,
      title: "Apps",
      tag: "offchain",
      desc: adesc,
      minH: ahead + 40 + 8,
    });
    ["Payments", "Games", "Markets"].forEach((t, i) => {
      const bx = ix + i * (bw + 8);
      p.rect(bx, apy + ahead, bw, 40);
      p.text(bx + 12, apy + ahead + 20, t, { fill: c.ink2 });
    });
    const tx = prog.x + 24,
      rx = state.x + 24;
    p.edge([
      [tx, apps.y],
      [tx, prog.bottom],
    ]);
    p.edge(
      [
        [rx, apps.y],
        [rx, state.bottom],
      ],
      { dashed: true },
    );
    p.front.push(p.back.pop(), p.back.pop());
    const ly = net.bottom + 24;
    p.text(tx + GAP, ly, "send transactions", { fill: c.ink2 });
    p.text(tx + GAP, ly + 18, "through RPC", { fill: c.ink2 });
    p.text(rx + GAP, ly, "read accounts", { fill: c.ink2 });
    p.text(rx + GAP, ly + 18, "through RPC", { fill: c.ink2 });
    const wal = p.card({
      x: SX,
      y: apps.bottom + 56,
      w: SC,
      title: "Wallets",
      tag: "offchain",
      desc: ["Hold users’ keys: sign in and", "approve transactions"],
    });
    const usr = p.card({
      x: SX,
      y: wal.bottom + 56,
      w: SC,
      title: "Users",
      desc: "People using your app",
    });
    p.edge(
      [
        [tx, wal.y],
        [tx, apps.bottom],
      ],
      { label: "sign" },
    );
    p.edge(
      [
        [tx, usr.y],
        [tx, wal.bottom],
      ],
      { label: "approve" },
    );
    return [SW, usr.bottom + 24, LAYERS_LABEL];
  },

  "diagrams/transaction-flow@sm": (p) => {
    // The sequence, top to bottom: a lane key, then numbered steps, each
    // with its lane badges (from, to) and one plain sentence.
    const c = p.c;
    const badge = (x, y, i) => {
      const l = LANES[i];
      const w = l.title.length * 5.9 + 16;
      p.rect(x, y, w, 24, {
        stroke: l.yours ? c.accent : c.line,
        sw: l.yours ? 1.25 : 1,
      });
      p.text(x + 8, y + 12, l.title, { fill: l.yours ? c.accent : c.ink });
      return x + w;
    };
    let y = 24;
    LANES.forEach((l, i) => {
      badge(SX, y, i);
      p.text(SX + 120, y + 12, l.desc.join(" "), { fill: c.ink2 });
      y += 32;
    });
    y += 8;
    p.hline(SX, SW - SX, y);
    y += 24;
    let k = 0,
      atomicTop = 0;
    for (const s of SEQ) {
      if (s.atomic === "start") {
        atomicTop = y;
        p.text(SX + 34, y + 20, "Atomic: all or nothing", {
          size: 13,
          weight: 500,
        });
        y += 44;
        continue;
      }
      if (s.atomic === "end") {
        p.rect(SX + 24, atomicTop, SW - 8 - SX - 24, y - 4 - atomicTop, {
          fill: "none",
          stroke: c.line,
          dash: "3 3",
          layer: p.back,
        });
        y += 20;
        continue;
      }
      k++;
      p.text(SX, y + 12, String(k), { mono: true, fill: c.ink3 });
      let bx = badge(SX + 34, y, s.from);
      if (!s.self) {
        p.edge(
          [
            [bx + 4, y + 12],
            [bx + 24, y + 12],
          ],
          { dashed: s.ret },
        );
        badge(bx + 28, y, s.to);
      }
      s.step.forEach((t, i) =>
        p.text(SX + 34, y + 24 + 18 + i * 18, t, { size: 13 }),
      );
      y += 24 + 18 * s.step.length + 26;
    }
    return [SW, y, FLOW_LABEL];
  },

  "core/fees/fees@sm": (p) => {
    const c = p.c;
    const col = (y, card, note) => {
      const k = p.card({ x: SX, y, w: SC, ...card });
      p.text(SX, k.bottom + 20, note, { fill: c.ink2 });
      return k.bottom + 20;
    };
    let y = col(
      24,
      {
        title: "Base fee",
        tag: "required",
        rows: [
          ["per signature", "5,000 lamports"],
          ["signatures", "one or more"],
        ],
      },
      "Half burned, half to the validator.",
    );
    p.op(SW / 2, y + 28, "+");
    y = col(
      y + 56,
      {
        title: "Prioritization fee",
        tag: "optional",
        rows: [
          ["CU price", "set by you"],
          ["CU limit", "set by you"],
        ],
      },
      "All of it to the validator.",
    );
    p.op(SW / 2, y + 28, "=");
    y = col(
      y + 56,
      {
        title: "Transaction fee",
        accent: true,
        rows: [
          ["paid in", "SOL"],
          ["paid by", "fee payer"],
        ],
      },
      "Charged even if it fails.",
    );
    return [
      SW,
      y + 24,
      "A transaction fee is the base fee of 5,000 lamports per signature plus an optional prioritization fee of compute unit price times compute unit limit",
    ];
  },

  "core/tokens/token-account-relationship@sm": (p) => {
    const sys = p.card({ x: SX, y: 24, w: SH, title: "System Program" });
    const tok = p.card({ x: SX2, y: 24, w: SH, title: "Token Program" });
    const wallet = p.card({ x: SX, y: 120, w: SH, title: "Wallet Account" });
    const mint = p.card({ x: SX2, y: 120, w: SH, title: "Mint Account" });
    const ta = p.card({
      x: SX,
      y: 232,
      w: SC,
      title: "Token Account",
      accent: true,
      rows: [
        ["mint", "Mint Account"],
        ["owner", "Wallet Account"],
        ["amount", "u64"],
      ],
    });
    p.edge(
      [
        [SX + 24, sys.bottom],
        [SX + 24, wallet.y],
      ],
      { label: "owns" },
    );
    p.edge(
      [
        [SX2 + 24, tok.bottom],
        [SX2 + 24, mint.y],
      ],
      { label: "owns" },
    );
    // Token Program -> Token Account through the gutter.
    const gx = SX + SH + 8;
    p.edge([
      [tok.x, tok.headY],
      [gx, tok.headY],
      [gx, ta.y],
    ]);
    p.edge(
      [
        [SX + 96, ta.y],
        [SX + 96, wallet.bottom],
      ],
      { dashed: true, label: "owner" },
    );
    p.edge(
      [
        [SX2 + 96, ta.y],
        [SX2 + 96, mint.bottom],
      ],
      { dashed: true, label: "mint" },
    );
    return [
      SW,
      ta.bottom + 24,
      "Account relationships: the System Program owns the wallet; the Token Program owns the token account and the mint; the token account's mint and owner fields point to the mint and the wallet",
    ];
  },

  "core/tokens/associated-token-account@sm": (p) => {
    const wallet = p.card({ x: SX, y: 24, w: SH, title: "Wallet Account" });
    const mint = p.card({ x: SX2, y: 24, w: SH, title: "Mint Account" });
    const fx = SX + 56,
      fw = SC - 112;
    const fn = p.card({
      x: fx,
      y: wallet.bottom + 48,
      w: fw,
      title: "Derive",
      desc: "findProgramAddress",
    });
    const ata = p.card({
      x: fx,
      y: fn.bottom + 48,
      w: fw,
      title: "ATA",
      tag: "associated",
      accent: true,
      rows: [
        ["mint", "Mint Account"],
        ["owner", "Wallet"],
        ["amount", "u64"],
      ],
    });
    p.edge(
      [
        [fx + 24, wallet.bottom],
        [fx + 24, fn.y],
      ],
      { label: "seed" },
    );
    p.edge(
      [
        [fx + fw - 24, mint.bottom],
        [fx + fw - 24, fn.y],
      ],
      { label: "seed", side: "before" },
    );
    p.edge(
      [
        [fn.cx, fn.bottom],
        [fn.cx, ata.y],
      ],
      { accent: true, label: "address" },
    );
    p.edge(
      [
        [ata.x, ata.rows[1].y],
        [SX + 24, ata.rows[1].y],
        [SX + 24, wallet.bottom],
      ],
      { dashed: true },
    );
    p.edge(
      [
        [ata.right, ata.rows[0].y],
        [SW - SX - 24, ata.rows[0].y],
        [SW - SX - 24, mint.bottom],
      ],
      { dashed: true },
    );
    return [
      SW,
      ata.bottom + 24,
      "Associated token account: its address is a PDA derived from the wallet and the mint; its mint and owner fields point back to them",
    ];
  },

  "core/tokens/token-account-relationship-ata@sm": (p) => {
    // One card per wallet and mint pair, in reading order.
    let y = 24;
    for (const [r, wName] of ["Wallet 1", "Wallet 2"].entries())
      for (const [k, m] of ["Mint A", "Mint B"].entries()) {
        const card = p.card({
          x: SX,
          y,
          w: SC,
          title: "Associated Token Account",
          accent: r === 0 && k === 0,
          rows: [
            ["mint", m],
            ["owner", wName],
          ],
        });
        y = card.bottom + 16;
      }
    return [
      SW,
      y + 8,
      "Two wallets and two mints give four associated token accounts, one for each wallet and mint pair",
    ];
  },

  "diagrams/assets-overview@sm": (p) => {
    const wallet = p.card({
      x: SX,
      y: 24,
      w: SC,
      title: "Wallet or app",
      desc: "Signs instructions",
    });
    const prog = p.card({
      x: SX,
      y: wallet.bottom + 48,
      w: SC,
      title: "Token Program",
      desc: "Applies the rules",
      accent: true,
    });
    p.edge(
      [
        [SX + 40, wallet.bottom],
        [SX + 40, prog.y],
      ],
      { label: "signs" },
    );
    const mint = p.card({
      x: SX,
      y: prog.bottom + 56,
      w: SH,
      title: "Mint Account",
      desc: "Supply",
    });
    const accts = p.card({
      x: SX2,
      y: prog.bottom + 56,
      w: SH,
      title: "Token Accounts",
      desc: "Balances",
      rows: [
        ["Alice", "90"],
        ["Bob", "10"],
      ],
    });
    forkSm(p, prog, prog.cx, mint);
    forkSm(p, prog, prog.cx, accts);
    return [
      SW,
      accts.bottom + 24,
      "The Token Program updates a mint and its token accounts while owners authorize balance changes",
    ];
  },

  "payments/payment-flow@sm": (p) => {
    const c = p.c;
    const ledger = (y, title, rows) => {
      const x = SX,
        w = SC,
        sub = 28;
      const h = HEAD + sub + rows.length * ROW;
      p.rect(x, y, w, h);
      p.text(x + 16, y + HEAD / 2, title, { size: 13, weight: 500 });
      p.hline(x + 1, x + w - 1, y + HEAD);
      const bx = x + w - 88,
        ax = x + w - 16;
      p.text(x + 16, y + HEAD + 14, "token account", { fill: c.ink3 });
      p.text(bx, y + HEAD + 14, "before", { fill: c.ink3, anchor: "end" });
      p.text(ax, y + HEAD + 14, "after", { fill: c.ink3, anchor: "end" });
      rows.forEach(([label, before, after], i) => {
        const ry = y + HEAD + sub + i * ROW;
        if (i > 1) p.hline(x + 1, x + w - 1, ry);
        p.text(x + 16, ry + ROW / 2, label, { fill: c.ink2 });
        p.value(bx, ry + ROW / 2, before, {
          anchor: "end",
          fill: after == null ? c.ink : c.ink3,
        });
        if (after != null)
          p.value(ax, ry + ROW / 2, after, {
            anchor: "end",
            fill: i === 0 ? c.accent : c.ink,
          });
      });
      const top = y + HEAD + sub;
      p.front.push(
        `<rect x="${x + 0.625}" y="${top + 0.625}" width="${w - 1.25}" height="${ROW - 1.25}" rx="0" fill="none" stroke="${c.accent}" stroke-width="1.25"/>`,
      );
      return { y, bottom: y + h, rowBottom: top + ROW };
    };
    const s = ledger(24, "Sender's wallet", [
      ["USDG", "100", "90"],
      ["USDC", "50"],
      ["PYUSD", "200"],
    ]);
    const r = ledger(s.bottom + 56, "Receiver's wallet", [
      ["USDG", "45", "55"],
    ]);
    p.edge(
      [
        [SX + 40, s.bottom],
        [SX + 40, r.y],
      ],
      { accent: true, label: "10 USDG" },
    );
    return [
      SW,
      r.bottom + 24,
      "A stablecoin payment: 10 USDG moves from the sender's USDG token account to the receiver's",
    ];
  },
};

/* ----------------------------------------------- phones: older figures
 * Portrait drawings for the figures that predate this script (static SVGs
 * re-themed by brand-diagrams.mjs): the same content restacked for 336px.
 */

/**
 * A box: 13/500 title (optional tag on the right), then 12px lines, each
 * `{ t, mono, dim }` or a string (code when isCode). Returns its geometry.
 */
function boxSm(
  p,
  { x = SX, y, w = SC, title, tag, tagMono, lines = [], accent, dash, pill },
) {
  const c = p.c;
  const ls = lines.map((l) => (typeof l === "string" ? { t: l } : l));
  const h = ls.length ? HEAD_DESC + (ls.length - 1) * 18 : HEAD;
  p.rect(x, y, w, h, {
    stroke: accent ? c.accent : c.line,
    sw: accent ? 1.25 : 1,
    dash,
    r: pill ? Math.min(20, h / 2) : R,
  });
  const ty = ls.length ? y + 23 : y + h / 2;
  p.text(x + 16, ty, title, { size: 13, weight: 500 });
  if (tag)
    p.text(x + w - 16, ty, tag, {
      anchor: "end",
      mono: tagMono ?? isCode(tag),
      fill: c.ink3,
    });
  ls.forEach((l, i) =>
    p.text(x + 16, y + 41 + i * 18, l.t, {
      mono: l.mono ?? isCode(l.t),
      fill: l.dim ? c.ink3 : c.ink2,
    }),
  );
  return { x, y, w, h, bottom: y + h, cx: x + w / 2, cy: y + h / 2, ty };
}

/** Children hung off a spine 12px inside the parent's left edge. */
function hangSm(p, parent, kids, o = {}) {
  // kids: [{ label, dashed, draw: (x, y, w) => box }]
  const sx = parent.x + 12;
  const x = parent.x + 24,
    w = parent.w - 24;
  let y = parent.bottom + 16;
  let last = null;
  for (const k of kids) {
    if (k.label) {
      p.text(x, y + 6, k.label, { fill: p.c.ink2 });
      y += 20;
    }
    const b = k.draw(x, y, w);
    p.edge(
      [
        [sx, parent.bottom],
        [sx, b.ty],
        [x, b.ty],
      ],
      { dashed: k.dashed, head: o.head },
    );
    last = b;
    y = b.bottom + 16;
  }
  return last ? last.bottom : parent.bottom;
}

/** A vertical arrow between two stacked boxes, label after it. */
function dropSm(p, a, b, o = {}) {
  const x = o.x ?? a.x + 40;
  p.edge(
    [
      [x, a.bottom],
      [x, b.y],
    ],
    { label: o.label, dashed: o.dashed, both: o.both, accent: o.accent },
  );
}

/** A figure heading: 13/500 title and a muted line, left-aligned. */
function headSm(p, y, title, sub) {
  p.text(SX, y + 8, title, { size: 13, weight: 500 });
  if (sub) p.text(SX, y + 28, sub, { fill: p.c.ink2 });
  return y + (sub ? 52 : 32);
}

/**
 * A sequence as numbered steps (transaction-flow@sm): sender and receiver
 * badges, a dashed arrow for a reply, then the message as a sentence.
 */
function stepsSm(p, lanes, seq, label) {
  const c = p.c;
  const badge = (x, y, i) => {
    const l = lanes[i];
    const w = l.title.length * 5.9 + 16;
    p.rect(x, y, w, 24, {
      stroke: l.accent ? c.accent : c.line,
      sw: l.accent ? 1.25 : 1,
    });
    p.text(x + 8, y + 12, l.title, { fill: l.accent ? c.accent : c.ink });
    return x + w;
  };
  let y = 24;
  seq.forEach((s, k) => {
    p.text(SX, y + 12, String(k + 1), { mono: true, fill: c.ink3 });
    const bx = badge(SX + 34, y, s.from);
    if (s.to != null) {
      p.edge(
        [
          [bx + 4, y + 12],
          [bx + 24, y + 12],
        ],
        { dashed: s.ret },
      );
      badge(bx + 28, y, s.to);
    }
    s.step.forEach((t, i) =>
      p.text(SX + 34, y + 24 + 18 + i * 18, t, { size: 13 }),
    );
    y += 24 + 18 * s.step.length + 26;
  });
  return [SW, y, label];
}

Object.assign(SM, {
  "tools/kora/kora@sm": (p) =>
    stepsSm(
      p,
      [
        { title: "User" },
        { title: "App" },
        { title: "Kora", accent: true },
        { title: "Solana" },
      ],
      [
        { from: 0, to: 1, step: ["Initiate the transaction."] },
        {
          from: 1,
          to: 0,
          step: [
            "Generate the transaction, including",
            "the fee token transfer instruction.",
          ],
        },
        { from: 0, to: 1, step: ["Sign the transaction."] },
        { from: 1, to: 2, step: ["Send the partially signed transaction."] },
        { from: 2, step: ["Validate it against kora.toml."] },
        {
          from: 2,
          to: 1,
          ret: true,
          step: [
            "The Kora paymaster signs and returns",
            "the fully signed transaction.",
          ],
        },
        { from: 1, to: 3, step: ["Send the transaction."] },
        { from: 3, to: 1, ret: true, step: ["Transaction confirmed."] },
        { from: 1, to: 0, ret: true, step: ["Success notification."] },
        { from: 0, to: 2, ret: true, step: ["SPL token fee transfer."] },
        { from: 2, to: 3, ret: true, step: ["SOL network fee payment."] },
      ],
      "Kora transaction flow, step by step",
    ),

  "action-execution-and-lifecycle@sm": (p) =>
    stepsSm(
      p,
      [
        { title: "User" },
        { title: "Action client", accent: true },
        { title: "Action provider" },
        { title: "Solana" },
      ],
      [
        {
          from: 0,
          to: 1,
          step: ["Scans a QR code, clicks a link", "or a button."],
        },
        { from: 1, to: 2, step: ["GET request for metadata."] },
        {
          from: 2,
          to: 1,
          ret: true,
          step: ["Metadata and available Actions."],
        },
        { from: 1, to: 0, ret: true, step: ["Shows the Action UI."] },
        { from: 0, to: 1, step: ["Chooses an Action."] },
        {
          from: 1,
          to: 2,
          step: ["POST request with the wallet’s", "public key."],
        },
        { from: 2, to: 1, ret: true, step: ["Serialized transaction."] },
        { from: 1, to: 0, ret: true, step: ["Shows transaction details."] },
        { from: 0, to: 1, step: ["Approves the transaction."] },
        { from: 1, to: 3, step: ["Signs and sends the transaction."] },
      ],
      "Solana Actions: execution and lifecycle, step by step",
    ),

  "frontend/sign-in-decision@sm": (p) => {
    const top = boxSm(p, {
      y: 24,
      title: "Wallet connected",
      lines: ["Read the account's features"],
      accent: true,
    });
    const q = boxSm(p, {
      y: top.bottom + 32,
      title: "Supports signOffchainMessage v1?",
      lines: [{ t: "solana:signOffchainMessage", mono: true }],
      dash: "4 4",
    });
    dropSm(p, top, q);
    let raw;
    const end = hangSm(p, q, [
      {
        label: "Yes",
        draw: (x, y, w) =>
          boxSm(p, {
            x,
            y,
            w,
            title: "Sign an offchain message",
            lines: [
              "Readable text on every device,",
              "hardware wallets included",
            ],
          }),
      },
      {
        label: "No",
        draw: (x, y, w) =>
          (raw = boxSm(p, {
            x,
            y,
            w,
            title: "Sign a raw message",
            lines: [
              { t: "solana:signMessage", mono: true },
              "for software wallets; same challenge, raw bytes",
            ],
          })),
      },
    ]);
    const tx = boxSm(p, {
      x: raw.x,
      y: end + 48,
      w: raw.w,
      title: "Sign a sign-in transaction",
      lines: [
        "No message support on the device",
        "Costs a fee and RPC round trips",
      ],
      dash: "4 4",
    });
    dropSm(p, raw, tx, { label: "User opts in: hardware wallet" });
    return [
      SW,
      tx.bottom + 24,
      "Choosing a sign-in method: an offchain message where the wallet supports it, otherwise a raw message, or a sign-in transaction for hardware wallets",
    ];
  },

  "frontend/sign-in-comparison@sm": (p) => {
    const c = p.c;
    const a = p.card({
      x: SX,
      y: 24,
      w: SC,
      title: "Sign-in transaction",
      rows: [
        ["Build", "getLatestBlockhash", { index: 1, sub: "Fetch a blockhash" }],
        ["Sign", null, { index: 2, sub: "Opaque bytes" }],
        ["Simulate", "simulateTransaction", { index: 3, sub: "RPC call" }],
        ["Send", "sendTransaction", { index: 4, sub: "RPC call" }],
        [
          "Confirm",
          "getSignatureStatuses",
          { index: 5, sub: "Poll until landed" },
        ],
        ["Verify", null, { index: 6, sub: "Server checks" }],
      ],
    });
    p.text(SX, a.bottom + 18, "Network fee, RPC round trips, waits for", {
      fill: c.ink2,
    });
    p.text(SX, a.bottom + 36, "confirmation, no readable message", {
      fill: c.ink2,
    });
    const b = p.card({
      x: SX,
      y: a.bottom + 72,
      w: SC,
      title: "Offchain message",
      accent: true,
      rows: [
        [
          "Challenge",
          null,
          { index: 1, sub: "Server issues a message with a nonce" },
        ],
        ["Sign", null, { index: 2, sub: "Wallet shows the text, user signs" }],
        [
          "Verify",
          null,
          { index: 3, sub: "Server checks the Ed25519 signature" },
        ],
      ],
    });
    p.text(SX, b.bottom + 18, "No fee, no RPC calls, one wallet prompt,", {
      fill: c.ink2,
    });
    p.text(SX, b.bottom + 36, "readable on the device", { fill: c.ink2 });
    return [
      SW,
      b.bottom + 60,
      "A sign-in transaction takes six steps, a network fee, and RPC round trips; an offchain message takes three steps, no fee, and no RPC calls",
    ];
  },

  "frontend/offchain-message-layout@sm": (p) => {
    const c = p.c;
    // Field list: offset (mono, muted), name, size on the right, an
    // optional second line under the name.
    const fields = (y, title, tag, rows, accentRow) => {
      const x = SX,
        w = SC;
      const rh = (r) => (r.sub ? SUBROW : ROW);
      const h = HEAD + rows.reduce((s, r) => s + rh(r), 0);
      p.rect(x, y, w, h);
      p.text(x + 16, y + HEAD / 2, title, { size: 13, weight: 500 });
      p.text(x + w - 16, y + HEAD / 2, tag, { anchor: "end", fill: c.ink3 });
      let ry = y + HEAD;
      rows.forEach((r, i) => {
        const hh = rh(r);
        p.hline(x + 1, x + w - 1, ry);
        const ly = r.sub ? ry + 16 : ry + hh / 2;
        if (r.off) p.text(x + 16, ly, r.off, { mono: true, fill: c.ink3 });
        p.text(x + 64, ly, r.name, { fill: c.ink });
        p.text(x + w - 16, ly, r.size, { anchor: "end", fill: c.ink2 });
        if (r.sub)
          p.text(x + 64, ry + 34, r.sub, { mono: r.subMono, fill: c.ink3 });
        if (i === accentRow)
          p.front.push(
            `<rect x="${x + 0.625}" y="${ry + 0.625}" width="${w - 1.25}" height="${hh - 1.25}" rx="0" fill="none" stroke="${c.accent}" stroke-width="1.25"/>`,
          );
        ry += hh;
      });
      return { y, bottom: y + h };
    };
    const m = fields(
      24,
      "Message",
      "what the wallet signs",
      [
        {
          off: "0x00",
          name: "Signing domain",
          size: "16 bytes",
          sub: "\\xffsolana offchain",
          subMono: true,
        },
        {
          off: "0x10",
          name: "Version",
          size: "1 byte",
          sub: "1",
          subMono: true,
        },
        {
          off: "0x11",
          name: "Signer count",
          size: "1 byte",
          sub: "n",
          subMono: true,
        },
        {
          off: "0x12",
          name: "Signers",
          size: "n × 32 bytes",
          sub: "sorted, unique",
        },
        { name: "Content", size: "remainder", sub: "UTF-8 text" },
      ],
      0,
    );
    const e = fields(m.bottom + 32, "Envelope", "what you store or send", [
      { name: "Signature count", size: "1 byte" },
      { name: "Signatures", size: "n × 64 bytes", sub: "in signer order" },
      { name: "Message", size: "the bytes above" },
    ]);
    return [
      SW,
      e.bottom + 24,
      "A version 1 offchain message: signing domain, version, signer count, signers, and content; the envelope adds a signature count and the signatures",
    ];
  },

  "finance/privacy/confidential-balances@sm": (p) => {
    let y = headSm(
      p,
      24,
      "Confidential Balances",
      "Public accounts, encrypted balances and amounts",
    );
    const s = boxSm(p, {
      y,
      title: "Sender account",
      lines: ["address · public", { t: "balance · encrypted", mono: true }],
    });
    const t = boxSm(p, {
      y: s.bottom + 40,
      title: "Confidential transfer",
      lines: [{ t: "amount · encrypted", mono: true }],
      accent: true,
    });
    dropSm(p, s, t, { accent: true });
    const end = hangSm(p, t, [
      {
        draw: (x, y, w) =>
          boxSm(p, {
            x,
            y,
            w,
            title: "Recipient account",
            lines: [
              "address · public",
              { t: "balance · encrypted", mono: true },
            ],
          }),
      },
      {
        dashed: true,
        label: "verified by",
        draw: (x, y, w) =>
          boxSm(p, {
            x,
            y,
            w,
            title: "ZK proof verified on Solana",
            lines: ["Encrypted state updates without", "revealing the amount"],
          }),
      },
      {
        dashed: true,
        label: "optional",
        draw: (x, y, w) =>
          boxSm(p, {
            x,
            y,
            w,
            title: "Auditor key",
            lines: ["Decrypts transfer amounts"],
            dash: "4 4",
          }),
      },
    ]);
    return [
      SW,
      end + 24,
      "Confidential Balances: public sender and recipient accounts, an encrypted amount, a zero-knowledge proof verified on Solana, and an optional auditor key",
    ];
  },

  "finance/privacy/private-channels@sm": (p) => {
    const c = p.c;
    let y = headSm(
      p,
      24,
      "Private Channels",
      "Private execution, institution-defined controls,",
    );
    p.text(SX, y - 6, "Solana settlement", { fill: c.ink2 });
    y += 16;
    // The institution perimeter: a dashed accent frame.
    const fx = SX,
      fw = SC,
      top = y;
    p.text(fx + 16, top + 22, "Institution perimeter", { fill: c.ink3 });
    const ch = boxSm(p, {
      x: fx + 16,
      y: top + 44,
      w: fw - 32,
      title: "Private channel",
      lines: ["Private, instant, no set transaction fee"],
      accent: true,
    });
    const acts = ["View", "Approve", "Freeze", "Move"];
    const gap = 8,
      aw = (fw - 32 - gap * 3) / 4,
      ay = ch.bottom + 32;
    acts.forEach((a, i) => {
      const ax = fx + 16 + i * (aw + gap);
      p.rect(ax, ay, aw, 32);
      p.text(ax + aw / 2, ay + 16, a, { anchor: "middle", fill: c.ink });
      p.edge(
        [
          [ax + aw / 2, ch.bottom],
          [ax + aw / 2, ay],
        ],
        { head: false },
      );
    });
    p.text(fx + 16, ay + 52, "Permissions defined by the operating", {
      fill: c.ink2,
    });
    p.text(fx + 16, ay + 70, "institution", { fill: c.ink2 });
    const fh = ay + 88 - top;
    p.rect(fx, top, fw, fh, {
      fill: "none",
      stroke: c.accent,
      dash: "4 4",
      layer: p.back,
    });
    const main = boxSm(p, { y: top + fh + 48, title: "Solana mainnet" });
    p.edge(
      [
        [fx + 40, top + fh],
        [fx + 40, main.y],
      ],
      { both: true, accent: true, label: "value moves to and from mainnet" },
    );
    y = main.bottom + 32;
    p.text(SX, y, "Outside the perimeter", { fill: c.ink3 });
    const ob = boxSm(p, {
      y: y + 16,
      title: "External observers",
      lines: ["Cannot inspect channel activity"],
      dash: "4 4",
    });
    const au = boxSm(p, {
      y: ob.bottom + 16,
      title: "Auditor view",
      lines: ["Granted by the institution"],
      dash: "4 4",
    });
    return [
      SW,
      au.bottom + 24,
      "Private Channels: a private channel inside an institution's perimeter, with its permissions, settling to and from Solana mainnet; outside observers cannot inspect it, an auditor view is granted by the institution",
    ];
  },

  "finance/privacy/solana-privacy-protocol@sm": (p) => {
    const c = p.c;
    let y = headSm(
      p,
      24,
      "Solana Privacy Rings",
      "Encrypted balances, configurable visibility,",
    );
    p.text(SX, y - 6, "native settlement", { fill: c.ink2 });
    y += 16;
    const w = SC - 24;
    const ring = (yy, title, line, accent) =>
      boxSm(p, { y: yy, w, title, lines: [line], accent, pill: true });
    const d = ring(y, "Default Ring", "Permissionless, confidential");
    const cr = ring(
      d.bottom + 48,
      "Custom Ring",
      "Policy controlled, confidential or anonymous",
      true,
    );
    const o = ring(cr.bottom + 48, "Other Custom Ring", "Interoperable");
    dropSm(p, d, cr, {
      dashed: true,
      both: true,
      accent: true,
      label: "private cross ring",
    });
    dropSm(p, cr, o, {
      dashed: true,
      both: true,
      accent: true,
      label: "private cross ring",
    });
    const au = boxSm(p, {
      y: o.bottom + 32,
      w,
      title: "Optional auditor access",
      lines: ["Visibility defined by Custom Ring policy"],
      dash: "4 4",
    });
    // Auditor access attaches to the Custom Ring, along the right gutter.
    const gx = SX + w + 12;
    p.edge(
      [
        [SX + w, cr.cy],
        [gx, cr.cy],
        [gx, au.cy],
        [SX + w, au.cy],
      ],
      { dashed: true, head: false },
    );
    const f = boxSm(p, {
      y: au.bottom + 32,
      title: "One Solana transaction, native settlement",
      pill: true,
    });
    return [
      SW,
      f.bottom + 24,
      "Solana Privacy Rings: a permissionless Default Ring, a policy-controlled Custom Ring, and other custom rings, joined by private cross-ring transfers, with optional auditor access",
    ];
  },

  "diagrams/finance-overview@sm": (p) => {
    const a = boxSm(p, {
      y: 24,
      title: "Assets",
      lines: ["Tokens and ownership"],
      accent: true,
    });
    const end = hangSm(p, a, [
      {
        draw: (x, y, w) =>
          boxSm(p, { x, y, w, title: "Payments", lines: ["Move value"] }),
      },
      {
        draw: (x, y, w) =>
          boxSm(p, {
            x,
            y,
            w,
            title: "Markets & trading",
            lines: ["Price value"],
          }),
      },
    ]);
    return [SW, end + 24, "Assets power payments and onchain markets"];
  },

  "tools/kora/request-lifecycle@sm": (p) => {
    const c = p.c;
    // The request path down the left; under each stage, indented, the
    // config section that governs it, pointing up at the stage.
    const stage = (y, title, lines, o = {}) =>
      boxSm(p, { y, title, lines, ...o });
    const conf = (st, label, def) => {
      const b = boxSm(p, { x: SX + 48, y: st.bottom + 40, w: SC - 48, ...def });
      p.edge(
        [
          [b.x + 24, b.y],
          [b.x + 24, st.bottom],
        ],
        { label },
      );
      return b;
    };
    const next = (from, to) =>
      p.edge(
        [
          [SX + 20, from.bottom],
          [SX + 20, to.y],
        ],
        {},
      );
    const m = (t) => ({ t, mono: true });
    const client = stage(
      24,
      "Client app",
      ["Builds the transaction and the", "payment instruction"],
      { accent: true },
    );
    const gw = stage(client.bottom + 32, "Gateway", [
      "Rate limit, CORS, method allowlist,",
      "API key, HMAC, reCAPTCHA (beta)",
      "The liveness route bypasses all of these",
    ]);
    next(client, gw);
    const net = conf(gw, "gates access", {
      title: "Network & access",
      tag: "[kora]",
      tagMono: true,
      lines: [
        m("rate_limit"),
        m("cors_allow_origins"),
        m("enabled_methods"),
        m("auth: api keys, HMAC"),
        m("payment_address · cache"),
        { t: "Beta in v2.2:", dim: true },
        m("recaptcha · usage_limit"),
        m("bundle · lighthouse"),
      ],
    });
    const val = stage(net.bottom + 32, "Validation", [
      "Program and token allowlists, blocked",
      "accounts, lamport and signature",
      "ceilings, oracle pricing. Anything",
      "kora.toml does not permit is rejected",
    ]);
    next(gw, val);
    const rules = conf(val, "accepts or rejects", {
      title: "Validation rules",
      tag: "[validation]",
      tagMono: true,
      lines: [
        m("allowed_programs"),
        m("allowed_tokens"),
        m("allowed_spl_paid_tokens"),
        m("disallowed_accounts"),
        m("max_allowed_lamports"),
        m("max_signatures"),
        m("price / price_source"),
      ],
    });
    const fee = boxSm(p, {
      x: rules.x,
      y: rules.bottom + 16,
      w: rules.w,
      title: "Fee payer policy",
      dash: "4 4",
      lines: [
        m("[validation.fee_payer_policy]"),
        m("system · spl_token"),
        m("token_2022 · alt"),
        m("bpf_loader_upgradeable"),
        m("loader_v4"),
        "Every flag defaults to false:",
        "opt in explicitly",
      ],
    });
    const plug = stage(
      fee.bottom + 32,
      "Plugins",
      ["Optional extra checks you opt into", "per transaction"],
      { tag: "beta" },
    );
    next(val, plug);
    const plugConf = conf(plug, "extra checks", {
      title: "Plugins",
      tag: "[kora.plugins]",
      tagMono: true,
      lines: [m('enabled = ["gas_swap",'), m('  "deploy_authority"]')],
    });
    const sign = stage(plugConf.bottom + 32, "Sign as fee payer", [
      "Your signer signs and pays the SOL",
      "network fee",
    ]);
    next(plug, sign);
    const signers = conf(sign, "signing key", {
      title: "Signers",
      tag: "signers.toml",
      tagMono: true,
      lines: [m("memory · Turnkey · Privy"), m("Vault · pools")],
    });
    // The two ways out, off a spine down the left from the signer.
    const ox = SX + 40,
      ow = SC - 40;
    const ret = boxSm(p, {
      x: ox,
      y: signers.bottom + 32,
      w: ow,
      title: "Return to client",
      lines: [m("signTransaction"), m("signBundle")],
    });
    const bc = boxSm(p, {
      x: ox,
      y: ret.bottom + 16,
      w: ow,
      title: "Kora broadcasts",
      lines: [m("signAndSendTransaction"), m("signAndSendBundle")],
    });
    for (const b of [ret, bc])
      p.edge(
        [
          [SX + 20, sign.bottom],
          [SX + 20, b.ty],
          [ox, b.ty],
        ],
        {},
      );
    p.text(
      SX,
      Math.max(ret.bottom, bc.bottom) + 18,
      "Bundle methods are in beta.",
      { fill: c.ink3 },
    );
    return [
      SW,
      Math.max(ret.bottom, bc.bottom) + 44,
      "A transaction travels from the client app through the gateway, validation, plugins, and signing, before Kora either returns it or broadcasts it. Each stage is governed by a matching section of kora.toml or signers.toml.",
    ];
  },
});

const only = (() => {
  const i = process.argv.indexOf("--only");
  return i > 0 ? new Set(process.argv[i + 1].split(",")) : null;
})();
const outRoot = (() => {
  const i = process.argv.indexOf("--out");
  return i > 0 ? path.resolve(process.argv[i + 1]) : root;
})();

let count = 0;
const all = [
  ...Object.entries(FIGURES),
  ...Object.entries(SM).map(([k, v]) => [k.replace(/@sm$/, "-sm"), v]),
];
for (const [name, draw] of all) {
  if (only && !only.has(name.replace(/-sm$/, ""))) continue;
  for (const mode of ["light", "dark"]) {
    const p = new Pen(mode);
    const [w, h, label] = draw(p);
    const file = path.join(
      outRoot,
      `${name}${mode === "light" ? "-light" : ""}.svg`,
    );
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, p.svg(w, Math.round(h), label));
    count++;
  }
}
console.log(`draw-concepts: ${count} file(s) written`);
