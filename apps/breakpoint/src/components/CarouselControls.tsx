"use client";

import React from "react";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  labelPrefix?: string;
}

export default function CarouselControls({
  onPrev,
  onNext,
  className = "",
  labelPrefix,
}: CarouselControlsProps) {
  const previousLabel = labelPrefix
    ? `Previous ${labelPrefix}`
    : "Previous item";
  const nextLabel = labelPrefix ? `Next ${labelPrefix}` : "Next item";

  return (
    <div className={`flex gap-2xs ${className}`.trim()}>
      <button
        type="button"
        onClick={onPrev}
        aria-label={previousLabel}
        className="flex size-[48px] items-center justify-center border border-neutral-700 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg
          aria-hidden="true"
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1L1 8M1 8L8 15M1 8H19"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label={nextLabel}
        className="flex size-[48px] items-center justify-center border border-neutral-700 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg
          aria-hidden="true"
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 1L19 8M19 8L12 15M19 8H1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
