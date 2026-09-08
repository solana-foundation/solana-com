"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ScrollDirection = "left" | "right";

function getLogicalScrollLeft(carousel: HTMLDivElement, maxScrollLeft: number) {
  return getComputedStyle(carousel).direction === "rtl"
    ? maxScrollLeft + carousel.scrollLeft
    : carousel.scrollLeft;
}

function getNativeScrollLeft(
  carousel: HTMLDivElement,
  logicalScrollLeft: number,
  maxScrollLeft: number,
) {
  return getComputedStyle(carousel).direction === "rtl"
    ? logicalScrollLeft - maxScrollLeft
    : logicalScrollLeft;
}

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
    const logicalScrollLeft = getLogicalScrollLeft(carousel, maxScrollLeft);
    setCanScrollLeft(logicalScrollLeft > 1);
    setCanScrollRight(maxScrollLeft - logicalScrollLeft > 1);
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
    const logicalScrollLeft = getLogicalScrollLeft(carousel, maxScrollLeft);
    const nextScrollLeft = Math.min(
      maxScrollLeft,
      Math.max(
        0,
        logicalScrollLeft + (direction === "left" ? -distance : distance),
      ),
    );

    carousel.scrollTo({
      left: getNativeScrollLeft(carousel, nextScrollLeft, maxScrollLeft),
      behavior: "smooth",
    });
  }, []);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scroll,
  };
}
