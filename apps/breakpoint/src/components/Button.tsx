"use client";

import React from "react";

interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  href?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  label,
  variant = "primary",
  href,
  iconLeft,
  iconRight,
  onClick,
  className = "",
}: ButtonProps) {
  const baseClasses =
    "inline-flex h-[40px] items-center justify-center gap-2xs px-5 font-mono text-[0.9375rem] font-medium uppercase tracking-[0.09em] leading-none transition-colors duration-200";

  const variantClasses =
    variant === "primary"
      ? "bg-white text-black hover:bg-[#e7d2f9]"
      : "border border-white/18 bg-black/40 text-white hover:border-white/40 hover:bg-white/[0.06]";

  const classes = `${baseClasses} ${variantClasses} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classes}>
        {iconLeft && <span>{iconLeft}</span>}
        {label}
        {iconRight && <span>{iconRight}</span>}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {iconLeft && <span>{iconLeft}</span>}
      {label}
      {iconRight && <span>{iconRight}</span>}
    </button>
  );
}
