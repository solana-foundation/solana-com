type DialConfig = Record<string, unknown>;
import type { Viz, VizControls, VizPointer, VizQuality } from "./types";
import { AGENTS, ENDPOINTS, MONO, makeRandom } from "./shared";
import { clamp01, drawAgentCard, easeOut, springAt } from "@/lib/agentCard";
import { createBloomPass } from "./bloomPass";

/**
 * The Stream.
 *
 * One row per endpoint that is currently being paid, streaming right to left.
 * A row is born when an endpoint goes active and retires once its last event
 * has aged out, so the panel is a live census rather than a fixed set of
 * lanes — that lifecycle is what makes it read as something happening.
 *
 * Every tick is one event, placed by its age. Colour is the kind of event, and
 * an endpoint is biased to one kind, so a row comes out coherent rather than
 * confetti. That bias does more for the composition than any of the optics.
 *
 * Endpoints fire in volleys rather than at a steady rate. A volley lasts a
 * fraction of a second, so its ticks land packed into a small part of the row:
 * the runs of thin lines are not drawn as runs, they are what a burst looks
 * like once time is the axis, and the gaps are the same fact from the other
 * side.
 *
 * ── the controls ──
 * Deliberately small, and named for what you reach for rather than for what
 * the code does. Size is a range with a spread and a chunk rate; motion is a
 * speed and a row count; bloom is an amount, a size, and how hard it breathes.
 * Everything else is a constant chosen once and left alone.
 */

/* the five kinds, cool to warm. Ordered on purpose: an endpoint's bias picks a
   neighbourhood of this list, so a row's ticks sit in one part of the range. */
const KINDS = ["OPEN", "METER", "SETTLE", "REFUND", "CLOSE"] as const;

/* the texture constants. These were dialled and then fixed — they set the
   grain, and exposing them made the panel harder to use without making the
   picture better. */
/* Both rates are marks per 100px of row, not marks per second. Per second,
   raising the speed shortens a tick's life and empties the row — the fill
   would be a side effect of the speed dial, which is not what either dial is
   for. In distance, the picture holds and only its pace changes. */
/* A trail must go quiet afterwards for at least as long as it ran. Without
   this a busy endpoint re-triggers before its last trail has finished and
   never stops firing — one row solid while the rest breathe. */
const TRAIL_COOL = 1.6; // times the trail's own length
const SWELL = 0.55; // how much appetite drifts over a slow cycle
const HOLD = 0.55; // how long an empty row is kept before it retires
const SMEAR = 55; // rate-as-blur, in the same units as before

/* Every composition the piece can be laid out in, in the order they are
   offered. Exported because the hero builds its own copy of this dial to set a
   different default, and two hand-kept lists would drift the moment one more
   arrangement is added. `cylinder` is in the list but not in ARRANGEMENTS: it
   is a lane law rather than a set of clusters, and has its own branch. */
/* What a row may be drawn on, in the order they are offered. Exported for the
   same reason as the arrangements: the hero builds its own copy of this dial
   to set a different default, and two hand-kept lists drift. */
export const BG_OPTIONS: string[] = ["stroke", "glass", "edge", "fill", "none"];

export const ARRANGE_OPTIONS: string[] = [
  "band",
  "terrace",
  "arches",
  "cascade",
  "rift",
  "strata",
  "shards",
  "full",
  "halo",
  "cylinder",
];

/* Only the two groups worth reaching for stay open. Twelve expanded groups is
   a wall of sliders you scroll past to find anything; `_collapsed` is
   presentational and does not touch a value. */
const CONTROLS: DialConfig = {
  size: {
    _collapsed: true,
    min: [0.5, 0.5, 30, 0.5],
    max: [6, 1, 80, 0.5],
    variance: [45, 0, 100, 1],
    solids: [7, 0, 40, 0.5],
    solidGap: [365, 0, 800, 5],
  },
  trail: {
    _collapsed: true,
    often: [14, 0, 100, 1],
    length: [1.75, 0.05, 4, 0.05],
    density: [7, 1, 60, 0.5],
  },
  colour: {
    _collapsed: true,
    mix: [10, 0, 200, 1],
    gradient: [186, 0, 260, 1],
    cycle: [3.33, 0.02, 8, 0.01],
    blend: [36, 0, 100, 1],
  },
  gaps: {
    _collapsed: true,
    often: [22, 0, 200, 1],
    length: [0.8, 0.05, 6, 0.05],
    text: [18, 0, 100, 1],
    scramble: [0.9, 0, 6, 0.1],
    form: [1.2, 0.1, 5, 0.1],
    rest: [1.4, 0, 8, 0.1],
    churn: [4, 0, 20, 0.5],
  },
  row: {
    count: [8, 2, 90, 1],
    height: [32, 1, 200, 1],
    gap: [16, 0, 120, 1],
    anchor: {
      type: "select",
      options: ["centre", "join", "bottom", "top"],
      default: "centre",
    },
    y: [0, -600, 600, 2],
    bg: { type: "select", options: BG_OPTIONS, default: "glass" },
    bgAlpha: [10, 0, 100, 1],
    /* `edge` is glass without the glass.

       What the real sheet actually shows at a fine bevel is a catch of light
       along each rim and clear nothing in between — so the rims can simply be
       drawn. Two filled bands a row, straight onto the picture, against a
       thickness map the size of the frame, a second texture upload of it every
       frame, and a full-resolution refraction pass to read it back. The
       shader's version bends what is behind it and this one does not; at half
       a pixel of bevel there was not much behind it to bend.

       Top and bottom are separate, and giving them the same weight is what
       makes a row read as a drawn rectangle rather than as a surface. The
       settled pair is a hairline above and a brighter, heavier line below —
       the underside lip catching the light is what gives each row a thickness
       to sit on, where a matched pair just outlines it. */
    topPx: [0.5, 0, 8, 0.5],
    topA: [7, 0, 100, 1],
    botPx: [1.5, 0, 8, 0.5],
    botA: [9, 0, 100, 1],
    /* What the row under the pointer draws its rims at instead.

       With the rims there, the held row does not need outlining on top of
       them — that was a second mark saying what the row already had a way of
       saying, and it stood proud of the band rather than sitting on it.

       The row it names, and no other. Easing the highlight across the hover
       falloff put it on the same curve as the slowing, which was tidy and
       wrong: the slowing is a field, and it is meant to be — neighbours drag
       because the picture is one surface — but the highlight is a label, and
       a label spread over five rows does not say which one is being pointed
       at. So the falloff keeps the motion and the rim keeps the answer.

       Width as well as white, because at four per cent there is not enough
       ink in half a pixel to be sure of, however bright it is made. And split
       top from bottom like the resting pair: a held row that lights both rims
       equally goes back to being an outline, which is the object this was
       meant to replace. Keeping the underside heavier keeps it a surface
       being lit rather than a box being drawn round. */
    hoverTopPx: [0.5, 0, 8, 0.5],
    hoverTopA: [14, 0, 100, 1],
    hoverBotPx: [1, 0, 8, 0.5],
    hoverBotA: [16, 0, 100, 1],
  },
  /* Which composition the lanes are laid out in. `band` is the single stack
     the piece began as, and the row/curve groups drive it as they always
     have; every other name is a set of disconnected clusters authored in
     ARRANGEMENTS — different row counts, partial spans, their own bends —
     with `bend` as one multiplier over all of their amounts. */
  layout: {
    arrange: { type: "select", options: ARRANGE_OPTIONS, default: "band" },
    bend: [100, 0, 300, 5],
    /* Degrees a second, and only the cylinder reads it. Slow on purpose: the
       drum is behind a headline, and anything you can catch yourself watching
       is competing with the words. A full turn at eight degrees takes three
       quarters of a minute. */
    spin: [8, -60, 60, 0.5],
    /* How many rows go all the way round. Half of them are on the back at any
       moment, so the count you see is about half this. */
    staves: [32, 6, 60, 1],
    /* The arrangements' answer to `row.y` and `row.count`.

       Those two, along with the whole `curve` group, are read only by `band`
       — it is the single anchored stack they were written for, and a
       composition of several clusters has no one row count and no one anchor
       for them to mean anything about. Left at that, picking any arrangement
       stranded most of the per-width panel: the dials were still there and
       moved nothing.

       These are the same two decisions in the form a set of clusters can
       honour. `shift` slides the whole composition up or down in pixels, and
       `rows` scales every cluster's row count together, so the proportions
       that were authored survive being thinned for a narrow frame. Both are
       per-width in the hero, which is the point of them. */
    shift: [0, -800, 800, 5],
    rows: [100, 20, 300, 5],
    /* ── the drum's own shape ──
       Only `cylinder` reads these four, and between them they are the whole
       illusion. `radius` is how big the barrel is against the frame: at 50 it
       is exactly as tall as the hero and you see both silhouettes, above that
       it runs off top and bottom and you are looking at a slice of something
       much larger. `band` is how much of each step around the circumference
       is row rather than gap. `falloff` is how fast the surface darkens as it
       turns away — the one that decides whether this reads as a solid or as
       stripes, because all the roundness lives in the crowded rows near the
       silhouette and too steep a falloff hides exactly those. `flow` is how
       hard the traffic runs on it, since a drum is mostly foreshortened and
       needs more marks than a flat row to look as full. */
    radius: [50, 15, 140, 1],
    band: [31, 4, 49, 1],
    falloff: [115, 20, 400, 5],
    flow: [135, 20, 400, 5],
    /* The cheap paths, off by default so the original stays available to
       measure against.

       Each one is work the picture is provably not using: a sheet edge
       sampled every twelve pixels to follow a bend that is flat, traffic
       emitted and moved on the half of the drum that is facing away, and a
       transform stack pushed per glyph to rotate by zero. Nothing here is a
       quality setting — with `fast` on, the same frame should come out, only
       sooner. Kept switchable because "should" is worth being able to check
       side by side rather than asserting. */
    fast: false,
    /* How much fuller the stage opens than it runs.

       Wound at the rate it plays at, the first frame reads at a glance as a
       stage that has not filled yet rather than as a stream that breathes.
       Nobody watches an opening long enough to see it fill.

       So the wind emits harder, and the picture relaxes to its dialled density
       over the few seconds it takes the opening marks to cross. Only the wind:
       a hundred is the same picture at entry as ever after.

       Emission only. Rows still hush on their usual schedule during the wind —
       see the note at the `fill` that carries this, on why the opening needs
       the gaps more than it needs the extra marks. */
    entry: [190, 100, 500, 5],
  },
  motion: {
    _collapsed: true,
    speed: [480, 20, 2500, 10],
    density: [24.5, 0, 60, 0.1],
    drift: [15, 0, 100, 1],
    variation: [100, 0, 100, 1],
    reverse: true,
    hoverHold: true,
    hoverRadius: [4, 0, 20, 0.5],
    pinFreeze: false,
  },
  curve: {
    amount: [-20, -1400, 1400, 10],
    fan: [9, -240, 240, 1],
    power: [11.8, 1, 20, 0.1],
    tilt: false,
  },
  fit: {
    _collapsed: true,
    ref: [0, 0, 2400, 10],
    min: [40, 5, 100, 1],
    max: [100, 50, 200, 1],
  },
  cards: {
    _collapsed: true,
    often: [2, 0, 100, 1],
    gap: [4000, 100, 6000, 10],
    max: [2, 0, 8, 1],
    drift: [43, 0, 100, 1],
    hold: [2, 0, 20, 0.1],
    size: [90, 40, 160, 1],
    /* The panel itself. Drawn onto the finished picture rather than into it,
       so unlike everything else here it can be transparent and have something
       to be transparent against — the traffic is already there underneath.

       `blur` frosts only what the panel covers, and costs nothing at zero. It
       is what makes a see-through card readable: dropped to a low alpha with
       no blur, the bars run straight through the type and the card reads as
       damage rather than as glass. */
    bg: { type: "color", default: "#272527" },
    bgAlpha: [80, 0, 100, 1],
    blur: [8, 0, 40, 0.5],
    /* A hairline round the panel, and the underside on its own dial.

       A transparent card has no edge of its own — it is a patch of softened
       traffic, and where it stops is wherever the blur happens to stop, which
       is nowhere in particular. The border is what gives it a boundary to be
       a card within.

       Bottom separately for the same reason the rows keep their rims apart: an
       even outline reads as a drawn rectangle, and a heavier lower line reads
       as something with a thickness sitting in front of what is behind it. In
       white, so it takes its colour from being lit rather than from the fill.

       Widths in device pixels rather than the card's own scale, so a hairline
       stays a hairline instead of thickening with the panel. */
    borderPx: [0.5, 0, 4, 0.5],
    borderA: [6, 0, 100, 1],
    borderBotA: [30, 0, 100, 1],
    /* The face, the air around it, and its corner. In the card's own units so
       they follow `size` with everything else.

       There is deliberately no dial for the panel's own radius: it is the
       face's plus the padding, always. Two rounded rectangles separated by a
       constant gap are only truly concentric at that one value, and every
       other pair leaves the air round the corner a different width from the
       air down the sides — which reads as wrong without being locatable. Set
       the inner one and the outer follows. */
    avatar: [92, 24, 160, 1],
    pad: [2, 0, 32, 0.5],
    radius: [1, 0, 40, 0.5],
    /* How the card lands, rather than simply being there.

       The panel springs open first and its contents follow into a box that
       has already stopped moving — unpacked rather than assembled. `stagger`
       is the gap between one part starting and the next, `fade` how long each
       takes, `rise` how far it travels getting there.

       `scramble` is the name resolving out of noise, and only the name. A
       number churning through digits reads as the figure changing rather than
       as the card settling, and an amount that appears to be counting is
       saying something about the payment that is not true. */
    stagger: [60, 0, 400, 5],
    fade: [220, 40, 1200, 10],
    rise: [3, 0, 40, 0.5],
    /* the fee travels less than the rest. It is the smallest thing on the
       card and the last to land, so the shared rise moves it further relative
       to its own size than anything above it — it arrives looking thrown
       rather than placed. Its place in the order is unchanged; only how far
       it comes to get there. */
    riseFee: [2, 0, 40, 0.5],
    scramble: [450, 0, 2000, 10],
  },
  glass: {
    _collapsed: true,
    refract: [82, 0, 300, 1],
    aberration: [25, 0, 200, 1],
    edge: [39, 0, 400, 1],
    tint: [1, 0, 40, 0.5],
    bevel: [0.5, 0.5, 12, 0.5],
    patchy: [55, 0, 100, 1],
  },
  light: {
    _collapsed: true,
    gain: [101, 0, 600, 1],
    width: [240, 20, 1400, 10],
    speed: [330, 0, 2500, 10],
    angle: [20, -90, 90, 1],
    beams: [4, 1, 5, 1],
  },
  bloom: {
    _collapsed: true,
    amount: [13, 0, 400, 1],
    threshold: [56, 0, 100, 1],
    knee: [12, 0, 100, 1],
    radius: [0.6, 0.2, 6, 0.1],
    stretch: [15, 0.2, 40, 0.1],
    levels: [5, 1, 6, 1],
    pulse: [33, 0, 100, 1],
    rate: [1.5, 0.05, 8, 0.05],
  },
  paint: {
    _collapsed: true,
    open: { type: "color", default: "#5cffb8" },
    meter: { type: "color", default: "#A77CFF" },
    settle: { type: "color", default: "#FF6BD6" },
    refund: { type: "color", default: "#aea3ff" },
    close: { type: "color", default: "#5e5e5e" },
    readouts: true,
  },
};

type Ctl = {
  size: {
    min: number;
    max: number;
    variance: number;
    solids: number;
    solidGap: number;
  };
  trail: { often: number; length: number; density: number };
  colour: { mix: number; gradient: number; cycle: number; blend: number };
  gaps: {
    often: number;
    length: number;
    text: number;
    scramble: number;
    form: number;
    rest: number;
    churn: number;
  };
  row: {
    count: number;
    height: number;
    gap: number;
    anchor: string;
    y: number;
    bg: string;
    bgAlpha: number;
    topPx: number;
    topA: number;
    botPx: number;
    botA: number;
    hoverTopPx: number;
    hoverTopA: number;
    hoverBotPx: number;
    hoverBotA: number;
  };
  layout: {
    arrange: string;
    bend: number;
    spin: number;
    staves: number;
    shift: number;
    rows: number;
    radius: number;
    band: number;
    falloff: number;
    flow: number;
    fast: boolean;
    entry: number;
  };
  motion: {
    speed: number;
    density: number;
    drift: number;
    variation: number;
    reverse: boolean;
    hoverHold: boolean;
    hoverRadius: number;
    pinFreeze: boolean;
  };
  curve: { amount: number; fan: number; power: number; tilt: boolean };
  fit: { ref: number; min: number; max: number };
  cards: {
    often: number;
    gap: number;
    max: number;
    drift: number;
    hold: number;
    size: number;
    edge: number;
    bg: string;
    bgAlpha: number;
    blur: number;
    borderPx: number;
    borderA: number;
    borderBotA: number;
    avatar: number;
    pad: number;
    radius: number;
    stagger: number;
    fade: number;
    rise: number;
    riseFee: number;
    scramble: number;
  };
  glass: {
    refract: number;
    aberration: number;
    edge: number;
    tint: number;
    bevel: number;
    patchy: number;
  };
  light: {
    gain: number;
    width: number;
    speed: number;
    angle: number;
    beams: number;
  };
  bloom: {
    amount: number;
    threshold: number;
    knee: number;
    radius: number;
    stretch: number;
    levels: number;
    pulse: number;
    rate: number;
  };
  paint: {
    open: string;
    meter: string;
    settle: string;
    refund: string;
    close: string;
    readouts: boolean;
  };
};

const FALLBACK: Ctl = {
  size: { min: 0.5, max: 6, variance: 45, solids: 7, solidGap: 365 },
  trail: { often: 14, length: 1.75, density: 7 },
  colour: { mix: 10, gradient: 186, cycle: 3.33, blend: 36 },
  gaps: {
    often: 22,
    length: 0.8,
    text: 18,
    scramble: 0.9,
    form: 1.2,
    rest: 1.4,
    churn: 4,
  },
  row: {
    count: 8,
    height: 32,
    gap: 16,
    anchor: "centre",
    y: 0,
    bg: "glass",
    bgAlpha: 10,
    topPx: 0.5,
    topA: 7,
    botPx: 1.5,
    botA: 9,
    hoverTopPx: 0.5,
    hoverTopA: 14,
    hoverBotPx: 1,
    hoverBotA: 16,
  },
  layout: {
    arrange: "band",
    bend: 100,
    spin: 8,
    staves: 32,
    shift: 0,
    rows: 100,
    radius: 50,
    band: 31,
    falloff: 115,
    flow: 135,
    fast: false,
    entry: 190,
  },
  motion: {
    speed: 480,
    density: 24.5,
    drift: 15,
    variation: 100,
    reverse: true,
    hoverHold: true,
    hoverRadius: 4,
    pinFreeze: false,
  },
  curve: { amount: -20, fan: 9, power: 11.8, tilt: false },
  fit: { ref: 0, min: 40, max: 100 },
  cards: {
    often: 2,
    gap: 4000,
    max: 2,
    drift: 43,
    hold: 2,
    size: 90,
    edge: 0,
    bg: "#272527",
    bgAlpha: 80,
    blur: 8,
    borderPx: 0.5,
    borderA: 6,
    borderBotA: 30,
    avatar: 92,
    pad: 2,
    radius: 1,
    stagger: 60,
    fade: 220,
    rise: 3,
    riseFee: 2,
    scramble: 450,
  },
  glass: {
    refract: 82,
    aberration: 25,
    edge: 39,
    tint: 1,
    bevel: 0.5,
    patchy: 55,
  },
  light: { gain: 101, width: 240, speed: 330, angle: 20, beams: 4 },
  bloom: {
    amount: 13,
    threshold: 56,
    knee: 12,
    radius: 0.6,
    stretch: 15,
    levels: 5,
    pulse: 33,
    rate: 1.5,
  },
  paint: {
    open: "#5cffb8",
    meter: "#A77CFF",
    settle: "#FF6BD6",
    refund: "#aea3ff",
    close: "#5e5e5e",
    readouts: true,
  },
};

type Tick = {
  at: number;
  /** where it sits on the palette, 0..1 across all five kinds */
  hue: number;
  /** its own share of the speed. Every mark travelling at exactly the same
      rate gives no relative motion at all, so the eye reads the whole row as
      one rigid sheet sliding rather than as marks moving over it. */
  sp: number;
  /** where it is, in pixels. Carried rather than derived from its age: a tick
      whose position is age × speed jumps the moment the dial moves, because
      every tick on screen is re-placed at once. Integrating instead means
      speed changes what happens next and leaves the picture alone. */
  x: number;
  kind: number;
  mag: number;
  size: number;
  /** its own phase and rate, so blooms breathe out of step with each other */
  ph: number;
  br: number;
  agent: number;
  amt: number;
  /** what its face is generated from, and what it paid to be settled — both
      only ever read by the card, so both are rolled once and left alone */
  sd: number;
  fee: number;
  /** A card of its own. -1 never, 0 waiting to come into view, 1 open,
      2 closing — and when it opened, and when it began to close. */
  cd: number;
  cdIn: number;
  cdOut: number;
  /** where its mark stood when it opened, so the panel can be placed as a
      fraction of the ground the mark has covered since */
  cdX: number;
  /** and where its lane stood when it opened, so a surface that moves for
      reasons of its own cannot carry the panel with it */
  cdY: number;
  /** Its own name for as long as it lives. A pin held by index followed
      whichever mark happened to land in that slot after the culling shifted
      the array down — the card would quietly start describing a different
      payment while you were reading it. */
  id: number;
  /** a hash rides here rather than a bar: the seed into the alphabet, or -1
      for the traffic, which is everything outside a gap */
  gl: number;
};

/* What runs through a gap. A hush is the one stretch of a row with nothing
   in it, so it is the only place a string of characters can be read at all —
   inside a trail they would sit on top of the very marks they are meant to
   annotate. So the traffic stays bars, and the quiet carries a hash. */
const CHARS = "0123456789ABCDEFGHJKLMNPRSTUVWXYZ";
/* What the scramble is scrambling towards. A hash that stays a hash is
   texture; one that resolves into a word is the row telling you what it is
   carrying, and the moment of resolution is the part you actually watch. */
const WORD = "SOLANA";

/* ── the arrangements ──
   A composition is a list of clusters, each an independent little stack:
   its own row count, its own stretch of the frame, its own bend. Spans and
   heights are fractions of the frame so a composition survives a resize as
   the same picture; amounts are pixels at the reference width, scaled with
   everything else. `hs` scales the row height, which is what gives a cluster
   its weight — a whisper of half-height rows reads as background, a full
   stack reads as the subject.

   The shapes: `peel` is the original corner curve, flat where marks enter
   and thrown at the far end. `arch` is a circular bow across the span.
   `wave` undulates, with `pow` as the cycle count. `step` is an S-bend —
   the row enters on one level and leaves on another. `flat` just runs.

   `band` is null on purpose: it is not a composition of clusters, it is the
   original single stack, driven by the row and curve dials so every preset
   tuned before arrangements existed still means what it meant. */
type ClusterShape = "peel" | "arch" | "wave" | "step" | "flat";
type ClusterDef = {
  n: number;
  x0: number;
  x1: number;
  y: number;
  shape: ClusterShape;
  amt: number;
  fan: number;
  pow: number;
  hs?: number;
  /** Traffic multiplier, and the shorter the run the higher it wants to be.

      A hush lasts a fixed number of seconds, so what it does to a row depends
      entirely on how long that row takes to cross. On the full-width band a
      hush is a local hole with traffic either side of it — the texture the
      gaps exist to make. On a run a quarter of that length, the same hush is
      the whole run going dark, and an empty rule reads as broken glass rather
      than as a lull. Running the short ones hotter puts marks either side of
      their gaps again, which is the thing being restored: not brightness, but
      the gap having something to be a gap in. */
  dm?: number;
  /** The band's `join`, per cluster: never nearer the top than `y`, and never
      leaving daylight at the foot. The main mass has to meet the rule the
      stats row sits on — a fraction of the height alone leaves it floating in
      a tall window, which is the one thing that reads as unfinished however
      well the rest is placed. */
  join?: true;
  /** Only on a frame wide enough to have a right-hand field at all.

      The clear column right of the words is a fact about the desktop layout,
      not about the piece: on a phone the copy runs the full width and the
      headline stack is taller, so there is no field beside the text — every
      island placed in one lands on the words. Rather than shrink them into
      illegibility, the clusters that live there simply do not appear, and the
      narrow frame gets the composition below the text on its own. Which is
      the same judgement the hero already makes per breakpoint: fewer things,
      standing properly, beats everything scaled down. */
  wide?: true;
};
/* The hero's own grid, measured off the laid-out page rather than guessed:
   the text column ends at x 0.45 and the words run from y 0.24 to y 0.61.
   So there are exactly three clear fields — above the headline, right of the
   column, and below the call to action — and every cluster below is placed
   into one of them by these three numbers rather than by eye. Nothing is
   scattered: an island that lands on the copy is not a composition. */
const NAV_B = 0.1; // clear of the navigation bar
const TEXT_R = 0.5; // right of the text column, with room to spare
const TEXT_B = 0.64; // below the call to action

/* Twelfths, for the flat sets.

   A composition with no curve in it has nothing but placement to hold it
   together, so the placement has to be exact where it is not regular. Every
   horizontal edge in `strata` and `shards` is a twelfth of the frame: the
   clusters land at irregular intervals — which is the scattered look — but
   never at an arbitrary coordinate, and they share edges often enough that
   the eye finds the alignments without being walked along them. That is the
   difference between scattered and sloppy. */
const C = (n: number) => n / 12;

/* Each arrangement is one idea carried through, which is the whole difference
   between a composition and a spill. A single shape family per set, spans that
   share their edges, y on an even cadence, and weight that grows as the eye
   travels towards the main mass — so the small clusters read as the same
   system seen further off rather than as debris around it. */
const ARRANGEMENTS: Record<string, ClusterDef[] | null> = {
  band: null,
  /* Shelves on an even ladder, every one right-aligned to the frame and each
     step down 0.09 wider and heavier than the last, ending in the full run at
     the foot. One shape throughout, one direction of travel: the eye enters
     top right and is walked down to the band. */
  terrace: [
    {
      n: 1,
      x0: 0.68,
      x1: 1,
      y: NAV_B,
      shape: "step",
      amt: 30,
      fan: 0,
      pow: 0,
      hs: 0.45,
      dm: 2,
      wide: true,
    },
    {
      n: 2,
      x0: 0.59,
      x1: 1,
      y: 0.26,
      shape: "step",
      amt: 50,
      fan: 12,
      pow: 0,
      hs: 0.7,
      dm: 1.6,
      wide: true,
    },
    {
      n: 4,
      x0: 0,
      x1: 1,
      y: TEXT_B,
      shape: "peel",
      amt: -140,
      fan: 26,
      pow: 8,
      join: true,
    },
  ],
  /* Concentric bows on one centre line: a hairline arc in the clearance above
     the headline, the main mass bowing beneath the copy, a half-weight echo
     under that. Spans nested symmetrically — 0.12 in, flush, 0.24 in — and the
     amounts halve outwards, so it reads as one shape at three distances. */
  arches: [
    {
      n: 2,
      x0: 0.12,
      x1: 0.88,
      y: NAV_B,
      shape: "arch",
      amt: 26,
      fan: 12,
      pow: 0,
      hs: 0.45,
      dm: 2,
      wide: true,
    },
    {
      n: 3,
      x0: 0,
      x1: 1,
      y: TEXT_B,
      shape: "arch",
      amt: -76,
      fan: -18,
      pow: 0,
      dm: 1.2,
    },
    {
      n: 2,
      x0: 0.24,
      x1: 0.76,
      y: 0.86,
      shape: "arch",
      amt: -38,
      fan: -12,
      pow: 0,
      hs: 0.6,
      dm: 1.8,
      join: true,
    },
  ],
  /* The fullest, and still a staircase rather than a scatter: four runs in the
     right field on an even 0.14 cadence, each starting 0.08 further left and
     standing a step heavier, then the band. Every value is a term in a
     progression, which is what makes a busy frame read as designed. */
  cascade: [
    {
      n: 1,
      x0: 0.74,
      x1: 1,
      y: NAV_B,
      shape: "step",
      amt: 22,
      fan: 0,
      pow: 0,
      hs: 0.4,
      dm: 2,
      wide: true,
    },
    {
      n: 1,
      x0: 0.66,
      x1: 1,
      y: 0.23,
      shape: "step",
      amt: 34,
      fan: 0,
      pow: 0,
      hs: 0.5,
      dm: 2,
      wide: true,
    },
    {
      n: 2,
      x0: 0.58,
      x1: 1,
      y: 0.36,
      shape: "step",
      amt: 46,
      fan: 10,
      pow: 0,
      hs: 0.6,
      dm: 1.8,
      wide: true,
    },
    {
      n: 2,
      x0: TEXT_R,
      x1: 1,
      y: 0.49,
      shape: "step",
      amt: 58,
      fan: 12,
      pow: 0,
      hs: 0.7,
      dm: 1.6,
      wide: true,
    },
    {
      n: 4,
      x0: 0,
      x1: 1,
      y: TEXT_B,
      shape: "peel",
      amt: -120,
      fan: 24,
      pow: 8,
      join: true,
    },
  ],
  /* A true reflection about the centre: matched pairs on mirrored spans, each
     pair carrying the same bend rather than opposite ones — reflecting a shape
     left to right does not turn it upside down, and a pair that disagrees
     about which way it bows reads as a mismatch instead of a mirror. Each pair
     is one arc interrupted by the channel down the middle, and the channel is
     where the headline sits.

     Both bends are signed to fall away from the edge they are nearest: the top
     pair bows down, clear of the navigation, and the foot pair bows up, clear
     of the rule the stats sit on. */
  rift: [
    {
      n: 2,
      x0: 0,
      x1: 0.26,
      y: NAV_B,
      shape: "arch",
      amt: 22,
      fan: 8,
      pow: 0,
      hs: 0.45,
      dm: 2,
      wide: true,
    },
    {
      n: 2,
      x0: 0.74,
      x1: 1,
      y: NAV_B,
      shape: "arch",
      amt: 22,
      fan: 8,
      pow: 0,
      hs: 0.45,
      dm: 2,
      wide: true,
    },
    {
      n: 3,
      x0: 0,
      x1: 0.42,
      y: TEXT_B,
      shape: "arch",
      amt: -64,
      fan: -16,
      pow: 0,
      dm: 1.8,
      join: true,
    },
    {
      n: 3,
      x0: 0.58,
      x1: 1,
      y: TEXT_B,
      shape: "arch",
      amt: -64,
      fan: -16,
      pow: 0,
      dm: 1.8,
      join: true,
    },
  ],

  /* ── the flat sets ──
     Cascade's idea without the ladder and without the bend: rules, dead
     straight, at irregular intervals. What replaces the curve as the thing
     holding it together is weight and alignment — every run is a different
     length and a different thickness, and the edges land on twelfths, so the
     clusters answer each other across the frame instead of marching down it.
     Row counts are deliberately uneven; a set of clusters all two rows deep
     is a ladder again however it is placed. */

  /* Six runs, read as one drift from the top left down to the right: a tick,
     a pair, a block beside the headline, a single rule by the copy, a short
     bar low left, and the mass — which stops short of the left edge so the
     bar below it has ground of its own. */
  strata: [
    {
      n: 1,
      x0: C(1),
      x1: C(4),
      y: NAV_B,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.4,
      dm: 3,
      wide: true,
    },
    {
      n: 2,
      x0: C(7),
      x1: C(12),
      y: NAV_B,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.45,
      dm: 2,
      wide: true,
    },
    {
      n: 3,
      x0: C(8),
      x1: C(12),
      y: 0.27,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.6,
      dm: 2,
      wide: true,
    },
    {
      n: 1,
      x0: C(6),
      x1: C(10),
      y: 0.46,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.5,
      dm: 2.5,
      wide: true,
    },
    {
      n: 2,
      x0: 0,
      x1: C(4),
      y: 0.66,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.6,
      dm: 1.8,
    },
    {
      n: 4,
      x0: C(3),
      x1: C(12),
      y: 0.74,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      dm: 1.2,
      join: true,
    },
  ],

  /* The dense one. Nine runs, none of them the same length, scattered across
     all three clear fields — the busiest the hero gets while every word on it
     stays on clear ground. */
  shards: [
    {
      n: 1,
      x0: 0,
      x1: C(2),
      y: 0.11,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.4,
      dm: 3.5,
      wide: true,
    },
    {
      n: 2,
      x0: C(3),
      x1: C(6),
      y: NAV_B,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.45,
      dm: 2.5,
      wide: true,
    },
    {
      n: 1,
      x0: C(8),
      x1: C(12),
      y: 0.13,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.4,
      dm: 2.5,
      wide: true,
    },
    {
      n: 3,
      x0: C(7),
      x1: C(11),
      y: 0.28,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.55,
      dm: 2,
      wide: true,
    },
    {
      n: 1,
      x0: C(9),
      x1: C(12),
      y: 0.45,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.5,
      dm: 3,
      wide: true,
    },
    {
      n: 2,
      x0: TEXT_R,
      x1: C(9),
      y: 0.53,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.5,
      dm: 2.5,
      wide: true,
    },
    {
      n: 2,
      x0: 0,
      x1: C(3),
      y: 0.67,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.6,
      dm: 2.5,
    },
    {
      n: 1,
      x0: C(4),
      x1: C(7),
      y: 0.71,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      hs: 0.5,
      dm: 3,
    },
    {
      n: 4,
      x0: C(2),
      x1: C(12),
      y: 0.78,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      dm: 1.2,
      join: true,
    },
  ],

  /* Edge to edge, and the only set that does not work around the words at
     all. Every other composition here is shaped by where the type is; this
     one ignores it and the type is given its own ground instead, which is
     what the hero's scrim is for.

     More rows than the frame can hold on purpose: the count is fixed while
     the height is not, so it is sized for a tall window and simply runs out
     of the bottom of a short one. A field that stopped short of the foot
     would be a band again, and the whole point of this one is that it has no
     edges you can see. */
  full: [
    {
      n: 20,
      x0: 0,
      x1: 1,
      y: 0,
      shape: "flat",
      amt: 0,
      fan: 0,
      pow: 0,
      dm: 1.1,
    },
  ],

  /* Concentric properly, which `arches` only gestured at.

     Rings about one centre, not three separate bows that happen to curve the
     same way — so it is one family with one law, and the law is the fan. For
     circles sharing a centre below the frame the vertical gap between them is
     narrowest directly above that centre and opens towards the edges, because
     the far end of each ring is steeper. A negative fan is exactly that: each
     row bends a little harder than the one above, the rows crowd together at
     the crown and spread at the ends, and the eye reads depth instead of a
     stack of parallel bows. Same-amplitude rows would be perfectly parallel,
     evenly spaced everywhere, and would read as one bent band.

     One family and nothing else. A second group up in the clearance was the
     same rings continued outward on paper and read as a separate object on
     screen — the frame cuts it off from the set it belongs to, so what you
     see is a stray bar above the headline rather than the far edge of the
     halo. The whole set sits below the type, which is what leaves the middle
     of the frame free for the type to be centred into — see `CENTRED`.

     The crowns come out evenly spaced whatever the fan does to the ends: a
     row's crown is `y + amt + i × (pitch + fan)`, and with the pitch carrying
     the squeeze that step is constant. So the rings stay even where they are
     read and splay off the sides of the frame, which is the whole picture. */
  halo: [
    {
      n: 7,
      x0: 0,
      x1: 1,
      y: 0.74,
      shape: "arch",
      amt: -70,
      fan: -18,
      pow: 0,
      hs: 0.9,
      dm: 1.3,
    },
  ],
};

/* The ones built about the frame's vertical centre line, which want the
   type centred with them. Ranged left, a headline sits off the axis every
   ring in the picture is drawn around, and the composition reads as two
   things that have not been introduced. */
export const CENTRED: ReadonlySet<string> = new Set(["halo", "cylinder"]);

/** the corridor counts its money this way, and one card cannot read two ways */
const money = (v: number) =>
  v >= 100
    ? Math.round(v).toLocaleString("en-US")
    : v.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

/* Adding the seed, the column and the churn step and taking that modulo the
   alphabet looks random and is not: the terms stay in step with each other and
   characters four apart come out matching, which in a six-letter scramble is
   the most visible thing on screen. Multiplying each through a large odd
   constant breaks the correlation. */
function mix(seed: number, col: number, step: number) {
  let h = (seed * 2654435761) ^ (col * 40503) ^ (step * 2246822519);
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

/* One canvas per character per size, kept for the life of the page. Several
   hundred fillText calls a frame is the kind of thing that quietly costs a
   third of the budget; a cached sprite is a blit. White, so one set serves
   every colour — drawn under `lighter` they add rather than replace, which is
   what makes them read as lit rather than printed. */
const FACE = '"Dots All For Now JL"';
const SPRITES = new Map<string, HTMLCanvasElement>();
if (typeof document !== "undefined" && document.fonts) {
  /* glyphs rasterised before the face arrives are the fallback's, not ours */
  document.fonts
    .load(`400 12px ${FACE}`)
    .then(() => SPRITES.clear())
    .catch(() => {});
  document.fonts.ready.then(() => SPRITES.clear()).catch(() => {});
}
function sprite(ch: string, px: number, dpr: number) {
  const key = `${ch}|${px}|${dpr}`;
  let cv = SPRITES.get(key);
  if (!cv) {
    if (typeof document === "undefined") return null;
    cv = document.createElement("canvas");
    cv.width = Math.max(1, Math.ceil(px * 1.1 * dpr));
    cv.height = Math.max(1, Math.ceil(px * 1.4 * dpr));
    const c = cv.getContext("2d");
    if (!c) return null;
    c.scale(dpr, dpr);
    c.font = `400 ${px}px ${FACE}, ui-monospace, monospace`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "#fff";
    c.fillText(ch, (px * 1.1) / 2, (px * 1.4) / 2);
    SPRITES.set(key, cv);
  }
  return cv;
}

type Row = {
  ep: number;
  /** pixels travelled since this row last laid down a solid, so two can never
      land touching and merge into a slab */
  sinceSolid: number;
  /** and since it last handed a mark a card, so two never overlap on a row */
  sinceCard: number;
  lane: number;
  born: number;
  bias: number;
  ticks: Tick[];
  rate: number;
};

function create(quality: VizQuality) {
  const card = quality === "card";
  const rnd = makeRandom(30514);
  /* scratch for the glass mask — lip widths in the low half, bends in the
     high — so the mask allocates nothing per frame */
  let lipBuf = new Float32Array(0);

  /* The lane table: one entry per visible row, whichever cluster it belongs
     to. Everything downstream — traffic, hover, cards, glass — reads lanes
     through this rather than deriving y from an index, which is the whole
     trick: a lane no longer has to sit in one full-width stack. Rebuilt only
     when the frame or the dials actually change. */
  type Lane = {
    y: number;
    h: number;
    x0: number;
    x1: number;
    ci: number;
    li: number;
    n: number;
    dm: number;
    shape: ClusterShape;
    amt: number;
    fan: number;
    pow: number;
    /** How much of the lane is showing, 1 for everything flat-on and 0 for a
        lane that is round the back. Only the cylinder ever sets it to
        anything else; everywhere else it is 1 and costs a multiply. */
    dim: number;
  };
  let lanes: Lane[] = [];
  let laneKey = "";
  /* the composition a card was placed under, so a change of arrangement can
     take back the cards it invalidates — see where this is read */
  let laneArrange = "";
  /* The drum's angle, carried rather than read off the clock.

     Derived from `t` it could not be stopped: a tap sets every row's speed to
     zero and the barrel kept turning underneath them, so "freeze" froze the
     traffic and left the surface it sits on rotating. Accumulated, holding it
     is simply declining to add to it. */
  let drumPhase = 0;
  let throughputEpoch = -1;
  let throughputVisibleLanes: number[] = [];
  let throughputIncomingLane = -1;

  /* One endpoint per row, up to the dial's ceiling. The base list is only
     fourteen names, so beyond that they repeat with a shard index — an
     endpoint served by several instances is a real thing, and it beats
     capping the row count at fourteen and leaving the rest of the panel as
     dead bands. */
  const MAX_ROWS = 90;
  const eps = Array.from({ length: MAX_ROWS }, (_, i) => {
    const shard = Math.floor(i / ENDPOINTS.length);
    return {
      name: shard
        ? `${ENDPOINTS[i % ENDPOINTS.length]}·${shard + 1}`
        : ENDPOINTS[i % ENDPOINTS.length],
      bias: (i * 7) % KINDS.length,
      k: Math.pow(rnd(), 1.4),
      phase: rnd() * 6.283,
      acc: 0,
      until: 0,
      cool: 0,
      quiet: 0,
      quietFrom: 0,
      said: true,
      gain: 1,
    };
  });

  /* indexed by endpoint, so a row keeps its lane for as long as it lives and
     the panel never reshuffles under you */
  const rows: (Row | null)[] = [];
  let pinned: { ep: number; id: number } | null = null;
  /* when the pinned card opened, and when it began to retract */
  let pinOpen = 0;
  let pinShut = -1;
  /* the lane the pinned card's panel stands on, caught on the first frame it
     is drawn and held — the anchor keeps following the mark, the panel does
     not follow the drum. NaN until caught. */
  let pinLaneY = NaN;
  let nextId = 1;

  /* The panel persists its values, so a config saved before a dial existed
     arrives with that key missing — and a bare cast turns the gap into
     `undefined`, which reads as 0 or false and silently disables whatever it
     controls. Merging over the defaults means adding a dial can never break
     an existing preset. Cached on the values object's identity, so it costs
     one merge per change rather than one per frame. */
  let merged: Ctl = FALLBACK;
  let mergedFrom: VizControls | null = null;
  const resolve = (raw: VizControls): Ctl => {
    if (raw === mergedFrom) return merged;
    mergedFrom = raw;
    const g = <K extends keyof Ctl>(k: K): Ctl[K] =>
      ({ ...FALLBACK[k], ...((raw[k as string] as object) ?? {}) }) as Ctl[K];
    merged = {
      size: g("size"),
      trail: g("trail"),
      row: g("row"),
      layout: g("layout"),
      colour: g("colour"),
      gaps: g("gaps"),
      motion: g("motion"),
      curve: g("curve"),
      fit: g("fit"),
      cards: g("cards"),
      glass: g("glass"),
      light: g("light"),
      bloom: g("bloom"),
      paint: g("paint"),
    };
    return merged;
  };

  /** the frame's width against the width the values were dialled at, held
      between a floor and a ceiling so a very narrow panel does not vanish and
      a very wide one does not turn into a poster of itself */
  const scaleOf = (fit: Ctl["fit"], w: number) =>
    fit.ref > 0
      ? Math.max(fit.min / 100, Math.min(fit.max / 100, w / fit.ref))
      : 1;

  /* Rebuilt only when the controls or the width actually change: at scale it
     is a dozen small objects, and a dozen small objects a frame is a hundred
     thousand an hour for nothing. */
  let fitFrom: Ctl | null = null;
  let fitS = 0;
  let fitTo: Ctl | null = null;
  const fitted = (c: Ctl, S: number): Ctl => {
    if (S === 1) return c;
    if (c === fitFrom && S === fitS && fitTo) return fitTo;
    fitFrom = c;
    fitS = S;
    fitTo = {
      ...c,
      size: {
        ...c.size,
        min: c.size.min * S,
        max: c.size.max * S,
        solidGap: c.size.solidGap * S,
      },
      trail: { ...c.trail, density: c.trail.density / S },
      /* `y` is deliberately not scaled. It is where the piece is placed in a
         layout, not part of its internal geometry, and the thing it has to
         clear — a headline set in CSS — does not shrink on the same curve.
         Scaled, the stack climbed into the text at 768. Left alone, the rows
         are shorter but still start below it and still run out of the bottom
         of the shot, which is the join they are meant to make. */
      row: { ...c.row, height: c.row.height * S, gap: c.row.gap * S },
      motion: {
        ...c.motion,
        speed: c.motion.speed * S,
        density: c.motion.density / S,
        hoverRadius: c.motion.hoverRadius,
      },
      curve: { ...c.curve, amount: c.curve.amount * S, fan: c.curve.fan * S },
      cards: { ...c.cards, gap: c.cards.gap * S },
      light: { ...c.light, width: c.light.width * S, speed: c.light.speed * S },
    };
    return fitTo;
  };

  /* the picture is drawn here, at device resolution, and the bloom pass reads
     it as a texture. A canvas only ever hands out one kind of context, so the
     visible 2D surface cannot also be the GL one. */
  const baseCv =
    typeof document === "undefined" ? null : document.createElement("canvas");
  /* The sheets, drawn as a thickness map for the glass shader: white where the
     glass is, stepping down across a bevel at each edge. Full size: only its
     gradient is ever read, and a lip two pixels wide does not survive being
     halved and filtered back up. */
  const maskCv =
    typeof document === "undefined" ? null : document.createElement("canvas");
  const baseCtx = baseCv?.getContext("2d") ?? null;
  const maskCtx = maskCv?.getContext("2d") ?? null;
  const pass = createBloomPass();
  /* The palette as a continuous scale rather than five buckets. A mark can
     then sit anywhere between two kinds, which is what makes a run read as a
     gradient rather than as banding. Ninety-six steps is past what the eye
     separates, and it means the frame loop never builds a colour. */
  const RAMP_N = 96;
  const hexRgb = (hex: string) => {
    const v = hex.replace("#", "");
    const n =
      v.length === 3
        ? v.split("").map((ch) => parseInt(ch + ch, 16))
        : [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
    return n.map((ch) => (Number.isFinite(ch) ? ch : 0));
  };
  let rampKey = "";
  let ramp: string[] = [];
  const buildRamp = (pa: Ctl["paint"]) => {
    const key = `${pa.open}|${pa.meter}|${pa.settle}|${pa.refund}|${pa.close}`;
    if (key === rampKey) return;
    rampKey = key;
    const cols = [pa.open, pa.meter, pa.settle, pa.refund, pa.close].map(
      hexRgb,
    );
    ramp = Array.from({ length: RAMP_N }, (_, i) => {
      const u = (i / (RAMP_N - 1)) * (cols.length - 1);
      const a = Math.min(cols.length - 1, Math.floor(u));
      const b = Math.min(cols.length - 1, a + 1);
      const f = u - a;
      const c = cols[a].map((v, k) => Math.round(v + (cols[b][k] - v) * f));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    });
  };

  /* no array built per call — this runs once per tick per frame */
  const hexOf = (p: Ctl["paint"], k: number) =>
    k === 0
      ? p.open
      : k === 1
        ? p.meter
        : k === 2
          ? p.settle
          : k === 3
            ? p.refund
            : p.close;

  return (
    out: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    dt: number,
    p: VizPointer,
    raw: VizControls,
  ) => {
    /* `resolve` merges each group over the fallback, so a caller may pass only
       the handful of values it cares about — the hero mounts this with nothing
       but `paint.readouts` turned off. Posters skip it: a card is never tuned
       and the merge would run thirty times for nothing. */
    const c = card ? FALLBACK : resolve(raw);
    /* the ratio VizCanvas already applied, read back rather than assumed */
    const dpr = out.getTransform().a || 1;
    const W = Math.max(1, Math.round(w * dpr));
    const H = Math.max(1, Math.round(h * dpr));
    if (baseCv && (baseCv.width !== W || baseCv.height !== H)) {
      baseCv.width = W;
      baseCv.height = H;
    }
    const ctx = baseCtx ?? out;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    /* Everything with a length is drawn for one width and multiplied from
       there, so a narrow frame is the same picture smaller rather than the
       same picture cropped. Cropping is what a fixed row height gives you: the
       rows keep their weight, the stack keeps its depth, and the panel simply
       shows less of the composition — which is a different composition.

       What scales is anything measured in pixels. What does not is anything
       measured in seconds or in proportion: a trail is a length of time, a gap
       is a length of time, and both should last as long whatever the width.

       Speed is the one that looks wrong and is not. It is pixels per second,
       and a mark crossing a narrower frame at the same pixel rate crosses it
       sooner — the traffic appears to speed up as the window shrinks. Scaled,
       the crossing takes the same time at every width. Density follows for the
       same reason: it is marks per hundred pixels, so holding it fixed while
       the picture shrinks packs the same count into less room. */
    const S = scaleOf(c.fit, w);
    const {
      size,
      trail,
      colour,
      gaps,
      row: rowCfg,
      layout,
      motion,
      curve,
      cards,
      glass,
      light,
      bloom,
      paint,
    } = fitted(c, S);

    buildRamp(paint);

    ctx.fillStyle = "#04040a";
    ctx.fillRect(0, 0, w, h);

    /* rows across, time along — the movement is horizontal and stays that way.
       Height and gap are given rather than derived from the frame, so a row
       keeps its weight when the count changes; a stack is placed and is
       allowed to run past the frame rather than being squeezed to fit. */
    const laneH = Math.max(1, rowCfg.height);
    /* sized to the row and capped, so a tall row does not turn into a
       billboard, and a cell wide enough that neighbours never touch */
    const glyphOf = (hh: number) =>
      Math.round(Math.max(6, Math.min(13, hh - 5)));
    /* one churn step for the whole frame: every glyph on screen re-rolls
       together, which reads as a machine ticking over rather than as noise */
    const churnStep = Math.floor(t * gaps.churn);
    const pitch = laneH + rowCfg.gap;

    /* ── the lane table ──
       For `band`, one cluster built exactly the way the single stack always
       was: pixels from whichever edge it is anchored to, because that is what
       makes a layout around it safe — anchored to the bottom with a fixed
       inset, the stack keeps exactly the same distance from the foot of the
       frame at every viewport. `join` is top and bottom at once: never nearer
       the top than `y`, and never leaving daylight at the foot.

       For everything else, the clusters come from ARRANGEMENTS, placed by
       fraction of the frame so the composition survives a resize. */
    const bendMul = layout.bend / 100;
    const defs = ARRANGEMENTS[layout.arrange] ?? null;
    const nBand = Math.max(2, Math.round(rowCfg.count));

    /* ── the cylinder ──
       Not a list of clusters but a different law for where a lane is, so it
       gets its own branch and is rebuilt every frame rather than cached: the
       whole point of it is that the lanes move.

       A drum lying across the frame, axis horizontal, seen head on. Rows are
       spaced evenly *around the circumference* — which is the one decision
       that makes it read as a solid rather than as lines sliding about. Even
       in angle projects to bunched at the top and bottom, because y is
       R·sin(phi): near the front the rows are far apart and nearly flat on,
       and as the surface turns away towards the silhouette they crowd
       together and thin out. Height follows from the same place, as the
       distance between a row's two edges once projected, so a row squashes as
       it goes over rather than being squashed by a separate rule.

       Rows are straight. All the curvature of a cylinder seen this way is in
       the spacing, and a bend on top of it would be a second, contradictory
       surface.

       The lane count is the full circumference and never changes, including
       the half that is round the back. A table that only held the visible
       lanes would renumber itself every frame, and lane numbers are what the
       traffic is indexed by — the rows would be culled and rebuilt constantly.
       The hidden half keeps running instead, so a lane comes back over the top
       already carrying payments rather than arriving empty. */
    const fast = !!layout.fast;
    /* A frame asked for its state and not its picture.

       Winding the clock forward to open on a populated stage costs whatever
       the wind is drawn at, and drawing is nearly all of it — the sheet mask,
       every mark, the bloom. None of that is looked at: only the last frame
       of the wind is ever seen. Advancing the traffic and throwing the rest
       away lets the wind run at real frame steps instead of coarse jumps,
       which is the difference between a stage that is full and one that is
       banded into however many strides it took to get there. */
    const warm = (raw as unknown as { __warm?: boolean }).__warm === true;
    const throughputClocked =
      typeof (raw as unknown as { __throughputEpoch?: unknown })
        .__throughputEpoch === "number";
    let emergingLane = -1;
    let emergingPulse = 0;
    const drum = layout.arrange === "cylinder";
    if (drum) {
      const nSt = Math.max(6, Math.round(layout.staves));
      const dPhi = (Math.PI * 2) / nSt;
      /* the band, with the rest of each step left as the gap between rows */
      const half = dPhi * (layout.band / 100);
      const R = h * (layout.radius / 100);
      const fall = Math.max(0.05, layout.falloff / 100);
      /* the drum slides with `shift` like everything else, though its radius
         stays keyed to the frame — a cylinder pushed down is the same
         cylinder lower, not a smaller one */
      const cy = h / 2 + layout.shift;
      const spin = (layout.spin * Math.PI) / 180;
      const throughput = raw as unknown as {
        __throughputEpoch?: number;
        __throughputPhase?: number;
      };
      const sharedEpoch =
        typeof throughput.__throughputEpoch === "number" &&
        Number.isFinite(throughput.__throughputEpoch)
          ? Math.max(0, Math.floor(throughput.__throughputEpoch))
          : 0;
      const sharedPhase =
        typeof throughput.__throughputPhase === "number" &&
        Number.isFinite(throughput.__throughputPhase)
          ? Math.min(1, Math.max(0, throughput.__throughputPhase))
          : 0;
      /* The new row enters once during the shared second, then holds its
           position for the rest of the cycle. Keep this a single, monotonic
           motion: the independent drum spin is disabled below for this hero,
           so there is no second offset after the row has settled. */
      const rowProgress = Math.min(1, sharedPhase / 0.28);
      const rowSlide = easeOut(rowProgress);
      const throughputPhase = (sharedEpoch + rowSlide) * dPhi;
      const uniformHeight = Math.max(8, Math.min(52, rowCfg.height));
      /* the same condition the traffic uses, read here because the lane table
           is built before the hover is resolved */
      if (!throughputClocked && !(motion.pinFreeze && pinned !== null)) {
        drumPhase += spin * dt;
      }
      /* `laneKey` is blanked below for as long as the drum is up, so a
         non-empty one here means the last frame was some other arrangement
         and whatever is in the table describes a different picture — even if
         it happens to hold the right number of lanes. */
      if (lanes.length !== nSt || laneKey !== "") {
        lanes = Array.from({ length: nSt }, (_, i) => ({
          y: 0,
          h: 1,
          x0: 0,
          x1: w,
          ci: 0,
          li: i,
          n: nSt,
          dm: 1.35,
          shape: "flat" as ClusterShape,
          amt: 0,
          fan: 0,
          pow: 0,
          dim: 0,
        }));
      }
      for (let i = 0; i < nSt; i++) {
        const L = lanes[i];
        /* wrapped into (-pi, pi] so the front of the drum is the middle of
           the range and `cos` is the facing term with no special cases */
        let phi = (i * dPhi + drumPhase - throughputPhase) % (Math.PI * 2);
        if (phi > Math.PI) phi -= Math.PI * 2;
        if (phi < -Math.PI) phi += Math.PI * 2;
        const yTop = cy + R * Math.sin(phi - half);
        const yBot = cy + R * Math.sin(phi + half);
        const projectedHeight = Math.abs(yBot - yTop);
        L.y = Math.min(yTop, yBot);
        /* Keep the payment-channel rows visually consistent as they travel
           around the cylinder. The geometry still controls their position and
           depth, but it no longer pinches the top and bottom into hairlines or
           makes the centre rows carry a different visual weight. */
        L.h = throughputClocked
          ? uniformHeight
          : Math.max(0.5, projectedHeight);
        L.x1 = w;
        /* Lambert, near enough: full on where the surface faces you, gone at
           the silhouette.

           The exponent is the whole argument. Squared looked more physical
           and read flat, because it puts the outer rows under a tenth of
           their brightness — and the outer rows are the ones doing the work.
           All the roundness is in the crowding towards the silhouette, so a
           falloff steep enough to hide the crowded rows hides the cylinder
           and leaves horizontal bands of varying brightness. Just past linear
           keeps them faint but legible, which is what a curved surface
           actually looks like. */
        const face = Math.cos(phi);
        const illumination = face > 0 ? Math.pow(face, fall) : 0;
        /* The payment-channel hero advances rows into the visible face once
           per second. Keep those edge rows readable when they arrive: the
           cylinder still shades from the centre outward, but its silhouette
           no longer makes a newly surfaced row look under-populated. Other
           stream arrangements retain the original falloff. */
        L.dim =
          throughputClocked && face > 0
            ? Math.max(0.55, illumination)
            : illumination;
        /* set here rather than where the lane was built: the table is only
           rebuilt when the stave count changes, so a density left at
           construction would not answer the dial until you touched another */
        L.dm = layout.flow / 100;
      }
      if (throughputClocked) {
        /* Keep one stable queue of lanes for the whole one-second cycle. The
           old implementation re-selected and re-stacked the visible lanes on
           every frame, so the cylinder movement and the slot normalization
           both moved the rows. One incoming lane now follows the existing
           queue by exactly one slot, making the entire stack share one offset. */
        const candidates: number[] = [];
        for (let i = 0; i < nSt; i++) {
          if (lanes[i].dim > 0.004) candidates.push(i);
        }
        candidates.sort((a, b) => lanes[b].dim - lanes[a].dim);
        const laneGap = Math.max(0, rowCfg.gap);
        const slotCount = Math.max(
          1,
          Math.min(candidates.length, Math.ceil(h / (uniformHeight + laneGap))),
        );

        const cycleChanged =
          throughputEpoch !== sharedEpoch ||
          throughputVisibleLanes.length !== slotCount;
        if (cycleChanged) {
          if (throughputVisibleLanes.length !== slotCount) {
            throughputVisibleLanes = candidates.slice(0, slotCount);
          } else {
            const nextLane =
              throughputIncomingLane >= 0
                ? throughputIncomingLane
                : (candidates.find(
                    (i) => !throughputVisibleLanes.includes(i),
                  ) ?? 0);
            throughputVisibleLanes = [
              ...throughputVisibleLanes.slice(1),
              nextLane,
            ];
          }

          const selected = new Set(throughputVisibleLanes);
          throughputIncomingLane =
            candidates.find((i) => !selected.has(i)) ??
            (throughputVisibleLanes[throughputVisibleLanes.length - 1] + 1) %
              nSt;
          throughputEpoch = sharedEpoch;
        }

        const visibleLanes = throughputVisibleLanes;
        const fitHeight =
          (h - Math.max(0, visibleLanes.length - 1) * laneGap) /
          Math.max(1, visibleLanes.length);
        const visibleHeight = Math.max(1, fitHeight);
        const lanePitch = visibleHeight + laneGap;
        const stackTop = 0;
        const stackOffset = rowSlide * lanePitch;
        const activeLanes = new Set([...visibleLanes, throughputIncomingLane]);
        for (let i = 0; i < nSt; i++) {
          if (!activeLanes.has(i)) lanes[i].dim = 0;
        }
        for (let i = 0; i < visibleLanes.length; i++) {
          const L = lanes[visibleLanes[i]];
          L.h = visibleHeight;
          L.y = stackTop + i * lanePitch - stackOffset;
          L.dim = Math.max(0.55, L.dim);
        }
        if (throughputIncomingLane >= 0) {
          const L = lanes[throughputIncomingLane];
          L.h = visibleHeight;
          L.y = stackTop + visibleLanes.length * lanePitch - stackOffset;
          L.dim = Math.max(0.55, L.dim);
        }
      }
      if (throughputClocked && sharedPhase < 0.28) {
        /* The incoming queue item is the only row that should receive the
           arrival emphasis while it travels into the bottom slot. */
        emergingLane = throughputIncomingLane;
        emergingPulse = 1 - rowProgress;
      }
      laneKey = "";
    } else if (lanes.length && laneKey === "") {
      /* coming off the cylinder, so the cached table is stale by definition */
      lanes = [];
    }

    const lkey = drum
      ? ""
      : `${layout.arrange}|${bendMul}|${layout.shift}|${layout.rows}|${w}|${h}|${S}|${laneH}|${rowCfg.gap}|${nBand}|${rowCfg.anchor}|${rowCfg.y}|${curve.amount}|${curve.fan}|${curve.power}`;
    if (!drum && lkey !== laneKey) {
      laneKey = lkey;
      lanes = [];
      if (!defs) {
        const stack = nBand * pitch;
        const top =
          rowCfg.anchor === "join"
            ? Math.max(rowCfg.y, h - stack)
            : rowCfg.anchor === "bottom"
              ? h - stack - rowCfg.y
              : rowCfg.anchor === "top"
                ? rowCfg.y
                : (h - stack) / 2 + rowCfg.y;
        for (let i = 0; i < nBand; i++) {
          lanes.push({
            y: top + i * pitch,
            h: laneH,
            x0: 0,
            x1: w,
            ci: 0,
            li: i,
            n: nBand,
            dm: 1,
            dim: 1,
            shape: "peel",
            amt: curve.amount * bendMul,
            fan: curve.fan,
            pow: Math.max(1, curve.power),
          });
        }
      } else {
        /* landscape enough to have a column beside the words. Aspect rather
           than a pixel width, because what decides it is whether the text
           wraps to the full width, and that is a shape question. */
        const wide = w / Math.max(1, h) >= 1.1;
        for (let ci = 0; ci < defs.length; ci++) {
          const d = defs[ci];
          if (d.wide && !wide) continue;
          const hh = Math.max(1, laneH * (d.hs ?? 1));
          /* The pitch absorbs the fan, and this is what makes a nested set
             actually nest.

             Fan is how much more each row bends than the one above it, so the
             clear space between two neighbours is not the row gap — it is the
             row gap plus `fan × shape`, and every shape here peaks at one. A
             negative fan therefore eats into the gap wherever the bend is
             deepest, and once its size passes the gap the rows cross. At fan
             -18 against a 7px gap they overlapped by eleven pixels straight
             through the crown, which is where the eye is looking.

             Adding the squeeze back into the pitch makes the configured gap
             the *tightest* the rows ever get rather than the average: they
             close to exactly `gap` at the deepest point and open to `gap +
             squeeze` at the ends. Which is not a workaround, it is what
             concentric means — rings about a common centre are closest
             together directly above it and splay apart towards their ends,
             because the far end of each ring is the steeper part of it. So a
             fan can now be as strong as the picture wants without any preset
             having to know the row gap it will be drawn at.

             Only the clusters. `band` keeps the plain pitch it always had. */
          const squeeze = Math.max(0, -d.fan * S);
          const cp = hh + rowCfg.gap + squeeze;
          /* every cluster thinned or thickened by the same factor, so a
             composition keeps its proportions — a single row cluster is the
             one that must not round to nothing */
          const dn = Math.max(1, Math.round(d.n * (layout.rows / 100)));
          const cy =
            (d.join ? Math.max(d.y * h, h - dn * cp) : d.y * h) + layout.shift;
          for (let i = 0; i < dn; i++) {
            lanes.push({
              y: cy + i * cp,
              h: hh,
              x0: d.x0 * w,
              x1: d.x1 * w,
              ci,
              li: i,
              n: dn,
              dm: d.dm ?? 1,
              dim: 1,
              shape: d.shape,
              amt: d.amt * S * bendMul,
              fan: d.fan * S,
              pow: d.pow,
            });
          }
        }
      }
    }
    /* A card is placed against the lane its mark sits on, and swapping the
       arrangement re-points every lane at different ground — so a card left
       open across the change describes the right payment in the wrong place,
       and the ones that were clear of the headline are exactly the ones that
       land on it. Taken back on the change itself rather than on any rebuild:
       a resize re-lays the same composition, where a card that vanished every
       time the window moved would be its own bug. */
    if (layout.arrange !== laneArrange) {
      laneArrange = layout.arrange;
      for (const row of rows) {
        if (!row) continue;
        for (const k of row.ticks) k.cd = -1;
      }
      pinned = null;
    }
    const nLanes = lanes.length;

    /* The line each lane is wrapped along, by its cluster's shape.

       `peel` is the original: a power curve, perfectly flat where marks enter
       and bending harder towards the far end of the span, so the picture
       reads as a sheet peeling away rather than as a ripple — `pow` is how
       long it stays straight. `arch` bows across the span like a section of
       a circle. `wave` undulates, `pow` cycles of it, phased per cluster so
       two waves are never in step. `step` is an S-bend: one level in, another
       level out.

       `fan` is what makes any of them three-dimensional: each row bends a
       little more than the one above it, so the rows are parallel where they
       enter and spread apart as they fall.

       `slopeAt` is the derivative, and all that is needed to stand a mark up
       square to the curve — marks left vertical on a bent row read as a shear
       rather than a wrap. */
    const bendAt = (lane: number, x: number) => {
      const L = lanes[lane];
      const amp = L.amt + L.li * L.fan;
      if (amp === 0) return 0;
      const sw = Math.max(1, L.x1 - L.x0);
      const u = Math.max(0, Math.min(1, (x - L.x0) / sw));
      switch (L.shape) {
        case "peel":
          return amp * Math.pow(1 - u, L.pow);
        case "arch":
          return amp * Math.sin(Math.PI * u);
        case "wave":
          return amp * Math.sin(6.283 * L.pow * u + L.ci * 1.7);
        case "step":
          return amp * u * u * (3 - 2 * u);
        default:
          return 0;
      }
    };
    const slopeAt = (lane: number, x: number) => {
      const L = lanes[lane];
      const amp = L.amt + L.li * L.fan;
      if (amp === 0) return 0;
      const sw = Math.max(1, L.x1 - L.x0);
      const u = Math.max(0, Math.min(1, (x - L.x0) / sw));
      switch (L.shape) {
        case "peel":
          return (-amp * L.pow * Math.pow(1 - u, L.pow - 1)) / sw;
        case "arch":
          return (amp * Math.PI * Math.cos(Math.PI * u)) / sw;
        case "wave":
          return (
            (amp * 6.283 * L.pow * Math.cos(6.283 * L.pow * u + L.ci * 1.7)) /
            sw
          );
        case "step":
          return (amp * 6 * u * (1 - u)) / sw;
        default:
          return 0;
      }
    };
    const tilt = curve.tilt;

    /* Where the pointer sits, as a continuous lane coordinate rather than an
       index, so the falloff around it is smooth. The row under the pointer
       stops dead; its neighbours are dragged back by how near they are, out
       to hoverRadius. Freezing one row alone made it look detached from the
       panel — the gradient is what keeps it part of the same picture.

       Resolved before anything moves or is emitted, because a slowed row must
       also take fewer marks: density is per unit of distance, so a row that
       covers less ground needs fewer of them to stay as dense as it was. */
    let held = -1;
    let heldF = 0;
    let heldCi = -1;
    if (p.inside && motion.hoverHold && !card) {
      /* Every lane tested straight rather than solved for — the table is a
         few dozen entries, and with clusters there is no single pitch to
         divide by anyway. Snapped to the nearest lane rather than tested for
         being literally inside one: the gap between rows used to be a dead
         zone — resting the pointer on an edge let the hold go, the row
         resumed, and a pointer that had not moved flickered between held and
         free. The band reaches halfway into the gap on each side, which
         tiles a cluster with no seam, and stops at its outer edges. */
      let bestD = 1e9;
      for (let l = 0; l < nLanes; l++) {
        const L = lanes[l];
        if (L.dim <= 0.004) continue;
        if (p.x < L.x0 - 24 || p.x > L.x1 + 24) continue;
        const py = p.y - bendAt(l, p.x);
        const d = Math.abs(py - (L.y + L.h / 2));
        if (d <= L.h / 2 + (L.h + rowCfg.gap) / 2 && d < bestD) {
          bestD = d;
          held = l;
          heldCi = L.ci;
          heldF = l + (py - (L.y + L.h / 2)) / (L.h + rowCfg.gap);
        }
      }
    }
    /* A pin stops everything, for the places with no pointer to hold a row
       with. Tapping is the whole interaction on a touch screen: it has to do
       something more than pick, and holding one row while the rest keep moving
       is a hover gesture with no hover behind it. The tap stops the picture and
       the tap outside starts it again. */
    const frozen = motion.pinFreeze && pinned !== null;
    const radius = Math.max(0.001, motion.hoverRadius);
    const slowOf = (lane: number) => {
      if (frozen) return 0;
      if (held < 0) return 1;
      /* the drag stays inside the held lane's own cluster — a hover over one
         island slowing traffic on another reads as the panel breaking, not as
         a gesture */
      if (lanes[lane].ci !== heldCi) return 1;
      /* The drum's lanes are a ring, not a list: the first and last indices
         are neighbours in angle however far apart the table puts them. Straight
         index distance therefore cuts the falloff dead at that seam — the rows
         one way from the pointer drag and the ones the same distance the other
         way run at full speed, with a hard edge between them in the middle of
         the visible face. Taking the shorter way round the ring is what makes
         the reach the same in both directions, and it matters more the wider
         the radius: at a couple of rows the seam is a curiosity, at twenty it
         is most of the drum behaving differently on one side. */
      let d = Math.abs(lane - heldF);
      if (drum) d = Math.min(d, nLanes - d);
      const f = Math.min(1, d / radius);
      return f * f * (3 - 2 * f);
    };

    const px = Math.max(1, motion.speed);
    /* Which way the marks run. The curve is anchored to the frame, not to the
       traffic, so flipping this sends them the other way across a bend that
       stays exactly where it was — which is the point: the two are separate
       decisions and reading one off the other would tie them together. */
    const rev = !!motion.reverse;
    const dir = rev ? 1 : -1;
    /* where a lane's marks come in: its own span's edge, not the frame's */
    const entryOf = (e: number) => (rev ? lanes[e].x0 : lanes[e].x1);
    /* how long a tick survives, for the readout only — nothing is placed by it */
    const WIN = w / px;
    const nEp = nLanes;

    /* ── traffic ────────────────────────────────────────────────────── */
    for (let e = 0; e < nEp; e++) {
      /* Nothing for the half of the drum that is facing away. Its rows are
         already skipped at draw time, but they were still being fed — and on
         a forty-seven stave barrel that is half the traffic in the piece
         emitted, aged and culled for a surface pointing backwards.

         Safe because of where a lane crosses this line: `dim` reaches it at
         about eighty-nine degrees from the front, which is the silhouette,
         where the row is projected to almost no height and is invisible
         regardless. A lane retiring there and refilling as it comes back has
         seconds of travel before it is anything the eye can resolve. */
      if (fast && !throughputClocked && lanes[e].dim <= 0.004) continue;
      /* the wind's extra appetite. Deliberately not applied to the hush roll
         below: silencing rows less often during the wind fills the picture,
         but it fills it as unbroken sheets, and marks composite additively.
         Overlaps sum past the bloom threshold, so the opening frame glowed
         hotter than anything the running stream ever produces and then
         visibly cooled. Rows going quiet on their normal schedule keeps the
         dark road between clusters that stops the halos merging. */
      const fill = warm ? Math.max(1, layout.entry / 100) : 1;
      const slow = slowOf(e);
      if (slow < 0.002) continue;
      /* A held row intentionally stops, but its neighbouring rows still need
         enough replenishment to remain visually continuous during a long
         hover. Without a small floor, a row can lose its last marks before
         the eased hover field releases it, which reads as the lower edge
         emptying out. The movement remains fully eased; this only prevents
         emission starvation in the slowed part of the field. */
      const emitSlow = held >= 0 ? Math.max(slow, 0.22) : slow;
      const ep = eps[e];
      /* how busy this endpoint runs relative to the others. At variation 0
         every row carries the same traffic; at 100 they range from almost
         nothing to roughly twice the average. The slow swell on top is what
         keeps a row from sitting at one level for the whole run. */
      const v = motion.variation / 100;
      const lean = 1 - v + v * (0.2 + ep.k * 1.8);
      const swell = 0.5 + 0.5 * Math.sin(t * 0.23 + ep.phase);
      const appetite = lean * (1 - SWELL * 0.5 + SWELL * swell);
      if (appetite < 0.12) {
        ep.acc = 0;
        continue;
      }

      /* A hush: the row stops emitting altogether for a stretch, which is
         the only way to get a real gap. Thinning the density instead just
         spaces the marks out — the bars get sparse rather than the row going
         quiet, and the texture you tuned goes with them. Never started
         mid-trail, so a run is never cut in half. */
      if (t > ep.quiet && t > ep.until && rnd() < dt * (gaps.often / 100) * 2) {
        ep.quietFrom = t;
        ep.quiet = t + gaps.length * (0.4 + rnd() * 1.6);
        /* Decided once, as the hush opens: this gap either carries the word or
           it does not. Rolling for it every frame instead would give a long
           gap more chances than a short one — the opposite of one per gap. */
        ep.said = rnd() * 100 >= gaps.text;
      }
      if (t < ep.quiet) {
        ep.acc = 0;
        /* One word per hush, laid down at its middle so it ends up with clear
           road on both sides. A second would turn the gap into a ticker, which
           is the texture the gap exists to interrupt — and a long gap deserves
           more silence, not more talking. */
        if (
          !ep.said &&
          glyphOf(lanes[e].h) > 3 &&
          t >= (ep.quietFrom + ep.quiet) / 2
        ) {
          emitText(e, 0);
          ep.said = true;
        }
        continue;
      }

      /* `dm` boosts the burst rate as well as the fill: a short span drains
         in a second or two, so at the band's cadence a small cluster is
         empty road most of the time — the very thing it is on screen to
         disprove. */
      if (
        t > ep.cool &&
        rnd() < dt * (trail.often / 100) * 1.6 * appetite * lanes[e].dm
      ) {
        const len = trail.length * (0.35 + rnd() * 1.5);
        ep.until = t + len;
        ep.cool = ep.until + len * TRAIL_COOL * (0.5 + rnd());
        ep.gain = 0.5 + Math.pow(rnd(), 1.7) * 1.3;
      }
      const inTrail = t < ep.until;
      /* marks per 100px × pixels per second = marks per second */
      const perHundred = inTrail
        ? trail.density * ep.gain * appetite
        : motion.density * appetite;
      const rate = (perHundred / 100) * px * emitSlow * lanes[e].dm * fill;

      ep.acc += dt * rate;
      while (ep.acc >= 1) {
        ep.acc -= 1;
        /* Back-date it into the frame. Every event born this tick would
           otherwise spawn at exactly the right-hand edge, and since all rows
           step together that quantises them into columns marching across the
           panel — regular in a way nothing about the data is. The leftover
           accumulator says how long ago this one was really due, so it enters
           part-way in and the rows stop agreeing with each other. */
        emit(e, inTrail ? ep.gain : 0.5, (ep.acc / rate) * px, inTrail);
      }
    }

    function emit(e: number, gain: number, back: number, inTrail: boolean) {
      let row = rows[e];
      if (!row) {
        row = {
          ep: e,
          lane: e,
          born: t,
          bias: eps[e].bias,
          ticks: [],
          rate: 0,
          sinceSolid: 1e9,
          sinceCard: 1e9,
        };
        rows[e] = row;
      }
      /* The row's own place on the scale is the anchor. `mix` is how far a
         mark may stray from it, and `gradient` is a slow sweep applied at the
         moment of emission — because marks are laid down over time and then
         travel, a sweep in time becomes a ramp in space along the row. That is
         where the gradients come from: nothing is drawn as a gradient, it is
         what a moving colour looks like once it has been written down. */
      const anchor = row.bias / (KINDS.length - 1);
      const stray = (rnd() - 0.5) * (colour.mix / 100);
      const sweep =
        (colour.gradient / 100) *
        0.5 *
        Math.sin(t * colour.cycle + row.lane * 1.7 + eps[e].phase);
      const hue = Math.max(0, Math.min(1, anchor + stray + sweep));
      const kind = Math.max(
        0,
        Math.min(KINDS.length - 1, Math.round(hue * (KINDS.length - 1))),
      );

      /* Two different things, and keeping them apart is the whole point.
         A *trail* is many thin marks packed close: length comes from how long
         the endpoint fires, never from the width of any one mark. A *solid*
         is one wide mark on its own.

         So a trail is made only of thin marks, and a solid needs clear road
         behind it. Allowing solids inside a trail is what produced the long
         blocks — several land touching and read as one slab, which is not a
         big mark, it is a rendering accident. */
      const lo = Math.min(size.min, size.max);
      const hi = Math.max(size.min, size.max);
      const spread = (hi - lo) * (size.variance / 100);

      let wide: number;
      let bonus: number;
      if (
        !inTrail &&
        row.sinceSolid > size.solidGap &&
        rnd() * 100 < size.solids
      ) {
        wide = lo + (hi - lo) * (0.6 + rnd() * 0.4);
        bonus = 0.3;
        row.sinceSolid = 0;
      } else {
        /* cubed, so ordinary marks stay near the floor however wide the range
           is — a linear spread just makes everything medium */
        wide = lo + spread * Math.pow(rnd(), 3) * (inTrail ? 0.5 : 1);
        bonus = 0.05;
      }

      row.ticks.push({
        at: t,
        hue,
        x: entryOf(e) - dir * back,
        sp: 1 + (rnd() - 0.5) * (motion.drift / 100) * 0.5,
        kind,
        mag: Math.min(1, Math.pow(rnd(), 2.4) * (0.6 + gain * 0.42) + bonus),
        size: wide,
        ph: rnd() * 6.283,
        br: 0.55 + rnd() * 0.9,
        agent: (rnd() * AGENTS.length) | 0,
        amt: 0.02 + rnd() * 9.8,
        sd: (rnd() * 1e9) | 0,
        fee: 0.0001 + rnd() * 0.0008,
        id: nextId++,
        /* A handful of payments introduce themselves on the way past. Spaced
           by distance travelled rather than by count, so two never end up
           overlapping on the same row however thick the traffic is running. */
        cd:
          cards.max > 0 &&
          cards.often > 0 &&
          row.sinceCard > cards.gap &&
          rnd() * 100 < cards.often
            ? 0
            : -1,
        cdIn: -1,
        cdOut: -1,
        cdX: 0,
        cdY: 0,
        gl: -1,
      });
      if (row.ticks[row.ticks.length - 1].cd === 0) row.sinceCard = 0;
    }

    /* A hash drifting through a hush. It is carried as an ordinary tick with
       no bar to it, so it moves, drifts, fades at the edges and is culled by
       exactly the same code as everything else on the row — a second kind of
       thing travelling alongside would only be a second thing to keep in
       step. */
    function emitText(e: number, back: number) {
      let row = rows[e];
      if (!row) {
        row = {
          ep: e,
          lane: e,
          born: t,
          bias: eps[e].bias,
          ticks: [],
          rate: 0,
          sinceSolid: 1e9,
          sinceCard: 1e9,
        };
        rows[e] = row;
      }
      row.ticks.push({
        at: t,
        hue: 0,
        x: entryOf(e) - dir * back,
        sp: 1 + (rnd() - 0.5) * (motion.drift / 100) * 0.5,
        kind: 0,
        mag: 0.35 + rnd() * 0.3,
        size: 0,
        ph: rnd() * 6.283,
        br: 0.55 + rnd() * 0.9,
        agent: (rnd() * AGENTS.length) | 0,
        amt: 0.02 + rnd() * 9.8,
        sd: (rnd() * 1e9) | 0,
        fee: 0.0001 + rnd() * 0.0008,
        id: nextId++,
        cd: -1,
        cdIn: -1,
        cdOut: -1,
        cdX: 0,
        cdY: 0,
        gl: (rnd() * 4096) | 0,
      });
    }

    /* ── move, cull what has left the frame, retire quiet rows ──────── */
    const step = px * dt;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      /* a lane the current arrangement no longer has — retired outright,
         before anything reads its geometry */
      if (row.lane >= nLanes) {
        rows[i] = null;
        continue;
      }
      const L = lanes[row.lane];
      /* Gone round the back: retired outright rather than left to drift.
         Freezing it instead would park a clump of marks in place for the two
         minutes it spends hidden and then bring that clump back over the
         horizon; letting it keep moving is the cost this is trying not to
         pay. Retired, it is rebuilt by `emit` when it faces front again. */
      if (fast && !throughputClocked && L.dim <= 0.004) {
        rows[i] = null;
        continue;
      }
      /* one pass: move, and keep whatever is still on screen. With drift the
         oldest is no longer reliably leftmost, so this compacts in place
         rather than shifting off the front — and it allocates nothing. */
      const slow = slowOf(row.lane);
      const rowStep = step * slow;
      row.sinceSolid += rowStep;
      if (cards.max > 0) row.sinceCard += rowStep;
      let keep = 0;
      for (let j = 0; j < row.ticks.length; j++) {
        const k = row.ticks[j];
        k.x += dir * rowStep * k.sp;
        if (k.x >= L.x0 - 60 && k.x <= L.x1 + 60) row.ticks[keep++] = k;
      }
      row.ticks.length = keep;
      /* counted, not filtered — the filter built and threw away an array per
         row per frame for a number */
      let recent = 0;
      for (let j = 0; j < row.ticks.length; j++)
        if (t - row.ticks[j].at < 1) recent++;
      row.rate += (recent - row.rate) * Math.min(1, dt * 4);
      /* the window is the lane's own span — a short run empties sooner */
      const stale =
        !row.ticks.length &&
        t - row.born > ((L.x1 - L.x0) / px) * (0.4 + HOLD * 1.4);
      if (stale) rows[i] = null;
    }

    /* everything above is the state; everything below is the picture */
    if (warm) return;

    /* ── the ground: every lane, whether or not anything is on it ─────
       Drawn for the live rows only, it blinked in and out as endpoints came
       and went, and a structure that appears and disappears reads as the
       structure moving. Held still for all of them, it is a fixed frame the
       marks travel over — which is the thing the reference actually does. */
    /* Glass is not painted here at all — it is a shape handed to the shader.
       The sheets go into a half-size thickness map, white where the glass is
       and stepping down across a bevel at each edge; the shader reads that
       map's gradient as a surface normal. The flat interior has no gradient,
       so light passes straight through it, and only the bevelled edges bend
       what is behind them — which is exactly what a thin sheet does. */
    const glassOn =
      rowCfg.bg === "glass" && maskCv !== null && maskCtx !== null;
    if (glassOn && maskCv && maskCtx) {
      if (maskCv.width !== W || maskCv.height !== H) {
        maskCv.width = W;
        maskCv.height = H;
      }
      const m = maskCtx;
      m.setTransform(W / w, 0, 0, H / h, 0, 0);
      m.globalCompositeOperation = "source-over";
      m.fillStyle = "#000";
      m.fillRect(0, 0, w, h);
      /* The band filled over and over, each pass a little further in, so
         thickness climbs from nothing at the edge to full in the middle.

         The insets follow a circle, not even spacing. Even spacing is a ramp,
         and a ramp has one slope the whole way across — the shader then lights
         the entire bevel at once and the row reads as a fat grey bar. A circle
         crowds the steps against the outside, so the sheet turns over hard at
         the lip and flattens immediately after: a thin catch of light on the
         edge, clear glass behind it. */
      /* The lip is not the same width the whole way along. A sheet with one
         constant edge is a drawn rectangle; a real one rolls over unevenly, so
         it catches light in stretches and goes quiet in between. Three slow
         waves at odd frequencies, offset per lane, keep the pattern from ever
         repeating cleanly — a wide lip is a shallow slope and stays dark, a
         narrow one turns hard and lights up. */
      const patch = glass.patchy / 100;
      /* As many passes as the lip has device pixels to spend them on, and no
         more. Ten was flat waste at the settled bevel: a lip under two device
         pixels wide quantises to the same texels whether the profile behind
         them has three levels or ten, and the shader reads the texels, not the
         profile. The cap is kept for the wide-bevel end of the dial, where the
         extra levels are visible again. */
      const maxLip = glass.bevel * (1 + patch * 1.4);
      const STEPS = Math.max(3, Math.min(10, Math.ceil(maxLip * dpr) + 1));
      m.globalCompositeOperation = "lighter";
      m.fillStyle = `rgba(255,255,255,${(1 / STEPS).toFixed(3)})`;
      /* The waves and the bend sampled once per column and read back in every
         pass. Inside the loops they were being recomputed per step and per
         edge — twenty times each — which put sixty thousand sines a frame
         behind a picture that only ever looked at three thousand of them. */
      for (let i = 0; i < nLanes; i++) {
        const L = lanes[i];
        /* round the back: no sheet, so nothing for the shader to bend */
        if (L.dim <= 0.004) continue;
        const gx0 = Math.max(0, L.x0);
        const gx1 = Math.min(w, L.x1);
        /* How finely the edge has to be walked, and the answer depends on what
           is varying along it.

           Twelve pixels is the step a *bend* needs: the curve can turn hard,
           so the sheet has to be re-measured often enough to follow it. On a
           row with no bend the only thing changing along x is the lip wave,
           and its fastest term has a period near seven hundred pixels — at
           twelve that is sixty samples a cycle, which is drawing a straight
           line the long way round. Fifty-six still gives a dozen samples per
           cycle and is the same picture. The wave is kept either way; what is
           dropped is the oversampling, not the unevenness it produces.

           Spacing is derived from the count rather than assumed, so the last
           sample lands exactly on `gx1`. The old form stepped in fixed twelves
           and stopped wherever the division ran out — up to eleven pixels shy
           of the right-hand edge, which left every sheet fractionally short. */
        const amp = L.amt + L.li * L.fan;
        const stepX = fast && amp === 0 ? 56 : 12;
        const NX = Math.max(2, Math.ceil((gx1 - gx0) / stepX) + 1);
        const dx = (gx1 - gx0) / (NX - 1);
        if (lipBuf.length < NX * 2) lipBuf = new Float32Array(NX * 2);
        const cap = L.h / 2 - 0.25;
        for (let j = 0; j < NX; j++) {
          const x = gx0 + j * dx;
          const wv =
            0.5 * Math.sin(x * 0.0042 + i * 1.7 + t * 0.35) +
            0.32 * Math.sin(x * 0.0011 - i * 0.9 - t * 0.19) +
            0.18 * Math.sin(x * 0.0089 + i * 3.3 + t * 0.52);
          lipBuf[j] = Math.max(0.2, glass.bevel * (1 + patch * 1.4 * wv));
          lipBuf[NX + j] = amp === 0 ? 0 : bendAt(i, x);
        }
        for (let s = 0; s < STEPS; s++) {
          const y = (s + 1) / STEPS;
          const depth = 1 - Math.sqrt(1 - y * y);
          m.beginPath();
          for (let j = 0; j < NX; j++) {
            m.lineTo(
              gx0 + j * dx,
              L.y + Math.min(cap, lipBuf[j] * depth) + lipBuf[NX + j],
            );
          }
          for (let j = NX - 1; j >= 0; j--) {
            m.lineTo(
              gx0 + j * dx,
              L.y + L.h - Math.min(cap, lipBuf[j] * depth) + lipBuf[NX + j],
            );
          }
          m.closePath();
          m.fill();
        }
      }

      /* And the light itself, travelling across the whole composition at the
         angle the beams already use. Where it falls the sheets are there;
         where it has passed they thin away to nothing. Multiplied into the
         thickness rather than added to the picture, so the dark stretches
         stop refracting too — glass you cannot see does not bend anything. */
      if (patch > 0) {
        const rad = (light.angle * Math.PI) / 180;
        const dx = Math.cos(rad);
        const dy = Math.sin(rad);
        const span = Math.abs(w * dx) + Math.abs(h * dy);
        const cx = w / 2;
        const cy = h / 2;
        const grad = m.createLinearGradient(
          cx - (dx * span) / 2,
          cy - (dy * span) / 2,
          cx + (dx * span) / 2,
          cy + (dy * span) / 2,
        );
        const phase = t * light.speed * 0.12;
        const amp = patch * 0.85;
        for (let k = 0; k <= 24; k++) {
          const u = (k / 24) * span + phase;
          const wv =
            0.5 * Math.sin(u * 0.006) +
            0.3 * Math.sin(u * 0.0017 + 1.7) +
            0.2 * Math.sin(u * 0.0131 + 4.2);
          const v = Math.round(255 * (1 - amp * (0.5 - 0.5 * wv)));
          grad.addColorStop(k / 24, `rgb(${v},${v},${v})`);
        }
        m.globalCompositeOperation = "multiply";
        m.fillStyle = grad;
        m.fillRect(0, 0, w, h);
      }
      m.globalCompositeOperation = "source-over";
    }

    /* ── the drawn rim ──
       Two bands a row and nothing between them. Painted straight onto the
       picture in the same pass as everything else, so it costs no map, no
       upload and no shader — which is the whole point of it.

       Each band is faded by the lane's own facing, or the halves of the drum
       that are turned away would show their rims at full strength while the
       traffic on them is gone: bright edges around empty rows, which is the
       one thing that would give the trick away. On a straight row the band is
       a rectangle; on a bent one it has to follow the curve, so the ribbon
       walks it at the same step the sheets used to. */
    if (rowCfg.bg === "edge") {
      const STEP = 12;
      const band = (
        i: number,
        L: (typeof lanes)[number],
        off: number,
        thick: number,
        alpha: number,
      ) => {
        /* still faded by the lane's facing, held or not: a row picked out near
           the silhouette should not light up brighter than the surface it is
           part of */
        const a = Math.min(1, alpha * L.dim);
        if (thick <= 0 || a <= 0.002) return;
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        const amp = L.amt + L.li * L.fan;
        if (amp === 0) {
          ctx.fillRect(L.x0, L.y + off, L.x1 - L.x0, thick);
          return;
        }
        ctx.beginPath();
        for (let x = L.x0; x <= L.x1; x += STEP)
          ctx.lineTo(x, L.y + off + bendAt(i, x));
        for (let x = L.x1; x >= L.x0; x -= STEP)
          ctx.lineTo(x, L.y + off + thick + bendAt(i, x));
        ctx.closePath();
        ctx.fill();
      };
      for (let i = 0; i < nLanes; i++) {
        const L = lanes[i];
        if (L.dim <= 0.004) continue;
        /* the one row being pointed at, each rim to its own width and white */
        const on = i === held;
        const tPx = on ? rowCfg.hoverTopPx : rowCfg.topPx;
        const bPx = on ? rowCfg.hoverBotPx : rowCfg.botPx;
        band(i, L, 0, tPx, (on ? rowCfg.hoverTopA : rowCfg.topA) / 100);
        band(i, L, L.h - bPx, bPx, (on ? rowCfg.hoverBotA : rowCfg.botA) / 100);
      }
    } else if (!glassOn && rowCfg.bg !== "none" && rowCfg.bgAlpha > 0) {
      const a = (rowCfg.bgAlpha / 100).toFixed(3);
      const STEP = 12;
      if (rowCfg.bg === "stroke") {
        ctx.strokeStyle = `rgba(150,170,220,${a})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < nLanes; i++) {
          const L = lanes[i];
          if (L.dim <= 0.004) continue;
          ctx.beginPath();
          for (const edge of [0, L.h]) {
            for (let x = L.x0; x <= L.x1; x += STEP) {
              const yy = L.y + edge + bendAt(i, x) + 0.5;
              if (x === L.x0) ctx.moveTo(x, yy);
              else ctx.lineTo(x, yy);
            }
          }
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = `rgba(150,170,220,${a})`;
        for (let i = 0; i < nLanes; i++) {
          const L = lanes[i];
          if (L.dim <= 0.004) continue;
          ctx.beginPath();
          for (let x = L.x0; x <= L.x1; x += STEP)
            ctx.lineTo(x, L.y + bendAt(i, x));
          for (let x = L.x1; x >= L.x0; x -= STEP)
            ctx.lineTo(x, L.y + L.h + bendAt(i, x));
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    /* The held row, marked so a stopped row reads as held rather than broken.
       Not in `edge`, where its own rims have already brightened and this would
       be a second, redundant mark standing proud of them. */
    if (held >= 0 && rowCfg.bg !== "edge") {
      const L = lanes[held];
      ctx.strokeStyle = "rgba(233,236,255,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const edge of [-2.5, L.h + 2.5]) {
        for (let x = L.x0; x <= L.x1; x += 12) {
          const yy = L.y + edge + bendAt(held, x);
          if (x === L.x0) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
      }
      ctx.stroke();
    }

    /* ── ticks ──────────────────────────────────────────────────────── */
    const pulse = bloom.pulse / 100;

    /* The moving light. A band travels across the composition at an angle;
       anything it touches is lifted, and the bloom pass — which reads the
       finished picture rather than any individual mark — turns that lift into
       glow that pools across whatever the band is crossing. That is the
       difference between light passing over a scene and every mark carrying a
       little halo of its own. */
    const lAng = (light.angle * Math.PI) / 180;
    const lCos = Math.cos(lAng);
    const lSin = Math.sin(lAng);
    const lSpan = Math.abs(w * lCos) + Math.abs(h * lSin);
    const lWidth = Math.max(8, light.width);
    const lPeriod = lSpan + lWidth * 2;
    const nBeams = Math.max(1, Math.round(light.beams));
    const lGain = light.gain / 100;
    const beams: number[] = [];
    for (let b = 0; b < nBeams; b++) {
      beams.push(
        ((t * light.speed + (b * lPeriod) / nBeams) % lPeriod) - lWidth,
      );
    }

    /* The pick is settled before a single mark is drawn.

       Choosing it inside the draw loop looked equivalent and was not: a mark
       drawn early is tested against a pick that later marks can still win, so
       every candidate that was briefly the closest drew its own box. The
       result was a trail of outlines rather than one. */
    let over: { ep: number; i: number } | null = null;
    if (p.inside) {
      /* A payment only responds when the pointer is actually over its strip.
         The old nearest-mark radius made empty space around a mark clickable,
         which was especially noticeable in the full-screen arrangement. */
      let bestD = 1e9;
      for (const row of rows) {
        if (!row) continue;
        /* With a row held, only its own marks are candidates and only the
           horizontal distance counts, so running along it steps cleanly from
           one bar to the next instead of jumping to a neighbouring row. */
        if (held >= 0 && row.lane !== held) continue;
        const L = lanes[row.lane];
        /* you cannot point at the back of the drum */
        if (L.dim <= 0.004) continue;
        const ry = L.y;
        for (let i = 0; i < row.ticks.length; i++) {
          const k = row.ticks[i];
          if (k.gl >= 0) continue;
          const x = k.x;
          if (x < L.x0 - 60 || x > L.x1 + 60) continue;
          /* the same cull the draw uses — a mark too faint to appear is not
             something you can point at */
          const dIn = rev ? x - L.x0 : L.x1 - x;
          const dOut = rev ? L.x1 - x : x - L.x0;
          const env = Math.min(1, dIn / 40) * Math.min(1, (dOut + 40) / 90);
          if (Math.min(1, (0.18 + k.mag) * env) < 0.012) continue;
          const bY = ry + bendAt(row.lane, x) + L.h / 2;
          const smear = Math.min(3, 1 + (row.rate * SMEAR) / 2000);
          const stripHalfW = Math.max(4, (k.size + (smear - 1) * 1.4) / 2 + 3);
          const stripHalfH = Math.max(6, L.h / 2 + 2);
          const dx = Math.abs(x - p.x);
          const dy = Math.abs(bY - p.y);
          if (dx > stripHalfW || dy > stripHalfH) continue;
          const d2 = dx * dx + dy * dy;
          if (d2 < bestD) {
            bestD = d2;
            over = { ep: row.ep, i };
          }
        }
      }
    }

    /* Characters roll at three different rates across the string. Turning the
       whole hash over on one step reads as a flicker; letting some digits sit
       while others move is what makes it look like something being computed. */
    const drawHash = (
      k: Tick,
      cx: number,
      rowY: number,
      lane: number,
      fade = 1,
    ) => {
      const glyphPx = glyphOf(lanes[lane].h);
      const glyphCell = glyphPx * 1.25;
      const laneH = lanes[lane].h;
      /* settled once per hash rather than per character */
      const L = lanes[lane];
      const flatRow = fast && L.amt + L.li * L.fan === 0;
      /* It never settles for good. The word forms, holds long enough to be
         read, falls back into noise and forms again — so a hash crossing the
         frame writes itself out three or four times on the way rather than
         resolving once and going still for the rest of its life. Each one
         runs off its own birth time, so no two rows are ever in step. */
      const cyc = gaps.scramble + gaps.form + gaps.rest;
      /* Measured from the far end of the scramble, so a single comparison
         covers all three phases: negative through the noise, climbing through
         the forming, and past every character for the rest. */
      const lock = ((t - k.at) % cyc) - gaps.scramble;
      /* Left to right, one character at a time. Resolving them all at once is
         a cut, not a settle — the stagger is what makes it look like the row
         is working the answer out rather than being handed it. */
      const per = gaps.form / WORD.length;
      const half = ((WORD.length - 1) * glyphCell) / 2;
      ctx.globalAlpha = Math.min(1, 0.3 + ctx.globalAlpha) * fade;
      for (let g = 0; g < WORD.length; g++) {
        const ch =
          lock > (g + 1) * per
            ? WORD[g]
            : CHARS[mix(k.gl, g, churnStep * (1 + (g % 3))) % CHARS.length];
        const sp = sprite(ch, glyphPx, dpr);
        if (!sp) break;
        const gw = sp.width / dpr;
        const gh = sp.height / dpr;
        /* Each character reads the bend at its own x and stands up on the
           local slope. Placing the string by the bend at its centre is what
           left it lying flat across a curve the row was clearly following —
           a six-character hash is wide enough that the far end is somewhere
           else entirely, and near the left of the frame that is most of a
           row's height. */
        const gx = cx - half + g * glyphCell;
        /* A straight row asks for none of this. The save/translate/rotate/
           restore is there so a character can stand up on the local slope of
           a bent row — but where the row is flat the slope is zero and the
           bend is zero, so the whole stack is pushed and popped to draw the
           sprite exactly where a plain blit would put it. Six of them per
           word, and at this hush rate there are a great many words. */
        if (flatRow) {
          ctx.drawImage(sp, gx - gw / 2, rowY + laneH / 2 - gh / 2, gw, gh);
          continue;
        }
        ctx.save();
        ctx.translate(gx, rowY + bendAt(lane, gx) + laneH / 2);
        ctx.rotate(Math.atan(slopeAt(lane, gx)));
        ctx.drawImage(sp, -gw / 2, -gh / 2, gw, gh);
        ctx.restore();
      }
    };

    /* Resolved here rather than after the loop: the card is drawn on the
       visible surface once the bloom has run, and by then the loop's `x` and
       `bend` are gone. Catching the pinned mark's place as it goes past is
       cheaper than working it out a second time. */
    if (p.clicked) {
      const k = over ? rows[over.ep]?.ticks[over.i] : null;
      pinned = k && over ? { ep: over.ep, id: k.id } : null;
      pinOpen = t;
      pinShut = -1;
      pinLaneY = NaN;
    }
    let pinAt: { x: number; y: number } | null = null;
    let pinTick: Tick | null = null;
    let pinRow: Row | null = null;
    /* Collected as the marks go past and drawn after the bloom, so a card is
       never refracted by the glass or smeared by the glow. */
    /* ── the cards that ride the marks ───────────────────────────────
       Settled in a pass of their own, before anything is drawn, because
       whether one may open depends on where all the others already are — and
       inside the draw loop a mark is only ever compared with the cards found
       before it in row order. Three of them landed in a diagonal stack that
       way: each was clear of the others on its own row, which was the only
       rule there was, and rows are 48 pixels apart while a card is 88 tall. */
    const cardS = Math.max(S, 0.72) * (cards.size / 100);
    const open: {
      x: number;
      y: number;
      px: number;
      py: number;
      k: Tick;
      row: Row;
      w: number;
    }[] = [];
    if (!card && cards.max > 0) {
      /* What a card actually covers — as the renderer will actually place it,
         clamps included. The boxes used to be taken from the mark, but near an
         edge the drawn panel slides to stay visible while its box did not: two
         cards clear of each other on paper were clamped onto the same ground.
         The panel shrinks with the rest but not all the way — past about three
         quarters the type stops being type. */
      const PW = 208 * cardS,
        CH = 88 * cardS,
        ROOM = 56 * cardS,
        M = 14 * cardS;
      const panelX = (ax: number) =>
        Math.min(
          w - cards.edge - PW - M,
          Math.max(cards.edge + M, ax + 56 * cardS),
        );
      const panelY = (ay: number) =>
        Math.min(h - CH - M, Math.max(M, ay - CH / 2));
      const boxes: { x0: number; y0: number; x1: number; y1: number }[] = [];
      const clear = (ax: number, ay: number) => {
        const x0 = panelX(ax) - ROOM,
          x1 = x0 + PW + ROOM * 2;
        const y0 = panelY(ay) - ROOM,
          y1 = y0 + CH + ROOM * 2;
        for (const b of boxes) {
          if (x0 < b.x1 && x1 > b.x0 && y0 < b.y1 && y1 > b.y0) return false;
        }
        return true;
      };
      const place = (ax: number, ay: number) => {
        const x0 = panelX(ax) - ROOM;
        const y0 = panelY(ay) - ROOM;
        boxes.push({ x0, x1: x0 + PW + ROOM * 2, y0, y1: y0 + CH + ROOM * 2 });
      };

      /* the pinned card holds its ground first — it is the one the user asked
         for, so the unprompted ones are the ones that make way */
      if (pinned) {
        const pr = rows[pinned.ep];
        const pk = pr?.ticks.find((k) => k.id === pinned!.id);
        if (pr && pk)
          place(
            pk.x,
            lanes[pr.lane].y + bendAt(pr.lane, pk.x) + lanes[pr.lane].h / 2,
          );
      }

      /* Counted separately from what gets drawn. A card spends its first
         fifty milliseconds at zero width, and while it was only counted once
         it had something to show it was invisible to both the cap and the
         collision test — so every candidate in view opened during that window,
         on top of each other. That is where the extra three came from, and
         the diagonal stack before it. A card owns its slot and its ground from
         the instant it opens, whether or not there is yet anything to see. */
      let held = 0;
      /* the ones already open first, so they hold their ground and a newcomer
         is the one that has to find room */
      for (let pass = 0; pass < 2; pass++) {
        for (const row of rows) {
          if (!row) continue;
          const L = lanes[row.lane];
          const ry = L.y;
          for (const k of row.ticks) {
            if (k.cd < 0) continue;
            if (pass === 0 ? k.cd === 0 : k.cd !== 0) continue;
            const y = ry + bendAt(row.lane, k.x) + L.h / 2;
            /* opens well inside its own span, starts closing as it nears the
               far edge — the same test either way round, so flipping the
               direction does not need a second one */
            const sw = L.x1 - L.x0;
            const inView = k.x > L.x0 + sw * 0.14 && k.x < L.x1 - sw * 0.14;
            if (pass === 1) {
              /* Never a cluster's outer lanes. A card is 88 tall against a
                 row of 56, so it hangs well past its own band — on the first
                 row it rides up into the headline, and on the last it is cut
                 in half by whatever the stack runs into at the foot. A one-
                 or two-row cluster therefore never volunteers a card at all;
                 the main stack is where they belong. */
              if (L.li === 0 || L.li === L.n - 1) continue;
              if (!inView || held >= cards.max || !clear(k.x, y)) continue;
              k.cd = 1;
              k.cdIn = t;
              k.cdX = k.x;
              k.cdY = L.y;
            } else if (
              k.cd === 1 &&
              (!inView || (cards.hold > 0 && t - k.cdIn > cards.hold))
            ) {
              /* Closed on its own clock as well as at the edge. Waiting for the
                 mark to leave ties how long a card is up to how fast the
                 traffic runs — slow the stream down and the same card sits
                 there for ten seconds. A duration keeps a card a card. */
              k.cd = 2;
              k.cdOut = t;
            }
            const shut = k.cd === 2 ? easeOut(clamp01((t - k.cdOut) / 0.3)) : 0;
            if (shut >= 1) {
              k.cd = -1;
              continue;
            }
            held++;
            /* The panel takes only a share of the ground its mark covers, so
               it drifts rather than races — at drift 0 it stays exactly where
               it opened and the payment runs out from under it on a lengthening
               leader. The reserved ground is the panel's, not the mark's.

               Horizontally only. Lagging in y as well left the card floating
               off its own row — on a bent row the row centre moves as the mark
               travels, so a card holding an older y sat visibly high or low
               against it, which reads as badly centred rather than as drift.
               The slowing down is about travel; there is nothing to slow down
               across the row's thickness. */
            const d = cards.drift / 100;
            const px = k.cdX + (k.x - k.cdX) * d;
            /* The lane's own y is held at whatever it was when the card
               opened; the bend is still read live.

               Those are two different reasons for a row to be somewhere. The
               bend moves because the *mark* is travelling, and a panel that
               ignored it would sit visibly off the row it is labelling. The
               lane moves because the drum is turning, which has nothing to do
               with this payment — and following it walked every open card up
               the screen while it was being read. Freeze the one, follow the
               other, and the card stays on its row without riding the
               barrel. */
            const py = k.cdY + bendAt(row.lane, k.x) + L.h / 2;
            place(px, py);
            const amt = springAt(t - k.cdIn - 0.05) * (1 - shut);
            if (amt > 0.001) open.push({ x: k.x, y, px, py, k, row, w: amt });
          }
        }
      }
    }

    /* Every mark was setting the composite mode to `lighter` and back to
       `source-over` around its own fill — two state changes each, and a state
       change is one of the most expensive things a 2D context does. It was
       written that way because the hash and the selection outline sit in the
       same loop and needed the mode put back; but they can just as well run
       under `lighter` — white added to a dark ground is white — so the mode
       can be set once for the whole pass and restored once at the end of it.
       Restoring is not optional: leaving `lighter` set means next frame's
       background fill adds to this one instead of clearing it, and the
       picture washes out in the colour of the ground. */
    if (fast) ctx.globalCompositeOperation = "lighter";
    /* the fill colour only actually changes when the colour changes, and
       neighbouring marks on a row are usually the same one */
    let lastHex = "";

    for (const row of rows) {
      if (!row) continue;
      const L = lanes[row.lane];
      if (L.dim <= 0.004) continue;
      const y = L.y;
      const laneH = L.h;
      const smear = Math.min(3, 1 + (row.rate * SMEAR) / 2000);
      /* one square root for the row rather than one per mark on it */
      const invSmear = 1 / Math.sqrt(smear);

      for (let i = 0; i < row.ticks.length; i++) {
        const k = row.ticks[i];
        const x = k.x;
        if (x < L.x0 - 60 || x > L.x1 + 60) continue;

        /* fades in as it enters and out as it leaves, in pixels rather than
           in fractions of a window, so the fades do not change with speed —
           and measured from whichever edge of its own span is which, so the
           flip does not leave them back to front */
        const dIn = rev ? x - L.x0 : L.x1 - x;
        const dOut = rev ? L.x1 - x : x - L.x0;
        const env = Math.min(1, dIn / 40) * Math.min(1, (dOut + 40) / 90);
        const amt = Math.min(1, (0.18 + k.mag) * env);
        if (amt < 0.012) continue;

        const tw = Math.max(1, k.size + (smear - 1) * 1.4);
        /* `blend` is how much of the continuous scale is used: below the
           midpoint a mark takes its kind's flat colour, above it the
           interpolated one. */
        const flat = hexOf(paint, k.kind);
        const hex =
          colour.blend > 50
            ? (ramp[Math.round(k.hue * (RAMP_N - 1))] ?? flat)
            : flat;
        const bend = bendAt(row.lane, x);

        /* its own slow breath, out of step with its neighbours */
        const osc = 0.5 + 0.5 * Math.sin(t * bloom.rate * k.br + k.ph);
        const mod = 1 - pulse + pulse * osc * 2;

        /* and the lift from wherever the beams have reached */
        let lift = 1;
        if (lGain > 0) {
          const proj = x * lCos + (y + bend + laneH / 2) * lSin;
          for (let bi = 0; bi < nBeams; bi++) {
            const d = (proj - beams[bi]) / lWidth;
            /* past two and a half widths the lift is under a millionth of the
               gain — the exp is bought and thrown away */
            if (d > -2.5 && d < 2.5) lift += lGain * Math.exp(-d * d * 4);
          }
        }

        if (!fast) ctx.globalCompositeOperation = "lighter";
        const emergingGlow =
          emergingLane === row.lane ? 1 + emergingPulse * 0.65 : 1;
        ctx.globalAlpha = Math.min(
          1,
          amt * mod * lift * L.dim * invSmear * emergingGlow,
        );
        if (!fast || hex !== lastHex) {
          ctx.fillStyle = hex;
          lastHex = hex;
        }

        const sel = over && over.ep === row.ep && over.i === i;
        if (pinned && pinned.ep === row.ep && pinned.id === k.id) {
          pinAt = { x, y: y + bend + laneH / 2 };
          if (Number.isNaN(pinLaneY)) pinLaneY = L.y;
          pinTick = k;
          pinRow = row;
        }
        if (k.gl >= 0) {
          /* The word only stands while it has the room it was promised. It is
             born in the middle of a hush, but the marks drift at their own
             speeds and the hush closes back over it — and a word with traffic
             running through it is not a word, it is damage. Measured every
             frame against its own row: the nearest bar sets a fade, so the
             text dims out as the room closes rather than popping off, and a
             younger word standing too near an older one yields entirely. */
          const glyphCell = glyphOf(laneH) * 1.25;
          const half = ((WORD.length - 1) * glyphCell) / 2 + glyphCell;
          let roomLeft = 1e9;
          let yielded = false;
          for (let oi = 0; oi < row.ticks.length; oi++) {
            const o = row.ticks[oi];
            if (o === k) continue;
            if (o.gl >= 0) {
              if (
                o.id < k.id &&
                Math.abs(o.x - x) < WORD.length * glyphCell * 3
              ) {
                yielded = true;
                break;
              }
            } else {
              const d = Math.abs(o.x - x) - half - o.size / 2;
              if (d < roomLeft) roomLeft = d;
            }
          }
          if (!yielded && roomLeft > 0) {
            drawHash(k, x, y, row.lane, Math.min(1, roomLeft / 32));
          }
          /* Restoring per mark, on the slow path only — the fast one puts the
             mode back once at the end of the pass instead. Alpha needs no
             restoring either way: every mark sets its own before it draws. */
          if (!fast) {
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
          }
          continue;
        }
        if (tilt) {
          ctx.save();
          ctx.translate(x, y + bend);
          ctx.rotate(Math.atan(slopeAt(row.lane, x)));
          ctx.fillRect(-tw / 2, 0, tw, laneH);
          if (sel) {
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1;
            ctx.strokeRect(-tw / 2 - 2.5, -2.5, tw + 5, laneH + 5);
          }
          ctx.restore();
        } else {
          ctx.fillRect(x - tw / 2, y + bend, tw, laneH);
          if (sel) {
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1;
            ctx.strokeRect(x - tw / 2 - 2.5, y + bend - 2.5, tw + 5, laneH + 5);
          }
        }
        if (!fast) {
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "source-over";
        }
      }
    }
    /* the one restore the fast path owes, paid once for the whole pass */
    if (fast) {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    /* the pinned mark has left the frame and been culled, so there is nothing
       left to describe */
    if (pinned && !pinTick) pinned = null;
    const hoverRow = over ? rows[over.ep] : null;
    const hoverTick = over && hoverRow ? hoverRow.ticks[over.i] : null;
    const shownTick = hoverTick ?? pinTick;
    const shownRow = hoverTick ? hoverRow : pinRow;

    if (!card && paint.readouts) {
      /* ── readouts ───────────────────────────────────────────────────── */
      ctx.font = `8px ${MONO}`;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";

      const counts = [0, 0, 0, 0, 0];
      let total = 0;
      let live = 0;
      for (const row of rows)
        if (row) {
          live++;
          for (const k of row.ticks) {
            counts[k.kind]++;
            total++;
          }
        }
      let ky = 20;
      for (let i = 0; i < KINDS.length; i++) {
        ctx.fillStyle = hexOf(paint, i);
        ctx.fillRect(18, ky - 4, 4, 4);
        ctx.fillStyle = "rgba(210,220,245,0.55)";
        ctx.fillText(KINDS[i], 28, ky);
        ctx.fillStyle = "rgba(210,220,245,0.3)";
        ctx.fillText(String(counts[i]), 86, ky);
        ky += 12;
      }

      ctx.fillStyle = "rgba(210,220,245,0.3)";
      ctx.textAlign = "right";
      ctx.fillText(
        `${live} ENDPOINTS LIVE · ${total.toLocaleString()} EVENTS`,
        w - 18,
        h - 21,
      );
      ctx.fillText(`${WIN.toFixed(1)} SEC WINDOW`, w - 18, h - 8);

      if (shownTick && shownRow) {
        {
          const row = shownRow;
          const k = shownTick;
          const isPinned = !hoverTick && pinned;
          ctx.textAlign = "left";
          ctx.fillStyle = hexOf(paint, k.kind);
          ctx.fillText(KINDS[k.kind], 18, h - 34);
          ctx.fillStyle = "rgba(230,235,255,0.9)";
          ctx.fillText(`${AGENTS[k.agent]} → ${eps[row.ep].name}`, 18, h - 21);
          ctx.fillStyle = "rgba(210,220,245,0.45)";
          ctx.fillText(
            `$${k.amt.toFixed(4)} · ${((t - k.at) * 1000) | 0}MS AGO${isPinned ? " · PINNED" : ""}`,
            18,
            h - 8,
          );
        }
      }
      ctx.textAlign = "left";
    }

    /* ── present: the base picture, with the bloom pass over it ─────── */
    out.setTransform(1, 0, 0, 1, 0, 0);
    if (baseCv) {
      const lit =
        pass && (bloom.amount > 0 || glassOn)
          ? pass.run(baseCv, W, H, {
              glass:
                glassOn && maskCv
                  ? {
                      mask: maskCv,
                      refract: glass.refract / 20000,
                      aberration: glass.aberration / 100,
                      edge: glass.edge / 200,
                      tint: glass.tint / 100,
                    }
                  : null,
              threshold: bloom.threshold / 100,
              knee: bloom.knee / 100,
              intensity: bloom.amount / 100,
              radius: bloom.radius,
              stretch: bloom.stretch,
              levels: bloom.levels,
            })
          : null;
      /* no bloom is a fine outcome; a blank panel is not */
      out.drawImage(lit ?? baseCv, 0, 0, W, H);
    } else {
      out.clearRect(0, 0, W, H);
    }

    /* The card, on top of the finished picture rather than into it. Drawn on
       the base it would be refracted by the glass and smeared by the bloom —
       which is right for a payment and wrong for the thing telling you what
       the payment was. Pinned only: hover moves too fast to read. */
    /* built once for both the travelling cards and the pinned one, so the two
       cannot drift apart. The blur is in device pixels like everything else
       handed to the card, so it holds its look across the ratio. */
    const skin = {
      bg: cards.bg,
      alpha: cards.bgAlpha / 100,
      blur: cards.blur * dpr,
      borderPx: cards.borderPx * dpr,
      borderA: cards.borderA / 100,
      borderBotA: cards.borderBotA / 100,
      /* not scaled by the ratio: these are the card's own units, multiplied
         by its scale inside the draw like every other measurement there */
      avatar: cards.avatar,
      pad: cards.pad,
      radius: cards.radius,
      /* the reveal is timed in seconds like the rest of this file, and the
         dials are in milliseconds because that is how the eye is asked about
         them */
      stagger: cards.stagger / 1000,
      fade: cards.fade / 1000,
      rise: cards.rise,
      riseFee: cards.riseFee,
      scramble: cards.scramble / 1000,
    };
    for (const o of open) {
      if (pinned && pinned.ep === o.row.ep && pinned.id === o.k.id) continue;
      drawAgentCard(
        out,
        dpr * cardS,
        W,
        H,
        o.x * dpr,
        o.y * dpr,
        {
          seed: `${o.row.ep}:${o.k.sd}`,
          agent: AGENTS[o.k.agent],
          amount: money(o.k.amt),
          fee: `$${o.k.fee.toFixed(4)}`,
        },
        o.w,
        o.px * dpr,
        o.py * dpr,
        cards.edge * dpr,
        { ...skin, age: t - o.k.cdIn },
      );
    }

    if (pinAt && pinTick && pinRow && !card) {
      /* It retracts before it can reach the edge rather than sliding along it.
         The panel is held inside the frame when it is drawn, so a mark running
         out of the right-hand side used to leave the card parked against the
         wall, still open, no longer pointing at anything nearby. This is the
         last place it can stand at its full width — past it, the same exit the
         travelling cards use. */
      /* The retract is about the MARK leaving the view, not about where the
         card would like to stand — the clamp already keeps the panel visible,
         so a pin near the edge simply opens with the panel slid inward. Three
         guards, each for a bug that shipped: never in freeze mode, where the
         tap is the whole interaction and the mark is not going anywhere; never
         in the pin's first quarter second, because the frame that makes the
         pin still reads last frame's freeze state and closed the card inside
         the gesture that opened it; and only within a hand's width of the
         visible edge, where the earlier full-standing-room test was retracting
         everything in the right sixth of a desktop and half of a phone. */
      if (
        !motion.pinFreeze &&
        pinShut < 0 &&
        t - pinOpen > 0.25 &&
        (pinAt.x > w - cards.edge - 90 || pinAt.x < cards.edge + 24)
      )
        pinShut = t;
      const shut = pinShut < 0 ? 0 : easeOut(clamp01((t - pinShut) / 0.3));
      if (shut >= 1) pinned = null;
      else {
        const k = pinTick;
        /* the panel stands on the lane the pin was made on; the anchor and its
           leader keep following the mark wherever the drum takes it */
        const panelY = Number.isNaN(pinLaneY)
          ? pinAt.y
          : pinLaneY + bendAt(pinRow.lane, pinAt.x) + lanes[pinRow.lane].h / 2;
        drawAgentCard(
          out,
          dpr * cardS,
          W,
          H,
          pinAt.x * dpr,
          pinAt.y * dpr,
          {
            seed: `${pinRow.ep}:${k.sd}`,
            agent: AGENTS[k.agent],
            amount: money(k.amt),
            fee: `$${k.fee.toFixed(4)}`,
          },
          springAt(t - pinOpen - 0.05) * (1 - shut),
          pinAt.x * dpr,
          panelY * dpr,
          cards.edge * dpr,
          { ...skin, age: t - pinOpen },
        );
      }
    }
    out.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
}

export const stream: Viz = {
  id: "stream",
  title: "The Stream",
  blurb:
    "One row per endpoint, one tick per event — rows are born, burn and retire.",
  tags: ["interactive", "tunable", "lifecycle"],
  poster: 11,
  controls: CONTROLS,
  create,
};
