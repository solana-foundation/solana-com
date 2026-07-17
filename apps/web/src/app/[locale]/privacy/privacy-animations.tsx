"use client";

import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────
   DotField — radial wave dot canvas for the hero background
   ────────────────────────────────────────────────────────── */

export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let t = 0;
    const SPACING = 22;

    function size() {
      if (!c || !ctx) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame() {
      if (!ctx) return;
      t += 0.012;
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * SPACING + 6;
          const y = j * SPACING + 6;
          const d = Math.hypot(x - w * 0.78, y - h * 0.55);
          const wave = Math.sin(d * 0.012 - t) * 0.5 + 0.5;
          const a = Math.max(0, 0.05 + wave * 0.32 - d * 0.0008);
          const sparkle = Math.random() < 0.0005;
          ctx.fillStyle = sparkle
            ? "#14F195"
            : `rgba(255,255,255,${a.toFixed(3)})`;
          const r = sparkle ? 1.6 : 1;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }
      }
      raf = requestAnimationFrame(frame);
    }

    size();
    window.addEventListener("resize", size);
    frame();

    return () => {
      window.removeEventListener("resize", size);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="pp-dots" />;
}

/* ──────────────────────────────────────────────────────────
   LiveFeed — schematic console feed in hero side panel
   ────────────────────────────────────────────────────────── */

type FeedRow = {
  ts: string;
  label: string;
  value: string;
  cls: "pp-c-green" | "pp-c-purple" | "pp-c-ok";
};

const SAMPLES: Array<[string, string, FeedRow["cls"]]> = [
  ["ct.transfer", "▒▒▒▒▒", "pp-c-green"],
  ["zk.proof", "verified", "pp-c-green"],
  ["mpc.session", "join 4/4", "pp-c-purple"],
  ["ct.balance", "▒▒▒▒", "pp-c-ok"],
  ["fhe.cipher", "▒▒▒▒▒▒", "pp-c-purple"],
  ["slot", "↑", "pp-c-green"],
];

const INITIAL: FeedRow[] = [
  {
    ts: "14:02:13",
    label: "ct.balance",
    value: "▒▒▒▒",
    cls: "pp-c-ok",
  },
  {
    ts: "14:02:13",
    label: "mpc.session",
    value: "join 4/4",
    cls: "pp-c-purple",
  },
  {
    ts: "14:02:12",
    label: "slot",
    value: "↑ 387,442,911",
    cls: "pp-c-green",
  },
  {
    ts: "14:02:12",
    label: "zk.proof",
    value: "verified",
    cls: "pp-c-green",
  },
  {
    ts: "14:02:11",
    label: "ct.transfer",
    value: "▒▒▒▒▒",
    cls: "pp-c-green",
  },
  {
    ts: "14:02:11",
    label: "slot",
    value: "↑ 387,442,910",
    cls: "pp-c-green",
  },
];

function pad(x: number) {
  return String(x).padStart(2, "0");
}

export function LiveFeed() {
  const [rows, setRows] = useState<FeedRow[]>(INITIAL);
  const slotRef = useRef(442911);

  useEffect(() => {
    const id = window.setInterval(() => {
      const d = new Date();
      const ts = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      const sample = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
      if (!sample) return;
      let value = sample[1];
      if (sample[0] === "slot") {
        slotRef.current += 1;
        const n = String(slotRef.current);
        value = `↑ 387,${n.slice(0, 3)},${n.slice(3)}`;
      }
      const row: FeedRow = {
        ts,
        label: sample[0],
        value,
        cls: sample[2],
      };
      setRows((prev) => [row, ...prev].slice(0, 6));
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="pp-live-feed">
      {rows.map((row, i) => (
        <div className="pp-row-l" key={`${row.ts}-${i}`}>
          <span className="pp-ts">{row.ts}</span>{" "}
          <span className="pp-c-ok">{row.label}</span>{" "}
          <span className={row.cls}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}
