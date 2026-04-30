"use client";

import { useEffect, useRef, useCallback } from "react";

/* ──────────────────────────────────────────────────────────
   CipherGrid — animated character grid for hero background
   ────────────────────────────────────────────────────────── */

const CIPHER_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(){}[]|;:,.<>?/~`";

export function CipherGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cellSize = 28;
    const cols = Math.ceil(w / cellSize);
    const rows = Math.ceil(h / cellSize);
    const time = Date.now() * 0.001;

    ctx.clearRect(0, 0, w, h);
    ctx.font = "13px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize + cellSize / 2;
        const y = row * cellSize + cellSize / 2;

        // Wave function determines visibility
        const wave =
          Math.sin(col * 0.3 + time * 0.5) *
          Math.cos(row * 0.25 + time * 0.3) *
          Math.sin((col + row) * 0.15 + time * 0.2);

        const opacity = Math.max(0, wave * 0.5 + 0.18);
        if (opacity < 0.03) continue;

        // Color based on position quadrant
        const isRight = col > cols / 2;
        const isBottom = row > rows / 2;
        let color: string;
        if (!isRight && !isBottom) color = `rgba(171,171,186,${opacity})`;
        else if (isRight && !isBottom) color = `rgba(153,69,255,${opacity})`;
        else if (!isRight && isBottom) color = `rgba(20,241,149,${opacity})`;
        else color = `rgba(240,55,165,${opacity})`;

        ctx.fillStyle = color;

        // Cycle through cipher characters
        const charIndex =
          Math.floor(
            Math.sin(col * 7.3 + row * 13.7 + time * 2) * CIPHER_CHARS.length +
              CIPHER_CHARS.length,
          ) % CIPHER_CHARS.length;
        ctx.fillText(CIPHER_CHARS[charIndex], x, y);
      }
    }
  }, []);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      draw();
      animRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 1 }}
    />
  );
}

/* ──────────────────────────────────────────────────────────
   PrivacyDecor — animated redacted data streams
   ────────────────────────────────────────────────────────── */

export function PrivacyDecor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const time = Date.now() * 0.001;
    ctx.clearRect(0, 0, w, h);

    // Draw redacted text bars streaming across
    const rows = 18;
    const rowH = h / rows;

    for (let i = 0; i < rows; i++) {
      const y = i * rowH;
      const speed = 0.3 + (Math.sin(i * 1.7) * 0.5 + 0.5) * 0.7;
      const offset = ((time * speed * 200 + i * 137) % (w * 2)) - w * 0.5;

      // Each row has several "redacted" blocks
      const blocks = 3 + Math.floor(Math.sin(i * 2.3) * 2 + 2);
      for (let b = 0; b < blocks; b++) {
        const blockW = 40 + Math.sin(i * 3.1 + b * 7.7) * 60 + 60;
        const gap = 20 + Math.sin(i * 1.3 + b * 4.1) * 30 + 30;
        const x = offset + b * (blockW + gap);

        if (x + blockW < 0 || x > w) continue;

        // Color cycling between purple, green, pink
        const colorPhase = (i + b) % 3;
        let r: number, g: number, bl: number;
        if (colorPhase === 0) {
          r = 153;
          g = 69;
          bl = 255;
        } else if (colorPhase === 1) {
          r = 20;
          g = 241;
          bl = 149;
        } else {
          r = 240;
          g = 55;
          bl = 165;
        }

        // Fade based on vertical position (stronger in middle)
        const vertFade = 1 - Math.abs(i / rows - 0.5) * 2;
        const alpha =
          (0.12 + vertFade * 0.28) * (0.7 + Math.sin(time * 2 + i + b) * 0.3);

        ctx.fillStyle = `rgba(${r},${g},${bl},${alpha})`;

        const barH = rowH * 0.35;
        const barY = y + (rowH - barH) / 2;
        ctx.beginPath();
        ctx.roundRect(x, barY, blockW, barH, barH / 2);
        ctx.fill();
      }
    }
  }, []);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      draw();
      animRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <div className="relative pointer-events-none h-[160px] xl:h-[300px] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-black to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-black to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
