import { PLATE_RECIPES, LOOKS, recipeToCanvas } from "@/lib/motif";

/**
 * The card that opens when you pin a payment.
 *
 * It began in the corridor hero and is wanted in the stream, and two pieces
 * drawing their own version of the same card is how they drift apart — the
 * measurements here are from Figma 10910:8474 and there is only one copy of
 * them. Everything is in design pixels multiplied by `k`, so the caller works
 * in device pixels and passes its own ratio.
 */

/** the same string always gives the same face, so a payment keeps its
    identity for as long as it is on screen */
function hashStr(s: string, salt: number) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 1000003;
}

/* Generating a face is a whole recipe evaluation; the same one is asked for
   every frame the card is open. Bounded, because a long session cycling
   through payments would otherwise keep every face it had ever drawn. */
const FACES = new Map<string, HTMLCanvasElement>();

export function agentFace(seed: string, px: number) {
  const key = `${seed}:${px}`;
  const hit = FACES.get(key);
  if (hit) return hit;
  const recipe = PLATE_RECIPES[hashStr(seed, 1) % PLATE_RECIPES.length];
  const look = LOOKS[hashStr(seed, 2) % LOOKS.length];
  let cv: HTMLCanvasElement;
  try {
    cv = recipeToCanvas(recipe, look, px);
  } catch {
    /* a card without a face still says who paid what; a thrown recipe that
       takes the frame down does not */
    cv = document.createElement("canvas");
    cv.width = px;
    cv.height = px;
  }
  if (FACES.size > 120) FACES.clear();
  FACES.set(key, cv);
  return cv;
}

/** the corridor's reveal, so a card that opens here opens the way the plates
    there do: overshoot, settle, no linear slide anywhere in it */
export function springAt(t: number, stiffness = 170, damping = 22) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(stiffness);
  const z = damping / (2 * Math.sqrt(stiffness));
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return (
      1 -
      Math.exp(-z * w0 * t) *
        (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t))
    );
  }
  const rt = w0 * Math.sqrt(z * z - 1);
  const a = -z * w0 + rt,
    b = -z * w0 - rt;
  if (Math.abs(a - b) < 1e-6) return 1 - Math.exp(a * t) * (1 - a * t);
  return 1 - (b * Math.exp(a * t) - a * Math.exp(b * t)) / (b - a);
}

export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export type AgentCard = {
  /** what the face is generated from */
  seed: string;
  agent: string;
  /** already formatted — the two callers count their money differently */
  amount: string;
  fee: string;
};

/**
 * @param k    device pixels per design pixel
 * @param w,h  the surface, so the card can be kept inside it
 * @param ax,ay  the pinned mark, in the same pixels
 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\[]<>-_=+*";

/* A hash, because the churn has to be random-looking and identical every
   frame. The DOM version of this rolls `Math.random` per character and keeps
   the result in state; here there is no state to keep — the card is redrawn
   from nothing sixty times a second, and a fresh roll each time would make
   every character flicker through the whole alphabet at once instead of
   holding a glyph for a few frames. Hashing the seed with the character's
   index gives the same scatter and needs nothing remembered. */
function h32(a: number, b: number) {
  let x = (a * 2654435761) ^ (b * 40503);
  x = Math.imul(x ^ (x >>> 15), 2246822507);
  x = Math.imul(x ^ (x >>> 13), 3266489909);
  return (x ^ (x >>> 16)) >>> 0;
}
const frac = (a: number, b: number) => h32(a, b) / 4294967296;

/* the card's seed is a string; the churn wants a number, and the same string
   must always give the same one or the scatter changes under the card */
function seedNum(s: string) {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++)
    x = Math.imul(x ^ s.charCodeAt(i), 16777619);
  return x >>> 0;
}

/**
 * Text resolving out of noise, by the clock rather than by the frame.
 *
 * Counted in frames, the same word would take twice as long on a 60Hz screen
 * as on a 120Hz one — the settle would be a property of the display rather
 * than of the design. Each character gets its own start scattered through
 * `lead` and its own finish after that, so the word lands raggedly instead of
 * in one line, which is most of what makes it read as resolving rather than
 * as being switched on.
 */
function scrambled(
  text: string,
  seed: number,
  age: number,
  lead: number,
  hold: number,
) {
  if (age >= lead + hold) return text;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const from = frac(seed, i) * lead;
    const to = from + hold * (0.45 + frac(seed, i + 977) * 0.55);
    if (age >= to) out += text[i];
    else if (age >= from) {
      /* a fresh glyph every fiftieth of a second, not every frame */
      const step = (age * 50) | 0;
      out += GLYPHS[h32(seed, i * 31 + step * 7919) % GLYPHS.length];
    } else out += " ";
  }
  return out;
}

/* One surface for every card's frosting, grown to the largest asked for and
   then left alone. A canvas per card per frame would be an allocation and a
   GPU texture on every one of them, sixty times a second, to hold a picture
   that is thrown away immediately. */
let frostCv: HTMLCanvasElement | null = null;
let frostCtx: CanvasRenderingContext2D | null = null;
function scratch(w: number, h: number) {
  if (typeof document === "undefined") return null;
  if (!frostCv) {
    frostCv = document.createElement("canvas");
    frostCtx = frostCv.getContext("2d");
  }
  if (!frostCtx) return null;
  if (frostCv.width < w || frostCv.height < h) {
    frostCv.width = Math.max(frostCv.width, Math.ceil(w));
    frostCv.height = Math.max(frostCv.height, Math.ceil(h));
  }
  return { cv: frostCv, ctx: frostCtx };
}

export function drawAgentCard(
  ctx: CanvasRenderingContext2D,
  k: number,
  w: number,
  h: number,
  ax: number,
  ay: number,
  d: AgentCard,
  /** 0 shut, 1 open. The panel grows out of the mark and the contents are
      clipped to it rather than scaled — type that scales reads as a zoom, and
      a card is a thing being uncovered, not a thing being flown in. */
  open = 1,
  /** Where the panel hangs, when that is not where the mark is. A card moving
      at exactly the speed of the thing it labels is a second moving object and
      the eye has nothing to hold on to; letting it fall behind gives it
      something still to read against, and the leader keeps the two joined. */
  px = ax,
  py = ay,
  /** how much of the surface's edge is not really visible — the hero's canvas
      hangs past its section on both sides, and a card clamped to the canvas
      edge would stand in the hidden bleed, clipped mid-sentence */
  edge = 0,
  /** How the panel itself is painted. An object rather than three more
      positional arguments, which this signature has enough of. */
  skin: {
    /** the panel's fill */
    bg?: string;
    /** how much of it, 0..1. Below 1 the traffic reads through the card. */
    alpha?: number;
    /** blur applied to what is behind the panel, in the same device pixels
        everything else here is measured in. Zero skips the work entirely. */
    blur?: number;
    /** hairline round the panel */
    borderPx?: number;
    /** white on three sides, and on the fourth */
    borderA?: number;
    borderBotA?: number;
    /** the face's side, and the air around it. In the card's own units, so
        both follow `size` like the rest of the panel does. */
    avatar?: number;
    pad?: number;
    /** the face's corner. The panel's own is this plus the padding, never a
        dial of its own — two rounds separated by a constant gap are only
        concentric at that one value, and any other pair reads as a mistake
        nobody can point at. Set the inner one; the outer follows. */
    radius?: number;
    /** Seconds since this card opened, which is what the reveal is timed
        against. `open` cannot serve: it is a spring, so it overshoots and
        settles, and a letter resolving off a value that goes past one and
        comes back would land, unland and land again. */
    age?: number;
    /** seconds between one element starting and the next */
    stagger?: number;
    /** how long each element takes to arrive, and how far it rises doing it */
    fade?: number;
    rise?: number;
    /** the fee's own travel. Last in the order and smallest on the card, so
        the shared rise carries it further than anything above it relative to
        its own size — it arrives looking thrown rather than placed. */
    riseFee?: number;
    /** seconds the name spends resolving out of noise */
    scramble?: number;
  } = {},
) {
  if (open <= 0.001) return;
  const AV = (skin.avatar ?? 80) * k;
  const PADL = (skin.pad ?? 4) * k,
    PADY = (skin.pad ?? 4) * k,
    PADR = 12 * k;
  /* the face's radius, and the panel's derived from it */
  const rIn = Math.min((skin.radius ?? 0) * k, AV / 2);
  const rOut = rIn + PADY;

  /* Each part of the card arrives after the one above it. The panel opens
     first and its contents follow into a box that has already stopped moving,
     which is the order that reads as something being unpacked rather than
     assembled. `at` is one element's share of that: how much of it has
     arrived, and how far it still has to rise. */
  const age = skin.age ?? Infinity;
  const stag = skin.stagger ?? 0;
  const fade = Math.max(0.001, skin.fade ?? 0.001);
  const riseBy = (skin.rise ?? 0) * k;
  /* `up` lets one part travel a different distance from the rest while
     keeping its place in the order — the stagger is the sequence, the rise is
     only how far each comes to get there, and they are separate questions. */
  const at = (i: number, up = riseBy) => {
    const p = clamp01((age - i * stag) / fade);
    const e = easeOut(p);
    return { a: e, dy: (1 - e) * up };
  };
  const GAP = 12 * k,
    COL = 100 * k;
  const cw = PADL + AV + GAP + COL + PADR;
  const chh = AV + PADY * 2;
  /* one path for the panel, asked for wherever it is needed — the blur's clip,
     the fill, the border and the content all have to agree on the same shape
     or the corners disagree by a pixel and the card looks assembled */
  const panel = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    const rr = Math.max(0, Math.min(r, w / 2, h / 2));
    if (rr > 0 && typeof ctx.roundRect === "function")
      ctx.roundRect(x, y, w, h, rr);
    else ctx.rect(x, y, w, h);
  };
  /* column content: 20+20 text, 9 gap, 0 rule, 9 gap, 12 fee = 70 */
  const COLH = 70 * k;
  const m = 14 * k;
  /* offset to the right of the mark, then held inside the frame — a card that
     runs off the edge is worse than one that has moved */
  const cx0 = Math.min(w - edge - cw - m, Math.max(edge + m, px + 56 * k));
  const cy0 = Math.min(h - chh - m, Math.max(m, py - chh / 2));

  /* the leader, so the card is visibly about that one mark and not the frame.
     Run to the nearest point on the panel rather than always to its left edge,
     because once the panel is allowed to fall behind it can end up on either
     side of its mark. */
  const r = 8 * k;
  const lx = Math.min(cx0 + cw * open, Math.max(cx0, ax));
  const ly = Math.min(cy0 + chh, Math.max(cy0, ay));
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = Math.max(1, k * 0.7);
  ctx.beginPath();
  ctx.arc(ax, ay, r, 0, 6.2832);
  ctx.stroke();
  const dx = lx - ax,
    dy = ly - ay;
  const len = Math.hypot(dx, dy);
  if (len > r) {
    ctx.beginPath();
    ctx.moveTo(ax + (dx / len) * r, ay + (dy / len) * r);
    ctx.lineTo(lx, ly);
    ctx.stroke();
  }

  const pw = cw * open;

  /* Frosting, and only what is under the panel gets frosted.

     The obvious way — set a blur filter and draw the canvas onto itself behind
     a clip — makes the browser blur the whole surface and then throw all but a
     card's worth away, which at this canvas size is several megapixels of work
     for a panel the size of a business card. Lifting the region out first
     means the filter only ever sees what it is going to be asked for.

     The lift is padded, because a blur reaches outside whatever it is given
     and would otherwise sample the transparent nothing past the edge of the
     copy — which darkens the panel's border and reads as a vignette nobody
     asked for. Two radii of margin is past where the kernel contributes. */
  const blur = skin.blur ?? 0;
  if (blur > 0.2) {
    const pad = Math.ceil(blur * 2);
    const sx = Math.max(0, cx0 - pad);
    const sy = Math.max(0, cy0 - pad);
    const sw = Math.min(ctx.canvas.width - sx, pw + pad * 2);
    const sh = Math.min(ctx.canvas.height - sy, chh + pad * 2);
    if (sw > 0 && sh > 0) {
      const lift = scratch(sw, sh);
      if (lift) {
        lift.ctx.clearRect(0, 0, sw, sh);
        lift.ctx.drawImage(ctx.canvas, sx, sy, sw, sh, 0, 0, sw, sh);
        ctx.save();
        panel(cx0, cy0, pw, chh, rOut);
        ctx.clip();
        ctx.filter = `blur(${blur}px)`;
        ctx.drawImage(lift.cv, sx, sy);
        ctx.filter = "none";
        ctx.restore();
      }
    }
  }

  ctx.globalAlpha = skin.alpha ?? 1;
  ctx.fillStyle = skin.bg ?? "#2A2A2A";
  panel(cx0, cy0, pw, chh, rOut);
  ctx.fill();
  ctx.globalAlpha = 1;

  /* Stroked on a path pulled half a width inwards, rather than on the panel's
     own edge. A stroke straddles what it is given — half either side — so on
     the edge itself half of every line would hang outside the card and, at a
     hairline, land in the seam between two device pixels, which the renderer
     settles by making it grey and twice the width asked for. Inset by half,
     the band covers exactly the first `bw` inside the shape.

     Drawn after the fill so it is not tinted by it, and against `pw` so it
     opens with the panel rather than standing where the card is going to be. */
  const bw = skin.borderPx ?? 0;
  if (bw > 0) {
    const a = skin.borderA ?? 0;
    const ab = skin.borderBotA ?? a;
    if (a > 0.002) {
      ctx.strokeStyle = `rgba(255,255,255,${a})`;
      ctx.lineWidth = bw;
      panel(
        cx0 + bw / 2,
        cy0 + bw / 2,
        Math.max(0, pw - bw),
        Math.max(0, chh - bw),
        Math.max(0, rOut - bw / 2),
      );
      ctx.stroke();
    }
    if (ab > 0.002) {
      /* The underside fades out towards its corners rather than running the
         full width. A line that reaches both ends closes the shape and the
         panel reads as a box; one that is brightest under the middle and gone
         by the corners reads as light catching a lip — which is what it is
         standing in for, and it also stops the bottom corners from being the
         two hardest points on an otherwise soft card.

         Rebuilt per card because it is anchored to where the panel actually
         is, and the panel moves; a gradient is cheap next to the blur that
         has already run here. */
      const g = ctx.createLinearGradient(cx0, 0, cx0 + pw, 0);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, `rgba(255,255,255,${ab})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      /* clipped to the panel so the band ends where the corners curve away
         rather than running out square past them */
      ctx.save();
      panel(cx0, cy0, pw, chh, rOut);
      ctx.clip();
      ctx.fillStyle = g;
      ctx.fillRect(cx0, cy0 + chh - bw, pw, bw);
      ctx.restore();
    }
  }

  /* everything past the panel's opening edge is simply not there yet */
  ctx.save();
  panel(cx0, cy0, cw * open, chh, rOut);
  ctx.clip();

  /* the face takes the inner radius, and the panel's outer one is that plus
     the padding — so the two curves share a centre and the air between them
     stays the same width the whole way round the corner */
  const face = at(0);
  ctx.globalAlpha = face.a;
  if (rIn > 0) {
    ctx.save();
    panel(cx0 + PADL, cy0 + PADY + face.dy, AV, AV, rIn);
    ctx.clip();
    ctx.drawImage(
      agentFace(d.seed, Math.round(AV)),
      cx0 + PADL,
      cy0 + PADY + face.dy,
      AV,
      AV,
    );
    ctx.restore();
  } else {
    ctx.drawImage(
      agentFace(d.seed, Math.round(AV)),
      cx0 + PADL,
      cy0 + PADY + face.dy,
      AV,
      AV,
    );
  }

  const tx = cx0 + PADL + AV + GAP;
  const colTop = cy0 + (chh - COLH) / 2;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = `${k}px`;

  /* The name resolves out of noise while the rest simply arrives. Only the
     name, because it is the only line here that is a *name* — a number
     churning through digits reads as the figure changing rather than as the
     card settling, and an amount that appears to be counting is saying
     something about the payment that is not true. */
  const nm = at(1);
  ctx.globalAlpha = nm.a;
  ctx.font = `350 ${(14 * k).toFixed(1)}px "ABC Schengen", monospace`;
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fillText(
    scrambled(
      d.agent,
      seedNum(d.seed),
      age - stag,
      (skin.scramble ?? 0) * 0.45,
      (skin.scramble ?? 0) * 0.55,
    ),
    tx,
    colTop + 10 * k + nm.dy,
  );

  const am = at(2);
  ctx.globalAlpha = am.a;
  ctx.font = `400 ${(14 * k).toFixed(1)}px "ABC Schengen", monospace`;
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.fillText(`${d.amount} USDC`, tx, colTop + 30 * k + am.dy);

  /* the rule is w-full of the 100px column, and hairline */
  const rl = at(3);
  ctx.globalAlpha = rl.a;
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(
    tx,
    colTop + 49 * k + rl.dy,
    COL,
    Math.max(1, Math.round(k * 0.5)),
  );

  /* the fee row is justify-center inside the column's 16px right inset, so it
     sits centred rather than flush left like the two lines above */
  /* The fee shares the rule's beat rather than waiting a whole one behind it.
     The rule is a hairline at four per cent — it is not a step the eye
     registers arriving, so spending a stagger on it left the last line of the
     card hanging for a beat after everything else had settled. They land
     together now, which is also what they read as: a line and the thing
     written under it. */
  const fe = at(3, (skin.riseFee ?? skin.rise ?? 0) * k);
  ctx.globalAlpha = fe.a;
  ctx.font = `400 ${(12 * k).toFixed(1)}px "ABC Schengen", monospace`;
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.textAlign = "center";
  ctx.fillText(
    `${d.fee} FEE`,
    tx + (COL - 16 * k) / 2,
    colTop + 64 * k + fe.dy,
  );

  ctx.globalAlpha = 1;
  ctx.restore();
  ctx.textAlign = "left";
  ctx.letterSpacing = "0px";
}
