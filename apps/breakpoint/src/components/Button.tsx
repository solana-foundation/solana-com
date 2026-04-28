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
  variant?: "primary" | "secondary" | "inline";
  href?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  arrow?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
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
  disabled = false,
  type = "button",
  target,
  rel,
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  const [runKey, setRunKey] = useState(0);

  const scrambleDuration = 400;
  const displayLabel = useScramble(label, scrambleDuration, runKey);
  const isDisabled = disabled || (!href && !onClick && type !== "submit");

  const handleHover = () => {
    setRunKey((k) => k + 1);
  };

  const baseClasses =
    "bp26-button group/button relative inline-flex items-center justify-center font-mono text-button uppercase transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4";
  const sizeClasses = variant === "inline" ? "gap-3" : "h-10 gap-3 px-5";

  const variantClasses = {
    primary: isDisabled
      ? "bg-neutral-600 text-neutral-100"
      : "bg-neutral-50 text-neutral-900 hover:bg-neutral-200",
    secondary: isDisabled
      ? "border border-neutral-300 bg-neutral-600 text-neutral-200"
      : "border border-stroke-tertiary bg-transparent text-white hover:bg-neutral-700",
    inline: isDisabled
      ? "text-neutral-300"
      : "text-white hover:text-neutral-200",
  }[variant];

  const wipeClass =
    inView && variant === "primary" && !isDisabled ? "bp-block-wipe" : "";
  const blinkClass = inView && variant === "secondary" ? "bp-icon-blink" : "";

  const classes =
    `${baseClasses} ${sizeClasses} ${variantClasses} ${blinkClass} ${className}`.trim();
  const trailing =
    iconRight ??
    (arrow ? (
      <span className="inline-flex size-[12px] items-center justify-center">
        <ArrowUpRightIcon />
      </span>
    ) : null);

  const inner = (
    <>
      {variant === "primary" && !isDisabled && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 bg-neutral-50 transition-colors group-hover/button:bg-neutral-200 ${wipeClass}`}
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
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? (rel ?? "noreferrer") : rel}
        {...commonProps}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      {...commonProps}
    >
      {inner}
    </button>
  );
}
