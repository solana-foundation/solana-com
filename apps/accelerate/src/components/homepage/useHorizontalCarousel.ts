"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ScrollDirection = "left" | "right";

export function useHorizontalCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const carousel = scrollRef.current;
    if (!carousel) return;

    const maxScrollLeft = Math.max(
      0,
      carousel.scrollWidth - carousel.clientWidth,
    );
    setCanScrollLeft(carousel.scrollLeft > 1);
    setCanScrollRight(maxScrollLeft - carousel.scrollLeft > 1);
  }, []);

  useEffect(() => {
    const carousel = scrollRef.current;
    if (!carousel) return;

    updateScrollState();
    carousel.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateScrollState);
    resizeObserver?.observe(carousel);

    return () => {
      carousel.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      resizeObserver?.disconnect();
    };
  }, [updateScrollState]);

  const scroll = useCallback((direction: ScrollDirection) => {
    const carousel = scrollRef.current;
    if (!carousel) return;

    const firstCard = carousel.firstElementChild;
    const cardWidth =
      firstCard instanceof HTMLElement ? firstCard.offsetWidth : 0;
    const styles = getComputedStyle(carousel);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    const distance = cardWidth + gap || carousel.clientWidth * 0.8;
    const maxScrollLeft = Math.max(
      0,
      carousel.scrollWidth - carousel.clientWidth,
    );
    const nextScrollLeft = Math.min(
      maxScrollLeft,
      Math.max(
        0,
        carousel.scrollLeft + (direction === "left" ? -distance : distance),
      ),
    );

    carousel.scrollTo({ left: nextScrollLeft, behavior: "smooth" });
  }, []);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scroll,
  };
}
