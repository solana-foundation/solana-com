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

  const gradient = sourceContext.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#140d1d");
  gradient.addColorStop(0.35, "#2c1247");
  gradient.addColorStop(0.7, "#0f1f34");
  gradient.addColorStop(1, "#08141a");

  sourceContext.fillStyle = gradient;
  sourceContext.fillRect(0, 0, width, height);

  const orb = sourceContext.createRadialGradient(
    width * 0.32,
    height * 0.3,
    10,
    width * 0.32,
    height * 0.3,
    width * 0.4,
  );
  orb.addColorStop(0, "rgba(201,255,124,0.55)");
  orb.addColorStop(0.25, "rgba(89,184,254,0.24)");
  orb.addColorStop(1, "rgba(171,102,253,0)");
  sourceContext.fillStyle = orb;
  sourceContext.fillRect(0, 0, width, height);

  sourceContext.strokeStyle = "rgba(231,210,249,0.08)";
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
    <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="h-full w-full opacity-80"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,18,0.06),rgba(10,7,18,0.5))]" />
    </div>
  );
}
