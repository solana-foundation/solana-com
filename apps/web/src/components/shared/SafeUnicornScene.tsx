"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { UnicornSceneProps } from "unicornstudio-react";

const MIN_UNICORN_DPI = 1;
const MAX_UNICORN_DPI = 2;
const DEFAULT_UNICORN_DPI = 1.5;

function clampUnicornDpi(dpi: number): number {
  if (Number.isNaN(dpi)) {
    return DEFAULT_UNICORN_DPI;
  }

  return Math.min(Math.max(dpi, MIN_UNICORN_DPI), MAX_UNICORN_DPI);
}

const UnicornScene = dynamic<UnicornSceneProps>(
  () => import("unicornstudio-react").then((mod) => mod.default),
  {
    ssr: false,
  },
);

function canUseWebGL() {
  if (typeof document === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function getSafeUnicornDpi() {
  if (typeof window === "undefined") {
    return DEFAULT_UNICORN_DPI;
  }

  return clampUnicornDpi(window.devicePixelRatio || MIN_UNICORN_DPI);
}

export function SafeUnicornScene({
  fallback = null,
  ...props
}: UnicornSceneProps & {
  fallback?: ReactNode;
}) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(canUseWebGL());
  }, []);

  if (!isSupported) {
    return fallback;
  }

  return (
    <UnicornScene
      {...props}
      dpi={clampUnicornDpi(Number(props.dpi ?? DEFAULT_UNICORN_DPI))}
    />
  );
}
