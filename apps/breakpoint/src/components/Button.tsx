"use client";

import React from "react";

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

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 8L8 2M8 2H3.2M8 2V6.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
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
  const baseClasses =
    "inline-flex h-[40px] items-center justify-center gap-2xs px-5 font-mono text-[14px] font-bold uppercase tracking-[0.08em] leading-[0.9] transition-colors duration-200";

  const variantClasses =
    variant === "primary"
      ? "bg-white text-black hover:bg-[#e7d2f9]"
      : "border border-white/18 bg-black/40 text-white hover:border-white/40 hover:bg-white/[0.06]";

  const classes = `${baseClasses} ${variantClasses} ${className}`.trim();
  const trailing = iconRight ?? (arrow ? <ArrowUpRight /> : null);

  const inner = (
    <>
      {iconLeft && <span>{iconLeft}</span>}
      {label}
      {trailing && <span>{trailing}</span>}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {inner}
    </button>
  );
}
