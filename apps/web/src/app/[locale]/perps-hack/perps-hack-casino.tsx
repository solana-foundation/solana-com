"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * PERPS HACK — CASINO screen
 * Ported from the Claude Design "PERPS HACK.dc.html" casino mode.
 * Modifications from source:
 *   - top ticker shows Solana-ecosystem tokens only (no BTC / ETH)
 *   - the candlestick chart is SOL / USD
 * ------------------------------------------------------------------ */

const SUBMISSION_TARGET = Date.UTC(2026, 6, 22, 23, 59, 0); // Jul 22 2026 23:59 UTC

// SOL-only: Solana-ecosystem tokens for the top ticker
const SYMS = [
  { s: "SOL", p: 172.4 },
  { s: "JUP", p: 1.04 },
  { s: "BONK", p: 0.000031 },
  { s: "WIF", p: 2.11 },
  { s: "PYTH", p: 0.55 },
  { s: "JTO", p: 3.18 },
  { s: "RAY", p: 4.82 },
  { s: "ORCA", p: 3.91 },
  { s: "DRIFT", p: 1.12 },
  { s: "JLP", p: 4.36 },
];

const PROBLEMS = [
  "an undercollateralized perp",
  "an onchain options vault",
  "a cross-margin engine",
  "a liquidation keeper bot",
  "a funding-rate arb bot",
  "a perp aggregator",
  "an RFQ market maker",
  "a prediction market",
  "a basis-trade vault",
  "a perp DEX frontend",
  "a live risk dashboard",
  "an oracle-free AMM perp",
];
const INTEGR = ["Dflow", "Percolator", "Phoenix", "raw Solana"];
const TWISTS = [
  "for mobile degens",
  "with AI agents",
  "that is gasless",
  "with social copy-trading",
  "for institutions",
  "that is fully onchain",
  "with one-click leverage",
  "for memecoins",
  "with auto-hedging",
  "that never liquidates",
];
const CHECK_ITEMS = [
  "Working demo touching perps, derivatives or market structure",
  "A clear user / protocol / liquidity problem solved",
  "A meaningful Solana integration (not cosmetic)",
  "Open-source repo so judges can verify",
  "A short demo video or write-up",
];
const HANDLES = [
  "0x9f3a",
  "@solbuilder",
  "@degen_dev",
  "0x44c1",
  "@anon.sol",
  "@perpchad",
  "0x7e22",
  "@gm_ser",
  "@vaultwiz",
  "0xbeef",
  "@liqhunter",
  "@onchain_kid",
  "0x1337",
  "@maxlev",
  "@ngmi_dev",
  "0xc0de",
];
const SIGNUP_TRACKS = [
  { name: "Phoenix", col: "#ffd700" },
  { name: "Dflow", col: "#2bffd4" },
  { name: "Percolator", col: "#ff4d8d" },
  { name: "Open", col: "#e7d6ff" },
];

const SOL_THEME = { up: "#2bffd4", down: "#ff4d8d" };

function fmt(p: number): string {
  if (p >= 1000) return "$" + Math.round(p).toLocaleString();
  if (p >= 1) return "$" + p.toFixed(2);
  if (p >= 0.01) return "$" + p.toFixed(4);
  return "$" + p.toFixed(6);
}

type Candle = { o: number; h: number; l: number; c: number; v: number };

function genCandlesAt(n: number, base: number): Candle[] {
  const a: Candle[] = [];
  let p = base;
  for (let i = 0; i < n; i++) {
    const o = p;
    const c = o * (1 + (Math.random() - 0.46) * 0.05);
    const h = Math.max(o, c) * (1 + Math.random() * 0.02);
    const l = Math.min(o, c) * (1 - Math.random() * 0.02);
    a.push({ o, h, l, c, v: Math.random() * 0.8 + 0.25 });
    p = c;
  }
  return a;
}

type Signup = { handle: string; track: string; col: string; time: string };
function newSignup(): Signup {
  const h = HANDLES[Math.floor(Math.random() * HANDLES.length)];
  const tk = SIGNUP_TRACKS[Math.floor(Math.random() * SIGNUP_TRACKS.length)];
  return {
    handle: h,
    track: tk.name,
    col: tk.col,
    time: new Date().toLocaleTimeString("en-GB"),
  };
}

const KEYFRAMES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bungee&family=Comic+Neue:wght@700&display=swap');
@keyframes ph-marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes ph-floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes ph-hue{to{filter:hue-rotate(360deg)}}
@keyframes ph-wobble{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
@keyframes ph-rise{0%{transform:translateY(0) rotate(0);opacity:0}8%{opacity:.55}88%{opacity:.55}100%{transform:translateY(-118vh) rotate(45deg);opacity:0}}
@keyframes ph-glowpulse{0%,100%{box-shadow:0 0 16px rgba(0,240,255,.22)}50%{box-shadow:0 0 34px rgba(255,0,229,.42)}}
@keyframes ph-flashpnl{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@keyframes ph-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes ph-slidein{from{transform:translateY(-6px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes ph-tickerflash{0%,100%{opacity:1}50%{opacity:.45}}
`;

const FLOATERS = [
  { left: "5%", size: 30, dur: 15, delay: 0, e: "🚀" },
  { left: "14%", size: 22, dur: 19, delay: 3, e: "💰" },
  { left: "24%", size: 34, dur: 13, delay: 6, e: "📈" },
  { left: "36%", size: 24, dur: 17, delay: 1, e: "🎰" },
  { left: "47%", size: 28, dur: 21, delay: 8, e: "💎" },
  { left: "58%", size: 20, dur: 14, delay: 4, e: "🤑" },
  { left: "68%", size: 32, dur: 18, delay: 2, e: "🚀" },
  { left: "78%", size: 24, dur: 16, delay: 7, e: "📈" },
  { left: "88%", size: 30, dur: 20, delay: 5, e: "💸" },
  { left: "95%", size: 22, dur: 15, delay: 9, e: "🦍" },
];

const TRACKS = [
  {
    icon: "🏆",
    name: "OVERALL",
    amount: "$700K",
    desc: "strongest overall perps product",
    col: "#ffd700",
  },
  {
    icon: "✨",
    name: "DFLOW",
    amount: "$100K",
    desc: "build on the prediction-market order book",
    col: "#2bffd4",
  },
  {
    icon: "🔒",
    name: "PERCOLATOR",
    amount: "$100K",
    desc: "admin-keyless risk engine, matchers & venues",
    col: "#ff4d8d",
  },
  {
    icon: "🔥",
    name: "PHOENIX",
    amount: "$100K",
    desc: "perp DEX on a real on-chain CLOB",
    col: "#ffd700",
  },
];

const POSITIONS = [
  {
    title: "🥇 GRAND PRIZE",
    note: "· gigachad",
    side: "LONG 50x",
    size: "1.00 PERP",
    pnl: "+$500K",
    col: "#2bffd4",
    big: true,
  },
  {
    title: "🥈 RUNNER-UP",
    note: "· still wagmi",
    side: "LONG 20x",
    size: "0.40 PERP",
    pnl: "+$200K",
    col: "#ff4d8d",
    big: true,
  },
  {
    title: "✨ DFLOW INTEGRATION",
    note: "· prediction-market book",
    side: "LONG 10x",
    size: "0.20 PERP",
    pnl: "+$100K",
    col: "#ffd700",
    big: false,
  },
  {
    title: "🔒 PERCOLATOR INTEGRATION",
    note: "· admin-keyless risk engine",
    side: "LONG 10x",
    size: "0.20 PERP",
    pnl: "+$100K",
    col: "#ffd700",
    big: false,
  },
  {
    title: "🔥 PHOENIX INTEGRATION",
    note: "· perp DEX, real CLOB",
    side: "LONG 10x",
    size: "0.20 PERP",
    pnl: "+$100K",
    col: "#ffd700",
    big: false,
  },
];

const SCHEDULE = [
  {
    date: "JUL 8",
    side: "BUY",
    sideCol: "#2bffd4",
    event: "🟢 hacking starts · gm ser",
    status: "FILLED ✓",
    statusCol: "#2bffd4",
  },
  {
    date: "JUL 9",
    side: "BUY",
    sideCol: "#2bffd4",
    event: "📨 submissions open",
    status: "FILLED ✓",
    statusCol: "#2bffd4",
  },
  {
    date: "JUL 22",
    side: "SELL",
    sideCol: "#ff4d8d",
    event: "⏰ submissions due · cope deadline",
    status: "PENDING ⌛",
    statusCol: "#ffd700",
    highlight: true,
  },
  {
    date: "JUL 29",
    side: "BUY",
    sideCol: "#2bffd4",
    event: "🏆 winners announced · wagmi list",
    status: "QUEUED …",
    statusCol: "#9a86c4",
  },
];

const FAQ = [
  { q: "Who can enter?", a: "anyone — solo or teams up to 4." },
  { q: "How much does it cost?", a: "free. just ship something real." },
  {
    q: "Do I need a finished product?",
    a: "a working demo + an open-source repo.",
  },
  { q: "Where do I ask questions?", a: "Discord & office hours (link soon)." },
];

function drawChart(
  ctx: CanvasRenderingContext2D,
  cv: HTMLCanvasElement,
  cs: Candle[],
) {
  const r = cv.getBoundingClientRect();
  const w = r.width;
  const h = r.height;
  ctx.clearRect(0, 0, w, h);
  if (!cs || !cs.length) return;
  const volH = h * 0.2;
  const pH = h - volH - 4;
  let min = Infinity;
  let max = -Infinity;
  let mv = 0;
  for (const k of cs) {
    if (k.l < min) min = k.l;
    if (k.h > max) max = k.h;
    if ((k.v || 0) > mv) mv = k.v || 0;
  }
  const pad = (max - min) * 0.12 || 1;
  min -= pad;
  max += pad;
  const y = (v: number) => ((max - v) / (max - min)) * pH;
  const t = SOL_THEME;
  ctx.strokeStyle = "rgba(127,140,135,.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const gy = (pH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }
  const n = cs.length;
  const cw = w / n;
  const bw = Math.max(1.5, cw * 0.6);
  cs.forEach((k, i) => {
    const x = i * cw + cw / 2;
    const up = k.c >= k.o;
    const col = up ? t.up : t.down;
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y(k.h));
    ctx.lineTo(x, y(k.l));
    ctx.stroke();
    const yo = y(k.o);
    const yc = y(k.c);
    const top = Math.min(yo, yc);
    const bh = Math.max(1.5, Math.abs(yc - yo));
    ctx.fillRect(x - bw / 2, top, bw, bh);
    const vh = (k.v / (mv || 1)) * volH;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(x - bw / 2, h - vh, bw, vh);
    ctx.globalAlpha = 1;
  });
  const last = cs[cs.length - 1];
  const lp = last.c;
  const ly = y(lp);
  const up = last.c >= last.o;
  const lc = up ? t.up : t.down;
  ctx.strokeStyle = lc;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, ly);
  ctx.lineTo(w, ly);
  ctx.stroke();
  ctx.setLineDash([]);
  const tag = fmt(lp);
  ctx.font = "700 11px monospace";
  const tw = ctx.measureText(tag).width + 12;
  ctx.fillStyle = lc;
  ctx.fillRect(w - tw, ly - 8, tw, 16);
  ctx.fillStyle = "#04140f";
  ctx.textBaseline = "middle";
  ctx.fillText(tag, w - tw + 6, ly);
  ctx.textBaseline = "alphabetic";
}

export function PerpsHackCasino({
  registrationUrl = "https://solana.com/events",
}: {
  registrationUrl?: string;
}) {
  const [now, setNow] = useState(SUBMISSION_TARGET - 14 * 86400000);
  const [, setFrame] = useState(0);
  const [reels, setReels] = useState({ a: 5, b: 0, c: 3 });
  const [spinning, setSpinning] = useState(false);
  const [checks, setChecks] = useState([false, false, false, false, false]);

  // simulation state kept in refs; a frame counter forces re-render
  const symsRef = useRef(SYMS.map((o) => ({ ...o, d: 0 })));
  const solCandlesRef = useRef<Candle[]>(genCandlesAt(80, 178));
  const signupsRef = useRef<Signup[]>(
    Array.from({ length: 12 }, () => newSignup()),
  );
  const regCountRef = useRef(1247);
  const spinTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // live data tick
  useEffect(() => {
    const tk = setInterval(() => {
      symsRef.current.forEach((o) => {
        const v = (Math.random() - 0.47) * 0.022;
        o.d = v;
        o.p = Math.max(0.0000001, o.p * (1 + v));
      });
      // push a new SOL/USD candle
      const cs = solCandlesRef.current;
      const last = cs[cs.length - 1];
      const o = last.c;
      const c = o * (1 + (Math.random() - 0.46) * 0.05);
      const h = Math.max(o, c) * (1 + Math.random() * 0.02);
      const l = Math.min(o, c) * (1 - Math.random() * 0.02);
      cs.push({ o, h, l, c, v: Math.random() * 0.8 + 0.25 });
      if (cs.length > 90) cs.shift();
      // registrations slowly tick up
      regCountRef.current += Math.random() * 2.4 + 0.2;
      if (Math.random() < 0.6) {
        signupsRef.current = [newSignup(), ...signupsRef.current].slice(0, 12);
      }
      setFrame((f) => f + 1);
    }, 850);
    const cd = setInterval(() => setNow((n) => n + 1000), 1000);
    return () => {
      clearInterval(tk);
      clearInterval(cd);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (spinTimer.current) clearInterval(spinTimer.current);
    };
  }, []);

  // candlestick canvas
  const chartCanvas = useRef<HTMLCanvasElement | null>(null);
  const chartRaf = useRef<number | null>(null);
  const solChartRef = useCallback((el: HTMLCanvasElement | null) => {
    if (chartRaf.current) cancelAnimationFrame(chartRaf.current);
    chartCanvas.current = el;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      const r = el.getBoundingClientRect();
      el.width = Math.max(1, r.width * devicePixelRatio);
      el.height = Math.max(1, r.height * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    addEventListener("resize", resize);
    const loop = () => {
      if (chartCanvas.current !== el) return;
      drawChart(ctx, el, solCandlesRef.current);
      chartRaf.current = requestAnimationFrame(loop);
    };
    chartRaf.current = requestAnimationFrame(loop);
  }, []);

  // particle cursor trail
  const particleCanvas = useRef<HTMLCanvasElement | null>(null);
  const particleRaf = useRef<number | null>(null);
  const particleRef = useCallback((el: HTMLCanvasElement | null) => {
    if (particleRaf.current) cancelAnimationFrame(particleRaf.current);
    particleCanvas.current = el;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const parts: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      r: number;
      col: string;
    }> = [];
    const resize = () => {
      el.width = innerWidth;
      el.height = innerHeight;
    };
    resize();
    addEventListener("resize", resize);
    const spawn = (x: number, y: number) => {
      for (let i = 0; i < 3; i++) {
        parts.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2.4,
          vy: (Math.random() - 0.5) * 2 - 1.2,
          life: 1,
          r: Math.random() * 3 + 1.5,
          col: Math.random() < 0.5 ? SOL_THEME.up : SOL_THEME.down,
        });
      }
      if (parts.length > 460) parts.splice(0, parts.length - 460);
    };
    const onMove = (e: MouseEvent) => spawn(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const tt = e.touches[0];
      if (tt) spawn(tt.clientX, tt.clientY);
    };
    addEventListener("mousemove", onMove);
    addEventListener("touchmove", onTouch, { passive: true });
    const loop = () => {
      if (particleCanvas.current !== el) return;
      ctx.clearRect(0, 0, el.width, el.height);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.life -= 0.022;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.col;
        const s = p.r * 1.7;
        ctx.fillRect(p.x, p.y, s, s);
      }
      ctx.globalAlpha = 1;
      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].life <= 0) parts.splice(i, 1);
      }
      particleRaf.current = requestAnimationFrame(loop);
    };
    particleRaf.current = requestAnimationFrame(loop);
  }, []);

  const doSpin = () => {
    if (spinTimer.current) return;
    setSpinning(true);
    let n = 0;
    spinTimer.current = setInterval(() => {
      setReels({
        a: Math.floor(Math.random() * PROBLEMS.length),
        b: Math.floor(Math.random() * INTEGR.length),
        c: Math.floor(Math.random() * TWISTS.length),
      });
      if (++n > 15) {
        if (spinTimer.current) clearInterval(spinTimer.current);
        spinTimer.current = null;
        setSpinning(false);
      }
    }, 85);
  };

  // ---- derived values ----
  let diff = Math.max(0, SUBMISSION_TARGET - now);
  const cdD = Math.floor(diff / 86400000);
  diff -= cdD * 86400000;
  const cdH = Math.floor(diff / 3600000);
  diff -= cdH * 3600000;
  const cdM = Math.floor(diff / 60000);
  diff -= cdM * 60000;
  const cdS = Math.floor(diff / 1000);

  const cs = solCandlesRef.current;
  const solPrice = fmt(cs[cs.length - 1].c);
  const solChgPct = (cs[cs.length - 1].c / cs[0].c - 1) * 100;
  const solChgTxt = (solChgPct >= 0 ? "+" : "") + solChgPct.toFixed(2) + "%";
  const solChgColor = solChgPct >= 0 ? "#2bffd4" : "#ff4d8d";

  const regCount = Math.round(regCountRef.current);
  const submitted = Math.floor(regCount / 14);

  const reelA = PROBLEMS[reels.a];
  const reelB = INTEGR[reels.b];
  const reelC = TWISTS[reels.c];

  const checkDone = checks.filter(Boolean).length;

  // scrolling ticker (SOL-only)
  const tickerItems = symsRef.current;
  const tickerRow = (keyPrefix: string) =>
    tickerItems.map((o, i) => (
      <span
        key={keyPrefix + i}
        style={{
          display: "inline-flex",
          gap: 7,
          alignItems: "baseline",
          marginRight: 30,
        }}
      >
        <b style={{ fontWeight: 700 }}>{o.s}</b>
        <span>{fmt(o.p)}</span>
        <span style={{ color: o.d >= 0 ? SOL_THEME.up : SOL_THEME.down }}>
          {(o.d >= 0 ? "▲" : "▼") + Math.abs((o.d || 0) * 100).toFixed(2) + "%"}
        </span>
      </span>
    ));

  const mono = "'Space Mono', monospace";
  const comic = "'Comic Neue', cursive";
  const bungee = "'Bungee', cursive";

  return (
    <div
      style={{
        background:
          "radial-gradient(1100px 720px at 50% -12%,#46127f 0%,#1d0839 55%,#0a0518 100%)",
        color: "#fff",
        fontFamily: comic,
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{KEYFRAMES}</style>

      <canvas
        ref={particleRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9998,
          pointerEvents: "none",
        }}
      />

      {/* floating emoji */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {FLOATERS.map((f, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: f.left,
              bottom: -50,
              fontSize: f.size,
              animation: `ph-rise ${f.dur}s linear infinite`,
              animationDelay: `${f.delay}s`,
            }}
          >
            {f.e}
          </span>
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* scrolling ticker */}
        <div
          style={{
            background: "rgba(255,255,255,.05)",
            borderBottom: "1px solid rgba(255,255,255,.12)",
            color: "#2bffd4",
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 13,
            padding: "7px 0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              whiteSpace: "nowrap",
              animation: "ph-marq 32s linear infinite",
              willChange: "transform",
            }}
          >
            {tickerRow("a")}
            {tickerRow("b")}
          </div>
        </div>

        {/* top bar */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            borderBottom: "1px solid rgba(255,255,255,.1)",
          }}
        >
          <div
            style={{
              fontFamily: bungee,
              fontSize: 20,
              background: "linear-gradient(90deg,#2bffd4,#ff4d8d,#ffd700)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🎰 PERPS HACK
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(43,255,212,.5)",
              borderRadius: 12,
              padding: "6px 12px",
              fontFamily: mono,
              fontWeight: 700,
            }}
          >
            <span style={{ color: "#9a86c4", fontSize: 12 }}>SOL</span>
            <span style={{ color: "#fff" }}>{solPrice}</span>
            <span
              style={{
                display: "inline-block",
                animation: "ph-bob 2s ease-in-out infinite",
              }}
            >
              🚀
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
              marginLeft: "auto",
              flexWrap: "wrap",
              alignItems: "center",
              fontFamily: mono,
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: "#9a86c4" }}>
                ⚡ REGISTERED
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#2bffd4" }}>
                {regCount.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#9a86c4" }}>📦 SUBMITTED</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>
                {submitted.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#9a86c4" }}>🤝 SPONSORS</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#ff4d8d" }}>
                3
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "#9a86c4" }}>
                💰 PRIZE POOL
              </div>
              <div
                style={{
                  fontFamily: bungee,
                  fontSize: "clamp(20px,2.4vw,30px)",
                  color: "#ffd700",
                  lineHeight: 1,
                  filter: "drop-shadow(0 0 12px rgba(255,215,0,.55))",
                }}
              >
                $1,000,000
              </div>
            </div>
          </div>
        </div>

        {/* hero band */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "30px 18px 8px",
            display: "flex",
            gap: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 300 }}>
            <div
              style={{
                fontFamily: comic,
                fontWeight: 700,
                fontSize: 18,
                color: "#ffd700",
                animation: "ph-wobble 3s ease-in-out infinite",
                display: "inline-block",
              }}
            >
              ✨ wen perps? NOW perps ✨
            </div>
            <h1
              style={{
                fontFamily: bungee,
                fontSize: "clamp(46px,8vw,104px)",
                lineHeight: 0.9,
                margin: "8px 0 0",
                background:
                  "linear-gradient(180deg,#fff 0%,#2bffd4 36%,#ff4d8d 70%,#ffd700 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 4px 0 rgba(255,77,141,.5))",
                animation: "ph-bob 5s ease-in-out infinite",
              }}
            >
              PERPS HACK
            </h1>
            <p
              style={{
                fontFamily: comic,
                fontWeight: 700,
                fontSize: "clamp(16px,2vw,22px)",
                maxWidth: 560,
                margin: "14px 0 0",
                color: "#e7d6ff",
                lineHeight: 1.4,
              }}
            >
              a Solana hackathon where NUMBER GO UP 📈 ship perps, make
              millions. probably nothing.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                margin: "22px 0 0",
              }}
            >
              <a
                href={registrationUrl}
                style={{
                  textDecoration: "none",
                  fontFamily: bungee,
                  fontSize: 18,
                  color: "#0a0518",
                  background: "linear-gradient(180deg,#ffe666,#ffd700)",
                  border: "none",
                  borderRadius: 40,
                  padding: "16px 32px",
                  cursor: "pointer",
                  boxShadow: "0 0 30px rgba(255,215,0,.6),0 7px 0 #b78f00",
                }}
              >
                🚀 REGISTER
              </a>
              <a
                href="#positions"
                style={{
                  textDecoration: "none",
                  fontFamily: bungee,
                  fontSize: 18,
                  color: "#fff",
                  background: "rgba(255,255,255,.08)",
                  border: "2px solid #2bffd4",
                  borderRadius: 40,
                  padding: "14px 30px",
                  cursor: "pointer",
                  boxShadow: "0 0 30px rgba(43,255,212,.35)",
                }}
              >
                PRIZES ↓
              </a>
            </div>
          </div>
          <div
            style={{
              fontFamily: bungee,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {[
              { v: cdD, l: "DAYS", bd: "#ff4d8d" },
              { v: String(cdH).padStart(2, "0"), l: "HRS", bd: "#2bffd4" },
              { v: String(cdM).padStart(2, "0"), l: "MIN", bd: "#ff4d8d" },
              { v: String(cdS).padStart(2, "0"), l: "SEC", bd: "#ffd700" },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(0,0,0,.45)",
                  border: `2px solid ${b.bd}`,
                  borderRadius: 14,
                  padding: "10px 14px",
                  boxShadow: `0 0 20px ${b.bd}80`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, color: "#ffd700" }}>{b.v}</div>
                <div
                  style={{ fontFamily: mono, fontSize: 10, color: "#e7d6ff" }}
                >
                  {b.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* chart + signups + slot row */}
        <div
          style={{
            maxWidth: 1280,
            margin: "14px auto 0",
            padding: "0 18px",
            display: "grid",
            gridTemplateColumns: "1.9fr 0.95fr 1.05fr",
            gap: 14,
            alignItems: "stretch",
          }}
        >
          {/* SOL/USD candlestick chart */}
          <div
            style={{
              background: "rgba(10,5,24,.6)",
              border: "1px solid rgba(43,255,212,.35)",
              borderRadius: 16,
              padding: 14,
              animation: "ph-glowpulse 5s ease-in-out infinite",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontFamily: bungee, fontSize: 15, color: "#fff" }}>
                SOL-USD
              </span>
              <span
                style={{ fontFamily: bungee, fontSize: 20, color: "#2bffd4" }}
              >
                {solPrice}
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontWeight: 700,
                  fontSize: 13,
                  color: solChgColor,
                }}
              >
                {solChgTxt}
              </span>
              <span
                style={{
                  fontFamily: comic,
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#9a86c4",
                }}
              >
                live SOL price
              </span>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  gap: 6,
                  fontFamily: mono,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    background: "#2bffd4",
                    color: "#0a0518",
                    borderRadius: 7,
                    padding: "3px 8px",
                    animation: "ph-flashpnl 1.4s ease-in-out infinite",
                  }}
                >
                  LIVE
                </span>
                <span
                  style={{
                    background: "rgba(255,255,255,.07)",
                    borderRadius: 7,
                    padding: "3px 8px",
                    color: "#cdbbff",
                  }}
                >
                  1h
                </span>
                <span
                  style={{
                    background: "rgba(255,255,255,.07)",
                    borderRadius: 7,
                    padding: "3px 8px",
                    color: "#cdbbff",
                  }}
                >
                  all
                </span>
              </div>
            </div>
            <canvas
              ref={solChartRef}
              style={{ width: "100%", flex: 1, minHeight: 340, marginTop: 10 }}
            />
            <div
              style={{
                fontFamily: comic,
                fontWeight: 700,
                fontSize: 12,
                color: "#9a86c4",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              SOL/USD candles · green when we send it, red when ser fades. 📈📉
            </div>
          </div>

          {/* signups */}
          <div
            style={{
              background: "rgba(10,5,24,.6)",
              border: "1px solid rgba(255,77,141,.35)",
              borderRadius: 16,
              padding: 12,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontFamily: bungee,
                fontSize: 13,
                color: "#2bffd4",
                marginBottom: 2,
              }}
            >
              🟢 SIGNUPS
            </div>
            <div
              style={{
                fontFamily: comic,
                fontWeight: 700,
                fontSize: 11,
                color: "#9a86c4",
                marginBottom: 8,
              }}
            >
              people aping in · live order flow
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.3fr 1fr 0.8fr",
                fontFamily: mono,
                fontSize: 10,
                color: "#9a86c4",
                padding: "0 6px 5px",
              }}
            >
              <span>BUILDER</span>
              <span>TRACK</span>
              <span style={{ textAlign: "right" }}>TIME</span>
            </div>
            {signupsRef.current.map((s, i) => (
              <div
                key={s.handle + s.time + i}
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "1.3fr 1fr 0.8fr",
                  fontFamily: mono,
                  fontSize: 12,
                  padding: "3.5px 6px",
                  animation: "ph-slidein .3s ease",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 1,
                    left: 0,
                    bottom: 1,
                    width: "100%",
                    background: "#2bffd4",
                    opacity: 0.05,
                    borderRadius: 3,
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    zIndex: 1,
                    color: "#2bffd4",
                    fontWeight: 700,
                  }}
                >
                  {s.handle}
                </span>
                <span style={{ position: "relative", zIndex: 1, color: s.col }}>
                  {s.track}
                </span>
                <span
                  style={{
                    position: "relative",
                    zIndex: 1,
                    textAlign: "right",
                    color: "#6f5f8a",
                    fontSize: 10,
                  }}
                >
                  {s.time}
                </span>
              </div>
            ))}
          </div>

          {/* idea slot machine */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                background: "rgba(10,5,24,.6)",
                border: "1px solid rgba(43,255,212,.3)",
                borderRadius: 16,
                padding: 14,
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                <div
                  style={{ fontFamily: bungee, fontSize: 14, color: "#ffd700" }}
                >
                  🎰 IDEA SLOT
                </div>
                <div
                  style={{
                    fontFamily: comic,
                    fontWeight: 700,
                    fontSize: 11,
                    color: "#9a86c4",
                  }}
                >
                  no idea? pull the lever
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 6,
                  marginTop: 11,
                }}
              >
                {[
                  { label: "PRODUCT", val: reelA, bd: "#2bffd4" },
                  { label: "TWIST", val: reelC, bd: "#ff4d8d" },
                  { label: "INTEGRATION", val: reelB, bd: "#ffd700" },
                ].map((r, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(0,0,0,.45)",
                      border: `2px solid ${r.bd}`,
                      borderRadius: 11,
                      padding: "10px 6px",
                      textAlign: "center",
                      minHeight: 66,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      opacity: spinning ? 0.7 : 1,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: mono,
                        fontSize: 8,
                        color: r.bd,
                        letterSpacing: ".1em",
                      }}
                    >
                      {r.label}
                    </div>
                    <div
                      style={{
                        fontFamily: comic,
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#fff",
                        marginTop: 4,
                        lineHeight: 1.12,
                      }}
                    >
                      {r.val}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={doSpin}
                style={{
                  width: "100%",
                  marginTop: 11,
                  fontFamily: bungee,
                  fontSize: 16,
                  color: "#0a0518",
                  background: "linear-gradient(180deg,#ffe666,#ffd700)",
                  border: "none",
                  borderRadius: 11,
                  padding: 11,
                  cursor: "pointer",
                  boxShadow: "0 0 22px rgba(255,215,0,.5)",
                }}
              >
                🎰 SPIN FOR AN IDEA
              </button>
              <div
                style={{
                  fontFamily: comic,
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#e7d6ff",
                  textAlign: "center",
                  marginTop: 9,
                  lineHeight: 1.4,
                }}
              >
                💡 Build <span style={{ color: "#2bffd4" }}>{reelA}</span>{" "}
                <span style={{ color: "#ff4d8d" }}>{reelC}</span> ·{" "}
                <span style={{ color: "#ffd700" }}>{reelB}</span>
              </div>
            </div>
          </div>
        </div>

        {/* pick a track */}
        <div
          style={{ maxWidth: 1280, margin: "36px auto 0", padding: "0 18px" }}
        >
          <h2
            style={{
              fontFamily: bungee,
              fontSize: "clamp(22px,4vw,34px)",
              color: "#2bffd4",
              margin: "0 0 14px",
            }}
          >
            🛠️ PICK A TRACK
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 14,
            }}
          >
            {TRACKS.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(10,5,24,.6)",
                  border: `1px solid ${t.col}66`,
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{ fontFamily: bungee, fontSize: 15, color: t.col }}
                  >
                    {t.icon} {t.name}
                  </span>
                  <span
                    style={{
                      fontFamily: comic,
                      fontWeight: 700,
                      color: t.col,
                      fontSize: 15,
                    }}
                  >
                    {t.amount}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: comic,
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#e7d6ff",
                    marginTop: 6,
                  }}
                >
                  {t.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* open positions = prizes */}
        <div
          id="positions"
          style={{ maxWidth: 1280, margin: "60px auto 0", padding: "0 18px" }}
        >
          <div style={{ marginBottom: 14 }}>
            <h2
              style={{
                fontFamily: bungee,
                fontSize: "clamp(22px,4vw,38px)",
                color: "#ffd700",
                filter: "drop-shadow(0 0 18px rgba(255,215,0,.5))",
                margin: "0 0 4px",
              }}
            >
              💰 OPEN POSITIONS
            </h2>
            <div
              style={{
                fontFamily: bungee,
                fontSize: "clamp(48px,9vw,108px)",
                lineHeight: 1,
                background: "linear-gradient(90deg,#2bffd4,#ff4d8d,#ffd700)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "ph-hue 6s linear infinite",
              }}
            >
              $1,000,000
            </div>
            <div
              style={{
                fontFamily: comic,
                fontWeight: 700,
                fontSize: 14,
                color: "#9a86c4",
                marginTop: 2,
              }}
            >
              in total prizes · every position pays out 💸
            </div>
          </div>
          <div
            style={{
              background: "rgba(10,5,24,.6)",
              border: "1px solid rgba(255,255,255,.14)",
              borderRadius: 16,
              overflow: "hidden",
              animation: "ph-glowpulse 7s ease-in-out infinite",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1fr 1fr 1.3fr",
                gap: 8,
                padding: "10px 16px",
                fontFamily: mono,
                fontSize: 11,
                color: "#9a86c4",
                borderBottom: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <span>MARKET</span>
              <span>SIDE</span>
              <span>SIZE</span>
              <span style={{ textAlign: "right" }}>
                PNL (it&apos;s the prize)
              </span>
            </div>
            {POSITIONS.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.2fr 1fr 1fr 1.3fr",
                  gap: 8,
                  alignItems: "center",
                  padding: "15px 16px",
                  borderBottom:
                    i < POSITIONS.length - 1
                      ? "1px solid rgba(255,255,255,.06)"
                      : "none",
                  borderLeft: `4px solid ${p.col}`,
                }}
              >
                <div
                  style={{
                    fontFamily: comic,
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#fff",
                  }}
                >
                  {p.title}{" "}
                  <span style={{ color: "#9a86c4", fontSize: 12 }}>
                    {p.note}
                  </span>
                </div>
                <div
                  style={{ fontFamily: mono, fontWeight: 700, color: p.col }}
                >
                  {p.side}
                </div>
                <div style={{ fontFamily: mono, color: "#e7d6ff" }}>
                  {p.size}
                </div>
                <div
                  style={{
                    fontFamily: bungee,
                    fontSize: p.big
                      ? "clamp(20px,3vw,30px)"
                      : "clamp(18px,2.6vw,26px)",
                    color: p.col,
                    textAlign: "right",
                    animation: `ph-flashpnl ${1.6 + i * 0.2}s ease-in-out infinite`,
                  }}
                >
                  {p.pnl}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              fontFamily: comic,
              fontWeight: 700,
              fontSize: 12,
              color: "#9a86c4",
              marginTop: 8,
            }}
          >
            * prize details &amp; judging criteria finalized before kickoff. not
            financial advice (obviously).
          </div>
        </div>

        {/* schedule */}
        <div
          style={{ maxWidth: 1280, margin: "54px auto 0", padding: "0 18px" }}
        >
          <h2
            style={{
              fontFamily: bungee,
              fontSize: "clamp(22px,4.2vw,38px)",
              color: "#2bffd4",
              margin: "0 0 14px",
            }}
          >
            🗓️ SCHEDULE
          </h2>
          <div
            style={{
              background: "rgba(10,5,24,.6)",
              border: "1px solid rgba(43,255,212,.3)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 2.4fr 1fr",
                gap: 8,
                padding: "10px 16px",
                fontFamily: mono,
                fontSize: 11,
                color: "#9a86c4",
                borderBottom: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <span>DATE</span>
              <span>SIDE</span>
              <span>EVENT</span>
              <span style={{ textAlign: "right" }}>STATUS</span>
            </div>
            {SCHEDULE.map((e, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 2.4fr 1fr",
                  gap: 8,
                  alignItems: "center",
                  padding: "13px 16px",
                  borderBottom:
                    i < SCHEDULE.length - 1
                      ? "1px solid rgba(255,255,255,.06)"
                      : "none",
                  fontFamily: mono,
                  background: e.highlight
                    ? "rgba(255,215,0,.07)"
                    : "transparent",
                }}
              >
                <span style={{ color: "#fff", fontWeight: 700 }}>{e.date}</span>
                <span style={{ color: e.sideCol, fontWeight: 700 }}>
                  {e.side}
                </span>
                <span
                  style={{
                    fontFamily: comic,
                    fontWeight: 700,
                    color: e.highlight ? "#fff" : "#e7d6ff",
                  }}
                >
                  {e.event}
                </span>
                <span
                  style={{
                    textAlign: "right",
                    color: e.statusCol,
                    animation: e.highlight
                      ? "ph-flashpnl 1.4s ease-in-out infinite"
                      : undefined,
                  }}
                >
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* checklist + start here / FAQ */}
        <div
          style={{ maxWidth: 1280, margin: "54px auto 0", padding: "0 18px" }}
        >
          <h2
            style={{
              fontFamily: bungee,
              fontSize: "clamp(22px,4vw,38px)",
              color: "#ff4d8d",
              filter: "drop-shadow(0 0 18px rgba(255,77,141,.5))",
              margin: "0 0 14px",
            }}
          >
            🧠 YOU SHOULD KNOW
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: "rgba(10,5,24,.6)",
                border: "1px solid rgba(255,77,141,.35)",
                borderRadius: 16,
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ fontFamily: bungee, fontSize: 15, color: "#ff4d8d" }}
                >
                  ✅ SHIP CHECKLIST
                </div>
                <div
                  style={{
                    fontFamily: comic,
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#ffd700",
                  }}
                >
                  {checkDone}/{CHECK_ITEMS.length}
                </div>
              </div>
              <div
                style={{
                  fontFamily: comic,
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#9a86c4",
                  margin: "2px 0 12px",
                }}
              >
                tick these before you submit 👇
              </div>
              {CHECK_ITEMS.map((label, i) => (
                <div
                  key={i}
                  onClick={() =>
                    setChecks((prev) => {
                      const a = [...prev];
                      a[i] = !a[i];
                      return a;
                    })
                  }
                  style={{
                    display: "flex",
                    gap: 9,
                    alignItems: "flex-start",
                    cursor: "pointer",
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 10,
                    padding: 11,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 15 }}>
                    {checks[i] ? "✅" : "⬜"}
                  </span>
                  <span
                    style={{
                      fontFamily: comic,
                      fontWeight: 700,
                      fontSize: 13,
                      color: checks[i] ? "#2bffd4" : "#e7d6ff",
                      lineHeight: 1.3,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 6,
                  borderTop: "1px dashed rgba(255,255,255,.14)",
                  paddingTop: 12,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px 16px",
                  fontFamily: comic,
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#e7d6ff",
                }}
              >
                <span>🆓 free to enter</span>
                <span>👥 teams up to 4</span>
                <span>🌍 remote</span>
                <span>📅 Jul 8–22</span>
                <span>⚖️ open-source</span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(10,5,24,.6)",
                border: "1px solid rgba(43,255,212,.3)",
                borderRadius: 16,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontFamily: bungee,
                  fontSize: 15,
                  color: "#2bffd4",
                  marginBottom: 10,
                }}
              >
                ⚡ START HERE
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  fontFamily: comic,
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                {[
                  {
                    t: "📚 Solana Docs ↗",
                    c: "#2bffd4",
                    u: "https://solana.com/docs",
                  },
                  {
                    t: "🧩 Starter Templates ↗",
                    c: "#ff4d8d",
                    u: "https://solana.com/developers/templates",
                  },
                  {
                    t: "🤖 Agent Skill ↗",
                    c: "#ffd700",
                    u: "https://solana.com/SKILL.md",
                  },
                  { t: "🔌 Integration Docs ↗", c: "#e7d6ff", u: "#" },
                  { t: "👯 Find a Team ↗", c: "#2bffd4", u: "#" },
                ].map((p, i) => (
                  <a
                    key={i}
                    href={p.u}
                    style={{
                      textDecoration: "none",
                      background: "rgba(255,255,255,.06)",
                      border: `1px solid ${p.c}66`,
                      borderRadius: 20,
                      padding: "7px 14px",
                      color: p.c,
                    }}
                  >
                    {p.t}
                  </a>
                ))}
              </div>
              <div
                style={{
                  fontFamily: bungee,
                  fontSize: 15,
                  color: "#ffd700",
                  marginBottom: 10,
                }}
              >
                ❓ FAQ
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                  fontFamily: comic,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {FAQ.map((f, i) => (
                  <div key={i}>
                    <div style={{ color: "#ffd700" }}>{f.q}</div>
                    <div style={{ color: "#e7d6ff" }}>{f.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* number go up */}
        <div style={{ textAlign: "center", padding: "80px 24px 90px" }}>
          <div
            style={{
              display: "inline-block",
              fontFamily: bungee,
              fontSize: "clamp(34px,8vw,90px)",
              lineHeight: 1.3,
              padding: "0.12em 0.08em 0.22em",
              background: "linear-gradient(90deg,#00f0ff,#ff00e5,#ffd700)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "ph-hue 6s linear infinite",
            }}
          >
            NUMBER GO UP
          </div>
          <a
            href={registrationUrl}
            style={{
              display: "inline-block",
              textDecoration: "none",
              fontFamily: bungee,
              fontSize: 22,
              color: "#0a0518",
              background: "linear-gradient(180deg,#ffe666,#ffd700)",
              border: "none",
              borderRadius: 40,
              padding: "20px 46px",
              marginTop: 26,
              cursor: "pointer",
              boxShadow: "0 0 40px rgba(255,215,0,.7),0 8px 0 #b78f00",
            }}
          >
            🚀 REGISTER
          </a>
        </div>
      </div>
    </div>
  );
}
