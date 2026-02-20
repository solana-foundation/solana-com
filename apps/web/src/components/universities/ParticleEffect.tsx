"use client";

import React, { useEffect, useRef } from "react";

interface ParticleEffectProps {
  isHovered: boolean;
  width: number;
  height: number;
}

interface Dot {
  x: number;
  y: number;
  opacity: number;
  targetOpacity: number;
  flickerSpeed: number;
  randomOffset: number;
  size: number;
  baseOpacity: number;
  color: string;
}

export default function ParticleEffect({
  isHovered,
  width,
  height,
}: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef<number>(0);
  const gradientsRef = useRef<{
    green: CanvasGradient | null;
    purple: CanvasGradient | null;
  }>({ green: null, purple: null });
  const isInitializedRef = useRef(false);

  // Initialize dots only once
  useEffect(() => {
    if (isInitializedRef.current) return;

    // Create dot matrix with more randomness
    const spacing = 7; // Increased to reduce dot count by ~10%
    const dots: Dot[] = [];

    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        // Add random offset to position
        const offsetX = (Math.random() - 0.5) * spacing * 0.5;
        const offsetY = (Math.random() - 0.5) * spacing * 0.5;

        // Random chance to skip dots for more organic look
        if (Math.random() > 0.65) continue; // Reduced from 0.7 to skip more dots

        const dotX = x + offsetX;
        const dotY = y + offsetY;

        // Pre-calculate distance-based values
        const topLeftDistance = Math.sqrt(dotX * dotX + dotY * dotY);
        const bottomRightDistance = Math.sqrt(
          (width - dotX) * (width - dotX) + (height - dotY) * (height - dotY),
        );
        const minDistance = Math.min(topLeftDistance, bottomRightDistance);
        const maxDistance = Math.sqrt(width * width + height * height) / 2;
        const distanceRatio = minDistance / maxDistance;
        const randomOffset = Math.random();
        const baseOpacity =
          (1 - distanceRatio) * 0.55 * (0.5 + randomOffset * 0.5); // Increased for brighter particles

        // Pre-determine color
        const colorRatio =
          (dotX + dotY) / (width + height) + (randomOffset - 0.5) * 0.2;
        const color = colorRatio < 0.5 ? "#14F195" : "#9945FF";

        dots.push({
          x: dotX,
          y: dotY,
          opacity: 0,
          targetOpacity: 0,
          flickerSpeed: Math.random() * 2 + 0.5,
          randomOffset,
          size: Math.random() * 1.5 + 0.5,
          baseOpacity,
          color,
        });
      }
    }

    dotsRef.current = dots;
    isInitializedRef.current = true;
  }, [width, height]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Pre-create gradients
    if (!gradientsRef.current.green && width && height) {
      const gradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.8);
      gradient1.addColorStop(0, "#14F19535"); // Increased for brighter background
      gradient1.addColorStop(1, "#14F19500");
      gradientsRef.current.green = gradient1;

      const gradient2 = ctx.createRadialGradient(
        width,
        height,
        0,
        width,
        height,
        width * 0.8,
      );
      gradient2.addColorStop(0, "#9945FF35"); // Increased for brighter background
      gradient2.addColorStop(1, "#9945FF00");
      gradientsRef.current.purple = gradient2;
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      timeRef.current += 0.016; // ~60fps

      // Draw gradient background when hovered using cached gradients
      if (
        isHovered &&
        gradientsRef.current.green &&
        gradientsRef.current.purple
      ) {
        ctx.fillStyle = gradientsRef.current.green;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = gradientsRef.current.purple;
        ctx.fillRect(0, 0, width, height);
      }

      // Only process dots that might be visible
      dotsRef.current.forEach((dot) => {
        // Add subtle flicker effect
        const flicker =
          Math.sin(
            timeRef.current * dot.flickerSpeed + dot.randomOffset * Math.PI * 2,
          ) *
            0.05 +
          0.95; // Reduced flicker range

        // Update target opacity using pre-calculated base opacity
        dot.targetOpacity = isHovered ? dot.baseOpacity * flicker : 0;
        dot.opacity += (dot.targetOpacity - dot.opacity) * 0.08;

        // Skip invisible dots
        if (dot.opacity < 0.01) return;

        // Draw dot with simplified glow
        ctx.globalAlpha = dot.opacity * 0.35; // Increased for brighter glow
        ctx.fillStyle = dot.color;

        // Simple box blur effect instead of gradient
        const blurSize = dot.size * 3;
        ctx.fillRect(
          dot.x - blurSize / 2,
          dot.y - blurSize / 2,
          blurSize,
          blurSize,
        );

        // Draw solid dot on top
        ctx.globalAlpha = Math.min(dot.opacity * 1.0, 0.65); // Increased for brighter dots
        ctx.fillRect(
          dot.x - dot.size / 2,
          dot.y - dot.size / 2,
          dot.size,
          dot.size,
        );
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 0,
        opacity: isHovered ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    />
  );
}
