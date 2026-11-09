"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  followLegacyAnchor,
  loadLegacyAnchors,
} from "@/lib/docs/legacy-anchors";

function storage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Sends an old #anchor to the section that holds its content now
 * (lib/docs/legacy-anchors.ts): on load, on every hash change and after
 * client-side navigation. Renders nothing; the map is fetched only when a
 * hash matches no element.
 */
export function LegacyAnchors() {
  const pathname = usePathname();
  useEffect(() => {
    const follow = () => {
      void followLegacyAnchor({
        location: window.location,
        document,
        history: window.history,
        load: loadLegacyAnchors,
        storage: storage(),
      });
    };
    follow();
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, [pathname]);
  return null;
}
