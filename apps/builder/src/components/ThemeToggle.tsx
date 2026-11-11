"use client";

import { useEffect, useState } from "react";
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY, type BldrTheme } from "./theme";

function readTheme(): BldrTheme {
  return document.documentElement.getAttribute(THEME_ATTRIBUTE) === "white"
    ? "white"
    : "black";
}

export function ThemeToggle({
  labels,
}: {
  labels: { toWhite: string; toBlack: string };
}) {
  const [theme, setTheme] = useState<BldrTheme>("black");

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggle = () => {
    const next: BldrTheme = readTheme() === "black" ? "white" : "black";
    document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the switch still applies.
    }
    setTheme(next);
  };

  const label = theme === "black" ? labels.toWhite : labels.toBlack;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex size-10 shrink-0 items-center justify-center border border-ink/25 text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bldr-purple"
    >
      {/* Half-filled square: the two palettes side by side. */}
      <span
        aria-hidden
        className="block size-4 border border-current bg-[linear-gradient(90deg,currentColor_50%,transparent_50%)]"
      />
    </button>
  );
}
