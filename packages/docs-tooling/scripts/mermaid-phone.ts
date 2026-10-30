/**
 * Phone drawings of mermaid diagrams (`<hash>-sm-light.svg` / `<hash>-sm.svg`),
 * shown by styles/diagrams.css below 640px in place of the desktop figure.
 * A wide figure is not shrunk: it is redrawn top to bottom, 336px wide (the
 * figure on a 390px phone), in the concept-SVG system (draw-concepts.mjs
 * "phones"), so labels stay at 12-13px.
 *
 * - Sequence diagrams become numbered steps, like transaction-flow-sm: each
 *   step shows its sender and receiver as badges (dashed arrow for a reply)
 *   and the message as a sentence. Notes are muted boxes; loop, alt, opt,
 *   par, critical, break and rect blocks are dashed frames, titled by their
 *   label (a rect by the note that opens it).
 * - Flowcharts become an indented tree: each node a full-width card; a node
 *   with one child continues straight down, a fork hangs its children off a
 *   spine on the left, edge labels sit beside their line. An edge the tree
 *   cannot draw (a second parent, a cycle) is a dashed chip that names its
 *   target. Subgraphs are framed groups.
 *
 * `drawPhone` runs in the page (it measures text with the loaded fonts) and
 * must stay self-contained: render-mermaid.ts passes its source text.
 */
export type PhoneColors = {
  page: string;
  ink: string;
  ink2: string;
  line: string;
  hair: string;
  edge: string;
  accent: string;
};

export async function drawPhone(
  source: string,
  c: PhoneColors,
  o: { sans: string; mono: string; focal?: string; width: number },
): Promise<string> {
  const mermaid = (
    window as unknown as {
      mermaid: {
        initialize(c: unknown): void;
        mermaidAPI: {
          // mermaid publishes no types for the per-diagram db.
          // oxlint-disable-next-line typescript/no-explicit-any
          getDiagramFromText(s: string): Promise<{ type: string; db: any }>;
        };
      };
    }
  ).mermaid;
  // Measure in the real faces: wait for each one actually used.
  await Promise.all(
    [
      `400 12px ${o.sans}`,
      `500 13px ${o.sans}`,
      `400 13px ${o.sans}`,
      `400 12px ${o.mono}`,
    ].map((f) => document.fonts.load(f)),
  );
  mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });
  const diagram = await mermaid.mermaidAPI.getDiagramFromText(source);
  const db = diagram.db;
  const isSeq = /^\s*sequenceDiagram\b/m.test(source);

  const SW = o.width;
  const SX = 16;
  const num = (v: number) => String(Math.round(v * 100) / 100);
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const back: string[] = [];
  const front: string[] = [];

  // ---------------------------------------------------------------- text
  const NS = "http://www.w3.org/2000/svg";
  const probeSvg = document.createElementNS(NS, "svg");
  probeSvg.setAttribute("style", "position:absolute;left:-9999px;top:0");
  const probe = document.createElementNS(NS, "text");
  probeSvg.appendChild(probe);
  document.body.appendChild(probeSvg);
  type Style = { size: number; weight?: number; fill?: string };
  type Run = { t: string; mono: boolean };
  const widthCache = new Map<string, number>();
  const measure = (t: string, s: Style, mono: boolean) => {
    const k = `${s.size}|${s.weight ?? 400}|${mono}|${t}`;
    const hit = widthCache.get(k);
    if (hit !== undefined) return hit;
    probe.setAttribute("font-family", mono ? o.mono : o.sans);
    probe.setAttribute("font-size", String(s.size));
    probe.setAttribute("font-weight", String(s.weight ?? 400));
    probe.textContent = t;
    const w = probe.getComputedTextLength();
    widthCache.set(k, w);
    return w;
  };
  // A lone space measures 0 (SVG collapses it): take it from "a a" - "aa".
  const space = (s: Style) =>
    measure("a a", s, false) - measure("aa", s, false);
  // Identifiers are code (render-mermaid.ts postProcess uses the same rule).
  const IDENT =
    /^(?:[A-Z][a-z0-9]+[A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*(?:_[a-z0-9]+)+(?:\(\))?|[a-z]+[A-Z][A-Za-z0-9]*|"[^"\s]*"|[A-Z]+(?:-[A-Z]+)+|\/[a-z][\w-]*(?:\/[\w-]+)*)$/;
  const clean = (s: string) =>
    String(s ?? "")
      .replace(/#quot;/g, '"')
      .replace(/#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/<\/?(?:i|b|em|strong|code|span)\b[^>]*>/gi, "");
  /** Explicit lines (<br>), each trimmed. */
  const linesOf = (s: string) =>
    clean(s)
      .split(/<br\s*\/?>|\n/i)
      .map((l) => l.replace(/\s+/g, " ").trim())
      .filter(Boolean);
  /** Words of one line, each marked code or not. */
  const runs = (line: string): Run[] =>
    line
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => {
        const m = /^(.*?)([,;:.]*)$/.exec(w)!;
        return { t: w, mono: IDENT.test(m[1]!) };
      });
  /** Wrap text to `width`; returns lines of runs. */
  const wrap = (s: string | string[], width: number, st: Style): Run[][] => {
    const out: Run[][] = [];
    for (const line of Array.isArray(s) ? s : [s]) {
      let cur: Run[] = [];
      let cw = 0;
      for (const r of runs(line)) {
        const w = measure(r.t, st, r.mono);
        const sp = cur.length ? space(st) : 0;
        if (cur.length && cw + sp + w > width) {
          out.push(cur);
          cur = [r];
          cw = w;
        } else {
          cur.push(r);
          cw += sp + w;
        }
      }
      if (cur.length) out.push(cur);
    }
    return out;
  };
  const lineWidth = (l: Run[], st: Style) =>
    l.reduce(
      (a, r, i) => a + measure(r.t, st, r.mono) + (i ? space(st) : 0),
      0,
    );
  /** One text line at (x, centre y). */
  const text = (x: number, y: number, l: Run[], st: Style, layer = front) => {
    const size = st.size;
    const fill = st.fill ?? c.ink;
    const parts = l.map((r, i) => {
      const t = esc((i ? " " : "") + r.t);
      if (!r.mono) return t;
      const lead = i ? " " : "";
      return `${lead}<tspan font-family="${o.mono}">${esc(r.t)}</tspan>`;
    });
    layer.push(
      `<text x="${num(x)}" y="${num(y + size * 0.35)}" font-size="${size}"${st.weight ? ` font-weight="${st.weight}"` : ""} fill="${fill}">${parts.join("")}</text>`,
    );
  };
  const rect = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: {
      stroke?: string;
      sw?: number;
      dash?: string;
      fill?: string;
      rx?: number;
      layer?: string[];
    } = {},
  ) => {
    const sw = r.sw ?? 1;
    const off = sw % 2 ? 0.5 : 0;
    (r.layer ?? front).push(
      `<rect x="${num(x + off)}" y="${num(y + off)}" width="${num(w - 2 * off)}" height="${num(h - 2 * off)}" rx="${r.rx ?? 8}" fill="${r.fill ?? c.page}" stroke="${r.stroke ?? c.line}" stroke-width="${sw}"${r.dash ? ` stroke-dasharray="${r.dash}"` : ""}/>`,
    );
  };
  /** Orthogonal connector, 8px corners, open chevron head. */
  const edge = (
    pts: number[][],
    e: { dashed?: boolean; accent?: boolean; head?: boolean } = {},
  ) => {
    let d = `M${num(pts[0]![0]!)} ${num(pts[0]![1]!)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x, y] = pts[i] as [number, number];
      const next = pts[i + 1];
      if (!next) {
        d += `L${num(x)} ${num(y)}`;
        break;
      }
      const [px, py] = pts[i - 1] as [number, number];
      const r = Math.min(
        8,
        Math.hypot(x - px, y - py) / 2,
        Math.hypot(next[0]! - x, next[1]! - y) / 2,
      );
      const ux = Math.sign(x - px),
        uy = Math.sign(y - py);
      const vx = Math.sign(next[0]! - x),
        vy = Math.sign(next[1]! - y);
      d += `L${num(x - ux * r)} ${num(y - uy * r)}Q${num(x)} ${num(y)} ${num(x + vx * r)} ${num(y + vy * r)}`;
    }
    back.push(
      `<path d="${d}" fill="none" stroke="${e.accent ? c.accent : c.edge}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"${e.dashed ? ' stroke-dasharray="4 4"' : ""}${e.head === false ? "" : ` marker-end="url(#${e.accent ? "ha" : "hn"})"`}/>`,
    );
  };
  const BODY: Style = { size: 13 };
  const TITLE: Style = { size: 13, weight: 500 };
  const SMALL: Style = { size: 12, fill: c.ink2 };
  let label = "Diagram";
  const acc = [db.getAccTitle?.(), db.getAccDescription?.()]
    .map((s) => String(s ?? "").trim())
    .filter(Boolean);
  if (acc.length) label = acc.join(". ");

  let height = 0;
  if (isSeq) {
    // ------------------------------------------------------- sequences
    const actors: Map<string, { description?: string; name: string }> =
      db.getActors();
    const nameOf = (id: string) =>
      linesOf(actors.get(id)?.description ?? id).join(" ") || id;
    const msgs: {
      from?: string;
      to?: string;
      type: number;
      message: string;
    }[] = db.getMessages();
    const START = new Set([10, 12, 15, 19, 22, 27, 30, 32]);
    const MID = new Set([13, 20, 28]);
    const END = new Set([11, 14, 16, 21, 23, 29, 31]);
    const SKIP = new Set([17, 18, 26]);
    const DOTTED = new Set([1, 4, 6, 25, 34, 51, 52, 53, 54, 55, 56, 57, 58]);
    const KIND: Record<number, string> = {
      10: "Loop",
      12: "If",
      15: "Optional",
      19: "In parallel",
      27: "Critical",
      30: "Break",
      32: "In parallel",
      13: "Otherwise",
      20: "And",
      28: "Option",
    };
    const NUMX = SX;
    const frames: { top: number; depth: number }[] = [];
    const inset = () => frames.length * 6;
    const cx = () => SX + 34 + inset();
    const cw = () => SW - SX - (SX + 34) - 2 * inset();
    const badgeW = (id: string) => measure(nameOf(id), SMALL, false) + 16;
    const badge = (x: number, y: number, id: string, accent = false) => {
      const w = badgeW(id);
      rect(x, y, w, 24, {
        stroke: accent ? c.accent : c.line,
        sw: accent ? 1.25 : 1,
      });
      text(x + 8, y + 12, [{ t: nameOf(id), mono: false }], { size: 12 });
      return x + w;
    };
    let y = 16;
    let k = 0;
    const focal = o.focal?.replace(/\s+/g, " ").trim();
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i]!;
      if (SKIP.has(m.type)) continue;
      if (START.has(m.type)) {
        const top = y;
        let title = clean(m.message).trim();
        if (m.type === 22) {
          // A rect is titled by the note that opens it.
          const next = msgs[i + 1];
          title = "";
          if (next && next.type === 2) {
            title = linesOf(next.message).join(" ");
            i++;
          }
        } else title = title ? `${KIND[m.type]}: ${title}` : KIND[m.type]!;
        frames.push({ top, depth: frames.length });
        if (title) {
          const ls = wrap(title, cw() - 16, TITLE);
          ls.forEach((l, j) => text(cx(), y + 20 + j * 18, l, TITLE));
          y += 20 + 18 * (ls.length - 1) + 24;
        } else y += 16;
        continue;
      }
      if (MID.has(m.type)) {
        const fx = SX + 24 + inset() - 6;
        const fw = SW - 8 - fx - (inset() - 6);
        front.push(
          `<path d="M${num(fx)} ${num(y + 0.5)}H${num(fx + fw)}" stroke="${c.line}" stroke-width="1" stroke-dasharray="3 3"/>`,
        );
        const t = clean(m.message).trim();
        const title = t ? `${KIND[m.type]}: ${t}` : KIND[m.type]!;
        const ls = wrap(title, cw() - 16, TITLE);
        ls.forEach((l, j) => text(cx(), y + 22 + j * 18, l, TITLE));
        y += 22 + 18 * (ls.length - 1) + 24;
        continue;
      }
      if (END.has(m.type)) {
        const f = frames.pop();
        if (!f) continue;
        const fx = SX + 24 + inset();
        rect(fx, f.top, SW - 8 - inset() - fx, y - 4 - f.top, {
          fill: "none",
          stroke: c.line,
          dash: "3 3",
          layer: back,
        });
        y += 20;
        continue;
      }
      if (m.type === 2) {
        // Note: a muted box, not a step.
        const ls = wrap(linesOf(m.message), cw() - 32, SMALL);
        const h = 20 + 18 * ls.length;
        rect(cx(), y, cw(), h, { stroke: c.hair });
        ls.forEach((l, j) => text(cx() + 16, y + 19 + j * 18, l, SMALL));
        y += h + 24;
        continue;
      }
      if (!m.from) continue;
      // A step.
      k++;
      const msg = linesOf(m.message).join(" ");
      const isFocal = !!focal && msg === focal;
      text(NUMX, y + 12, [{ t: String(k), mono: true }], {
        size: 12,
        fill: isFocal ? c.accent : c.ink2,
      });
      const x0 = cx();
      let bx = badge(x0, y, m.from);
      let rows = 1;
      if (m.to && m.to !== m.from) {
        const dashed = DOTTED.has(m.type);
        if (bx + 28 + badgeW(m.to) > x0 + cw()) {
          // Receiver on its own row, under the sender.
          const ry = y + 32;
          edge(
            [
              [x0 + 12, y + 24],
              [x0 + 12, ry + 12],
              [x0 + 28, ry + 12],
            ],
            { dashed, accent: isFocal },
          );
          badge(x0 + 32, ry, m.to);
          rows = 2;
        } else {
          edge(
            [
              [bx + 4, y + 12],
              [bx + 24, y + 12],
            ],
            { dashed, accent: isFocal },
          );
          bx = badge(bx + 28, y, m.to);
        }
      }
      const ls = wrap(msg, cw(), BODY);
      const ty = y + 24 + (rows - 1) * 32 + 18;
      ls.forEach((l, j) =>
        text(x0, ty + j * 18, l, {
          ...BODY,
          fill: isFocal ? c.accent : c.ink,
        }),
      );
      y = ty + 18 * (ls.length - 1) + 34;
    }
    height = y - 10;
  } else {
    // ------------------------------------------------------ flowcharts
    const verts: Map<
      string,
      { text?: string; type?: string; classes?: string[] }
    > = db.getVertices();
    const subs: { id: string; title: string; nodes: string[] }[] =
      db.getSubGraphs?.() ?? [];
    const edges: {
      start: string;
      end: string;
      text?: string;
      stroke?: string;
    }[] = db.getEdges();
    const subIds = new Set(subs.map((s) => s.id));
    // Direct parent: the smallest subgraph that lists the id.
    const parent = new Map<string, string | null>();
    const ids = [
      ...[...verts.keys()].filter((v) => !subIds.has(v)),
      ...subs.map((s) => s.id),
    ];
    for (const id of ids) {
      let best: { id: string; nodes: string[] } | null = null;
      for (const s of subs)
        if (s.id !== id && s.nodes.includes(id))
          if (!best || s.nodes.length < best.nodes.length) best = s;
      parent.set(id, best?.id ?? null);
    }
    // Item order: first appearance in the source (vertex order), a subgraph
    // where its first member appears.
    const order: string[] = [];
    const seen = new Set<string>();
    const push = (id: string) => {
      if (seen.has(id)) return;
      seen.add(id);
      order.push(id);
    };
    for (const v of verts.keys()) {
      const chain: string[] = [];
      for (let p = parent.get(v) ?? null; p; p = parent.get(p) ?? null)
        chain.unshift(p);
      chain.forEach(push);
      if (!subIds.has(v)) push(v);
    }
    subs.forEach((s) => push(s.id));
    /** The ancestor of `id` (or `id`) whose parent is `level`. */
    const lift = (id: string, level: string | null): string | null => {
      for (let x: string | null = id; x; x = parent.get(x) ?? null)
        if ((parent.get(x) ?? null) === level) return x;
      return null;
    };
    const titleOf = (id: string) => {
      if (subIds.has(id))
        return linesOf(subs.find((s) => s.id === id)!.title || id);
      const v = verts.get(id);
      const ls = linesOf(v?.text ?? id);
      // A decision is one question, however the source breaks it.
      return v?.type === "diamond" ? [ls.join(" ")] : ls;
    };
    const placed = new Set<string>();
    const claimed = new Set<string>();

    /** A card: title line(s) 13/500, then 12px muted lines. */
    const card = (id: string, x: number, y: number, w: number) => {
      const v = verts.get(id);
      const [first = id, ...rest] = titleOf(id);
      const t = wrap(first, w - 32, TITLE);
      const d = wrap(rest, w - 32, SMALL);
      const n = t.length + d.length;
      const h = 42 + 18 * (n - 1);
      const focal = v?.classes?.includes("focal");
      const round = v?.type === "stadium" || v?.type === "circle";
      rect(x, y, w, h, {
        stroke: focal ? c.accent : c.line,
        sw: focal ? 1.25 : 1,
        rx: round ? Math.min(21, h / 2) : 8,
      });
      t.forEach((l, j) => text(x + 16, y + 21 + j * 18, l, TITLE));
      d.forEach((l, j) => text(x + 16, y + 21 + (t.length + j) * 18, l, SMALL));
      return { y, bottom: y + h };
    };

    const IND = 24; // child indent; the spine runs 12px in
    /** Lay out the items of one level (top level or a subgraph). */
    const forest = (
      level: string | null,
      x: number,
      w: number,
      y0: number,
    ): number => {
      const items = order.filter((id) => (parent.get(id) ?? null) === level);
      const local = edges
        .map((e) => ({
          ...e,
          s: lift(e.start, level),
          t: lift(e.end, level),
        }))
        .filter((e) => e.s && e.t) as {
        s: string;
        t: string;
        text?: string;
        stroke?: string;
      }[];
      const dashed = (e: { stroke?: string }) =>
        e.stroke === "dotted" || e.stroke === "dashed";
      const outs = (id: string) => local.filter((e) => e.s === id);
      const reach = (from: string, to: string) => {
        const st = [from],
          vis = new Set<string>();
        while (st.length) {
          const a = st.pop()!;
          if (a === to) return true;
          if (vis.has(a)) continue;
          vis.add(a);
          for (const e of outs(a)) st.push(e.t);
        }
        return false;
      };

      const tree = (id: string, x: number, w: number, y: number): number => {
        placed.add(id);
        let box: { y: number; bottom: number };
        if (subIds.has(id)) {
          // A subgraph: a frame, its title, its own items inside.
          const t = wrap(titleOf(id).join(" "), w - 32, TITLE);
          t.forEach((l, j) => text(x + 16, y + 21 + j * 18, l, TITLE));
          const inner = forest(
            id,
            x + 16,
            w - 32,
            y + 42 + 18 * (t.length - 1),
          );
          rect(x, y, w, inner + 16 - y, {
            fill: "none",
            stroke: c.line,
            dash: "3 3",
            layer: back,
          });
          box = { y, bottom: inner + 16 };
        } else box = card(id, x, y, w);
        type Entry = {
          t: string;
          label?: string;
          dashed: boolean;
          ref: boolean;
        };
        const entries: Entry[] = [];
        for (const e of outs(id)) {
          if (e.t === id) continue;
          const label = linesOf(e.text ?? "").join(" ") || undefined;
          if (placed.has(e.t) || claimed.has(e.t)) {
            entries.push({ t: e.t, label, dashed: dashed(e), ref: true });
            continue;
          }
          // Wait for a later solid parent, so the node follows all of
          // them (unless that parent comes after it: a cycle).
          const later = local.some(
            (f) =>
              f.t === e.t &&
              f.s !== id &&
              !dashed(f) &&
              !placed.has(f.s) &&
              !reach(e.t, f.s),
          );
          entries.push({ t: e.t, label, dashed: dashed(e), ref: later });
          if (!later) claimed.add(e.t);
        }
        if (!entries.length) return box.bottom;
        const sx = x + 12;
        if (entries.length === 1 && !entries[0]!.ref) {
          // Straight down, label beside the line.
          const en = entries[0]!;
          const ls = en.label ? wrap(en.label, w - 40, SMALL) : [];
          const gap = Math.max(32, 16 * ls.length + 20);
          ls.forEach((l, j) =>
            text(
              sx + 8,
              box.bottom + gap / 2 - 8 * (ls.length - 1) + j * 16,
              l,
              SMALL,
            ),
          );
          edge(
            [
              [sx, box.bottom],
              [sx, box.bottom + gap],
            ],
            { dashed: en.dashed },
          );
          claimed.delete(en.t);
          return tree(en.t, x, w, box.bottom + gap);
        }
        // A fork: children hang off a spine 12px in.
        let cy = box.bottom + 12;
        const cx2 = x + IND;
        const cw2 = w - IND;
        for (const en of entries) {
          const ls = en.label ? wrap(en.label, cw2, SMALL) : [];
          ls.forEach((l, j) => text(cx2, cy + 8 + j * 16, l, SMALL));
          const top = cy + (ls.length ? 16 * ls.length + 4 : 4);
          if (en.ref) {
            // A chip naming the target, dashed: it refers to a card drawn
            // elsewhere in the figure.
            const where = placed.has(en.t) ? "above" : "below";
            const name = titleOf(en.t)[0] ?? en.t;
            const tl = wrap(
              name,
              cw2 - 24 - (measure(`(${where})`, SMALL, false) + space(SMALL)),
              SMALL,
            );
            const h = 12 + 16 * tl.length + 0;
            const lw = Math.max(...tl.map((l) => lineWidth(l, SMALL)));
            const chipW = Math.min(
              cw2,
              lw + 24 + (measure(`(${where})`, SMALL, false) + space(SMALL)),
            );
            rect(cx2, top, chipW, h + 4, {
              fill: "none",
              stroke: c.line,
              dash: "3 3",
            });
            tl.forEach((l, j) =>
              text(cx2 + 12, top + 2 + 14 + j * 16, l, {
                size: 12,
                fill: c.ink,
              }),
            );
            text(
              cx2 + 12 + lineWidth(tl[tl.length - 1]!, SMALL) + space(SMALL),
              top + 2 + 14 + (tl.length - 1) * 16,
              [{ t: `(${where})`, mono: false }],
              SMALL,
            );
            const ey = top + 2 + 14;
            edge(
              [
                [sx, box.bottom],
                [sx, ey],
                [cx2, ey],
              ],
              { dashed: en.dashed },
            );
            cy = top + h + 4 + 12;
            continue;
          }
          claimed.delete(en.t);
          edge(
            [
              [sx, box.bottom],
              [sx, top + 21],
              [cx2, top + 21],
            ],
            { dashed: en.dashed },
          );
          cy = tree(en.t, cx2, cw2, top) + 12;
        }
        return cy - 12;
      };

      // Roots: no solid edge in; then anything a cycle left out.
      const solidIn = (id: string) =>
        local.some((e) => e.t === id && e.s !== id && !dashed(e));
      let y = y0;
      let firstTree = true;
      const plant = (id: string) => {
        if (placed.has(id)) return;
        if (!firstTree) y += 24;
        firstTree = false;
        y = tree(id, x, w, y);
      };
      for (const id of items) if (!solidIn(id)) plant(id);
      for (const id of items) plant(id);
      return y;
    };
    height = forest(null, SX, SW - 2 * SX, 16) + 16;
  }
  probeSvg.remove();
  const head = (id: string, col: string) =>
    `<marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M3 1.5L8.5 5L3 8.5" fill="none" stroke="${col}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></marker>`;
  const h = Math.ceil(height);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" data-sol-drawn="hand" data-sol-type="1" viewBox="0 0 ${SW} ${h}" width="${SW}" height="${h}" role="img" aria-label="${esc(label).replace(/"/g, "&quot;")}" font-family="${o.sans.replace(/"/g, "'")}">`,
    `<defs>${head("hn", c.edge)}${head("ha", c.accent)}</defs>`,
    ...back,
    ...front,
    `</svg>`,
    "",
  ].join("\n");
}
