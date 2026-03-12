"use client";

import { useEffect, useRef } from "react";
import { WaterEffect } from "@/lib/water";

function paintSource(width: number, height: number) {
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  const sourceContext = sourceCanvas.getContext("2d");

  if (!sourceContext) {
    return null;
  }

  // Deep purple-black diagonal gradient
  const gradient = sourceContext.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0b0614");
  gradient.addColorStop(0.3, "#1a0a35");
  gradient.addColorStop(0.6, "#2c1247");
  gradient.addColorStop(1, "#0b0614");

  sourceContext.fillStyle = gradient;
  sourceContext.fillRect(0, 0, width, height);

  // Purple glow orb — concentrated, not diffuse
  const orb = sourceContext.createRadialGradient(
    width * 0.35,
    height * 0.25,
    10,
    width * 0.35,
    height * 0.25,
    width * 0.38,
  );
  orb.addColorStop(0, "rgba(98,58,196,0.5)");
  orb.addColorStop(0.3, "rgba(123,79,214,0.2)");
  orb.addColorStop(0.6, "rgba(68,44,110,0.08)");
  orb.addColorStop(1, "rgba(11,6,20,0)");
  sourceContext.fillStyle = orb;
  sourceContext.fillRect(0, 0, width, height);

  // Second subtle orb — lower right
  const orb2 = sourceContext.createRadialGradient(
    width * 0.72,
    height * 0.7,
    8,
    width * 0.72,
    height * 0.7,
    width * 0.28,
  );
  orb2.addColorStop(0, "rgba(98,58,196,0.25)");
  orb2.addColorStop(0.5, "rgba(68,44,110,0.06)");
  orb2.addColorStop(1, "rgba(11,6,20,0)");
  sourceContext.fillStyle = orb2;
  sourceContext.fillRect(0, 0, width, height);

  // Subtle purple grid lines
  sourceContext.strokeStyle = "rgba(236,214,249,0.04)";
  sourceContext.lineWidth = 1;
  for (let x = 0; x < width; x += 48) {
    sourceContext.beginPath();
    sourceContext.moveTo(x, 0);
    sourceContext.lineTo(x, height);
    sourceContext.stroke();
  }
  for (let y = 0; y < height; y += 48) {
    sourceContext.beginPath();
    sourceContext.moveTo(0, y);
    sourceContext.lineTo(width, y);
    sourceContext.stroke();
  }

  return sourceContext.getImageData(0, 0, width, height);
}

export function WaterHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      return;
    }

    let frame = 0;
    let animationId = 0;
    let effect: WaterEffect | null = null;
    let sourceData: ImageData | null = null;
    let bounds = canvas.getBoundingClientRect();

    const render = () => {
      if (!effect || !sourceData) {
        return;
      }

      frame += 1;
      if (frame % 55 === 0) {
        const x = Math.floor(effect.width * (0.2 + Math.random() * 0.6));
        const y = Math.floor(effect.height * (0.2 + Math.random() * 0.6));
        effect.ripple(x, y, 18, 340);
      }

      effect.update();
      const layer = new ImageData(
        new Uint8ClampedArray(sourceData.data),
        sourceData.width,
        sourceData.height,
      );
      context.putImageData(effect.render(layer), 0, 0);
      animationId = window.requestAnimationFrame(render);
    };

    const resize = () => {
      bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(bounds.width * dpr));
      const height = Math.max(1, Math.floor(bounds.height * dpr));

      canvas.width = width;
      canvas.height = height;

      effect = new WaterEffect(width, height, {
        damping: 9,
        pressure: 360,
        wakeLength: 16,
        wakeWidth: 4,
      });
      sourceData = paintSource(width, height);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!effect || !bounds.width || !bounds.height) {
        return;
      }

      const inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!inside) {
        return;
      }

      const scaleX = canvas.width / bounds.width;
      const scaleY = canvas.height / bounds.height;
      const x = Math.floor((event.clientX - bounds.left) * scaleX);
      const y = Math.floor((event.clientY - bounds.top) * scaleY);
      effect.disturb(x, y, 220);
    };

    resize();
    animationId = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="h-full w-full opacity-70"
      />
      {/* Top-center purple glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(98,58,196,0.12),transparent)]" />
      {/* Bottom fade to black */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(5,5,5,0.7)_100%)]" />
    </div>
  );
}
