import { useEffect, useRef } from "react";

export interface UseMouseFollowerOptions {
  offsetX?: number;
  offsetY?: number;
  className?: string;
}

export const useMouseFollower = <T extends HTMLElement, I extends HTMLElement>(
  options: UseMouseFollowerOptions,
): { ref: React.RefObject<T | null>; imageRef: React.RefObject<I | null> } => {
  const { offsetX = 0, offsetY = 0, className = "" } = options;

  const nodeRef = useRef<T | null>(null);
  const imageRef = useRef<I | null>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const node = nodeRef.current;
    const image = imageRef.current;

    if (!node || !image) return;

    image.style.position = "fixed";
    image.style.visibility = "visible";
    image.style.pointerEvents = "none";
    image.style.opacity = "0";
    image.style.transition = "opacity 0.2s ease-out";
    image.style.display = "block";
    image.style.left = "0";
    image.style.top = "0";
    if (className) {
      image.className = className;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.left + rect.width &&
        e.clientY >= rect.top &&
        e.clientY <= rect.top + rect.height;

      if (isInside) {
        isVisibleRef.current = true;
        image.style.transform = `translate(${e.clientX + offsetX}px, ${e.clientY + offsetY}px)`;
        image.style.opacity = "1";
      } else {
        isVisibleRef.current = false;
        image.style.opacity = "0";
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      if (image) {
        image.style.opacity = "0";
      }
    };

    node.addEventListener("mousemove", handleMouseMove);
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      node.removeEventListener("mousemove", handleMouseMove);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [offsetX, offsetY, className]);

  return {
    ref: nodeRef,
    imageRef,
  };
};
