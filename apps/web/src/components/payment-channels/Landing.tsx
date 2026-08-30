"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import VizCanvas from "@/app/gallery/VizCanvas";
import { CENTRED, stream } from "@/app/gallery/viz/stream";
import type { VizControls } from "@/app/gallery/viz/types";
import Globe from "./Globe";
import s from "./payment-channels.module.css";

/* Assets exported from the Figma frame and served from /public/alt. Names are
   the frame's own; hashes are Figma's content addresses, kept so a re-export
   maps back cleanly. */
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
  /* 06 · the two shapes blended over the session card */
  sessionBg: A("session-bg.png"),
  /* the USDC mark: glyph over ring, on a #2775ca disc */
  usdcGlyph: A("a606601138e785abfcf923cceb7f5d70d00e0fa5.svg"),
  usdcRing: A("7ae292b3c125c01378810f5d67a25d7b30624294.svg"),
  /* 10 · live at launch */
  logoAlibaba: A("3151a097741e4bd16439eb9024b650c4da57909a.svg"),
  logoPaySh: A("a430ee0582fc2f8b41b9457e139706a50308bdfa.svg"),
  /* 03 · the app mock */
  avatar1: A("efa996f6c6f7b6cda93052839857fbd2306fa9d1.png"),
  avatar2: A("8748b5212aa12ade1418f0ce31ad3d4b074195a1.png"),
  avatar3: A("e12d1568f25667a7be2d321b988c367a5f023122.png"),
  avatar4: A("be50a75c166b75b0f64ce97f754014acd804a53c.png"),
  /* 06 · why this matters */
  tick: A("5e1982a0801e5bf3672784d490aa5b65625ce4de.svg"),
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
  getPlate: A("60b5428ee135e6e99432c85973aba6c18a08cd01.svg"),
  /* 09 · footer */
  wordmark: A("c87e1320a7ea42865b343b3605ccfc51f5c50b99.svg"),
  /* the Solana Foundation lockup: mark then wordmark */
  fdnMark: A("8056b059c2cbcae9fcfb6177f0cda6e04b440fc5.svg"),
  fdnWord: A("e962ce7505138f0e8870cd9b2aee076d00734c1b.svg"),
  soYoutube: A("fdf2c9e4f0290c5db97861e2f40eb87eb2f771f5.svg"),
  soX: A("5071168676b8caac776b0218f95b9e6bdae706ed.svg"),
  soDiscord: A("9b1b2495350c1018d7c803dbd77ebf76fd665c83.svg"),
  soReddit: A("12f6242e8ce040e4b223cd073b017715f9f660af.svg"),
  soGithub: A("c1ee19783679c381736ef975cc5427ffe298ff9e.svg"),
  soTelegram: A("6d8a3716856cdc3dbfa86163a734cd737fe35f88.svg"),
  globeRing: A("6f2663ce5a6b07a3afe9821ca05f929041970b57.svg"),
  globeBar: A("96fba0329b2b138228d80f1f1a7b29ac6a51a829.svg"),
  chevUp: A("56239ac4d989ba0db7a5ea2c12a6f8766793b18e.svg"),
  chevDown: A("2ee59c54064ebbfc933a856f22cae9263fcf0c45.svg"),
} as const;

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
    height: 27,
    gap: 47,
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
    gap: 9,
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
    often: 198,
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
    speed: 210,
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

function useHeroStream() {
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
  } as unknown as VizControls;

  const heroVars = {
    "--hero-vh": 100,
    "--hero-max": "1060px",
    "--bleed": `${bleed}px`,
  } as CSSProperties;
  return { controls, heroVars, centred: false, middle: true };
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.src} alt="" />
          </span>
        </span>
      ))}
    </span>
  );
}

/* ── the get-started shader ──
   The CTA repo backs this card with a Unicorn Studio scene rather than a still.
   It pulls its runtime from a CDN at mount and tears the scene down on unmount;
   the static plate stays underneath as the fallback if the script never lands. */
type UnicornRuntime = {
  isInitialized?: boolean;
  init?: () => Promise<unknown>;
  destroy?: () => void;
};

const SHADER_SRC =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js";
const SHADER_PROJECT = "QTGtHSQRXx8jQPnaWrL0";

function Shader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const runtimeWindow = window as unknown as {
      UnicornStudio?: UnicornRuntime;
    };
    let alive = true;
    let started = false;
    let script: HTMLScriptElement | null = null;
    const start = () => {
      if (!alive) return;
      const us = runtimeWindow.UnicornStudio;
      if (us && !us.isInitialized && us.init) {
        us.init().catch(() => {});
        us.isInitialized = true;
      }
    };

    const boot = () => {
      if (!alive || started) return;
      started = true;
      if (!runtimeWindow.UnicornStudio) {
        runtimeWindow.UnicornStudio = { isInitialized: false };
        script = document.createElement("script");
        script.src = SHADER_SRC;
        script.onload = start;
        (document.head || document.body).appendChild(script);
      } else start();
    };

    /* The shader is decorative and sits below the fold. Defer its external
       runtime until the card is close to view so it cannot compete with the
       hero's first render. */
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) boot();
      },
      { rootMargin: "300px" },
    );
    visibility.observe(root);
    const box = root.getBoundingClientRect();
    if (box.bottom > -300 && box.top < window.innerHeight + 300) boot();

    return () => {
      alive = false;
      visibility.disconnect();
      if (script) script.onload = null;
      if (started) runtimeWindow.UnicornStudio?.destroy?.();
    };
  }, []);

  return (
    <div ref={rootRef} className={s.shader} aria-hidden="true">
      <div
        data-us-project={SHADER_PROJECT}
        data-us-scale="1"
        data-us-dpi="1.5"
      />
    </div>
  );
}

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

/* ── content, verbatim from the copy deck ── */

const STATS: [string, string][] = [
  ["1M+", "Logical payments / second"],
  ["10 min", "Sustained throughput run"],
  ["100k", "Unique wallets (devnet)"],
  ["80B+", "Vouchers ingested in 24h"],
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
    title: "Settle",
    body: "The actual amount consumed is recorded onchain in a single transaction.",
  },
  {
    layers: [
      {
        outer: "16.67% 12.5% 12.5% 12.5%",
        inner: "-3.53% -3.33% -4.99% -3.33%",
        src: ART.iRefund,
      },
    ],
    title: "Refund",
    body: "Any unused deposit returns to the primary wallet.",
  },
];

const LIMITS: [string, string][] = [
  [
    "Simple by design",
    "Open a channel once. Exchange signed cumulative updates off-chain. Settle the final balance to Solana when it matters.",
  ],
  [
    "Scales cleanly",
    "Ed25519 verification is the CPU-bound work. Independent channel ownership lets you shard channel ranges across Proxies as demand grows.",
  ],
  [
    "Cheap at settlement",
    "The 100k-channel study completed with 25,000 four-channel transactions for 0.625 SOL while the logical payments themselves stayed off-chain.",
  ],
  [
    "Your rules, your clock",
    "Settle by time, volume, risk, or your own business logic. Fewer settlements lower cost; tighter settlement windows bring faster finality.",
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
    href: "https://pay.sh",
  },
  {
    label: "Platform for pay-per-use APIs",
    logo: ART.logoPaySh,
    w: 108,
    h: 32,
    cta: "Explore pay.sh",
    href: "https://pay.sh",
  },
];

const TILES: { name: string; href: string; layers: Layer[] }[] = [
  {
    name: "Program",
    href: "https://github.com/solana-foundation/payment-channels",
    layers: [{ outer: "16.67% 8.33%", inner: "-4.55% -4.24%", src: ART.tCode }],
  },
  {
    name: "Tookit & Playground",
    href: "https://github.com/solana-foundation/pay-kit",
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
    name: "SDK + Quickstart",
    href: "https://pay.sh/docs/sdk/typescript",
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
    href: "https://pay.sh/docs/building-with-pay/payment-channels/concept",
    layers: [{ outer: "12.5% 20.83%", inner: "-3.33% -4.29%", src: ART.tFile }],
  },
  {
    name: "Spec",
    href: "https://paymentauth.org/draft-solana-session-00.html",
    layers: [{ outer: "16.67%", inner: "-3.75%", src: ART.tChecklist }],
  },
];

const TASKS: [string, string, boolean][] = [
  ["Check if anything in watchlist moved over 15%", ART.avatar1, true],
  ["Rebalance portfolio to target allocation", ART.avatar2, false],
  ["Summarise wallet activity across agents", ART.avatar3, false],
  ["Report daily P&L to Discord", ART.avatar4, false],
];

export default function Landing() {
  const hero = useHeroStream();

  return (
    /* `scrolls` is the global unlock: the document is overflow-hidden for the
       fixed full-bleed routes, and this class is how a route that scrolls
       normally asks for the document back */
    <div className={`scrolls ${s.page}`}>
      {/* ── 01 · hero ── */}
      <section className={s.hero} style={hero.heroVars}>
        <Stream controls={hero.controls} />

        <div
          className={`${s.heroInner} ${hero.middle ? s.heroMiddle : ""} ${s.heroScrimOn}`}
        >
          <div className={s.heroContent}>
            <div className={s.heroBlock}>
              <h1 className={`${s.hXl} ${s.heroTitle}`}>
                1 million payments
                <br />
                <span className={s.thin}>every second</span>
              </h1>
              <p className={`${s.bodyL} ${s.heroSub}`}>
                The next generation of software will not wait at a checkout
                screen. It will make many small, continuous decisions—and pay
                for the data, inference, and services it needs as it goes.
              </p>
              <a
                className={s.btn}
                href="https://pay.sh/docs/building-with-pay/payment-channels/concept"
              >
                Read the docs
              </a>
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
                  Payment channels,
                  <br />
                  <span className={s.thin}>reintroduced at Solana pace</span>
                  <br />
                  for agentic traffic.
                </h2>
                <p className={`${s.bodyL} ${s.mid} ${s.agentsKicker}`}>
                  One Proxy completed the full receive, verify, and settlement
                  path on an AMD EPYC 9555P: 64 physical cores and 128 threads.
                  At one million logical payments per second, it kept 117
                  threads busy and absorbed about 11 Gbps of inbound traffic.
                </p>
              </div>
              <hr className={s.rule} />
              <p className={`${s.bodyXl} ${s.agentsPull}`}>
                Scale up a Proxy with more CPU and network bandwidth. Scale out
                by giving the next Proxy a different channel range; channel
                state stays local, so the hot path needs no shared state.
              </p>
            </div>

            <div className={s.agentsArt}>
              {/* the aurora and its striped streak arrive baked into one export */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={s.agentsPlate}
                src={ART.agentsArt}
                alt=""
                aria-hidden="true"
              />
              <div className={s.mock}>
                <div className={s.mockBar}>
                  <span className={s.mockDot} />
                  <span className={s.mockDot} />
                  <span className={s.mockDot} />
                </div>
                <div className={s.mockBody}>
                  <div className={s.mockTabs}>
                    <div className={s.tabGroup}>
                      <span className={s.tabOn}>Tasks</span>
                      <span className={s.tabOff}>Workflows</span>
                    </div>
                    <span className={s.balance}>
                      <span className={s.balanceCoin}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className={s.coinRing}
                          src={ART.usdcRing}
                          alt=""
                          aria-hidden="true"
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className={s.coinGlyph}
                          src={ART.usdcGlyph}
                          alt=""
                          aria-hidden="true"
                        />
                      </span>
                      <span className={s.balanceText}>
                        <b>290.22</b> USDC
                      </span>
                    </span>
                  </div>
                  <div className={s.tasks}>
                    {TASKS.map(([label, avatar, active], i) => (
                      <div key={label}>
                        <div className={active ? s.taskActive : s.taskDone}>
                          {active ? (
                            <svg
                              className={s.taskIcon}
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2 2m-7 7-2 2m0-11 2 2m7 7 2 2"
                                stroke="#fff"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              className={s.taskIcon}
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="m7 12.5 3.2 3.2L17 9"
                                stroke="#fff"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          <span className={`${s.bodyS} ${s.taskText}`}>
                            {label}
                          </span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className={s.taskAvatar}
                            src={avatar}
                            alt=""
                            aria-hidden="true"
                          />
                        </div>
                        {i > 0 && i < TASKS.length - 1 && (
                          <div className={s.taskRule} />
                        )}
                      </div>
                    ))}
                  </div>
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
                    While pay-per-request models simplify paid tool use, certain
                    kinds of agentic spending patterns are a bad fit for
                    settling every request onchain:
                  </p>
                </div>
                <hr className={s.rule} />
              </div>
              <p className={s.bodyL}>
                A payment channel amortizes the onchain work down to one open
                and one settle, no matter how much metering happens in between.
                Logical payments keep moving at application speed while Solana
                handles settlement when it matters.
              </p>
            </div>

            <div className={s.breakCharts}>
              {/* the step chart — cost climbing per call */}
              <div className={s.breakCol}>
                <div className={s.chartFrame} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={s.chartGrid} src={ART.chartGrid} alt="" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={s.stepFill} src={ART.stepFill} alt="" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={s.stepLine} src={ART.stepLine} alt="" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={s.stepEdge} src={ART.stepEdge} alt="" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={s.stepDot} src={ART.stepDot} alt="" />
                </div>
                <div className={s.breakCaption}>
                  <h3 className={s.hS}>{BREAKS[0][0]}</h3>
                  <p className={`${s.bodyL} ${s.mid}`}>{BREAKS[0][1]}</p>
                </div>
              </div>

              {/* the bar chart — many small deliveries */}
              <div className={s.breakCol}>
                <div className={s.chartFrame} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={s.chartGrid} src={ART.chartGrid} alt="" />
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.plate} src={ART.plateCta} alt="" />
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
              <a
                className={s.btn}
                href="https://github.com/solana-foundation/payment-channels"
              >
                View the program
              </a>
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
        <Streak style={{ left: -383, top: 961 }} />
        <Streak style={{ left: 2161, top: 763 }} />
        <div className={s.inner}>
          <div className={s.whyStack}>
            <h2 className={`${s.hL} ${s.whyHead}`}>
              Settlement is the bill,{" "}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={s.sessionPlate}
                src={ART.sessionBg}
                alt=""
                aria-hidden="true"
              />
              <div className={s.sessionLeft}>
                <h3 className={`${s.hM} ${s.sessionTitle}`}>
                  100,000 channels. 25,000 transactions. One completed
                  settlement cycle.
                </h3>
                <p className={`${s.bodyL} ${s.mid} ${s.sessionIntro}`}>
                  A settlement transaction carries four channel updates. The
                  full cycle finalized all 100,000 channels while one million
                  logical payments per second continued at application speed.
                </p>
                <a className={s.btn} href="https://pay.sh/docs/sdk/typescript">
                  Run the benchmark
                </a>
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={s.openPlate}
          src={ART.plateCta}
          alt=""
          aria-hidden="true"
        />
        <div className={s.openInner}>
          <div className={s.openStack}>
            <div className={s.openHead}>
              <h2 className={`${s.hL} ${s.openTitle}`}>
                Built open,
                <br />
                <span className={s.thin}>works everywhere</span>
              </h2>
              <p className={`${s.bodyL} ${s.mid} ${s.openLede}`}>
                Payment channels map cleanly onto the open agentic payment
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
        <Streak style={{ left: -383, top: 961 }} />
        <Streak style={{ left: 2161, top: 763 }} />
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
                payment channels with Alibaba Cloud. Their API endpoints are
                live and payable through Sessions on pay.sh today. Your agent
                can authorize once and consume their cloud APIs at scale, paying
                in stablecoins as it goes.
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={s.partnerLogo}
                      src={p.logo}
                      alt=""
                      aria-hidden="true"
                      style={{ width: p.w, height: p.h }}
                    />
                  </div>
                  <a className={s.btnGhost} href={p.href} rel="noreferrer">
                    {p.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 08 · get started ── */}
      <section className={s.getBand}>
        <div className={s.getCard}>
          <Shader />
          <Globe />
          <div className={s.getShade} aria-hidden="true" />
          <div className={s.getStack}>
            <div className={s.getHead}>
              <h2 className={`${s.hL} ${s.getTitle}`}>
                Get started with
                <br />
                <span className={s.thin}>payment channels.</span>
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
                {TILES.slice(0, 3).map((t) => (
                  <a
                    key={t.name}
                    className={s.tile}
                    href={t.href}
                    rel="noreferrer"
                  >
                    <Glyph layers={t.layers} />
                    <p className={`${s.bodyXl} ${s.tileName}`}>{t.name}</p>
                  </a>
                ))}
              </div>
              <div className={s.getRow}>
                {TILES.slice(3).map((t) => (
                  <a
                    key={t.name}
                    className={s.tile}
                    href={t.href}
                    rel="noreferrer"
                  >
                    <Glyph layers={t.layers} />
                    <p className={`${s.bodyXl} ${s.tileName}`}>{t.name}</p>
                  </a>
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
