"use client";

import { useEffect, useRef, useState } from "react";
import GlitchOverlay from "@/components/GlitchOverlay";

const GLITCH_MS = 650;
const HERO_BG = "/img/sponsors/sponsors-header-bg.webp";

function HeroBackgroundVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={HERO_BG}
        alt=""
        aria-hidden="true"
        width={799}
        height={1200}
        className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.86] contrast-[1.16] grayscale"
      />
      <div className="absolute inset-0 bg-purple opacity-70 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.72)_20%,rgba(0,0,0,0.28)_58%,rgba(0,0,0,0.08)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0)_38%,rgba(0,0,0,0.76)_100%)]" />
    </div>
  );
}

export default function SponsorsHeroBackground() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
      if (event.matches) {
        setIsGlitching(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const triggerGlitch = () => {
    if (prefersReducedMotion || isGlitching) return;

    setIsGlitching(true);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setIsGlitching(false);
      timeoutRef.current = null;
    }, GLITCH_MS);
  };

  useEffect(() => {
    triggerGlitch();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
    // Run only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      onMouseEnter={triggerGlitch}
      onMouseMove={triggerGlitch}
      onTouchStart={triggerGlitch}
    >
      <div
        className={`absolute inset-0 ${
          isGlitching && !prefersReducedMotion ? "bp-glitch-jitter" : ""
        }`}
      >
        <HeroBackgroundVisual />
      </div>

      <GlitchOverlay active={isGlitching && !prefersReducedMotion} size="lg">
        <HeroBackgroundVisual />
      </GlitchOverlay>
    </div>
  );
}
