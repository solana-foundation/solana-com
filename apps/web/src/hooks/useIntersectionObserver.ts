import { useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = <T extends HTMLElement>(
  options: UseIntersectionObserverOptions = {},
): { ref: React.RefObject<T>; isIntersecting: boolean } => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = "0px",
    triggerOnce = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    // Don't setup observer if already triggered and triggerOnce is true
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible = entry.isIntersecting;

        setIsIntersecting(isVisible);

        if (isVisible && triggerOnce) {
          setHasTriggered(true);
        }
      },
      {
        threshold,
        root,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, root, rootMargin, triggerOnce, hasTriggered]);

  return {
    ref: targetRef,
    isIntersecting: triggerOnce
      ? hasTriggered || isIntersecting
      : isIntersecting,
  };
};
