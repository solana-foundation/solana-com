"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Link } from "@workspace/i18n/routing";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import { isRelativeHref } from "@/lib/links";

const GLYPHS =
  "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function useScramble(label: string, durationMs: number, runKey: number) {
  const [out, setOut] = useState(label);
  useEffect(() => {
    if (runKey === 0) {
      setOut(label);
      return;
    }
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setOut(label);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    let frame = 0;
    const loop = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / durationMs);
      const settled = Math.floor(p * label.length);
      let s = "";
      for (let i = 0; i < label.length; i++) {
        const ch = label[i]!;
        s +=
          ch === " " || i < settled ? ch : GLYPHS[(frame + i) % GLYPHS.length]!;
      }
      setOut(s);
      frame += 1;
      if (p < 1) raf = requestAnimationFrame(loop);
      else setOut(label);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [label, durationMs, runKey]);
  return out;
}

interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  href?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  arrow?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  label,
  variant = "primary",
  href,
  iconLeft,
  iconRight,
  arrow,
  onClick,
  className = "",
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  const [runKey, setRunKey] = useState(0);
  const primed = useRef(false);

  useEffect(() => {
    if (!inView || primed.current) return;
    primed.current = true;
    setRunKey(1);
  }, [inView]);

  const scrambleDuration = variant === "primary" ? 1500 : 400;
  const displayLabel = useScramble(label, scrambleDuration, runKey);
  const isDisabled = !href && !onClick;

  const handleHover = () => {
    if (variant === "secondary") setRunKey((k) => k + 1);
  };

  const baseClasses =
    "relative inline-flex h-[40px] items-center justify-center gap-2xs overflow-hidden px-5 font-mono !text-[14px] !font-bold uppercase !leading-[0.9] !tracking-[0.08em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  const variantClasses =
    variant === "primary"
      ? "bg-white text-black hover:bg-[#e7d2f9]"
      : "border border-white/18 bg-black/40 text-white hover:border-white/40 hover:bg-white/[0.06]";

  const wipeClass = inView && variant === "primary" ? "bp-block-wipe" : "";
  const blinkClass = inView && variant === "secondary" ? "bp-icon-blink" : "";

  const classes =
    `${baseClasses} ${variantClasses} ${blinkClass} ${className}`.trim();
  const trailing =
    iconRight ??
    (arrow ? (
      <span className="inline-flex size-[12px] items-center justify-center">
        <ArrowUpRightIcon variant="stroke" />
      </span>
    ) : null);

  const inner = (
    <>
      {/* Block-wipe background for primary */}
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 bg-white ${wipeClass}`}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2xs">
        {iconLeft && <span aria-hidden="true">{iconLeft}</span>}
        <span aria-hidden="true">{displayLabel}</span>
        {trailing && (
          <span
            aria-hidden="true"
            className={inView && variant === "primary" ? "bp-icon-blink" : ""}
          >
            {trailing}
          </span>
        )}
      </span>
    </>
  );

  const commonProps = {
    ref: ref as unknown as React.Ref<never>,
    "aria-disabled": isDisabled || undefined,
    "aria-label": label,
    className: `${classes} ${isDisabled ? "pointer-events-none" : ""}`.trim(),
    onMouseEnter: handleHover,
    onFocus: handleHover,
    tabIndex: isDisabled ? -1 : undefined,
  };

  if (href) {
    if (isRelativeHref(href)) {
      return (
        <Link href={href} {...commonProps}>
          {inner}
        </Link>
      );
    }

    return (
      <a href={href} {...commonProps}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} {...commonProps}>
      {inner}
    </button>
  );
}
