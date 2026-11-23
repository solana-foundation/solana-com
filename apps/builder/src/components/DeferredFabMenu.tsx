"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { INTRO_DONE_EVENT } from "./HeroIntro";

// The Solana menu is the largest piece of script on the page and is not part
// of the first screen, so it loads in its own chunk.
const FabMenu = dynamic(() => import("./FabMenu").then((m) => m.FabMenu), {
  ssr: false,
});

/** Longest the menu waits for the intro before loading anyway. */
const MAX_WAIT_MS = 6000;

/**
 * Mounts the Solana menu once the hero intro has played, so its script is not
 * parsed in the middle of it on a slow device. A page with no intro loads it
 * when the browser is idle.
 */
export function DeferredFabMenu({ bundled }: { bundled: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const start = () => setShow(true);

    if (document.querySelector("[data-bldr-intro]")) {
      const timer = window.setTimeout(start, MAX_WAIT_MS);
      window.addEventListener(INTRO_DONE_EVENT, start, { once: true });
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener(INTRO_DONE_EVENT, start);
      };
    }

    if ("requestIdleCallback" in window) {
      const idle = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = setTimeout(start, 1);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return <FabMenu bundled={bundled} />;
}
