"use client";

import {
  Fragment,
  type ReactNode,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type CSSProperties,
} from "react";
import VizCanvas from "@/app/gallery/VizCanvas";
import { stream } from "@/app/gallery/viz/stream";
import type { VizControls } from "@/app/gallery/viz/types";
import { SafeUnicornScene } from "@/components/shared/SafeUnicornScene";
import { Link } from "@solana-com/ui-chrome/link";
import Globe from "./Globe";
import s from "./payment-channels.module.css";

/* Assets exported from the Figma frame and served from /public/landing. Names
   are the frame's own; hashes are Figma's content addresses, kept so a
   re-export maps back cleanly. */
const A = (h: string) => `/landing/${h}`;

const ART = {
  /* 04 · where per-call payments break */
  chartGrid: A("4d93aa3c8840c4f89aaed45a3948c4c972008ce3.svg"),
  stepFill: A("932cb0660065a67cb67996906f2e2758b93bb18d.svg"),
  stepEdge: A("f617851cc0a488f13cc4c572c991f9161ae55faa.svg"),
  stepLine: A("18bdc610b284e2c09fc80153af965b89ade35c6b.svg"),
  stepDot: A("d4ae654faa99a90203383784d569dc6ee47eb0ca.svg"),
  /* 05 · how it works — one icon per step */
  iOpen: A("5efa6e17b7218bdc82d5ec40e86b643b4eeccfd1.svg"),
  iMeter: A("7b18dc10259067a29a27407d4e61f3149ca3ea84.svg"),
  iSettle: A("04534e208d92d2731848ecc7351f34fbc283975f.svg"),
  iRefund: A("fc83aa5325f68708fa57c2ac6fa33f8fbb018b5a.svg"),
  /* the gradient plates — the designer's own exports, used at native size */
  plateCta: A("cta-plate.png"),
  agentsArt: A("agents-art.png"),
  channelStatusDot: A("payment-channel-status-dot.svg"),
  channelDivider: A("payment-channel-divider.svg"),
  /* 06 · the two shapes blended over the session card */
  sessionBg: A("session-bg.png"),
  /* 10 · live at launch */
  logoAlibaba: A("3151a097741e4bd16439eb9024b650c4da57909a.svg"),
  logoPaySh: A("a430ee0582fc2f8b41b9457e139706a50308bdfa.svg"),
  /* 08 · get started — tile icons, as re-drawn in the CTA frame */
  tCode: A("79c0756e25176b355de82f1afa4a17140acdfbb8.svg"),
  tSlider: A("e85c0b0be0d5374dce6fcca8483f2dfb99fea909.svg"),
  tSliderA: A("3a3292ec86bde19f3f9c8b3d78c4868eb68eb97a.svg"),
  tSliderB: A("8df75810fb8651d4a097f3d0be169b1ce74342dc.svg"),
  tSliderC: A("ad4ab043d1931be393b7da77eec3385b766d3a62.svg"),
  tWindow: A("a826672b8feb97f162fd8da382886e22ac8908aa.svg"),
  tWindowA: A("32f61ea63411b879a930b885c093ef370a200eea.svg"),
  tWindowB: A("334af01e7b4e3b5d88befb7554a9dcf9a8804ca6.svg"),
  tFile: A("08e7bf6f7bdb69ee01b579f5a6ebc685f3b4bc4c.svg"),
  tChecklist: A("1a87cc5d962c927ced20e269cec181a8d4a30427.svg"),
} as const;

const PAYMENT_CHANNELS_DOCS_URL =
  "https://pay.sh/docs/building-with-pay/payment-channels/concept";
const PAYMENT_CHANNELS_PROGRAM_URL =
  "https://github.com/solana-foundation/payment-channels";
const PAY_SH_URL = "https://pay.sh";
const BENCHMARK_URL =
  "https://solana.com/developers/templates/pay-high-throughput-proxy";

type PageLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function PageLink({ href, target, ...props }: PageLinkProps) {
  const isExternal = /^(https?:)?\/\//i.test(href);

  return (
    <Link
      href={href}
      target={isExternal ? (target ?? "_self") : target}
      {...props}
    />
  );
}

function ActionLink({
  className,
  variant = "primary",
  ...props
}: PageLinkProps & { variant?: "primary" | "ghost" }) {
  return (
    <PageLink
      {...props}
      className={[variant === "ghost" ? s.btnGhost : s.btn, className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function ArtImage({
  className,
  src,
  style,
}: {
  className?: string;
  src: string;
  style?: CSSProperties;
}) {
  return (
    <img
      className={className}
      src={src}
      alt=""
      aria-hidden="true"
      style={style}
    />
  );
}

/* ── the latest stream hero ──
   This is the current visual treatment from Saugat's landing: a measured
   stream of endpoint rows, tuned per viewport and hosted by a small canvas
   lifecycle component. The page keeps the production copy and shell below. */
type HeroShot = {
  from: number;
  count: number;
  height: number;
  gap: number;
  y: number;
  amount: number;
  fan: number;
  power: number;
  shift?: number;
  rows?: number;
  touch?: boolean;
};

const SHOTS: HeroShot[] = [
  {
    from: 1900,
    count: 48,
    height: 50,
    gap: 7,
    y: -600,
    amount: -1260,
    fan: -200,
    power: 2.3,
    shift: 10,
    rows: 300,
  },
  {
    from: 1600,
    count: 4,
    height: 52,
    gap: 7,
    y: 322,
    amount: -270,
    fan: 78,
    power: 20,
  },
  {
    from: 1440,
    count: 4,
    height: 50,
    gap: 7,
    y: 632,
    amount: -60,
    fan: 27,
    power: 20,
  },
  {
    from: 1024,
    count: 4,
    height: 44,
    gap: 7,
    y: 640,
    amount: -60,
    fan: 27,
    power: 20,
  },
  {
    from: 768,
    count: 4,
    height: 71,
    gap: 6,
    y: 640,
    amount: -60,
    fan: 27,
    power: 20,
    touch: true,
  },
  {
    from: 480,
    count: 4,
    height: 53,
    gap: 5,
    y: 452,
    amount: -60,
    fan: 27,
    power: 20,
    touch: true,
  },
  {
    from: 0,
    count: 4,
    height: 40,
    gap: 5,
    y: 252,
    amount: -190,
    fan: 27,
    power: 20,
    touch: true,
  },
];

const HERO_CONTROLS = {
  size: { min: 0.5, max: 6, variance: 45, solids: 7, solidGap: 365 },
  trail: { often: 39, length: 1.75, density: 7 },
  colour: { mix: 40, gradient: 186, cycle: 3.33, blend: 36 },
  gaps: {
    often: 165,
    length: 0.65,
    text: 65,
    scramble: 0.9,
    form: 5,
    rest: 1.4,
    churn: 4,
  },
  row: {
    count: 4,
    height: 50,
    gap: 7,
    anchor: "join",
    y: 632,
    bg: "edge",
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
  /* Saugat's full-screen landing composition: the 47-stave cylinder is what
     gives the hero its slow vertical sweep. The band preset is the compact
     bottom strip used by the alternate route. */
  layout: {
    arrange: "cylinder",
    bend: 0,
    spin: -1.5,
    staves: 47,
    shift: 0,
    rows: 100,
    radius: 50,
    band: 31,
    falloff: 115,
    flow: 135,
    fast: true,
    entry: 190,
  },
  /* The full-screen field should feel measured, not like a loading ticker. */
  motion: {
    speed: 241.5,
    density: 24.5,
    drift: 15,
    variation: 100,
    reverse: true,
    hoverHold: true,
    hoverRadius: 20,
    pinFreeze: false,
  },
  curve: { amount: -60, fan: 27, power: 20, tilt: false },
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
    amount: 63,
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
    readouts: false,
  },
};

function useHeroStream(throughputEpoch: number, throughputPhase: number) {
  const [shotIndex, setShotIndex] = useState(0);
  const [bleed, setBleed] = useState(160);
  useEffect(() => {
    const pick = () => {
      const w = window.innerWidth;
      const index = Math.max(
        0,
        SHOTS.findIndex(
          (shot, i) => w >= shot.from && (i === 0 || w < SHOTS[i - 1].from),
        ),
      );
      setShotIndex(index);
      setBleed(Math.min(160, Math.max(56, 0.09 * w)));
    };
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, []);

  const shot = SHOTS[shotIndex] ?? SHOTS[SHOTS.length - 1];
  const controls = {
    ...HERO_CONTROLS,
    row: {
      ...HERO_CONTROLS.row,
      count: shot.count,
      height: shot.height,
      gap: shot.gap,
      y: shot.y,
    },
    curve: {
      ...HERO_CONTROLS.curve,
      amount: shot.amount,
      fan: shot.fan,
      power: shot.power,
    },
    layout: {
      ...HERO_CONTROLS.layout,
      shift: shot.shift ?? 0,
      rows: shot.rows ?? 100,
    },
    /* Cards are an explicit interaction: no transaction detail should appear
       until a visitor targets a specific strip and clicks it. */
    cards: { ...HERO_CONTROLS.cards, max: 0, edge: bleed },
    motion: shot.touch
      ? { ...HERO_CONTROLS.motion, hoverHold: false, pinFreeze: true }
      : HERO_CONTROLS.motion,
    /* The card and the stream share one clock. The renderer maps this phase
       to its own row-slide timing, so the visual treatments stay independent
       while their one-second reset is the same event. */
    __throughputEpoch: throughputEpoch,
    __throughputPhase: throughputPhase,
  } as unknown as VizControls;

  const heroVars = {
    "--hero-vh": 100,
    "--hero-max": "1060px",
    "--bleed": `${bleed}px`,
  } as CSSProperties;
  return { controls, heroVars };
}

function easeThroughputProgress(progress: number) {
  return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
}

function useThroughputCounter() {
  const [value, setValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const [clock, setClock] = useState({ epoch: 0, phase: 0 });

  useEffect(() => {
    const windowMs = 1000;
    /* Keep the number and line on the same one-second clock, but let each
       treatment reach its endpoint at a slightly different point in the
       window. Both hold there, then reset together. */
    const numberEnd = 0.9;
    const progressEnd = 0.86;
    let frame = 0;
    let lastPaint = 0;
    let startedAt: number | null = null;

    const tick = (now: number) => {
      if (startedAt === null) startedAt = now;
      const elapsed = now - startedAt;
      const epoch = Math.floor(elapsed / windowMs);
      const phase = (elapsed % windowMs) / windowMs;
      const progressPhase = Math.min(phase / progressEnd, 1);
      const numberProgress = Math.min(phase / numberEnd, 1);

      // Give the endpoints more screen time: the number eases through the
      // middle of the range, then holds the exact target before resetting.
      const numberValue = easeThroughputProgress(numberProgress);
      const lineProgress = easeThroughputProgress(progressPhase);

      // The readout is illustrative UI. Updating at 30fps keeps the number
      // readable without adding another full-speed animation loop.
      if (now - lastPaint >= 33) {
        setClock({ epoch, phase });
        setProgress(lineProgress);
        setValue(Math.round(numberValue * 1_000_000));
        lastPaint = now;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return { value, progress, ...clock };
}

function ThroughputCard({
  value,
  progress,
}: {
  value: number;
  progress: number;
}) {
  return (
    <div
      className={s.throughput}
      aria-label={`${value.toLocaleString("en-US")} payments in the current one second window`}
    >
      <div className={s.throughputMeta}>
        <span className={s.throughputPulse} aria-hidden="true" />
        Live throughput / 1 second window
      </div>
      <div className={s.throughputValue} aria-hidden="true">
        <span className={s.throughputNumber}>
          {value.toLocaleString("en-US")}
        </span>
        <span className={s.throughputUnit}>payments / sec</span>
      </div>
      <div className={s.throughputTrack} aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
}

function Stream({ controls }: { controls: VizControls }) {
  return (
    <VizCanvas
      viz={stream}
      quality="full"
      running
      controls={controls}
      maxDpr={2}
      className={s.canvas}
    />
  );
}

type Layer = { outer: string; inner: string; src: string };

/* Figma builds each 40px icon from one or more vectors, every one positioned by
   an outer inset inside the box and an inner inset that lets the stroke spill.
   Rendering the svg straight at 40px stretches and distorts it. */
function Glyph({ layers }: { layers: Layer[] }) {
  return (
    <span className={s.icon} aria-hidden="true">
      {layers.map((l, i) => (
        <span key={i} className={s.iconLayer} style={{ inset: l.outer }}>
          <span className={s.iconInner} style={{ inset: l.inner }}>
            <ArtImage src={l.src} />
          </span>
        </span>
      ))}
    </span>
  );
}

const SHADER_PROJECT = "QTGtHSQRXx8jQPnaWrL0";

/* ── the streak plate ──
   The frame's decorative "video" element: 26 white bars stepped along a
   diagonal, laid twice and blended. Coordinates are the frame's. */
const STREAK: [number, number, number][] = [
  [246, 0, 1145],
  [234, 11, 1177],
  [221, 22, 1190],
  [213, 33, 1198],
  [203, 44, 1188],
  [191, 55, 1194],
  [180, 66, 1193],
  [169, 77, 1191],
  [158, 88, 1196],
  [147, 99, 1194],
  [136, 110, 1193],
  [126, 121, 1196],
  [114, 132, 1197],
  [102, 143, 1194],
  [91, 154, 1194],
  [81, 165, 1197],
  [71, 176, 1193],
  [59, 187, 1194],
  [48, 198, 1198],
  [37, 209, 1196],
  [26, 220, 1195],
  [15, 231, 1194],
  [1, 242, 1195],
  [1, 253, 1189],
  [1, 264, 1175],
  [15, 275, 1149],
];

function StreakLayer({ second = false }: { second?: boolean }) {
  return (
    <div className={`${s.streakLayer} ${second ? s.streakLayer2 : ""}`}>
      {STREAK.map(([l, t, w], i) => (
        <span
          key={i}
          className={s.streakBar}
          style={{ left: l, top: t, width: w }}
        />
      ))}
    </div>
  );
}

function Streak({ style }: { style: CSSProperties }) {
  return (
    <div className={s.streak} style={style} aria-hidden="true">
      <StreakLayer />
      <StreakLayer second />
    </div>
  );
}

const STREAK_POSITIONS: CSSProperties[] = [
  { left: -383, top: 961 },
  { left: 2161, top: 763 },
];

function StreakPair() {
  return (
    <>
      {STREAK_POSITIONS.map((style) => (
        <Streak key={`${style.left}-${style.top}`} style={style} />
      ))}
    </>
  );
}

/* ── content, verbatim from the copy deck ── */

const STATS: [string, string][] = [
  ["100K", "Unique wallets"],
  ["1M+", "Payments issued every second"],
  ["80B+", "Payments in 24 hours"],
  ["$0.0078", "Per 1M payments"],
];

const BREAKS: [string, string][] = [
  [
    "Single calls with unknown costs",
    "Certain requests have variable costs. For example an LLM completion billed per token, or a job billed per byte or per second of compute.",
  ],
  [
    "Many small deliveries",
    "A token-by-token streaming response, or a burst of hundreds of cheap calls in a short time period.",
  ],
];

const CHANNEL_STEPS = [
  { label: "Agent", title: "Authorize once", body: "Set a spending limit" },
  { label: "Channel", title: "Pay as you go", body: "Many signed updates" },
  { label: "Solana", title: "Settle once", body: "Return unused funds" },
] as const;

/* the second chart, bar for bar */
const BAR_HEIGHTS = [211, 108, 50, 20, 183, 38, 86, 279, 31, 86];

const STEPS: { layers: Layer[]; title: string; body: string }[] = [
  {
    layers: [{ outer: "16.67% 12.5%", inner: "-3.75% -3.33%", src: ART.iOpen }],
    title: "Open",
    body: "Deposit a ceiling amount into onchain escrow. Funds stay non-custodial, held by the program, not the operator.",
  },
  {
    layers: [{ outer: "12.5%", inner: "-3.33%", src: ART.iMeter }],
    title: "Meter off-chain",
    body: "The agent authorizes spending with signed messages, not transactions. Every call is a signature and incurs no transaction costs.",
  },
  {
    layers: [{ outer: "16.67%", inner: "-3.75%", src: ART.iSettle }],
    title: "Batched settlement",
    body: "Actual amounts consumed are recorded onchain in one batched transaction.",
  },
  {
    layers: [
      {
        outer: "16.67% 12.5% 12.5% 12.5%",
        inner: "-3.53% -3.33% -4.99% -3.33%",
        src: ART.iRefund,
      },
    ],
    title: "Distribute",
    body: "Unused deposit returns to the sender, and committed amounts are distributed to all configured recipients.",
  },
];

const LIMITS: [string, string][] = [
  [
    "Human approvals",
    "A human ends up back in the loop, approving payments one at a time.",
  ],
  [
    "Settlement cost and latency",
    "Every payment carries settlement cost and latency. When millions of transactions need to be settled, costs add up fast.",
  ],
  [
    "Custodial workarounds",
    "Prepaid credits mean your balance is gone on the first call and tracked in someone else’s database.",
  ],
];

const SETTLEMENT_METRICS: [string, string][] = [
  ["~203 s", "100k-channel settlement cycle observed"],
  ["0.625 SOL", "Fee for the 100k-channel settlement cycle"],
  ["25,000", "Four-channel settlement transactions"],
];

const MODES: [string, string][] = [
  [
    "x402 UPTO",
    "Authorize a ceiling for a single metered call. Your handler runs, the operator settles the one actual amount, and refunds the difference.",
  ],
  ["x402 BATCH SETTLEMENT", "Many deliveries, settled together."],
  [
    "MPP SESSION",
    "Open a channel and stream many metered deliveries, each authorized by a running cumulative voucher, and settle once when the session idle-closes.",
  ],
];

/* 10 · live at launch — two partner columns beside the statement */
const PARTNERS: {
  label: string;
  logo: string;
  w: number;
  h: number;
  cta: string;
  href: string;
}[] = [
  {
    label: "Launch partner",
    logo: ART.logoAlibaba,
    w: 198,
    h: 25,
    cta: "View APIs",
    href: PAY_SH_URL,
  },
  {
    label: "Platform for pay-per-use APIs",
    logo: ART.logoPaySh,
    w: 108,
    h: 32,
    cta: "Explore pay.sh",
    href: PAY_SH_URL,
  },
];

const TILES: { name: string; href: string; layers: Layer[] }[] = [
  {
    name: "Program",
    href: PAYMENT_CHANNELS_PROGRAM_URL,
    layers: [{ outer: "16.67% 8.33%", inner: "-4.55% -4.24%", src: ART.tCode }],
  },
  {
    name: "Toolchain & Deployment",
    href: "https://github.com/solana-foundation/pay",
    layers: [
      { outer: "16.67% 16.67% 58.33% 58.33%", inner: "-10%", src: ART.tSlider },
      /* the second knob — Figma writes this one with fraction utilities */
      { outer: "58.33% 50% 16.67% 25%", inner: "-10%", src: ART.tSlider },
      {
        outer: "29.17% 43.75% 70.83% 16.67%",
        inner: "-1px -6.32%",
        src: ART.tSliderA,
      },
      {
        outer: "70.83% 77.08% 29.17% 16.67%",
        inner: "-1px -40%",
        src: ART.tSliderB,
      },
      {
        outer: "70.83% 16.67% 29.17% 52.08%",
        inner: "-1px -8%",
        src: ART.tSliderC,
      },
    ],
  },
  {
    name: "SDK + Playground",
    href: "https://github.com/solana-foundation/pay-kit",
    layers: [
      {
        outer: "20.83% 12.5% 16.67% 12.5%",
        inner: "-4% -3.33%",
        src: ART.tWindow,
      },
      {
        outer: "62.5% 10.42% 10.42% 62.5%",
        inner: "-13.95% -24.73% -24.73% -13.95%",
        src: ART.tWindowA,
      },
      {
        outer: "34.38% 40.63% 61.46% 26.04%",
        inner: "-45% -5.63%",
        src: ART.tWindowB,
      },
    ],
  },
  {
    name: "Concept + docs",
    href: PAYMENT_CHANNELS_DOCS_URL,
    layers: [{ outer: "12.5% 20.83%", inner: "-3.33% -4.29%", src: ART.tFile }],
  },
  {
    name: "Spec",
    href: "https://paymentauth.org/draft-solana-session-00.html",
    layers: [{ outer: "16.67%", inner: "-3.75%", src: ART.tChecklist }],
  },
];

function ChannelStep({ label, title, body }: (typeof CHANNEL_STEPS)[number]) {
  return (
    <div className={s.channelStep}>
      <div className={s.channelLabelArea}>
        <span className={s.channelNodeTag}>{label}</span>
      </div>
      <div className={s.channelStepCopy}>
        <strong>{title}</strong>
        <span>{body}</span>
      </div>
    </div>
  );
}

function ResourceTile({ tile }: { tile: (typeof TILES)[number] }) {
  return (
    <PageLink className={s.tile} href={tile.href} rel="noreferrer">
      <Glyph layers={tile.layers} />
      <p className={`${s.bodyXl} ${s.tileName}`}>{tile.name}</p>
    </PageLink>
  );
}

export default function Landing() {
  const throughput = useThroughputCounter();
  const hero = useHeroStream(throughput.epoch, throughput.phase);

  return (
    /* `scrolls` is the global unlock: the document is overflow-hidden for the
       fixed full-bleed routes, and this class is how a route that scrolls
       normally asks for the document back */
    <div className={`scrolls ${s.page}`}>
      {/* ── 01 · hero ── */}
      <section className={s.hero} style={hero.heroVars}>
        <Stream controls={hero.controls} />

        <div className={`${s.heroInner} ${s.heroScrimOn}`}>
          <div className={s.heroContent}>
            <div className={s.heroBlock}>
              <h1 className={`${s.hXl} ${s.heroTitle}`}>
                1 million payments
                <br />
                <span className={s.thin}>per second</span>
              </h1>
              <p className={`${s.bodyL} ${s.heroSub}`}>
                AI will not wait at a checkout screen. The future of internet
                payments needs to be built for permissionless, unprecedented
                scale.
              </p>
              <ActionLink href={PAYMENT_CHANNELS_DOCS_URL}>
                Read the docs
              </ActionLink>
              <ThroughputCard
                value={throughput.value}
                progress={throughput.progress}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · stats ── */}
      <section className={`${s.band} ${s.stats}`}>
        <div className={s.statsInner}>
          <div className={s.statsRow}>
            {STATS.map(([value, label]) => (
              <div key={label} className={s.stat}>
                <p className={s.statValue}>{value}</p>
                <p className={`${s.bodyM} ${s.med} ${s.statLabel}`}>{label}</p>
              </div>
            ))}
          </div>
          <div className={s.statsFooter}>
            <span className={`${s.bodyS} ${s.mid}`}>
              Sustained 24h benchmark
            </span>
          </div>
          <div className={s.statsFade} aria-hidden="true" />
        </div>
      </section>

      {/* ── 03 · give your agents a spending limit ── */}
      <section className={s.band}>
        <div className={s.inner}>
          <div className={s.agentsRow}>
            <div className={s.agentsCol}>
              <div className={s.agentsHead}>
                <h2 className={s.hL}>
                  Payment channels
                  <br />
                  let agents
                  <br />
                  <span className={s.thin}>pay as they go.</span>
                </h2>
                <p className={`${s.bodyL} ${s.mid} ${s.agentsKicker}`}>
                  Payment Channels are a new Solana primitive built to solve
                  this across x402 and MPP payment protocols.
                </p>
              </div>
              <hr className={s.rule} />
              <p className={`${s.bodyXl} ${s.agentsPull}`}>
                A payment channel lets an agent authorize a spending limit once,
                spend against the limit, and settle the payment amount once. Put
                money down up front, run up usage without paying per
                transaction, and settle the bill once when you leave.
              </p>
            </div>

            <div className={s.agentsArt}>
              {/* the Figma frame keeps the image and black fade inside one clipped card */}
              <div className={s.channelVisual}>
                <ArtImage className={s.agentsPlate} src={ART.agentsArt} />
                <div className={s.channelVisualFade} aria-hidden="true" />
                <div className={s.channelVisualHead}>
                  <ArtImage
                    className={s.channelLiveDot}
                    src={ART.channelStatusDot}
                  />
                  Active Payment Channel
                </div>
                <div className={s.channelFlow}>
                  {CHANNEL_STEPS.map((step, i) => (
                    <Fragment key={step.label}>
                      <ChannelStep {...step} />
                      {i < CHANNEL_STEPS.length - 1 && (
                        <ArtImage
                          className={s.channelDivider}
                          src={ART.channelDivider}
                        />
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 · where per-call payments break ── */}
      <section className={s.band}>
        <div className={s.inner}>
          <div className={s.breakRow}>
            <div className={s.breakLeft}>
              <div className={s.breakHead}>
                <div className={s.breakHeadTop}>
                  <h2 className={s.hL}>
                    Where per-call
                    <br />
                    payments break
                  </h2>
                  <p className={`${s.bodyL} ${s.mid}`}>
                    While pay-per-request models simplify paid tool use,
                    allowing access to many APIs and endpoints without an API
                    key or account creation, certain kinds of agentic spending
                    patterns are a bad fit for settling every request onchain:
                  </p>
                </div>
                <hr className={s.rule} />
              </div>
              <p className={s.bodyL}>
                Payment Channels amortize the onchain work down to one open and
                one settle, no matter how much metering happens in between.
              </p>
            </div>

            <div className={s.breakCharts}>
              {/* the step chart — cost climbing per call */}
              <div className={s.breakCol}>
                <div className={s.chartFrame} aria-hidden="true">
                  <ArtImage className={s.chartGrid} src={ART.chartGrid} />
                  <ArtImage className={s.stepFill} src={ART.stepFill} />
                  <ArtImage className={s.stepLine} src={ART.stepLine} />
                  <ArtImage className={s.stepEdge} src={ART.stepEdge} />
                  <ArtImage className={s.stepDot} src={ART.stepDot} />
                </div>
                <div className={s.breakCaption}>
                  <h3 className={s.hS}>{BREAKS[0][0]}</h3>
                  <p className={`${s.bodyL} ${s.mid}`}>{BREAKS[0][1]}</p>
                </div>
              </div>

              {/* the bar chart — many small deliveries */}
              <div className={s.breakCol}>
                <div className={s.chartFrame} aria-hidden="true">
                  <ArtImage className={s.chartGrid} src={ART.chartGrid} />
                  <div className={s.bars}>
                    {BAR_HEIGHTS.map((h, i) => (
                      <span key={i} className={s.bar} style={{ height: h }} />
                    ))}
                  </div>
                </div>
                <div className={s.breakCaption}>
                  <h3 className={s.hS}>{BREAKS[1][0]}</h3>
                  <p className={`${s.bodyL} ${s.mid}`}>{BREAKS[1][1]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 · how it works ── */}
      <section className={s.band}>
        <div className={s.plateWrap} aria-hidden="true">
          <ArtImage className={s.plate} src={ART.plateCta} />
          <div className={s.plateMask} />
        </div>

        <div className={s.inner}>
          <div className={s.howRow}>
            <div className={s.howLeft}>
              <h2 className={s.hL}>
                How it works
                <br />
                <span className={s.thin}>under the hood</span>
              </h2>
              <ActionLink href={PAYMENT_CHANNELS_PROGRAM_URL}>
                View the program
              </ActionLink>
            </div>
            <div className={s.howSteps}>
              {STEPS.map((st, i) => (
                <div
                  key={st.title}
                  className={`${s.step} ${i === STEPS.length - 1 ? s.stepLast : ""}`}
                >
                  <div className={s.stepHead}>
                    <Glyph layers={st.layers} />
                    <div className={s.stepTitle}>
                      <h3 className={s.hS}>{st.title}</h3>
                    </div>
                  </div>
                  <p className={`${s.bodyL} ${s.mid} ${s.stepBody}`}>
                    {st.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 · why this matters ── */}
      <section className={s.band}>
        <StreakPair />
        <div className={s.inner}>
          <div className={s.whyStack}>
            <h2 className={`${s.hL} ${s.whyHead}`}>
              Settlement is the bill,
              <br />
              <span className={s.thin}>not the bottleneck.</span>
            </h2>

            <div className={s.whyCols}>
              {LIMITS.map(([title, body]) => (
                <div key={title} className={s.whyCol}>
                  <h3 className={`${s.bodyXl} ${s.med}`}>{title}</h3>
                  <p className={`${s.bodyL} ${s.mid}`}>{body}</p>
                </div>
              ))}
            </div>

            <div className={s.session}>
              {/* the plate arrives with its blended shapes already baked in */}
              <ArtImage className={s.sessionPlate} src={ART.sessionBg} />
              <div className={s.sessionLeft}>
                <h3 className={`${s.hM} ${s.sessionTitle}`}>
                  100,000 channels. 25,000 transactions. One completed
                  settlement cycle.
                </h3>
                <p className={`${s.bodyL} ${s.mid} ${s.sessionIntro}`}>
                  A settlement transaction carries four channel updates. The
                  full cycle finalized all 100,000 channels while one million
                  payments per second continued at application speed.
                </p>
                <ActionLink href={BENCHMARK_URL}>Run the benchmark</ActionLink>
              </div>
              <ul className={s.sessionList}>
                {SETTLEMENT_METRICS.map(([value, label]) => (
                  <li key={label} className={s.sessionItem}>
                    <svg
                      className={s.sessionTick}
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m6 12.6 4 4L18 7.5"
                        stroke="#fff"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className={s.sessionMetric}>
                      <strong className={s.sessionMetricValue}>{value}</strong>
                      <span className={`${s.bodyS} ${s.mid}`}>{label}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 · built open, works everywhere ── */}
      <section className={s.band}>
        <ArtImage className={s.openPlate} src={ART.plateCta} />
        <div className={s.openInner}>
          <div className={s.openStack}>
            <div className={s.openHead}>
              <h2 className={`${s.hL} ${s.openTitle}`}>
                Built open,
                <br />
                <span className={s.thin}>works everywhere</span>
              </h2>
              <p className={`${s.bodyL} ${s.mid} ${s.openLede}`}>
                Payment Channels map cleanly onto the open agentic payment
                standards live on Solana today.
              </p>
            </div>
            <hr className={s.rule} />
            <div className={s.openCols}>
              {MODES.map(([tag, body]) => (
                <div key={tag} className={s.openCol}>
                  <span className={s.pill}>{tag}</span>
                  <p className={s.openBody}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10 · live at launch ── */}
      <section className={`${s.band} ${s.noRule}`}>
        <StreakPair />
        <div className={s.inner}>
          <div className={s.launchRow}>
            <div className={s.launchLeft}>
              <h2 className={s.hL}>
                Live at launch
                <br />
                <span className={s.thin}>with Alibaba Cloud</span>
              </h2>
              <p className={`${s.bodyL} ${s.mid}`}>
                Inference has been one of the most in demand use cases across
                agentic payment protocols. We are excited to be launching
                Payment Channels with Alibaba Cloud. Their API endpoints are
                live and payable on pay.sh today. Your agent can authorize once
                and consume their cloud APIs at scale, paying in stablecoins as
                it goes.
              </p>
            </div>

            <div className={s.partners}>
              {PARTNERS.map((p, i) => (
                <div
                  key={p.label}
                  className={`${s.partner} ${i === 0 ? s.partnerRule : ""}`}
                >
                  <div className={s.partnerTop}>
                    <p className={s.bodyS}>{p.label}</p>
                    <ArtImage
                      className={s.partnerLogo}
                      src={p.logo}
                      style={{ width: p.w, height: p.h }}
                    />
                  </div>
                  <ActionLink variant="ghost" href={p.href} rel="noreferrer">
                    {p.cta}
                  </ActionLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 08 · get started ── */}
      <section className={s.getBand}>
        <div className={s.getCard}>
          <SafeUnicornScene
            projectId={SHADER_PROJECT}
            className={s.shader}
            width="100%"
            height="100%"
            scale={1}
            dpi={1.5}
            lazyLoad
            production
          />
          <Globe />
          <div className={s.getShade} aria-hidden="true" />
          <div className={s.getStack}>
            <div className={s.getHead}>
              <h2 className={`${s.hL} ${s.getTitle}`}>
                Get started with
                <br />
                <span className={s.thin}>Payment Channels.</span>
              </h2>
              <div className={s.getAside}>
                <p className={s.bodyXl}>
                  The spec is public and the program is open source for everyone
                  to build on.
                </p>
              </div>
            </div>

            <div className={s.getGrid}>
              <div className={s.getRow}>
                {TILES.slice(0, 3).map((tile) => (
                  <ResourceTile key={tile.name} tile={tile} />
                ))}
              </div>
              <div className={s.getRow}>
                {TILES.slice(3).map((tile) => (
                  <ResourceTile key={tile.name} tile={tile} />
                ))}
                {/* the frame keeps a third slot on this row, held empty */}
                <div
                  className={`${s.tile} ${s.tileGhost}`}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
