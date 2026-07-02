"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { UnicornSceneProps } from "unicornstudio-react";

const MAX_UNICORN_DPI = 2;

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
    return 1.5;
  }

  return Math.min(Math.max(window.devicePixelRatio || 1, 1), MAX_UNICORN_DPI);
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
      dpi={Math.min(Number(props.dpi ?? 1.5), MAX_UNICORN_DPI)}
    />
  );
}
