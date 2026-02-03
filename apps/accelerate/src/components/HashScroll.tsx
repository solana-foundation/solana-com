"use client";

import { useEffect } from "react";

const HASH_SCROLL_RETRY_MS = 200;

function scrollToHashTarget() {
  const hash = window.location.hash;
  if (!hash) {
    return;
  }

  const id = decodeURIComponent(hash.slice(1));
  const target = document.getElementById(id);
  if (!target) {
    return;
  }

  const root = document.documentElement;
  const body = document.body;
  const previousRootBehavior = root.style.scrollBehavior;
  const previousBodyBehavior = body.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";
  target.scrollIntoView({ block: "start" });
  root.style.scrollBehavior = previousRootBehavior;
  body.style.scrollBehavior = previousBodyBehavior;
}

export function HashScroll() {
  useEffect(() => {
    if (!window.location.hash) {
      return;
    }

    const rafId = window.requestAnimationFrame(scrollToHashTarget);
    const retryId = window.setTimeout(scrollToHashTarget, HASH_SCROLL_RETRY_MS);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(retryId);
    };
  }, []);

  return null;
}
